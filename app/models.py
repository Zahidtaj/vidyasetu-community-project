from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False, index=True)  # 'student', 'teacher', 'admin'
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id', ondelete='SET NULL'), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    assigned_class = db.relationship('Class', backref=db.backref('students', lazy='dynamic'))
    teacher_assignments = db.relationship('TeacherAssignment', backref='teacher', cascade='all, delete-orphan', lazy='dynamic')
    uploaded_resources = db.relationship('Resource', backref='uploader', lazy='dynamic')
    created_quizzes = db.relationship('Quiz', backref='creator', lazy='dynamic')
    quiz_attempts = db.relationship('QuizAttempt', backref='student', cascade='all, delete-orphan', lazy='dynamic')
    bookmarks = db.relationship('Bookmark', backref='user', cascade='all, delete-orphan', lazy='dynamic')
    chapter_progress = db.relationship('ChapterProgress', backref='student', cascade='all, delete-orphan', lazy='dynamic')
    activity_logs = db.relationship('ActivityLog', backref='user', lazy='dynamic')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
        
    @property
    def is_student(self):
        return self.role == 'student'
        
    @property
    def is_teacher(self):
        return self.role == 'teacher'
        
    @property
    def is_admin(self):
        return self.role == 'admin'

    def __repr__(self):
        return f'<User {self.email} ({self.role})>'


class Class(db.Model):
    __tablename__ = 'classes'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)        # e.g. "Class 8"
    name_kn = db.Column(db.String(50), nullable=False)                  # e.g. "೮ನೇ ತರಗತಿ"
    description = db.Column(db.String(255), nullable=True)
    
    # Relationships
    subjects = db.relationship('Subject', backref='class_level', cascade='all, delete-orphan', lazy='dynamic')
    resources = db.relationship('Resource', backref='class_level', lazy='dynamic')
    quizzes = db.relationship('Quiz', backref='class_level', lazy='dynamic')
    
    def __repr__(self):
        return f'<Class {self.name}>'


class Subject(db.Model):
    __tablename__ = 'subjects'
    
    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id', ondelete='CASCADE'), nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)                    # e.g. "Science"
    name_kn = db.Column(db.String(100), nullable=False)                 # e.g. "ವಿಜ್ಞಾನ"
    code = db.Column(db.String(20), nullable=True)                      # e.g. "SCI-09"
    icon = db.Column(db.String(50), default='BookOpen')
    color = db.Column(db.String(50), default='from-blue-500 to-indigo-600')
    
    # Relationships
    chapters = db.relationship('Chapter', backref='subject', cascade='all, delete-orphan', order_by='Chapter.chapter_number', lazy='dynamic')
    resources = db.relationship('Resource', backref='subject', lazy='dynamic')
    quizzes = db.relationship('Quiz', backref='subject', lazy='dynamic')
    teacher_assignments = db.relationship('TeacherAssignment', backref='subject', cascade='all, delete-orphan', lazy='dynamic')
    
    __table_args__ = (
        db.UniqueConstraint('class_id', 'name', name='uq_class_subject'),
    )

    def __repr__(self):
        return f'<Subject {self.name} (Class ID: {self.class_id})>'


class Chapter(db.Model):
    __tablename__ = 'chapters'
    
    id = db.Column(db.Integer, primary_key=True)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id', ondelete='CASCADE'), nullable=False, index=True)
    chapter_number = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    title_kn = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    # Relationships
    resources = db.relationship('Resource', backref='chapter', cascade='all, delete-orphan', lazy='dynamic')
    quizzes = db.relationship('Quiz', backref='chapter', lazy='dynamic')
    progress_records = db.relationship('ChapterProgress', backref='chapter', cascade='all, delete-orphan', lazy='dynamic')
    
    __table_args__ = (
        db.UniqueConstraint('subject_id', 'chapter_number', name='uq_subject_chapter_number'),
    )

    def __repr__(self):
        return f'<Chapter {self.chapter_number}: {self.title}>'


class TeacherAssignment(db.Model):
    __tablename__ = 'teacher_assignments'
    
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id', ondelete='CASCADE'), nullable=False, index=True)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id', ondelete='CASCADE'), nullable=False, index=True)
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    assigned_class = db.relationship('Class', backref='teacher_assignments')
    
    __table_args__ = (
        db.UniqueConstraint('teacher_id', 'class_id', 'subject_id', name='uq_teacher_class_subject'),
    )


class ResourceCategory(db.Model):
    __tablename__ = 'resource_categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    name_kn = db.Column(db.String(50), nullable=False)
    code = db.Column(db.String(30), unique=True, nullable=False)        # textbook, notes, question_paper, video, worksheet
    
    resources = db.relationship('Resource', backref='category', lazy='dynamic')
    
    def __repr__(self):
        return f'<ResourceCategory {self.code}>'


class Resource(db.Model):
    __tablename__ = 'resources'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False, index=True)
    title_kn = db.Column(db.String(200), nullable=True)
    description = db.Column(db.Text, nullable=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id', ondelete='CASCADE'), nullable=False, index=True)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id', ondelete='CASCADE'), nullable=False, index=True)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapters.id', ondelete='SET NULL'), nullable=True, index=True)
    category_id = db.Column(db.Integer, db.ForeignKey('resource_categories.id', ondelete='RESTRICT'), nullable=False, index=True)
    
    resource_type = db.Column(db.String(20), nullable=False)            # 'pdf', 'video', 'link'
    file_path = db.Column(db.String(255), nullable=True)                # relative path to static/uploads/
    video_url = db.Column(db.String(500), nullable=True)                # sanitized safe URL
    language = db.Column(db.String(10), default='kn', nullable=False)   # 'kn', 'en', 'bilingual'
    
    status = db.Column(db.String(20), default='pending', nullable=False, index=True)  # 'pending', 'approved', 'rejected'
    rejection_reason = db.Column(db.Text, nullable=True)
    
    uploader_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True, index=True)
    downloads_count = db.Column(db.Integer, default=0, nullable=False)
    views_count = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    bookmarks = db.relationship('Bookmark', backref='resource', cascade='all, delete-orphan', lazy='dynamic')

    def __repr__(self):
        return f'<Resource {self.title} ({self.status})>'


class Quiz(db.Model):
    __tablename__ = 'quizzes'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    title_kn = db.Column(db.String(200), nullable=True)
    instructions = db.Column(db.Text, nullable=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id', ondelete='CASCADE'), nullable=False, index=True)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id', ondelete='CASCADE'), nullable=False, index=True)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapters.id', ondelete='SET NULL'), nullable=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    duration_minutes = db.Column(db.Integer, default=15, nullable=False)
    is_published = db.Column(db.Boolean, default=True, nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    questions = db.relationship('Question', backref='quiz', cascade='all, delete-orphan', order_by='Question.order_num', lazy='dynamic')
    attempts = db.relationship('QuizAttempt', backref='quiz', cascade='all, delete-orphan', lazy='dynamic')

    def __repr__(self):
        return f'<Quiz {self.title}>'


class Question(db.Model):
    __tablename__ = 'questions'
    
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id', ondelete='CASCADE'), nullable=False, index=True)
    question_text = db.Column(db.Text, nullable=False)
    question_text_kn = db.Column(db.Text, nullable=True)
    explanation = db.Column(db.Text, nullable=True)
    explanation_kn = db.Column(db.Text, nullable=True)
    marks = db.Column(db.Integer, default=1, nullable=False)
    order_num = db.Column(db.Integer, default=1, nullable=False)
    
    # Relationships
    options = db.relationship('QuizOption', backref='question', cascade='all, delete-orphan', order_by='QuizOption.order_num', lazy='dynamic')
    student_answers = db.relationship('StudentAnswer', backref='question', cascade='all, delete-orphan', lazy='dynamic')


class QuizOption(db.Model):
    __tablename__ = 'quiz_options'
    
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id', ondelete='CASCADE'), nullable=False, index=True)
    option_text = db.Column(db.Text, nullable=False)
    option_text_kn = db.Column(db.Text, nullable=True)
    is_correct = db.Column(db.Boolean, default=False, nullable=False)
    order_num = db.Column(db.Integer, default=1, nullable=False)


class QuizAttempt(db.Model):
    __tablename__ = 'quiz_attempts'
    
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id', ondelete='CASCADE'), nullable=False, index=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    started_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    score = db.Column(db.Integer, default=0, nullable=False)
    max_score = db.Column(db.Integer, default=0, nullable=False)
    percentage = db.Column(db.Float, default=0.0, nullable=False)
    is_completed = db.Column(db.Boolean, default=False, nullable=False, index=True)
    
    # Relationships
    answers = db.relationship('StudentAnswer', backref='attempt', cascade='all, delete-orphan', lazy='dynamic')


class StudentAnswer(db.Model):
    __tablename__ = 'student_answers'
    
    id = db.Column(db.Integer, primary_key=True)
    attempt_id = db.Column(db.Integer, db.ForeignKey('quiz_attempts.id', ondelete='CASCADE'), nullable=False, index=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id', ondelete='CASCADE'), nullable=False, index=True)
    selected_option_id = db.Column(db.Integer, db.ForeignKey('quiz_options.id', ondelete='CASCADE'), nullable=True)
    is_correct = db.Column(db.Boolean, default=False, nullable=False)
    
    selected_option = db.relationship('QuizOption')
    
    __table_args__ = (
        db.UniqueConstraint('attempt_id', 'question_id', name='uq_attempt_question'),
    )


class Bookmark(db.Model):
    __tablename__ = 'bookmarks'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    resource_id = db.Column(db.Integer, db.ForeignKey('resources.id', ondelete='CASCADE'), nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'resource_id', name='uq_user_resource_bookmark'),
    )


class ChapterProgress(db.Model):
    __tablename__ = 'chapter_progress'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapters.id', ondelete='CASCADE'), nullable=False, index=True)
    is_completed = db.Column(db.Boolean, default=False, nullable=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    __table_args__ = (
        db.UniqueConstraint('student_id', 'chapter_id', name='uq_student_chapter_progress'),
    )


class Announcement(db.Model):
    __tablename__ = 'announcements'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    title_kn = db.Column(db.String(200), nullable=True)
    message = db.Column(db.Text, nullable=False)
    message_kn = db.Column(db.Text, nullable=True)
    target_role = db.Column(db.String(20), default='all', nullable=False)  # 'all', 'student', 'teacher'
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    creator = db.relationship('User')


class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True, index=True)
    action = db.Column(db.String(100), nullable=False)                   # e.g. "USER_LOGIN", "RESOURCE_UPLOAD"
    details = db.Column(db.Text, nullable=True)
    ip_address = db.Column(db.String(50), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
