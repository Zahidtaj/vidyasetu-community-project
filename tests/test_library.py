def test_library_shows_approved_resources_only(client):
    response = client.get('/library/')
    assert response.status_code == 200
    assert b"Approved Cell Notes" in response.data
    # Pending resources must never be shown to public or students
    assert b"Pending Motion Guide" not in response.data

def test_library_search(client):
    resp = client.get('/library/?q=Cell')
    assert b"Approved Cell Notes" in resp.data

    resp_empty = client.get('/library/?q=NonexistentTopic123')
    assert b"No learning resources matched" in resp_empty.data or b"No matching" in resp_empty.data

def test_library_class_filter(client, app):
    with app.app_context():
        from app.models import Class
        c10 = Class.query.filter_by(name='Class 10').first()
        # Query for Class 10 should not show the Class 9 cell notes
        resp = client.get(f'/library/?class_id={c10.id}')
        assert b"Approved Cell Notes" not in resp.data

def test_bookmark_toggle(client, auth_client, app):
    auth_client.login_student()
    with app.app_context():
        from app.models import Resource
        res = Resource.query.filter_by(title='Approved Cell Notes').first()
        res_id = res.id

    # Add bookmark
    resp = client.post(f'/library/resource/{res_id}/bookmark', follow_redirects=True)
    assert resp.status_code == 200
    assert b"Saved to bookmarks" in resp.data or b"bookmarks" in resp.data

    # Toggle remove bookmark
    resp2 = client.post(f'/library/resource/{res_id}/bookmark', follow_redirects=True)
    assert resp2.status_code == 200
    assert b"Removed from bookmarks" in resp2.data

def test_chapter_progress_toggle(client, auth_client, app):
    auth_client.login_student()
    with app.app_context():
        from app.models import Chapter
        ch = Chapter.query.first()
        ch_id = ch.id

    resp = client.post(f'/library/chapter/{ch_id}/toggle-complete', follow_redirects=True)
    assert resp.status_code == 200
    assert b"marked as completed" in resp.data
