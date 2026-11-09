import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';

export function QuizModal({ quiz, lang, onClose, onCompleteQuiz }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState((quiz.durationMinutes || 10) * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  const questions = quiz.questions || [];
  const currentQ = questions[currentQIndex];

  // Countdown timer
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectOption = (questionId, optionId) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    const evaluatedQuestions = questions.map(q => {
      const chosenOptionId = selectedAnswers[q.id];
      const correctOption = q.options.find(opt => opt.isCorrect);
      const isCorrect = chosenOptionId === correctOption?.id;
      if (isCorrect) score += 1;
      return {
        ...q,
        chosenOptionId,
        correctOptionId: correctOption?.id,
        isCorrect
      };
    });

    const percentage = Math.round((score / questions.length) * 100);

    const resultData = {
      score,
      total: questions.length,
      percentage,
      evaluatedQuestions
    };

    setResults(resultData);
    setIsSubmitted(true);

    if (onCompleteQuiz) {
      onCompleteQuiz({
        id: Date.now(),
        quizId: quiz.id,
        quizTitle: quiz.title,
        score,
        totalQuestions: questions.length,
        percentage,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16)
      });
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setTimeLeft((quiz.durationMinutes || 10) * 60);
    setCurrentQIndex(0);
    setIsSubmitted(false);
    setResults(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn text-slate-800 dark:text-slate-200">
      <div className="inst-panel w-full max-w-2xl rounded-md p-6 relative border border-slate-300 dark:border-slate-700 shadow-xl max-h-[90vh] flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono">
                {quiz.className} | {quiz.subject}
              </span>
              <span className="text-xs text-slate-500 font-medium">Timed Chapter Assessment</span>
            </div>
            <h3 className="text-base font-bold font-heading line-clamp-1 text-slate-900 dark:text-white">
              {lang === 'kn' ? (quiz.titleKn || quiz.title) : quiz.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold border ${
                timeLeft < 120 
                  ? 'bg-red-50 text-red-700 border-red-300' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {!isSubmitted ? (
            <div>
              {/* Question progress */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
                <span>
                  {lang === 'kn' ? `ಪ್ರಶ್ನೆ ${currentQIndex + 1} / ${questions.length}` : `Question ${currentQIndex + 1} of ${questions.length}`}
                </span>
                <span className="font-mono">{Math.round(((currentQIndex + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 rounded bg-slate-200 dark:bg-slate-800 mb-5 overflow-hidden">
                <div 
                  className="h-full bg-blue-700 rounded transition-all"
                  style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>

              {/* Question Statement */}
              <div className="mb-5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed mb-1">
                  {currentQ.question}
                </h4>
                {currentQ.questionKn && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {currentQ.questionKn}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5 mb-6">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQ.id, opt.id)}
                      className={`p-3 rounded cursor-pointer border transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-700 bg-blue-50/50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span className="text-xs font-medium">{opt.text}</span>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-blue-700 bg-blue-700' : 'border-slate-400'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Results & Scorecard */
            <div className="py-2">
              <div className="text-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 rounded bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold font-heading mb-0.5 text-slate-900 dark:text-white">
                  {lang === 'kn' ? 'ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶ ದಾಖಲೆ' : 'Assessment Result Record'}
                </h4>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 font-mono mb-1">
                  {results.score} / {results.total} ({results.percentage}%)
                </div>
                <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold border ${
                  results.percentage >= 75
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                }`}>
                  {results.percentage >= 75 ? 'Classification: First Class with Distinction' : 'Classification: Passed'}
                </span>
              </div>

              {/* Question Review Breakdown */}
              <div className="space-y-3">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {lang === 'kn' ? 'ಪ್ರಶ್ನಾವಳಿ ವಿವರಣೆ ಮತ್ತು ಉತ್ತರ ಪರಿಶೀಲನೆ' : 'Question-by-Question Derivation & Explanations'}
                </h5>
                {results.evaluatedQuestions.map((q, idx) => (
                  <div 
                    key={q.id}
                    className={`p-3.5 rounded border ${
                      q.isCorrect 
                        ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900 dark:bg-emerald-950/20' 
                        : 'border-red-200 bg-red-50/30 dark:border-red-900 dark:bg-red-950/20'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-1.5">
                      {q.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {idx + 1}. {q.question}
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] space-y-0.5 pl-6 mb-2">
                      <div className="text-slate-500">
                        Selected: <span className={q.isCorrect ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                          {q.options.find(o => o.id === q.chosenOptionId)?.text || 'Not answered'}
                        </span>
                      </div>
                      {!q.isCorrect && (
                        <div className="text-emerald-700 font-semibold">
                          Correct Key: {q.options.find(o => o.id === q.correctOptionId)?.text}
                        </div>
                      )}
                    </div>

                    <div className="pl-6 pt-1.5 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                      <strong>Curriculum Derivation:</strong> {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between mt-3">
          {!isSubmitted ? (
            <>
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                className="py-1.5 px-3 rounded text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 cursor-pointer border border-slate-300 dark:border-slate-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? 'ಹಿಂದಿನದು' : 'Previous'}</span>
              </button>

              <div className="flex gap-2">
                {currentQIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQIndex(prev => prev + 1)}
                    className="py-1.5 px-3.5 rounded text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>{lang === 'kn' ? 'ಮುಂದಿನದು' : 'Next'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="py-1.5 px-4 rounded text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{lang === 'kn' ? 'ಪರೀಕ್ಷೆ ಸಲ್ಲಿಸಿ' : 'Submit Evaluation'}</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex justify-end gap-2 w-full">
              <button
                onClick={handleRestart}
                className="py-1.5 px-3 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1 cursor-pointer border border-slate-300 dark:border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ' : 'Retake Assessment'}</span>
              </button>
              <button
                onClick={onClose}
                className="py-1.5 px-4 rounded text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white cursor-pointer"
              >
                {lang === 'kn' ? 'ಮುಕ್ತಾಯ' : 'Close'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
