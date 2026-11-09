import React, { useState } from 'react';
import { 
  BookOpen, 
  Globe, 
  Bookmark, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  LayoutDashboard, 
  FileCheck, 
  ShieldCheck, 
  HelpCircle,
  Menu,
  X,
  Shield,
  GraduationCap,
  Briefcase,
  ChevronDown,
  Check
} from 'lucide-react';
import { DEMO_USERS } from '../data/libraryData';

export function Navbar({ 
  lang, 
  setLang, 
  isDark, 
  onToggleTheme, 
  currentUser, 
  setCurrentUser,
  onOpenAuth, 
  onLogout,
  currentView,
  setCurrentView,
  bookmarksCount, 
  onOpenBookmarks,
  onOpenDomainModal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'library', label: 'Repository', labelKn: 'ಗ್ರಂಥಾಲಯ', icon: BookOpen },
    { id: 'dashboard', label: 'Student Desk', labelKn: 'ವಿದ್ಯಾರ್ಥಿ ಫಲಕ', icon: LayoutDashboard },
    { id: 'quizzes', label: 'Evaluations', labelKn: 'ರಸಪ್ರಶ್ನೆಗಳು', icon: HelpCircle },
  ];

  if (currentUser?.role === 'teacher' || currentUser?.role === 'admin') {
    navLinks.push({ id: 'teacher', label: 'Teacher Desk', labelKn: 'ಶಿಕ್ಷಕರ ವೇದಿಕೆ', icon: FileCheck });
  }

  if (currentUser?.role === 'admin') {
    navLinks.push({ id: 'admin', label: 'Admin Console', labelKn: 'ಆಡಳಿತ ಕನ್ಸೋಲ್', icon: ShieldCheck });
  }

  const handleSwitchUser = (userKey) => {
    if (DEMO_USERS[userKey]) {
      setCurrentUser(DEMO_USERS[userKey]);
      setRoleDropdownOpen(false);
      if (userKey === 'teacher') setCurrentView('teacher');
      else if (userKey === 'admin') setCurrentView('admin');
      else setCurrentView('library');
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-surface transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div 
            onClick={() => setCurrentView('library')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-md bg-blue-700 flex items-center justify-center text-white font-bold shadow-xs transition-transform group-hover:scale-105">
              <BookOpen className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                VidyaSetu
              </span>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 font-heading">
                ವಿದ್ಯಾಸೇತು
              </span>
            </div>
          </div>

          {/* Minimalist Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentView(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-blue-400 font-semibold' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{lang === 'kn' ? link.labelKn : link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'kn' ? 'en' : 'kn')}
              className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Language"
            >
              {lang === 'kn' ? 'ENG' : 'ಕನ್ನಡ'}
            </button>

            {/* Dark Mode Toggle with Circular Fill Trigger */}
            <button
              onClick={(e) => onToggleTheme(e)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Saved Bookmarks */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Saved Documents"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarksCount > 0 && (
                <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600"></span>
              )}
            </button>

            {/* Role Profile Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-[9px]">
                    {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <span className="hidden sm:inline-block font-semibold text-xs">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-2 z-50 animate-modal text-xs">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                      <p className="font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 capitalize">{currentUser.role} Desk</p>
                    </div>

                    <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Role Mode
                    </div>

                    <button
                      onClick={() => handleSwitchUser('student')}
                      className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
                    >
                      <span className="text-slate-800 dark:text-slate-200">Chethan Kumar (Student)</span>
                      {currentUser.role === 'student' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>

                    <button
                      onClick={() => handleSwitchUser('teacher')}
                      className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
                    >
                      <span className="text-slate-800 dark:text-slate-200">Smt. Shailaja Gowda (Teacher)</span>
                      {currentUser.role === 'teacher' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>

                    <button
                      onClick={() => handleSwitchUser('admin')}
                      className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
                    >
                      <span className="text-slate-800 dark:text-slate-200">Dr. Nagaraj Bhat (Admin)</span>
                      {currentUser.role === 'admin' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>

                    <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5 cursor-pointer font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white transition-colors cursor-pointer"
              >
                {lang === 'kn' ? 'ಲಾಗಿನ್' : 'Sign In'}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1 animate-modal">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentView(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-left transition-colors ${
                    isActive 
                      ? 'bg-blue-700 text-white font-bold' 
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{lang === 'kn' ? link.labelKn : link.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1 text-xs text-blue-700 dark:text-blue-400 px-3">
              <button onClick={() => { setCurrentView('privacy'); setMobileMenuOpen(false); }} className="text-left py-1 hover:underline">
                Privacy Policy
              </button>
              <button onClick={() => { setCurrentView('terms'); setMobileMenuOpen(false); }} className="text-left py-1 hover:underline">
                Terms of Use
              </button>
              <button onClick={() => { onOpenDomainModal(); setMobileMenuOpen(false); }} className="text-left py-1 hover:underline">
                Custom Domain DNS
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
