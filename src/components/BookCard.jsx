import React from 'react';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Bookmark, 
  Download, 
  Eye, 
  ArrowRight,
  CheckCircle2,
  Share2
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

  // Dynamic subject palette
  const getSubjectBadge = (subject = '') => {
    const s = subject.toLowerCase();
    if (s.includes('science') || s.includes('biology') || s.includes('physics')) {
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/80';
    }
    if (s.includes('math')) {
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/80';
    }
    if (s.includes('kannada') || s.includes('english')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/80';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/80';
  };

  return (
    <article className="academic-card p-5 sm:p-6 flex flex-col justify-between">
      
      {/* Top Details & Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono">
              {resource.className}
            </span>
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${getSubjectBadge(resource.subject)}`}>
              {lang === 'kn' ? (resource.subjectKn || resource.subject) : resource.subject}
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 font-mono">
              {resource.language || 'Bilingual'}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(resource.id)}
            className={`p-1.5 rounded transition-colors btn-press cursor-pointer border ${
              isBookmarked 
                ? 'bg-blue-700 text-white border-blue-700 shadow-xs' 
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onOpenResource(resource)}
          className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer transition-colors mb-1.5 font-heading"
        >
          {lang === 'kn' ? (resource.titleKn || resource.title) : resource.title}
        </h3>

        {/* Bilingual Subtitle */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium line-clamp-1 italic">
          {lang === 'kn' ? resource.title : resource.titleKn}
        </p>

        {/* Abstract / Summary */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5 line-clamp-3 font-normal">
          {resource.summary}
        </p>
      </div>

      {/* Footer Details & Action Buttons */}
      <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80">
        
        {/* Source & Metrics */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-3.5 font-mono">
          <span className="truncate max-w-[170px]" title={resource.author}>
            {resource.author.split('(')[0].trim()}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 tabular-nums">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              {resource.viewsCount}
            </span>
            <span className="flex items-center gap-1 tabular-nums">
              <Download className="w-3.5 h-3.5 text-slate-400" />
              {resource.downloadsCount}
            </span>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenResource(resource)}
            className="w-full py-2 px-3 rounded text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition-all btn-press flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            {isVideo ? <Video className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
            <span>{lang === 'kn' ? 'ಓದಿ' : 'Read Document'}</span>
          </button>

          <button
            onClick={() => onDownloadResource(resource)}
            className="w-full py-2 px-3 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all btn-press flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{lang === 'kn' ? 'ಡೌನ್‌ಲೋಡ್' : 'Download'}</span>
          </button>
        </div>

      </div>

    </article>
  );
}
