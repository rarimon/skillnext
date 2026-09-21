import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  BookOpen,
  Clock,
  Award,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Layers,
  FileCheck,
  Check,
  AlertCircle
} from 'lucide-react';
import { Exam, Course, ExamSubmission } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { ExamBuilderPage } from './ExamBuilderPage';

interface TeacherExamsTabProps {
  courses: Course[];
}

export const TeacherExamsTab: React.FC<TeacherExamsTabProps> = ({ courses }) => {
  const { token } = useAuth();
  const { success, error } = useToast();
  const { language } = useLanguage();

  // Mode: 'list' for listing exams & submissions, 'builder' for full-page in-place exam creation/editing (NO MODAL)
  const [viewMode, setViewMode] = useState<'list' | 'builder'>('list');
  const [activeSubTab, setActiveSubTab] = useState<'EXAMS' | 'SUBMISSIONS'>('EXAMS');
  const [exams, setExams] = useState<Exam[]>([]);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  const fetchExamsAndSubmissions = async () => {
    setLoading(true);
    try {
      const [resExams, resSubs] = await Promise.all([
        fetch('/api/exams'),
        fetch('/api/teacher/exam-submissions', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
      ]);

      if (resExams.ok) {
        const data = await resExams.json();
        setExams(data.exams || []);
      }
      if (resSubs.ok) {
        const subData = await resSubs.json();
        setSubmissions(subData.submissions || []);
      }
    } catch (err) {
      console.error('Failed to load exams data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamsAndSubmissions();
  }, [token]);

  // Open in-page Builder for creating a new exam
  const handleOpenCreate = () => {
    setEditingExam(null);
    setViewMode('builder');
  };

  // Open in-page Builder for editing an existing exam
  const handleOpenEdit = (exam: Exam) => {
    setEditingExam(exam);
    setViewMode('builder');
  };

  // Save exam from in-page Builder
  const handleSaveExam = async (examPayload: any) => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      const url = editingExam ? `/api/teacher/exams/${editingExam.id}` : '/api/teacher/exams';
      const method = editingExam ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(examPayload)
      });

      const data = await res.json();
      if (res.ok) {
        success(editingExam ? 'পরীক্ষা সফলভাবে আপডেট হয়েছে' : 'নতুন পরীক্ষা সফলভাবে প্রকাশিত হয়েছে');
        setViewMode('list');
        setEditingExam(null);
        fetchExamsAndSubmissions();
      } else {
        error(data.error || 'সংরক্ষণ ব্যর্থ হয়েছে');
      }
    } catch (err) {
      console.error(err);
      error('সার্ভারে সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Exam
  const handleDeleteExam = async (id: string) => {
    if (!token) return;
    if (!window.confirm('আপনি কি নিশ্চিতভাবে এই পরীক্ষাটি মুছে ফেলতে চান?')) return;

    try {
      const res = await fetch(`/api/teacher/exams/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        success('পরীক্ষাটি সফলভাবে মুছে ফেলা হয়েছে');
        setExams((prev) => prev.filter((e) => e.id !== id));
      } else {
        error('পরীক্ষা মোছা যায়নি');
      }
    } catch (err) {
      console.error(err);
      error('সার্ভারে সমস্যা হয়েছে');
    }
  };

  // If in 'builder' mode, render the full-page in-place Exam Builder (NO MODAL)
  if (viewMode === 'builder') {
    return (
      <ExamBuilderPage
        initialExam={editingExam}
        courses={courses}
        onSave={handleSaveExam}
        onCancel={() => {
          setViewMode('list');
          setEditingExam(null);
        }}
        isSubmitting={isSubmitting}
      />
    );
  }

  // Otherwise render the Exams List and Results view
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <FileCheck className="w-4 h-4" />
            <span>{language === 'bn' ? 'পরীক্ষা ও কুইজ সিস্টেম' : 'Online Exam System'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {language === 'bn' ? 'পরীক্ষা ও প্রশ্নমালা ম্যানেজমেন্ট' : 'Exams & Questions Management'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'bn'
              ? 'কোর্সের জন্য বহুনির্বাচনী প্রশ্ন (MCQ) তৈরি করুন, সময় নির্ধারণ করুন এবং শিক্ষার্থীদের ফলাফল পর্যবেক্ষণ করুন।'
              : 'Create MCQs, set time duration, pass score, and track student assessment results.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-900/20 cursor-pointer shrink-0 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন পরীক্ষা ও প্রশ্নপত্র তৈরি করুন' : 'Create Exam & Questions'}</span>
        </button>
      </div>

      {/* SUB-TABS (EXAMS LIST vs STUDENT SUBMISSIONS) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('EXAMS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'EXAMS'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{language === 'bn' ? 'তৈরিকৃত পরীক্ষা ও প্রশ্নব্যাংক' : 'Created Exams'} ({exams.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('SUBMISSIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'SUBMISSIONS'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{language === 'bn' ? 'শিক্ষার্থীদের ফলাফল শিট' : 'Student Results'} ({submissions.length})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: EXAMS LIST */}
      {activeSubTab === 'EXAMS' && (
        <>
          {loading ? (
            <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-emerald-600" />
              <p className="text-sm font-medium">পরীক্ষাসমূহ লোড হচ্ছে...</p>
            </div>
          ) : exams.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                কোনো পরীক্ষা তৈরি করা হয়নি
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                কোর্সের শিক্ষার্থীদের মূল্যায়ন করতে সহজে প্রশ্ন, অপশন ও পাস মার্ক দিয়ে পরীক্ষা তৈরি করুন।
              </p>
              <button
                type="button"
                onClick={handleOpenCreate}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>প্রথম পরীক্ষা তৈরি করুন</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {exam.courseTitle || 'কোর্স স্পেসিফিক'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(exam)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-lg transition-colors cursor-pointer"
                          title="সম্পাদনা করুন (ইন-পেইজ বিল্ডার)"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExam(exam.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {exam.description || 'শিক্ষার্থীদের মেধা মূল্যায়নের পরীক্ষা'}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800/80 text-center">
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
                      <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                        {exam.passingScore}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>তৈরির তারিখ: {new Date(exam.createdAt).toLocaleDateString('bn-BD')}</span>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(exam)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      প্রশ্নপত্র দেখুন / এডিট
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB CONTENT 2: STUDENT SUBMISSIONS TABLE */}
      {activeSubTab === 'SUBMISSIONS' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              শিক্ষার্থীদের পরীক্ষার ফলাফল ও মূল্যায়ন হিস্টোরি
            </h3>
          </div>

          {submissions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              এখনও কোনো শিক্ষার্থী পরীক্ষা সাবমিট করেনি।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">শিক্ষার্থীর নাম</th>
                    <th className="py-3 px-4">পরীক্ষার শিরোনাম</th>
                    <th className="py-3 px-4">প্রাপ্ত স্কোর</th>
                    <th className="py-3 px-4">সঠিক উত্তর</th>
                    <th className="py-3 px-4">ফলাফল</th>
                    <th className="py-3 px-4 text-right">জমাদানের সময়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          {sub.userName}
                        </span>
                        <span className="text-[10px] text-slate-400">{sub.userEmail}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {sub.examTitle || 'কোর্স পরীক্ষা'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-black ${sub.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {sub.score}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {sub.correctAnswersCount} / {sub.totalQuestions}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.passed
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {sub.passed ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{sub.passed ? 'উত্তীর্ণ (Passed)' : 'অনুত্তীর্ণ (Failed)'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400 text-[11px]">
                        {new Date(sub.submittedAt).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
