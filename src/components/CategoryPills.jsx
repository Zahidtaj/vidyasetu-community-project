import React from 'react';
import { CATEGORIES } from '../data/libraryData';

export function CategoryPills({ lang, selectedCategory, onSelectCategory }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-5">
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{lang === 'kn' ? cat.labelKn : cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
