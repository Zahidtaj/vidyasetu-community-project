from flask import Blueprint, render_template
from flask_login import login_required, current_user
from app.decorators import student_required
from app.models import (
    db, 
    Class, 
    Subject, 
    Chapter, 
    Resource, 
    Quiz, 
    QuizAttempt, 
    Bookmark, 
    ChapterProgress, 
    Announcement
)

student_bp = Blueprint('student', __name__, url_prefix='/student')

@student_bp.route('/dashboard')
@login_required
@student_required
def dashboard():
    student_class = current_user.assigned_class
    class_id = student_class.id if student_class else None

    # Retrieve available subjects for the student's assigned class
    if class_id:
        subjects = Subject.query.filter_by(class_id=class_id).all()
        total_resources = Resource.query.filter_by(class_id=class_id, status='approved').count()
        recent_resources = Resource.query.filter_by(class_id=class_id, status='approved').order_by(Resource.created_at.desc()).limit(5).all()
        total_chapters = Chapter.query.join(Subject).filter(Subject.class_id == class_id).count()
    else:
        subjects = Subject.query.all()
        total_resources = Resource.query.filter_by(status='approved').count()
        recent_resources = Resource.query.filter_by(status='approved').order_by(Resource.created_at.desc()).limit(5).all()
        total_chapters = Chapter.query.count()

    # Calculate real quiz performance metrics
    attempts = QuizAttempt.query.filter_by(student_id=current_user.id, is_completed=True).all()
    completed_quizzes_count = len(attempts)
    
    if completed_quizzes_count > 0:
        avg_score = round(sum(a.percentage for a in attempts) / completed_quizzes_count, 1)
        best_score = round(max(a.percentage for a in attempts), 1)
    else:
        avg_score = 0.0
        best_score = 0.0

    # Calculate chapter completion progress
    completed_chapters_count = ChapterProgress.query.filter_by(student_id=current_user.id, is_completed=True).count()
    progress_percentage = round((completed_chapters_count / total_chapters * 100), 1) if total_chapters > 0 else 0.0

    # Retrieve bookmarks
    bookmarks = current_user.bookmarks.order_by(Bookmark.created_at.desc()).limit(6).all()
    bookmarked_resources = [b.resource for b in bookmarks if b.resource.status == 'approved']

    # Retrieve active school announcements
    announcements = Announcement.query.filter(
        Announcement.is_active == True,
        Announcement.target_role.in_(['all', 'student'])
    ).order_by(Announcement.created_at.desc()).limit(3).all()

    return render_template(
        'student/dashboard.html',
        student_class=student_class,
        subjects=subjects,
        total_resources=total_resources,
        recent_resources=recent_resources,
        completed_quizzes_count=completed_quizzes_count,
        avg_score=avg_score,
        best_score=best_score,
        completed_chapters_count=completed_chapters_count,
        total_chapters=total_chapters,
        progress_percentage=progress_percentage,
        bookmarked_resources=bookmarked_resources,
        announcements=announcements
    )

@student_bp.route('/progress')
@login_required
@student_required
def progress():
    student_class = current_user.assigned_class
    class_id = student_class.id if student_class else None

    subjects = Subject.query.filter_by(class_id=class_id).all() if class_id else Subject.query.all()
    
    # Subject-wise chapter completion progress
    subject_progress_data = []
    for sub in subjects:
        total_chaps = sub.chapters.count()
        completed_chaps = ChapterProgress.query.join(Chapter).filter(
            Chapter.subject_id == sub.id,
            ChapterProgress.student_id == current_user.id,
            ChapterProgress.is_completed == True
        ).count()
        pct = round((completed_chaps / total_chaps * 100), 1) if total_chaps > 0 else 0.0
        subject_progress_data.append({
            'subject': sub,
            'total_chapters': total_chaps,
            'completed_chapters': completed_chaps,
            'percentage': pct
        })

    # Quiz history
    attempts = QuizAttempt.query.filter_by(
        student_id=current_user.id, 
        is_completed=True
    ).order_by(QuizAttempt.completed_at.desc()).all()

    return render_template(
        'student/progress.html',
        subject_progress=subject_progress_data,
        quiz_attempts=attempts
    )

@student_bp.route('/bookmarks')
@login_required
@student_required
def bookmarks():
    user_bms = current_user.bookmarks.order_by(Bookmark.created_at.desc()).all()
    resources = [b.resource for b in user_bms if b.resource.status == 'approved']
    return render_template('student/bookmarks.html', resources=resources)
