import pytest
import os
import shutil
from app import create_app
from app.config import TestingConfig
from app.models import (
    db, 
    User, 
    Class, 
    Subject, 
    Chapter, 
    ResourceCategory, 
    Resource, 
    Quiz, 
    Question, 
    QuizOption, 
    QuizAttempt,
    Bookmark
)

@pytest.fixture
def app():
    test_upload_dir = TestingConfig.UPLOAD_FOLDER
    os.makedirs(test_upload_dir, exist_ok=True)
    
    app = create_app(TestingConfig)
    
    with app.app_context():
        db.create_all()
        
        # Seed test entities
        c9 = Class(name='Class 9', name_kn='೯ನೇ ತರಗತಿ')
        c10 = Class(name='Class 10', name_kn='೧೦ನೇ ತರಗತಿ')
        db.session.add_all([c9, c10])
        db.session.flush()
        
        sub = Subject(class_id=c9.id, name='Science', name_kn='ವಿಜ್ಞಾನ', code='SCI-09')
        db.session.add(sub)
        db.session.flush()
        
        ch = Chapter(subject_id=sub.id, chapter_number=1, title='Cell', title_kn='ಜೀವಕೋಶ')
        db.session.add(ch)
        db.session.flush()
        
        cat = ResourceCategory(name='Notes', name_kn='ಟಿಪ್ಪಣಿಗಳು', code='notes')
        db.session.add(cat)
        db.session.flush()

        # Users
        admin = User(email='admin@school.demo', full_name='Admin Test', role='admin', is_active=True)
        admin.set_password('Admin@123')

        teacher = User(email='teacher@school.demo', full_name='Teacher Test', role='teacher', is_active=True)
        teacher.set_password('Teacher@123')

        student = User(email='student@school.demo', full_name='Student Test', role='student', class_id=c9.id, is_active=True)
        student.set_password('Student@123')

        inactive_student = User(email='inactive@school.demo', full_name='Inactive Student', role='student', class_id=c9.id, is_active=False)
        inactive_student.set_password('Student@123')

        other_student = User(email='other_student@school.demo', full_name='Other Student', role='student', class_id=c9.id, is_active=True)
        other_student.set_password('Student@123')

        db.session.add_all([admin, teacher, student, inactive_student, other_student])
        db.session.flush()

        # Resources
        res_approved = Resource(
            title='Approved Cell Notes',
            class_id=c9.id,
            subject_id=sub.id,
            chapter_id=ch.id,
            category_id=cat.id,
            resource_type='pdf',
            file_path='uploads/resources/test.pdf',
            language='en',
            status='approved',
            uploader_id=teacher.id
        )

        res_pending = Resource(
            title='Pending Motion Guide',
            class_id=c9.id,
            subject_id=sub.id,
            chapter_id=ch.id,
            category_id=cat.id,
            resource_type='pdf',
            file_path='uploads/resources/pending.pdf',
            language='en',
            status='pending',
            uploader_id=teacher.id
        )
        db.session.add_all([res_approved, res_pending])
        db.session.flush()

        # Quiz
        quiz = Quiz(
            title='Cell Structure Quiz',
            class_id=c9.id,
            subject_id=sub.id,
            chapter_id=ch.id,
            teacher_id=teacher.id,
            duration_minutes=15,
            is_published=True
        )
        db.session.add(quiz)
        db.session.flush()

        q1 = Question(quiz_id=quiz.id, question_text="Powerhouse of cell?", marks=1, order_num=1, explanation="Mitochondria produce ATP.")
        db.session.add(q1)
        db.session.flush()

        opt1 = QuizOption(question_id=q1.id, option_text="Mitochondria", is_correct=True, order_num=1)
        opt2 = QuizOption(question_id=q1.id, option_text="Nucleus", is_correct=False, order_num=2)
        db.session.add_all([opt1, opt2])

        db.session.commit()
        
        yield app
        
        db.session.remove()
        db.drop_all()
        if os.path.exists(test_upload_dir):
            shutil.rmtree(test_upload_dir, ignore_errors=True)

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_client(client):
    """Helper to log in different roles."""
    class AuthActions:
        def login_admin(self):
            return client.post('/auth/login', data={'email': 'admin@school.demo', 'password': 'Admin@123'}, follow_redirects=True)
            
        def login_teacher(self):
            return client.post('/auth/login', data={'email': 'teacher@school.demo', 'password': 'Teacher@123'}, follow_redirects=True)
            
        def login_student(self):
            return client.post('/auth/login', data={'email': 'student@school.demo', 'password': 'Student@123'}, follow_redirects=True)
            
        def login_other_student(self):
            return client.post('/auth/login', data={'email': 'other_student@school.demo', 'password': 'Student@123'}, follow_redirects=True)
            
        def logout(self):
            return client.get('/auth/logout', follow_redirects=True)

    return AuthActions()
