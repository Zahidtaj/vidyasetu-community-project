import os
from flask import Blueprint, render_template, redirect, url_for, flash, request, abort, current_app
from flask_login import login_required, current_user
from app.decorators import teacher_required
from app.models import (
    db, 
    Class, 
    Subject, 
    Chapter, 
    Resource, 
    ResourceCategory, 
    Quiz, 
    Question, 
    QuizOption, 
    QuizAttempt, 
    TeacherAssignment
)
from app.forms import ResourceUploadForm, QuizCreateForm
from app.utils import save_secure_resource_file, sanitize_url, log_activity

teacher_bp = Blueprint('teacher', __name__, url_prefix='/teacher')

@teacher_bp.route('/dashboard')
@login_required
@teacher_required
def dashboard():
    assignments = current_user.teacher_assignments.all()
    assigned_subject_ids = [a.subject_id for a in assignments]

    my_resources = current_user.uploaded_resources.all()
    total_uploads = len(my_resources)
    approved_count = sum(1 for r in my_resources if r.status == 'approved')
    pending_count = sum(1 for r in my_resources if r.status == 'pending')
    rejected_count = sum(1 for r in my_resources if r.status == 'rejected')

    # Quizzes created by this teacher
    my_quizzes = current_user.created_quizzes.all()
    total_quizzes = len(my_quizzes)

    # Total student attempts on this teacher's quizzes
    quiz_ids = [q.id for q in my_quizzes]
    recent_attempts = QuizAttempt.query.filter(
        QuizAttempt.quiz_id.in_(quiz_ids),
        QuizAttempt.is_completed == True
    ).order_by(QuizAttempt.completed_at.desc()).limit(8).all() if quiz_ids else []

    return render_template(
        'teacher/dashboard.html',
        assignments=assignments,
        total_uploads=total_uploads,
        approved_count=approved_count,
        pending_count=pending_count,
        rejected_count=rejected_count,
        total_quizzes=total_quizzes,
        recent_attempts=recent_attempts
    )

@teacher_bp.route('/resources')
@login_required
@teacher_required
def my_resources():
    resources = current_user.uploaded_resources.order_by(Resource.created_at.desc()).all()
    return render_template('teacher/my_resources.html', resources=resources)

@teacher_bp.route('/upload', methods=['GET', 'POST'])
@login_required
@teacher_required
def upload_resource():
    form = ResourceUploadForm()
    
    # Populate dynamic select choices
    classes = Class.query.order_by(Class.id).all()
    subjects = Subject.query.order_by(Subject.name).all()
    categories = ResourceCategory.query.order_by(ResourceCategory.id).all()
    
    form.class_id.choices = [(c.id, c.name) for c in classes]
    form.subject_id.choices = [(s.id, f"{s.name} ({s.class_level.name})") for s in subjects]
    form.category_id.choices = [(cat.id, cat.name) for cat in categories]
    
    # Optional chapters for chosen subject
    all_chapters = Chapter.query.order_by(Chapter.chapter_number).all()
    form.chapter_id.choices = [(0, 'General (No specific chapter)')] + [(ch.id, f"Ch {ch.chapter_number}: {ch.title}") for ch in all_chapters]

    if form.validate_on_submit():
        res_type = form.resource_type.data
        file_rel_path = None
        video_link = None

        if res_type == 'pdf':
            if not form.pdf_file.data:
                flash("Please select a PDF file to upload.", "error")
                return render_template('teacher/upload_resource.html', form=form)
            file_rel_path, error = save_secure_resource_file(form.pdf_file.data)
            if error:
                flash(error, "error")
                return render_template('teacher/upload_resource.html', form=form)
        elif res_type == 'video':
            if not form.video_url.data:
                flash("Please enter an educational video URL.", "error")
                return render_template('teacher/upload_resource.html', form=form)
            video_link = sanitize_url(form.video_url.data)
            if not video_link:
                flash("Invalid video URL format. Please enter a valid HTTP/HTTPS link.", "error")
                return render_template('teacher/upload_resource.html', form=form)

        chap_id = form.chapter_id.data if form.chapter_id.data != 0 else None

        new_resource = Resource(
            title=form.title.data.strip(),
            title_kn=form.title_kn.data.strip() if form.title_kn.data else None,
            description=form.description.data.strip() if form.description.data else None,
            class_id=form.class_id.data,
            subject_id=form.subject_id.data,
            chapter_id=chap_id,
            category_id=form.category_id.data,
            resource_type=res_type,
            file_path=file_rel_path,
            video_url=video_link,
            language=form.language.data,
            status='pending',  # Awaiting administrator approval
            uploader_id=current_user.id
        )

        db.session.add(new_resource)
        db.session.commit()
        log_activity(current_user.id, "RESOURCE_UPLOADED", f"Uploaded resource '{new_resource.title}' (Status: Pending)")
        
        flash("Resource successfully submitted! It will appear in the library once approved by the administrator.", "success")
        return redirect(url_for('teacher.my_resources'))

    return render_template('teacher/upload_resource.html', form=form)

@teacher_bp.route('/resources/<int:resource_id>/delete', methods=['POST'])
@login_required
@teacher_required
def delete_resource(resource_id):
    resource = Resource.query.get_or_404(resource_id)
    if resource.uploader_id != current_user.id:
        abort(403)

    # Clean up physical file if it exists
    if resource.file_path:
        full_path = os.path.join(current_app.config['UPLOAD_FOLDER'], os.path.basename(resource.file_path))
        if os.path.exists(full_path):
            try:
                os.remove(full_path)
            except OSError:
                pass

    title = resource.title
    db.session.delete(resource)
    db.session.commit()
    log_activity(current_user.id, "RESOURCE_DELETED", f"Deleted resource '{title}'")
    flash(f"Resource '{title}' has been deleted.", "info")
    return redirect(url_for('teacher.my_resources'))

@teacher_bp.route('/quizzes')
@login_required
@teacher_required
def quizzes():
    my_quizzes = current_user.created_quizzes.order_by(Quiz.created_at.desc()).all()
    return render_template('teacher/quizzes.html', quizzes=my_quizzes)

@teacher_bp.route('/quiz/create', methods=['GET', 'POST'])
@login_required
@teacher_required
def create_quiz():
    form = QuizCreateForm()
    classes = Class.query.order_by(Class.id).all()
    subjects = Subject.query.order_by(Subject.name).all()
    
    form.class_id.choices = [(c.id, c.name) for c in classes]
    form.subject_id.choices = [(s.id, f"{s.name} ({s.class_level.name})") for s in subjects]
    
    all_chapters = Chapter.query.order_by(Chapter.chapter_number).all()
    form.chapter_id.choices = [(0, 'All Chapters / General')] + [(ch.id, f"Ch {ch.chapter_number}: {ch.title}") for ch in all_chapters]

    if form.validate_on_submit():
        chap_id = form.chapter_id.data if form.chapter_id.data != 0 else None
        
        quiz = Quiz(
            title=form.title.data.strip(),
            title_kn=form.title_kn.data.strip() if form.title_kn.data else None,
            instructions=form.instructions.data.strip() if form.instructions.data else None,
            class_id=form.class_id.data,
            subject_id=form.subject_id.data,
            chapter_id=chap_id,
            duration_minutes=form.duration_minutes.data,
            teacher_id=current_user.id,
            is_published=True
        )
        db.session.add(quiz)
        db.session.commit()
        log_activity(current_user.id, "QUIZ_CREATED", f"Created quiz '{quiz.title}'")
        flash("Quiz created successfully! Now add questions.", "success")
        return redirect(url_for('teacher.manage_questions', quiz_id=quiz.id))

    return render_template('teacher/create_quiz.html', form=form)

@teacher_bp.route('/quiz/<int:quiz_id>/questions', methods=['GET', 'POST'])
@login_required
@teacher_required
def manage_questions(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    if quiz.teacher_id != current_user.id and not current_user.is_admin:
        abort(403)

    if request.method == 'POST':
        q_text = request.form.get('question_text', '').strip()
        q_text_kn = request.form.get('question_text_kn', '').strip()
        explanation = request.form.get('explanation', '').strip()
        correct_idx = request.form.get('correct_option', type=int)

        opt1 = request.form.get('opt1', '').strip()
        opt2 = request.form.get('opt2', '').strip()
        opt3 = request.form.get('opt3', '').strip()
        opt4 = request.form.get('opt4', '').strip()

        if not q_text or not opt1 or not opt2 or not opt3 or not opt4 or correct_idx is None:
            flash("Please enter question text, all four options, and select the correct option.", "error")
        else:
            q_count = quiz.questions.count()
            question = Question(
                quiz_id=quiz.id,
                question_text=q_text,
                question_text_kn=q_text_kn or None,
                explanation=explanation or None,
                marks=1,
                order_num=q_count + 1
            )
            db.session.add(question)
            db.session.flush()

            options_data = [opt1, opt2, opt3, opt4]
            for idx, text in enumerate(options_data):
                opt = QuizOption(
                    question_id=question.id,
                    option_text=text,
                    is_correct=(idx == correct_idx),
                    order_num=idx + 1
                )
                db.session.add(opt)

            db.session.commit()
            log_activity(current_user.id, "QUESTION_ADDED", f"Added question to quiz ID {quiz.id}")
            flash("Question added successfully!", "success")
            return redirect(url_for('teacher.manage_questions', quiz_id=quiz.id))

    questions = quiz.questions.all()
    return render_template('teacher/manage_questions.html', quiz=quiz, questions=questions)

@teacher_bp.route('/student-performance')
@login_required
@teacher_required
def student_performance():
    my_quizzes = current_user.created_quizzes.all()
    quiz_ids = [q.id for q in my_quizzes]
    
    attempts = QuizAttempt.query.filter(
        QuizAttempt.quiz_id.in_(quiz_ids),
        QuizAttempt.is_completed == True
    ).order_by(QuizAttempt.completed_at.desc()).all() if quiz_ids else []

    return render_template('teacher/student_performance.html', attempts=attempts, quizzes=my_quizzes)
