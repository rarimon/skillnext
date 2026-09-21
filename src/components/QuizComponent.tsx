import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, XCircle, Award, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { Quiz } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface QuizComponentProps {
  quiz: Quiz;
  onPass?: (score: number) => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, onPass }) => {
  const { language, t } = useLanguage();
  const { token } = useAuth();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentQ = quiz.questions[currentIdx];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleFinishQuiz = async () => {
    setSubmitting(true);
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    const hasPassed = calculatedScore >= quiz.passingScore;

    setScore(calculatedScore);
    setPassed(hasPassed);
    setSubmitted(true);

    if (token) {
      try {
        await fetch(`/api/quizzes/${quiz.id}/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            answers: selectedAnswers,
            score: calculatedScore,
            passed: hasPassed
          })
        });
      } catch (err) {
        console.error('Failed to submit quiz attempt', err);
      }
    }

    if (hasPassed) {
      try {
        confetti({ particleCount: 60, spread: 60 });
      } catch {}
      if (onPass) onPass(calculatedScore);
    }

    setSubmitting(false);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setCurrentIdx(0);
    setScore(0);
    setPassed(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {quiz.title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {quiz.description || (language === 'bn' ? 'মডিউলের কনসেপ্ট মূল্যায়নে অংশগ্রহণ করুন' : 'Test your knowledge on this module')}
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start">
          {t('quizPassing')}: {quiz.passingScore}%
        </div>
      </div>

      {!submitted ? (
        <div className="pt-5 space-y-6">
          {/* Question Index Progress */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              {language === 'bn' ? 'প্রশ্ন' : 'Question'} {currentIdx + 1} / {quiz.questions.length}
            </span>
            <span>
              {Math.round(((currentIdx + 1) / quiz.questions.length) * 100)}% {language === 'bn' ? 'অগ্রগতি' : 'Progress'}
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>

          {/* Current Question */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {currentQ.question}
            </h4>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIndex) => {
                const isSelected = selectedAnswers[currentQ.id] === optIndex;
                return (
                  <button
                    key={optIndex}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, optIndex)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-medium'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-40"
            >
              {language === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
            </button>

            {currentIdx < quiz.questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                className="px-5 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <span>{language === 'bn' ? 'পরবর্তী' : 'Next'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting || Object.keys(selectedAnswers).length < quiz.questions.length}
                onClick={handleFinishQuiz}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                {submitting ? '...' : t('submitQuiz')}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Result Screen */
        <div className="pt-6 text-center space-y-5">
          <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
            passed ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-rose-100 dark:bg-rose-950 text-rose-600'
          }`}>
            {passed ? <CheckCircle className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
          </div>

          <div>
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {passed ? t('quizPassedMsg') : t('quizFailedMsg')}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'bn' ? 'আপনার প্রাপ্ত স্কোর' : 'Your Score'}: <strong className="text-base text-slate-800 dark:text-slate-100">{score}%</strong> (পাস মার্কস: {quiz.passingScore}%)
            </p>
          </div>

          {/* Review of all questions */}
          <div className="text-left space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              {language === 'bn' ? 'প্রশ্নের উত্তর পর্যালোচনা:' : 'Answers Breakdown:'}
            </h5>
            {quiz.questions.map((q, idx) => {
              const userAns = selectedAnswers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-xl border text-xs ${
                    isCorrect
                      ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'border-rose-200 dark:border-rose-800/60 bg-rose-50/50 dark:bg-rose-950/30'
                  }`}
                >
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {idx + 1}. {q.question}
                  </p>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">
                    {language === 'bn' ? 'সঠিক উত্তর' : 'Correct'}: <strong>{q.options[q.correctAnswer]}</strong>
                  </p>
                  {q.explanation && (
                    <p className="mt-1 text-[11px] text-slate-500 italic">
                      ব্যাখ্যা: {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Retry Button */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('retakeQuiz')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
