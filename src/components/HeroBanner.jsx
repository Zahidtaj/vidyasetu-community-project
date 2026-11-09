import React from 'react';
import { Search, X, BookOpen, FileText, CheckCircle2 } from 'lucide-react';
import { CLASSES, ACADEMIC_NOTICE } from '../data/libraryData';

export function HeroBanner({ 
  lang, 
  searchQuery, 
  setSearchQuery, 
  selectedClass, 
  setSelectedClass 
}) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] py-8 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Main Title & Search */}
          <div className="lg:col-span-2">
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight font-heading mb-3">
              {lang === 'kn' ? (
                <>ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆಗಳ <span className="text-blue-700 dark:text-blue-400">ಡಿಜಿಟಲ್ ಗ್ರಂಥಾಲಯ</span> ಹಾಗೂ ಮೌಲ್ಯಮಾಪನ ವ್ಯವಸ್ಥೆ</>
              ) : (
                <>State High School <span className="text-blue-700 dark:text-blue-400">Educational Repository</span> and Evaluation Portal</>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-2xl">
              {lang === 'kn' 
                ? '೮, ೯ ಮತ್ತು ೧೦ನೇ ತರಗತಿಯ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ ಸಾಮಗ್ರಿಗಳು, ಟಿಪ್ಪಣಿಗಳು, ಮಾದರಿ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು ಮತ್ತು ಅಧ್ಯಾಯವಾರು ಪರೀಕ್ಷಾ ಮೌಲ್ಯಮಾಪನ.'
                : 'Centralized digital textbooks, faculty-reviewed chapter notes, previous board examination blueprints, and timed evaluations for Classes 8, 9, and 10 under Karnataka State DSERT standards.'}
            </p>

            {/* Direct Search Bar */}
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'kn' ? 'ವಿಷಯ ಅಥವಾ ಅಧ್ಯಾಯ ಹುಡುಕಿ (ಉದಾ: ಜೀವಕೋಶ, Real Numbers, Force)...' : 'Search by curriculum topic or chapter (e.g., Cell Biology, Kinematics, Real Numbers)...'}
                className="inst-input w-full pl-10 pr-9 py-2.5 text-xs font-medium shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Right Information Box: Academic Syllabus Scope */}
          <div className="inst-panel p-5 rounded-md border border-slate-200 dark:border-slate-800">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>{lang === 'kn' ? ACADEMIC_NOTICE.titleKn : ACADEMIC_NOTICE.titleEn}</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              {lang === 'kn' ? ACADEMIC_NOTICE.textKn : ACADEMIC_NOTICE.textEn}
            </p>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center justify-between">
              <span>Authority: Karnataka KSEAB</span>
              <span>Course: 1BCP308</span>
            </div>
          </div>

        </div>

        {/* Class Filter Row */}
        <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            <span>{lang === 'kn' ? 'ತರಗತಿ ಫಿಲ್ಟರ್:' : 'Curriculum Standard:'}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {CLASSES.map((cls) => {
              const isSelected = selectedClass === cls.id;
              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClass(cls.id)}
                  className={`px-3.5 py-1.5 rounded text-xs font-bold transition-all btn-press cursor-pointer border ${
                    isSelected
                      ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {lang === 'kn' ? cls.labelKn : (cls.badge || cls.label)}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
