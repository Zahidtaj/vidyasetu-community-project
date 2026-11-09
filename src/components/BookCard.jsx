import React from 'react';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Bookmark, 
  Download, 
  Eye, 
  ArrowRight,
  CheckCircle2
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
    <div className="inst-card rounded-md p-5 flex flex-col justify-between border border-slate-200 dark:border-slate-800">
      
      {/* Top Details & Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
              {resource.className}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              {lang === 'kn' ? (resource.subjectKn || resource.subject) : resource.subject}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(resource.id)}
              className={`p-1.5 rounded transition-colors cursor-pointer border ${
                isBookmarked 
                  ? 'bg-blue-700 text-white border-blue-700' 
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onOpenResource(resource)}
          className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer transition-colors mb-1.5 line-clamp-2"
        >
          {lang === 'kn' ? (resource.titleKn || resource.title) : resource.title}
        </h3>

        {/* Subtitle / Alternate Language Title */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 font-medium line-clamp-1 italic">
          {lang === 'kn' ? resource.title : resource.titleKn}
        </p>

        {/* Summary */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
          {resource.summary}
        </p>
      </div>

      {/* Footer Info & Action Buttons */}
      <div>
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-3 font-mono">
          <span className="truncate max-w-[170px]" title={resource.author}>
            Source: {resource.author}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-400" />
              {resource.viewsCount}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3 text-slate-400" />
              {resource.downloadsCount}
            </span>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenResource(resource)}
            className="flex-1 py-2 px-3 rounded text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isVideo ? <Video className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
            <span>{isVideo ? (lang === 'kn' ? 'ವಿಡಿಯೋ ವೀಕ್ಷಿಸಿ' : 'View Lesson') : (lang === 'kn' ? 'ಟಿಪ್ಪಣಿಗಳನ್ನು ಓದಿ' : 'Read Document')}</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {!isVideo && (
            <button
              onClick={() => onDownloadResource(resource)}
              className="p-2 rounded text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
              title="Download Document"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
