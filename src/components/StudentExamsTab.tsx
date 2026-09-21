import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  Play,
  RefreshCw,
  HelpCircle,
  BookOpen,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Exam, ExamSubmission, Course, Enrollment } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { ExamPlayerModal } from './ExamPlayerModal';

interface StudentExamsTabProps {
  enrollments: Enrollment[];
}

export const StudentExamsTab: React.FC<StudentExamsTabProps> = ({ enrollments }) => {
  const { token, user } = useAuth();
  const { success, error } = useToast();
  const { language } = useLanguage();

  const [exams, setExams] = useState<Exam[]>([]);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);

  const fetchExamsData = async () => {
    setLoading(true);
    try {
      const [resExams, resSubs] = await Promise.all([
        fetch('/api/exams'),
        fetch('/api/student/exam-submissions', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
      ]);

      if (resExams.ok) {
        const data = await resExams.json();
        setExams(data.exams || []);
      }
      if (resSubs.ok) {
        const data = await resSubs.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Failed to load exams data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamsData();
  }, [token]);

  // Find submission for a specific exam
  const getSubmissionForExam = (examId: string) => {
    return submissions.find((s) => s.examId === examId);
  };

  const handleStartExam = (exam: Exam) => {
    setActiveExam(exam);
  };

  const handleExamComplete = (submission: ExamSubmission) => {
    success(
      submission.passed
        ? `অভিনন্দন! আপনি ${submission.score}% মার্ক পেয়ে উত্তীর্ণ হয়েছেন!`
        : `আপনার প্রাপ্ত মার্ক ${submission.score}%। পরবর্তী চেষ্টার জন্য প্রস্তুতি নিন!`
    );
    // Refresh submissions
    fetchExamsData();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-2">
              <FileCheck className="w-3.5 h-3.5" />
              <span>অনলাইন পরীক্ষা ও মেধা যাচাই</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              পরীক্ষা, কুইজ ও প্র্যাকটিস টেস্ট
            </h2>
            <p className="text-xs text-indigo-100 mt-1 max-w-xl">
              কোর্সের বিষয়বস্তুর উপর নির্ধারিত সময়ের মধ্যে পরীক্ষা দিয়ে নিজের দক্ষতা মূল্যায়ন করুন এবং সার্টিফিকেট অর্জনে এগিয়ে যান।
            </p>
          </div>

          <button
            type="button"
            onClick={fetchExamsData}
            className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>পরীক্ষা তালিকা রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* Exams Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-indigo-600" />
          <p className="text-sm font-medium">পরীক্ষা ও কুইজসমূহ লোড হচ্ছে...</p>
        </div>
      ) : exams.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            কোনো সক্রিয় পরীক্ষা নেই
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            আপনার শিক্ষক যখন কোর্সের জন্য কোনো কুইজ বা পরীক্ষা প্রকাশ করবেন, তা এখানে দেখতে পাবেন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {exams.map((exam) => {
            const sub = getSubmissionForExam(exam.id);
            return (
              <div
                key={exam.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate max-w-xs">
                      {exam.courseTitle || 'Course Exam'}
                    </span>

                    {sub ? (
                      sub.passed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>উত্তীর্ণ ({sub.score}%)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>অনুত্তীর্ণ ({sub.score}%)</span>
                        </span>
                      )
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        নতুন পরীক্ষা
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                    {exam.title}
                  </h3>

                  {exam.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {exam.description}
                    </p>
                  )}
                </div>

                {/* Exam Meta Info */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">মোট প্রশ্ন</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                      {exam.questions.length} টি
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">সময়সীমা</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                      {exam.durationMinutes || 15} মিনিট
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">পাস মার্ক</div>
                    <div className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 font-mono">
                      {exam.passingScore}%
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => handleStartExam(exam)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                    sub?.passed
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/20'
                  }`}
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>
                    {sub
                      ? sub.passed
                        ? 'পুনরায় অনুশীলন করুন (Retake Practice)'
                        : 'আবার পরীক্ষা দিন (Try Again)'
                      : 'পরীক্ষা শুরু করুন (Start Exam)'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* EXAM PLAYER MODAL */}
      {activeExam && (
        <ExamPlayerModal
          exam={activeExam}
          isOpen={true}
          onClose={() => setActiveExam(null)}
          onComplete={handleExamComplete}
        />
      )}

    </div>
  );
};
