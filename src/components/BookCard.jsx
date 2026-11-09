import React from 'react';
import { 
  BookOpen, 
  Video, 
  Bookmark, 
  Download, 
  ArrowRight
} from 'lucide-react';

export function BookCard({ 
  resource, 
  lang, 
  isBookmarked, 
  onToggleBookmark, 
  onOpenResource, 
  onDownloadResource 
}) {
  const isVideo = resource.resourceType === 'video';

  return (
    <article className="academic-card p-5 sm:p-6 flex flex-col justify-between">
      
      {/* Top Meta & Bookmark */}
      <div>
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="font-semibold text-blue-700 dark:text-blue-400 font-mono text-[11px]">
            {resource.className} · {lang === 'kn' ? (resource.subjectKn || resource.subject) : resource.subject}
          </span>
          
          <button
            onClick={() => onToggleBookmark(resource.id)}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isBookmarked 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onOpenResource(resource)}
          className="text-base font-bold text-slate-900 dark:text-white leading-snug hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer transition-colors mb-2 font-heading"
        >
          {lang === 'kn' ? (resource.titleKn || resource.title) : resource.title}
        </h3>

        {/* Short Clean Summary */}
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-5 font-normal">
          {resource.summary}
        </p>
      </div>

      {/* Footer: Quiet metadata + Clean Primary Action */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
          {resource.author.split('(')[0].trim()}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDownloadResource(resource)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Download Document"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onOpenResource(resource)}
            className="py-1.5 px-3 rounded-md text-xs font-semibold bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/40 text-slate-800 hover:text-blue-700 dark:text-slate-200 dark:hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>{lang === 'kn' ? 'ಓದಿ' : 'Read'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

    </article>
  );
}
