import React from 'react';
import { FileCheck, ArrowLeft, BookOpen, AlertCircle, Scale, ShieldAlert } from 'lucide-react';

export function TermsConditions({ onBack, lang }) {
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
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
              {lang === 'kn' ? 'ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು' : 'Institutional Terms and Conditions of Use'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Document Ref: VS-TERMS-VTU-2026.02 | Jurisdiction: Karnataka, India
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
          These Terms govern access to and utilization of the VidyaSetu Digital Educational Repository and Assessment Portal, established for Karnataka State Government High Schools under VTU Community Project 1BCP308. All students, teachers, and administrators agree to these terms upon authenticating.
        </p>
      </div>

      {/* Terms Sections */}
      <div className="space-y-6 text-xs leading-relaxed">
        
        {/* Clause 1 */}
        <div className="inst-card p-6 rounded-md">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            1. Authorized Educational Purpose and Fair Use
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-2">
            All curriculum documents, notes, question papers, and laboratory outlines published on VidyaSetu are strictly dedicated to non-commercial academic study by enrolled Karnataka high school students (Classes 8, 9, and 10) and accredited government school faculty.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Users may download, print, and study permitted digital materials for personal academic revision. Systematic extraction, redistribution for commercial profit, or resale of any resource hosted herein is strictly prohibited under the Indian Copyright Act (Section 52 Fair Dealing for Educational Instruction).
          </p>
        </div>

        {/* Clause 2 */}
        <div className="inst-card p-6 rounded-md">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            2. Academic Integrity in Quiz Evaluations
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-2">
            The chapter-wise assessment engine is engineered for formative student progress evaluation. By submitting an assessment, students affirm that all responses are submitted independently without unauthorized electronic assistance.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Any attempt to reverse-engineer test answer keys, manipulate HTTP response payloads, or spoof submission scores constitutes an integrity violation resulting in immediate account restriction by the school administrator.
          </p>
        </div>

        {/* Clause 3 */}
        <div className="inst-card p-6 rounded-md">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            3. Faculty Resource Contribution Protocol
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-2">
            Teachers contributing materials warrant that uploaded content strictly adheres to the Karnataka State DSERT and KSEAB syllabus. Uploaded files must undergo mandatory administrative verification before publication to the student body.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Contributing faculty retain academic authorship attribution, while granting the institutional platform a non-exclusive license to format, display, and distribute the materials to enrolled students without fees.
          </p>
        </div>

        {/* Clause 4 */}
        <div className="inst-card p-6 rounded-md">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            4. Administrative Review and Audit Logs
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            The institutional administrator maintains final authority over resource approvals, rejections, user account activations, and school announcements. Security and operational events are logged to maintain an immutable audit trail for institutional compliance.
          </p>
        </div>

        {/* Clause 5 */}
        <div className="inst-card p-6 rounded-md">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            5. Disclaimers and Limitations
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            VidyaSetu is provided on an "as is" educational basis. While content is rigorously validated against official Karnataka Board blueprints, official physical textbooks issued by the Karnataka Textbook Society (KTBS) remain the definitive statutory reference for state board public examinations.
          </p>
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
