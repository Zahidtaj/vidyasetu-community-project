import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  Award, 
  BookOpen, 
  Trash2,
  Briefcase
} from 'lucide-react';

export function TeacherPortal({ 
  lang, 
  currentUser, 
  resources, 
  onAddResource, 
  onDeleteResource,
  quizzes,
  onAddQuiz,
  quizAttempts 
}) {
  const [activeTab, setActiveTab] = useState('uploads'); // 'uploads' | 'new-resource' | 'new-quiz' | 'scores'
  
  // New Resource Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTitleKn, setNewTitleKn] = useState('');
  const [newClass, setNewClass] = useState('c9');
  const [newSubject, setNewSubject] = useState('Science');
  const [newCategory, setNewCategory] = useState('notes');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // New Quiz Form State
  const [quizTitle, setQuizTitle] = useState('');
  const [quizClass, setQuizClass] = useState('c9');
  const [quizSubject, setQuizSubject] = useState('Science');
  const [quizDuration, setQuizDuration] = useState(10);
  const [qText, setQText] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctOpt, setCorrectOpt] = useState(1);
  const [explanation, setExplanation] = useState('');
  const [quizSuccess, setQuizSuccess] = useState(false);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const classNames = { c8: 'Class 8', c9: 'Class 9', c10: 'Class 10' };

    const resourceObj = {
      id: Date.now(),
      title: newTitle.trim(),
      titleKn: newTitleKn.trim() || newTitle.trim(),
      subject: newSubject,
      subjectKn: newSubject === 'Science' ? 'ವಿಜ್ಞಾನ' : 'ಗಣಿತ',
      classId: newClass,
      className: classNames[newClass] || 'Class 9',
      category: newCategory,
      resourceType: 'pdf',
      language: 'Bilingual',
      status: 'pending',
      author: currentUser?.name || 'Smt. Shailaja Gowda (Government High School Faculty)',
      viewsCount: 0,
      downloadsCount: 0,
      uploadedOn: new Date().toISOString().split('T')[0],
      summary: newSummary.trim(),
      chapters: [
        {
          title: 'Section 1: Official Chapter Notes and Outline',
          content: newContent.trim() || 'Comprehensive notes and conceptual derivations uploaded by faculty.'
        }
      ]
    };

    onAddResource(resourceObj);
    setUploadSuccess(true);
    setNewTitle('');
    setNewTitleKn('');
    setNewSummary('');
    setNewContent('');
    setTimeout(() => setUploadSuccess(false), 4000);
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (!quizTitle.trim() || !qText.trim() || !opt1.trim() || !opt2.trim()) return;

    const classNames = { c8: 'Class 8', c9: 'Class 9', c10: 'Class 10' };

    const quizObj = {
      id: Date.now(),
      title: quizTitle.trim(),
      titleKn: quizTitle.trim(),
      classId: quizClass,
      className: classNames[quizClass] || 'Class 9',
      subject: quizSubject,
      durationMinutes: Number(quizDuration),
      questions: [
        {
          id: Date.now() + 1,
          question: qText.trim(),
          questionKn: qText.trim(),
          options: [
            { id: 1, text: opt1.trim(), isCorrect: correctOpt === 1 },
            { id: 2, text: opt2.trim(), isCorrect: correctOpt === 2 },
            { id: 3, text: opt3.trim() || 'Option 3', isCorrect: correctOpt === 3 },
            { id: 4, text: opt4.trim() || 'Option 4', isCorrect: correctOpt === 4 }
          ],
          explanation: explanation.trim() || 'Conceptual derivation provided by subject instructor.'
        }
      ]
    };

    onAddQuiz(quizObj);
    setQuizSuccess(true);
    setQuizTitle('');
    setQText('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setOpt4('');
    setExplanation('');
    setTimeout(() => setQuizSuccess(false), 4000);
  };

  const myResources = resources.filter(
    r => r.author?.includes(currentUser?.name || 'Shailaja') || currentUser?.role === 'admin'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn text-slate-800 dark:text-slate-200">
      
      {/* Teacher Profile Banner */}
      <div className="inst-panel rounded-md p-6 mb-6 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                  {currentUser?.name || 'Smt. Shailaja Gowda'}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Faculty Contributor
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {currentUser?.designation || 'Senior Science and Mathematics Faculty'} | Assigned: Class 9 and 10
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('new-resource')}
              className="py-2 px-3.5 rounded text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{lang === 'kn' ? 'ಹೊಸ ಟಿಪ್ಪಣಿ ಅಪ್‌ಲೋಡ್' : 'Submit Resource'}</span>
            </button>
            <button
              onClick={() => setActiveTab('new-quiz')}
              className="py-2 px-3.5 rounded text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'kn' ? 'ರಸಪ್ರಶ್ನೆ ರಚಿಸಿ' : 'New Evaluation'}</span>
            </button>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="mt-6 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('uploads')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer border ${
              activeTab === 'uploads'
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {lang === 'kn' ? 'ನನ್ನ ಅಪ್‌ಲೋಡ್‌ಗಳು' : 'My Uploads'} ({myResources.length})
          </button>
          <button
            onClick={() => setActiveTab('new-resource')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer border ${
              activeTab === 'new-resource'
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {lang === 'kn' ? 'ಅಪ್‌ಲೋಡ್ ಫಾರ್ಮ್' : 'Upload Submission'}
          </button>
          <button
            onClick={() => setActiveTab('new-quiz')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer border ${
              activeTab === 'new-quiz'
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {lang === 'kn' ? 'ರಸಪ್ರಶ್ನೆ ರಚನೆ' : 'Create Quiz'}
          </button>
          <button
            onClick={() => setActiveTab('scores')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer border ${
              activeTab === 'scores'
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ ಫಲಿತಾಂಶಗಳು' : 'Student Performance'} ({quizAttempts.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Uploads Status Tracker */}
      {activeTab === 'uploads' && (
        <div className="inst-card rounded-md p-5">
          <div className="mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {lang === 'kn' ? 'ಶಿಕ್ಷಕರ ಸಂಪನ್ಮೂಲಗಳ ಪರಿಶೀಲನಾ ಟ್ರ್ಯಾಕರ್' : 'Submitted Curriculum Documents Pipeline'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Submitted files require institutional administrator verification before appearing in the public student repository.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="pb-2">{lang === 'kn' ? 'ಶೀರ್ಷಿಕೆ' : 'Resource Title'}</th>
                  <th className="pb-2">{lang === 'kn' ? 'ತರಗತಿ & ವಿಷಯ' : 'Class and Subject'}</th>
                  <th className="pb-2">{lang === 'kn' ? 'ದಿನಾಂಕ' : 'Date'}</th>
                  <th className="pb-2">{lang === 'kn' ? 'ಸ್ಥಿತಿ' : 'Verification Status'}</th>
                  <th className="pb-2 text-right">{lang === 'kn' ? 'ಕ್ರಮ' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {myResources.map((res) => {
                  const isApproved = res.status === 'approved';
                  return (
                    <tr key={res.id} className="text-slate-700 dark:text-slate-300">
                      <td className="py-3 pr-4 font-semibold max-w-xs">
                        <div className="truncate">{res.title}</div>
                        <div className="text-[11px] text-slate-500 truncate font-normal">{res.summary}</div>
                      </td>
                      <td className="py-3 font-mono text-[11px]">
                        {res.className} | {res.subject}
                      </td>
                      <td className="py-3 text-slate-500 font-mono text-[11px]">{res.uploadedOn}</td>
                      <td className="py-3">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approved (Live)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            <Clock className="w-3 h-3" />
                            <span>Pending Review</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onDeleteResource(res.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete submission"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Upload New Resource Form */}
      {activeTab === 'new-resource' && (
        <div className="inst-card rounded-md p-6 max-w-3xl mx-auto">
          <div className="mb-5 pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              {lang === 'kn' ? 'ಹೊಸ ಕಲಿಕಾ ಸಾಮಗ್ರಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : 'Submit Educational Study Material for Review'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Karnataka Secondary Education Examination Board syllabus-aligned notes and blueprint papers.
            </p>
          </div>

          {uploadSuccess && (
            <div className="p-3 rounded bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Material submitted successfully. Placed into the Administrator Review Queue.
              </span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Title (English) *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Class 9 Physics: Work and Energy Derivations"
                  required
                  className="inst-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Title (Kannada)
                </label>
                <input
                  type="text"
                  value={newTitleKn}
                  onChange={(e) => setNewTitleKn(e.target.value)}
                  placeholder="ಉದಾ: ೯ನೇ ತರಗತಿ ಭೌತಶಾಸ್ತ್ರ: ಕೆಲಸ ಮತ್ತು ಶಕ್ತಿ"
                  className="inst-input w-full px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Class Level *
                </label>
                <select
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  className="inst-input w-full px-3 py-2 text-xs"
                >
                  <option value="c8">Class 8</option>
                  <option value="c9">Class 9</option>
                  <option value="c10">Class 10 (SSLC)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject *
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="inst-input w-full px-3 py-2 text-xs"
                >
                  <option value="Science">Science (ವಿಜ್ಞಾನ)</option>
                  <option value="Mathematics">Mathematics (ಗಣಿತ)</option>
                  <option value="Social Science">Social Science (ಸಮಾಜ ವಿಜ್ಞಾನ)</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Resource Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="inst-input w-full px-3 py-2 text-xs"
                >
                  <option value="notes">Study Notes</option>
                  <option value="textbook">Textbook Chapter</option>
                  <option value="qp">Model Question Paper</option>
                  <option value="video">Video Demonstration</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Executive Syllabus Summary *
              </label>
              <textarea
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                rows={2}
                placeholder="Curriculum learning objectives and formula highlights..."
                required
                className="inst-input w-full px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Chapter Text Content
              </label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={5}
                placeholder="Type or paste the complete chapter notes and numerical step-by-step solutions..."
                className="inst-input w-full px-3 py-2 text-xs font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit for Verification</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Create Quiz Form */}
      {activeTab === 'new-quiz' && (
        <div className="inst-card rounded-md p-6 max-w-3xl mx-auto">
          <div className="mb-5 pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              {lang === 'kn' ? 'ಹೊಸ ರಸಪ್ರಶ್ನೆ ಪರೀಕ್ಷೆ ರಚಿಸಿ' : 'Construct Chapter Multiple-Choice Assessment'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Include question text, 4 distinct options, correct key indicator, and scientific explanation.
            </p>
          </div>

          {quizSuccess && (
            <div className="p-3 rounded bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Assessment published. Immediately accessible in student testing module.</span>
            </div>
          )}

          <form onSubmit={handleQuizSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assessment Title *
                </label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="e.g. Class 9 Physics: Gravitation and Free Fall"
                  required
                  className="inst-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={quizDuration}
                  onChange={(e) => setQuizDuration(e.target.value)}
                  className="inst-input w-full px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Question Statement *
              </label>
              <textarea
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                rows={2}
                placeholder="What is the acceleration due to gravity on the surface of the Earth?"
                required
                className="inst-input w-full px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Option 1</label>
                <input
                  type="text"
                  value={opt1}
                  onChange={(e) => setOpt1(e.target.value)}
                  placeholder="9.8 m/s^2"
                  required
                  className="inst-input w-full px-3 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Option 2</label>
                <input
                  type="text"
                  value={opt2}
                  onChange={(e) => setOpt2(e.target.value)}
                  placeholder="10.8 m/s^2"
                  required
                  className="inst-input w-full px-3 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Option 3</label>
                <input
                  type="text"
                  value={opt3}
                  onChange={(e) => setOpt3(e.target.value)}
                  placeholder="8.8 m/s^2"
                  className="inst-input w-full px-3 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Option 4</label>
                <input
                  type="text"
                  value={opt4}
                  onChange={(e) => setOpt4(e.target.value)}
                  placeholder="11.2 m/s^2"
                  className="inst-input w-full px-3 py-1.5 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Correct Answer Key
                </label>
                <select
                  value={correctOpt}
                  onChange={(e) => setCorrectOpt(Number(e.target.value))}
                  className="inst-input w-full px-3 py-2 text-xs"
                >
                  <option value={1}>Option 1 is Correct</option>
                  <option value={2}>Option 2 is Correct</option>
                  <option value={3}>Option 3 is Correct</option>
                  <option value={4}>Option 4 is Correct</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Scientific Explanation
                </label>
                <input
                  type="text"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="g = G*M/R^2 = 9.8 m/s^2 at mean sea level on Earth."
                  className="inst-input w-full px-3 py-2 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Assessment to Students</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Student Scores Matrix */}
      {activeTab === 'scores' && (
        <div className="inst-card rounded-md p-5">
          <div className="mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ ರಸಪ್ರಶ್ನೆ ಅಂಕಗಳ ಕೋಷ್ಟಕ' : 'Verified Student Assessment Scoreboard'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Formative evaluation records for enrolled secondary school students.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="pb-2">{lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ' : 'Student Name'}</th>
                  <th className="pb-2">{lang === 'kn' ? 'ಪರೀಕ್ಷೆಯ ಶೀರ್ಷಿಕೆ' : 'Assessment'}</th>
                  <th className="pb-2">{lang === 'kn' ? 'ಅಂಕ' : 'Score'}</th>
                  <th className="pb-2">{lang === 'kn' ? 'ಶೇಕಡಾವಾರು' : 'Percentage'}</th>
                  <th className="pb-2">{lang === 'kn' ? 'ದಿನಾಂಕ' : 'Timestamp'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                {quizAttempts.map((att) => (
                  <tr key={att.id} className="text-slate-700 dark:text-slate-300">
                    <td className="py-2.5 font-sans font-semibold">{att.studentName}</td>
                    <td className="py-2.5 font-sans">{att.quizTitle}</td>
                    <td className="py-2.5">{att.score} / {att.totalQuestions}</td>
                    <td className="py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        att.percentage >= 75 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {att.percentage}%
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-500">{att.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
