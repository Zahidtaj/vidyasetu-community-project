from datetime import datetime, timedelta
from flask import Blueprint, render_template, redirect, url_for, flash, request, abort
from flask_login import login_required, current_user
from app.models import (
    db, 
    Quiz, 
    Question, 
    QuizOption, 
    QuizAttempt, 
    StudentAnswer, 
    Class, 
    Subject
)
from app.utils import log_activity

quiz_bp = Blueprint('quiz', __name__, url_prefix='/quiz')

@quiz_bp.route('/list')
def list_quizzes():
    class_id = request.args.get('class_id', type=int)
    subject_id = request.args.get('subject_id', type=int)

    q = Quiz.query.filter_by(is_published=True)

    if class_id:
        q = q.filter_by(class_id=class_id)
    elif current_user.is_authenticated and current_user.is_student and current_user.class_id:
        q = q.filter_by(class_id=current_user.class_id)

    if subject_id:
        q = q.filter_by(subject_id=subject_id)

    quizzes = q.order_by(Quiz.created_at.desc()).all()
    classes = Class.query.order_by(Class.id).all()
    subjects = Subject.query.order_by(Subject.name).all()

    # Preload user's completed attempts
    completed_attempt_map = {}
    if current_user.is_authenticated and current_user.is_student:
        attempts = QuizAttempt.query.filter_by(student_id=current_user.id, is_completed=True).all()
        for a in attempts:
            if a.quiz_id not in completed_attempt_map or a.percentage > completed_attempt_map[a.quiz_id].percentage:
                completed_attempt_map[a.quiz_id] = a

    return render_template(
        'quiz/list.html',
        quizzes=quizzes,
        classes=classes,
        subjects=subjects,
        selected_class_id=class_id,
        selected_subject_id=subject_id,
        completed_attempt_map=completed_attempt_map
    )

@quiz_bp.route('/<int:quiz_id>/start')
@login_required
def start_quiz(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    if not quiz.is_published and not current_user.is_admin and current_user.id != quiz.teacher_id:
        abort(403)

    previous_attempts = []
    if current_user.is_student:
        previous_attempts = QuizAttempt.query.filter_by(
            quiz_id=quiz.id, 
            student_id=current_user.id, 
            is_completed=True
        ).order_by(QuizAttempt.completed_at.desc()).all()

    return render_template('quiz/start.html', quiz=quiz, previous_attempts=previous_attempts)

@quiz_bp.route('/<int:quiz_id>/attempt')
@login_required
def attempt_quiz(quiz_id):
    if not current_user.is_student:
        flash("Only students can attempt quizzes.", "info")
        return redirect(url_for('quiz.start_quiz', quiz_id=quiz_id))

    quiz = Quiz.query.get_or_404(quiz_id)
    if not quiz.is_published:
        abort(403)

    questions = quiz.questions.all()
    if not questions:
        flash("This quiz currently has no questions.", "error")
        return redirect(url_for('quiz.list_quizzes'))

    # Check for an active incomplete attempt or create a new one
    attempt = QuizAttempt.query.filter_by(
        quiz_id=quiz.id,
        student_id=current_user.id,
        is_completed=False
    ).first()

    now = datetime.utcnow()
    if not attempt:
        attempt = QuizAttempt(
            quiz_id=quiz.id,
            student_id=current_user.id,
            started_at=now,
            max_score=len(questions)
        )
        db.session.add(attempt)
        db.session.commit()
    else:
        # Check if attempt time expired
        deadline = attempt.started_at + timedelta(minutes=quiz.duration_minutes, seconds=30)
        if now > deadline:
            attempt.is_completed = True
            attempt.completed_at = now
            db.session.commit()
            flash("Your previous attempt session expired.", "warning")
            return redirect(url_for('quiz.start_quiz', quiz_id=quiz.id))

    time_remaining_seconds = max(0, int((attempt.started_at + timedelta(minutes=quiz.duration_minutes) - now).total_seconds()))

    return render_template(
        'quiz/attempt.html',
        quiz=quiz,
        questions=questions,
        attempt=attempt,
        time_remaining_seconds=time_remaining_seconds
    )

@quiz_bp.route('/<int:quiz_id>/submit', methods=['POST'])
@login_required
def submit_quiz(quiz_id):
    if not current_user.is_student:
        abort(403)

    quiz = Quiz.query.get_or_404(quiz_id)
    attempt = QuizAttempt.query.filter_by(
        quiz_id=quiz.id,
        student_id=current_user.id,
        is_completed=False
    ).first()

    if not attempt:
        flash("No active attempt found. Please start a new quiz attempt.", "error")
        return redirect(url_for('quiz.start_quiz', quiz_id=quiz.id))

    questions = quiz.questions.all()
    total_score = 0
    max_score = len(questions)

    # Server-side answer validation
    for q in questions:
        selected_opt_id = request.form.get(f'question_{q.id}', type=int)
        is_correct = False

        if selected_opt_id:
            option = QuizOption.query.filter_by(id=selected_opt_id, question_id=q.id).first()
            if option and option.is_correct:
                is_correct = True
                total_score += q.marks

        student_ans = StudentAnswer(
            attempt_id=attempt.id,
            question_id=q.id,
            selected_option_id=selected_opt_id,
            is_correct=is_correct
        )
        db.session.add(student_ans)

    # Complete the attempt
    attempt.score = total_score
    attempt.max_score = max_score
    attempt.percentage = round((total_score / max_score * 100), 1) if max_score > 0 else 0.0
    attempt.is_completed = True
    attempt.completed_at = datetime.utcnow()

    db.session.commit()
    log_activity(current_user.id, "QUIZ_COMPLETED", f"Completed Quiz '{quiz.title}': {attempt.score}/{attempt.max_score} ({attempt.percentage}%)")

    flash("Quiz submitted successfully! Here are your detailed results.", "success")
    return redirect(url_for('quiz.view_result', attempt_id=attempt.id))

@quiz_bp.route('/attempt/<int:attempt_id>/result')
@login_required
def view_result(attempt_id):
    attempt = QuizAttempt.query.get_or_404(attempt_id)

    # Security check: Only the student who took it, or teacher/admin can view results
    if current_user.is_student and attempt.student_id != current_user.id:
        abort(403)

    answers = attempt.answers.all()
    return render_template('quiz/result.html', attempt=attempt, answers=answers)
