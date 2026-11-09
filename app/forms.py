from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import (
    StringField, 
    PasswordField, 
    BooleanField, 
    TextAreaField, 
    SelectField, 
    IntegerField, 
    SubmitField,
    HiddenField
)
from wtforms.validators import DataRequired, Email, Length, EqualTo, Optional, NumberRange, URL

class LoginForm(FlaskForm):
    email = StringField('Email Address', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Log In')


class ChangePasswordForm(FlaskForm):
    current_password = PasswordField('Current Password', validators=[DataRequired()])
    new_password = PasswordField('New Password', validators=[
        DataRequired(),
        Length(min=6, message="Password must be at least 6 characters long")
    ])
    confirm_password = PasswordField('Confirm New Password', validators=[
        DataRequired(),
        EqualTo('new_password', message="Passwords must match")
    ])
    submit = SubmitField('Update Password')


class ResourceUploadForm(FlaskForm):
    title = StringField('Resource Title', validators=[DataRequired(), Length(max=200)])
    title_kn = StringField('Resource Title in Kannada (ಕನ್ನಡ ಶೀರ್ಷಿಕೆ)', validators=[Optional(), Length(max=200)])
    description = TextAreaField('Description', validators=[Optional()])
    class_id = SelectField('Class', coerce=int, validators=[DataRequired()])
    subject_id = SelectField('Subject', coerce=int, validators=[DataRequired()])
    chapter_id = SelectField('Chapter (Optional)', coerce=int, validators=[Optional()])
    category_id = SelectField('Resource Category', coerce=int, validators=[DataRequired()])
    resource_type = SelectField('Type', choices=[
        ('pdf', 'PDF Document / Textbook / Notes'),
        ('video', 'Educational Video Link')
    ], validators=[DataRequired()])
    language = SelectField('Language of Content', choices=[
        ('kn', 'Kannada (ಕನ್ನಡ)'),
        ('en', 'English'),
        ('bilingual', 'Bilingual (Kannada & English)')
    ], default='kn', validators=[DataRequired()])
    pdf_file = FileField('Upload PDF File', validators=[
        Optional(),
        FileAllowed(['pdf'], 'Only genuine PDF files are permitted!')
    ])
    video_url = StringField('Video URL (YouTube/Vimeo/Safe Educational link)', validators=[
        Optional(),
        URL(message="Please provide a valid URL")
    ])
    submit = SubmitField('Submit for Review')


class ResourceApprovalForm(FlaskForm):
    status = SelectField('Decision', choices=[
        ('approved', 'Approve Resource'),
        ('rejected', 'Reject Resource')
    ], validators=[DataRequired()])
    rejection_reason = TextAreaField('Reason (Required if rejected)', validators=[Optional()])
    submit = SubmitField('Confirm Decision')


class UserForm(FlaskForm):
    email = StringField('Email Address', validators=[DataRequired(), Email()])
    full_name = StringField('Full Name', validators=[DataRequired(), Length(max=120)])
    role = SelectField('Role', choices=[
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Administrator')
    ], validators=[DataRequired()])
    class_id = SelectField('Assigned Class (For Students)', coerce=int, validators=[Optional()])
    phone = StringField('Phone Number', validators=[Optional(), Length(max=20)])
    password = PasswordField('Password', validators=[
        Optional(),
        Length(min=6, message="Password must be at least 6 characters")
    ])
    is_active = BooleanField('Account Active', default=True)
    submit = SubmitField('Save Account')


class AnnouncementForm(FlaskForm):
    title = StringField('Title (English)', validators=[DataRequired(), Length(max=200)])
    title_kn = StringField('Title (ಕನ್ನಡ)', validators=[Optional(), Length(max=200)])
    message = TextAreaField('Announcement Message', validators=[DataRequired()])
    message_kn = TextAreaField('Message in Kannada (ಕನ್ನಡ ಸಂದೇಶ)', validators=[Optional()])
    target_role = SelectField('Visible To', choices=[
        ('all', 'All Users (Students & Teachers)'),
        ('student', 'Students Only'),
        ('teacher', 'Teachers Only')
    ], default='all', validators=[DataRequired()])
    is_active = BooleanField('Published / Active', default=True)
    submit = SubmitField('Post Announcement')


class QuizCreateForm(FlaskForm):
    title = StringField('Quiz Title', validators=[DataRequired(), Length(max=200)])
    title_kn = StringField('Title in Kannada (ರಸಪ್ರಶ್ನೆ ಶೀರ್ಷಿಕೆ)', validators=[Optional(), Length(max=200)])
    instructions = TextAreaField('Instructions', validators=[Optional()])
    class_id = SelectField('Class', coerce=int, validators=[DataRequired()])
    subject_id = SelectField('Subject', coerce=int, validators=[DataRequired()])
    chapter_id = SelectField('Chapter', coerce=int, validators=[Optional()])
    duration_minutes = IntegerField('Duration (Minutes)', default=15, validators=[
        DataRequired(),
        NumberRange(min=1, max=180, message="Duration must be between 1 and 180 minutes")
    ])
    submit = SubmitField('Create Quiz & Add Questions')
