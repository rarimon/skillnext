import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Award,
  HelpCircle,
  FileCheck,
  AlertCircle,
  Sparkles,
  Layers,
  ChevronRight,
  BookOpen,
  Info
} from 'lucide-react';
import { Exam, ExamQuestion, Course } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

interface ExamBuilderPageProps {
  initialExam?: Exam | null;
  courses: Course[];
  preSelectedCourseId?: string;
  onSave: (examData: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ExamBuilderPage: React.FC<ExamBuilderPageProps> = ({
  initialExam,
  courses,
  preSelectedCourseId,
  onSave,
  onCancel,
  isSubmitting = false
}) => {
  const { language } = useLanguage();
  const { error: toastError } = useToast();

  const [courseId, setCourseId] = useState<string>(
    initialExam?.courseId || preSelectedCourseId || courses[0]?.id || ''
  );
  const [title, setTitle] = useState<string>(initialExam?.title || '');
  const [description, setDescription] = useState<string>(initialExam?.description || '');
  const [durationMinutes, setDurationMinutes] = useState<number>(initialExam?.durationMinutes || 15);
  const [passingScore, setPassingScore] = useState<number>(initialExam?.passingScore || 70);
  const [isPublished, setIsPublished] = useState<boolean>(
    initialExam?.isPublished !== undefined ? initialExam.isPublished : true
  );

  const [questions, setQuestions] = useState<ExamQuestion[]>(() => {
    if (initialExam?.questions && initialExam.questions.length > 0) {
      return initialExam.questions.map((q) => ({
        ...q,
        options: [...q.options]
      }));
    }
    return [
      {
        id: `eq-${Date.now()}-0`,
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: '',
        points: 10
      }
    ];
  });

  const totalCalculatedPoints = questions.reduce((acc, q) => acc + (q.points || 10), 0);

  // Add a new question
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: `eq-${Date.now()}-${prev.length}`,
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: '',
        points: 10
      }
    ]);
  };

  // Remove a question
  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) {
      toastError(language === 'bn' ? 'পরীক্ষায় অন্তত একটি প্রশ্ন থাকা আবশ্যক' : 'Exam must have at least one question');
      return;
    }
    setQuestions((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Update question prompt
  const handleQuestionTextChange = (qIdx: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx] = { ...copy[qIdx], question: text };
      return copy;
    });
  };

  // Update option text
  const handleOptionChange = (qIdx: number, optIdx: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const opts = [...copy[qIdx].options];
      opts[optIdx] = text;
      copy[qIdx] = { ...copy[qIdx], options: opts };
      return copy;
    });
  };

  // Set correct answer
  const handleCorrectAnswerChange = (qIdx: number, optIdx: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx] = { ...copy[qIdx], correctAnswerIndex: optIdx };
      return copy;
    });
  };

  // Update explanation
  const handleExplanationChange = (qIdx: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx] = { ...copy[qIdx], explanation: text };
      return copy;
    });
  };

  // Update points
  const handlePointsChange = (qIdx: number, points: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx] = { ...copy[qIdx], points: Math.max(1, points) };
      return copy;
    });
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseId) {
      toastError(language === 'bn' ? 'অনুগ্রহ করে কোর্স নির্বাচন করুন' : 'Please select a course');
      return;
    }

    if (!title.trim()) {
      toastError(language === 'bn' ? 'পরীক্ষার শিরোনাম আবশ্যক' : 'Exam title is required');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toastError(
          language === 'bn' ? `প্রশ্ন #${i + 1} এর প্রশ্নটি পূরণ করুন` : `Please enter question text for question #${i + 1}`
        );
        return;
      }
      const filledOptions = q.options.filter((opt) => opt.trim().length > 0);
      if (filledOptions.length < 2) {
        toastError(
          language === 'bn'
            ? `প্রশ্ন #${i + 1} এর জন্য কমপক্ষে ২টি বিকল্প অপশন পূরণ করুন`
            : `Question #${i + 1} must have at least 2 non-empty options`
        );
        return;
      }
      if (q.correctAnswerIndex >= q.options.length || !q.options[q.correctAnswerIndex]?.trim()) {
        toastError(
          language === 'bn'
            ? `প্রশ্ন #${i + 1} এর জন্য একটি বৈধ সঠিক উত্তর নির্বাচন করুন`
            : `Question #${i + 1} has an empty or invalid correct answer selected`
        );
        return;
      }
    }

    await onSave({
      courseId,
      title: title.trim(),
      description: description.trim(),
      durationMinutes: Number(durationMinutes) || 15,
      passingScore: Number(passingScore) || 70,
      totalMarks: totalCalculatedPoints,
      questions,
      isPublished
    });
  };

  const selectedCourse = courses.find((c) => c.id === courseId);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      
      {/* Top Header & Breadcrumb Bar (In-page view, NOT modal) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={onCancel}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'পরীক্ষা ও কুইজ তালিকা' : 'Back to Exams'}</span>
              </button>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {initialExam ? (language === 'bn' ? 'পরীক্ষা সম্পাদনা' : 'Edit Exam') : (language === 'bn' ? 'নতুন পরীক্ষা তৈরি' : 'Create Exam')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {initialExam
                    ? (language === 'bn' ? 'পরীক্ষা ও প্রশ্নমালা সম্পাদনা করুন' : 'Edit Exam & Question Paper')
                    : (language === 'bn' ? 'নতুন অনলাইন পরীক্ষা ও প্রশ্নপত্র প্রণয়ন' : 'Create Online Exam & MCQ Builder')}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'bn'
                    ? 'কোর্সের শিক্ষার্থীদের মেধা যাচাই ও মূল্যায়নের জন্য সময়সীমা, পাসিং মার্ক এবং এমসিকিউ প্রশ্ন প্রস্তুত করুন।'
                    : 'Configure exam parameters, duration, pass criteria, and draft high-quality MCQ questions.'}
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'বাতিল করুন' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-900/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? (language === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...')
                  : (language === 'bn' ? 'পরীক্ষা ও প্রশ্নমালা প্রকাশ করুন' : 'Save & Publish Exam')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Exam Configurations & Parameters (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Layers className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'bn' ? 'পরীক্ষার সেটিংস ও প্যারামিটার' : 'Exam Settings & Rules'}
              </h3>
            </div>

            {/* Course Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'bn' ? 'কোর্স নির্বাচন করুন *' : 'Target Course *'}
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                required
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.titleBn || c.title}
                  </option>
                ))}
              </select>
              {selectedCourse && (
                <p className="text-[11px] text-slate-500 mt-1">
                  ক্যাটাগরি: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedCourse.categoryName}</span>
                </p>
              )}
            </div>

            {/* Exam Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'bn' ? 'পরীক্ষার শিরোনাম *' : 'Exam Title *'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: MERN Stack মিডটার্ম প্র্যাকটিক্যাল পরীক্ষা"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Duration & Passing Score Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <Clock className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                  {language === 'bn' ? 'সময়সীমা (মিনিট) *' : 'Duration (min) *'}
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={5}>৫ মিনিট</option>
                  <option value={10}>১০ মিনিট</option>
                  <option value={15}>১৫ মিনিট</option>
                  <option value={20}>২০ মিনিট</option>
                  <option value={30}>৩০ মিনিট</option>
                  <option value={45}>৪৫ মিনিট</option>
                  <option value={60}>৬০ মিনিট (১ ঘণ্টা)</option>
                  <option value={90}>৯০ মিনিট</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <Award className="w-3.5 h-3.5 inline mr-1 text-emerald-500" />
                  {language === 'bn' ? 'পাস মার্ক (%) *' : 'Pass Score (%) *'}
                </label>
                <select
                  value={passingScore}
                  onChange={(e) => setPassingScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={50}>৫০% মার্কস</option>
                  <option value={60}>৬০% মার্কস</option>
                  <option value={70}>৭০% মার্কস (স্ট্যান্ডার্ড)</option>
                  <option value={80}>৮০% মার্কস</option>
                  <option value={90}>৯০% মার্কস</option>
                </select>
              </div>
            </div>

            {/* Quick KPI Overview */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">মোট প্রশ্ন সংখ্যা:</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{questions.length} টি</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">সর্বমোট পরীক্ষার নম্বর:</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{totalCalculatedPoints} নম্বর</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">উত্তীর্ণ হতে প্রয়োজন:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {Math.ceil((totalCalculatedPoints * passingScore) / 100)} নম্বর ({passingScore}%)
                </span>
              </div>
            </div>

            {/* Instructions / Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'bn' ? 'পরীক্ষার বিবরণ বা নির্দেশনা (ঐচ্ছিক)' : 'Instructions (Optional)'}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="পরীক্ষার্থীদের জন্য বিশেষ কোনো নির্দেশনা থাকলে এখানে লিখুন..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-normal outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Status toggle */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {language === 'bn' ? 'পরীক্ষা সরাসরি সক্রিয় রাখুন' : 'Publish Immediately'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {language === 'bn' ? 'শিক্ষার্থীরা এখনই পরীক্ষা দিতে পারবে' : 'Students can start taking exam'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Right Column: MCQ Question Builder (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
            
            {/* Header of MCQ Builder */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {language === 'bn' ? 'প্রশ্নমালা প্রণয়ন (MCQ Question Builder)' : 'MCQ Question Builder'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'bn'
                      ? 'প্রতিটি প্রশ্নের ৪টি অপশন দিন এবং সঠিক উত্তরটির রেডিও বাটনে টিক দিন।'
                      : 'Provide 4 options per question and select the correct option radio button.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300/40 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'bn' ? '+ নতুন প্রশ্ন যোগ করুন' : '+ Add Question'}</span>
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {questions.map((q, qIdx) => (
                <div
                  key={q.id || qIdx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-5 space-y-4 hover:border-emerald-500/40 transition-colors"
                >
                  {/* Question header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        #{qIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {language === 'bn' ? `প্রশ্ন নম্বর ${qIdx + 1}` : `Question #${qIdx + 1}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <label className="text-[11px] font-medium">{language === 'bn' ? 'নম্বর:' : 'Points:'}</label>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={q.points || 10}
                          onChange={(e) => handlePointsChange(qIdx, Number(e.target.value))}
                          className="w-14 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-center text-slate-900 dark:text-white"
                        />
                      </div>

                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition-colors cursor-pointer"
                          title={language === 'bn' ? 'প্রশ্নটি মুছুন' : 'Delete question'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div>
                    <textarea
                      value={q.question}
                      onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                      rows={2}
                      placeholder={
                        language === 'bn'
                          ? `প্রশ্ন #${qIdx + 1} লিখুন (যেমন: React 18-এ সার্ভার সাইড রেন্ডারিং এর জন্য কোনটি ব্যবহৃত হয়?)`
                          : `Enter question #${qIdx + 1}...`
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                      required
                    />
                  </div>

                  {/* Options (A, B, C, D) */}
                  <div className="space-y-2.5">
                    <p className="text-[11px] font-semibold text-slate-500">
                      {language === 'bn'
                        ? 'অপশনসমূহ পূরণ করুন এবং সঠিক উত্তরের বামপাশের রেডিও বাটনে টিক দিন:'
                        : 'Provide options and click the radio button beside the correct answer:'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {['A', 'B', 'C', 'D'].map((letter, optIdx) => {
                        const isCorrect = q.correctAnswerIndex === optIdx;
                        return (
                          <div
                            key={optIdx}
                            className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                              isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-400/40'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <label className="flex items-center gap-2 cursor-pointer shrink-0">
                              <input
                                type="radio"
                                name={`correct-${q.id || qIdx}`}
                                checked={isCorrect}
                                onChange={() => handleCorrectAnswerChange(qIdx, optIdx)}
                                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              />
                              <span
                                className={`w-5 h-5 rounded-md text-[11px] font-black flex items-center justify-center ${
                                  isCorrect
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }`}
                              >
                                {letter}
                              </span>
                            </label>

                            <input
                              type="text"
                              value={q.options[optIdx] || ''}
                              onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                              placeholder={`অপশন ${letter} এর উত্তর`}
                              className="w-full bg-transparent text-xs text-slate-900 dark:text-white font-medium outline-none placeholder:text-slate-400"
                              required={optIdx < 2}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation / Hint (Optional) */}
                  <div>
                    <input
                      type="text"
                      value={q.explanation || ''}
                      onChange={(e) => handleExplanationChange(qIdx, e.target.value)}
                      placeholder={
                        language === 'bn'
                          ? 'সঠিক উত্তরের ব্যাখ্যা বা নোট (ঐচ্ছিক - পরীক্ষার ফলাফলে শিক্ষার্থী দেখতে পারবে)'
                          : 'Explanation/Rationale for the answer (optional)'
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                </div>
              ))}
            </div>

            {/* Bottom Add Question Large Action */}
            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center gap-2 font-bold text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'bn' ? '+ আরও একটি প্রশ্ন যোগ করুন' : '+ Add Another Question'}</span>
            </button>

            {/* Bottom Form Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'ফিরে যান' : 'Back'}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-900/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? (language === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...')
                    : (language === 'bn' ? 'পরীক্ষা ও প্রশ্নমালা প্রকাশ করুন' : 'Save & Publish Exam')}
                </span>
              </button>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
};
