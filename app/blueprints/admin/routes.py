from flask import Blueprint, render_template, redirect, url_for, flash, request, abort
from flask_login import login_required, current_user
from app.decorators import admin_required
from app.models import (
    db, 
    User, 
    Class, 
    Subject, 
    Chapter, 
    Resource, 
    Quiz, 
    Announcement, 
    ActivityLog,
    TeacherAssignment
)
from app.forms import UserForm, ResourceApprovalForm, AnnouncementForm
from app.utils import log_activity

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/dashboard')
@login_required
@admin_required
def dashboard():
    total_students = User.query.filter_by(role='student').count()
    total_teachers = User.query.filter_by(role='teacher').count()
    total_classes = Class.query.count()
    total_subjects = Subject.query.count()
    total_resources = Resource.query.filter_by(status='approved').count()
    pending_approvals = Resource.query.filter_by(status='pending').count()
    total_quizzes = Quiz.query.count()

    recent_logs = ActivityLog.query.order_by(ActivityLog.timestamp.desc()).limit(10).all()
    pending_list = Resource.query.filter_by(status='pending').order_by(Resource.created_at.desc()).limit(5).all()

    return render_template(
        'admin/dashboard.html',
        total_students=total_students,
        total_teachers=total_teachers,
        total_classes=total_classes,
        total_subjects=total_subjects,
        total_resources=total_resources,
        pending_approvals=pending_approvals,
        total_quizzes=total_quizzes,
        recent_logs=recent_logs,
        pending_list=pending_list
    )

@admin_bp.route('/approvals')
@login_required
@admin_required
def approvals():
    pending_resources = Resource.query.filter_by(status='pending').order_by(Resource.created_at.desc()).all()
    history = Resource.query.filter(Resource.status.in_(['approved', 'rejected'])).order_by(Resource.updated_at.desc()).limit(15).all()
    return render_template('admin/approvals.html', pending_resources=pending_resources, history=history)

@admin_bp.route('/approvals/<int:resource_id>', methods=['POST'])
@login_required
@admin_required
def process_approval(resource_id):
    resource = Resource.query.get_or_404(resource_id)
    decision = request.form.get('decision')
    reason = request.form.get('rejection_reason', '').strip()

    if decision == 'approve':
        resource.status = 'approved'
        resource.rejection_reason = None
        db.session.commit()
        log_activity(current_user.id, "RESOURCE_APPROVED", f"Approved resource ID {resource.id}: {resource.title}")
        flash(f"Resource '{resource.title}' has been APPROVED and is now live in the student library!", "success")
    elif decision == 'reject':
        if not reason:
            flash("Please provide a rejection reason so the teacher can correct the material.", "error")
            return redirect(url_for('admin.approvals'))
        resource.status = 'rejected'
        resource.rejection_reason = reason
        db.session.commit()
        log_activity(current_user.id, "RESOURCE_REJECTED", f"Rejected resource ID {resource.id}: {reason}")
        flash(f"Resource '{resource.title}' was marked as REJECTED. The teacher will be notified.", "info")

    return redirect(url_for('admin.approvals'))

@admin_bp.route('/users')
@login_required
@admin_required
def users():
    role_filter = request.args.get('role', '').strip()
    q = User.query
    if role_filter:
        q = q.filter_by(role=role_filter)
    user_list = q.order_by(User.created_at.desc()).all()
    return render_template('admin/users.html', users=user_list, selected_role=role_filter)

@admin_bp.route('/users/create', methods=['GET', 'POST'])
@login_required
@admin_required
def create_user():
    form = UserForm()
    classes = Class.query.order_by(Class.id).all()
    form.class_id.choices = [(0, 'None (For Teacher / Admin)')] + [(c.id, c.name) for c in classes]

    if form.validate_on_submit():
        if not form.password.data:
            flash("Password is required when creating a new user account.", "error")
            return render_template('admin/user_form.html', form=form, is_edit=False)

        existing = User.query.filter_by(email=form.email.data.strip().lower()).first()
        if existing:
            flash("An account with this email address already exists.", "error")
            return render_template('admin/user_form.html', form=form, is_edit=False)

        c_id = form.class_id.data if form.class_id.data != 0 else None

        user = User(
            email=form.email.data.strip().lower(),
            full_name=form.full_name.data.strip(),
            role=form.role.data,
            class_id=c_id,
            phone=form.phone.data.strip() if form.phone.data else None,
            is_active=form.is_active.data
        )
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()

        log_activity(current_user.id, "USER_CREATED", f"Created account {user.email} ({user.role})")
        flash(f"Account for {user.full_name} ({user.role}) created successfully!", "success")
        return redirect(url_for('admin.users'))

    return render_template('admin/user_form.html', form=form, is_edit=False)

@admin_bp.route('/users/<int:user_id>/toggle-status', methods=['POST'])
@login_required
@admin_required
def toggle_user_status(user_id):
    if user_id == current_user.id:
        flash("You cannot deactivate your own administrative account.", "error")
        return redirect(url_for('admin.users'))

    user = User.query.get_or_404(user_id)
    user.is_active = not user.is_active
    db.session.commit()
    
    status_str = "activated" if user.is_active else "deactivated"
    log_activity(current_user.id, "USER_STATUS_TOGGLED", f"User {user.email} {status_str}")
    flash(f"Account for {user.full_name} has been {status_str}.", "info")
    return redirect(url_for('admin.users'))

@admin_bp.route('/curriculum')
@login_required
@admin_required
def curriculum():
    classes = Class.query.order_by(Class.id).all()
    return render_template('admin/curriculum.html', classes=classes)

@admin_bp.route('/curriculum/class/add', methods=['POST'])
@login_required
@admin_required
def add_class():
    name = request.form.get('name', '').strip()
    name_kn = request.form.get('name_kn', '').strip()
    desc = request.form.get('description', '').strip()

    if not name or not name_kn:
        flash("Class name in English and Kannada are required.", "error")
    else:
        new_class = Class(name=name, name_kn=name_kn, description=desc or None)
        db.session.add(new_class)
        db.session.commit()
        log_activity(current_user.id, "CLASS_ADDED", f"Added {name}")
        flash(f"Class '{name}' added successfully!", "success")

    return redirect(url_for('admin.curriculum'))

@admin_bp.route('/curriculum/subject/add', methods=['POST'])
@login_required
@admin_required
def add_subject():
    class_id = request.form.get('class_id', type=int)
    name = request.form.get('name', '').strip()
    name_kn = request.form.get('name_kn', '').strip()
    code = request.form.get('code', '').strip()

    if not class_id or not name or not name_kn:
        flash("Class, Subject Name (EN), and Subject Name (KN) are required.", "error")
    else:
        new_sub = Subject(class_id=class_id, name=name, name_kn=name_kn, code=code or None)
        db.session.add(new_sub)
        db.session.commit()
        log_activity(current_user.id, "SUBJECT_ADDED", f"Added {name} to Class ID {class_id}")
        flash(f"Subject '{name}' added successfully!", "success")

    return redirect(url_for('admin.curriculum'))

@admin_bp.route('/curriculum/chapter/add', methods=['POST'])
@login_required
@admin_required
def add_chapter():
    subject_id = request.form.get('subject_id', type=int)
    chapter_num = request.form.get('chapter_number', type=int)
    title = request.form.get('title', '').strip()
    title_kn = request.form.get('title_kn', '').strip()

    if not subject_id or not chapter_num or not title or not title_kn:
        flash("Subject, chapter number, and titles in English and Kannada are required.", "error")
    else:
        new_ch = Chapter(subject_id=subject_id, chapter_number=chapter_num, title=title, title_kn=title_kn)
        db.session.add(new_ch)
        db.session.commit()
        log_activity(current_user.id, "CHAPTER_ADDED", f"Added Ch {chapter_num} to Subject ID {subject_id}")
        flash(f"Chapter '{title}' added successfully!", "success")

    return redirect(url_for('admin.curriculum'))

@admin_bp.route('/announcements', methods=['GET', 'POST'])
@login_required
@admin_required
def announcements():
    form = AnnouncementForm()
    if form.validate_on_submit():
        ann = Announcement(
            title=form.title.data.strip(),
            title_kn=form.title_kn.data.strip() if form.title_kn.data else None,
            message=form.message.data.strip(),
            message_kn=form.message_kn.data.strip() if form.message_kn.data else None,
            target_role=form.target_role.data,
            is_active=form.is_active.data,
            creator_id=current_user.id
        )
        db.session.add(ann)
        db.session.commit()
        log_activity(current_user.id, "ANNOUNCEMENT_POSTED", f"Posted: {ann.title}")
        flash("School announcement posted successfully!", "success")
        return redirect(url_for('admin.announcements'))

    all_announcements = Announcement.query.order_by(Announcement.created_at.desc()).all()
    return render_template('admin/announcements.html', form=form, announcements=all_announcements)

@admin_bp.route('/activity-logs')
@login_required
@admin_required
def activity_logs():
    logs = ActivityLog.query.order_by(ActivityLog.timestamp.desc()).limit(100).all()
    return render_template('admin/activity_logs.html', logs=logs)
