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
  Briefcase
} from 'lucide-react';

export function Navbar({ 
  lang, 
  setLang, 
  isDark, 
  setIsDark, 
  currentUser, 
  onOpenAuth, 
  onLogout,
  currentView,
  setCurrentView,
  bookmarksCount, 
  onOpenBookmarks,
  onOpenDomainModal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'library', label: 'Repository', labelKn: 'ಡಿಜಿಟಲ್ ಗ್ರಂಥಾಲಯ', icon: BookOpen },
    { id: 'dashboard', label: 'Student Desk', labelKn: 'ವಿದ್ಯಾರ್ಥಿ ಫಲಕ', icon: LayoutDashboard },
    { id: 'quizzes', label: 'Evaluations', labelKn: 'ರಸಪ್ರಶ್ನೆಗಳು', icon: HelpCircle },
  ];

  if (currentUser?.role === 'teacher' || currentUser?.role === 'admin') {
    navLinks.push({ id: 'teacher', label: 'Teacher Desk', labelKn: 'ಶಿಕ್ಷಕರ ವೇದಿಕೆ', icon: FileCheck });
  }

  if (currentUser?.role === 'admin') {
    navLinks.push({ id: 'admin', label: 'Admin Console', labelKn: 'ಆಡಳಿತ ಕನ್ಸೋಲ್', icon: ShieldCheck });
  }

  const getRoleIcon = (role) => {
    if (role === 'admin') return <Shield className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />;
    if (role === 'teacher') return <Briefcase className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />;
    return <GraduationCap className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* Top Institutional Metadata Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 font-medium border-b border-slate-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span>Karnataka State Secondary Education Board (Classes 8, 9, 10) | VTU Community Project 1BCP308</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div 
            onClick={() => setCurrentView('library')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded bg-blue-700 flex items-center justify-center text-white font-bold shadow-sm transition-transform group-hover:scale-102">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-heading">
                  VidyaSetu
                </span>
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-400 font-heading">
                  ವಿದ್ಯಾಸೇತು
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                State High School Educational Repository
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentView(link.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-all btn-press cursor-pointer ${
                    isActive 
                      ? 'bg-blue-700 text-white shadow-xs' 
                      : 'text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{lang === 'kn' ? link.labelKn : link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'kn' ? 'en' : 'kn')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors btn-press cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'kn' ? 'English' : 'ಕನ್ನಡ'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors btn-press cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Bookmarks */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors btn-press cursor-pointer"
              title="Saved Documents"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarksCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {bookmarksCount}
                </span>
              )}
            </button>

            {/* User Account / Role Badge */}
            {currentUser ? (
              <div className="flex items-center gap-1 pl-1">
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors btn-press cursor-pointer"
                  title="Switch Role or Account"
                >
                  {getRoleIcon(currentUser.role)}
                  <div className="hidden md:flex flex-col text-left">
                    <span className="leading-tight font-bold">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{currentUser.role}</span>
                  </div>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors btn-press cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition-colors btn-press cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? 'ಲಾಗಿನ್' : 'Sign In'}</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1 animate-fadeIn">
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
                  className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold text-left transition-colors ${
                    isActive 
                      ? 'bg-blue-700 text-white' 
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{lang === 'kn' ? link.labelKn : link.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-4 text-xs text-blue-700 dark:text-blue-400 px-3">
              <button onClick={() => { setCurrentView('privacy'); setMobileMenuOpen(false); }}>Privacy Policy</button>
              <button onClick={() => { setCurrentView('terms'); setMobileMenuOpen(false); }}>Terms of Use</button>
              <button onClick={() => { onOpenDomainModal(); setMobileMenuOpen(false); }}>Custom Domain</button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
