def test_quiz_attempt_creation(client, auth_client, app):
    auth_client.login_student()
    with app.app_context():
        from app.models import Quiz
        quiz = Quiz.query.first()
        quiz_id = quiz.id

    resp = client.get(f'/quiz/{quiz_id}/attempt')
    assert resp.status_code == 200
    assert b"Powerhouse of cell?" in resp.data
    # Ensure correct answer indicator is never leaked in the client attempt markup
    assert b"is_correct" not in resp.data
    assert b"Correct Answer" not in resp.data

def test_quiz_submission_and_scoring(client, auth_client, app):
    auth_client.login_student()
    with app.app_context():
        from app.models import Quiz, Question, QuizOption
        quiz = Quiz.query.first()
        quiz_id = quiz.id
        q1 = Question.query.filter_by(quiz_id=quiz.id).first()
        correct_opt = QuizOption.query.filter_by(question_id=q1.id, is_correct=True).first()
        q1_id = q1.id
        correct_opt_id = correct_opt.id

    # Start attempt
    client.get(f'/quiz/{quiz_id}/attempt')

    # Submit correct answer
    resp = client.post(f'/quiz/{quiz_id}/submit', data={
        f'question_{q1_id}': str(correct_opt_id)
    }, follow_redirects=True)

    assert resp.status_code == 200
    assert b"Total Score" in resp.data
    assert b"100.0% Accuracy" in resp.data or b"1 / 1" in resp.data
    # Verify explanation is revealed after submission
    assert b"Mitochondria produce ATP" in resp.data

def test_quiz_result_privacy(client, auth_client, app):
    """A student must NOT be able to view another student's quiz attempt scorecard."""
    # Student 1 attempts and submits quiz
    auth_client.login_student()
    with app.app_context():
        from app.models import Quiz, Question, QuizOption
        quiz = Quiz.query.first()
        quiz_id = quiz.id
        q1 = Question.query.filter_by(quiz_id=quiz.id).first()
        opt = QuizOption.query.filter_by(question_id=q1.id).first()
        q1_id = q1.id
        opt_id = opt.id

    client.get(f'/quiz/{quiz_id}/attempt')
    client.post(f'/quiz/{quiz_id}/submit', data={f'question_{q1_id}': str(opt_id)})

    with app.app_context():
        from app.models import QuizAttempt, User
        student = User.query.filter_by(email='student@school.demo').first()
        attempt = QuizAttempt.query.filter_by(student_id=student.id).first()
        attempt_id = attempt.id

    auth_client.logout()

    # Now login as another student
    auth_client.login_other_student()
    # Attempt to access student 1's attempt URL
    resp = client.get(f'/quiz/attempt/{attempt_id}/result')
    assert resp.status_code == 403
