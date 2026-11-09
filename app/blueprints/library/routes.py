import os
from flask import Blueprint, render_template, abort, redirect, url_for, flash, request, send_file, current_app, jsonify
from flask_login import current_user, login_required
from app.models import db, Class, Subject, Chapter, Resource, ResourceCategory, Bookmark, ChapterProgress, Quiz
from app.utils import log_activity
from datetime import datetime

library_bp = Blueprint('library', __name__, url_prefix='/library')

@library_bp.route('/')
def index():
    query_text = request.args.get('q', '').strip()
    class_id = request.args.get('class_id', type=int)
    subject_id = request.args.get('subject_id', type=int)
    category_id = request.args.get('category_id', type=int)
    language = request.args.get('language', '').strip()
    resource_type = request.args.get('type', '').strip()

    # Base query: Only approved resources are visible in the public library
    q = Resource.query.filter_by(status='approved')

    if class_id:
        q = q.filter(Resource.class_id == class_id)
    elif current_user.is_authenticated and current_user.is_student and current_user.class_id:
        # Default to student's class if no class is explicitly filtered
        pass

    if subject_id:
        q = q.filter(Resource.subject_id == subject_id)

    if category_id:
        q = q.filter(Resource.category_id == category_id)

    if language:
        q = q.filter(Resource.language == language)

    if resource_type:
        q = q.filter(Resource.resource_type == resource_type)

    if query_text:
        term = f"%{query_text}%"
        q = q.filter(
            (Resource.title.ilike(term)) |
            (Resource.title_kn.ilike(term)) |
            (Resource.description.ilike(term))
        )

    resources = q.order_by(Resource.created_at.desc()).all()
    
    classes = Class.query.order_by(Class.id).all()
    subjects = Subject.query.order_by(Subject.name).all()
    categories = ResourceCategory.query.order_by(ResourceCategory.id).all()

    # Pre-fetch student bookmarks for instant bookmark badge checking
    user_bookmarks = set()
    if current_user.is_authenticated:
        user_bookmarks = {b.resource_id for b in current_user.bookmarks.all()}

    return render_template(
        'library/index.html',
        resources=resources,
        classes=classes,
        subjects=subjects,
        categories=categories,
        selected_class_id=class_id,
        selected_subject_id=subject_id,
        selected_category_id=category_id,
        selected_language=language,
        selected_type=resource_type,
        query_text=query_text,
        user_bookmarks=user_bookmarks
    )

@library_bp.route('/subject/<int:subject_id>')
def subject_detail(subject_id):
    subject = Subject.query.get_or_404(subject_id)
    chapters = subject.chapters.all()
    resources = Resource.query.filter_by(subject_id=subject_id, status='approved').order_by(Resource.created_at.desc()).all()
    quizzes = Quiz.query.filter_by(subject_id=subject_id, is_published=True).all()

    user_bookmarks = set()
    completed_chapter_ids = set()
    if current_user.is_authenticated and current_user.is_student:
        user_bookmarks = {b.resource_id for b in current_user.bookmarks.all()}
        completed_chapter_ids = {
            cp.chapter_id for cp in ChapterProgress.query.filter_by(student_id=current_user.id, is_completed=True).all()
        }

    return render_template(
        'library/subject.html',
        subject=subject,
        chapters=chapters,
        resources=resources,
        quizzes=quizzes,
        user_bookmarks=user_bookmarks,
        completed_chapter_ids=completed_chapter_ids
    )

@library_bp.route('/chapter/<int:chapter_id>')
def chapter_detail(chapter_id):
    chapter = Chapter.query.get_or_404(chapter_id)
    resources = Resource.query.filter_by(chapter_id=chapter_id, status='approved').all()
    quizzes = Quiz.query.filter_by(chapter_id=chapter_id, is_published=True).all()

    is_completed = False
    if current_user.is_authenticated and current_user.is_student:
        progress = ChapterProgress.query.filter_by(student_id=current_user.id, chapter_id=chapter_id).first()
        is_completed = progress.is_completed if progress else False

    user_bookmarks = set()
    if current_user.is_authenticated:
        user_bookmarks = {b.resource_id for b in current_user.bookmarks.all()}

    return render_template(
        'library/chapter.html',
        chapter=chapter,
        resources=resources,
        quizzes=quizzes,
        is_completed=is_completed,
        user_bookmarks=user_bookmarks
    )

@library_bp.route('/resource/<int:resource_id>')
def view_resource(resource_id):
    resource = Resource.query.get_or_404(resource_id)

    # Permission check: unapproved resources can only be viewed by uploader or admin
    if resource.status != 'approved':
        if not current_user.is_authenticated or (not current_user.is_admin and current_user.id != resource.uploader_id):
            abort(403)

    # Increment view count
    resource.views_count += 1
    db.session.commit()

    is_bookmarked = False
    if current_user.is_authenticated:
        is_bookmarked = Bookmark.query.filter_by(user_id=current_user.id, resource_id=resource.id).first() is not None

    return render_template(
        'library/view_resource.html',
        resource=resource,
        is_bookmarked=is_bookmarked
    )

@library_bp.route('/resource/<int:resource_id>/download')
@login_required
def download_resource(resource_id):
    resource = Resource.query.get_or_404(resource_id)
    if resource.status != 'approved' and not current_user.is_admin and current_user.id != resource.uploader_id:
        abort(403)

    if resource.resource_type != 'pdf' or not resource.file_path:
        flash("This resource is not a downloadable file.", "error")
        return redirect(url_for('library.view_resource', resource_id=resource.id))

    upload_folder = current_app.config['UPLOAD_FOLDER']
    filename = os.path.basename(resource.file_path)
    full_path = os.path.join(upload_folder, filename)

    if not os.path.exists(full_path):
        flash("File not found on storage server.", "error")
        return redirect(url_for('library.view_resource', resource_id=resource.id))

    resource.downloads_count += 1
    db.session.commit()
    log_activity(current_user.id, "RESOURCE_DOWNLOAD", f"Downloaded resource ID {resource.id}: {resource.title}")

    return send_file(
        full_path,
        as_attachment=True,
        download_name=f"{resource.title.replace(' ', '_')}.pdf"
    )

@library_bp.route('/resource/<int:resource_id>/bookmark', methods=['POST'])
@login_required
def toggle_bookmark(resource_id):
    resource = Resource.query.get_or_404(resource_id)
    bookmark = Bookmark.query.filter_by(user_id=current_user.id, resource_id=resource.id).first()

    if bookmark:
        db.session.delete(bookmark)
        db.session.commit()
        bookmarked = False
        message = "Removed from bookmarks."
    else:
        new_bm = Bookmark(user_id=current_user.id, resource_id=resource.id)
        db.session.add(new_bm)
        db.session.commit()
        bookmarked = True
        message = "Saved to bookmarks!"

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.is_json:
        return jsonify({'success': True, 'bookmarked': bookmarked, 'message': message})

    flash(message, "success")
    return redirect(request.referrer or url_for('library.view_resource', resource_id=resource.id))

@library_bp.route('/chapter/<int:chapter_id>/toggle-complete', methods=['POST'])
@login_required
def toggle_chapter_complete(chapter_id):
    if not current_user.is_student:
        abort(403)

    chapter = Chapter.query.get_or_404(chapter_id)
    progress = ChapterProgress.query.filter_by(student_id=current_user.id, chapter_id=chapter.id).first()

    if progress and progress.is_completed:
        progress.is_completed = False
        progress.completed_at = None
        message = f"Marked '{chapter.title}' as incomplete."
    else:
        if not progress:
            progress = ChapterProgress(student_id=current_user.id, chapter_id=chapter.id)
            db.session.add(progress)
        progress.is_completed = True
        progress.completed_at = datetime.utcnow()
        message = f"Well done! Chapter '{chapter.title}' marked as completed."

    db.session.commit()
    log_activity(current_user.id, "CHAPTER_PROGRESS_UPDATED", f"Chapter {chapter.id} completed: {progress.is_completed}")
    flash(message, "success")
    return redirect(request.referrer or url_for('library.chapter_detail', chapter_id=chapter.id))
