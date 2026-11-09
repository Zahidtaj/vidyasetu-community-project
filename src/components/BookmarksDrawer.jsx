import React from 'react';
import { X, Bookmark, BookOpen, Trash2, ArrowRight } from 'lucide-react';

export function BookmarksDrawer({ 
  isOpen, 
  onClose, 
  bookmarkedResources, 
  lang, 
  onOpenResource, 
  onRemoveBookmark,
  onClearAll 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in text-slate-800 dark:text-slate-200">
      <div className="w-full max-w-md bg-white dark:bg-[#111827] h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 transition-colors">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              <Bookmark className="w-4 h-4 fill-blue-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white">
                {lang === 'kn' ? 'ಉಳಿಸಿದ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳು' : 'Bookmarked Study Materials'}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                {bookmarkedResources.length} {lang === 'kn' ? 'ದಾಖಲೆಗಳು' : 'documents saved'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {bookmarkedResources.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2 border border-slate-200 dark:border-slate-700">
                <Bookmark className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'kn' ? 'ಯಾವುದೇ ಬುಕ್‌ಮಾರ್ಕ್‌ಗಳು ಇಲ್ಲ' : 'No saved documents'}
              </h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                {lang === 'kn' 
                  ? 'ಲೈಬ್ರರಿ ಕಾರ್ಡ್‌ನ ಮೇಲಿರುವ ಬುಕ್‌ಮಾರ್ಕ್ ಐಕಾನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಇಲ್ಲಿ ಉಳಿಸಿ.' 
                  : 'Click the bookmark icon on any curriculum card to save it for quick revision.'}
              </p>
            </div>
          ) : (
            bookmarkedResources.map((res) => (
              <div
                key={res.id}
                className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3"
              >
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onOpenResource(res);
                  }}
                >
                  <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase font-mono">
                    {res.className} | {res.subject}
                  </span>
                  <h4 className="text-xs font-bold truncate mt-0.5 text-slate-900 dark:text-white hover:text-blue-600">
                    {lang === 'kn' ? (res.titleKn || res.title) : res.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {res.summary}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenResource(res);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-blue-700 cursor-pointer"
                    title="Open Document"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveBookmark(res.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-600 cursor-pointer"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {bookmarkedResources.length > 0 && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-mono">{bookmarkedResources.length} items</span>
            <button
              onClick={onClearAll}
              className="text-red-700 hover:underline font-bold cursor-pointer text-xs"
            >
              {lang === 'kn' ? 'ಎಲ್ಲವನ್ನೂ ತೆರವುಗೊಳಿಸಿ' : 'Clear All'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
