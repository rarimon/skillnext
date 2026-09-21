import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  BookOpen,
  Users,
  Receipt,
  Tag,
  Award,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  DollarSign,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ExternalLink,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCircle2,
  Printer,
  Download,
  Filter,
  ArrowUpDown,
  GraduationCap,
  Copy,
  Check,
  Globe,
  LogOut,
  Sparkles,
  Megaphone
} from 'lucide-react';
import { Course, Order, Coupon, User, Certificate } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { AdminCourseEditor } from '../components/AdminCourseEditor';
import { AdminMessagesSection } from '../components/AdminMessagesSection';
import { AdminSupportReportSection } from '../components/AdminSupportReportSection';
import { AdminOverviewSection } from '../components/AdminOverviewSection';
import { AdminUsersManagement } from '../components/AdminUsersManagement';
import { AdminTeacherManagement } from '../components/AdminTeacherManagement';
import { AdminStudentsManagement } from '../components/AdminStudentsManagement';
import { AdminWebContentCMS } from '../components/AdminWebContentCMS';
import { AdminDatabaseSettings } from '../components/AdminDatabaseSettings';
import { OfficialInvoice } from '../components/OfficialInvoice';
import { AdminTopNavbar } from '../components/AdminTopNavbar';
import { AdminCourseFullReport } from '../components/AdminCourseFullReport';
import { TeacherExamsTab } from '../components/TeacherExamsTab';
import { NoticeManagementSection } from '../components/NoticeManagementSection';

interface AdminDashboardPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { user, token, logout } = useAuth();
  const { language, t } = useLanguage();
  const { success: toastSuccess, error: toastError } = useToast();

  const handleAdminLogout = () => {
    logout();
    toastSuccess(language === 'bn' ? 'সফলভাবে লগআউট হয়েছে' : 'Logged out successfully');
    onNavigate('home');
  };

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'courses'
    | 'course-reports'
    | 'exams'
    | 'teachers'
    | 'users'
    | 'students'
    | 'orders'
    | 'messages'
    | 'sms-report'
    | 'coupons'
    | 'certificates'
    | 'web-content'
    | 'settings'
    | 'notices'
  >('overview');

  // Selected course for full course-wise report
  const [selectedReportCourseId, setSelectedReportCourseId] = useState<string>('');

  // Sidebar controls
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Course sub-view: full-page in-place editor (NOT popup modal)
  const [courseSubView, setCourseSubView] = useState<'list' | 'editor'>('list');
  const [selectedEditCourse, setSelectedEditCourse] = useState<Course | null>(null);

  // Orders State & Invoice Modal
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | 'PENDING' | 'PAID' | 'CANCELLED'>('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [approvingOrderId, setApprovingOrderId] = useState<string | null>(null);
  const [copiedTrxId, setCopiedTrxId] = useState<string | null>(null);

  // Coupon modal
  const [isNewCouponModalOpen, setIsNewCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('20');
  const [minOrder, setMinOrder] = useState('1000');

  // Unread messages count badge
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);

  // Web Content CMS Submenu states
  const [webContentSubTab, setWebContentSubTab] = useState<
    'hero' | 'promo' | 'stats' | 'sections' | 'features' | 'mentors' | 'testimonials' | 'cta' | 'contact' | 'footer' | 'gateways'
  >('hero');
  const [isCmsSubmenuOpen, setIsCmsSubmenuOpen] = useState(false);
  const [isMessagesSubmenuOpen, setIsMessagesSubmenuOpen] = useState(false);

  // Polling unread chat count for real-time menu badge and title blinking
  const fetchUnreadMessagesCount = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/chat/unread-count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUnreadChatCount(data.unreadCount ?? 0);
      }
    } catch {
      // Ignore
    }
  }, [token]);

  useEffect(() => {
    fetchUnreadMessagesCount();
    const interval = setInterval(fetchUnreadMessagesCount, 3500);
    return () => clearInterval(interval);
  }, [fetchUnreadMessagesCount]);

  // Data states
  const [stats, setStats] = useState<{
    totalRevenue: number;
    totalOrders: number;
    totalStudents: number;
    totalCourses: number;
    totalEnrollments: number;
    certificatesIssued: number;
    monthlySales: Array<{ month: string; amount: number }>;
  } | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; nameBn?: string }[]>([]);
  const [instructors, setInstructors] = useState<{ id: string; name: string; email: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    if (!token) return;
    setLoading(true);

    Promise.all([
      fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/courses?includeUnpublished=true').then((r) => r.json()),
      fetch('/api/admin/students', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/admin/coupons', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/admin/certificates', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()).catch(() => []),
      fetch('/api/chat/conversations', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).catch(() => ({ conversations: [] }))
    ])
      .then(([statsData, courseData, studentsData, ordersData, couponData, certData, catData, chatData]) => {
        setStats(statsData);
        setCourses(Array.isArray(courseData) ? courseData : (courseData?.courses || []));
        setStudents(Array.isArray(studentsData) ? studentsData : (studentsData?.students || []));
        setOrders(Array.isArray(ordersData) ? ordersData : (ordersData?.orders || []));
        setCoupons(Array.isArray(couponData) ? couponData : (couponData?.coupons || []));
        setCertificates(Array.isArray(certData) ? certData : (certData?.certificates || []));
        if (Array.isArray(catData)) setCategories(catData);

        if (chatData && Array.isArray(chatData.conversations)) {
          const totalUnread = chatData.conversations.reduce(
            (acc: number, c: any) => acc + (c.unreadCountAdmin || 0),
            0
          );
          setUnreadChatCount(totalUnread);
        }

        // Derive instructor list
        const instMap = new Map<string, { id: string; name: string; email: string }>();
        if (Array.isArray(courseData)) {
          courseData.forEach((c: Course) => {
            if (c.instructor && !instMap.has(c.instructor.id)) {
              instMap.set(c.instructor.id, {
                id: c.instructor.id,
                name: c.instructor.name,
                email: c.instructor.email || 'instructor@skillnest.academy'
              });
            }
          });
        }
        setInstructors(Array.from(instMap.values()));
      })
      .catch((err) => console.error('Admin fetchData error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Handle Course Save from the full-page editor
  const handleSaveCourseFromEditor = async (coursePayload: Partial<Course>) => {
    const isEdit = !!selectedEditCourse?.id;
    const url = isEdit ? `/api/admin/courses/${selectedEditCourse.id}` : '/api/admin/courses';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(coursePayload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'কোর্স সংরক্ষণ করা যায়নি');
    }

    if (isEdit) {
      setCourses((prev) => prev.map((c) => (c.id === selectedEditCourse.id ? data.course : c)));
      toastSuccess('কোর্সের সকল তথ্য সফলভাবে আপডেট হয়েছে!');
    } else {
      setCourses((prev) => [data.course, ...prev]);
      toastSuccess('নতুন কোর্স সফলভাবে যুক্ত হয়েছে!');
    }

    setCourseSubView('list');
    setSelectedEditCourse(null);
  };

  // Toggle Course Publish
  const handleToggleCoursePublish = async (courseId: string, currentPublished: boolean) => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isPublished: !currentPublished })
      });
      if (res.ok) {
        setCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, isPublished: !currentPublished } : c))
        );
        toastSuccess(!currentPublished ? 'কোর্সটি পাবলিশ করা হয়েছে' : 'কোর্সটি আনপাবলিশ করা হয়েছে');
      }
    } catch {
      toastError('স্ট্যাটাস পরিবর্তন করা যায়নি');
    }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('আপনি কি নিশ্চিতভাবে এই কোর্সটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
        toastSuccess('কোর্স সফলভাবে ডিলিট হয়েছে');
      }
    } catch {
      toastError('কোর্স ডিলিট করা যায়নি');
    }
  };

  // Order Approval Handler
  const handleApproveOrder = async (orderId: string) => {
    setApprovingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        toastSuccess('অর্ডার অনুমোদিত হয়েছে এবং শিক্ষার্থীকে কোর্সে অ্যাক্সেস দেওয়া হয়েছে!');
        fetchData();
      } else {
        toastError(data.error || 'অর্ডার অনুমোদন ব্যর্থ হয়েছে');
      }
    } catch (err) {
      toastError('নেটওয়ার্ক এরর');
    } finally {
      setApprovingOrderId(null);
    }
  };

  // Order Cancel Handler
  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('আপনি কি এই অর্ডারটি বাতিল করতে চান?')) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        toastSuccess('অর্ডার বাতিল করা হয়েছে');
      } else {
        toastError(data.error || 'অর্ডার বাতিল ব্যর্থ হয়েছে');
      }
    } catch (err) {
      toastError('নেটওয়ার্ক এরর');
    }
  };

  // Create Coupon Submit
  const handleCreateCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          discountType,
          discountValue: Number(discountValue) || 10,
          minOrderAmount: Number(minOrder) || 0,
          validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCoupons((prev) => [data.coupon, ...prev]);
        setIsNewCouponModalOpen(false);
        setCouponCode('');
        toastSuccess('নতুন কুপন যুক্ত হয়েছে!');
      } else {
        toastError(data.error || 'কুপন তৈরি ব্যর্থ হয়েছে');
      }
    } catch {
      toastError('কুপন তৈরি ব্যর্থ হয়েছে');
    }
  };

  // Toggle Certificate Status
  const handleToggleCertStatus = async (certId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'VALID' ? 'REVOKED' : 'VALID';
    try {
      const res = await fetch(`/api/admin/certificates/${certId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setCertificates((prev) =>
          prev.map((c) => (c.id === certId ? { ...c, status: nextStatus as any } : c))
        );
        toastSuccess(`সার্টিফিকেট স্ট্যাটাস ${nextStatus} এ পরিবর্তন করা হয়েছে`);
      }
    } catch {
      toastError('সার্টিফিকেট স্ট্যাটাস পরিবর্তন ব্যর্থ');
    }
  };

  // Pending orders count for badge
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length;

  // CMS Submenu Items
  const cmsSubItems = [
    { id: 'hero', label: language === 'bn' ? 'হিরো ব্যানার ও শিরোনাম' : 'Hero Banner' },
    { id: 'promo', label: language === 'bn' ? 'প্রমো নোটিশ বার' : 'Promo Notice Bar' },
    { id: 'stats', label: language === 'bn' ? 'প্ল্যাটফর্ম পরিসংখ্যান' : 'Stats & Numbers' },
    { id: 'sections', label: language === 'bn' ? 'সেকশন শিরোনাম ও ব্যাজ' : 'Section Titles' },
    { id: 'features', label: language === 'bn' ? 'আমাদের বিশেষ সুবিধাসমূহ' : 'Platform Features' },
    { id: 'mentors', label: language === 'bn' ? 'শিক্ষক ও মেন্টর শোকেস' : 'Mentors Showcase' },
    { id: 'testimonials', label: language === 'bn' ? 'সফলতার গল্প ও রিভিউ' : 'Success Stories' },
    { id: 'cta', label: language === 'bn' ? 'কল টু অ্যাকশন ও অফার' : 'CTA & Offers' },
    { id: 'contact', label: language === 'bn' ? 'যোগাযোগ ও হেল্পলাইন' : 'Contact & Helpline' },
    { id: 'footer', label: language === 'bn' ? 'ফুটার ও সোশ্যাল লিংক' : 'Footer & Social' },
    { id: 'gateways', label: language === 'bn' ? 'পেমেন্ট গেটওয়ে নির্দেশনা' : 'Payment Gateways' }
  ];

  // Categorized navigation groups (clean professional structure)
  const navSections = [
    {
      title: language === 'bn' ? 'প্রধান মেনু' : 'MAIN MENU',
      items: [
        { id: 'overview', label: t('adminTabOverview'), icon: BarChart3 }
      ]
    },
    {
      title: language === 'bn' ? 'ইউজার ও শিক্ষার্থী' : 'USERS & STUDENTS',
      items: [
        {
          id: 'users',
          label: language === 'bn' ? 'ইউজার ও রোল পারমিশন' : 'User & Role Permission',
          icon: ShieldCheck
        },
        {
          id: 'students',
          label: language === 'bn' ? 'শিক্ষার্থী তালিকা' : 'Student List',
          icon: Users,
          badge: students.length
        },
        {
          id: 'teachers',
          label: language === 'bn' ? 'শিক্ষক ও মেন্টর' : 'Instructors',
          icon: GraduationCap,
          badge: instructors.length
        }
      ]
    },
    {
      title: language === 'bn' ? 'কোর্স ও ওয়েব কন্টেন্ট' : 'COURSES & WEB CONTENT',
      items: [
        { id: 'courses', label: t('adminTabCourses'), icon: BookOpen, badge: courses.length },
        {
          id: 'notices',
          label: language === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board',
          icon: Megaphone
        },
        {
          id: 'course-reports',
          label: language === 'bn' ? 'কোর্স ভিত্তিক পূর্ণাঙ্গ রিপোর্ট' : 'Course Full Reports',
          icon: BarChart3
        },
        {
          id: 'exams',
          label: language === 'bn' ? 'পরীক্ষা ও প্রশ্নমালা' : 'Exams & Questions',
          icon: Award
        },
        {
          id: 'web-content',
          label: language === 'bn' ? 'ওয়েব কন্টেন্ট (CMS)' : 'Web Content (CMS)',
          icon: Globe,
          isCmsMenu: true
        }
      ]
    },
    {
      title: language === 'bn' ? 'ফাইন্যান্স ও সাপোর্ট' : 'FINANCE & SUPPORT',
      items: [
        {
          id: 'orders',
          label: t('adminTabOrders'),
          icon: Receipt,
          badge: orders.length
        },
        {
          id: 'messages',
          label: language === 'bn' ? 'লাইভ চ্যাট ও সাপোর্ট' : 'Live Messages',
          icon: MessageSquare,
          badge: unreadChatCount > 0 ? unreadChatCount : undefined,
          isMessagesMenu: true
        },
        { id: 'coupons', label: t('adminTabCoupons'), icon: Tag, badge: coupons.length },
        { id: 'certificates', label: t('adminTabCertificates'), icon: Award, badge: certificates.length }
      ]
    },
    {
      title: language === 'bn' ? 'সিস্টেম' : 'SYSTEM',
      items: [
        { id: 'settings', label: t('adminTabSettings'), icon: Settings }
      ]
    }
  ];

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = orderStatusFilter === 'ALL' || ord.status === orderStatusFilter;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (ord.user?.name && ord.user.name.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (ord.user?.email && ord.user.email.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (ord.user?.phone && ord.user.phone.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (ord.transactionId && ord.transactionId.toLowerCase().includes(orderSearchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Course search & filter for courses tab
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [courseCategoryFilter, setCourseCategoryFilter] = useState('ALL');

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
      (c.instructor?.name && c.instructor.name.toLowerCase().includes(courseSearchTerm.toLowerCase()));
    const matchesCat = courseCategoryFilter === 'ALL' || c.categoryName.toLowerCase() === courseCategoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const currentCmsSubItem = cmsSubItems.find((s) => s.id === webContentSubTab);
  const activeTabLabel =
    activeTab === 'web-content'
      ? `${language === 'bn' ? 'ওয়েব কন্টেন্ট' : 'Web Content'} - ${currentCmsSubItem?.label || 'হিরো ব্যানার'}`
      : activeTab === 'messages'
      ? `${language === 'bn' ? 'লাইভ চ্যাট ও সাপোর্ট' : 'Live Chat & Support'} - ${language === 'bn' ? 'চ্যাট কনসোল' : 'Chat Console'}`
      : activeTab === 'sms-report'
      ? `${language === 'bn' ? 'লাইভ চ্যাট ও সাপোর্ট' : 'Live Chat & Support'} - ${language === 'bn' ? 'মেসেজ ও SMS রিপোর্ট' : 'SMS & Support Reports'}`
      : activeTab === 'course-reports'
      ? `${language === 'bn' ? 'কোর্স ভিত্তিক পূর্ণাঙ্গ রিপোর্ট' : 'Course Full Reports'}`
      : activeTab === 'notices'
      ? `${language === 'bn' ? 'নোটিশ বোর্ড ও এনাউন্সমেন্ট' : 'Notice Board & Announcements'}`
      : activeTab === 'exams'
      ? `${language === 'bn' ? 'পরীক্ষা ও প্রশ্নমালা ম্যানেজমেন্ট' : 'Exams & MCQ Question Bank'}`
      : navSections.flatMap((s) => s.items).find((m) => m.id === activeTab)?.label || 'ওভারভিউ';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-35 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* LEFT SIDEBAR - Executive Premium Architecture */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 bg-slate-900 text-slate-100 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 select-none shadow-2xl shrink-0 ${
          mobileSidebarOpen ? 'translate-x-0 w-72 p-4' : '-translate-x-full lg:translate-x-0'
        } ${isSidebarCollapsed ? 'lg:w-[76px] p-3' : 'lg:w-72 p-4'}`}
      >
        <div className="flex flex-col h-[calc(100vh-95px)] overflow-y-auto pr-0.5 custom-scrollbar">
          {/* Logo & Collapse / Expand Toggle */}
          <div className={`flex items-center pb-4 mb-3 border-b border-slate-800 transition-all ${
            isSidebarCollapsed ? 'flex-col justify-center gap-2.5' : 'justify-between'
          }`}>
            <div
              onClick={() => onNavigate('home')}
              className={`flex items-center cursor-pointer group ${
                isSidebarCollapsed ? 'justify-center' : 'gap-3 overflow-hidden'
              }`}
              title="SkillNest হোমপেজ"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 group-hover:scale-105 flex items-center justify-center text-slate-950 font-black text-base shadow-lg shadow-emerald-500/20 shrink-0 transition-transform">
                SN
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold tracking-tight text-white block truncate">
                      SkillNest
                    </span>
                    <span className="text-[9px] font-extrabold tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-md uppercase">
                      Pro
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block truncate">
                    এডমিন কন্ট্রোল সেন্টার
                  </span>
                </div>
              )}
            </div>

            {/* Collapse / Expand Button on Desktop */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
              title={isSidebarCollapsed ? 'সাইডবার প্রসারিত করুন' : 'সাইডবার সংকুচিত করুন'}
              id="sidebar-toggle-btn"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-emerald-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Categorized Navigation Links */}
          <div className="space-y-4 flex-1">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {!isSidebarCollapsed && (
                  <h4 className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {section.title}
                  </h4>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const isCms = (item as any).isCmsMenu;
                    const isMessageMenu = (item as any).isMessagesMenu;
                    const isMessageItem = item.id === 'messages';
                    const hasUnreadMessages = isMessageItem && unreadChatCount > 0;

                    if (isMessageMenu) {
                      const isMessagesActive = activeTab === 'messages' || activeTab === 'sms-report';
                      return (
                        <div key={item.id} className="space-y-0.5">
                          <button
                            onClick={() => {
                              setActiveTab('messages');
                              setIsMessagesSubmenuOpen((prev) => !prev);
                            }}
                            title={isSidebarCollapsed ? item.label : undefined}
                            className={`w-full flex items-center rounded-xl text-xs transition-all duration-150 relative group cursor-pointer ${
                              isSidebarCollapsed
                                ? 'justify-center w-11 h-11 mx-auto'
                                : 'justify-between px-3.5 py-2.5'
                            } ${
                              isMessagesActive
                                ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-950/40'
                                : hasUnreadMessages
                                ? 'bg-emerald-950/80 border border-emerald-500/70 text-emerald-300 font-bold shadow-md shadow-emerald-950/60 ring-1 ring-emerald-400/50'
                                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 font-medium'
                            }`}
                          >
                            <div className={`flex items-center min-w-0 ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                              <Icon
                                className={`w-4 h-4 shrink-0 transition-colors ${
                                  isMessagesActive
                                    ? 'text-white'
                                    : hasUnreadMessages
                                    ? 'text-emerald-400 animate-bounce'
                                    : 'text-slate-400 group-hover:text-emerald-400'
                                }`}
                              />
                              {!isSidebarCollapsed && (
                                <span className="truncate tracking-tight">{item.label}</span>
                              )}
                            </div>

                            {!isSidebarCollapsed && (
                              <div className="flex items-center gap-1.5">
                                {unreadChatCount > 0 && (
                                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                                    {unreadChatCount}
                                  </span>
                                )}
                                <ChevronDown
                                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                                    isMessagesSubmenuOpen ? 'rotate-0' : '-rotate-90'
                                  }`}
                                />
                              </div>
                            )}
                          </button>

                          {/* Submenu List under Live Chat & Support */}
                          {!isSidebarCollapsed && isMessagesSubmenuOpen && (
                            <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-slate-800/80 ml-5 my-1 animate-in fade-in-50 duration-150">
                              <button
                                onClick={() => {
                                  setActiveTab('messages');
                                  setMobileSidebarOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer text-left ${
                                  activeTab === 'messages'
                                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                      activeTab === 'messages' ? 'bg-emerald-400 shadow-xs shadow-emerald-400' : 'bg-slate-600'
                                    }`}
                                  />
                                  <span className="truncate">{language === 'bn' ? 'লাইভ চ্যাট কনসোল' : 'Live Chat Console'}</span>
                                </div>
                                {unreadChatCount > 0 && (
                                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                                    {unreadChatCount}
                                  </span>
                                )}
                              </button>

                              <button
                                onClick={() => {
                                  setActiveTab('sms-report');
                                  setMobileSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer text-left ${
                                  activeTab === 'sms-report'
                                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                    activeTab === 'sms-report' ? 'bg-emerald-400 shadow-xs shadow-emerald-400' : 'bg-slate-600'
                                  }`}
                                />
                                <span className="truncate">{language === 'bn' ? 'মেসেজ ও SMS রিপোর্ট' : 'SMS & Support Reports'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (isCms) {
                      return (
                        <div key={item.id} className="space-y-0.5">
                          <button
                            onClick={() => {
                              setActiveTab('web-content');
                              setIsCmsSubmenuOpen((prev) => !prev);
                            }}
                            title={isSidebarCollapsed ? item.label : undefined}
                            className={`w-full flex items-center rounded-xl text-xs transition-all duration-150 relative group cursor-pointer ${
                              isSidebarCollapsed
                                ? 'justify-center w-11 h-11 mx-auto'
                                : 'justify-between px-3.5 py-2.5'
                            } ${
                              isActive
                                ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-950/40'
                                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 font-medium'
                            }`}
                          >
                            <div className={`flex items-center min-w-0 ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                              <Icon
                                className={`w-4 h-4 shrink-0 transition-colors ${
                                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                                }`}
                              />
                              {!isSidebarCollapsed && (
                                <span className="truncate tracking-tight">{item.label}</span>
                              )}
                            </div>

                            {!isSidebarCollapsed && (
                              <ChevronDown
                                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                                  isCmsSubmenuOpen ? 'rotate-0' : '-rotate-90'
                                }`}
                              />
                            )}
                          </button>

                          {/* Submenu List under Web Content CRM */}
                          {!isSidebarCollapsed && isCmsSubmenuOpen && (
                            <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-slate-800/80 ml-5 my-1 animate-in fade-in-50 duration-150">
                              {cmsSubItems.map((sub) => {
                                const isSubActive = activeTab === 'web-content' && webContentSubTab === sub.id;
                                return (
                                  <button
                                    key={sub.id}
                                    onClick={() => {
                                      setActiveTab('web-content');
                                      setWebContentSubTab(sub.id as any);
                                      setMobileSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer text-left ${
                                      isSubActive
                                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                        isSubActive ? 'bg-emerald-400 shadow-xs shadow-emerald-400' : 'bg-slate-600'
                                      }`}
                                    />
                                    <span className="truncate">{sub.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setMobileSidebarOpen(false);
                          if (item.id === 'courses') {
                            setCourseSubView('list');
                          }
                        }}
                        title={isSidebarCollapsed ? item.label : undefined}
                        className={`w-full flex items-center rounded-xl text-xs transition-all duration-150 relative group cursor-pointer ${
                          isSidebarCollapsed
                            ? 'justify-center w-11 h-11 mx-auto'
                            : 'justify-between px-3.5 py-2.5'
                        } ${
                          isActive
                            ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-950/40'
                            : hasUnreadMessages
                            ? 'bg-emerald-950/80 border border-emerald-500/70 text-emerald-300 font-bold shadow-md shadow-emerald-950/60 ring-1 ring-emerald-400/50 animate-pulse'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/80 font-medium'
                        }`}
                      >
                        <div className={`flex items-center min-w-0 ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive
                                ? 'text-white'
                                : hasUnreadMessages
                                ? 'text-emerald-400 animate-bounce'
                                : 'text-slate-400 group-hover:text-emerald-400'
                            }`}
                          />
                          {!isSidebarCollapsed && (
                            <span className="truncate tracking-tight">{item.label}</span>
                          )}
                        </div>

                        {!isSidebarCollapsed && item.badge !== undefined && (
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0 font-mono ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : hasUnreadMessages
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black animate-pulse'
                                : 'bg-slate-800 text-slate-400 border border-slate-700/60 group-hover:text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {/* Collapsed indicator dot */}
                        {isSidebarCollapsed && (
                          <>
                            {hasUnreadMessages && (
                              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-ping" />
                            )}
                            {item.badge !== undefined && !isActive && !hasUnreadMessages && (
                              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions (Shown only when expanded) */}
          {!isSidebarCollapsed && (
            <div className="pt-3 mt-3 border-t border-slate-800/80">
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('courses');
                    setSelectedEditCourse(null);
                    setCourseSubView('editor');
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন কোর্স যোগ করুন</span>
                </button>
                <button
                  onClick={() => onNavigate('home')}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/70 text-xs font-medium transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>পাবলিক ওয়েবসাইট দেখুন</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Card at Bottom of Left Sidebar */}
        <div className={`pt-3 border-t border-slate-800 flex items-center ${
          isSidebarCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'
        }`}>
          <div
            className={`flex items-center min-w-0 ${isSidebarCollapsed ? 'justify-center' : 'gap-2.5'}`}
            title={isSidebarCollapsed ? `${user?.name || 'Admin'} (${user?.role || 'Admin'})` : undefined}
          >
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name?.charAt(0) || 'A'}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name || 'Admin User'}
                </p>
                <span className="text-[10px] text-emerald-400 font-bold block">
                  {user?.role || 'SUPER_ADMIN'}
                </span>
              </div>
            )}
          </div>

          {!isSidebarCollapsed && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={fetchData}
                title="তথ্য রিফ্রেশ করুন"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
              <button
                onClick={handleAdminLogout}
                title="লগআউট করুন"
                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT COLUMN: Dedicated Admin Top Navbar + Scrollable Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Dedicated Admin Top Navbar */}
        <AdminTopNavbar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          activeTab={activeTab}
          activeTabLabel={activeTabLabel}
          user={user}
          courses={courses}
          students={students}
          orders={orders}
          unreadChatCount={unreadChatCount}
          loading={loading}
          onRefresh={fetchData}
          onNavigateTab={(tab, subView) => {
            setActiveTab(tab as any);
            if (tab === 'courses' && subView === 'editor') {
              setSelectedEditCourse(null);
              setCourseSubView('editor');
            } else if (tab === 'courses') {
              setCourseSubView('list');
            }
          }}
          onNavigateSite={(route) => onNavigate(route)}
          onLogout={handleAdminLogout}
        />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Top Header Bar with Breadcrumb and Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-500">এডমিন কনসোল</span>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {activeTabLabel}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {activeTabLabel}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>System Online</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={fetchData}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="তথ্য রিফ্রেশ করুন"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
              </button>

              {activeTab === 'courses' && courseSubView === 'list' && (
                <button
                  onClick={() => {
                    setSelectedEditCourse(null);
                    setCourseSubView('editor');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন কোর্স</span>
                </button>
              )}

              {activeTab === 'coupons' && (
                <button
                  onClick={() => setIsNewCouponModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন কুপন</span>
                </button>
              )}
            </div>
          </div>

        {/* Tab 1: Overview & Analytics (With Real Charts & Real-Time Live Sales Feed) */}
        {activeTab === 'overview' && (
          <AdminOverviewSection
            stats={stats}
            courses={courses}
            orders={orders}
            students={students}
            token={token}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
            onRefreshData={fetchData}
          />
        )}

        {/* Tab 2: Course Management (In-Page Full Editor, NOT a popup modal) */}
        {activeTab === 'courses' && (
          <div>
            {courseSubView === 'editor' ? (
              <AdminCourseEditor
                initialCourse={selectedEditCourse}
                onSave={handleSaveCourseFromEditor}
                onCancel={() => {
                  setCourseSubView('list');
                  setSelectedEditCourse(null);
                }}
                categories={categories}
                instructors={instructors}
              />
            ) : (
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={courseSearchTerm}
                      onChange={(e) => setCourseSearchTerm(e.target.value)}
                      placeholder="কোর্স বা ইন্সট্রাক্টরের নাম খুঁজুন..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {courseSearchTerm && (
                      <button
                        onClick={() => setCourseSearchTerm('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-bold">
                    <button
                      onClick={() => setCourseCategoryFilter('ALL')}
                      className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                        courseCategoryFilter === 'ALL'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      সব ({courses.length})
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCourseCategoryFilter(cat.name)}
                        className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                          courseCategoryFilter.toLowerCase() === cat.name.toLowerCase()
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {cat.nameBn || cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Courses Table Container */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        কোর্স কন্টেন্ট ও সিলেবাস তালিকা ({filteredCourses.length})
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        ভিডিও, কুইজ, রিসোর্স ও মডিউল সরাসরি পেজেই তৈরি ও আপডেট করুন
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedEditCourse(null);
                        setCourseSubView('editor');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন কোর্স যোগ করুন</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('course-reports')}
                      className="px-3.5 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 transition-all cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <span>কোর্স রিপোর্ট দেখুন</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase text-slate-400 font-bold">
                        <tr>
                          <th className="p-3.5 pl-5">কোর্স তথ্য</th>
                          <th className="p-3.5">ক্যাটাগরি</th>
                          <th className="p-3.5">কোর্স ফি</th>
                          <th className="p-3.5">এনরোলমেন্ট</th>
                          <th className="p-3.5">রেটিং</th>
                          <th className="p-3.5">স্ট্যাটাস</th>
                          <th className="p-3.5 pr-5 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                        {filteredCourses.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-400">
                              কোনো কোর্স পাওয়া যায়নি
                            </td>
                          </tr>
                        ) : (
                          filteredCourses.map((course) => (
                            <tr
                              key={course.id}
                              className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                            >
                              <td className="p-3.5 pl-5">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-14 h-9 rounded-lg object-cover bg-slate-200 shrink-0 border border-slate-200/60 dark:border-slate-700"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-extrabold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-sm">
                                      {course.title}
                                    </p>
                                    <p className="text-[11px] text-slate-400">{course.instructor?.name}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3.5 font-bold text-slate-600 dark:text-slate-300">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px]">
                                  {course.categoryName}
                                </span>
                              </td>
                              <td className="p-3.5 font-extrabold text-slate-900 dark:text-white">
                                ৳{(course.price ?? 0).toLocaleString()}
                              </td>
                              <td className="p-3.5 text-slate-600 dark:text-slate-300">{course.studentsCount} জন</td>
                              <td className="p-3.5 font-bold text-amber-500">★ {course.rating.toFixed(1)}</td>
                              <td className="p-3.5">
                                <button
                                  onClick={() => handleToggleCoursePublish(course.id, !!course.isPublished)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                                    course.isPublished
                                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/30'
                                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                  }`}
                                  title="স্ট্যাটাস পরিবর্তন করতে ক্লিক করুন"
                                >
                                  {course.isPublished ? 'পাবলিশড' : 'ড্রাফট'}
                                </button>
                              </td>
                              <td className="p-3.5 pr-5 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {/* Course-wise Report Button */}
                                  <button
                                    onClick={() => {
                                      setSelectedReportCourseId(course.id);
                                      setActiveTab('course-reports');
                                    }}
                                    className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold border border-blue-200 dark:border-blue-900/50"
                                    title="এই কোর্সের সেলস, শিক্ষার্থী ও পরীক্ষার পূর্ণাঙ্গ রিপোর্ট দেখুন"
                                  >
                                    <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                                    <span className="hidden sm:inline">রিপোর্ট</span>
                                  </button>
                                  {/* Edit In-Page Full Editor */}
                                  <button
                                    onClick={() => {
                                      setSelectedEditCourse(course);
                                      setCourseSubView('editor');
                                    }}
                                    className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                                    title="কোর্স এডিট ও সিলেবাস ম্যানেজ করুন"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => onNavigate('course-details', course.slug)}
                                    className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                                    title="কোর্স প্রিভিউ দেখুন"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCourse(course.id)}
                                    className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                    title="কোর্স মুছে ফেলুন"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
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
          </div>
        )}

        {/* Tab: Course Wise Comprehensive Reports */}
        {activeTab === 'course-reports' && (
          <AdminCourseFullReport
            initialCourseId={selectedReportCourseId}
            onNavigateToCourseEdit={(courseId) => {
              const found = courses.find((c) => c.id === courseId);
              if (found) {
                setSelectedEditCourse(found);
                setCourseSubView('editor');
                setActiveTab('courses');
              }
            }}
            onNavigateToExams={() => {
              setActiveTab('exams');
            }}
          />
        )}

        {/* Tab: Exams & Questions Management (Full-Page MCQ Builder, NO MODAL) */}
        {activeTab === 'exams' && (
          <TeacherExamsTab courses={courses} />
        )}

        {/* Tab: Teachers & Instructors Management */}
        {activeTab === 'teachers' && (
          <AdminTeacherManagement
            onSelectTeacherForCourses={() => {
              setActiveTab('courses');
            }}
          />
        )}

        {/* Tab: Users & Roles Management (RBAC) */}
        {activeTab === 'users' && (
          <AdminUsersManagement
            token={token}
            currentUser={user}
            onRefresh={fetchData}
          />
        )}

        {/* Tab: Dedicated Students List & Management */}
        {activeTab === 'students' && (
          <AdminStudentsManagement
            token={token}
            onNavigateToChat={(studentEmail) => {
              setActiveTab('messages');
            }}
          />
        )}

        {/* Tab: Web Content Management (Fully Dynamic Website CMS) */}
        {activeTab === 'web-content' && (
          <AdminWebContentCMS
            token={token}
            activeSubTab={webContentSubTab}
            onSubTabChange={(t) => setWebContentSubTab(t as any)}
            onPreviewHome={() => onNavigate('home')}
          />
        )}

        {/* Tab 4: Orders & Approval Workflow with Invoice Download */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="অর্ডার নম্বর, শিক্ষার্থী বা Trx ID খুঁজুন..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold overflow-x-auto scrollbar-none">
                {(['ALL', 'PENDING', 'PAID', 'CANCELLED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                      orderStatusFilter === st
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'ALL'
                      ? `সকল অর্ডার (${orders.length})`
                      : st === 'PENDING'
                      ? `অপেক্ষমাণ (${orders.filter((o) => o.status === 'PENDING').length})`
                      : st === 'PAID'
                      ? `অনুমোদিত (${orders.filter((o) => o.status === 'PAID').length})`
                      : `বাতিল (${orders.filter((o) => o.status === 'CANCELLED').length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase text-slate-400 font-bold">
                    <tr>
                      <th className="p-3.5 pl-5">অর্ডার নম্বর</th>
                      <th className="p-3.5">তারিখ</th>
                      <th className="p-3.5">শিক্ষার্থী</th>
                      <th className="p-3.5">গেটওয়ে</th>
                      <th className="p-3.5">Trx ID</th>
                      <th className="p-3.5">মোট মূল্য</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 pr-5 text-right">অ্যাকশন (অনুমোদন / ইনভয়েস)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400">
                          কোনো অর্ডার পাওয়া যায়নি
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const isPending = ord.status === 'PENDING';
                        const isPaid = ord.status === 'PAID';
                        const isCopied = copiedTrxId === (ord.transactionId || 'SANDBOX-TRX');
                        return (
                          <tr
                            key={ord.id}
                            className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                              isPending ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                            }`}
                          >
                            <td className="p-3.5 pl-5 font-mono font-bold text-slate-900 dark:text-white">
                              {ord.orderNumber}
                            </td>
                            <td className="p-3.5 text-slate-500 whitespace-nowrap">
                              {new Date(ord.createdAt).toLocaleDateString('bn-BD', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="p-3.5">
                              <p className="font-bold text-slate-900 dark:text-white">
                                {ord.user?.name || 'Student'}
                              </p>
                              <span className="text-[10px] text-slate-400 block">{ord.user?.email}</span>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold inline-flex items-center ${
                                ord.paymentMethod?.toLowerCase().includes('bkash')
                                  ? 'bg-pink-100 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300'
                                  : ord.paymentMethod?.toLowerCase().includes('nagad')
                                  ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}>
                                {ord.paymentMethod}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="inline-flex items-center gap-1.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                                <span>{ord.transactionId || 'SANDBOX-TRX'}</span>
                                <button
                                  onClick={() => {
                                    const trx = ord.transactionId || 'SANDBOX-TRX';
                                    navigator.clipboard.writeText(trx);
                                    setCopiedTrxId(trx);
                                    setTimeout(() => setCopiedTrxId(null), 2000);
                                  }}
                                  title="Trx ID কপি করুন"
                                  className="text-slate-400 hover:text-emerald-600 cursor-pointer"
                                >
                                  {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            </td>
                            <td className="p-3.5 font-extrabold text-emerald-600 dark:text-emerald-400">
                              ৳{(ord.total ?? 0).toLocaleString()}
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                  isPaid
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/30'
                                    : isPending
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/40'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                }`}
                              >
                                {isPending && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                {isPaid && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                {isPending ? 'অপেক্ষমাণ' : isPaid ? 'অনুমোদিত' : ord.status}
                              </span>
                            </td>
                            <td className="p-3.5 pr-5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {isPending && (
                                  <button
                                    onClick={() => handleApproveOrder(ord.id)}
                                    disabled={approvingOrderId === ord.id}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
                                    title="পেমেন্ট যাচাই করে অর্ডার অনুমোদন ও কোর্স এনরোলমেন্ট দিন"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>অনুমোদন</span>
                                  </button>
                                )}

                                {isPending && (
                                  <button
                                    onClick={() => handleCancelOrder(ord.id)}
                                    className="px-2 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[11px] font-bold transition-all cursor-pointer"
                                    title="অর্ডার বাতিল করুন"
                                  >
                                    বাতিল
                                  </button>
                                )}

                                <button
                                  onClick={() => setSelectedInvoiceOrder(ord)}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                  title="অফিসিয়াল ইনভয়েস দেখুন এবং ডাউনলোড করুন"
                                >
                                  <Printer className="w-3 h-3 text-slate-500" />
                                  <span>ইনভয়েস</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Live Chat & Support Messages */}
        {activeTab === 'messages' && (
          <AdminMessagesSection
            token={token}
            adminName={user?.name}
            onRefreshUnreadCount={fetchUnreadMessagesCount}
          />
        )}

        {/* Tab: SMS & Support Reports (Dedicated View) */}
        {activeTab === 'sms-report' && (
          <AdminSupportReportSection
            token={token}
            onNavigateToChat={(convId) => {
              setActiveTab('messages');
            }}
          />
        )}

        {/* Tab: Notice Management */}
        {activeTab === 'notices' && (
          <NoticeManagementSection isAdmin={true} courses={courses} />
        )}

        {/* Tab 6: Coupons */}
        {activeTab === 'coupons' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  ডিসকাউন্ট কুপন কোড ({coupons.length})
                </h3>
                <p className="text-xs text-slate-500">বিশেষ অফার ও ক্যাম্পেইনের জন্য কুপন তৈরি করুন</p>
              </div>
              <button
                onClick={() => setIsNewCouponModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন কুপন যোগ করুন</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase text-slate-400 font-bold">
                  <tr>
                    <th className="p-3.5 pl-5">কুপন কোড</th>
                    <th className="p-3.5">ডিসকাউন্ট টাইপ</th>
                    <th className="p-3.5">ছাড়ের মান</th>
                    <th className="p-3.5">সর্বনিম্ন অর্ডার</th>
                    <th className="p-3.5">ব্যবহার সংখ্যা</th>
                    <th className="p-3.5 pr-5">মেয়াদ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {coupons.map((cp) => (
                    <tr key={cp.id}>
                      <td className="p-3.5 pl-5 font-mono font-black text-emerald-600 dark:text-emerald-400">
                        {cp.code}
                      </td>
                      <td className="p-3.5">{cp.discountType}</td>
                      <td className="p-3.5 font-bold">
                        {cp.discountType === 'PERCENTAGE' ? `${cp.discountValue}%` : `৳${cp.discountValue}`}
                      </td>
                      <td className="p-3.5">৳{cp.minOrderAmount}</td>
                      <td className="p-3.5">{cp.usedCount} জন</td>
                      <td className="p-3.5 pr-5 text-slate-500">
                        {new Date(cp.validUntil).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 7: Certificates */}
        {activeTab === 'certificates' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                ইস্যুকৃত ডিজিটাল সার্টিফিকেট তালিকা ({certificates.length})
              </h3>
              <p className="text-xs text-slate-500">ভেরিফায়েড কিউআর কোডসহ সার্টিফিকেট ম্যানেজ করুন</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase text-slate-400 font-bold">
                  <tr>
                    <th className="p-3.5 pl-5">সার্টিফিকেট আইডি</th>
                    <th className="p-3.5">শিক্ষার্থী</th>
                    <th className="p-3.5">কোর্স</th>
                    <th className="p-3.5">ইস্যু তারিখ</th>
                    <th className="p-3.5">স্ট্যাটাস</th>
                    <th className="p-3.5 pr-5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {certificates.map((cert) => (
                    <tr key={cert.id}>
                      <td className="p-3.5 pl-5 font-mono font-bold text-slate-900 dark:text-white">
                        {cert.certificateNumber}
                      </td>
                      <td className="p-3.5">{cert.studentName}</td>
                      <td className="p-3.5 max-w-xs truncate">{cert.courseTitle}</td>
                      <td className="p-3.5 text-slate-500">
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cert.status === 'VALID'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {cert.status}
                        </span>
                      </td>
                      <td className="p-3.5 pr-5 text-right">
                        <button
                          onClick={() => handleToggleCertStatus(cert.id, cert.status)}
                          className="text-xs text-indigo-600 hover:underline font-bold"
                        >
                          {cert.status === 'VALID' ? 'বাতিল করুন' : 'পুনরায় সক্রিয় করুন'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 8: Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-4xl">
            {/* Supabase PostgreSQL Database Integration Panel */}
            <AdminDatabaseSettings />

            <div className="max-w-2xl bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                প্ল্যাটফর্ম সেটিংস ও পেমেন্ট কনফিগারেশন
              </h3>

              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">প্ল্যাটফর্মের নাম</label>
                  <input
                    type="text"
                    defaultValue="SkillNest Academy"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">সাপোর্ট ইমেইল</label>
                  <input
                    type="email"
                    defaultValue="support@skillnest.academy"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-medium"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    বাংলাদেশ পেমেন্ট গেটওয়ে স্ট্যাটাস
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-bold">
                      <span>bKash (বিকাশ) Merchant Gateway</span>
                      <span className="text-emerald-600 text-xs">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-bold">
                      <span>Nagad (নগদ) Merchant Gateway</span>
                      <span className="text-emerald-600 text-xs">Active</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toastSuccess('সেটিংস সফলভাবে সংরক্ষিত হয়েছে!')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                >
                  সেটিংস সেভ করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>

      {/* Official Invoice Modal (View & Download) */}
      {selectedInvoiceOrder && (
        <OfficialInvoice
          order={selectedInvoiceOrder}
          isModal={true}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {/* Modal: Create Coupon */}
      {isNewCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                নতুন ডিসকাউন্ট কুপন তৈরি করুন
              </h3>
              <button
                onClick={() => setIsNewCouponModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCouponSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">কুপন কোড</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. BOISHAKH2026"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase outline-none font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">টাইপ</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold"
                  >
                    <option value="PERCENTAGE">শতকরা (%)</option>
                    <option value="FIXED">টাকা (৳)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">ডিসকাউন্ট মান</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">সর্বনিম্ন অর্ডার (৳)</label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCouponModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
