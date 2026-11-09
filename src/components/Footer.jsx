import React from 'react';
import { BookOpen, ExternalLink, ShieldCheck, Scale, Globe } from 'lucide-react';

export function Footer({ lang, onNavigateView, onOpenDomainModal }) {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 pt-10 pb-8 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-200 dark:border-slate-800">
          
          {/* Column 1: Platform Vision */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-blue-700 flex items-center justify-center text-white font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white font-heading">
                VidyaSetu (ವಿದ್ಯಾಸೇತು)
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {lang === 'kn'
                ? 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆಗಳ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಅಧಿಕೃತ ಡಿಜಿಟಲ್ ಪಠ್ಯಪುಸ್ತಕಗಳು, ಟಿಪ್ಪಣಿಗಳು ಹಾಗೂ ಮೌಲ್ಯಮಾಪನ ಒದಗಿಸುವ ಮುಕ್ತ ಶೈಕ್ಷಣಿಕ ವೇದಿಕೆ.'
                : 'Centralized open digital repository and assessment engine for Karnataka State Board High Schools (Classes 8, 9, and 10). DSERT syllabus-aligned.'}
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              VTU Community Project Course Code: 1BCP308
            </div>
          </div>

          {/* Column 2: Karnataka Educational Portals */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              {lang === 'kn' ? 'ರಾಜ್ಯ ಪಠ್ಯಕ್ರಮ ಮೂಲಗಳು' : 'Statutory Curriculum Portals'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://dsert.karnataka.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-700 flex items-center gap-1.5 transition-colors">
                  <ExternalLink className="w-3 h-3 opacity-60" />
                  <span>DSERT Karnataka Official Textbooks</span>
                </a>
              </li>
              <li>
                <a href="https://kseab.karnataka.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-700 flex items-center gap-1.5 transition-colors">
                  <ExternalLink className="w-3 h-3 opacity-60" />
                  <span>KSEAB SSLC Examination Blueprints</span>
                </a>
              </li>
              <li>
                <a href="https://diksha.gov.in/ka" target="_blank" rel="noreferrer" className="hover:text-blue-700 flex items-center gap-1.5 transition-colors">
                  <ExternalLink className="w-3 h-3 opacity-60" />
                  <span>DIKSHA Karnataka State Portal</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Governance Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              {lang === 'kn' ? 'ನೀತಿಗಳು ಮತ್ತು ಆಡಳಿತ' : 'Policies and Governance'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateView('privacy')}
                  className="hover:text-blue-700 flex items-center gap-1.5 transition-colors cursor-pointer text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>DPDP Act Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('terms')}
                  className="hover:text-blue-700 flex items-center gap-1.5 transition-colors cursor-pointer text-left"
                >
                  <Scale className="w-3.5 h-3.5 text-blue-600" />
                  <span>Institutional Terms of Use</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDomainModal}
                  className="hover:text-blue-700 flex items-center gap-1.5 transition-colors cursor-pointer text-left"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>Custom Production Domain DNS</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Institutional Attribution */}
          <div className="space-y-2 text-xs">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              {lang === 'kn' ? 'ಯೋಜನಾ ಮಾನ್ಯತೆ' : 'Academic Verification'}
            </h4>
            <p>
              <strong>Curriculum:</strong> Karnataka State Board (KSEAB)
            </p>
            <p>
              <strong>Subject Scope:</strong> Science, Mathematics, Social Science
            </p>
            <p className="font-mono text-[11px] text-slate-500">
              Architecture: React 19 + Python Flask SQLite
            </p>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 font-mono text-[11px]">
          <p>© 2026 VidyaSetu. Department of School Education Collaboration Initiative.</p>
          <p>Strictly for Non-Commercial Educational Public Use.</p>
        </div>

      </div>
    </footer>
  );
}
