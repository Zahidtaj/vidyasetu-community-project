import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  ZoomIn, 
  ZoomOut, 
  FileText,
  Bookmark,
  Download,
  Video,
  ExternalLink,
  Printer
} from 'lucide-react';

export function BookReaderModal({ 
  resource, 
  lang, 
  onClose, 
  onToggleBookmark, 
  isBookmarked,
  onDownload 
}) {
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [fontSize, setFontSize] = useState(15);
  const [theme, setTheme] = useState('clean'); // 'clean' | 'warm' | 'dark'
  const [isSpeaking, setIsSpeaking] = useState(false);

  const chapters = resource.chapters || [
    { title: 'Overview and Key Formulations', content: resource.summary }
  ];
  const currentChapter = chapters[currentChapterIdx] || chapters[0];

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentChapterIdx]);

  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${currentChapter.title}. ${currentChapter.content}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = lang === 'kn' ? 'kn-IN' : 'en-IN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const themeClassMap = {
    clean: 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100',
    warm: 'bg-[#FAF6EE] text-[#2C2416] border-amber-200',
    dark: 'bg-[#0B0F17] text-slate-200 border-slate-800'
  };

  const isVideo = resource.resourceType === 'video';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-slate-800 dark:text-slate-200">
      <div className="w-full max-w-4xl h-[90vh] rounded-lg flex flex-col overflow-hidden bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl animate-modal">
        
        {/* Top Control Bar */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2 max-w-md">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0 font-mono">
              {resource.className} | {resource.subject}
            </span>
            <h3 className="text-xs sm:text-sm font-bold truncate text-slate-900 dark:text-white">
              {lang === 'kn' ? (resource.titleKn || resource.title) : resource.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Audio Reader */}
            {!isVideo && (
              <button
                onClick={handleToggleSpeak}
                className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border ${
                  isSpeaking
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700'
                }`}
                title="Text-to-Speech Read Aloud"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span className="hidden md:inline text-[11px]">{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
              </button>
            )}

            {/* Font scale buttons */}
            {!isVideo && (
              <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 p-0.5">
                <button
                  onClick={() => setFontSize(prev => Math.max(13, prev - 1))}
                  className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  title="Smaller Font"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="text-[10px] font-mono px-1">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(prev => Math.min(22, prev + 1))}
                  className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  title="Larger Font"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Paper Theme Toggle */}
            {!isVideo && (
              <div className="hidden md:flex items-center gap-1 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 p-0.5 text-[10px] font-bold">
                <button
                  onClick={() => setTheme('clean')}
                  className={`px-2 py-0.5 rounded ${theme === 'clean' ? 'bg-blue-700 text-white' : 'text-slate-500'}`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme('warm')}
                  className={`px-2 py-0.5 rounded ${theme === 'warm' ? 'bg-amber-700 text-white' : 'text-slate-500'}`}
                >
                  Warm
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-2 py-0.5 rounded ${theme === 'dark' ? 'bg-slate-950 text-white' : 'text-slate-500'}`}
                >
                  Dark
                </button>
              </div>
            )}

            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(resource.id)}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer border ${
                isBookmarked 
                  ? 'bg-blue-700 text-white border-blue-700' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700'
              }`}
              title="Bookmark this resource"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
            </button>

            {/* Download */}
            {!isVideo && (
              <button
                onClick={() => onDownload(resource)}
                className="p-1.5 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                title="Download Material"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className={`flex-1 overflow-y-auto p-6 sm:p-10 ${themeClassMap[theme]} transition-colors`}>
          {isVideo ? (
            <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-6">
              <div className="w-full aspect-video rounded bg-slate-950 flex flex-col items-center justify-center p-6 text-center border border-slate-800 mb-6">
                <Video className="w-12 h-12 text-blue-400 mb-3" />
                <h4 className="text-base font-bold text-white mb-2">
                  {resource.title}
                </h4>
                <p className="text-xs text-slate-400 max-w-md mb-5">
                  {resource.summary}
                </p>
                <a
                  href={resource.videoUrl || "https://www.youtube.com/watch?v=kKKM8Y-u7ds"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 py-2 px-4 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
                >
                  <span>Open Video in Clean Player</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="w-full academic-card p-5 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2">Demonstration Protocol & Notes</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono whitespace-pre-line">
                  {currentChapter.content}
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              
              {/* Document Header */}
              <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 mb-2 font-mono">
                  <FileText className="w-3 h-3 text-blue-700" />
                  <span>DSERT Curriculum Repository Document</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading leading-snug mb-1 text-slate-900 dark:text-white">
                  {lang === 'kn' ? (resource.titleKn || resource.title) : resource.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
                  <span>Author: {resource.author}</span>
                  <span>|</span>
                  <span>Class: {resource.className}</span>
                  <span>|</span>
                  <span>Subject: {resource.subject}</span>
                </div>
              </div>

              {/* Current Chapter Section */}
              <div className="mb-8">
                <h3 className="text-base font-bold font-heading mb-3 text-blue-700 dark:text-blue-400">
                  {currentChapter.title}
                </h3>
                <div 
                  className="leading-relaxed whitespace-pre-line font-normal select-text"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {currentChapter.content}
                </div>
              </div>

              {/* Multi-Section Navigation */}
              {chapters.length > 1 && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <button
                    disabled={currentChapterIdx === 0}
                    onClick={() => setCurrentChapterIdx(prev => prev - 1)}
                    className="py-1.5 px-3 rounded text-xs font-bold border border-slate-300 dark:border-slate-700 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous Section</span>
                  </button>

                  <span className="text-xs font-mono font-bold text-slate-500">
                    Section {currentChapterIdx + 1} of {chapters.length}
                  </span>

                  <button
                    disabled={currentChapterIdx === chapters.length - 1}
                    onClick={() => setCurrentChapterIdx(prev => prev + 1)}
                    className="py-1.5 px-3 rounded text-xs font-bold bg-blue-700 text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                  >
                    <span>Next Section</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Bottom Status Ribbon */}
        <div className="px-5 py-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono bg-slate-50 dark:bg-slate-900 shrink-0">
          <span>Digital Library Repository | VidyaSetu</span>
          <span>Verified DSERT Karnataka Curriculum</span>
        </div>

      </div>
    </div>
  );
}
