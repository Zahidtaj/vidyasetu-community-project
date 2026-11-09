from functools import wraps
from flask import abort, flash, redirect, url_for, request
from flask_login import current_user

def role_required(*roles):
    """Decorator to enforce role-based access control (RBAC)."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated:
                return redirect(url_for('auth.login', next=request.url))
            if current_user.role not in roles:
                flash("Access denied: You do not have permission to view this page.", "error")
                abort(403)
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def student_required(f):
    return role_required('student')(f)

def teacher_required(f):
    return role_required('teacher')(f)

def admin_required(f):
    return role_required('admin')(f)

def teacher_or_admin_required(f):
    return role_required('teacher', 'admin')(f)
