import React from 'react';
import { 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Award, 
  Video, 
  HelpCircle 
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-5">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon] || BookOpen;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 -mb-[2px] ${
                isSelected
                  ? 'border-blue-700 text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
