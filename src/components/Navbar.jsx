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
  setIsDark, 
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
    { id: 'library', label: 'Curriculum Repository', labelKn: 'ಡಿಜಿಟಲ್ ಗ್ರಂಥಾಲಯ', icon: BookOpen },
    { id: 'dashboard', label: 'Student Desk', labelKn: 'ವಿದ್ಯಾರ್ಥಿ ಫಲಕ', icon: LayoutDashboard },
    { id: 'quizzes', label: 'Chapter Evaluations', labelKn: 'ರಸಪ್ರಶ್ನೆ ಪರೀಕ್ಷೆಗಳು', icon: HelpCircle },
  ];

  if (currentUser?.role === 'teacher' || currentUser?.role === 'admin') {
    navLinks.push({ id: 'teacher', label: 'Teacher Portal', labelKn: 'ಶಿಕ್ಷಕರ ವೇದಿಕೆ', icon: FileCheck });
  }

  if (currentUser?.role === 'admin') {
    navLinks.push({ id: 'admin', label: 'Admin Console', labelKn: 'ಆಡಳಿತ ಕನ್ಸೋಲ್', icon: ShieldCheck });
  }

  const getRoleIcon = (role) => {
    if (role === 'admin') return <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
    if (role === 'teacher') return <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
    return <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
  };

  const handleSwitchUser = (userKey) => {
    if (DEMO_USERS[userKey]) {
      setCurrentUser(DEMO_USERS[userKey]);
      setRoleDropdownOpen(false);
      // Auto-switch view to match new role
      if (userKey === 'teacher') setCurrentView('teacher');
      else if (userKey === 'admin') setCurrentView('admin');
      else setCurrentView('library');
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-surface transition-colors">
      
      {/* Top Institutional Statutory Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 font-medium border-b border-slate-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Government of Karnataka · Department of School Education (DSERT / KSEAB)</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">VTU Community Project 1BCP308</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenDomainModal}
              className="text-slate-300 hover:text-white inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Globe className="w-3 h-3 text-blue-400" />
              <span>Production Domain DNS</span>
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setCurrentView('privacy')}
              className="hover:text-white cursor-pointer transition-colors"
            >
              DPDP Act Privacy Policy
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setCurrentView('terms')}
              className="hover:text-white cursor-pointer transition-colors"
            >
              Terms of Use
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Platform Title */}
          <div 
            onClick={() => setCurrentView('library')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-md bg-blue-700 flex items-center justify-center text-white font-bold shadow-xs transition-transform group-hover:scale-102">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                  VidyaSetu
                </span>
                <span className="text-sm font-bold text-blue-700 dark:text-blue-400 font-heading">
                  ವಿದ್ಯಾಸೇತು
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                State High School Educational Repository & Evaluation System
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentView(link.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-semibold transition-all btn-press cursor-pointer ${
                    isActive 
                      ? 'bg-blue-700 text-white shadow-xs' 
                      : 'text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{lang === 'kn' ? link.labelKn : link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'kn' ? 'en' : 'kn')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors btn-press cursor-pointer"
              title="Toggle Kannada / English"
            >
              <Globe className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
              <span>{lang === 'kn' ? 'English' : 'ಕನ್ನಡ'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors btn-press cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Bookmarks Drawer Trigger */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-2 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors btn-press cursor-pointer"
              title="Saved Curriculum Documents"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarksCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {bookmarksCount}
                </span>
              )}
            </button>

            {/* User Profile & Role Switcher Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors btn-press cursor-pointer"
                >
                  <div className="w-6 h-6 rounded bg-blue-700 text-white flex items-center justify-center font-bold text-[10px]">
                    {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="leading-tight font-bold text-xs">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{currentUser.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-md shadow-lg py-2 z-50 animate-modal">
                    
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentUser.designation}</p>
                    </div>

                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Switch Role (Evaluation Mode)
                    </div>

                    <button
                      onClick={() => handleSwitchUser('student')}
                      className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <div>
                          <span className="font-semibold block text-slate-800 dark:text-slate-200">Chethan Kumar</span>
                          <span className="text-[10px] text-slate-500">Student (Class 9A)</span>
                        </div>
                      </div>
                      {currentUser.role === 'student' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>

                    <button
                      onClick={() => handleSwitchUser('teacher')}
                      className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        <div>
                          <span className="font-semibold block text-slate-800 dark:text-slate-200">Smt. Shailaja Gowda</span>
                          <span className="text-[10px] text-slate-500">Teacher (Science & Math)</span>
                        </div>
                      </div>
                      {currentUser.role === 'teacher' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>

                    <button
                      onClick={() => handleSwitchUser('admin')}
                      className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <div>
                          <span className="font-semibold block text-slate-800 dark:text-slate-200">Dr. Nagaraj Bhat</span>
                          <span className="text-[10px] text-slate-500">Principal / Administrator</span>
                        </div>
                      </div>
                      {currentUser.role === 'admin' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>

                    <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 transition-colors cursor-pointer font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out Session</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition-colors btn-press cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? 'ಲಾಗಿನ್' : 'Sign In'}</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1.5 animate-modal">
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded text-xs font-semibold text-left transition-colors ${
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
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2 text-xs text-blue-700 dark:text-blue-400 px-3.5">
              <button onClick={() => { setCurrentView('privacy'); setMobileMenuOpen(false); }} className="text-left py-1 hover:underline">
                DPDP Act Privacy Policy
              </button>
              <button onClick={() => { setCurrentView('terms'); setMobileMenuOpen(false); }} className="text-left py-1 hover:underline">
                Terms of Educational Fair Use
              </button>
              <button onClick={() => { onOpenDomainModal(); setMobileMenuOpen(false); }} className="text-left py-1 hover:underline">
                Configure Custom Domain DNS
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
