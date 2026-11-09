import React from 'react';
import { 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Award, 
  Video, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../data/libraryData';

const iconMap = {
  BookOpen,
  FileText,
  GraduationCap,
  Award,
  Video,
  HelpCircle
};

export function CategoryPills({ lang, selectedCategory, onSelectCategory }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon] || BookOpen;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold whitespace-nowrap transition-all btn-press cursor-pointer border ${
                isSelected
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{lang === 'kn' ? cat.labelKn : cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
