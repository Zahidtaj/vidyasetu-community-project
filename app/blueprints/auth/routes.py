from flask import Blueprint, render_template, redirect, url_for, flash, request, session
from flask_login import login_user, logout_user, login_required, current_user
from app.models import db, User
from app.forms import LoginForm, ChangePasswordForm
from app.utils import log_activity
from app.translations import get_text

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        if current_user.is_admin:
            return redirect(url_for('admin.dashboard'))
        elif current_user.is_teacher:
            return redirect(url_for('teacher.dashboard'))
        else:
            return redirect(url_for('student.dashboard'))
            
    form = LoginForm()
    lang = session.get('lang', 'en')
    
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data.strip().lower()).first()
        
        if user and user.check_password(form.password.data):
            if not user.is_active:
                flash(get_text('account_deactivated', lang, "This account has been deactivated. Please contact the administrator."), "error")
                return render_template('auth/login.html', form=form)
                
            login_user(user, remember=form.remember_me.data)
            log_activity(user.id, "USER_LOGIN", f"Logged in as {user.role}")
            flash(f"Welcome back, {user.full_name}!", "success")
            
            # Next URL redirection with security check
            next_page = request.args.get('next')
            if next_page and next_page.startswith('/'):
                return redirect(next_page)
                
            if user.is_admin:
                return redirect(url_for('admin.dashboard'))
            elif user.is_teacher:
                return redirect(url_for('teacher.dashboard'))
            else:
                return redirect(url_for('student.dashboard'))
        else:
            flash("Invalid email or password. Please try again.", "error")
            
    return render_template('auth/login.html', form=form)

@auth_bp.route('/logout')
@login_required
def logout():
    log_activity(current_user.id, "USER_LOGOUT")
    logout_user()
    flash("You have been safely logged out.", "info")
    return redirect(url_for('auth.login'))

@auth_bp.route('/change-password', methods=['GET', 'POST'])
@login_required
def change_password():
    form = ChangePasswordForm()
    lang = session.get('lang', 'en')
    
    if form.validate_on_submit():
        if not current_user.check_password(form.current_password.data):
            flash("Current password is incorrect.", "error")
            return render_template('auth/change_password.html', form=form)
            
        current_user.set_password(form.new_password.data)
        db.session.commit()
        log_activity(current_user.id, "PASSWORD_CHANGED")
        flash("Password updated successfully!", "success")
        
        if current_user.is_admin:
            return redirect(url_for('admin.dashboard'))
        elif current_user.is_teacher:
            return redirect(url_for('teacher.dashboard'))
        else:
            return redirect(url_for('student.dashboard'))
            
    return render_template('auth/change_password.html', form=form)

@auth_bp.route('/toggle-lang/<lang_code>')
def toggle_lang(lang_code):
    if lang_code in ('en', 'kn'):
        session['lang'] = lang_code
    return redirect(request.referrer or url_for('library.index'))
