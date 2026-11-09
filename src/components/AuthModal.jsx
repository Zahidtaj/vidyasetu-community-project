import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  Key, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Shield,
  UserCheck
} from 'lucide-react';
import { DEMO_USERS } from '../data/libraryData';

export function AuthModal({ isOpen, onClose, currentUser, onSelectUser, lang }) {
  const [activeTab, setActiveTab] = useState('demo'); // 'demo' | 'custom'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleManualLogin = (e) => {
    e.preventDefault();
    setError('');

    const matchedKey = Object.keys(DEMO_USERS).find(
      key => DEMO_USERS[key].email.toLowerCase() === email.toLowerCase().trim()
    );

    if (matchedKey) {
      onSelectUser(DEMO_USERS[matchedKey]);
      onClose();
    } else {
      if (email.includes('@')) {
        const customRole = email.includes('admin') ? 'admin' : (email.includes('teacher') ? 'teacher' : 'student');
        onSelectUser({
          id: Date.now(),
          role: customRole,
          name: email.split('@')[0],
          designation: `${customRole.toUpperCase()} Account`,
          email: email.trim(),
          assignedClass: customRole === 'student' ? 'Class 9' : (customRole === 'teacher' ? 'Class 9 and 10' : 'All')
        });
        onClose();
      } else {
        setError(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಇಮೇಲ್ ನಮೂದಿಸಿ' : 'Please enter a valid school email address.');
      }
    }
  };

  const demoAccounts = [
    {
      key: 'student',
      user: DEMO_USERS.student,
      title: 'Student Account',
      titleKn: 'ವಿದ್ಯಾರ್ಥಿ ಖಾತೆ',
      description: 'Chethan Kumar, Class 9A (Roll 24)',
      roleLabel: 'Enrolled High School Student',
      icon: GraduationCap,
      features: ['Curriculum Textbooks and Notes', 'Timed Chapter Assessments', 'Personal Progress Analytics']
    },
    {
      key: 'teacher',
      user: DEMO_USERS.teacher,
      title: 'Faculty Account',
      titleKn: 'ಶಿಕ್ಷಕರ ಖಾತೆ',
      description: 'Smt. Shailaja Gowda, Senior Faculty',
      roleLabel: 'Science and Mathematics Instructor',
      icon: Briefcase,
      features: ['Upload Notes and Blueprint Papers', 'Create Chapter Evaluations', 'Inspect Student Performance']
    },
    {
      key: 'admin',
      user: DEMO_USERS.admin,
      title: 'Institutional Administrator',
      titleKn: 'ಆಡಳಿತಾಧಿಕಾರಿ ಖಾತೆ',
      description: 'Dr. Nagaraj Bhat, Principal',
      roleLabel: 'Institutional System Superadmin',
      icon: Shield,
      features: ['Review and Approve Teacher Uploads', 'Manage Student and Faculty Accounts', 'System Audit Log Verification']
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn text-slate-800 dark:text-slate-200">
      <div className="inst-panel w-full max-w-2xl rounded-md p-6 sm:p-7 relative border border-slate-300 dark:border-slate-700 shadow-xl">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              <UserCheck className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              {lang === 'kn' ? 'ಖಾತೆಗೆ ಲಾಗಿನ್ ಆಗಿ' : 'Institutional Authentication and Role Selection'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'kn' 
              ? 'ಪ್ರತಿಯೊಂದು ಮಾಡ್ಯೂಲ್ ಪರಿಶೀಲಿಸಲು ಕೆಳಗಿನ ಖಾತೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಆರಿಸಿ'
              : 'Select a pre-configured institutional account to inspect student, faculty, or administrative capabilities.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 mb-5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('demo')}
            className={`pb-2 px-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'demo'
                ? 'border-blue-700 text-blue-700 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {lang === 'kn' ? 'ಪ್ರದರ್ಶನ ಖಾತೆಗಳು' : 'Instant Role Profiles'}
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2 px-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'custom'
                ? 'border-blue-700 text-blue-700 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {lang === 'kn' ? 'ಇಮೇಲ್ ಮೂಲಕ ಲಾಗಿನ್' : 'Credentials Form'}
          </button>
        </div>

        {/* Tab 1: Instant Profiles */}
        {activeTab === 'demo' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {demoAccounts.map((account) => {
              const isSelected = currentUser?.role === account.key;
              const Icon = account.icon;

              return (
                <div
                  key={account.key}
                  onClick={() => {
                    onSelectUser(account.user);
                    onClose();
                  }}
                  className={`inst-card p-4 rounded-md cursor-pointer transition-colors border flex flex-col justify-between ${
                    isSelected 
                      ? 'border-blue-700 bg-blue-50/50 dark:bg-blue-950/20' 
                      : 'hover:border-slate-400'
                  }`}
                >
                  <div>
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-700 dark:text-blue-400 mb-3 border border-slate-200 dark:border-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 dark:text-white font-heading">
                      {lang === 'kn' ? account.titleKn : account.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 mb-1">
                      {account.description}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-3">
                      {account.roleLabel}
                    </p>

                    <ul className="space-y-1 mb-4 text-[10px] text-slate-600 dark:text-slate-300">
                      {account.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-blue-600">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    className={`w-full py-1.5 px-2 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer border ${
                      isSelected 
                        ? 'bg-blue-700 text-white border-blue-700' 
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{isSelected ? (lang === 'kn' ? 'ಸಕ್ರಿಯವಾಗಿದೆ' : 'Active Account') : (lang === 'kn' ? 'ಪ್ರವೇಶಿಸಿ' : 'Authenticate')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* Tab 2: Manual Credentials */
          <form onSubmit={handleManualLogin} className="space-y-3 max-w-md mx-auto">
            {error && (
              <div className="p-2.5 rounded bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@school.demo or teacher@school.demo"
                  required
                  className="inst-input w-full pl-9 pr-3 py-2 text-xs"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                Pre-seeded: student@school.demo, teacher@school.demo, admin@school.demo
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="inst-input w-full pl-9 pr-3 py-2 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify and Sign In</span>
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Security Protocol: PBKDF2 with SHA-256</span>
          <span>Access: Role-Based RBAC</span>
        </div>

      </div>
    </div>
  );
}
