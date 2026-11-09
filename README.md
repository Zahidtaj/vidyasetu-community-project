# VidyaSetu (ವಿದ್ಯಾಸೇತು)
## Digital Library and Knowledge Sharing Platform for Government Schools
### VTU Community Project Course Code: 1BCP308

A complete, secure, full-stack educational web application engineered specifically for students and teachers of Karnataka Government High Schools (Classes 8, 9, and 10), featuring Kannada and English bilingual interfaces, automated chapter evaluations, and teacher-administered curriculum libraries.

---

## 1. Project Overview and Architecture

VidyaSetu is designed to bridge the educational resource gap in rural and government high schools. Rather than a static mockup, this platform is a fully functional web application prototype with an SQLite/SQLAlchemy database, server-side authentication, role-based permissions, PDF file handling, automated assessment evaluation, and audit logging.

```
+-------------------------------------------------------------------------------+
|                                VidyaSetu Architecture                         |
+-------------------------------------------------------------------------------+
|  Presentation Layer (React 19, Tailwind CSS, Institutional Grid & Reader)     |
|  - Embedded Document Viewer - Audio Read-Aloud - Timed Quiz Assessment Engine |
+---------------------------------------+---------------------------------------+
                                        | (HTTP / Form POST / AJAX)
+---------------------------------------v---------------------------------------+
|  Application Layer (Python 3.13 Flask Web Framework)                          |
|  * Blueprints: Auth, Student, Teacher, Admin, Library, Quiz                   |
|  * Security: Flask-Login, Flask-WTF CSRF, RBAC Decorators, File Validator     |
|  * Bilingual Dictionary: Centralized Kannada (ಕನ್ನಡ) & English Engine          |
+---------------------------------------+---------------------------------------+
                                        | (SQLAlchemy ORM)
+---------------------------------------v---------------------------------------+
|  Persistence Layer (SQLite Database: vidyasetu.db)                            |
|  * 16 Normalized Entities with Cascade Rules, Indexes, & Foreign Key Rel.    |
|  * Secure Local File Storage: Magic Byte (%PDF-) & Traversal Verification     |
+-------------------------------------------------------------------------------+
```

---

## 2. User Roles and Access Control

| Role | Access Privileges | Primary Routes |
| :--- | :--- | :--- |
| **Student** | * Browse class-specific textbooks, notes, and question papers<br/>* Real-time search and filters (Subject, Chapter, Language, Resource Type)<br/>* Read documents and download permitted study materials<br/>* Attempt chapter-wise timed MCQ quizzes with server-side grading<br/>* Review scorecards with correct answers and pedagogical explanations<br/>* Track chapter completion and manage personal bookmarks | `/student/dashboard`<br/>`/student/progress`<br/>`/student/bookmarks`<br/>`/library/`<br/>`/quiz/list` |
| **Teacher** | * Manage resources for assigned classes and subjects<br/>* Upload educational PDFs with safe filename generation and magic-byte check<br/>* Add educational video links and revision summaries<br/>* View resource review status (Approved, Pending, Rejected with reasons)<br/>* Create chapter-wise MCQ quizzes with custom duration and 4 choices<br/>* View student quiz attempt performance and class scoreboards | `/teacher/dashboard`<br/>`/teacher/resources`<br/>`/teacher/upload`<br/>`/teacher/quizzes`<br/>`/teacher/student-performance` |
| **Administrator** | * Complete platform governance and statistics dashboard<br/>* Review pending teacher submissions: Approve or Reject with feedback<br/>* Curriculum management: Add/edit Classes, Subjects, and Chapters<br/>* User management: Create student/teacher accounts, toggle active status<br/>* Broadcast school announcements (All, Students Only, Teachers Only)<br/>* Inspect system audit logs with timestamps and IP addresses | `/admin/dashboard`<br/>`/admin/approvals`<br/>`/admin/users`<br/>`/admin/curriculum`<br/>`/admin/announcements`<br/>`/admin/activity-logs` |

---

## 3. Normalized Database Design (16 Entities)

The database schema (`vidyasetu.db`) contains 16 normalized tables:

1. `users`: System accounts (ID, email, password_hash, full_name, role, class_id, is_active, created_at).
2. `classes`: Academic grades (`Class 8`, `Class 9`, `Class 10` with Kannada labels `೮ನೇ ತರಗತಿ`, etc.).
3. `subjects`: Subjects mapped to classes (`Mathematics`, `Science`, `Kannada`, `English`, `Social Science`).
4. `chapters`: Chapter syllabus breakdown under each subject.
5. `teacher_assignments`: Maps teachers to specific class-subject combinations.
6. `resource_categories`: Classifications (`Digital Textbook`, `Notes`, `Question Papers`, `Videos`, `Worksheets`).
7. `resources`: Educational materials metadata, secure file paths, video URLs, status (`approved`, `pending`, `rejected`), rejection reasons, view and download counters.
8. `quizzes`: Chapter assessment metadata (Title, duration, class, subject, teacher, is_published).
9. `questions`: Questions with marks, order, and detailed explanations.
10. `quiz_options`: 4 choices per question with `is_correct` boolean.
11. `quiz_attempts`: Student assessment sessions with server-recorded started/completed timestamps, score, and percentage.
12. `student_answers`: Individual option choices recorded per question attempt.
13. `bookmarks`: Student saved materials (with uniqueness constraint on `user_id` + `resource_id`).
14. `chapter_progress`: Recorded chapter completion status explicitly updated by students.
15. `announcements`: School broadcast messages with target audience filters.
16. `activity_logs`: Audit trail of logins, uploads, approvals, and completions.

---

## 4. Security Implementations

* **Password Security**: Passwords are never stored in plain text. Hashed using Werkzeug `generate_password_hash` (PBKDF2/scrypt).
* **CSRF Protection**: All state-changing POST requests require a valid CSRF token verified via `Flask-WTF`.
* **Role-Based Access Control (RBAC)**: Custom decorators (`@role_required`, `@student_required`, `@teacher_required`, `@admin_required`) reject unauthorized access with HTTP 403 Forbidden.
* **Strict File Upload Verification**:
  * File extension checking (`.pdf` only).
  * Magic byte verification: Inspects binary stream header for `%PDF-` to prevent disguised executable uploads.
  * Path traversal defense: Validates resolved canonical path against root upload folder.
  * Unique UUID prefix generation to prevent file overwrites.
* **Server-Side Quiz Scoring**: Correct answers are never sent to the client during an attempt. Responses are scored entirely on the backend, and answers/explanations are revealed only upon attempt completion.
* **Data Privacy**: Students cannot access other students' private quiz results or attempt IDs (enforced with HTTP 403).

---

## 5. Demonstration Accounts

Pre-seeded accounts are provided for instant evaluation:

| Account Type | Email | Password | Role / Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@school.demo` | `Admin@123` | Full administrative control, approvals, curriculum, users |
| **Teacher** | `teacher@school.demo` | `Teacher@123` | Class 9 and 10 Science and Math faculty |
| **Student (Class 9)** | `student@school.demo` | `Student@123` | Enrolled in Class 9 (with completed quiz and bookmarks) |
| **Student (Class 10)** | `student10@school.demo` | `Student@123` | Enrolled in Class 10 (SSLC) |

---

## 6. How to Run the Application

### 1. Run Python Flask Backend
From the project directory:

```powershell
.\venv\Scripts\python.exe run.py
```

Server binds to: `http://127.0.0.1:5000` (and `http://0.0.0.0:5000` for local area network devices).

### 2. Reset or Re-seed Database
```powershell
.\venv\Scripts\python.exe seed_data.py
```

### 3. Run Automated Pytest Test Suite
```powershell
.\venv\Scripts\python.exe -m pytest -v
```

### 4. Build Production Static Client (Vite)
```powershell
npm run build
```
Output compiled into `dist/`.

---

## 7. Verification and Test Coverage Summary

```
============================= test session starts =============================
platform win32 -- Python 3.13.14, pytest-8.3.5
collected 25 items

tests/test_auth.py::test_admin_login PASSED                              [  4%]
tests/test_auth.py::test_teacher_login PASSED                            [  8%]
tests/test_auth.py::test_student_login PASSED                            [ 12%]
tests/test_auth.py::test_invalid_password PASSED                         [ 16%]
tests/test_auth.py::test_invalid_email PASSED                            [ 20%]
tests/test_auth.py::test_inactive_user_cannot_login PASSED               [ 24%]
tests/test_auth.py::test_logout PASSED                                   [ 28%]
tests/test_auth.py::test_password_change PASSED                          [ 32%]
tests/test_library.py::test_library_shows_approved_resources_only PASSED [ 36%]
tests/test_library.py::test_library_search PASSED                        [ 40%]
tests/test_library.py::test_library_class_filter PASSED                  [ 44%]
tests/test_library.py::test_bookmark_toggle PASSED                       [ 48%]
tests/test_library.py::test_chapter_progress_toggle PASSED               [ 52%]
tests/test_quiz.py::test_quiz_attempt_creation PASSED                    [ 56%]
tests/test_quiz.py::test_quiz_submission_and_scoring PASSED              [ 60%]
tests/test_quiz.py::test_quiz_result_privacy PASSED                      [ 64%]
tests/test_rbac.py::test_unauthenticated_redirects PASSED                [ 68%]
tests/test_rbac.py::test_student_cannot_access_teacher_routes PASSED     [ 72%]
tests/test_rbac.py::test_student_cannot_access_admin_routes PASSED       [ 76%]
tests/test_rbac.py::test_teacher_cannot_access_admin_routes PASSED       [ 80%]
tests/test_rbac.py::test_admin_has_full_access PASSED                    [ 84%]
tests/test_security.py::test_allowed_extensions PASSED                   [ 88%]
tests/test_security.py::test_magic_byte_pdf_inspection PASSED            [ 92%]
tests/test_security.py::test_fake_pdf_upload_rejected PASSED             [ 96%]
tests/test_security.py::test_valid_pdf_saved_with_safe_random_name PASSED [100%]

============================= 25 passed in 32.13s =============================
```

---

## 8. Academic Project Notice
Developed as a community service learning initiative under Visvesvaraya Technological University (VTU Course Code: 1BCP308) to foster educational equity and accessible digital literacy in Government High Schools across Karnataka.
