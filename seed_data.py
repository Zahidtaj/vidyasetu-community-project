import os
from datetime import datetime, timedelta
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

from app import create_app
from app.models import (
    db, 
    User, 
    Class, 
    Subject, 
    Chapter, 
    TeacherAssignment, 
    ResourceCategory, 
    Resource, 
    Quiz, 
    Question, 
    QuizOption, 
    QuizAttempt, 
    StudentAnswer, 
    Announcement, 
    ActivityLog,
    Bookmark,
    ChapterProgress
)

def create_sample_pdf(filepath, title, subject_name, class_name, author, pages_content):
    """Generates an authentic demonstration PDF using ReportLab."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    doc = SimpleDocTemplate(filepath, pagesize=letter, rightMargin=54, leftMargin=54, topMargin=54, bottomMargin=54)
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=6
    )
    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#EA580C'),
        spaceAfter=14
    )
    heading_style = ParagraphStyle(
        'SectionHead',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=15,
        textColor=colors.HexColor('#334155'),
        spaceAfter=10
    )
    notice_style = ParagraphStyle(
        'Notice',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#64748B'),
        spaceBefore=16
    )

    story = [
        Paragraph(title, title_style),
        Paragraph(f"<b>VTU Community Project • VidyaSetu Digital Library</b><br/>{class_name} • {subject_name} • Prepared by: {author}", meta_style),
        HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#EA580C'), spaceBefore=2, spaceAfter=14),
    ]

    for section_title, section_body in pages_content:
        story.append(Paragraph(section_title, heading_style))
        story.append(Paragraph(section_body, body_style))
        story.append(Spacer(1, 8))

    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#CBD5E1'), spaceBefore=16, spaceAfter=8))
    story.append(Paragraph(
        "<b>Educational Notice:</b> This is an open-access community demonstration resource created for the VTU Community Project 'Digital Library for Government Schools'. Distributed under Creative Commons / Educational Fair Use.",
        notice_style
    ))

    doc.build(story)


def seed_database():
    app = create_app()
    with app.app_context():
        print("Initializing clean database schema...")
        db.drop_all()
        db.create_all()

        upload_dir = app.config['UPLOAD_FOLDER']
        os.makedirs(upload_dir, exist_ok=True)

        # 1. Categories
        print("Seeding resource categories...")
        cat_textbook = ResourceCategory(name='Digital Textbook', name_kn='ಡಿಜಿಟಲ್ ಪಠ್ಯಪುಸ್ತಕ', code='textbook')
        cat_notes = ResourceCategory(name='Study Notes & Summaries', name_kn='ಅಧ್ಯಯನ ಟಿಪ್ಪಣಿಗಳು', code='notes')
        cat_qp = ResourceCategory(name='Question Papers & Banks', name_kn='ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು', code='question_paper')
        cat_video = ResourceCategory(name='Educational Video Lessons', name_kn='ವಿಡಿಯೋ ಪಾಠಗಳು', code='video')
        cat_worksheet = ResourceCategory(name='Practice Worksheets', name_kn='ಅಭ್ಯಾಸ ಹಾಳೆಗಳು', code='worksheet')

        categories = [cat_textbook, cat_notes, cat_qp, cat_video, cat_worksheet]
        db.session.add_all(categories)
        db.session.flush()

        # 2. Classes (Class 8, 9, 10 initially as required)
        print("Seeding classes 8, 9, 10...")
        c8 = Class(name='Class 8', name_kn='೮ನೇ ತರಗತಿ', description='Karnataka State Board & NCERT Curriculum for Class 8')
        c9 = Class(name='Class 9', name_kn='೯ನೇ ತರಗತಿ', description='Karnataka State Board & NCERT Curriculum for Class 9')
        c10 = Class(name='Class 10', name_kn='೧೦ನೇ ತರಗತಿ', description='Karnataka SSLC Board (KSEAB) Preparation Curriculum')

        classes = [c8, c9, c10]
        db.session.add_all(classes)
        db.session.flush()

        # 3. Subjects
        print("Seeding curriculum subjects...")
        subjects_data = [
            # Class 8
            (c8.id, 'Mathematics', 'ಗಣಿತ', 'MATH-08', 'from-blue-500 to-indigo-600'),
            (c8.id, 'Science', 'ವಿಜ್ಞಾನ', 'SCI-08', 'from-emerald-500 to-teal-600'),
            (c8.id, 'English', 'ಆಂಗ್ಲ ಭಾಷೆ', 'ENG-08', 'from-orange-500 to-amber-600'),
            (c8.id, 'Kannada', 'ಕನ್ನಡ (ಪ್ರಥಮ ಭಾಷೆ)', 'KAN-08', 'from-rose-500 to-pink-600'),
            (c8.id, 'Social Science', 'ಸಮಾಜ ವಿಜ್ಞಾನ', 'SS-08', 'from-purple-500 to-violet-600'),

            # Class 9
            (c9.id, 'Mathematics', 'ಗಣಿತ', 'MATH-09', 'from-blue-500 to-indigo-600'),
            (c9.id, 'Science', 'ವಿಜ್ಞಾನ', 'SCI-09', 'from-emerald-500 to-teal-600'),
            (c9.id, 'English', 'ಆಂಗ್ಲ ಭಾಷೆ', 'ENG-09', 'from-orange-500 to-amber-600'),
            (c9.id, 'Kannada', 'ಕನ್ನಡ (ಪ್ರಥಮ ಭಾಷೆ)', 'KAN-09', 'from-rose-500 to-pink-600'),
            (c9.id, 'Social Science', 'ಸಮಾಜ ವಿಜ್ಞಾನ', 'SS-09', 'from-purple-500 to-violet-600'),

            # Class 10 (SSLC)
            (c10.id, 'Mathematics', 'ಗಣಿತ', 'MATH-10', 'from-blue-500 to-indigo-600'),
            (c10.id, 'Science', 'ವಿಜ್ಞಾನ', 'SCI-10', 'from-emerald-500 to-teal-600'),
            (c10.id, 'English', 'ಆಂಗ್ಲ ಭಾಷೆ', 'ENG-10', 'from-orange-500 to-amber-600'),
            (c10.id, 'Kannada', 'ಕನ್ನಡ (ಪ್ರಥಮ ಭಾಷೆ)', 'KAN-10', 'from-rose-500 to-pink-600'),
            (c10.id, 'Social Science', 'ಸಮಾಜ ವಿಜ್ಞಾನ', 'SS-10', 'from-purple-500 to-violet-600'),
        ]

        sub_map = {}
        for cid, name, name_kn, code, color in subjects_data:
            s = Subject(class_id=cid, name=name, name_kn=name_kn, code=code, color=color)
            db.session.add(s)
            db.session.flush()
            sub_map[(cid, name)] = s

        # 4. Chapters under Class 9 & Class 10 Science & Math
        print("Seeding chapters...")
        # Class 9 Science
        sci9 = sub_map[(c9.id, 'Science')]
        ch_sci9_1 = Chapter(subject_id=sci9.id, chapter_number=1, title='Matter in Our Surroundings', title_kn='ನಮ್ಮ ಸುತ್ತಲಿನ ಪರಿಸರದಲ್ಲಿರುವ ದ್ರವ್ಯಗಳು', description='Physical nature of matter, states of matter, and evaporation.')
        ch_sci9_2 = Chapter(subject_id=sci9.id, chapter_number=5, title='The Fundamental Unit of Life: Cell', title_kn='ಜೀವದ ಮೂಲಭೂತ ಘಟಕ: ಜೀವಕೋಶ', description='Structure of plant and animal cells, cell organelles, and functions.')
        ch_sci9_3 = Chapter(subject_id=sci9.id, chapter_number=8, title='Motion & Laws of Motion', title_kn='ಚಲನೆ ಮತ್ತು ಚಲನೆಯ ನಿಯಮಗಳು', description='Velocity, acceleration, graphical representation of motion, Newton laws.')

        # Class 9 Mathematics
        math9 = sub_map[(c9.id, 'Mathematics')]
        ch_math9_1 = Chapter(subject_id=math9.id, chapter_number=1, title='Number Systems', title_kn='ಸಂಖ್ಯಾ ಪದ್ಧತಿಗಳು', description='Irrational numbers, real numbers, and laws of exponents.')
        ch_math9_2 = Chapter(subject_id=math9.id, chapter_number=2, title='Polynomials', title_kn='ಬಹುಪದೋಕ್ತಿಗಳು', description='Zeroes of a polynomial, remainder theorem, factorisation.')

        # Class 10 Science
        sci10 = sub_map[(c10.id, 'Science')]
        ch_sci10_1 = Chapter(subject_id=sci10.id, chapter_number=1, title='Chemical Reactions and Equations', title_kn='ರಾಸಾಯನಿಕ ಕ್ರಿಯೆಗಳು ಮತ್ತು ಸಮೀಕರಣಗಳು', description='Types of chemical reactions, balancing equations, corrosion and rancidity.')
        ch_sci10_2 = Chapter(subject_id=sci10.id, chapter_number=6, title='Life Processes', title_kn='ಜೈವಿಕ ಕ್ರಿಯೆಗಳು', description='Nutrition, respiration, transportation, and excretion in organisms.')

        # Class 10 Mathematics
        math10 = sub_map[(c10.id, 'Mathematics')]
        ch_math10_1 = Chapter(subject_id=math10.id, chapter_number=1, title='Real Numbers & Euclid Division', title_kn='ವಾಸ್ತವ ಸಂಖ್ಯೆಗಳು', description='Fundamental theorem of arithmetic, rational and irrational proofs.')
        ch_math10_2 = Chapter(subject_id=math10.id, chapter_number=3, title='Pair of Linear Equations in Two Variables', title_kn='ಎರಡು ಚರಾಕ್ಷರಗಳಿರುವ ರೇಖಾತ್ಮಕ ಸಮೀಕರಣಗಳ ಜೋಡಿಗಳು', description='Graphical and algebraic methods: substitution, elimination.')

        # Class 10 Kannada
        kan10 = sub_map[(c10.id, 'Kannada')]
        ch_kan10_1 = Chapter(subject_id=kan10.id, chapter_number=1, title='Yuddha (Poem)', title_kn='ಯುದ್ಧ (ಪದ್ಯ)', description='Classic Kannada poetic analysis by Sara Aboobaker / Kannada literature.')

        all_chapters = [
            ch_sci9_1, ch_sci9_2, ch_sci9_3, 
            ch_math9_1, ch_math9_2, 
            ch_sci10_1, ch_sci10_2, 
            ch_math10_1, ch_math10_2, 
            ch_kan10_1
        ]
        db.session.add_all(all_chapters)
        db.session.flush()

        # 5. Demonstration Accounts
        print("Seeding demonstration user accounts...")
        # Admin
        admin = User(
            email='admin@school.demo',
            full_name='Dr. Nagaraj Bhat (Principal)',
            role='admin',
            phone='+91 9448123456',
            is_active=True
        )
        admin.set_password('Admin@123')

        # Teacher
        teacher = User(
            email='teacher@school.demo',
            full_name='Smt. Shailaja Gowda (Science Faculty)',
            role='teacher',
            phone='+91 9845198765',
            is_active=True
        )
        teacher.set_password('Teacher@123')

        # Student 1 (Class 9)
        student1 = User(
            email='student@school.demo',
            full_name='Chethan Kumar (Class 9A)',
            role='student',
            class_id=c9.id,
            phone='+91 8762112345',
            is_active=True
        )
        student1.set_password('Student@123')

        # Student 2 (Class 10)
        student2 = User(
            email='student10@school.demo',
            full_name='Ananya Shenoy (Class 10B)',
            role='student',
            class_id=c10.id,
            phone='+91 8762198765',
            is_active=True
        )
        student2.set_password('Student@123')

        db.session.add_all([admin, teacher, student1, student2])
        db.session.flush()

        # Teacher assignments
        ta1 = TeacherAssignment(teacher_id=teacher.id, class_id=c9.id, subject_id=sci9.id)
        ta2 = TeacherAssignment(teacher_id=teacher.id, class_id=c9.id, subject_id=math9.id)
        ta3 = TeacherAssignment(teacher_id=teacher.id, class_id=c10.id, subject_id=sci10.id)
        db.session.add_all([ta1, ta2, ta3])
        db.session.flush()

        # 6. Generate Genuine Sample Educational PDF Files
        print("Generating legitimate sample educational PDF textbooks and notes...")
        
        pdf1_rel = "uploads/resources/class9_cell_biology_notes.pdf"
        create_sample_pdf(
            os.path.join(upload_dir, "class9_cell_biology_notes.pdf"),
            title="Class 9 Science: Comprehensive Cell Biology Notes",
            subject_name="Science (Biology)",
            class_name="Class 9 (೯ನೇ ತರಗತಿ)",
            author="Smt. Shailaja Gowda, Govt High School Faculty",
            pages_content=[
                ("1. Discovery of the Cell", "Robert Hooke first discovered cells in 1665 using a primitive microscope, observing thin slices of bottle cork. Anton von Leeuwenhoek in 1674 observed living free cells in pond water with an improved microscope. In 1831, Robert Brown discovered the nucleus inside the cell."),
                ("2. Cell Theory", "The cell theory was proposed by Matthias Schleiden (1838) and Theodor Schwann (1839). It states: (a) All living organisms are composed of one or more cells. (b) The cell is the basic structural and functional unit of life. In 1855, Rudolf Virchow added: 'Omnis cellula e cellula' — all cells arise from pre-existing cells."),
                ("3. Plasma Membrane & Diffusion", "The plasma membrane is a flexible, selectively permeable membrane composed of lipids and proteins. Osmosis is the passage of water from a region of high water concentration through a semi-permeable membrane to a region of low water concentration. In hypotonic solutions, cells swell; in hypertonic solutions, cells shrink (plasmolysis)."),
                ("4. Key Cell Organelles", "• Mitochondria: Known as the powerhouse of the cell because they synthesize ATP (adenosine triphosphate) molecules through cellular respiration.<br/>• Endoplasmic Reticulum (ER): RER with ribosomes synthesizes proteins; SER manufactures lipids.<br/>• Golgi Apparatus: Packages, modifies, and dispatches materials synthesized in the cell.<br/>• Lysosomes: 'Suicide bags' containing digestive enzymes to breakdown cellular debris.")
            ]
        )

        pdf2_rel = "uploads/resources/class10_real_numbers_formula_sheet.pdf"
        create_sample_pdf(
            os.path.join(upload_dir, "class10_real_numbers_formula_sheet.pdf"),
            title="Class 10 Mathematics: Real Numbers Quick Revision & Formulas",
            subject_name="Mathematics (ಗಣಿತ)",
            class_name="Class 10 SSLC (೧೦ನೇ ತರಗತಿ)",
            author="Mathematics Department, DSERT Karnataka",
            pages_content=[
                ("1. Fundamental Theorem of Arithmetic", "Every composite number can be uniquely expressed (factorised) as a product of prime numbers, apart from the order in which the prime factors occur.<br/><b>Formula:</b> For any two positive integers a and b: <b>HCF(a, b) × LCM(a, b) = a × b</b>."),
                ("2. Proof of Irrationality", "To prove that √2, √3, or √5 is irrational, we employ proof by contradiction. Assuming √2 = p/q in simplest coprime form leads to p and q both sharing a common factor 2, which contradicts the fundamental coprime assumption."),
                ("3. Decimal Expansions of Rational Numbers", "Let x = p/q be a rational number such that prime factorisation of q is of the form <b>2<sup>n</sup> · 5<sup>m</sup></b>, where n and m are non-negative integers. Then x has a decimal expansion which terminates. If q contains any other prime factor like 3 or 7, the decimal expansion is non-terminating repeating (recurring).")
            ]
        )

        pdf3_rel = "uploads/resources/class10_science_kseab_model_paper.pdf"
        create_sample_pdf(
            os.path.join(upload_dir, "class10_science_kseab_model_paper.pdf"),
            title="Class 10 Science: KSEAB State Board Model Question Paper",
            subject_name="Science (ವಿಜ್ಞಾನ)",
            class_name="Class 10 SSLC (೧೦ನೇ ತರಗತಿ)",
            author="Karnataka School Examination & Assessment Board (KSEAB)",
            pages_content=[
                ("Section A: Multiple Choice Questions (1 Mark Each)", "1. An electric bulb is rated 220 V and 100 W. When operated on 110 V, the power consumed will be:<br/>(a) 100 W (b) 75 W (c) 50 W (d) 25 W.<br/><br/>2. Rusting of iron is an example of which type of chemical reaction?<br/>(a) Reduction (b) Redox (c) Decomposition (d) Displacement."),
                ("Section B: Short Answer Questions (2 Marks Each)", "3. State Ohm's law. Draw a schematic circuit diagram verifying Ohm's law with an ammeter and voltmeter.<br/><br/>4. Write balanced chemical equations for:<br/>(a) Zinc reacts with dilute sulfuric acid.<br/>(b) Calcium hydroxide reacts with carbon dioxide."),
                ("Section C: Conceptual Biology (3 Marks Each)", "5. Draw a neat labelled diagram of the human nephron (excretory unit of kidney). Explain the three steps involved in urine formation: ultrafiltration, selective reabsorption, and tubular secretion.")
            ]
        )

        pdf4_rel = "uploads/resources/class8_science_force_and_pressure.pdf"
        create_sample_pdf(
            os.path.join(upload_dir, "class8_science_force_and_pressure.pdf"),
            title="Class 8 Science: Force and Pressure Illustrated Notes",
            subject_name="Science",
            class_name="Class 8 (೮ನೇ ತರಗತಿ)",
            author="Govt School Science Teacher Forum",
            pages_content=[
                ("1. What is Force?", "A push or a pull on an object is called a force. Forces arise due to an interaction between objects. Force has both magnitude and direction. The SI unit of force is the Newton (N)."),
                ("2. Effects of Force", "Force can:<br/>• Change the state of motion of an object.<br/>• Change the speed of a moving object.<br/>• Change the direction of motion.<br/>• Change the shape and size of an object (e.g. stretching a spring or pressing clay)."),
                ("3. Pressure in Everyday Life", "Pressure is force acting per unit area: <b>Pressure = Force / Area</b>. This explains why sharp knives cut vegetables more easily than blunt knives (smaller contact area produces greater pressure), and why heavy school bags have broad shoulder straps (larger area reduces pressure on shoulders).")
            ]
        )

        # 7. Seed Resources (Approved & Pending)
        print("Seeding educational resources...")
        res1 = Resource(
            title="Class 9 Science: Comprehensive Cell Biology Notes",
            title_kn="೯ನೇ ತರಗತಿ ವಿಜ್ಞಾನ: ಜೀವಕೋಶದ ರಚನೆ ಹಾಗೂ ಕಾರ್ಯಗಳ ಟಿಪ್ಪಣಿ",
            description="Complete textbook summary, organelle functions, diagrams, and glossary for Class 9 Chapter 5.",
            class_id=c9.id,
            subject_id=sci9.id,
            chapter_id=ch_sci9_2.id,
            category_id=cat_notes.id,
            resource_type='pdf',
            file_path=pdf1_rel,
            language='bilingual',
            status='approved',
            uploader_id=teacher.id,
            downloads_count=42,
            views_count=189
        )

        res2 = Resource(
            title="Class 10 Mathematics: Real Numbers Formula Sheet",
            title_kn="೧೦ನೇ ತರಗತಿ ಗಣಿತ: ವಾಸ್ತವ ಸಂಖ್ಯೆಗಳ ಸೂತ್ರ ಸಂಗ್ರಹ",
            description="Quick reference revision sheet covering Euclid division lemma, HCF-LCM theorem, and decimal terminations.",
            class_id=c10.id,
            subject_id=math10.id,
            chapter_id=ch_math10_1.id,
            category_id=cat_notes.id,
            resource_type='pdf',
            file_path=pdf2_rel,
            language='en',
            status='approved',
            uploader_id=teacher.id,
            downloads_count=65,
            views_count=240
        )

        res3 = Resource(
            title="KSEAB Class 10 Science Model Question Paper 2026",
            title_kn="೧೦ನೇ ತರಗತಿ ವಿಜ್ಞಾನ: ಎಸ್‌ಎಸ್‌ಎಲ್‌ಸಿ ಮಾದರಿ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ೨೦೨೬",
            description="Official pattern question paper with mark distribution for upcoming Karnataka Board examinations.",
            class_id=c10.id,
            subject_id=sci10.id,
            chapter_id=ch_sci10_1.id,
            category_id=cat_qp.id,
            resource_type='pdf',
            file_path=pdf3_rel,
            language='kn',
            status='approved',
            uploader_id=admin.id,
            downloads_count=118,
            views_count=410
        )

        res4 = Resource(
            title="Class 8 Science: Force and Pressure Illustrated Guide",
            title_kn="೮ನೇ ತರಗತಿ ವಿಜ್ಞಾನ: ಬಲ ಮತ್ತು ಒತ್ತಡ ಸಚಿತ್ರ ಟಿಪ್ಪಣಿ",
            description="Conceptual explanations of contact and non-contact forces, atmospheric pressure, and everyday applications.",
            class_id=c8.id,
            subject_id=sub_map[(c8.id, 'Science')].id,
            category_id=cat_notes.id,
            resource_type='pdf',
            file_path=pdf4_rel,
            language='bilingual',
            status='approved',
            uploader_id=teacher.id,
            downloads_count=29,
            views_count=112
        )

        res5_video = Resource(
            title="Interactive Experiment: Laws of Motion in Action",
            title_kn="ಪ್ರಾಯೋಗಿಕ ಕಲಿಕೆ: ನ್ಯೂಟನ್ ಚಲನೆಯ ನಿಯಮಗಳ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ",
            description="High-definition demonstration of inertia, momentum, and action-reaction pairs using low-cost lab apparatus.",
            class_id=c9.id,
            subject_id=sci9.id,
            chapter_id=ch_sci9_3.id,
            category_id=cat_video.id,
            resource_type='video',
            video_url="https://www.youtube.com/watch?v=kKKM8Y-u7ds",
            language='en',
            status='approved',
            uploader_id=teacher.id,
            views_count=98
        )

        # Pending Resource (For testing Admin approval workflow!)
        res_pending = Resource(
            title="Class 9 Science: Motion Worksheets & Numerical Problems",
            title_kn="೯ನೇ ತರಗತಿ ವಿಜ್ಞಾನ: ಚಲನೆಯ ಲೆಕ್ಕಾಚಾರಗಳು ಹಾಗೂ ಕಾರ್ಯಹಾಳೆ",
            description="20 solved numerical problems on velocity, acceleration, and equations of motion awaiting verification.",
            class_id=c9.id,
            subject_id=sci9.id,
            chapter_id=ch_sci9_3.id,
            category_id=cat_worksheet.id,
            resource_type='pdf',
            file_path=pdf1_rel,
            language='en',
            status='pending',
            uploader_id=teacher.id,
            views_count=0
        )

        db.session.add_all([res1, res2, res3, res4, res5_video, res_pending])
        db.session.flush()

        # 8. Seed Functional Quizzes & Questions
        print("Seeding functional quizzes with MCQ questions and answer explanations...")
        
        # Quiz 1: Class 9 Science (Cell Biology)
        q1 = Quiz(
            title="Class 9 Science: Cell Biology Mastery Quiz",
            title_kn="೯ನೇ ತರಗತಿ ವಿಜ್ಞಾನ: ಜೀವಕೋಶ ರಸಪ್ರಶ್ನೆ",
            instructions="Answer all 4 questions. Each question carries 1 mark. Select the single best option.",
            class_id=c9.id,
            subject_id=sci9.id,
            chapter_id=ch_sci9_2.id,
            teacher_id=teacher.id,
            duration_minutes=10,
            is_published=True
        )
        db.session.add(q1)
        db.session.flush()

        # Q1.1
        ques1 = Question(
            quiz_id=q1.id,
            question_text="Which organelle is universally known as the 'powerhouse of the cell'?",
            question_text_kn="ಜೀವಕೋಶದ ಶಕ್ತಿ ಕೇಂದ್ರ (Powerhouse of the Cell) ಎಂದು ಯಾವುದನ್ನು ಕರೆಯುತ್ತಾರೆ?",
            explanation="Mitochondria produce ATP (adenosine triphosphate) molecules through cellular respiration, storing energy for cellular tasks.",
            marks=1,
            order_num=1
        )
        db.session.add(ques1)
        db.session.flush()
        db.session.add_all([
            QuizOption(question_id=ques1.id, option_text="Ribosome", option_text_kn="ರೈಬೋಸೋಮ್", is_correct=False, order_num=1),
            QuizOption(question_id=ques1.id, option_text="Mitochondria", option_text_kn="ಮೈಟೋಕಾಂಡ್ರಿಯಾ", is_correct=True, order_num=2),
            QuizOption(question_id=ques1.id, option_text="Golgi Apparatus", option_text_kn="ಗಾಲ್ಗಿ ಸಂಕೀರ್ಣ", is_correct=False, order_num=3),
            QuizOption(question_id=ques1.id, option_text="Chloroplast", option_text_kn="ಹರಿತ್ಕಣ", is_correct=False, order_num=4),
        ])

        # Q1.2
        ques2 = Question(
            quiz_id=q1.id,
            question_text="Who first coined the term 'Cell' and observed cork slices in 1665?",
            question_text_kn="೧೬೬೫ ರಲ್ಲಿ ಕಾರ್ಕ್ ತುಂಡಿನಲ್ಲಿ ಜೀವಕೋಶಗಳನ್ನು ಮೊದಲ ಬಾರಿಗೆ ವೀಕ್ಷಿಸಿದ ವಿಜ್ಞಾನಿ ಯಾರು?",
            explanation="Robert Hooke observed dead cork cells under his self-designed microscope in 1665.",
            marks=1,
            order_num=2
        )
        db.session.add(ques2)
        db.session.flush()
        db.session.add_all([
            QuizOption(question_id=ques2.id, option_text="Robert Hooke", option_text_kn="ರಾಬರ್ಟ್ ಹುಕ್", is_correct=True, order_num=1),
            QuizOption(question_id=ques2.id, option_text="Robert Brown", option_text_kn="ರಾಬರ್ಟ್ ಬ್ರೌನ್", is_correct=False, order_num=2),
            QuizOption(question_id=ques2.id, option_text="Louis Pasteur", option_text_kn="ಲೂಯಿ ಪಾಶ್ಚರ್", is_correct=False, order_num=3),
            QuizOption(question_id=ques2.id, option_text="Charles Darwin", option_text_kn="ಚಾರ್ಲ್ಸ್ ಡಾರ್ವಿನ್", is_correct=False, order_num=4),
        ])

        # Q1.3
        ques3 = Question(
            quiz_id=q1.id,
            question_text="Which organelle contains powerful digestive enzymes and is nicknamed the 'Suicide Bag'?",
            question_text_kn="ಜೀವಕೋಶದ ಆತ್ಮಹತ್ಯಾ ಸಂಚಿಗಳು (Suicide Bags) ಎಂದು ಯಾವ ಅಂಗಕವನ್ನು ಕರೆಯುತ್ತಾರೆ?",
            explanation="Lysosomes contain hydro-lytic enzymes that digest foreign materials and can rupture to digest their own damaged cell.",
            marks=1,
            order_num=3
        )
        db.session.add(ques3)
        db.session.flush()
        db.session.add_all([
            QuizOption(question_id=ques3.id, option_text="Centrosome", option_text_kn="ಸೆಂಟ್ರೋಸೋಮ್", is_correct=False, order_num=1),
            QuizOption(question_id=ques3.id, option_text="Vacuole", option_text_kn="ರಸದಾನಿ", is_correct=False, order_num=2),
            QuizOption(question_id=ques3.id, option_text="Lysosome", option_text_kn="ಲೈಸೋಸೋಮ್", is_correct=True, order_num=3),
            QuizOption(question_id=ques3.id, option_text="Plastid", option_text_kn="ಪ್ಲಾಸ್ಟಿಡ್", is_correct=False, order_num=4),
        ])

        # Q1.4
        ques4 = Question(
            quiz_id=q1.id,
            question_text="The cell wall of plants is primarily composed of which complex carbohydrate?",
            question_text_kn="ಸಸ್ಯ ಜೀವಕೋಶದ ಕೋಶಭಿತ್ತಿಯು ಮುಖ್ಯವಾಗಿ ಯಾವ ಪದಾರ್ಥದಿಂದ ರಚಿಸಲ್ಪಟ್ಟಿದೆ?",
            explanation="Cellulose is a complex structural carbohydrate that provides tensile strength and rigidity to plant cell walls.",
            marks=1,
            order_num=4
        )
        db.session.add(ques4)
        db.session.flush()
        db.session.add_all([
            QuizOption(question_id=ques4.id, option_text="Cellulose", option_text_kn="ಸೆಲ್ಯುಲೋಸ್", is_correct=True, order_num=1),
            QuizOption(question_id=ques4.id, option_text="Starch", option_text_kn="ಪಿಷ್ಟ", is_correct=False, order_num=2),
            QuizOption(question_id=ques4.id, option_text="Glycogen", option_text_kn="ಗ್ಲೈಕೋಜೆನ್", is_correct=False, order_num=3),
            QuizOption(question_id=ques4.id, option_text="Chitin", option_text_kn="ಕೈಟಿನ್", is_correct=False, order_num=4),
        ])

        # Quiz 2: Class 10 Math (Real Numbers)
        q2 = Quiz(
            title="Class 10 Math: Real Numbers & Euclid Lemma",
            title_kn="೧೦ನೇ ತರಗತಿ ಗಣಿತ: ವಾಸ್ತವ ಸಂಖ್ಯೆಗಳು",
            instructions="Time limit: 12 minutes. Tests HCF, LCM, and prime factorization concepts.",
            class_id=c10.id,
            subject_id=math10.id,
            chapter_id=ch_math10_1.id,
            teacher_id=teacher.id,
            duration_minutes=12,
            is_published=True
        )
        db.session.add(q2)
        db.session.flush()

        # Q2.1
        ques2_1 = Question(
            quiz_id=q2.id,
            question_text="If HCF(306, 657) = 9, what is the LCM(306, 657)?",
            question_text_kn="ಮ.ಸಾ.ಅ (೩೦೬, ೬೫೭) = ೯ ಆದರೆ, ಲ.ಸಾ.ಅ (೩೦೬, ೬೫೭) ಎಷ್ಟು?",
            explanation="LCM = (Product of numbers) / HCF = (306 × 657) / 9 = 22,338.",
            marks=1,
            order_num=1
        )
        db.session.add(ques2_1)
        db.session.flush()
        db.session.add_all([
            QuizOption(question_id=ques2_1.id, option_text="22,338", option_text_kn="೨೨,೩೩೮", is_correct=True, order_num=1),
            QuizOption(question_id=ques2_1.id, option_text="18,450", option_text_kn="೧೮,೪೫೦", is_correct=False, order_num=2),
            QuizOption(question_id=ques2_1.id, option_text="24,192", option_text_kn="೨೪,೧೯೨", is_correct=False, order_num=3),
            QuizOption(question_id=ques2_1.id, option_text="29,540", option_text_kn="೨೯,೫೪೦", is_correct=False, order_num=4),
        ])

        # Q2.2
        ques2_2 = Question(
            quiz_id=q2.id,
            question_text="Which of the following numbers is an irrational number?",
            question_text_kn="ಕೆಳಗಿನವುಗಳಲ್ಲಿ ಯಾವುದು ಅಭಾಗಲಬ್ಧ ಸಂಖ್ಯೆ (Irrational Number)?",
            explanation="√3 cannot be written as a ratio of two integers p/q, hence it is irrational. In contrast, √4 = 2 and √9 = 3.",
            marks=1,
            order_num=2
        )
        db.session.add(ques2_2)
        db.session.flush()
        db.session.add_all([
            QuizOption(question_id=ques2_2.id, option_text="√4", option_text_kn="√೪", is_correct=False, order_num=1),
            QuizOption(question_id=ques2_2.id, option_text="√9", option_text_kn="√೯", is_correct=False, order_num=2),
            QuizOption(question_id=ques2_2.id, option_text="√3", option_text_kn="√೩", is_correct=True, order_num=3),
            QuizOption(question_id=ques2_2.id, option_text="0.25", option_text_kn="೦.೨೫", is_correct=False, order_num=4),
        ])

        # Q2.3
        ques2_3 = Question(
            quiz_id=q2.id,
            question_text="For a rational number p/q to have a terminating decimal, the prime factors of q must be of the form:",
            question_text_kn="p/q ಭಾಗಲಬ್ಧ ಸಂಖ್ಯೆಯು ಅಂತ್ಯಗೊಳ್ಳುವ ದಶಮಾಂಶವಾಗಲು q ನ ಅವಿಭಾಜ್ಯ ಅಪವರ್ತನಗಳು ಯಾವ ರೂಪದಲ್ಲಿರಬೇಕು?",
            explanation="A rational number has a terminating decimal expansion if and only if the denominator q can be factored as 2^n * 5^m.",
            marks=1,
            order_num=3
        )
        db.session.add(ques2_3)
        db.session.flush()
        db.session.add_all([
            QuizOption(question_id=ques2_3.id, option_text="2^n · 5^m", option_text_kn="೨^n · ೫^m", is_correct=True, order_num=1),
            QuizOption(question_id=ques2_3.id, option_text="3^n · 7^m", option_text_kn="೩^n · ೭^m", is_correct=False, order_num=2),
            QuizOption(question_id=ques2_3.id, option_text="2^n · 3^m", option_text_kn="೨^n · ೩^m", is_correct=False, order_num=3),
            QuizOption(question_id=ques2_3.id, option_text="Only odd primes", option_text_kn="ಕೇವಲ ಬೆಸ ಅವಿಭಾಜ್ಯಗಳು", is_correct=False, order_num=4),
        ])

        # Quiz 3: Class 9 Math (Number Systems)
        q3 = Quiz(
            title="Class 9 Math: Number Systems Foundation Test",
            title_kn="೯ನೇ ತರಗತಿ ಗಣಿತ: ಸಂಖ್ಯಾ ಪದ್ಧತಿಗಳು",
            instructions="Time limit: 10 minutes. Basic definitions of rational, natural, and whole numbers.",
            class_id=c9.id,
            subject_id=math9.id,
            chapter_id=ch_math9_1.id,
            teacher_id=teacher.id,
            duration_minutes=10,
            is_published=True
        )
        db.session.add(q3)
        db.session.flush()

        # Q3.1
        ques3_1 = Question(
            quiz_id=q3.id,
            question_text="Is zero (0) a rational number?",
            question_text_kn="ಸೊನ್ನೆ (೦) ಒಂದು ಭಾಗಲಬ್ಧ ಸಂಖ್ಯೆಯೇ?",
            explanation="Yes, 0 can be written in p/q form as 0/1 or 0/5, where q ≠ 0.",
            marks=1,
            order_num=1
        )
        db.session.add(ques3_1)
        db.session.flush()
        db.session.add_all([
            QuizOption(question_id=ques3_1.id, option_text="Yes, because 0 = 0/1", option_text_kn="ಹೌದು, ಏಕೆಂದರೆ ೦ = ೦/೧", is_correct=True, order_num=1),
            QuizOption(question_id=ques3_1.id, option_text="No, zero cannot be divided", option_text_kn="ಇಲ್ಲ, ಸೊನ್ನೆಯನ್ನು ಭಾಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ", is_correct=False, order_num=2),
            QuizOption(question_id=ques3_1.id, option_text="Only in complex numbers", option_text_kn="ಕೇವಲ ಸಂಕೀರ್ಣ ಸಂಖ್ಯೆಗಳಲ್ಲಿ", is_correct=False, order_num=3),
            QuizOption(question_id=ques3_1.id, option_text="None of the above", option_text_kn="ಮೇಲಿನ ಯಾವುದೂ ಅಲ್ಲ", is_correct=False, order_num=4),
        ])

        # Q3.2
        ques3_2 = Question(
            quiz_id=q3.id,
            question_text="How many rational numbers exist between any two distinct rational numbers?",
            question_text_kn="ಯಾವುದೇ ಎರಡು ಭಾಗಲಬ್ಧ ಸಂಖ್ಯೆಗಳ ನಡುವೆ ಎಷ್ಟು ಭಾಗಲಬ್ಧ ಸಂಖ್ಯೆಗಳು ಇರುತ್ತವೆ?",
            explanation="Between any two rational numbers, there are infinitely many rational numbers (density property of rationals).",
            marks=1,
            order_num=2
        )
        db.session.add(ques3_2)
        db.session.flush()
        db.session.add_all([
            QuizOption(question_id=ques3_2.id, option_text="Infinitely many", option_text_kn="ಅನಂತ ಸಂಖ್ಯೆಯಷ್ಟು", is_correct=True, order_num=1),
            QuizOption(question_id=ques3_2.id, option_text="Exactly 10", option_text_kn="ಖಚಿತವಾಗಿ ೧೦", is_correct=False, order_num=2),
            QuizOption(question_id=ques3_2.id, option_text="Exactly 100", option_text_kn="ಖಚಿತವಾಗಿ ೧೦೦", is_correct=False, order_num=3),
            QuizOption(question_id=ques3_2.id, option_text="None", option_text_kn="ಯಾವುದೂ ಇಲ್ಲ", is_correct=False, order_num=4),
        ])

        # Q3.3
        ques3_3 = Question(
            quiz_id=q3.id,
            question_text="What is the value of (√5 + √2)(√5 - √2)?",
            question_text_kn="(√೫ + √೨)(√೫ - √೨) ನ ಬೆಲೆ ಎಷ್ಟು?",
            explanation="Using the identity (a + b)(a - b) = a^2 - b^2, we get (√5)^2 - (√2)^2 = 5 - 2 = 3.",
            marks=1,
            order_num=3
        )
        db.session.add(ques3_3)
        db.session.flush()
        db.session.add_all([
            QuizOption(question_id=ques3_3.id, option_text="3", option_text_kn="೩", is_correct=True, order_num=1),
            QuizOption(question_id=ques3_3.id, option_text="7", option_text_kn="೭", is_correct=False, order_num=2),
            QuizOption(question_id=ques3_3.id, option_text="√10", option_text_kn="√೧೦", is_correct=False, order_num=3),
            QuizOption(question_id=ques3_3.id, option_text="5", option_text_kn="೫", is_correct=False, order_num=4),
        ])

        # 9. Seed School Announcements
        print("Seeding school announcements...")
        a1 = Announcement(
            title="Karnataka State Board SSLC Preparatory Exam Dates Announced",
            title_kn="ಕರ್ನಾಟಕ ಎಸ್‌ಎಸ್‌ಎಲ್‌ಸಿ ಪೂರ್ವಸಿದ್ಧತಾ ಪರೀಕ್ಷಾ ವೇಳಾಪಟ್ಟಿ ಪ್ರಕಟಣೆ",
            message="The preparatory examinations for Class 10 will commence on March 15th. Students are advised to revise question papers and take chapter quizzes on VidyaSetu.",
            message_kn="೧೦ನೇ ತರಗತಿಯ ಪೂರ್ವಸಿದ್ಧತಾ ಪರೀಕ್ಷೆಗಳು ಮಾರ್ಚ್ ೧೫ ರಿಂದ ಆರಂಭವಾಗಲಿವೆ. ವಿದ್ಯಾರ್ಥಿಗಳು ವಿದ್ಯಾಸೇತು ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಲಭ್ಯವಿರುವ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಲು ಸೂಚಿಸಲಾಗಿದೆ.",
            target_role='all',
            is_active=True,
            creator_id=admin.id
        )

        a2 = Announcement(
            title="Community Textbook Donation Drive this Saturday",
            title_kn="ಈ ಶನಿವಾರ ಶಾಲೆಯಲ್ಲಿ ಉಚಿತ ಪುಸ್ತಕ ಸಂಗ್ರಹ ಮತ್ತು ದಾನ ಶಿಬಿರ",
            message="Alumni and community citizens are invited to donate Class 8-10 reference guides and storybooks for the school library corner.",
            message_kn="ಹಳೆ ವಿದ್ಯಾರ್ಥಿಗಳು ಮತ್ತು ಸಾರ್ವಜನಿಕರು ಶಾಲಾ ಗ್ರಂಥಾಲಯಕ್ಕೆ ೮ ರಿಂದ ೧೦ನೇ ತರಗತಿಯ ಪೂರಕ ಪುಸ್ತಕಗಳನ್ನು ದಾನ ಮಾಡಲು ಕೋರಲಾಗಿದೆ.",
            target_role='all',
            is_active=True,
            creator_id=admin.id
        )
        db.session.add_all([a1, a2])

        # 10. Seed Sample Student Activity & Bookmarks
        print("Seeding sample student progress, bookmarks, and activity logs...")
        # Bookmarks
        bm1 = Bookmark(user_id=student1.id, resource_id=res1.id)
        bm2 = Bookmark(user_id=student1.id, resource_id=res2.id)
        db.session.add_all([bm1, bm2])

        # Chapter completion
        prog1 = ChapterProgress(student_id=student1.id, chapter_id=ch_sci9_1.id, is_completed=True, completed_at=datetime.utcnow() - timedelta(days=3))
        prog2 = ChapterProgress(student_id=student1.id, chapter_id=ch_sci9_2.id, is_completed=True, completed_at=datetime.utcnow() - timedelta(days=1))
        db.session.add_all([prog1, prog2])

        # Completed quiz attempt for student1
        attempt1 = QuizAttempt(
            quiz_id=q1.id,
            student_id=student1.id,
            started_at=datetime.utcnow() - timedelta(days=1, hours=2),
            completed_at=datetime.utcnow() - timedelta(days=1, hours=1, minutes=50),
            score=4,
            max_score=4,
            percentage=100.0,
            is_completed=True
        )
        db.session.add(attempt1)
        db.session.flush()

        # Seed student answers for attempt1
        # Correct answers for all 4 questions in Q1: ques1 -> opt2, ques2 -> opt1, ques3 -> opt3, ques4 -> opt1
        opt_q1 = QuizOption.query.filter_by(question_id=ques1.id, is_correct=True).first()
        opt_q2 = QuizOption.query.filter_by(question_id=ques2.id, is_correct=True).first()
        opt_q3 = QuizOption.query.filter_by(question_id=ques3.id, is_correct=True).first()
        opt_q4 = QuizOption.query.filter_by(question_id=ques4.id, is_correct=True).first()

        db.session.add_all([
            StudentAnswer(attempt_id=attempt1.id, question_id=ques1.id, selected_option_id=opt_q1.id, is_correct=True),
            StudentAnswer(attempt_id=attempt1.id, question_id=ques2.id, selected_option_id=opt_q2.id, is_correct=True),
            StudentAnswer(attempt_id=attempt1.id, question_id=ques3.id, selected_option_id=opt_q3.id, is_correct=True),
            StudentAnswer(attempt_id=attempt1.id, question_id=ques4.id, selected_option_id=opt_q4.id, is_correct=True)
        ])

        # Seed audit activity logs
        logs = [
            ActivityLog(user_id=admin.id, action='SYSTEM_INITIALIZED', details='Platform seeded with Karnataka curriculum for Classes 8, 9 and 10.', ip_address='127.0.0.1'),
            ActivityLog(user_id=teacher.id, action='RESOURCE_UPLOADED', details='Uploaded Cell Biology Notes (Class 9).', ip_address='127.0.0.1'),
            ActivityLog(user_id=admin.id, action='RESOURCE_APPROVED', details='Approved Cell Biology Notes.', ip_address='127.0.0.1'),
            ActivityLog(user_id=student1.id, action='QUIZ_COMPLETED', details='Completed Cell Biology Quiz with score 4/4 (100%).', ip_address='127.0.0.1')
        ]
        db.session.add_all(logs)

        db.session.commit()
        print("\n[SUCCESS] Database seeding successfully completed!")
        print("--------------------------------------------------")
        print("Demonstration Accounts:")
        print("  * Administrator: admin@school.demo    (Password: Admin@123)")
        print("  * Teacher:       teacher@school.demo  (Password: Teacher@123)")
        print("  * Student:       student@school.demo  (Password: Student@123)")
        print("--------------------------------------------------")

if __name__ == '__main__':
    seed_database()
