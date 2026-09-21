import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Send,
  X,
  Award,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { Exam, ExamQuestion } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

interface ExamPlayerModalProps {
  exam: Exam;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ExamPlayerModal: React.FC<ExamPlayerModalProps> = ({
  exam,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { token, user } = useAuth();
  const { language } = useLanguage();
  const { success, error } = useToast();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState((exam.durationMinutes || 15) * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  // Initialize or reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIdx(0);
      setSelectedAnswers({});
      setTimeRemainingSeconds((exam.durationMinutes || 15) * 60);
      setResult(null);
    }
  }, [isOpen, exam]);

  // Exam Countdown Timer
  useEffect(() => {
    if (!isOpen || result) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, result]);

  if (!isOpen) return null;

  const currentQ: ExamQuestion | undefined = exam.questions[currentQuestionIdx];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (result) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitExam = async () => {
    if (isSubmitting || result) return;
    if (!token) {
      error(language === 'bn' ? 'দয়া করে লগইন করুন' : 'Please login first');
      return;
    }

    setIsSubmitting(true);
    try {
      const answersPayload = exam.questions.map((q) => ({
        questionId: q.id,
        selectedIndex: selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : -1
      }));

      const res = await fetch(`/api/exams/${exam.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ answers: answersPayload })
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
        if (data.passed) {
          success(language === 'bn' ? 'অভিনন্দন! আপনি পরীক্ষায় উত্তীর্ণ হয়েছেন।' : 'Congratulations! You passed the exam.');
        } else {
          error(language === 'bn' ? 'দুঃখিত! পাস মার্ক অর্জন করতে পারেননি। পুনরায় চেষ্টা করুন।' : 'You did not meet the passing score. Please try again.');
        }
        if (onSuccess) onSuccess();
      } else {
        error(data.error || 'পরীক্ষা সাবমিট করতে সমস্যা হয়েছে');
      }
    } catch (err) {
      console.error(err);
      error('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি');
    } finally {
      setIsSubmitting(false);
    }
  };

  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = exam.questions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {language === 'bn' ? 'কুইজ / পরীক্ষা' : 'Exam Portal'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {answeredCount}/{totalQuestions} {language === 'bn' ? 'উত্তর সম্পন্ন' : 'Answered'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
              {exam.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* TIMER */}
            {!result && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-sm border ${
                  timeRemainingSeconds < 180
                    ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 animate-pulse'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL CONTENT */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {result ? (
            /* RESULTS SCREEN */
            <div className="space-y-6 py-4">
              <div
                className={`p-6 rounded-2xl text-center space-y-3 border ${
                  result.passed
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                }`}
              >
                <div className="inline-flex p-3 rounded-full bg-white dark:bg-slate-800 shadow-xs">
                  {result.passed ? (
                    <Award className="w-10 h-10 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-10 h-10 text-rose-600" />
                  )}
                </div>

                <h3 className="text-2xl font-black">
                  {result.passed
                    ? language === 'bn'
                      ? 'অভিনন্দন! আপনি উত্তীর্ণ হয়েছেন 🎉'
                      : 'Congratulations! You Passed! 🎉'
                    : language === 'bn'
                    ? 'পাস করতে পারেননি 😔'
                    : 'Better Luck Next Time! 😔'}
                </h3>

                <div className="flex items-center justify-center gap-6 py-2">
                  <div>
                    <div className="text-3xl font-black">{result.score}%</div>
                    <div className="text-xs opacity-75">{language === 'bn' ? 'অর্জিত স্কোর' : 'Your Score'}</div>
                  </div>
                  <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />
                  <div>
                    <div className="text-3xl font-black">
                      {result.correctCount}/{result.totalQuestions}
                    </div>
                    <div className="text-xs opacity-75">{language === 'bn' ? 'সঠিক উত্তর' : 'Correct Answers'}</div>
                  </div>
                  <div className="h-8 w-px bg-slate-300 dark:bg-slate-700" />
                  <div>
                    <div className="text-3xl font-black">{result.passingScore}%</div>
                    <div className="text-xs opacity-75">{language === 'bn' ? 'পাস মার্ক' : 'Passing Mark'}</div>
                  </div>
                </div>
              </div>

              {/* REVIEW ALL QUESTIONS WITH CORRECT ANSWERS */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'bn' ? 'প্রশ্নের উত্তর বিশ্লেষণ ও সঠিক সমাধান:' : 'Answer Explanations:'}</span>
                </h4>

                {exam.questions.map((q, idx) => {
                  const userAnsIdx = selectedAnswers[q.id];
                  const isCorrect = userAnsIdx === q.correctAnswerIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border ${
                        isCorrect
                          ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-rose-200 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 mb-3">
                        <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white dark:bg-slate-800 shadow-xs">
                          {idx + 1}
                        </span>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          {q.question}
                        </p>
                      </div>

                      <div className="space-y-2 ml-8 text-xs">
                        {q.options.map((opt, optIdx) => {
                          const isOptCorrect = optIdx === q.correctAnswerIndex;
                          const isOptUserChoice = optIdx === userAnsIdx;

                          let badgeClass = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300';
                          if (isOptCorrect) {
                            badgeClass = 'border-emerald-500 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold';
                          } else if (isOptUserChoice && !isOptCorrect) {
                            badgeClass = 'border-rose-500 bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-bold';
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`p-2.5 rounded-lg border flex items-center justify-between ${badgeClass}`}
                            >
                              <span>
                                <strong className="mr-2">{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                              </span>
                              {isOptCorrect && (
                                <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-bold">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  {language === 'bn' ? 'সঠিক উত্তর' : 'Correct'}
                                </span>
                              )}
                              {isOptUserChoice && !isOptCorrect && (
                                <span className="text-[11px] text-rose-600 flex items-center gap-1 font-bold">
                                  <XCircle className="w-3.5 h-3.5" />
                                  {language === 'bn' ? 'আপনার উত্তর' : 'Your Choice'}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <div className="mt-3 ml-8 p-2.5 rounded-lg bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                          <strong className="text-emerald-600">{language === 'bn' ? 'ব্যাখ্যা: ' : 'Explanation: '}</strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ACTIVE EXAM QUESTION TAKER */
            <div className="space-y-6">
              {/* Question Navigator Dots */}
              <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                {exam.questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentQuestionIdx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105'
                          : isAnswered
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* CURRENT QUESTION */}
              {currentQ && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {language === 'bn' ? 'প্রশ্ন' : 'Question'} {currentQuestionIdx + 1} / {totalQuestions}
                    </span>
                    <span>{currentQ.points || 10} {language === 'bn' ? 'নম্বর' : 'Points'}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-relaxed">
                    {currentQ.question}
                  </h3>

                  {/* 4 OPTIONS */}
                  <div className="space-y-2.5 pt-2">
                    {currentQ.options.map((option, optIdx) => {
                      const isSelected = selectedAnswers[currentQ.id] === optIdx;

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(currentQ.id, optIdx)}
                          className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                isSelected
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="text-sm font-medium">{option}</span>
                          </div>
                          {isSelected && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          {result ? (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setSelectedAnswers({});
                  setCurrentQuestionIdx(0);
                  setTimeRemainingSeconds((exam.durationMinutes || 15) * 60);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{language === 'bn' ? 'পুনরায় পরীক্ষা দিন' : 'Retake Exam'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md"
              >
                {language === 'bn' ? 'সম্পন্ন করুন' : 'Close Exam'}
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center gap-1 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{language === 'bn' ? 'পূর্ববর্তী' : 'Previous'}</span>
              </button>

              <div className="flex items-center gap-2">
                {currentQuestionIdx < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIdx((p) => Math.min(totalQuestions - 1, p + 1))}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold text-xs flex items-center gap-1 hover:bg-slate-300 dark:hover:bg-slate-600"
                  >
                    <span>{language === 'bn' ? 'পরবর্তী' : 'Next'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitExam}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {isSubmitting
                        ? language === 'bn'
                          ? 'যাচাই হচ্ছে...'
                          : 'Submitting...'
                        : language === 'bn'
                        ? 'পরীক্ষা জমা দিন'
                        : 'Submit Exam'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
