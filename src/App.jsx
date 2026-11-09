import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryPills } from './components/CategoryPills';
import { BookCard } from './components/BookCard';
import { BookReaderModal } from './components/BookReaderModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { AuthModal } from './components/AuthModal';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherPortal } from './components/TeacherPortal';
import { AdminConsole } from './components/AdminConsole';
import { QuizModal } from './components/QuizModal';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsConditions } from './components/TermsConditions';
import { CustomDomainModal } from './components/CustomDomainModal';
import { Footer } from './components/Footer';

import { 
  DEMO_USERS, 
  CLASSES, 
  CATEGORIES, 
  INITIAL_RESOURCES, 
  INITIAL_QUIZZES, 
  INITIAL_QUIZ_ATTEMPTS, 
  ANNOUNCEMENTS 
} from './data/libraryData';

import { 
  BookOpen, 
  HelpCircle, 
  Clock, 
  ArrowRight,
  Shield,
  FileText
} from 'lucide-react';

export default function App() {
  // 1. Language & Theme State
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('vidyasetu_lang') || 'en';
  });

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('vidyasetu_theme');
    return saved !== null ? saved === 'dark' : false; // Clean, high-contrast theme
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vidyasetu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vidyasetu_theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('vidyasetu_lang', lang);
  }, [lang]);

  // 2. Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vidyasetu_user');
      return saved ? JSON.parse(saved) : DEMO_USERS.student;
    } catch {
      return DEMO_USERS.student;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vidyasetu_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // 3. Navigation View State
  const [currentView, setCurrentView] = useState('library'); // 'library' | 'dashboard' | 'quizzes' | 'teacher' | 'admin' | 'privacy' | 'terms'

  // 4. Domain Data State
  const [resources, setResources] = useState(() => {
    try {
      const saved = localStorage.getItem('vidyasetu_resources');
      return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  const [quizzes, setQuizzes] = useState(() => {
    try {
      const saved = localStorage.getItem('vidyasetu_quizzes');
      return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
    } catch {
      return INITIAL_QUIZZES;
    }
  });

  const [quizAttempts, setQuizAttempts] = useState(() => {
    try {
      const saved = localStorage.getItem('vidyasetu_attempts');
      return saved ? JSON.parse(saved) : INITIAL_QUIZ_ATTEMPTS;
    } catch {
      return INITIAL_QUIZ_ATTEMPTS;
    }
  });

  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem('vidyasetu_announcements');
      return saved ? JSON.parse(saved) : ANNOUNCEMENTS;
    } catch {
      return ANNOUNCEMENTS;
    }
  });

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('vidyasetu_bookmarks');
      return saved ? JSON.parse(saved) : [1, 2];
    } catch {
      return [1, 2];
    }
  });

  // Sync datasets to localStorage
  useEffect(() => {
    localStorage.setItem('vidyasetu_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('vidyasetu_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('vidyasetu_attempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  useEffect(() => {
    localStorage.setItem('vidyasetu_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('vidyasetu_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // 5. Library Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 6. Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeResource, setActiveResource] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);

  // Handlers
  const handleToggleBookmark = (id) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleOpenResource = (res) => {
    setResources(prev => prev.map(r => r.id === res.id ? { ...r, viewsCount: (r.viewsCount || 0) + 1 } : r));
    setActiveResource(res);
  };

  const handleDownloadResource = (res) => {
    setResources(prev => prev.map(r => r.id === res.id ? { ...r, downloadsCount: (r.downloadsCount || 0) + 1 } : r));
    
    const chaptersText = (res.chapters || []).map(c => `=== ${c.title} ===\n\n${c.content}\n\n`).join('\n');
    const content = `VIDYASETU DIGITAL CURRICULUM REPOSITORY
Karnataka State Secondary Education Assessment Board (KSEAB)
VTU Community Project Course Code: 1BCP308
============================================================
Title: ${res.title} (${res.titleKn || ''})
Class: ${res.className} | Subject: ${res.subject}
Author: ${res.author} | Release Date: ${res.uploadedOn}
Summary: ${res.summary}
============================================================

${chaptersText}

Distributed free of cost strictly for non-commercial educational instruction.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${res.title.replace(/[^a-zA-Z0-9]/g, '_')}_VidyaSetu.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddResource = (newRes) => {
    setResources(prev => [newRes, ...prev]);
  };

  const handleApproveResource = (id) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleRejectResource = (id, reason) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected', rejectionReason: reason } : r));
  };

  const handleDeleteResource = (id) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const handleAddQuiz = (newQuiz) => {
    setQuizzes(prev => [newQuiz, ...prev]);
  };

  const handleCompleteQuiz = (attemptData) => {
    setQuizAttempts(prev => [attemptData, ...prev]);
  };

  const handleAddAnnouncement = (newAnnounce) => {
    setAnnouncements(prev => [newAnnounce, ...prev]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('library');
    setIsAuthOpen(true);
  };

  // Filter approved resources for public library view
  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      if (currentUser?.role === 'student' && res.status !== 'approved') {
        return false;
      }

      if (selectedClass !== 'all' && res.classId !== selectedClass) {
        return false;
      }

      if (selectedCategory !== 'all') {
        if (selectedCategory === 'quiz') return false;
        if (res.category !== selectedCategory) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = res.title.toLowerCase().includes(q) || (res.titleKn && res.titleKn.toLowerCase().includes(q));
        const matchesSubject = res.subject.toLowerCase().includes(q) || (res.subjectKn && res.subjectKn.toLowerCase().includes(q));
        const matchesSummary = res.summary.toLowerCase().includes(q);
        const matchesAuthor = res.author.toLowerCase().includes(q);
        return matchesTitle || matchesSubject || matchesSummary || matchesAuthor;
      }

      return true;
    });
  }, [resources, currentUser, selectedClass, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* 1. Global Navigation Bar */}
      <Navbar 
        lang={lang}
        setLang={setLang}
        isDark={isDark}
        setIsDark={setIsDark}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        currentView={currentView}
        setCurrentView={setCurrentView}
        bookmarksCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenDomainModal={() => setIsDomainModalOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        
        {/* VIEW 1: CURRICULUM REPOSITORY (LIBRARY) */}
        {currentView === 'library' && (
          <div>
            <HeroBanner 
              lang={lang}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
            />

            <CategoryPills 
              lang={lang}
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                if (catId === 'quiz') {
                  setCurrentView('quizzes');
                } else {
                  setSelectedCategory(catId);
                }
              }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {lang === 'kn' ? 'ಲಭ್ಯವಿರುವ ಪಠ್ಯಕ್ರಮ ಸಾಮಗ್ರಿಗಳು' : 'Verified Curriculum Materials'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {filteredResources.length}
                  </span>
                </div>

                {(selectedClass !== 'all' || selectedCategory !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedClass('all');
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {lang === 'kn' ? 'ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ' : 'Clear Filters'}
                  </button>
                )}
              </div>

              {filteredResources.length === 0 ? (
                <div className="inst-panel rounded-md p-10 text-center max-w-md mx-auto border border-slate-200 dark:border-slate-800">
                  <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-60" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {lang === 'kn' ? 'ಯಾವುದೇ ಸಾಮಗ್ರಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No matching curriculum documents found'}
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    {lang === 'kn' 
                      ? 'ದಯವಿಟ್ಟು ಬೇರೆ ಕೀವರ್ಡ್ ಅಥವಾ ತರಗತಿ ಆಯ್ಕೆ ಮಾಡಿ.' 
                      : 'Adjust search keyword or reset class and category filters.'}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedClass('all');
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-1.5 rounded text-xs font-bold bg-blue-700 text-white cursor-pointer"
                  >
                    {lang === 'kn' ? 'ಎಲ್ಲಾ ಸಾಮಗ್ರಿಗಳನ್ನು ತೋರಿಸಿ' : 'Show All Curriculum'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredResources.map((resource) => (
                    <BookCard 
                      key={resource.id}
                      resource={resource}
                      lang={lang}
                      isBookmarked={bookmarks.includes(resource.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onOpenResource={handleOpenResource}
                      onDownloadResource={handleDownloadResource}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW 2: STUDENT DASHBOARD */}
        {currentView === 'dashboard' && (
          <StudentDashboard 
            lang={lang}
            currentUser={currentUser}
            resources={resources}
            quizzes={quizzes}
            quizAttempts={quizAttempts}
            bookmarks={bookmarks}
            onOpenResource={handleOpenResource}
            onStartQuiz={(quiz) => setActiveQuiz(quiz)}
            onGoToLibrary={() => setCurrentView('library')}
          />
        )}

        {/* VIEW 3: PRACTICE QUIZZES SHOWCASE */}
        {currentView === 'quizzes' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn text-slate-800 dark:text-slate-200">
            <div className="inst-panel rounded-md p-6 mb-6 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono">
                  State Board Formative Assessment Engine
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading mb-1.5">
                {lang === 'kn' ? 'ಅಧ್ಯಾಯವಾರು ಆನ್‌ಲೈನ್ ರಸಪ್ರಶ್ನೆ ಪರೀಕ್ಷೆಗಳು' : 'Chapter-wise Formative Evaluations'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl">
                {lang === 'kn' 
                  ? 'ನಿಮ್ಮ ಪರೀಕ್ಷಾ ಸಿದ್ಧತೆಯನ್ನು ಪರೀಕ್ಷಿಸಿಕೊಳ್ಳಿ. ಸ್ವಯಂಚಾಲಿತ ಅಂಕಗಳು ಮತ್ತು ಪ್ರತಿಯೊಂದು ಪ್ರಶ್ನೆಗೆ ವಿವರವಾದ ವಿವರಣೆಗಳೊಂದಿಗೆ.' 
                  : 'Automated MCQ assessments with countdown timer, instantaneous scoring, and scientific explanations aligned with DSERT curriculum blueprints.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="inst-card rounded-md p-5 flex flex-col justify-between border border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-mono">
                        {quiz.className} | {quiz.subject}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {quiz.durationMinutes} mins
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading mb-1.5">
                      {lang === 'kn' ? (quiz.titleKn || quiz.title) : quiz.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      Evaluates Karnataka State Secondary Examination core blueprint competencies.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-mono">
                      {quiz.questions.length} Questions
                    </span>
                    <button
                      onClick={() => setActiveQuiz(quiz)}
                      className="py-1.5 px-3.5 rounded text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{lang === 'kn' ? 'ಪರೀಕ್ಷೆ ಆರಂಭಿಸಿ' : 'Start Assessment'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: TEACHER PORTAL */}
        {currentView === 'teacher' && (
          <TeacherPortal 
            lang={lang}
            currentUser={currentUser}
            resources={resources}
            onAddResource={handleAddResource}
            onDeleteResource={handleDeleteResource}
            quizzes={quizzes}
            onAddQuiz={handleAddQuiz}
            quizAttempts={quizAttempts}
          />
        )}

        {/* VIEW 5: ADMINISTRATOR CONSOLE */}
        {currentView === 'admin' && (
          <AdminConsole 
            lang={lang}
            currentUser={currentUser}
            resources={resources}
            onApproveResource={handleApproveResource}
            onRejectResource={handleRejectResource}
            onDeleteResource={handleDeleteResource}
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
          />
        )}

        {/* VIEW 6: PRIVACY POLICY */}
        {currentView === 'privacy' && (
          <PrivacyPolicy 
            onBack={() => setCurrentView('library')}
            lang={lang}
          />
        )}

        {/* VIEW 7: TERMS AND CONDITIONS */}
        {currentView === 'terms' && (
          <TermsConditions 
            onBack={() => setCurrentView('library')}
            lang={lang}
          />
        )}

      </main>

      {/* Global Modals */}

      {/* 1. Authentication Modal */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onSelectUser={(u) => {
          setCurrentUser(u);
          if (u.role === 'admin') setCurrentView('admin');
          else if (u.role === 'teacher') setCurrentView('teacher');
          else setCurrentView('dashboard');
        }}
        lang={lang}
      />

      {/* 2. Book Reader / Document Modal */}
      {activeResource && (
        <BookReaderModal 
          resource={activeResource}
          lang={lang}
          onClose={() => setActiveResource(null)}
          isBookmarked={bookmarks.includes(activeResource.id)}
          onToggleBookmark={handleToggleBookmark}
          onDownload={handleDownloadResource}
        />
      )}

      {/* 3. Timed Quiz Assessment Modal */}
      {activeQuiz && (
        <QuizModal 
          quiz={activeQuiz}
          lang={lang}
          onClose={() => setActiveQuiz(null)}
          onCompleteQuiz={handleCompleteQuiz}
        />
      )}

      {/* 4. Bookmarks Drawer */}
      <BookmarksDrawer 
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedResources={resources.filter(r => bookmarks.includes(r.id))}
        lang={lang}
        onOpenResource={(res) => {
          setIsBookmarksOpen(false);
          handleOpenResource(res);
        }}
        onRemoveBookmark={handleToggleBookmark}
        onClearAll={() => setBookmarks([])}
      />

      {/* 5. Custom Domain Configuration Modal */}
      <CustomDomainModal 
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
        lang={lang}
      />

      {/* Footer */}
      <Footer 
        lang={lang} 
        onNavigateView={(v) => setCurrentView(v)}
        onOpenDomainModal={() => setIsDomainModalOpen(true)}
      />

    </div>
  );
}
