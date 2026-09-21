import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  DollarSign,
  Star,
  Plus,
  Video,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Edit,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Award,
  Filter,
  BarChart3,
  Calendar,
  Layers,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Download,
  Megaphone
} from 'lucide-react';
import { Course, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AdminCourseEditor } from '../components/AdminCourseEditor';
import { TeacherLiveClassesTab } from '../components/TeacherLiveClassesTab';
import { TeacherExamsTab } from '../components/TeacherExamsTab';
import { NoticeManagementSection } from '../components/NoticeManagementSection';

interface MonthlyTrend {
  month: string;
  students: number;
  revenue: number;
}

interface EnrolledStudentItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  courseId: string;
  courseTitle: string;
  enrolledAt: string;
  completionPercentage: number;
  certificateId: string | null;
}

interface TeacherStats {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  instructorEarnings: number;
  averageRating: number;
  totalReviews: number;
  totalLessons: number;
  courses: Course[];
  monthlyTrends: MonthlyTrend[];
  enrolledStudents: EnrolledStudentItem[];
  reviews: any[];
}

export const TeacherDashboardPage: React.FC<{
  onNavigateToCourse?: (slug: string) => void;
}> = ({ onNavigateToCourse }) => {
  const { user, token, isInstructor, isAdmin } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'COURSES' | 'LIVE_CLASSES' | 'EXAMS' | 'NOTICES' | 'STUDENTS' | 'REVIEWS' | 'PROFILE'
  >('OVERVIEW');
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  // Course Editor State
  const [isEditingCourse, setIsEditingCourse] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Filters & Searches
  const [courseFilter, setCourseFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [courseSearch, setCourseSearch] = useState<string>('');
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [selectedCourseForStudents, setSelectedCourseForStudents] = useState<string>('ALL');

  // Delete modal
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Profile Edit State
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Fetch Teacher Stats & Courses
  const fetchTeacherData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [resDashboard, resCategories] = await Promise.all([
        fetch('/api/teacher/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/categories')
      ]);

      if (resDashboard.ok) {
        const data = await resDashboard.json();
        setStats(data);
      } else {
        const errData = await resDashboard.json();
        error(errData.error || 'শিক্ষক ড্যাশবোর্ড তথ্য লোড করা যায়নি');
      }

      if (resCategories.ok) {
        const catData = await resCategories.json();
        setCategories(catData.categories || []);
      }
    } catch (err) {
      console.error(err);
      error('সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, [token]);

  // Handle Course Save (Create or Update)
  const handleSaveCourse = async (courseData: Partial<Course>) => {
    if (!token) return;
    try {
      const isUpdate = !!editingCourse?.id;
      const url = isUpdate ? `/api/teacher/courses/${editingCourse.id}` : '/api/teacher/courses';
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'কোর্স সংরক্ষণ করা যায়নি');
      }

      success(isUpdate ? 'কোর্স ও কারিকুলাম সফলভাবে আপডেট হয়েছে!' : 'নতুন কোর্স সফলভাবে তৈরি হয়েছে!');
      setIsEditingCourse(false);
      setEditingCourse(null);
      await fetchTeacherData();
    } catch (err: any) {
      error(err.message || 'কোর্স সংরক্ষণ ব্যর্থ হয়েছে');
      throw err;
    }
  };

  // Handle Course Delete
  const handleConfirmDelete = async () => {
    if (!courseToDelete || !token) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/teacher/courses/${courseToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'কোর্স মোছা যায়নি');
      }

      success('কোর্সটি সফলভাবে মুছে ফেলা হয়েছে');
      setCourseToDelete(null);
      await fetchTeacherData();
    } catch (err: any) {
      error(err.message || 'কোর্স মুছতে সমস্যা হয়েছে');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Toggle Publish
  const handleTogglePublish = async (course: Course) => {
    if (!token) return;
    try {
      const newStatus = !course.isPublished;
      const res = await fetch(`/api/teacher/courses/${course.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isPublished: newStatus })
      });

      if (res.ok) {
        success(newStatus ? 'কোর্সটি পাবলিশ করা হয়েছে' : 'কোর্সটি ড্রাফট মোডে নেওয়া হয়েছে');
        await fetchTeacherData();
      } else {
        error('স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি');
      }
    } catch (err) {
      error('সার্ভারে সমস্যা হয়েছে');
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ headline, bio, phone, avatar })
      });
      if (res.ok) {
        success('প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে');
      } else {
        error('প্রোফাইল সংরক্ষণ ব্যর্থ হয়েছে');
      }
    } catch (err) {
      error('সার্ভারে সমস্যা হয়েছে');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Export student list to CSV
  const handleExportStudents = () => {
    if (!stats || !stats.enrolledStudents.length) {
      error('এক্সপোর্ট করার মতো কোনো শিক্ষার্থী পাওয়া যায়নি');
      return;
    }
    const headers = ['Student ID', 'Name', 'Email', 'Phone', 'Course Title', 'Enrollment Date', 'Progress %', 'Certificate'];
    const rows = stats.enrolledStudents.map((s) => [
      s.userId,
      `"${s.name}"`,
      s.email,
      s.phone,
      `"${s.courseTitle}"`,
      new Date(s.enrolledAt).toLocaleDateString('bn-BD'),
      `${s.completionPercentage}%`,
      s.certificateId || 'Pending'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `enrolled_students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('শিক্ষার্থীদের তালিকা CSV ফরম্যাটে ডাউনলোড হয়েছে');
  };

  // Filter Courses
  const filteredCourses = (stats?.courses || []).filter((c) => {
    if (courseFilter === 'PUBLISHED' && !c.isPublished) return false;
    if (courseFilter === 'DRAFT' && c.isPublished) return false;
    if (courseSearch) {
      const q = courseSearch.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q) || (c.titleBn && c.titleBn.toLowerCase().includes(q));
      const matchCat = c.categoryName.toLowerCase().includes(q);
      return matchTitle || matchCat;
    }
    return true;
  });

  // Filter Enrolled Students
  const filteredStudents = (stats?.enrolledStudents || []).filter((s) => {
    if (selectedCourseForStudents !== 'ALL' && s.courseId !== selectedCourseForStudents) return false;
    if (studentSearch) {
      const q = studentSearch.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.courseTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // If in Course Editor Mode, show the full modular editor
  if (isEditingCourse) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AdminCourseEditor
            initialCourse={editingCourse}
            onSave={handleSaveCourse}
            onCancel={() => {
              setIsEditingCourse(false);
              setEditingCourse(null);
            }}
            categories={categories}
            instructors={[{ id: user?.id || 'me', name: user?.name || 'Instructor', headline: user?.headline }]}
            isTeacherView={true}
            currentTeacherName={user?.name}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      {/* Top Banner with Teacher Identity & Quick Action */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'Teacher')}`}
                  alt={user?.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400/40 shadow-md bg-slate-800"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px]" title="যাচাইকৃত ইন্সট্রাক্টর">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    👨‍🏫 শিক্ষক ড্যাশবোর্ড (Teacher Portal)
                  </span>
                  <span className="text-xs text-emerald-200/80">
                    {user?.role === 'SUPER_ADMIN' ? 'এডমিন ও মেন্টর ভিউ' : 'অফিসিয়াল মেন্টর'}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {user?.name}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/70 font-medium">
                  {user?.headline || 'Tech Educator & Software Architect'} • {user?.email}
                </p>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={fetchTeacherData}
                disabled={isLoading}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="তথ্য রিফ্রেশ করুন"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>রিফ্রেশ</span>
              </button>

              <button
                id="create-new-course-btn"
                onClick={() => {
                  setEditingCourse(null);
                  setIsEditingCourse(true);
                }}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন কোর্স তৈরি করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Left Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* ======================================================== */}
          {/* LEFT SIDEBAR NAVIGATION MENU (Designed as Requested)     */}
          {/* ======================================================== */}
          <aside className="w-full lg:w-72 shrink-0 space-y-4">
            {/* Quick Action Button */}
            <button
              id="create-new-course-sidebar-btn"
              onClick={() => {
                setEditingCourse(null);
                setIsEditingCourse(true);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-900/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>নতুন কোর্স তৈরি করুন</span>
            </button>

            {/* Teacher Left Navigation Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 shadow-xs space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                শিক্ষক মেনু ও অপশনসমূহ
              </div>

              {[
                {
                  id: 'OVERVIEW',
                  label: 'ওভারভিউ ও পারফরম্যান্স',
                  subLabel: 'আয় ও এনরোলমেন্ট রিপোর্ট',
                  icon: BarChart3
                },
                {
                  id: 'COURSES',
                  label: 'আমার কোর্স ও কারিকুলাম',
                  subLabel: 'কোর্স তৈরি ও ম্যানেজমেন্ট',
                  icon: BookOpen,
                  badge: stats?.courses.length || 0
                },
                {
                  id: 'LIVE_CLASSES',
                  label: 'লাইভ ক্লাস ও জুম শিডিউল',
                  subLabel: 'কাউন্টডাউন ও সরাসরি ক্লাস',
                  icon: Video
                },
                {
                  id: 'EXAMS',
                  label: 'পরীক্ষা ও কুইজ প্রশ্ন তৈরি',
                  subLabel: 'MCQ প্রশ্ন ও রেজাল্ট বিশ্লেষণ',
                  icon: Award
                },
                {
                  id: 'NOTICES',
                  label: 'নোটিশ বোর্ড ও এনাউন্সমেন্ট',
                  subLabel: 'কোর্স ও ব্যাচভিত্তিক নোটিশ প্রকাশ',
                  icon: Megaphone
                },
                {
                  id: 'STUDENTS',
                  label: 'এনরোল করা শিক্ষার্থী',
                  subLabel: 'শিক্ষার্থীদের তালিকা ও প্রগ্রেস',
                  icon: Users,
                  badge: stats?.totalStudents || 0
                },
                {
                  id: 'REVIEWS',
                  label: 'স্টুডেন্ট রিভিউ',
                  subLabel: 'রেটিং ও স্টুডেন্ট ফিডব্যাক',
                  icon: Star,
                  badge: stats?.totalReviews || 0
                },
                {
                  id: 'PROFILE',
                  label: 'ইন্সট্রাক্টর প্রোফাইল',
                  subLabel: 'বায়ো, দক্ষতা ও সেটিংস',
                  icon: Edit
                }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left cursor-pointer group ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-xl transition-colors shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold truncate leading-tight">
                          {item.label}
                        </div>
                        <div
                          className={`text-[10px] truncate ${
                            isActive ? 'text-emerald-100' : 'text-slate-400'
                          }`}
                        >
                          {item.subLabel}
                        </div>
                      </div>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Earnings & Stats Widget in Sidebar */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-4 border border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  ইন্সট্রাক্টর সামারি
                </span>
                <button
                  onClick={fetchTeacherData}
                  disabled={isLoading}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="তথ্য রিফ্রেশ করুন"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="text-[10px] text-slate-400 font-medium">মোট আয়</div>
                  <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">
                    ৳{stats?.instructorEarnings?.toLocaleString('bn-BD') || '০'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="text-[10px] text-slate-400 font-medium">গড় রেটিং</div>
                  <div className="text-sm font-black text-amber-400 font-mono mt-0.5 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{stats?.averageRating || '৫.০'}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>মোট অ্যাক্টিভ শিক্ষার্থী</span>
                <span className="font-bold text-slate-200 font-mono">{stats?.totalStudents || 0} জন</span>
              </div>
            </div>
          </aside>

          {/* ======================================================== */}
          {/* RIGHT MAIN CONTENT AREA                                  */}
          {/* ======================================================== */}
          <main className="flex-1 min-w-0 w-full">
            {isLoading && !stats ? (
              <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-emerald-600" />
                <p className="text-sm font-medium">শিক্ষকের তথ্য ও রিপোর্ট লোড হচ্ছে...</p>
              </div>
            ) : (
          <>
            {/* ======================================================== */}
            {/* TAB 1: OVERVIEW & PERFORMANCE REPORT                     */}
            {/* ======================================================== */}
            {activeTab === 'OVERVIEW' && stats && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* 6 High-Impact Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                  {/* Card 1: Total Enrolled Students */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-emerald-600 mb-2">
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        মোট ভর্তি
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {(stats.totalStudents ?? 0).toLocaleString('bn-BD')}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      শিক্ষার্থী এনরোল করেছে
                    </div>
                  </div>

                  {/* Card 2: Total Courses */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-blue-600 mb-2">
                      <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        কোর্সসমূহ
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {(stats.totalCourses ?? 0).toLocaleString('bn-BD')}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      তৈরিকৃত কোর্স
                    </div>
                  </div>

                  {/* Card 3: Total Gross Sales */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-teal-600 mb-2">
                      <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                        মোট বিক্রি
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      ৳{(stats.totalRevenue ?? 0).toLocaleString('bn-BD')}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      কোর্স মোট রাজস্ব
                    </div>
                  </div>

                  {/* Card 4: Instructor Net Earnings (80%) */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-amber-600 mb-2">
                      <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        ৮০% শেয়ার
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      ৳{(stats.instructorEarnings ?? 0).toLocaleString('bn-BD')}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      শিক্ষকের মোট আয়
                    </div>
                  </div>

                  {/* Card 5: Average Rating */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-amber-500 mb-2">
                      <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50">
                        <Star className="w-5 h-5 fill-amber-400" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        ফিডব্যাক
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-1">
                      {stats.averageRating ?? 5.0}
                      <span className="text-xs text-amber-500 font-bold">★</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      {stats.totalReviews ?? 0} টি রিভিউয়ের গড়
                    </div>
                  </div>

                  {/* Card 6: Total Content Lessons */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between text-indigo-600 mb-2">
                      <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50">
                        <Video className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        কারিকুলাম
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {(stats.totalLessons ?? 0).toLocaleString('bn-BD')}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      মোট লেকচার ও ক্লাস
                    </div>
                  </div>
                </div>

                {/* Monthly Trend & Performance Chart Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left 2 Cols: Monthly Trend Visualizer */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                      <div>
                        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-emerald-600" />
                          মাসিক শিক্ষার্থী ভর্তি ও রেভিনিউ ট্রেন্ড (Performance Trend)
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          গত ৬ মাসের কোর্স সেলস এবং নতুন শিক্ষার্থী অন্তর্ভুক্তির পরিসংখ্যান
                        </p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        লাইভ অ্যানালিটিক্স
                      </span>
                    </div>

                    {/* Visual Bar Chart */}
                    <div className="space-y-4">
                      {stats.monthlyTrends.map((trend, idx) => {
                        const maxStudents = Math.max(...stats.monthlyTrends.map((t) => t.students), 100);
                        const percent = Math.min(Math.round((trend.students / maxStudents) * 100), 100);

                        return (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-800 dark:text-slate-200 w-20">
                                {trend.month}
                              </span>
                              <div className="flex items-center gap-4 text-xs">
                                <span className="font-semibold text-slate-600 dark:text-slate-400">
                                  শিক্ষার্থী: <strong className="text-slate-900 dark:text-white">{trend.students} জন</strong>
                                </span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                  ৳{(trend.revenue ?? 0).toLocaleString('bn-BD')}
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right 1 Col: Quick Performance Summary & Instructor Tips */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <Award className="w-5 h-5 text-amber-500" />
                      শিক্ষক পারফরম্যান্স ইনসাইট
                    </h2>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40">
                        <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          সর্বোচ্চ শিক্ষার্থী আকর্ষণ
                        </div>
                        <p className="text-emerald-800/80 dark:text-emerald-300/80">
                          আপনার কোর্সে গড়ে {stats.totalCourses ? Math.round(stats.totalStudents / stats.totalCourses) : 0} জন শিক্ষার্থী প্রতি কোর্সে এনরোল করেছে।
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/40">
                        <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5 mb-1">
                          <Award className="w-4 h-4 text-blue-600" />
                          কোয়ালিটি স্কোর: {stats.averageRating >= 4.8 ? 'অসাধারণ (Top Rated)' : 'ভালো (Good)'}
                        </div>
                        <p className="text-blue-800/80 dark:text-blue-300/80">
                          শিক্ষার্থীদের সন্তুষ্টির হার ৯৬%+ যা প্ল্যাটফর্মের টপ ১০% ইন্সট্রাক্টরের সমতুল্য।
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                          💡 পরবর্তী পদক্ষেপের পরামর্শ
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                          <li>নিয়মিত লেসন কুইজ যোগ করলে কমপ্লিশন রেট বৃদ্ধি পায়।</li>
                          <li>কোর্সে সোর্স কোড এবং প্রজেক্ট জিপ ফাইল যোগ করুন।</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course-by-Course Performance Breakdown Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-emerald-600" />
                        কোর্স ভিত্তিক বিস্তারিত পারফরম্যান্স (Course Breakdown)
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        প্রতিটি কোর্সের শিক্ষার্থী সংখ্যা, রেটিং, লেসন ও স্ট্যাটাস
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('COURSES')}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      সব কোর্স দেখুন <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                          <th className="pb-3 pr-4">কোর্সের নাম</th>
                          <th className="pb-3 px-3">ক্যাটাগরি</th>
                          <th className="pb-3 px-3">এনরোল শিক্ষার্থী</th>
                          <th className="pb-3 px-3">লেসন ও মডিউল</th>
                          <th className="pb-3 px-3">রেটিং</th>
                          <th className="pb-3 px-3">মূল্য</th>
                          <th className="pb-3 px-3">স্ট্যাটাস</th>
                          <th className="pb-3 pl-3 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {stats.courses.map((course) => (
                          <tr key={course.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                            <td className="py-3.5 pr-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                  className="w-12 h-9 rounded-lg object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
                                />
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                    {course.titleBn || course.title}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {course.level} • {course.durationHours} ঘন্টা
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-medium">
                              {course.categoryName}
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {(course.studentsCount ?? 0).toLocaleString('bn-BD')} জন
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                              {course.lessonsCount} টি লেসন ({course.modules?.length || 0} মডিউল)
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                {course.rating}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                              {course.discountPrice ? (
                                <>
                                  <span>৳{course.discountPrice}</span>{' '}
                                  <span className="line-through text-slate-400 text-[10px]">৳{course.price}</span>
                                </>
                              ) : (
                                <span>৳{course.price}</span>
                              )}
                            </td>
                            <td className="py-3.5 px-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  course.isPublished
                                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                }`}
                              >
                                {course.isPublished ? 'পাবলিশড' : 'ড্রাফট'}
                              </span>
                            </td>
                            <td className="py-3.5 pl-3 text-right">
                              <button
                                onClick={() => {
                                  setEditingCourse(course);
                                  setIsEditingCourse(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1"
                              >
                                <Edit className="w-3 h-3" />
                                <span>এডিট ও কনটেন্ট</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: COURSES & CURRICULUM MANAGEMENT                  */}
            {/* ======================================================== */}
            {activeTab === 'COURSES' && stats && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Search, Filter & Action Bar */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  {/* Left Filters */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                      <button
                        onClick={() => setCourseFilter('ALL')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          courseFilter === 'ALL'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        সকল কোর্স ({stats.courses.length})
                      </button>
                      <button
                        onClick={() => setCourseFilter('PUBLISHED')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          courseFilter === 'PUBLISHED'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        পাবলিশড ({stats.courses.filter((c) => c.isPublished).length})
                      </button>
                      <button
                        onClick={() => setCourseFilter('DRAFT')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          courseFilter === 'DRAFT'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        ড্রাফট ({stats.courses.filter((c) => !c.isPublished).length})
                      </button>
                    </div>

                    <div className="relative min-w-[200px]">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        placeholder="কোর্সের নাম দিয়ে খুঁজুন..."
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Right: Add Course Button */}
                  <button
                    onClick={() => {
                      setEditingCourse(null);
                      setIsEditingCourse(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন কোর্স যোগ করুন</span>
                  </button>
                </div>

                {/* Course Grid */}
                {filteredCourses.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                    <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">কোনো কোর্স পাওয়া যায়নি</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      আপনি এখনও কোনো কোর্স তৈরি করেননি অথবা ফিল্টারের সাথে মিলছে না।
                    </p>
                    <button
                      onClick={() => {
                        setEditingCourse(null);
                        setIsEditingCourse(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>প্রথম কোর্স তৈরি শুরু করুন</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                      >
                        {/* Course Thumbnail */}
                        <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 flex gap-1.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                              course.isPublished ? 'bg-teal-500 text-white' : 'bg-amber-500 text-slate-950'
                            }`}>
                              {course.isPublished ? 'লাইভ পাবলিশড' : 'ড্রাফট মোড'}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
                              {course.categoryName}
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {course.durationHours} ঘন্টা • {course.lessonsCount} লেসন
                          </div>
                        </div>

                        {/* Course Info */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug">
                              {course.titleBn || course.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {course.subtitle || course.description}
                            </p>
                          </div>

                          {/* Stats Pill Row */}
                          <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800 text-center">
                            <div>
                              <div className="text-xs font-black text-slate-900 dark:text-white">
                                {course.studentsCount}
                              </div>
                              <div className="text-[10px] text-slate-400 font-semibold">শিক্ষার্থী</div>
                            </div>
                            <div>
                              <div className="text-xs font-black text-amber-500 flex items-center justify-center gap-0.5">
                                <Star className="w-3 h-3 fill-amber-400" />
                                {course.rating}
                              </div>
                              <div className="text-[10px] text-slate-400 font-semibold">রেটিং</div>
                            </div>
                            <div>
                              <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                                ৳{course.discountPrice || course.price}
                              </div>
                              <div className="text-[10px] text-slate-400 font-semibold">ফি</div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2 pt-1">
                            <button
                              onClick={() => {
                                setEditingCourse(course);
                                setIsEditingCourse(true);
                              }}
                              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>সম্পাদনা ও কনটেন্ট কারিকুলাম</span>
                            </button>

                            <div className="grid grid-cols-3 gap-1.5">
                              <button
                                onClick={() => onNavigateToCourse ? onNavigateToCourse(course.slug) : window.open(`/courses/${course.slug}`, '_blank')}
                                className="py-2 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                                title="কোর্স পেজ প্রিভিউ"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>প্রিভিউ</span>
                              </button>

                              <button
                                onClick={() => handleTogglePublish(course)}
                                className={`py-2 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition-colors ${
                                  course.isPublished
                                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 hover:bg-amber-100'
                                    : 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 hover:bg-teal-100'
                                }`}
                                title={course.isPublished ? 'ড্রাফট করুন' : 'পাবলিশ করুন'}
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>{course.isPublished ? 'ড্রাফট' : 'পাবলিশ'}</span>
                              </button>

                              <button
                                onClick={() => setCourseToDelete(course)}
                                className="py-2 px-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/60 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                                title="কোর্স মুছুন"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>মুছুন</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: ENROLLED STUDENTS                                */}
            {/* ======================================================== */}
            {activeTab === 'STUDENTS' && stats && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Search & Filter bar */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 flex-1">
                    <div className="relative flex-1 min-w-[220px]">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        placeholder="শিক্ষার্থীর নাম, ইমেইল বা ফোন নম্বর..."
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <select
                      value={selectedCourseForStudents}
                      onChange={(e) => setSelectedCourseForStudents(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none font-medium"
                    >
                      <option value="ALL">সকল কোর্সের শিক্ষার্থী ({stats.enrolledStudents.length})</option>
                      {stats.courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.titleBn || c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleExportStudents}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV ডাউনলোড</span>
                  </button>
                </div>

                {/* Students Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      মোট পাওয়া গেছে: <strong className="text-slate-900 dark:text-white">{filteredStudents.length} জন শিক্ষার্থী</strong>
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-800/40">
                          <th className="py-3 px-4">শিক্ষার্থী</th>
                          <th className="py-3 px-3">যোগাযোগ</th>
                          <th className="py-3 px-3">কোর্সের নাম</th>
                          <th className="py-3 px-3">এনরোল তারিখ</th>
                          <th className="py-3 px-3">কোর্স অগ্রগতি (%)</th>
                          <th className="py-3 px-3">সার্টিফিকেট</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                              কোনো শিক্ষার্থী পাওয়া যায়নি
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((st) => (
                            <tr key={st.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={st.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(st.name)}`}
                                    alt={st.name}
                                    className="w-8 h-8 rounded-full object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                                  />
                                  <div>
                                    <div className="font-bold text-slate-900 dark:text-white">
                                      {st.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400">ID: {st.userId}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="text-slate-700 dark:text-slate-300 font-medium">{st.email}</div>
                                <div className="text-[10px] text-slate-400">{st.phone}</div>
                              </td>
                              <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                                {st.courseTitle}
                              </td>
                              <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                                {new Date(st.enrolledAt).toLocaleDateString('bn-BD', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </td>
                              <td className="py-3 px-3">
                                <div className="w-32">
                                  <div className="flex justify-between text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    <span>অগ্রগতি</span>
                                    <span>{st.completionPercentage}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        st.completionPercentage >= 100
                                          ? 'bg-emerald-500'
                                          : st.completionPercentage >= 50
                                          ? 'bg-teal-500'
                                          : 'bg-amber-500'
                                      }`}
                                      style={{ width: `${st.completionPercentage}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                {st.certificateId ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                    <Award className="w-3 h-3" />
                                    ইস্যুকৃত
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-semibold">
                                    চলমান
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 4: REVIEWS & FEEDBACK                                */}
            {/* ======================================================== */}
            {activeTab === 'REVIEWS' && stats && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                        শিক্ষার্থীদের মন্তব্য ও রিভিউ ({stats.reviews.length} টি)
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        আপনার কোর্সে শিক্ষার্থীদের প্রদত্ত রেটিং ও মতামত
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-amber-500 flex items-center gap-1">
                        {stats.averageRating} <Star className="w-4 h-4 fill-amber-400" />
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold">গড় রেটিং</div>
                    </div>
                  </div>

                  {stats.reviews.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                      <p className="text-sm font-medium">এখনও কোনো রিভিউ যুক্ত হয়নি।</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {stats.reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={rev.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(rev.userName || 'Student')}`}
                                alt={rev.userName}
                                className="w-7 h-7 rounded-full object-cover bg-slate-200"
                              />
                              <div>
                                <span className="font-bold text-xs text-slate-900 dark:text-white">
                                  {rev.userName || 'শিক্ষার্থী'}
                                </span>
                                <span className="text-[10px] text-slate-400 ml-2">
                                  {new Date(rev.createdAt).toLocaleDateString('bn-BD')}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center text-amber-400 text-xs">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB: LIVE CLASSES & ZOOM SCHEDULE WITH COUNTDOWN       */}
            {/* ======================================================== */}
            {activeTab === 'LIVE_CLASSES' && (
              <TeacherLiveClassesTab courses={stats?.courses || []} />
            )}

            {/* ======================================================== */}
            {/* TAB: EXAMS & QUIZZES BUILDER & SUBMISSIONS             */}
            {/* ======================================================== */}
            {activeTab === 'EXAMS' && (
              <TeacherExamsTab courses={stats?.courses || []} />
            )}

            {/* ======================================================== */}
            {/* TAB: NOTICES & ANNOUNCEMENTS (COURSE & BATCH TARGETED)   */}
            {/* ======================================================== */}
            {activeTab === 'NOTICES' && (
              <NoticeManagementSection
                isAdmin={false}
                courses={stats?.courses || []}
              />
            )}

            {/* ======================================================== */}
            {/* TAB 5: INSTRUCTOR PROFILE SETTINGS                      */}
            {/* ======================================================== */}
            {activeTab === 'PROFILE' && (
              <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                      ইন্সট্রাক্টর প্রোফাইল ও পরিচিতি
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      এই তথ্যগুলো আপনার তৈরি করা কোর্সের ডিটেইলস পেজে শিক্ষার্থীদের প্রদর্শিত হবে
                    </p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        পূর্ণ নাম
                      </label>
                      <input
                        type="text"
                        value={user?.name || ''}
                        disabled
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-medium cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        ইমেইল
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-medium cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        পদবী / হেডলাইন (Title & Headline)
                      </label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="যেমন: Lead Software Architect & Tech Educator"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        ফোন নম্বর
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+880 1711-XXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        প্রোফাইল ছবি / অবতার URL
                      </label>
                      <input
                        type="url"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        শিক্ষক পরিচিতি ও বায়ো (Bio)
                      </label>
                      <textarea
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="আপনার অভিজ্ঞতা, পূর্ববর্তী কর্মক্ষেত্র এবং শিক্ষাদানের লক্ষ্য সম্পর্কে বিস্তারিত লিখুন..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-medium resize-y"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      {isSavingProfile ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>সংরক্ষণ হচ্ছে...</span>
                        </>
                      ) : (
                        <span>প্রোফাইল আপডেট করুন</span>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
          </main>
        </div>
      </div>

      {/* Delete Course Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  কোর্সটি মুছে ফেলতে চান?
                </h3>
                <p className="text-xs text-slate-500">এই পরিবর্তনটি অপরিবর্তনযোগ্য</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              আপনি নিশ্চিতভাবে <strong>"{courseToDelete.titleBn || courseToDelete.title}"</strong> কোর্সটি মুছে ফেলতে চান? এর সাথে সম্পর্কিত সকল মডিউল ও লেসন মুছে যাবে।
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>মুছে ফেলা হচ্ছে...</span>
                  </>
                ) : (
                  <span>হ্যাঁ, মুছে ফেলুন</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
