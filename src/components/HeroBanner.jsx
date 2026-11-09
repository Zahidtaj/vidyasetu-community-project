import React from 'react';
import { Search, X, BookOpen, Layers } from 'lucide-react';
import { CLASSES } from '../data/libraryData';

export function HeroBanner({ 
  lang, 
  searchQuery, 
  setSearchQuery, 
  selectedClass, 
  setSelectedClass 
}) {
  const quickTopics = [
    { label: 'Class 10 Science', labelKn: '೧೦ನೇ ತರಗತಿ ವಿಜ್ಞಾನ', query: 'Science' },
    { label: 'Real Numbers Proofs', labelKn: 'ವಾಸ್ತವ ಸಂಖ್ಯೆಗಳು', query: 'Real Numbers' },
    { label: 'Laws of Motion', labelKn: 'ಚಲನೆಯ ನಿಯಮಗಳು', query: 'Force' },
    { label: 'SSLC Model Papers', labelKn: 'SSLC ಮಾದರಿ ಪತ್ರಿಕೆ', query: 'Model' },
    { label: 'Kannada Grammar', labelKn: 'ಕನ್ನಡ ವ್ಯಾಕರಣ', query: 'ವ್ಯಾಕರಣ' }
  ];

  return (
    <section className="relative py-12 sm:py-16 transition-colors border-b border-slate-200/70 dark:border-slate-800/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Minimal Academic Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
          <span>DSERT & KSEAB State Secondary Curriculum · Classes 8, 9, 10</span>
        </div>

        {/* Minimal Clean Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading mb-3 sm:mb-4">
          {lang === 'kn' ? (
            <>ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆಗಳ <span className="text-blue-700 dark:text-blue-400">ಡಿಜಿಟಲ್ ಗ್ರಂಥಾಲಯ</span></>
          ) : (
            <>State High School <span className="text-blue-700 dark:text-blue-400">Digital Library</span></>
          )}
        </h1>

        {/* Minimal Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-8 font-normal">
          {lang === 'kn'
            ? '೮, ೯ ಮತ್ತು ೧೦ನೇ ತರಗತಿಯ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕಗಳು, ಅಧ್ಯಾಯವಾರು ಟಿಪ್ಪಣಿಗಳು ಹಾಗೂ ಪರೀಕ್ಷಾ ಮೌಲ್ಯಮಾಪನ.'
            : 'Centralized digital textbooks, chapter notes, board examination blueprints, and formative evaluations.'}
        </p>

        {/* Centered Minimalist Search Input */}
        <div className="relative max-w-xl mx-auto mb-4">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'kn' ? 'ವಿಷಯ ಅಥವಾ ಅಧ್ಯಾಯ ಹುಡುಕಿ (ಉದಾ: Science, Real Numbers)...' : 'Search curriculum topic or chapter (e.g. Science, Real Numbers)...'}
            className="w-full pl-11 pr-10 py-3 text-sm rounded-lg bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-600/15 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Minimal Quick Topic Filters */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-8">
          {quickTopics.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSearchQuery(item.query)}
              className="px-2.5 py-1 rounded text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/70 dark:hover:bg-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              {lang === 'kn' ? item.labelKn : item.label}
            </button>
          ))}
        </div>

        {/* Clean Segmented Class Selector */}
        <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
          {CLASSES.map((cls) => {
            const isSelected = selectedClass === cls.id;
            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-[#1a233a] text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lang === 'kn' ? cls.labelKn : (cls.badge || cls.label)}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
