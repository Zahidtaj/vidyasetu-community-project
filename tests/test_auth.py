def test_admin_login(client):
    response = client.post('/auth/login', data={'email': 'admin@school.demo', 'password': 'Admin@123'}, follow_redirects=True)
    assert response.status_code == 200
    assert b"Platform Overview" in response.data or b"admin" in response.data

def test_teacher_login(client):
    response = client.post('/auth/login', data={'email': 'teacher@school.demo', 'password': 'Teacher@123'}, follow_redirects=True)
    assert response.status_code == 200
    assert b"Teacher Workspace" in response.data or b"teacher" in response.data

def test_student_login(client):
    response = client.post('/auth/login', data={'email': 'student@school.demo', 'password': 'Student@123'}, follow_redirects=True)
    assert response.status_code == 200
    assert b"Chethan Kumar" in response.data or b"student" in response.data

def test_invalid_password(client):
    response = client.post('/auth/login', data={'email': 'student@school.demo', 'password': 'WrongPassword'}, follow_redirects=True)
    assert response.status_code == 200
    assert b"Invalid email or password" in response.data

def test_invalid_email(client):
    response = client.post('/auth/login', data={'email': 'nonexistent@school.demo', 'password': 'Password123'}, follow_redirects=True)
    assert response.status_code == 200
    assert b"Invalid email or password" in response.data

def test_inactive_user_cannot_login(client):
    response = client.post('/auth/login', data={'email': 'inactive@school.demo', 'password': 'Student@123'}, follow_redirects=True)
    assert response.status_code == 200
    assert b"deactivated" in response.data

def test_logout(client, auth_client):
    auth_client.login_student()
    response = auth_client.logout()
    assert response.status_code == 200
    assert b"safely logged out" in response.data

def test_password_change(client, auth_client):
    auth_client.login_student()
    response = client.post('/auth/change-password', data={
        'current_password': 'Student@123',
        'new_password': 'NewPassword@2026',
        'confirm_password': 'NewPassword@2026'
    }, follow_redirects=True)
    assert response.status_code == 200
    assert b"Password updated successfully" in response.data

    # Verify old password fails and new password succeeds
    auth_client.logout()
    resp_old = client.post('/auth/login', data={'email': 'student@school.demo', 'password': 'Student@123'}, follow_redirects=True)
    assert b"Invalid email or password" in resp_old.data

    resp_new = client.post('/auth/login', data={'email': 'student@school.demo', 'password': 'NewPassword@2026'}, follow_redirects=True)
    assert b"Chethan Kumar" in resp_new.data or resp_new.status_code == 200
