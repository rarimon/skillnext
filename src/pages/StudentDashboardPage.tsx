import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Award,
  Receipt,
  User as UserIcon,
  PlayCircle,
  Clock,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Filter,
  Search,
  RotateCcw,
  X,
  Layers,
  Tag,
  LogOut,
  Sparkles,
  FileText,
  Video,
  FileCheck,
  Megaphone,
  Bell
} from 'lucide-react';
import { Course, Order, Certificate, Enrollment, Notice } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { CertificateModal } from '../components/CertificateModal';
import { OfficialInvoice } from '../components/OfficialInvoice';
import { StudentLiveClassesTab } from '../components/StudentLiveClassesTab';
import { StudentExamsTab } from '../components/StudentExamsTab';
import { StudentNoticesTab } from '../components/StudentNoticesTab';

interface StudentDashboardPageProps {
  initialTab?: string;
  onNavigate: (route: string, param?: string) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  initialTab = 'courses',
  onNavigate
}) => {
  const { user, token, updateProfile, demoLogin, logout } = useAuth();
  const { language, t } = useLanguage();
  const { success: toastSuccess, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<
    'courses' | 'live_classes' | 'exams' | 'notices' | 'certificates' | 'orders' | 'profile'
  >((initialTab as any) || 'courses');

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [unreadNoticesCount, setUnreadNoticesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Certificate Modal State
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any | null>(null);

  // Filter States for My Courses
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Profile Form States
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileHeadline, setProfileHeadline] = useState(user?.headline || '');
  const [profileBio, setProfileBio] = useState(user?.bio || '');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone || '');
      setProfileHeadline(user.headline || '');
      setProfileBio(user.bio || '');
    }
  }, [user]);

  const computeUnreadNotices = (noticeList: Notice[], userId?: string) => {
    try {
      const stored = localStorage.getItem(`read_notices_${userId || 'guest'}`);
      const readIds: string[] = stored ? JSON.parse(stored) : [];
      return noticeList.filter((n) => !readIds.includes(n.id)).length;
    } catch {
      return 0;
    }
  };

  const fetchNoticesData = () => {
    fetch('/api/notices', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then((r) => r.json())
      .then((data) => {
        const list: Notice[] = data.notices || [];
        setNotices(list);
        setUnreadNoticesCount(computeUnreadNotices(list, user?.id));
      })
      .catch((err) => console.error('Failed to load notices count:', err));
  };

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    Promise.all([
      fetch('/api/student/enrollments', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/student/orders', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/student/certificates', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/courses').then((r) => r.json()),
      fetch('/api/notices', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json())
    ])
      .then(([enrollmentData, orderData, certData, courseData, noticeData]) => {
        setEnrollments(Array.isArray(enrollmentData) ? enrollmentData : (enrollmentData?.enrollments || []));
        setOrders(Array.isArray(orderData) ? orderData : (orderData?.orders || []));
        setCertificates(Array.isArray(certData) ? certData : (certData?.certificates || []));
        setCourses(Array.isArray(courseData) ? courseData : (courseData?.courses || []));
        const list: Notice[] = noticeData?.notices || [];
        setNotices(list);
        setUnreadNoticesCount(computeUnreadNotices(list, user?.id));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token, user?.id]);

  // Listen to external/custom events when a notice is created/updated or read
  useEffect(() => {
    const handleUpdate = () => {
      fetchNoticesData();
    };
    const handleRead = () => {
      setUnreadNoticesCount(computeUnreadNotices(notices, user?.id));
    };

    window.addEventListener('notices_updated', handleUpdate);
    window.addEventListener('notice_read', handleRead);
    return () => {
      window.removeEventListener('notices_updated', handleUpdate);
      window.removeEventListener('notice_read', handleRead);
    };
  }, [notices, user?.id, token]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const success = await updateProfile({
      name: profileName,
      phone: profilePhone,
      headline: profileHeadline,
      bio: profileBio
    });
    setSavingProfile(false);
    if (success) {
      toastSuccess(
        language === 'bn' ? 'প্রোফাইল সফলভাবে আপডেট হয়েছে' : 'Profile updated successfully'
      );
    } else {
      toastError(
        language === 'bn' ? 'প্রোফাইল আপডেট ব্যর্থ হয়েছে' : 'Failed to update profile'
      );
    }
  };

  // Map enrolled courses
  const enrolledCoursesList = useMemo(() => {
    return enrollments
      .map((enr) => {
        const course = courses.find((c) => c.id === enr.courseId);
        return {
          enrollment: enr,
          course
        };
      })
      .filter((item): item is { enrollment: Enrollment; course: Course } => item.course !== undefined);
  }, [enrollments, courses]);

  // Unique categories in student's enrolled courses
  const enrolledCategories = useMemo(() => {
    const map = new Map<string, number>();
    enrolledCoursesList.forEach(({ course }) => {
      const cat = course.categoryName;
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [enrolledCoursesList]);

  // Filtered enrolled courses
  const filteredEnrolledCourses = useMemo(() => {
    return enrolledCoursesList.filter(({ enrollment, course }) => {
      // Search
      if (courseSearch.trim()) {
        const q = courseSearch.toLowerCase();
        const matchTitle = course.title.toLowerCase().includes(q) || (course.titleBn && course.titleBn.toLowerCase().includes(q));
        const matchInstructor = course.instructor.name.toLowerCase().includes(q);
        const matchCat = course.categoryName.toLowerCase().includes(q);
        if (!matchTitle && !matchInstructor && !matchCat) return false;
      }

      // Category
      if (selectedCategory !== 'ALL') {
        if (course.categoryName.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Status
      const isComplete = enrollment.progressPercentage >= 100;
      if (selectedStatus === 'COMPLETED' && !isComplete) return false;
      if (selectedStatus === 'IN_PROGRESS' && isComplete) return false;

      return true;
    });
  }, [enrolledCoursesList, courseSearch, selectedCategory, selectedStatus]);

  // Completed courses count
  const completedCoursesCount = enrollments.filter((e) => e.progressPercentage >= 100).length;
  const inProgressCoursesCount = enrollments.length - completedCoursesCount;

  // Active course (most recently accessed or first enrolled)
  const activeCourseItem = enrolledCoursesList[0];

  const activeFiltersCount = [
    courseSearch ? 1 : 0,
    selectedCategory !== 'ALL' ? 1 : 0,
    selectedStatus !== 'ALL' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const handleResetCourseFilters = () => {
    setCourseSearch('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
  };

  if (!user && !loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <UserIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {language === 'bn' ? 'স্টুডেন্ট ড্যাশবোর্ডে প্রবেশ করুন' : 'Access Your Student Dashboard'}
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {language === 'bn'
              ? 'আপনার কোর্সের প্রগ্রেস, সার্টিফিকেট এবং অর্ডার দেখতে অনুগ্রহ করে লগইন করুন।'
              : 'Please log in to track your enrolled courses, certificates, and order receipts.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('login')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            {t('navLogin')}
          </button>
          <button
            onClick={() => demoLogin('student')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            {language === 'bn' ? '⚡ ডেমো স্টুডেন্ট হিসেবে প্রবেশ' : '⚡ Quick Demo Student Login'}
          </button>
        </div>
      </div>
    );
  }

  // Render left sidebar navigation & category/filter controls
  const renderLeftSidebar = () => (
    <div className="space-y-6">
      
      {/* 1. Student Profile Card */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
          alt={user?.name}
          className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-xs"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
            {user?.name}
          </h3>
          <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            {language === 'bn' ? 'শিক্ষার্থী' : 'Student'}
          </span>
        </div>
      </div>

      {/* 2. Main Navigation Tabs in Sidebar */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
          {language === 'bn' ? 'ড্যাশবোর্ড মেনু' : 'Dashboard Menu'}
        </label>

        {/* Tab 1: My Courses */}
        <button
          onClick={() => {
            setActiveTab('courses');
            setMobileSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'courses'
              ? 'bg-emerald-600 text-white shadow-sm font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>{t('tabMyCourses')}</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'courses' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {enrollments.length}
          </span>
        </button>

        {/* Tab 2: Live Classes with Realtime Countdown */}
        <button
          onClick={() => {
            setActiveTab('live_classes');
            setMobileSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'live_classes'
              ? 'bg-emerald-600 text-white shadow-sm font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Video className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>লাইভ ক্লাস ও জুম</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400">
            Live
          </span>
        </button>

        {/* Tab 3: Online Exams & Practice Quizzes */}
        <button
          onClick={() => {
            setActiveTab('exams');
            setMobileSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'exams'
              ? 'bg-emerald-600 text-white shadow-sm font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-4 h-4 shrink-0 text-indigo-500" />
            <span>পরীক্ষা ও কুইজ</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            MCQ
          </span>
        </button>

        {/* Tab 4: Official Notice Board */}
        <button
          onClick={() => {
            setActiveTab('notices');
            setMobileSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
            activeTab === 'notices'
              ? 'bg-emerald-600 text-white shadow-sm font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Megaphone className={`w-4 h-4 shrink-0 ${unreadNoticesCount > 0 ? 'text-rose-500 animate-bounce' : 'text-amber-500'}`} />
            <span>নোটিশ বোর্ড</span>
          </div>
          {unreadNoticesCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs animate-notice-blink flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>{unreadNoticesCount} নতুন</span>
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
              Notice
            </span>
          )}
        </button>

        {/* Tab 4: Certificates */}
        <button
          onClick={() => {
            setActiveTab('certificates');
            setMobileSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'certificates'
              ? 'bg-emerald-600 text-white shadow-sm font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 shrink-0" />
            <span>{t('tabCertificates')}</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'certificates' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {certificates.length}
          </span>
        </button>

        {/* Tab 5: Orders */}
        <button
          onClick={() => {
            setActiveTab('orders');
            setMobileSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-sm font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Receipt className="w-4 h-4 shrink-0" />
            <span>{t('tabOrders')}</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {orders.length}
          </span>
        </button>

        {/* Tab 6: Profile Settings */}
        <button
          onClick={() => {
            setActiveTab('profile');
            setMobileSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-emerald-600 text-white shadow-sm font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <UserIcon className="w-4 h-4 shrink-0" />
            <span>{t('tabProfile')}</span>
          </div>
        </button>
      </div>

      {/* 3. My Courses Filter Section (Active when "My Courses" tab is selected) */}
      {activeTab === 'courses' && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-5">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'bn' ? 'কোর্স ফিল্টার' : 'Course Filters'}</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetCourseFilters}
                className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
              </button>
            )}
          </div>

          {/* Search inside enrolled courses */}
          <div className="space-y-1.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder={language === 'bn' ? 'আমার কোর্সে খুঁজুন...' : 'Search my courses...'}
                className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all"
              />
              {courseSearch && (
                <button
                  onClick={() => setCourseSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Course Status Filter (All, In Progress, Completed) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
              {language === 'bn' ? 'কোর্স স্ট্যাটাস' : 'Status'}
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'ALL', label: language === 'bn' ? 'সকল' : 'All', count: enrolledCoursesList.length },
                { id: 'IN_PROGRESS', label: language === 'bn' ? 'চলমান' : 'Active', count: inProgressCoursesCount },
                { id: 'COMPLETED', label: language === 'bn' ? 'সম্পন্ন' : 'Done', count: completedCoursesCount }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStatus(s.id as any)}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold text-center transition-all cursor-pointer ${
                    selectedStatus === s.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {s.label} ({s.count})
                </button>
              ))}
            </div>
          </div>

          {/* Categories List in Enrolled Courses */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                {language === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Categories'}
              </label>
              <span className="text-[10px] text-slate-400">
                {enrolledCategories.length > 0 ? enrolledCategories.length + 1 : 1}
              </span>
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</span>
                <span className="text-[10px] font-mono text-slate-400">{enrolledCoursesList.length}</span>
              </button>

              {enrolledCategories.map((cat) => {
                const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{cat.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* 4. Bottom Quick Links */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button
          onClick={() => onNavigate('courses')}
          className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>{t('browseCoursesBtn')}</span>
        </button>

        <button
          onClick={() => logout()}
          className="w-full py-2.5 px-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('navLogout')}</span>
        </button>
      </div>

    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <span>{t('welcomeBack')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.name || 'Student'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {language === 'bn'
              ? 'আপনার কোর্সের প্রগ্রেস ট্র্যাক করুন, নতুন লেসন দেখুন এবং ডিজিটাল সার্টিফিকেট অর্জন করুন।'
              : 'Track your ongoing courses, complete quizzes, and claim verified digital certificates.'}
          </p>
        </div>

        {activeCourseItem?.course && (
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-2 max-w-xs w-full">
            <span className="text-[10px] font-bold uppercase text-emerald-300">
              {t('continueLearning')}
            </span>
            <p className="font-bold text-sm text-white line-clamp-1">
              {activeCourseItem.course.title}
            </p>
            <div className="flex items-center justify-between text-slate-300 text-[11px]">
              <span>প্রগ্রেস: {activeCourseItem.enrollment.progressPercentage}%</span>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full"
                style={{ width: `${activeCourseItem.enrollment.progressPercentage}%` }}
              />
            </div>
            <button
              onClick={() => onNavigate('learn', activeCourseItem.course!.slug)}
              className="w-full mt-2 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t('continueCourse')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {enrollments.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">{t('enrolledCourses')}</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-600">
            {completedCoursesCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">{t('completedCourses')}</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-500">
            {certificates.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">{t('certificatesEarned')}</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
            {enrollments.reduce((sum, e) => sum + (e.completedLessons?.length || 0) * 0.5, 0).toFixed(0)}h
          </div>
          <div className="text-xs text-slate-500 mt-1">{t('totalHoursLearned')}</div>
        </div>
      </div>

      {/* Mobile Menu & Filter Toggle Bar (< lg screens) */}
      <div className="lg:hidden flex items-center justify-between gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
        >
          <Filter className="w-4 h-4" />
          <span>
            {activeTab === 'courses' ? 'ক্যাটাগরি ও কোর্স ফিল্টার' : 'ড্যাশবোর্ড মেনু'}
          </span>
          {activeFiltersCount > 0 && activeTab === 'courses' && (
            <span className="w-5 h-5 rounded-full bg-white text-emerald-700 font-bold text-[10px] flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Quick Tab Picker on Mobile */}
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as any)}
          className={`px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-200 ${
            unreadNoticesCount > 0 ? 'border-rose-500 font-bold' : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <option value="courses">আমার কোর্স ({enrollments.length})</option>
          <option value="live_classes">লাইভ ক্লাস ও জুম</option>
          <option value="exams">পরীক্ষা ও কুইজ</option>
          <option value="notices">
            {unreadNoticesCount > 0 ? `🔔 নোটিশ বোর্ড (${unreadNoticesCount} নতুন)` : 'নোটিশ বোর্ড'}
          </option>
          <option value="certificates">সার্টিফিকেট ({certificates.length})</option>
          <option value="orders">অর্ডার ({orders.length})</option>
          <option value="profile">প্রোফাইল সেটিংস</option>
        </select>
      </div>

      {/* New Notice Notification Alert Banner (Blinks / Prompts student to read) */}
      {unreadNoticesCount > 0 && activeTab !== 'notices' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/15 via-amber-500/15 to-emerald-500/10 border-2 border-rose-500/40 dark:border-rose-500/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs animate-bounce">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white animate-notice-blink">
                  NEW NOTICE
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {unreadNoticesCount === 1
                    ? 'আপনার জন্য ১টি নতুন নোটিশ এসেছে!'
                    : `আপনার জন্য ${unreadNoticesCount}টি নতুন নোটিশ এসেছে!`}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                অ্যাডমিন বা ইন্সট্রাক্টর গুরুত্বপূর্ণ নোটিশ প্রকাশ করেছেন। এখনই নোটিশ বোর্ডে বিস্তারিত দেখুন।
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('notices')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <span>নোটিশ দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Two-Column Layout (Left Sidebar + Right Main Content) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ======================================================== */}
        {/* LEFT SIDEBAR: Student Profile & Navigation & Filters     */}
        {/* ======================================================== */}
        <aside
          id="student-dashboard-left-sidebar"
          className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-all"
        >
          {renderLeftSidebar()}
        </aside>

        {/* ======================================================== */}
        {/* RIGHT MAIN CONTENT: Active Tab View                      */}
        {/* ======================================================== */}
        <main className="flex-1 min-w-0 w-full space-y-6">
          
          {/* TAB 1: MY COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-5">
              
              {/* Top Status & Summary Bar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {language === 'bn'
                      ? `আমার কোর্সসমূহ (${filteredEnrolledCourses.length}/${enrollments.length})`
                      : `My Courses (${filteredEnrolledCourses.length}/${enrollments.length})`}
                  </span>
                  {selectedCategory !== 'ALL' && (
                    <span className="text-xs text-emerald-600 font-semibold">• {selectedCategory}</span>
                  )}
                </div>

                {/* Active Filter Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {courseSearch && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                      <Search className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[100px]">"{courseSearch}"</span>
                      <button onClick={() => setCourseSearch('')} className="hover:text-rose-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedCategory !== 'ALL' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
                      <span>{selectedCategory}</span>
                      <button onClick={() => setSelectedCategory('ALL')} className="hover:text-rose-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedStatus !== 'ALL' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-medium">
                      <span>{selectedStatus === 'COMPLETED' ? 'সম্পন্ন কোর্স' : 'চলমান কোর্স'}</span>
                      <button onClick={() => setSelectedStatus('ALL')} className="hover:text-rose-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {activeFiltersCount > 0 && (
                    <button
                      onClick={handleResetCourseFilters}
                      className="text-xs text-rose-600 hover:underline font-semibold ml-1 cursor-pointer"
                    >
                      {language === 'bn' ? 'ফিল্টার সাফ করুন' : 'Clear all'}
                    </button>
                  )}
                </div>
              </div>

              {/* Courses List Grid */}
              {enrolledCoursesList.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                  <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
                      {language === 'bn' ? 'আপনি এখনো কোনো কোর্সে ভর্তি হননি' : 'No Enrolled Courses'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {language === 'bn'
                        ? 'আমাদের প্রিমিয়াম কোর্সসমূহ ব্রাউজ করে আপনার পছন্দের কোর্সে আজই ভর্তি হোন।'
                        : 'Explore our catalog and enroll in your first course today.'}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('courses')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    {t('browseCoursesBtn')}
                  </button>
                </div>
              ) : filteredEnrolledCourses.length === 0 ? (
                <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {language === 'bn'
                      ? 'ফিল্টারের সাথে মিলে এমন কোনো কোর্স পাওয়া যায়নি।'
                      : 'No enrolled courses match your filter criteria.'}
                  </p>
                  <button
                    onClick={handleResetCourseFilters}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                  {filteredEnrolledCourses.map(({ enrollment, course }) => {
                    const isComplete = enrollment.progressPercentage >= 100;
                    return (
                      <div
                        key={enrollment.id}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500/50 hover:shadow-md transition-all"
                      >
                        <div className="space-y-3">
                          <div
                            onClick={() => onNavigate('course-details', course.slug)}
                            className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer relative group"
                          >
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {isComplete && (
                              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                <CheckCircle className="w-3 h-3" />
                                <span>{language === 'bn' ? 'সম্পন্ন' : 'Completed'}</span>
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                                {course.categoryName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {course.totalDurationHours} ঘন্টা
                              </span>
                            </div>
                            <h3
                              onClick={() => onNavigate('course-details', course.slug)}
                              className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 mt-0.5 hover:text-emerald-600 cursor-pointer transition-colors"
                            >
                              {course.title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">{course.instructor.name}</p>
                          </div>

                          {/* Progress bar */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between text-xs text-slate-500 font-medium">
                              <span>{language === 'bn' ? 'শেখার প্রগ্রেস' : 'Progress'}</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {enrollment.progressPercentage}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isComplete ? 'bg-emerald-600' : 'bg-teal-600'
                                }`}
                                style={{ width: `${enrollment.progressPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2 flex gap-2">
                          <button
                            onClick={() => onNavigate('learn', course.slug)}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>{isComplete ? 'পুনরায় লেকচার দেখুন' : t('continueCourse')}</span>
                          </button>
                          <button
                            onClick={() => onNavigate('course-details', course.slug)}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Course Details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE CLASSES WITH REALTIME COUNTDOWN & GATED ZOOM */}
          {activeTab === 'live_classes' && (
            <StudentLiveClassesTab enrollments={enrollments} />
          )}

          {/* TAB 3: EXAMS & QUIZZES WITH INTERACTIVE PLAYER */}
          {activeTab === 'exams' && (
            <StudentExamsTab enrollments={enrollments} />
          )}

          {/* TAB 4: OFFICIAL NOTICE BOARD */}
          {activeTab === 'notices' && (
            <StudentNoticesTab
              enrollments={enrollments}
              onNoticesRead={() => {
                setUnreadNoticesCount(computeUnreadNotices(notices, user?.id));
              }}
            />
          )}

          {/* TAB 4: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {language === 'bn'
                      ? `অর্জিত ডিজিটাল সার্টিফিকেট (${certificates.length})`
                      : `Earned Certificates (${certificates.length})`}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('verify-cert')}
                  className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer"
                >
                  {language === 'bn' ? 'সার্টিফিকেট যাচাই করুন' : 'Verify Certificate'}
                </button>
              </div>

              {certificates.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                  <Award className="w-12 h-12 text-amber-500 mx-auto" />
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
                      {language === 'bn' ? 'কোনো সার্টিফিকেট অর্জন করা হয়নি' : 'No Certificates Yet'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {language === 'bn'
                        ? 'কোর্সের সকল লেসন ১০০% শেষ করুন এবং ভেরিফায়েড ডিজিটাল সার্টিফিকেট অর্জন করুন।'
                        : 'Complete 100% of your course curriculum and quizzes to unlock verified certificates.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                          <Award className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700">
                          {cert.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">
                          {cert.courseTitle}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                          ID: {cert.certificateNumber}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          ইস্যু তারিখ: {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => setSelectedCert(cert)}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          {language === 'bn' ? 'সার্টিফিকেট দেখুন' : 'View Certificate'}
                        </button>
                        <button
                          onClick={() => onNavigate('verify-cert', cert.certificateNumber)}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                          title="Verify Certificate URL"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 shadow-none overflow-hidden">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                <span>{t('tabOrders')} ({orders.length})</span>
                <span className="text-xs text-slate-500 font-normal">সর্বমোট পরিশোধিত রসিদসমূহ</span>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  কোনো অর্ডার হিস্ট্রি পাওয়া যায়নি।
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 uppercase font-semibold text-[11px]">
                      <tr>
                        <th className="px-6 py-3.5">অর্ডার নম্বর</th>
                        <th className="px-6 py-3.5">তারিখ</th>
                        <th className="px-6 py-3.5">কোর্স</th>
                        <th className="px-6 py-3.5">পেমেন্ট গেটওয়ে</th>
                        <th className="px-6 py-3.5">পরিশোধিত অর্থ</th>
                        <th className="px-6 py-3.5">স্ট্যাটাস</th>
                        <th className="px-6 py-3.5 text-right">ইনভয়েস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                            {ord.orderNumber}
                          </td>
                          <td className="px-6 py-4">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 max-w-xs truncate">
                            {ord.items.map((i) => i.courseTitle).join(', ')}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {ord.paymentMethod}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-emerald-600">
                            ৳{(ord.total ?? 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                ord.status === 'PAID'
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700'
                                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedInvoiceOrder(ord)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="ইনভয়েস দেখুন, প্রিন্ট বা ডাউনলোড করুন"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>ইনভয়েস</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                  alt={user?.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{user?.name}</h3>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 mt-1 inline-block">
                    {user?.role}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">নাম (Full Name)</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">মোবাইল নম্বর (Phone)</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">হেডলাইন (Headline)</label>
                  <input
                    type="text"
                    value={profileHeadline}
                    onChange={(e) => setProfileHeadline(e.target.value)}
                    placeholder="e.g. Aspiring Frontend Engineer | Dhaka"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">বায়ো (Bio)</label>
                  <textarea
                    rows={3}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
                  >
                    {savingProfile ? 'সংরক্ষণ হচ্ছে...' : 'প্রোফাইল আপডেট করুন'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* Mobile Drawer (< lg screens) for Left Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {language === 'bn' ? 'ড্যাশবোর্ড ও ফিল্টার' : 'Dashboard & Filters'}
              </span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {renderLeftSidebar()}
            </div>
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      <CertificateModal
        certificate={selectedCert}
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        onVerifyLookup={(num) => onNavigate('verify-cert', num)}
      />

      {/* Official Invoice Modal */}
      {selectedInvoiceOrder && (
        <OfficialInvoice
          order={selectedInvoiceOrder}
          isModal={true}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

    </div>
  );
};
