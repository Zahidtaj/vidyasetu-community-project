def test_unauthenticated_redirects(client):
    assert client.get('/student/dashboard').status_code == 302
    assert client.get('/teacher/dashboard').status_code == 302
    assert client.get('/admin/dashboard').status_code == 302

def test_student_cannot_access_teacher_routes(client, auth_client):
    auth_client.login_student()
    assert client.get('/teacher/dashboard').status_code == 403
    assert client.get('/teacher/upload').status_code == 403
    assert client.get('/teacher/quizzes').status_code == 403

def test_student_cannot_access_admin_routes(client, auth_client):
    auth_client.login_student()
    assert client.get('/admin/dashboard').status_code == 403
    assert client.get('/admin/approvals').status_code == 403
    assert client.get('/admin/users').status_code == 403
    assert client.get('/admin/curriculum').status_code == 403

def test_teacher_cannot_access_admin_routes(client, auth_client):
    auth_client.login_teacher()
    assert client.get('/admin/dashboard').status_code == 403
    assert client.get('/admin/approvals').status_code == 403
    assert client.get('/admin/users').status_code == 403

def test_admin_has_full_access(client, auth_client):
    auth_client.login_admin()
    assert client.get('/admin/dashboard').status_code == 200
    assert client.get('/admin/approvals').status_code == 200
    assert client.get('/admin/users').status_code == 200
