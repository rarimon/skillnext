import React, { useState, useEffect } from 'react';
import {
  Star,
  Clock,
  BookOpen,
  Users,
  CheckCircle,
  PlayCircle,
  Lock,
  Download,
  Share2,
  Award,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Send,
  Sparkles,
  ArrowRight,
  ShoppingCart,
  Check,
  Calendar,
  Globe2,
  FileCode,
  HelpCircle,
  Video,
  ChevronRight,
  Heart
} from 'lucide-react';
import { Course, Review, Lesson } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

interface CourseDetailsPageProps {
  courseSlug: string;
  onNavigate: (route: string, param?: string) => void;
  onEnrollCourse: (course: Course) => void;
}

export const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({
  courseSlug,
  onNavigate,
  onEnrollCourse
}) => {
  const { user, token } = useAuth();
  const { addToCart, isInCart, setIsCartOpen } = useCart();
  const { language, t } = useLanguage();
  const { success: toastSuccess, error: toastError } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Free preview video modal state
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);

  // Accordion open/close state for modules
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  // Review submission state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Active Tab: Overview / Curriculum / Instructor / Reviews
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/courses/${courseSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Course not found');
        return res.json();
      })
      .then((data) => {
        setCourse(data.course);
        setReviews(data.reviews || []);
        // Automatically open the first module
        if (data.course?.modules && data.course.modules.length > 0) {
          const initialMap: Record<string, boolean> = {};
          data.course.modules.forEach((mod: any, idx: number) => {
            if (idx === 0) initialMap[mod.id] = true;
          });
          setOpenModules(initialMap);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [courseSlug]);

  // Check enrollment
  useEffect(() => {
    if (token && course) {
      fetch('/api/student/enrollments', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          const enrolled = (data.enrollments || []).some(
            (e: any) => e.courseId === course.id
          );
          setIsEnrolled(enrolled);
        })
        .catch(() => {});
    }
  }, [token, course]);

  const toggleModule = (modId: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const toggleAllModules = () => {
    if (!course?.modules) return;
    const allOpen = course.modules.every((m) => openModules[m.id]);
    const nextState: Record<string, boolean> = {};
    course.modules.forEach((m) => {
      nextState[m.id] = !allOpen;
    });
    setOpenModules(nextState);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toastSuccess(language === 'bn' ? 'কোর্স লিংক কপি করা হয়েছে!' : 'Course link copied to clipboard!');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toastError(language === 'bn' ? 'রিভিউ দিতে অনুগ্রহ করে প্রথমে লগইন করুন' : 'Please log in to submit a review');
      return;
    }
    if (!userComment.trim() || !course) return;

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: userRating,
          comment: userComment
        })
      });
      const data = await res.json();
      if (res.ok) {
        setReviews((prev) => [data.review, ...prev]);
        setUserComment('');
        toastSuccess(language === 'bn' ? 'আপনার মূল্যবান রিভিউ সফলভাবে যুক্ত হয়েছে!' : 'Review posted successfully!');
      } else {
        toastError(data.error || 'রিভিউ যুক্ত করা যায়নি');
      }
    } catch {
      toastError(language === 'bn' ? 'সার্ভারে যোগাযোগ করা যায়নি' : 'Failed to connect to server');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">{t('loading')}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          {t('noCoursesFound')}
        </h2>
        <p className="text-sm text-slate-500">
          {language === 'bn' ? 'অনুরোধকৃত কোর্সটি খুঁজে পাওয়া যায়নি।' : 'The requested course does not exist.'}
        </p>
        <button
          onClick={() => onNavigate('courses')}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
        >
          {t('browseCoursesBtn')}
        </button>
      </div>
    );
  }

  const inCart = isInCart(course.id);
  const currentPrice = (course.discountPrice !== undefined ? course.discountPrice : course.price) ?? 0;
  const originalPrice = course.price ?? 0;
  const hasDiscount = course.discountPrice !== undefined && course.discountPrice < (course.price ?? 0);
  const savings = hasDiscount ? originalPrice - (course.discountPrice || 0) : 0;
  const discountPercent = hasDiscount && originalPrice > 0
    ? Math.round(((originalPrice - course.discountPrice!) / originalPrice) * 100)
    : 0;

  // Find first free preview lesson if any
  const firstPreviewLesson = course.modules
    ?.flatMap((m) => m.lessons)
    .find((l) => l.isFreePreview);

  return (
    <div className="pb-24">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Clean, High-Contrast, Eye-Catching Header */}
      {/* ========================================================================= */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white pt-8 pb-14 border-b border-slate-800 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col (8 cols): Breadcrumb, Badges, Title, Subtitle, Meta */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Breadcrumb navigation */}
              <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {language === 'bn' ? 'হোম' : 'Home'}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {language === 'bn' ? 'কোর্সসমূহ' : 'Courses'}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-emerald-400 truncate max-w-xs font-semibold">
                  {course.categoryName}
                </span>
              </nav>

              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 tracking-wide uppercase">
                  {course.categoryName}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {course.level}
                </span>
                {course.isFeatured && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{language === 'bn' ? 'সেরা রেটিং' : 'Featured'}</span>
                  </span>
                )}
              </div>

              {/* Main Course Title */}
              <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-white leading-tight sm:leading-tight tracking-tight">
                {language === 'bn' && course.titleBn ? course.titleBn : course.title}
              </h1>

              {/* Subtitle / Description */}
              <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {course.description}
              </p>

              {/* Meta Stats Badges */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs">
                {/* Rating Badge */}
                <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30 text-amber-300 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm">{course.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">
                    ({reviews.length} {language === 'bn' ? 'রিভিউ' : 'reviews'})
                  </span>
                </div>

                {/* Enrolled Students */}
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">{(course.studentsCount ?? 0).toLocaleString()}</span>
                  <span className="text-slate-400">{t('students')}</span>
                </div>

                {/* Total Duration */}
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <span className="font-semibold">{course.durationHours}</span>
                  <span className="text-slate-400">{t('hours')}</span>
                </div>

                {/* Total Lessons */}
                <div className="flex items-center gap-1.5 text-slate-300">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold">{course.lessonsCount}</span>
                  <span className="text-slate-400">{t('lessons')}</span>
                </div>

                {/* Language */}
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Globe2 className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'bn' ? 'বাংলা ও ইংরেজি' : 'Bengali / English'}</span>
                </div>
              </div>

              {/* Instructor Mini Badge & Social Share */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-11 h-11 rounded-xl object-cover border-2 border-emerald-500 shadow-sm"
                  />
                  <div>
                    <span className="text-[11px] text-slate-400 block font-normal">
                      {t('instructorTitle')}
                    </span>
                    <span className="font-bold text-sm text-white hover:text-emerald-400 transition-colors">
                      {course.instructor.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                    title={language === 'bn' ? 'কোর্স শেয়ার করুন' : 'Share course'}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'শেয়ার' : 'Share'}</span>
                  </button>

                  {firstPreviewLesson && (
                    <button
                      onClick={() => setPreviewLesson(firstPreviewLesson)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/40 transition-colors cursor-pointer"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'bn' ? 'ফ্রি ট্রেইলার দেখুন' : 'Watch Free Preview'}</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Right Col (4 cols): Space for Desktop Floating Card, hidden on mobile */}
            <div className="hidden lg:block lg:col-span-4" />

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN BODY GRID: Left Content Panels + Right Sticky Purchase Card */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT CONTENT COLUMN (8 Cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-8 pt-6 lg:pt-8">
            
            {/* Navigation Tabs Header (Overview, Curriculum, Instructor, Reviews) */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 sticky top-16 z-20 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md pt-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {language === 'bn' ? 'সারসংক্ষেপ' : 'Overview'}
              </button>
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'curriculum'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('curriculum')} ({course.modules?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('instructor')}
                className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'instructor'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('instructorTitle')}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('studentReviews')} ({reviews.length})
              </button>
            </div>

            {/* TAB CONTENT 1: OVERVIEW */}
            {(activeTab === 'overview' || activeTab === 'curriculum') && (
              <>
                {/* What you will learn Bento Box */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      {t('whatYouWillLearn')}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {(course.whatYouWillLearn || course.learningOutcomes || []).map((item, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200"
                      >
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Curriculum Accordion */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-emerald-600" />
                        <span>{t('curriculum')}</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        {course.modules?.length || 0} {t('modulesCount')} • {course.lessonsCount} {t('lessons')} • {course.durationHours} {t('hours')} সর্বমোট
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={toggleAllModules}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      {course.modules?.every((m) => openModules[m.id])
                        ? (language === 'bn' ? 'সব মডিউল গুটিয়ে নিন' : 'Collapse All')
                        : (language === 'bn' ? 'সব মডিউল প্রসারিত করুন' : 'Expand All')}
                    </button>
                  </div>

                  {/* Accordion Container */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800 shadow-sm">
                    {course.modules?.map((mod, modIndex) => {
                      const isOpen = !!openModules[mod.id];
                      const totalMins = mod.lessons.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);

                      return (
                        <div key={mod.id} className="transition-colors">
                          <button
                            type="button"
                            onClick={() => toggleModule(mod.id)}
                            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3.5">
                              <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800/40">
                                {modIndex + 1}
                              </span>
                              <div>
                                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                  {mod.title}
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {mod.lessons.length} {t('lessons')} • {totalMins} মিনিট
                                </p>
                              </div>
                            </div>

                            <div className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </button>

                          {/* Lessons inside module */}
                          {isOpen && (
                            <div className="bg-slate-50/70 dark:bg-slate-950/50 divide-y divide-slate-100 dark:divide-slate-800/80 px-4 sm:px-6 py-2">
                              {mod.lessons.map((lesson, lIndex) => (
                                <div
                                  key={lesson.id}
                                  className="py-3 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                                >
                                  <div className="flex items-center gap-3 min-w-0 pr-3">
                                    {lesson.isFreePreview || isEnrolled ? (
                                      <PlayCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                    ) : (
                                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                                    )}
                                    <span className="truncate font-medium">
                                      {modIndex + 1}.{lIndex + 1} {lesson.title}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-slate-400 font-mono text-[11px]">
                                      {lesson.durationMinutes} min
                                    </span>
                                    {lesson.isFreePreview && (
                                      <button
                                        onClick={() => setPreviewLesson(lesson)}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
                                      >
                                        {t('freePreview')}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Requirements / Prerequisites */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    {t('requirements')}
                  </h2>
                  <ul className="space-y-2 list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 pl-1">
                    {course.requirements.map((req, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* TAB CONTENT 2: INSTRUCTOR */}
            {(activeTab === 'overview' || activeTab === 'instructor') && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {t('instructorTitle')}
                </h2>
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm shrink-0"
                  />
                  <div className="space-y-2 flex-1">
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                        {course.instructor.name}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {course.instructor.headline || 'Senior Software Engineer & Industry Mentor'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">4.9</span> রেটিং
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">12,500+</span> শিক্ষার্থী
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-teal-500" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">6</span> টি কোর্স
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                      {course.instructor.bio ||
                        'অভিজ্ঞ সফটওয়্যার ইঞ্জিনিয়ার এবং এডটেক ট্রেইনার। বিগত ৬ বছর ধরে দেশ ও বিদেশের শীর্ষ কোম্পানিতে কাজ করার অভিজ্ঞতার সাথে হাজারো তরুণকে ফ্রন্টএন্ড, ব্যাকএন্ড ও ফুলস্ট্যাক ডেভেলপমেন্টে সফল ক্যারিয়ার গড়তে পথপ্রদর্শন করে আসছেন।'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: REVIEWS */}
            {(activeTab === 'overview' || activeTab === 'reviews') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span>{t('studentReviews')} ({reviews.length})</span>
                  </h2>
                  <div className="flex items-center gap-1.5 text-amber-500 font-black text-lg">
                    <span>{course.rating.toFixed(1)}</span>
                    <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                  </div>
                </div>

                {/* Submit Review Form */}
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {language === 'bn' ? 'আপনার রেটিং দিন:' : 'Rate this course:'}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= userRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder={
                      language === 'bn'
                        ? 'কোর্সটি সম্পর্কে আপনার অভিজ্ঞতা ও মতামত লিখুন...'
                        : 'Share your feedback on this course...'
                    }
                    className="w-full p-3 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingReview || !userComment.trim()}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {submittingReview
                          ? '...'
                          : (language === 'bn' ? 'রিভিউ জমা দিন' : 'Submit Review')}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-slate-400 p-4 text-center">
                      {language === 'bn' ? 'এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনি দিন!' : 'No reviews yet. Be the first to leave one!'}
                    </p>
                  ) : (
                    reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={rev.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60'}
                              alt={rev.user?.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <span className="font-bold text-xs text-slate-900 dark:text-white block">
                                {rev.user?.name || 'Student'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(rev.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-200 dark:text-slate-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>

          {/* ========================================================================= */}
          {/* RIGHT FLOATING PURCHASE CARD (4 Cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 lg:-mt-64 relative z-30">
            <div className="sticky top-24 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-5 sm:p-6 space-y-5">
              
              {/* Thumbnail Video Preview Trigger */}
              <div
                onClick={() => firstPreviewLesson && setPreviewLesson(firstPreviewLesson)}
                className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 group cursor-pointer border border-slate-200 dark:border-slate-800"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-8 h-8" />
                  </div>
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 text-center text-[11px] font-bold text-white bg-black/70 backdrop-blur-xs py-1 rounded-xl">
                  {language === 'bn' ? '▶ ফ্রি ট্রেইলার ও ডেমো প্রিভিউ দেখুন' : '▶ Watch Free Course Trailer'}
                </div>
              </div>

              {/* Price & Savings Badge */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    ৳{(currentPrice ?? 0).toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-sm text-slate-400 line-through">
                        ৳{(originalPrice ?? 0).toLocaleString()}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white">
                        {discountPercent}% {t('off')}
                      </span>
                    </>
                  )}
                </div>

                {hasDiscount && (
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {language === 'bn'
                        ? `এই কোর্সে আপনার ৳${(savings ?? 0).toLocaleString()} সাশ্রয় হচ্ছে!`
                        : `You save ৳${(savings ?? 0).toLocaleString()} on this order!`}
                    </span>
                  </p>
                )}
              </div>

              {/* Primary Call-to-Actions */}
              <div className="space-y-2.5 pt-1">
                {isEnrolled ? (
                  <button
                    id="enrolled-go-to-course-btn"
                    onClick={() => onNavigate('learn', course.slug)}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>{t('goToCourse')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button
                      id="course-buy-now-btn"
                      onClick={() => onEnrollCourse(course)}
                      className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{t('buyNow')} (বিকাশ / নগদ)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      id="course-add-to-cart-btn"
                      onClick={() => {
                        if (inCart) {
                          onNavigate('cart');
                        } else {
                          addToCart(course);
                        }
                      }}
                      className={`w-full py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        inCart
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{inCart ? (language === 'bn' ? 'কার্টে যুক্ত আছে (কার্ট দেখুন)' : 'In Cart (View Cart)') : t('addToCart')}</span>
                    </button>
                  </>
                )}
              </div>

              {/* Guarantees Checklist */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="font-bold text-slate-900 dark:text-white pb-1">
                  {language === 'bn' ? 'এই কোর্সে অন্তর্ভুক্ত রয়েছে:' : 'This course includes:'}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{course.durationHours} {t('hours')} অন-ডিমান্ড ভিডিও লেকচার</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('lifetimeAccess')} (মোবাইল ও পিসি)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('certificateIncluded')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('downloadableResources')} ও সোর্স কোড</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>বিকাশ, নগদ ও কার্ডে ১০০% নিরাপদ পেমেন্ট</span>
                </div>
              </div>

              {/* 7 Days Money Back Guarantee Banner */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center text-xs text-emerald-800 dark:text-emerald-300">
                <span className="font-bold">🛡️ ৭ দিনের ১০০% মানিব্যাক গ্যারান্টি</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FREE PREVIEW VIDEO MODAL */}
      {/* ========================================================================= */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm truncate">{previewLesson.title}</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">
                  {t('freePreview')}
                </span>
              </div>
              <button
                onClick={() => setPreviewLesson(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={previewLesson.videoUrl}
                title={previewLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 bg-slate-950 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                পুরো কোর্সের সকল প্রিমিয়াম লেকচার পেতে এনরোল করুন।
              </span>
              <button
                onClick={() => {
                  setPreviewLesson(null);
                  onEnrollCourse(course);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
              >
                {t('buyNow')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
