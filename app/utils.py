import os
import uuid
from urllib.parse import urlparse
from werkzeug.utils import secure_filename
from flask import current_app, request
from app.models import db, ActivityLog

def allowed_file(filename):
    """Check if file has an allowed extension."""
    if not filename or '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in current_app.config.get('ALLOWED_EXTENSIONS', {'pdf'})

def is_valid_pdf_stream(file_stream):
    """Inspect magic bytes to verify genuine PDF file."""
    pos = file_stream.tell()
    file_stream.seek(0)
    header = file_stream.read(5)
    file_stream.seek(pos)
    return header.startswith(b'%PDF-')

def save_secure_resource_file(file_storage):
    """
    Saves an uploaded PDF file with security protections:
    1. Allowed extension validation
    2. Magic byte inspection
    3. Path traversal prevention
    4. Unique random UUID prefix
    Returns relative filepath or None if invalid.
    """
    if not file_storage or not file_storage.filename:
        return None, "No file provided"
        
    filename = secure_filename(file_storage.filename)
    if not allowed_file(filename):
        return None, "Only genuine PDF files (.pdf) are permitted"
        
    # Verify PDF magic bytes
    if not is_valid_pdf_stream(file_storage.stream):
        return None, "File content is not a valid PDF document"
        
    upload_folder = current_app.config['UPLOAD_FOLDER']
    os.makedirs(upload_folder, exist_ok=True)
    
    unique_id = uuid.uuid4().hex[:12]
    safe_filename = f"{unique_id}_{filename}"
    full_path = os.path.join(upload_folder, safe_filename)
    
    # Path traversal check
    real_upload_dir = os.path.realpath(upload_folder)
    real_target_path = os.path.realpath(full_path)
    if not real_target_path.startswith(real_upload_dir):
        return None, "Invalid file path detected"
        
    file_storage.save(full_path)
    # Store relative path from static/
    relative_path = f"uploads/resources/{safe_filename}"
    return relative_path, None

def sanitize_url(url):
    """Validates external video or reference URLs."""
    if not url:
        return None
    url = url.strip()
    parsed = urlparse(url)
    if parsed.scheme not in ('http', 'https'):
        return None
    if not parsed.netloc:
        return None
    return url

def log_activity(user_id, action, details=None):
    """Log an audit activity record in the database."""
    try:
        ip = request.remote_addr if request else '127.0.0.1'
        log = ActivityLog(
            user_id=user_id,
            action=action,
            details=details,
            ip_address=ip
        )
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Failed to write activity log: {e}")
