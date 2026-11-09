import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'vtu-community-project-vidyasetu-dev-key-2026-safe')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', f'sqlite:///{BASE_DIR / "vidyasetu.db"}')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload configurations
    UPLOAD_FOLDER = BASE_DIR / 'app' / 'static' / 'uploads' / 'resources'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload limit
    ALLOWED_EXTENSIONS = {'pdf'}
    
    # Session & Security cookies
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = 3600

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False
    UPLOAD_FOLDER = BASE_DIR / 'tests' / 'test_uploads'

class ProductionConfig(Config):
    DEBUG = False
    SESSION_COOKIE_SECURE = True
