import React from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Award, 
  Layers, 
  Sparkles,
  School,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { CLASSES, ACADEMIC_NOTICE } from '../data/libraryData';

export function HeroBanner({ 
  lang, 
  searchQuery, 
  setSearchQuery, 
  selectedClass, 
  setSelectedClass,
  totalResourcesCount = 6,
  totalQuizzesCount = 3
}) {
  const quickSearches = [
    { label: 'Class 10 Science Blueprint', labelKn: '೧೦ನೇ ತರಗತಿ ವಿಜ್ಞಾನ ಬ್ಲೂಪ್ರಿಂಟ್', query: 'Science' },
    { label: 'Real Numbers Proofs', labelKn: 'ವಾಸ್ತವ ಸಂಖ್ಯೆಗಳ ಸೂತ್ರ', query: 'Real Numbers' },
    { label: 'Force & Motion', labelKn: 'ಬಲ ಮತ್ತು ಚಲನೆಯ ನಿಯಮಗಳು', query: 'Force' },
    { label: 'Kannada Grammar', labelKn: 'ಕನ್ನಡ ವ್ಯಾಕರಣ ಟಿಪ್ಪಣಿ', query: 'ವ್ಯಾಕರಣ' },
    { label: 'SSLC Model Papers', labelKn: 'SSLC ಮಾದರಿ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ', query: 'Model' }
  ];

  return (
    <section className="relative border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0a0f1d] dark:via-[#0f172a] dark:to-[#0a0f1d] py-10 sm:py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Heading, Subtitle & Command Search */}
          <div className="lg:col-span-7">
            
            {/* Official Authority Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 mb-4">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>DSERT & KSEAB State Secondary Curriculum Framework · 2026</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.15] font-heading mb-4 tracking-tight">
              {lang === 'kn' ? (
                <>
                  ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆಗಳ <span className="text-blue-700 dark:text-blue-400">ಡಿಜಿಟಲ್ ಗ್ರಂಥಾಲಯ</span> ಹಾಗೂ ಸ್ವಯಂ ಮೌಲ್ಯಮಾಪನ
                </>
              ) : (
                <>
                  State High School <span className="text-blue-700 dark:text-blue-400">Educational Repository</span> and Evaluation Portal
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-2xl font-normal">
              {lang === 'kn' 
                ? '೮, ೯ ಮತ್ತು ೧೦ನೇ ತರಗತಿಯ (SSLC) ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲಾ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕಗಳು, ಶಿಕ್ಷಕ-ಪರಿಶೀಲಿಸಿದ ಟಿಪ್ಪಣಿಗಳು, ಮಾದರಿ ಬ್ಲೂಪ್ರಿಂಟ್‌ಗಳು ಮತ್ತು ರಸಪ್ರಶ್ನೆ ಮೌಲ್ಯಮಾಪನ.'
                : 'Centralized digital textbooks, faculty-reviewed chapter notes, previous board examination blueprints, and timed evaluations for Classes 8, 9, and 10 under Karnataka State DSERT standards.'}
            </p>

            {/* Direct Command Search Bar */}
            <div className="relative max-w-2xl mb-3">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'kn' ? 'ವಿಷಯ ಅಥವಾ ಅಧ್ಯಾಯ ಹುಡುಕಿ (ಉದಾ: ಜೀವಕೋಶ, Real Numbers, Force)...' : 'Search by curriculum topic, chapter, or subject (e.g., Cell Biology, Kinematics, Real Numbers)...'}
                className="inst-input w-full pl-10 pr-20 py-3 text-xs sm:text-sm font-medium shadow-xs"
              />
              <div className="absolute right-3 top-2.5 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer transition-colors"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
                  Ctrl K
                </kbd>
              </div>
            </div>

            {/* Quick Search Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">
                {lang === 'kn' ? 'ಜನಪ್ರಿಯ ವಿಷಯಗಳು:' : 'Quick topics:'}
              </span>
              {quickSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(item.query)}
                  className="px-2.5 py-1 rounded text-[11px] font-medium bg-slate-100 hover:bg-blue-50 dark:bg-slate-800/80 dark:hover:bg-blue-950/40 text-slate-700 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  {lang === 'kn' ? item.labelKn : item.label}
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Academic Bulletin & Real Metrics Card */}
          <div className="lg:col-span-5">
            <div className="academic-card p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
              
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-heading">
                      {lang === 'kn' ? ACADEMIC_NOTICE.titleKn : ACADEMIC_NOTICE.titleEn}
                    </h2>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Ref: KSEAB/DSERT/2026/CUR-08
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Verified
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5 font-normal">
                {lang === 'kn' ? ACADEMIC_NOTICE.textKn : ACADEMIC_NOTICE.textEn}
              </p>

              {/* Dynamic Real Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 mb-4">
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    {lang === 'kn' ? 'ಲಭ್ಯವಿರುವ ಸಂಪನ್ಮೂಲಗಳು' : 'Verified Materials'}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-blue-700 dark:text-blue-400 font-heading tabular-nums">
                      {totalResourcesCount}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Textbooks & Notes</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    {lang === 'kn' ? 'ಸಕ್ರಿಯ ಮೌಲ್ಯಮಾಪನಗಳು' : 'Active Evaluations'}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-heading tabular-nums">
                      {totalQuizzesCount}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Timed Quizzes</span>
                  </div>
                </div>
              </div>

              {/* Metadata Footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Authority: Karnataka KSEAB</span>
                <span>Course: VTU 1BCP308</span>
              </div>

            </div>
          </div>

        </div>

        {/* Curriculum Standard / Class Selector Toolbar */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              {lang === 'kn' ? 'ತರಗತಿ ಆಯ್ಕೆ:' : 'Curriculum Standard:'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CLASSES.map((cls) => {
              const isSelected = selectedClass === cls.id;
              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClass(cls.id)}
                  className={`px-4 py-2 rounded text-xs font-bold transition-all btn-press cursor-pointer border ${
                    isSelected
                      ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400'
                  }`}
                >
                  {lang === 'kn' ? cls.labelKn : (cls.badge || cls.label)}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
