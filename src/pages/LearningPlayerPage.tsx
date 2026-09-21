import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  Award,
  BookOpen,
  FileText,
  MessageSquare,
  HelpCircle,
  Download,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Check,
  Save,
  Send,
  Lock,
  X
} from 'lucide-react';
import { Course, Lesson, Certificate } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { QuizComponent } from '../components/QuizComponent';
import { CertificateModal } from '../components/CertificateModal';

interface LearningPlayerPageProps {
  courseSlug: string;
  onNavigate: (route: string, param?: string) => void;
}

export const LearningPlayerPage: React.FC<LearningPlayerPageProps> = ({
  courseSlug,
  onNavigate
}) => {
  const { user, token } = useAuth();
  const { language, t } = useLanguage();
  const { success: toastSuccess, error: toastError } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'RESOURCES' | 'NOTES' | 'DISCUSS' | 'QUIZ'>('OVERVIEW');
  const [loading, setLoading] = useState(true);

  // Notes state
  const [studentNote, setStudentNote] = useState('');

  // Q&A state
  const [qaQuestions, setQaQuestions] = useState<Array<{ id: string; author: string; text: string; time: string; answer?: string }>>([
    {
      id: 'qa-1',
      author: 'তানভীর হোসাইন',
      text: 'মডিউলের গিটহাব রিপোজিটরির ব্রাঞ্চ স্ট্রাকচার কীভাবে সেটআপ করব?',
      time: '২ দিন আগে',
      answer: 'প্রধান ব্রাঞ্চ থেকে প্রতিটা চ্যাপ্টারের জন্য feature/chapter-XX নামে ব্রাঞ্চ তৈরি করে কাজ করতে পারেন।'
    }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');

  // Certificate state
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [claimingCert, setClaimingCert] = useState(false);

  // Mobile curriculum drawer state
  const [mobileCurriculumOpen, setMobileCurriculumOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  // Fetch course & enrollment progress
  useEffect(() => {
    setLoading(true);
    fetch(`/api/courses/${courseSlug}`)
      .then((res) => res.json())
      .then((data) => {
        const c: Course = data.course;
        setCourse(c);
        if (c.modules && c.modules.length > 0 && c.modules[0].lessons.length > 0) {
          setCurrentLesson(c.modules[0].lessons[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [courseSlug]);

  // Load completed lessons from server
  useEffect(() => {
    if (token && course) {
      fetch('/api/student/enrollments', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          const enrollment = (data.enrollments || []).find((e: any) => e.courseId === course.id);
          if (enrollment) {
            setCompletedLessonIds(enrollment.completedLessons || []);
          }
        })
        .catch(() => {});
    }
  }, [token, course]);

  // Load existing certificate if already earned
  useEffect(() => {
    if (token && course) {
      fetch('/api/student/certificates', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          const cert = (data.certificates || []).find((c: Certificate) => c.courseId === course.id);
          if (cert) setCertificate(cert);
        })
        .catch(() => {});
    }
  }, [token, course]);

  // Load note for current lesson from localStorage
  useEffect(() => {
    if (currentLesson) {
      const savedNote = localStorage.getItem(`note_${course?.id}_${currentLesson.id}`);
      setStudentNote(savedNote || '');
    }
  }, [currentLesson, course]);

  const handleSaveNote = () => {
    if (currentLesson && course) {
      localStorage.setItem(`note_${course.id}_${currentLesson.id}`, studentNote);
      toastSuccess(language === 'bn' ? 'নোট সংরক্ষিত হয়েছে!' : 'Note saved!');
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    const newQ = {
      id: `qa-${Date.now()}`,
      author: user?.name || 'Student',
      text: newQuestionText.trim(),
      time: 'এইমাত্র'
    };
    setQaQuestions((prev) => [newQ, ...prev]);
    setNewQuestionText('');
    toastSuccess(language === 'bn' ? 'প্রশ্ন সাবমিট হয়েছে!' : 'Question posted!');
  };

  // Mark lesson as completed
  const handleToggleComplete = async (lessonId: string) => {
    if (!course || !token) return;

    const isAlready = completedLessonIds.includes(lessonId);
    const newCompleted = isAlready
      ? completedLessonIds.filter((id) => id !== lessonId)
      : [...completedLessonIds, lessonId];

    setCompletedLessonIds(newCompleted);

    try {
      const res = await fetch(`/api/courses/${course.id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ lessonId })
      });
      const data = await res.json();
      if (res.ok) {
        if (!isAlready) {
          toastSuccess('লেসন সম্পন্ন হয়েছে!');
        }
        if (data.isCompleted) {
          // 100% complete celebration!
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        }
      }
    } catch {
      toastError('প্রগ্রেস আপডেট করা যায়নি');
    }
  };

  // Find all lessons flat
  const allLessons = course?.modules?.flatMap((m) => m.lessons) || [];
  const currentIdx = allLessons.findIndex((l) => l.id === currentLesson?.id);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  // Calculate percentage
  const totalLessonsCount = allLessons.length || 1;
  const progressPercent = Math.min(
    100,
    Math.round((completedLessonIds.length / totalLessonsCount) * 100)
  );

  // Claim Certificate Handler
  const handleClaimCertificate = async () => {
    if (!course || !token) return;
    setClaimingCert(true);
    try {
      const res = await fetch('/api/student/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ courseId: course.id })
      });
      const data = await res.json();
      if (res.ok) {
        setCertificate(data.certificate);
        setIsCertModalOpen(true);
        confetti({ particleCount: 120, spread: 90 });
      } else {
        toastError(data.error || 'সার্টিফিকেট ইস্যু করা যায়নি');
      }
    } catch {
      toastError('সার্ভারে যোগাযোগ করা যায়নি');
    } finally {
      setClaimingCert(false);
    }
  };

  if (loading || !course || !currentLesson) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Find active module for current lesson
  const currentModule = course.modules?.find((m) =>
    m.lessons.some((l) => l.id === currentLesson.id)
  );

  const isCurrentCompleted = completedLessonIds.includes(currentLesson.id);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      
      {/* Top Bar Navigation */}
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Back and Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="player-back-dashboard-btn"
            onClick={() => onNavigate('student-dashboard')}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title={t('backToDashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
              {course.title}
            </h1>
            <p className="text-[11px] text-slate-500 truncate">
              {currentLesson.title}
            </p>
          </div>
        </div>

        {/* Progress & Certificate Action */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Desktop Toggle Left Curriculum Sidebar */}
          <button
            id="desktop-curriculum-toggle-btn"
            onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={desktopSidebarOpen ? 'কারিকুলাম মেনু লুকান' : 'কারিকুলাম মেনু দেখুন'}
          >
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{desktopSidebarOpen ? 'কারিকুলাম লুকান' : 'কারিকুলাম দেখুন'}</span>
          </button>

          {/* Progress bar */}
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <span>{t('courseProgress')}:</span>
              <span className="text-emerald-600 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-32 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Mobile Curriculum Trigger Button */}
          <button
            id="mobile-curriculum-toggle-btn"
            onClick={() => setMobileCurriculumOpen(true)}
            className="lg:hidden px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title={t('curriculum')}
          >
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('curriculum')}</span>
          </button>

          {/* Certificate Button */}
          {progressPercent >= 100 || certificate ? (
            <button
              id="claim-certificate-btn"
              disabled={claimingCert}
              onClick={certificate ? () => setIsCertModalOpen(true) : handleClaimCertificate}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all animate-bounce"
            >
              <Award className="w-4 h-4" />
              <span>{claimingCert ? '...' : (language === 'bn' ? 'সার্টিফিকেট' : 'Certificate')}</span>
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <Lock className="w-3.5 h-3.5" />
              <span>সার্টিফিকেট পেতে ১০০% সম্পন্ন করুন</span>
            </div>
          )}

        </div>

      </div>

      {/* Main LMS Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Desktop Curriculum Sidebar (Placed on the Left Sidebar) */}
        {desktopSidebarOpen && (
          <aside className="hidden lg:flex w-80 xl:w-96 shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t('curriculum')}</span>
              </div>
              <span className="text-xs text-slate-400 font-normal">
                {completedLessonIds.length} / {totalLessonsCount} সম্পন্ন
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
              {course.modules?.map((mod, mIdx) => (
                <div key={mod.id} className="py-2">
                  <div className="px-4 py-2 font-bold text-xs text-slate-500 uppercase tracking-wider">
                    মডিউল {mIdx + 1}: {mod.title}
                  </div>

                  <div className="space-y-0.5 px-2">
                    {mod.lessons.map((les) => {
                      const isCompleted = completedLessonIds.includes(les.id);
                      const isActive = les.id === currentLesson.id;
                      return (
                        <button
                          key={les.id}
                          type="button"
                          onClick={() => setCurrentLesson(les)}
                          className={`w-full text-left p-3 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-semibold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : isActive ? (
                              <PlayCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>

                          <span className="text-[11px] text-slate-400 font-mono shrink-0">
                            {les.durationMinutes}m
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Right Side: Video Player & Subtabs */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Video Container */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-black relative border border-slate-800">
            <iframe
              src={currentLesson.videoUrl}
              title={currentLesson.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Lesson Action Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                {currentLesson.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentModule?.title} • {currentLesson.durationMinutes} min
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Prev Lesson */}
              <button
                disabled={!prevLesson}
                onClick={() => prevLesson && setCurrentLesson(prevLesson)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                title={t('previousLesson')}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Mark Complete Checkbox / Button */}
              <button
                id="toggle-lesson-complete-btn"
                onClick={() => handleToggleComplete(currentLesson.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isCurrentCompleted
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{isCurrentCompleted ? t('completedCheck') : t('markAsCompleted')}</span>
              </button>

              {/* Next Lesson */}
              <button
                disabled={!nextLesson}
                onClick={() => nextLesson && setCurrentLesson(nextLesson)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                title={t('nextLesson')}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subtabs Switcher */}
          <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 text-xs font-bold overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`pb-2.5 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'OVERVIEW'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('tabOverview')}</span>
            </button>

            <button
              onClick={() => setActiveTab('RESOURCES')}
              className={`pb-2.5 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'RESOURCES'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{t('tabResources')}</span>
            </button>

            <button
              onClick={() => setActiveTab('NOTES')}
              className={`pb-2.5 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'NOTES'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t('tabNotes')}</span>
            </button>

            <button
              onClick={() => setActiveTab('DISCUSS')}
              className={`pb-2.5 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'DISCUSS'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('tabDiscussion')}</span>
            </button>

            {currentModule?.quiz && (
              <button
                onClick={() => setActiveTab('QUIZ')}
                className={`pb-2.5 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'QUIZ'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400">{t('tabQuiz')}</span>
              </button>
            )}
          </div>

          {/* Subtab Content */}
          <div className="pt-2">
            {activeTab === 'OVERVIEW' && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {currentLesson.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentLesson.content || 'এই লেসনে আমরা উল্লেখিত বিষয়ের থিওরি ও ব্যবহারিক কোডিং বাস্তবায়ন করে দেখব। ভিডিও মনোযোগ দিয়ে দেখুন এবং কোড নিজে প্র্যাকটিস করুন।'}
                </p>
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                  💡 <strong>টিপস:</strong> ভিডিও দেখার সাথে সাথে কোড ফাইলগুলো ডাউনলোড করে আপনার লোকাল এডিটরে রান করে দেখুন। কোনো সমস্যা হলে Q&A ট্যাবে প্রশ্ন করুন।
                </div>
              </div>
            )}

            {activeTab === 'RESOURCES' && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {language === 'bn' ? 'ডাউনলোডযোগ্য রিসোর্সসমূহ' : 'Downloadable Resources'}
                </h3>
                <div className="space-y-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">Starter-Code-Repository.zip</p>
                        <p className="text-[11px] text-slate-400">12.4 MB • Source code & Assets</p>
                      </div>
                    </div>
                    <a
                      href="#download"
                      onClick={(e) => {
                        e.preventDefault();
                        toastSuccess('Starter-Code ডাউনলোড শুরু হয়েছে');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t('downloadFile')}</span>
                    </a>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">Lecture-Slides-PDF.pdf</p>
                        <p className="text-[11px] text-slate-400">4.1 MB • Course Notes</p>
                      </div>
                    </div>
                    <a
                      href="#download"
                      onClick={(e) => {
                        e.preventDefault();
                        toastSuccess('Lecture-Slides ডাউনলোড শুরু হয়েছে');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t('downloadFile')}</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'NOTES' && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {language === 'bn' ? 'ব্যক্তিগত লার্নিং নোট' : 'Personal Lesson Notes'}
                  </h3>
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Note'}</span>
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={studentNote}
                  onChange={(e) => setStudentNote(e.target.value)}
                  placeholder={language === 'bn' ? 'এই লেসন সম্পর্কিত গুরুত্বপূর্ণ পয়েন্ট এখানে লিখে রাখুন...' : 'Take your notes for this lesson here...'}
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            {activeTab === 'DISCUSS' && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {language === 'bn' ? 'প্রশ্ন ও উত্তর ফোরাম' : 'Q&A Forum'}
                </h3>

                <form onSubmit={handleAddQuestion} className="flex gap-2">
                  <input
                    type="text"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder={language === 'bn' ? 'এই লেসন সম্পর্কে প্রশ্ন করুন...' : 'Ask a question about this lesson...'}
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'পাঠান' : 'Post'}</span>
                  </button>
                </form>

                <div className="space-y-3">
                  {qaQuestions.map((q) => (
                    <div key={q.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100">
                        <span>{q.author}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{q.time}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{q.text}</p>
                      {q.answer && (
                        <div className="mt-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-1">
                          <span className="font-bold text-[10px] uppercase text-emerald-700 dark:text-emerald-400">
                            ইন্সট্রাক্টরের উত্তর:
                          </span>
                          <p>{q.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'QUIZ' && currentModule?.quiz && (
              <QuizComponent
                quiz={currentModule.quiz}
                onPass={() => {
                  handleToggleComplete(currentLesson.id);
                }}
              />
            )}
          </div>

        </div>

      </div>

      {/* Mobile Collapsible Curriculum Drawer */}
      {mobileCurriculumOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileCurriculumOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t('curriculum')}</span>
              </div>
              <button
                onClick={() => setMobileCurriculumOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-2.5 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span>{completedLessonIds.length} / {totalLessonsCount} সম্পন্ন</span>
              <span className="text-emerald-600 font-bold">{progressPercent}%</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pb-20">
              {course.modules?.map((mod, mIdx) => (
                <div key={mod.id} className="py-2">
                  <div className="px-4 py-1.5 font-bold text-xs text-slate-500 uppercase tracking-wider">
                    মডিউল {mIdx + 1}: {mod.title}
                  </div>

                  <div className="space-y-0.5 px-2">
                    {mod.lessons.map((les) => {
                      const isCompleted = completedLessonIds.includes(les.id);
                      const isActive = les.id === currentLesson.id;
                      return (
                        <button
                          key={les.id}
                          type="button"
                          onClick={() => {
                            setCurrentLesson(les);
                            setMobileCurriculumOpen(false);
                          }}
                          className={`w-full text-left p-3 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-semibold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : isActive ? (
                              <PlayCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>

                          <span className="text-[11px] text-slate-400 font-mono shrink-0">
                            {les.durationMinutes}m
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        certificate={certificate}
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        onVerifyLookup={(certNum) => onNavigate('verify-cert', certNum)}
      />

    </div>
  );
};
