from flask import Flask, session, redirect, url_for, render_template
from flask_login import LoginManager, current_user
from flask_wtf.csrf import CSRFProtect

from app.config import Config
from app.models import db, User
from app.translations import get_text

login_manager = LoginManager()
csrf = CSRFProtect()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    csrf.init_app(app)

    login_manager.login_view = 'auth.login'
    login_manager.login_message = "Please log in to access this page."
    login_manager.login_message_category = "info"

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register Blueprints
    from app.blueprints.auth.routes import auth_bp
    from app.blueprints.library.routes import library_bp
    from app.blueprints.student.routes import student_bp
    from app.blueprints.teacher.routes import teacher_bp
    from app.blueprints.admin.routes import admin_bp
    from app.blueprints.quiz.routes import quiz_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(library_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(teacher_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(quiz_bp)

    # Context processors for templates (Bilingual translation helper)
    @app.context_processor
    def inject_translation_helper():
        lang = session.get('lang', 'en')
        def t(key, default=None):
            return get_text(key, lang, default)
        return dict(t=t, current_lang=lang)

    # Default landing route
    @app.route('/')
    def root():
        if current_user.is_authenticated:
            if current_user.is_admin:
                return redirect(url_for('admin.dashboard'))
            elif current_user.is_teacher:
                return redirect(url_for('teacher.dashboard'))
            else:
                return redirect(url_for('student.dashboard'))
        return redirect(url_for('library.index'))

    # Custom Error Handlers
    @app.errorhandler(403)
    def forbidden_error(error):
        return render_template('errors/403.html'), 403

    @app.errorhandler(404)
    def not_found_error(error):
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return render_template('errors/500.html'), 500

    return app
