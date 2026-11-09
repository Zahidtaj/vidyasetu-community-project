import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Bookmark, 
  Bell, 
  ArrowRight,
  FileText,
  HelpCircle
} from 'lucide-react';
import { ANNOUNCEMENTS } from '../data/libraryData';

export function StudentDashboard({ 
  lang, 
  currentUser, 
  resources, 
  quizzes, 
  quizAttempts, 
  bookmarks, 
  onOpenResource, 
  onStartQuiz, 
  onGoToLibrary 
}) {
  const studentAttempts = quizAttempts.filter(
    a => a.studentEmail === currentUser?.email || a.studentName === currentUser?.name
  );
  const totalCompleted = studentAttempts.length;
  const avgScore = totalCompleted > 0
    ? Math.round(studentAttempts.reduce((acc, curr) => acc + curr.percentage, 0) / totalCompleted)
    : 0;

  const bookmarkedResources = resources.filter(r => bookmarks.includes(r.id));
  const approvedCount = resources.filter(r => r.status === 'approved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-slate-800 dark:text-slate-200">
      
      {/* Welcome Banner */}
      <div className="academic-card p-6 sm:p-7 mb-6 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                  {lang === 'kn' ? `ವಿದ್ಯಾರ್ಥಿ ಫಲಕ: ${currentUser?.name || 'ವಿದ್ಯಾರ್ಥಿ'}` : `Student Academic Desk: ${currentUser?.name || 'Student'}`}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {currentUser?.assignedClass || 'Class 9'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {currentUser?.designation || 'Class 9A, Roll No. 24'} | Karnataka Secondary Education Board Curriculum
              </p>
            </div>
          </div>

          <button
            onClick={onGoToLibrary}
            className="py-2 px-3.5 rounded text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'kn' ? 'ಗ್ರಂಥಾಲಯಕ್ಕೆ ಹೋಗಿ' : 'Access Repository'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        <div className="academic-card p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>{lang === 'kn' ? 'ಲಭ್ಯವಿರುವ ಸಂಪನ್ಮೂಲಗಳು' : 'Approved Resources'}</span>
            <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading tabular-nums">
            {approvedCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Verified curriculum materials</p>
        </div>

        <div className="academic-card p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>{lang === 'kn' ? 'ಪೂರ್ಣಗೊಂಡ ಪರೀಕ್ಷೆಗಳು' : 'Quizzes Completed'}</span>
            <div className="w-8 h-8 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading tabular-nums">
            {totalCompleted} <span className="text-lg font-normal text-slate-400">/ {quizzes.length}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Evaluations recorded</p>
        </div>

        <div className="academic-card p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>{lang === 'kn' ? 'ಸರಾಸರಿ ಅಂಕ' : 'Average Evaluation'}</span>
            <div className="w-8 h-8 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading tabular-nums">
            {avgScore}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Performance indicator</p>
        </div>

        <div className="academic-card p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>{lang === 'kn' ? 'ಉಳಿಸಿದ ಸಾಮಗ್ರಿಗಳು' : 'Saved Bookmarks'}</span>
            <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading tabular-nums">
            {bookmarks.length}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Quick revision list</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3): Subject Progress & Recent Quizzes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Syllabus Progress */}
          <div className="academic-card p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>{lang === 'kn' ? 'ವಿಷಯವಾರು ಪಠ್ಯಕ್ರಮ ಪ್ರಗತಿ' : 'Curriculum Coverage Status'}</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Term 2 Active</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>General Science (Biology and Physics)</span>
                  <span className="font-mono text-blue-700 dark:text-blue-400">80%</span>
                </div>
                <div className="w-full h-2 rounded bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-700 rounded transition-all" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Mathematics (Algebra and Geometry)</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400">85%</span>
                </div>
                <div className="w-full h-2 rounded bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-700 rounded transition-all" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Social Science (History and Civics)</span>
                  <span className="font-mono text-amber-700 dark:text-amber-400">60%</span>
                </div>
                <div className="w-full h-2 rounded bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-600 rounded transition-all" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Quiz Performance Table */}
          <div className="academic-card p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{lang === 'kn' ? 'ನನ್ನ ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶಗಳು' : 'My Completed Assessment Records'}</span>
              </h3>
            </div>

            {studentAttempts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                {lang === 'kn' ? 'ಇನ್ನೂ ಯಾವುದೇ ರಸಪ್ರಶ್ನೆ ತೆಗೆದುಕೊಂಡಿಲ್ಲ' : 'No assessment attempts recorded. Complete a quiz to view records.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="pb-2">{lang === 'kn' ? 'ಪರೀಕ್ಷೆ' : 'Evaluation Title'}</th>
                      <th className="pb-2">{lang === 'kn' ? 'ಅಂಕ' : 'Score'}</th>
                      <th className="pb-2">{lang === 'kn' ? 'ಶೇಕಡಾವಾರು' : 'Percentage'}</th>
                      <th className="pb-2">{lang === 'kn' ? 'ದಿನಾಂಕ' : 'Timestamp'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                    {studentAttempts.map((attempt) => (
                      <tr key={attempt.id} className="text-slate-700 dark:text-slate-300">
                        <td className="py-2.5 font-sans font-semibold">{attempt.quizTitle}</td>
                        <td className="py-2.5">{attempt.score} / {attempt.totalQuestions}</td>
                        <td className="py-2.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {attempt.percentage}%
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-500">{attempt.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bookmarked Materials */}
          <div className="academic-card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <Bookmark className="w-4 h-4 text-blue-600" />
              <span>{lang === 'kn' ? 'ಉಳಿಸಿದ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳು' : 'Bookmarked Study Materials'}</span>
            </h3>

            {bookmarkedResources.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                {lang === 'kn' ? 'ಯಾವುದೇ ಬುಕ್‌ಮಾರ್ಕ್‌ಗಳು ಇಲ್ಲ' : 'No saved bookmarks. Click bookmark on any resource card to save it.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bookmarkedResources.map((res) => (
                  <div 
                    key={res.id}
                    onClick={() => onOpenResource(res)}
                    className="p-3 rounded border border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-slate-50 dark:bg-slate-900 cursor-pointer transition-colors"
                  >
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase">{res.className} | {res.subject}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5 mb-1">
                      {lang === 'kn' ? (res.titleKn || res.title) : res.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{res.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1/3): Announcements & Quick Quizzes */}
        <div className="space-y-6">
          
          {/* Institutional Notices */}
          <div className="academic-card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <Bell className="w-4 h-4 text-amber-600" />
              <span>{lang === 'kn' ? 'ಶಾಲಾ ಪ್ರಕಟಣೆಗಳು' : 'Institutional Notices'}</span>
            </h3>

            <div className="space-y-3">
              {ANNOUNCEMENTS.map((item) => (
                <div key={item.id} className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                    <span>{item.date}</span>
                    <span className="font-semibold text-blue-700 dark:text-blue-400">{item.target}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                    {lang === 'kn' ? item.titleKn : item.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {lang === 'kn' ? item.messageKn : item.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Quiz Launchers */}
          <div className="academic-card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>{lang === 'kn' ? 'ಅಧ್ಯಾಯ ರಸಪ್ರಶ್ನೆಗಳು' : 'Chapter Evaluations'}</span>
            </h3>

            <div className="space-y-3">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400">{quiz.className} | {quiz.subject}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5 mb-1">
                      {lang === 'kn' ? quiz.titleKn : quiz.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mb-2.5">
                      <Clock className="w-3 h-3" />
                      {quiz.durationMinutes} mins | {quiz.questions.length} Questions
                    </span>
                  </div>
                  <button
                    onClick={() => onStartQuiz(quiz)}
                    className="w-full py-1.5 rounded text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>{lang === 'kn' ? 'ಪರೀಕ್ಷೆ ಆರಂಭಿಸಿ' : 'Start Assessment'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
