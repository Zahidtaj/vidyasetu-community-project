import React from 'react';
import { Shield, ArrowLeft, CheckCircle2, Lock, FileText, AlertCircle } from 'lucide-react';

export function PrivacyPolicy({ onBack, lang }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn text-slate-800 dark:text-slate-200">
      
      {/* Top back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{lang === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Repository'}</span>
      </button>

      {/* Header */}
      <div className="inst-panel p-6 sm:p-8 rounded-md mb-8 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
              {lang === 'kn' ? 'ಗೌಪ್ಯತಾ ನೀತಿ' : 'Institutional Privacy Policy'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Document Ref: VS-GOVT-DPDP-2026.01 | Effective Date: March 1, 2026
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
          VidyaSetu operates as a dedicated community academic platform supporting Karnataka State Government High Schools under VTU Community Project Course Code 1BCP308. This policy sets forth our standards for student data protection in adherence to the Digital Personal Data Protection Act (DPDP Act, India 2023) and Karnataka State School Education guidelines.
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-6 text-xs leading-relaxed">
        
        {/* Section 1 */}
        <div className="inst-card p-6 rounded-md">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <span>1. Scope and Institutional Purpose</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-2">
            VidyaSetu is deployed solely for non-commercial educational instruction, resource dissemination, and formative chapter assessments for high school students (Classes 8, 9, and 10) enrolled in government and aided institutions.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            This platform contains zero third-party commercial advertisements, zero user behavioral tracking scripts, and zero data monetization partnerships.
          </p>
        </div>

        {/* Section 2 */}
        <div className="inst-card p-6 rounded-md">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <span>2. Categories of Information Processed</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-300">
            <li><strong>Institutional Account Credentials:</strong> Student/Teacher school email address, assigned roll number, and hashed authentication strings.</li>
            <li><strong>Academic Progress Records:</strong> Quiz completion status, chapter test percentages, question-by-question responses, and evaluation timestamps.</li>
            <li><strong>Curriculum Interaction Logs:</strong> Bookmarked resource IDs and local file download timestamps utilized strictly for faculty progress verification.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="inst-card p-6 rounded-md">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <span>3. Cryptographic Storage and Access Controls</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-2">
            Student account passwords are encrypted prior to database persistence using PBKDF2 with SHA-256 and unique cryptographic salts. Passwords are never retrievable in plain text.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Role-Based Access Control (RBAC) enforces strict programmatic isolation: students cannot access peer academic scorecards or administrative functions, and faculty access is constrained to assigned academic sections.
          </p>
        </div>

        {/* Section 4 */}
        <div className="inst-card p-6 rounded-md">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <span>4. Student and Guardian Rights</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-2">
            Under the provisions of Section 11 of the DPDP Act 2023, students and their verified legal guardians retain the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
            <li>Inspect academic assessment records stored on the platform.</li>
            <li>Request rectification of inaccurate class assignment records.</li>
            <li>Request account deactivation or assessment history expungement through the school administrative desk.</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="inst-card p-6 rounded-md">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <span>5. Institutional Data Officer Contact</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-2">
            For governance inquiries or data protection requests regarding this platform:
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-700 dark:text-slate-300 font-mono text-[11px]">
            Nodal Officer: VTU Community Project Coordinator<br />
            Institution: Department of School Education and Literacy Collaboration Desk<br />
            Email: privacy@vidyasetu.gov.in (Academic Evaluation Cell)
          </div>
        </div>

      </div>

      {/* Footer Back */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
        <button
          onClick={onBack}
          className="px-5 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          {lang === 'kn' ? 'ಸ್ವೀಕರಿಸಿ ಮತ್ತು ಹಿಂತಿರುಗಿ' : 'Acknowledge and Return to Repository'}
        </button>
      </div>

    </div>
  );
}
