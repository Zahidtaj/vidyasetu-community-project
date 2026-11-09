export const DEMO_USERS = {
  admin: {
    id: 1,
    role: 'admin',
    name: 'Dr. Nagaraj Bhat',
    designation: 'Principal and Platform Administrator',
    email: 'admin@school.demo',
    assignedClass: null
  },
  teacher: {
    id: 2,
    role: 'teacher',
    name: 'Smt. Shailaja Gowda',
    designation: 'Senior Science and Mathematics Faculty',
    email: 'teacher@school.demo',
    assignedClass: 'Class 9 and 10'
  },
  student: {
    id: 3,
    role: 'student',
    name: 'Chethan Kumar',
    designation: 'Class 9A, Roll No. 24',
    email: 'student@school.demo',
    assignedClass: 'Class 9'
  }
};

export const CLASSES = [
  { id: 'all', label: 'All Classes', labelKn: 'ಎಲ್ಲಾ ತರಗತಿಗಳು' },
  { id: 'c8', name: 'Class 8', labelKn: '೮ನೇ ತರಗತಿ', badge: 'Class 8' },
  { id: 'c9', name: 'Class 9', labelKn: '೯ನೇ ತರಗತಿ', badge: 'Class 9' },
  { id: 'c10', name: 'Class 10', labelKn: '೧೦ನೇ ತರಗತಿ (SSLC)', badge: 'Class 10' }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Resources', labelKn: 'ಎಲ್ಲಾ ಸಂಪನ್ಮೂಲಗಳು', icon: 'BookOpen' },
  { id: 'notes', label: 'Study Notes', labelKn: 'ಅಧ್ಯಯನ ಟಿಪ್ಪಣಿಗಳು', icon: 'FileText' },
  { id: 'textbook', label: 'Textbooks', labelKn: 'ಪಠ್ಯಪುಸ್ತಕಗಳು', icon: 'GraduationCap' },
  { id: 'qp', label: 'Question Papers', labelKn: 'ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು', icon: 'Award' },
  { id: 'video', label: 'Video Lessons', labelKn: 'ವಿಡಿಯೋ ಪಾಠಗಳು', icon: 'Video' },
  { id: 'quiz', label: 'Quizzes', labelKn: 'ಅಭ್ಯಾಸ ಪರೀಕ್ಷೆಗಳು', icon: 'HelpCircle' }
];

export const INITIAL_RESOURCES = [
  {
    id: 1,
    title: 'Class 9 Science: Cell Structure and Functions Laboratory Notes',
    titleKn: '೯ನೇ ತರಗತಿ ವಿಜ್ಞಾನ: ಜೀವಕೋಶದ ರಚನೆ ಹಾಗೂ ಕಾರ್ಯಗಳ ಟಿಪ್ಪಣಿ',
    subject: 'Science (Biology)',
    subjectKn: 'ವಿಜ್ಞಾನ',
    classId: 'c9',
    className: 'Class 9',
    category: 'notes',
    resourceType: 'pdf',
    language: 'Bilingual',
    status: 'approved',
    author: 'Smt. Shailaja Gowda (Government High School Faculty)',
    viewsCount: 248,
    downloadsCount: 84,
    uploadedOn: '2026-03-02',
    summary: 'Detailed laboratory and conceptual notes covering cell discovery by Robert Hooke (1665), cell theory formulations by Schleiden and Schwann (1839), plasma membrane transport mechanics, and cell organelle functions (Mitochondria, Golgi, Lysosomes).',
    chapters: [
      {
        title: 'Section 1: Discovery of the Cell and Cell Theory',
        content: `1. Historical Background:
Robert Hooke first observed cells in 1665 using an early compound microscope while examining thin sections of bottle cork. In 1674, Anton von Leeuwenhoek observed free-living cells in pond water with improved lenses. In 1831, Robert Brown discovered the cell nucleus.

2. Principles of Cell Theory:
Formulated by Matthias Schleiden (1838) and Theodor Schwann (1839):
(a) All living organisms are composed of one or more basic units called cells.
(b) The cell represents the fundamental structural and functional unit of living systems.
(c) Rudolf Virchow (1855) expanded the theory: "Omnis cellula e cellula", meaning all existing cells arise strictly from pre-existing cells through division.`
      },
      {
        title: 'Section 2: Organelle Architecture and Enzymatic Roles',
        content: `1. Mitochondria:
Synthesizes adenosine triphosphate (ATP) molecules through aerobic cellular respiration across folded inner cristae membranes. Termed the metabolic power center of the eukaryotic cell.

2. Lysosomes:
Membrane-bound vesicles holding hydrolytic acid enzymes active at pH 4.5 to 5.0. Responsible for intracellular waste clearance and autophagic recycling of damaged cellular organelles.

3. Endoplasmic Reticulum (ER):
Rough ER contains bound 80S ribosomes dedicated to nascent peptide translation and protein folding. Smooth ER facilitates lipid synthesis and hepatic detoxification pathways.

4. Golgi Apparatus:
Parallel flattened cisternae modifying, sorting, and dispatching synthesized glycoproteins into targeted transport vesicles.`
      }
    ]
  },
  {
    id: 2,
    title: 'Class 10 Mathematics: Real Numbers Theorem Proofs and Formulae',
    titleKn: '೧೦ನೇ ತರಗತಿ ಗಣಿತ: ವಾಸ್ತವ ಸಂಖ್ಯೆಗಳ ಪ್ರಮೇಯಗಳು ಮತ್ತು ಸೂತ್ರ ಸಂಗ್ರಹ',
    subject: 'Mathematics',
    subjectKn: 'ಗಣಿತ',
    classId: 'c10',
    className: 'Class 10',
    category: 'notes',
    resourceType: 'pdf',
    language: 'English',
    status: 'approved',
    author: 'DSERT Karnataka Curriculum Division',
    viewsCount: 382,
    downloadsCount: 142,
    uploadedOn: '2026-03-05',
    summary: 'Mathematical derivations and examination problem steps covering Euclid Division Lemma, Fundamental Theorem of Arithmetic (HCF × LCM = a × b), formal proof of irrationality for root 2, and decimal expansion termination criteria.',
    chapters: [
      {
        title: 'Section 1: Fundamental Theorem of Arithmetic',
        content: `Theorem Statement:
Every composite integer greater than 1 can be uniquely expressed as a product of prime numbers, up to the arrangement of the prime factors.

Core Mathematical Identity:
For any two positive integers a and b:
HCF(a, b) × LCM(a, b) = a × b

Solved Numerical Application:
Given HCF(306, 657) = 9:
LCM(306, 657) = (306 × 657) / 9
LCM(306, 657) = 201,042 / 9 = 22,338.`
      },
      {
        title: 'Section 2: Proof of Irrationality for Square Root 2',
        content: `Proof by Contradiction:
Assume root 2 is rational. Then root 2 = a / b, where a and b are co-prime integers (HCF(a, b) = 1) and b != 0.
Squaring both sides: 2 = a^2 / b^2 => 2 * b^2 = a^2.
Therefore, 2 divides a^2, which implies 2 divides a. Let a = 2k for some integer k.
Substituting: 2 * b^2 = (2k)^2 = 4k^2 => b^2 = 2k^2.
This implies 2 divides b^2, so 2 divides b.
Hence, 2 is a common factor of both a and b. This contradicts our initial premise that a and b are co-prime.
Therefore, root 2 is strictly irrational.`
      }
    ]
  },
  {
    id: 3,
    title: 'KSEAB SSLC 2026 Science Model Blueprint and Question Paper',
    titleKn: '೧೦ನೇ ತರಗತಿ ವಿಜ್ಞಾನ: ಎಸ್‌ಎಸ್‌ಎಲ್‌ಸಿ ಮಾದರಿ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ೨೦೨೬',
    subject: 'Science',
    subjectKn: 'ವಿಜ್ಞಾನ',
    classId: 'c10',
    className: 'Class 10',
    category: 'qp',
    resourceType: 'pdf',
    language: 'Kannada',
    status: 'approved',
    author: 'Karnataka School Examination and Assessment Board (KSEAB)',
    viewsCount: 512,
    downloadsCount: 220,
    uploadedOn: '2026-03-08',
    summary: 'Official model examination paper issued by the Karnataka State Board with sectional blueprint mark distributions across Physics (28 marks), Chemistry (25 marks), and Biology (27 marks).',
    chapters: [
      {
        title: 'Section A: Multiple Choice Questions (1 Mark Each)',
        content: `Question 1:
An electric lamp is rated 220 V and 100 W. When operated on 110 V, the electrical power consumed is:
(A) 100 W
(B) 75 W
(C) 50 W
(D) 25 W
Correct Answer: (D) 25 W. Solution: R = V^2 / P = 220^2 / 100 = 484 Ohms. New Power P' = (110)^2 / 484 = 25 W.

Question 2:
The corrosion of iron metal when exposed to atmospheric moisture is an example of which chemical reaction?
(A) Reduction only
(B) Redox (Oxidation-Reduction) reaction
(C) Thermal decomposition
(D) Single displacement
Correct Answer: (B) Redox reaction.`
      }
    ]
  },
  {
    id: 4,
    title: 'Laboratory Demonstration: Experimental Verification of Newton Laws of Motion',
    titleKn: 'ಪ್ರಾಯೋಗಿಕ ಕಲಿಕೆ: ನ್ಯೂಟನ್ ಚಲನೆಯ ನಿಯಮಗಳ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ',
    subject: 'Science (Physics)',
    subjectKn: 'ವಿಜ್ಞಾನ',
    classId: 'c9',
    className: 'Class 9',
    category: 'video',
    resourceType: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=kKKM8Y-u7ds',
    language: 'English',
    status: 'approved',
    author: 'State Educational Technology Cell',
    viewsCount: 310,
    downloadsCount: 0,
    uploadedOn: '2026-03-06',
    summary: 'Physical apparatus demonstrations for inertia of rest, uniform acceleration, and Newton third law action-reaction force pairs using linear air tracks and spring balances.',
    chapters: [
      {
        title: 'Experimental Protocol and Observations',
        content: `1. First Law of Motion (Inertia):
A body maintains its velocity vector unless acted upon by an unbalanced external force vector. Mass acts as the quantitative scalar measure of inertia.

2. Second Law of Motion:
The net force acting on a particle is equal to the time rate of change of its linear momentum: F = dp/dt = m * a (for invariant mass).

3. Third Law of Motion:
Whenever entity A exerts a force on entity B, entity B simultaneously exerts an equal and oppositely directed force on entity A: F_AB = -F_BA.`
      }
    ]
  },
  {
    id: 5,
    title: 'Class 8 Science: Force and Pressure Mathematical Foundations',
    titleKn: '೮ನೇ ತರಗತಿ ವಿಜ್ಞಾನ: ಬಲ ಮತ್ತು ಒತ್ತಡ ಸಚಿತ್ರ ಟಿಪ್ಪಣಿ',
    subject: 'Science',
    subjectKn: 'ವಿಜ್ಞಾನ',
    classId: 'c8',
    className: 'Class 8',
    category: 'notes',
    resourceType: 'pdf',
    language: 'Bilingual',
    status: 'approved',
    author: 'Karnataka State Science Forum',
    viewsCount: 165,
    downloadsCount: 46,
    uploadedOn: '2026-03-04',
    summary: 'Quantitative definitions for contact forces, electrostatic forces, gravitational acceleration, and atmospheric pressure formulas with standard SI unit conversions.',
    chapters: [
      {
        title: 'Section 1: Force and Pressure Formulations',
        content: `Definition:
Pressure is the scalar quotient of perpendicular normal thrust divided by contact surface area:
P = F / A (SI Unit: Pascal = 1 N/m^2).

Practical Engineering Applications:
1. Cutting instruments: Knife edges maintain sharp cross-sectional areas to maximize local pressure for given mechanical input.
2. Foundation engineering: Broad concrete pilings expand contact area to reduce ground-bearing pressure under structural dead loads.`
      }
    ]
  },
  {
    id: 6,
    title: 'Class 9 Science: Linear Kinematics Numerical Problem Bank',
    titleKn: '೯ನೇ ತರಗತಿ ವಿಜ್ಞಾನ: ಚಲನೆಯ ಲೆಕ್ಕಾಚಾರಗಳು ಹಾಗೂ ಕಾರ್ಯಹಾಳೆ',
    subject: 'Science',
    subjectKn: 'ವಿಜ್ಞಾನ',
    classId: 'c9',
    className: 'Class 9',
    category: 'notes',
    resourceType: 'pdf',
    language: 'English',
    status: 'pending',
    author: 'Smt. Shailaja Gowda (Government High School Faculty)',
    viewsCount: 0,
    downloadsCount: 0,
    uploadedOn: '2026-03-09',
    summary: 'Twenty structured numerical calculations on velocity, uniform acceleration, and velocity-time graph area integrals awaiting institutional administration verification.',
    chapters: [
      {
        title: 'Review Material Outline',
        content: `Numerical evaluation set covering standard kinematic equations of motion:
1. v = u + a * t
2. s = u * t + 0.5 * a * t^2
3. v^2 = u^2 + 2 * a * s
Includes graph derivation problems for secondary school examinations.`
      }
    ]
  }
];

export const INITIAL_QUIZZES = [
  {
    id: 1,
    title: 'Class 9 Science: Cell Biology Assessment',
    titleKn: '೯ನೇ ತರಗತಿ ವಿಜ್ಞಾನ: ಜೀವಕೋಶ ರಸಪ್ರಶ್ನೆ',
    classId: 'c9',
    className: 'Class 9',
    subject: 'Science',
    durationMinutes: 10,
    questions: [
      {
        id: 101,
        question: "Which cell organelle is responsible for ATP synthesis via aerobic cellular respiration?",
        questionKn: "ಜೀವಕೋಶದಲ್ಲಿ ಶಕ್ತಿಯನ್ನು (ATP) ಉತ್ಪಾದಿಸುವ ಅಂಗಕ ಯಾವುದು?",
        options: [
          { id: 1, text: "Ribosome" },
          { id: 2, text: "Mitochondria", isCorrect: true },
          { id: 3, text: "Golgi Complex" },
          { id: 4, text: "Chloroplast" }
        ],
        explanation: "Mitochondria contain respiratory enzymes across inner cristae membranes that produce adenosine triphosphate (ATP) molecules during cellular respiration."
      },
      {
        id: 102,
        question: "Which investigator first recorded micro-anatomical cork cell boundaries in 1665?",
        questionKn: "೧೬೬೫ ರಲ್ಲಿ ಕಾರ್ಕ್ ತುಂಡಿನಲ್ಲಿ ಕೋಶ ರಚನೆಯನ್ನು ದಾಖಲಿಸಿದ ವಿಜ್ಞಾನಿ ಯಾರು?",
        options: [
          { id: 1, text: "Robert Hooke", isCorrect: true },
          { id: 2, text: "Robert Brown" },
          { id: 3, text: "Louis Pasteur" },
          { id: 4, text: "Gregor Mendel" }
        ],
        explanation: "Robert Hooke utilized a compound lens system to document cell structures in dead bottle cork tissues in his 1665 treatise Micrographia."
      },
      {
        id: 103,
        question: "Which organelle houses acid hydrolases capable of cellular self-digestion?",
        questionKn: "ಜೀರ್ಣಕಾರಿ ಕಿಣ್ವಗಳನ್ನು ಹೊಂದಿರುವ ಜೀವಕೋಶದ ಅಂಗಕ ಯಾವುದು?",
        options: [
          { id: 1, text: "Centrosome" },
          { id: 2, text: "Vacuole" },
          { id: 3, text: "Lysosome", isCorrect: true },
          { id: 4, text: "Plastid" }
        ],
        explanation: "Lysosomes contain acidic hydrolytic enzymes that break down metabolic waste. Under severe cellular trauma, lysosomal rupture digests the host cell."
      },
      {
        id: 104,
        question: "What is the primary structural carbohydrate forming the plant cell wall?",
        questionKn: "ಸಸ್ಯ ಕೋಶಭಿತ್ತಿಯು ಮುಖ್ಯವಾಗಿ ಯಾವ ಕಾರ್ಬೋಹೈಡ್ರೇಟ್‌ನಿಂದ ರಚಿತವಾಗಿದೆ?",
        options: [
          { id: 1, text: "Cellulose", isCorrect: true },
          { id: 2, text: "Starch" },
          { id: 3, text: "Glycogen" },
          { id: 4, text: "Chitin" }
        ],
        explanation: "Cellulose is an unbranched polymer of beta-glucose units that provides mechanical rigidity against internal osmotic turgor pressure in plant cells."
      }
    ]
  },
  {
    id: 2,
    title: 'Class 10 Mathematics: Real Numbers and Fundamental Arithmetic',
    titleKn: '೧೦ನೇ ತರಗತಿ ಗಣಿತ: ವಾಸ್ತವ ಸಂಖ್ಯೆಗಳು',
    classId: 'c10',
    className: 'Class 10',
    subject: 'Mathematics',
    durationMinutes: 12,
    questions: [
      {
        id: 201,
        question: "If HCF(306, 657) = 9, what is the exact value of LCM(306, 657)?",
        questionKn: "ಮ.ಸಾ.ಅ (೩೦೬, ೬೫೭) = ೯ ಆದರೆ, ಲ.ಸಾ.ಅ (೩೦೬, ೬೫೭) ಎಷ್ಟು?",
        options: [
          { id: 1, text: "22,338", isCorrect: true },
          { id: 2, text: "18,450" },
          { id: 3, text: "24,192" },
          { id: 4, text: "29,540" }
        ],
        explanation: "By the Fundamental Theorem of Arithmetic identity: LCM = (a * b) / HCF = (306 * 657) / 9 = 22,338."
      },
      {
        id: 202,
        question: "Which of the following numbers satisfies the definition of an irrational number?",
        questionKn: "ಕೆಳಗಿನವುಗಳಲ್ಲಿ ಯಾವುದು ಅಭಾಗಲಬ್ಧ ಸಂಖ್ಯೆ?",
        options: [
          { id: 1, text: "Square root of 4 (= 2)" },
          { id: 2, text: "Square root of 9 (= 3)" },
          { id: 3, text: "Square root of 3", isCorrect: true },
          { id: 4, text: "0.25 (= 1/4)" }
        ],
        explanation: "The square root of 3 is a non-terminating, non-repeating decimal that cannot be expressed as a ratio p/q of co-prime integers."
      },
      {
        id: 203,
        question: "For a rational fraction p/q to yield a terminating decimal, the denominator prime factorization must be:",
        questionKn: "ಭಾಗಲಬ್ಧ ಸಂಖ್ಯೆ ಅಂತ್ಯಗೊಳ್ಳುವ ದಶಮಾಂಶವಾಗಲು ಛೇದದ ಅಪವರ್ತನಗಳು ಯಾವ ರೂಪದಲ್ಲಿರಬೇಕು?",
        options: [
          { id: 1, text: "2^n * 5^m (where n, m are non-negative integers)", isCorrect: true },
          { id: 2, text: "3^n * 7^m" },
          { id: 3, text: "2^n * 3^m" },
          { id: 4, text: "Multiples of prime number 7" }
        ],
        explanation: "A reduced rational fraction p/q terminates in decimal form if and only if prime factors of q consist strictly of powers of 2 and/or 5."
      }
    ]
  }
];

export const ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Karnataka State SSLC Preparatory Examination 2026 Timetable',
    titleKn: 'ಕರ್ನಾಟಕ ಎಸ್‌ಎಸ್‌ಎಲ್‌ಸಿ ಪೂರ್ವಸಿದ್ಧತಾ ಪರೀಕ್ಷಾ ವೇಳಾಪಟ್ಟಿ ಪ್ರಕಟಣೆ',
    message: 'Preparatory board examinations for Class 10 will begin on March 15th across designated government high schools. Practice question papers and answer blueprints are accessible in the repository.',
    messageKn: '೧೦ನೇ ತರಗತಿಯ ಪೂರ್ವಸಿದ್ಧತಾ ಪರೀಕ್ಷೆಗಳು ಮಾರ್ಚ್ ೧೫ ರಿಂದ ಆರಂಭವಾಗಲಿವೆ. ವಿದ್ಯಾರ್ಥಿಗಳು ವಿದ್ಯಾಸೇತು ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಲಭ್ಯವಿರುವ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಲು ಸೂಚಿಸಲಾಗಿದೆ.',
    date: '2026-03-08',
    target: 'All Students and Faculty'
  },
  {
    id: 2,
    title: 'DSERT Supplementary Mathematics Workbook Release',
    titleKn: 'ಡಿಎಸ್‌ಇಆರ್‌ಟಿ ಗಣಿತ ಪೂರಕ ಅಭ್ಯಾಸ ಪುಸ್ತಕ ಪ್ರಕಟಣೆ',
    message: 'Supplementary exercise modules for Class 9 and 10 Mathematics have been uploaded by state subject committees. Hard copies are distributed to rural school reading desks.',
    messageKn: '೯ ಮತ್ತು ೧೦ನೇ ತರಗತಿಯ ಗಣಿತ ಪೂರಕ ಅಭ್ಯಾಸ ಪುಸ್ತಕಗಳನ್ನು ಬಿಡುಗಡೆ ಮಾಡಲಾಗಿದೆ.',
    date: '2026-03-06',
    target: 'Mathematics Department'
  }
];

export const INITIAL_QUIZ_ATTEMPTS = [
  {
    id: 1,
    studentName: 'Chethan Kumar',
    studentEmail: 'student@school.demo',
    quizId: 1,
    quizTitle: 'Class 9 Science: Cell Biology Assessment',
    score: 3,
    totalQuestions: 4,
    percentage: 75,
    date: '2026-03-08 11:30'
  },
  {
    id: 2,
    studentName: 'Priya R.',
    studentEmail: 'priya@school.demo',
    quizId: 1,
    quizTitle: 'Class 9 Science: Cell Biology Assessment',
    score: 4,
    totalQuestions: 4,
    percentage: 100,
    date: '2026-03-08 14:15'
  },
  {
    id: 3,
    studentName: 'Chethan Kumar',
    studentEmail: 'student@school.demo',
    quizId: 2,
    quizTitle: 'Class 10 Mathematics: Real Numbers and Fundamental Arithmetic',
    score: 3,
    totalQuestions: 3,
    percentage: 100,
    date: '2026-03-09 10:20'
  }
];

export const INITIAL_USER_ACCOUNTS = [
  { id: 1, name: 'Dr. Nagaraj Bhat', email: 'admin@school.demo', role: 'admin', designation: 'Principal and Administrator', status: 'active', assignedClass: 'All Classes' },
  { id: 2, name: 'Smt. Shailaja Gowda', email: 'teacher@school.demo', role: 'teacher', designation: 'Senior Faculty', status: 'active', assignedClass: 'Class 9 and 10' },
  { id: 3, name: 'Sri. Ravi Kumar', email: 'ravi.math@school.demo', role: 'teacher', designation: 'Mathematics Faculty', status: 'active', assignedClass: 'Class 8 and 9' },
  { id: 4, name: 'Chethan Kumar', email: 'student@school.demo', role: 'student', designation: 'Class 9A, Roll 24', status: 'active', assignedClass: 'Class 9' },
  { id: 5, name: 'Priya R.', email: 'priya@school.demo', role: 'student', designation: 'Class 9B, Roll 12', status: 'active', assignedClass: 'Class 9' },
  { id: 6, name: 'Ananya S.', email: 'ananya.10@school.demo', role: 'student', designation: 'Class 10A, Roll 05', status: 'active', assignedClass: 'Class 10' }
];

export const INITIAL_AUDIT_LOGS = [
  { id: 1, action: 'Resource Uploaded', detail: 'Linear Kinematics problem bank submitted by Smt. Shailaja Gowda', timestamp: '2026-03-09 14:20', role: 'teacher' },
  { id: 2, action: 'Quiz Evaluated', detail: 'Chethan Kumar scored 100% in Real Numbers Assessment', timestamp: '2026-03-09 10:20', role: 'student' },
  { id: 3, action: 'Resource Approved', detail: 'Cell Biology Notes approved by Principal Bhat', timestamp: '2026-03-08 16:45', role: 'admin' },
  { id: 4, action: 'User Session Initiated', detail: 'Chethan Kumar authenticated via session cookie', timestamp: '2026-03-08 09:15', role: 'student' }
];

export const ACADEMIC_NOTICE = {
  titleEn: "Karnataka Secondary Education Examination Board (KSEAB) Repository",
  titleKn: "ಕರ್ನಾಟಕ ಪ್ರೌಢಶಿಕ್ಷಣ ಪರೀಕ್ಷಾ ಮಂಡಳಿ ಡಿಜಿಟಲ್ ಸಂಪನ್ಮೂಲ ವೇದಿಕೆ",
  textEn: "All curriculum resources, question banks, and chapter evaluations comply strictly with DSERT and KSEAB standards for Karnataka State Board High Schools (Classes 8, 9, 10).",
  textKn: "ಎಲ್ಲಾ ಪಠ್ಯಕ್ರಮ ಸಾಮಗ್ರಿಗಳು, ಪ್ರಶ್ನೆ ಕೋಶಗಳು ಮತ್ತು ಅಧ್ಯಾಯ ಮೌಲ್ಯಮಾಪನಗಳು ಡಿಎಸ್‌ಇಆರ್‌ಟಿ ಮತ್ತು ಕೆಎಸ್‌ಇಎಬಿ ಮಾನದಂಡಗಳಿಗೆ ಅನುಗುಣವಾಗಿವೆ."
};
