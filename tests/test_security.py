import io
from app.utils import allowed_file, is_valid_pdf_stream, save_secure_resource_file

def test_allowed_extensions(app):
    with app.app_context():
        assert allowed_file('notes.pdf') is True
        assert allowed_file('chapter.PDF') is True
        assert allowed_file('virus.exe') is False
        assert allowed_file('script.sh') is False
        assert allowed_file('payload.php') is False
        assert allowed_file('image.png') is False

def test_magic_byte_pdf_inspection():
    fake_stream = io.BytesIO(b"MALICIOUS_SHELL_SCRIPT_DATA")
    assert is_valid_pdf_stream(fake_stream) is False

    real_pdf_stream = io.BytesIO(b"%PDF-1.4\n1 0 obj\n<<>>\nendobj")
    assert is_valid_pdf_stream(real_pdf_stream) is True

def test_fake_pdf_upload_rejected(app):
    with app.app_context():
        from werkzeug.datastructures import FileStorage
        fake_file = FileStorage(
            stream=io.BytesIO(b"echo 'hello evil'"),
            filename="trojan.pdf",
            content_type="application/pdf"
        )
        saved_path, error = save_secure_resource_file(fake_file)
        assert saved_path is None
        assert "not a valid PDF document" in error

def test_valid_pdf_saved_with_safe_random_name(app):
    with app.app_context():
        from werkzeug.datastructures import FileStorage
        valid_file = FileStorage(
            stream=io.BytesIO(b"%PDF-1.5 test genuine content"),
            filename="science_notes.pdf",
            content_type="application/pdf"
        )
        saved_path, error = save_secure_resource_file(valid_file)
        assert error is None
        assert saved_path is not None
        assert saved_path.startswith("uploads/resources/")
        assert "science_notes.pdf" in saved_path
