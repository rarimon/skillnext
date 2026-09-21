import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  DollarSign,
  Award,
  FileCheck,
  Video,
  Search,
  Filter,
  Download,
  Printer,
  ChevronDown,
  Eye,
  ExternalLink,
  GraduationCap,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  ArrowUpDown,
  RefreshCw,
  FileText,
  CreditCard,
  Phone,
  Mail,
  ShieldCheck,
  HelpCircle,
  Radio,
  Layers
} from 'lucide-react';
import { Course, Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { OfficialInvoice } from './OfficialInvoice';

interface CourseReportData {
  course: {
    id: string;
    title: string;
    titleBn?: string;
    slug: string;
    thumbnail: string;
    price: number;
    discountPrice?: number;
    categoryName: string;
    instructor?: {
      name: string;
      avatar?: string;
    };
    modulesCount: number;
    lessonsCount: number;
    isPublished: boolean;
  };
  stats: {
    totalStudents: number;
    totalSalesRevenue: number;
    paidOrdersCount: number;
    pendingOrdersCount: number;
    totalExamsCount: number;
    totalExamAttempts: number;
    passRate: number;
    averageExamScore: number;
    liveClassesCount: number;
  };
  exams: any[];
  liveClasses: any[];
  enrolledStudents: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    orderNumber: string;
    orderId?: string;
    amountPaid: number;
    paymentMethod: string;
    transactionId: string;
    paymentStatus: string;
    enrolledAt: string;
    completionPercentage: number;
  }[];
  studentExamResults: {
    id: string;
    examId: string;
    examTitle: string;
    userId: string;
    userName: string;
    userEmail: string;
    score: number;
    totalQuestions: number;
    correctAnswersCount: number;
    passed: boolean;
    submittedAt: string;
  }[];
}

interface AdminCourseFullReportProps {
  initialCourseId?: string;
  onNavigateToCourseEdit?: (courseId: string) => void;
  onNavigateToExams?: (courseId: string) => void;
}

export const AdminCourseFullReport: React.FC<AdminCourseFullReportProps> = ({
  initialCourseId,
  onNavigateToCourseEdit,
  onNavigateToExams
}) => {
  const { token } = useAuth();
  const { language } = useLanguage();
  const { error: toastError, success: toastSuccess } = useToast();

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<CourseReportData[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId || '');
  
  // Tabs within the course report
  const [activeReportTab, setActiveReportTab] = useState<'students' | 'exams' | 'live' | 'curriculum'>('students');

  // Filters for Students & Sales Tab
  const [studentSearch, setStudentSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');

  // Filters for Exams Tab
  const [examResultFilter, setExamResultFilter] = useState<'ALL' | 'PASSED' | 'FAILED'>('ALL');
  const [examSearch, setExamSearch] = useState('');

  // Invoice modal view
  const [viewInvoiceOrder, setViewInvoiceOrder] = useState<Order | null>(null);

  // Fetch report data from server
  const fetchReportData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/course-reports', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error('Failed to load course reports');
      const data = await res.json();
      setReports(data.reports || []);

      // If no course is selected yet, select the first course or initialCourseId
      if (!selectedCourseId && data.reports?.length > 0) {
        const found = initialCourseId
          ? data.reports.find((r: CourseReportData) => r.course.id === initialCourseId)
          : null;
        setSelectedCourseId(found ? found.course.id : data.reports[0].course.id);
      }
    } catch (err: any) {
      toastError(language === 'bn' ? 'রিপোর্ট লোড করা যায়নি' : 'Failed to fetch course reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [token]);

  // Update selected course if initialCourseId changes externally
  useEffect(() => {
    if (initialCourseId && initialCourseId !== selectedCourseId) {
      setSelectedCourseId(initialCourseId);
    }
  }, [initialCourseId]);

  // Currently active course report
  const currentReport = reports.find((r) => r.course.id === selectedCourseId) || reports[0];

  // Filtered Students
  const filteredStudents = (currentReport?.enrolledStudents || []).filter((stu) => {
    const matchesSearch =
      stu.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      stu.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      stu.phone.toLowerCase().includes(studentSearch.toLowerCase()) ||
      stu.orderNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
      stu.transactionId.toLowerCase().includes(studentSearch.toLowerCase());
    
    const matchesPayment =
      paymentFilter === 'ALL' || stu.paymentStatus.toUpperCase() === paymentFilter;

    return matchesSearch && matchesPayment;
  });

  // Filtered Exam Submissions
  const filteredExamResults = (currentReport?.studentExamResults || []).filter((res) => {
    const matchesSearch =
      res.userName.toLowerCase().includes(examSearch.toLowerCase()) ||
      res.userEmail.toLowerCase().includes(examSearch.toLowerCase()) ||
      res.examTitle.toLowerCase().includes(examSearch.toLowerCase());

    const matchesResult =
      examResultFilter === 'ALL' ||
      (examResultFilter === 'PASSED' && res.passed) ||
      (examResultFilter === 'FAILED' && !res.passed);

    return matchesSearch && matchesResult;
  });

  // Calculate gross metrics
  const totalRevenueAllCourses = reports.reduce((sum, r) => sum + r.stats.totalSalesRevenue, 0);
  const totalStudentsAllCourses = reports.reduce((sum, r) => sum + r.stats.totalStudents, 0);

  // Helper to open student order invoice
  const handleOpenInvoice = (stu: any) => {
    const mockOrder: Order = {
      id: stu.orderId || `ord-${stu.id}`,
      orderNumber: stu.orderNumber,
      userId: stu.id,
      user: {
        name: stu.name,
        email: stu.email,
        phone: stu.phone
      },
      items: [
        {
          id: `item-${currentReport.course.id}`,
          courseId: currentReport.course.id,
          courseTitle: currentReport.course.titleBn || currentReport.course.title,
          courseSlug: currentReport.course.slug,
          thumbnail: currentReport.course.thumbnail,
          price: stu.amountPaid
        }
      ],
      subtotal: stu.amountPaid,
      discount: 0,
      total: stu.amountPaid,
      paymentMethod: stu.paymentMethod as any,
      transactionId: stu.transactionId,
      orderStatus: stu.paymentStatus as any,
      paymentStatus: 'SUCCESS',
      createdAt: stu.enrolledAt
    };
    setViewInvoiceOrder(mockOrder);
  };

  // Print report trigger
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-xs">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {language === 'bn' ? 'কোর্স ভিত্তিক পূর্ণাঙ্গ রিপোর্ট লোড হচ্ছে...' : 'Loading comprehensive course report...'}
        </p>
      </div>
    );
  }

  if (!currentReport) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
        <p className="text-sm text-slate-500">
          {language === 'bn' ? 'কোনো কোর্সের ডাটা পাওয়া যায়নি।' : 'No course data found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Card: Course Selector & Global Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Title & Badge */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40">
                {language === 'bn' ? 'সুপার এডমিন অ্যানালিটিক্স' : 'Super Admin Analytics'}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">
                {language === 'bn' ? 'রিয়েলটাইম সেলস, এনরোলমেন্ট ও পরীক্ষার রিপোর্ট' : 'Real-time Sales, Students & Exams'}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'bn' ? 'কোর্স ভিত্তিক পূর্ণাঙ্গ রিপোর্ট ও অ্যানালিটিক্স' : 'Course-Wise Comprehensive Report'}</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
              {language === 'bn'
                ? 'যেকোনো নির্দিষ্ট কোর্সের মোট ভর্তি শিক্ষার্থী, সর্বমোট সেলস রেভিনিউ, পরীক্ষার ফলাফল, কুইজ পারফরম্যান্স এবং লাইভ ক্লাসের হিসেব এক নজরে দেখুন।'
                : 'Select any course to view full financial sales, student enrollment rosters, exam participation, scores, and live sessions.'}
            </p>
          </div>

          {/* Course Selector Dropdown & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Course Selector Dropdown */}
            <div className="relative min-w-[280px]">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                {language === 'bn' ? 'কোর্স নির্বাচন করুন:' : 'Select Course:'}
              </label>
              <div className="relative">
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none shadow-xs"
                >
                  {reports.map((r) => (
                    <option key={r.course.id} value={r.course.id}>
                      {r.course.titleBn || r.course.title} ({r.stats.totalStudents} জন শিক্ষার্থী)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Print / Export Button */}
            <div className="flex items-center gap-2 self-end sm:self-auto sm:mt-5">
              <button
                type="button"
                onClick={handlePrint}
                className="p-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                title={language === 'bn' ? 'রিপোর্ট প্রিন্ট বা পিডিএফ সেভ করুন' : 'Print or save report PDF'}
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">{language === 'bn' ? 'প্রিন্ট রিপোর্ট' : 'Print'}</span>
              </button>

              <button
                type="button"
                onClick={fetchReportData}
                className="p-2.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1.5"
                title={language === 'bn' ? 'রিপোর্ট রিফ্রেশ করুন' : 'Refresh report'}
              >
                <RefreshCw className="w-4 h-4 text-emerald-600" />
              </button>
            </div>

          </div>
        </div>

        {/* Selected Course Quick Profile Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={currentReport.course.thumbnail}
              alt={currentReport.course.title}
              className="w-14 h-11 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {currentReport.course.categoryName}
                </span>
                <span className="text-[11px] text-slate-400">ID: {currentReport.course.id}</span>
              </div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                {currentReport.course.titleBn || currentReport.course.title}
              </h2>
              <p className="text-[11px] text-slate-500">
                ইন্সট্রাক্টর: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentReport.course.instructor?.name || 'অ্যাসাইনকৃত ট্রেইনার'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onNavigateToCourseEdit && (
              <button
                type="button"
                onClick={() => onNavigateToCourseEdit(currentReport.course.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {language === 'bn' ? 'কোর্স এডিট' : 'Edit Course'}
              </button>
            )}

            {onNavigateToExams && (
              <button
                type="button"
                onClick={() => onNavigateToExams(currentReport.course.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 transition-colors"
              >
                {language === 'bn' ? 'পরীক্ষা তৈরি / ম্যানেজ' : 'Manage Exams'}
              </button>
            )}

            <a
              href={`/course/${currentReport.course.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
            >
              <span>{language === 'bn' ? 'কোর্স পেজ' : 'Public Page'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        
        {/* Card 1: Enrolled Students */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">{language === 'bn' ? 'মোট শিক্ষার্থী' : 'Enrolled'}</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {currentReport.stats.totalStudents.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {language === 'bn' ? 'এই কোর্সে নিবন্ধিত' : 'Active learners'}
          </p>
        </div>

        {/* Card 2: Total Sales Revenue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">{language === 'bn' ? 'মোট সেলস' : 'Revenue'}</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            ৳{currentReport.stats.totalSalesRevenue.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {language === 'bn' ? 'সর্বমোট আদায়কৃত ফি' : 'Total gross revenue'}
          </p>
        </div>

        {/* Card 3: Paid Orders */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">{language === 'bn' ? 'পেইড অর্ডার' : 'Paid Orders'}</span>
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {currentReport.stats.paidOrdersCount}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            পেন্ডিং: <span className="text-amber-500 font-bold">{currentReport.stats.pendingOrdersCount} টি</span>
          </p>
        </div>

        {/* Card 4: Total Exams & Quizzes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">{language === 'bn' ? 'কোর্স পরীক্ষা' : 'Exams'}</span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {currentReport.stats.totalExamsCount} টি
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            অংশগ্রহণ: <span className="font-bold text-slate-700 dark:text-slate-300">{currentReport.stats.totalExamAttempts} বার</span>
          </p>
        </div>

        {/* Card 5: Pass Rate */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">{language === 'bn' ? 'পাসের হার' : 'Pass Rate'}</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
            {currentReport.stats.passRate}%
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {language === 'bn' ? 'শিক্ষার্থীদের সাফল্যের হার' : 'Student pass ratio'}
          </p>
        </div>

        {/* Card 6: Average Exam Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">{language === 'bn' ? 'গড় স্কোর' : 'Avg Score'}</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400">
            {currentReport.stats.averageExamScore}%
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            লাইভ ক্লাস: <span className="font-bold text-slate-700 dark:text-slate-300">{currentReport.stats.liveClassesCount} টি</span>
          </p>
        </div>

      </div>

      {/* Deep-Dive Sub-Tabs Navigation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          
          <button
            type="button"
            onClick={() => setActiveReportTab('students')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeReportTab === 'students'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{language === 'bn' ? 'শিক্ষার্থী ও সেলস এনরোলমেন্ট রিপোর্ট' : 'Students & Sales Roster'}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeReportTab === 'students' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {currentReport.enrolledStudents.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveReportTab('exams')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeReportTab === 'exams'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{language === 'bn' ? 'পরীক্ষা ও ফলাফল রিপোর্ট' : 'Exams & Scorecard'}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeReportTab === 'exams' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {currentReport.studentExamResults.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveReportTab('live')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeReportTab === 'live'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{language === 'bn' ? 'লাইভ ক্লাস ও জুম শিডিউল' : 'Live Classes'}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeReportTab === 'live' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {currentReport.liveClasses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveReportTab('curriculum')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeReportTab === 'curriculum'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{language === 'bn' ? 'কারিকুলাম ও কনটেন্ট ওভারভিউ' : 'Curriculum & Lessons'}</span>
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ENROLLED STUDENTS & FINANCIAL SALES REPORT                        */}
      {/* ========================================================================= */}
      {activeReportTab === 'students' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="শিক্ষার্থীর নাম, ইমেইল, ফোন অথবা ট্রানজেকশন আইডি..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">{language === 'bn' ? 'স্ট্যাটাস:' : 'Status:'}</span>
              <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                {(['ALL', 'PAID', 'PENDING'] as const).map((filterVal) => (
                  <button
                    key={filterVal}
                    type="button"
                    onClick={() => setPaymentFilter(filterVal)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      paymentFilter === filterVal
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {filterVal === 'ALL' ? 'সব' : filterVal === 'PAID' ? 'পরিশোধিত' : 'পেন্ডিং'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-4">{language === 'bn' ? 'শিক্ষার্থী' : 'Student'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'অর্ডার ও ট্রানজেকশন' : 'Order & TrxID'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'পরিশোধিত ফি' : 'Amount Paid'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'ভর্তির তারিখ' : 'Enrolled Date'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'কোর্স অগ্রগতি' : 'Progress'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'পেমেন্ট স্ট্যাটাস' : 'Status'}</th>
                  <th className="py-3 px-4 text-right">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      {language === 'bn' ? 'কোনো শিক্ষার্থী পাওয়া যায়নি।' : 'No students found.'}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((stu) => (
                    <tr key={stu.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      
                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">
                            {stu.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {stu.name}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                {stu.email}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {stu.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Order & Transaction */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block text-xs">
                          {stu.orderNumber}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 font-mono">
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            {stu.paymentMethod}
                          </span>
                          <span>Trx: {stu.transactionId}</span>
                        </div>
                      </td>

                      {/* Amount Paid */}
                      <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        ৳{stu.amountPaid.toLocaleString()}
                      </td>

                      {/* Enrolled Date */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                        {new Date(stu.enrolledAt).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>

                      {/* Completion Progress */}
                      <td className="py-3.5 px-4">
                        <div className="w-24">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                            <span>{stu.completionPercentage}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${stu.completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                          stu.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{stu.paymentStatus === 'PAID' ? 'পরিশোধিত' : 'পেন্ডিং'}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenInvoice(stu)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title={language === 'bn' ? 'অফিসিয়াল ইনভয়েস দেখুন' : 'View Invoice'}
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>{language === 'bn' ? 'ইনভয়েস' : 'Invoice'}</span>
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Summary */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>
              মোট দেখানো হচ্ছে: <strong className="text-slate-800 dark:text-slate-200">{filteredStudents.length}</strong> জন শিক্ষার্থী
            </span>
            <span>
              ফিল্টারকৃত মোট সেলস: <strong className="text-emerald-600 font-extrabold">৳{filteredStudents.reduce((acc, s) => acc + s.amountPaid, 0).toLocaleString()}</strong>
            </span>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EXAMS & STUDENT SCORECARD REPORT                                   */}
      {/* ========================================================================= */}
      {activeReportTab === 'exams' && (
        <div className="space-y-6">
          
          {/* Exams Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentReport.exams.map((ex: any) => (
              <div
                key={ex.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                      কোর্স পরীক্ষা ID: {ex.id}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                      {ex.title}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    ex.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {ex.isPublished ? 'সক্রিয়' : 'ড্রাফট'}
                  </span>
                </div>

                <p className="text-xs text-slate-500">{ex.description || 'শিক্ষার্থীদের মেধা যাচাই ও প্র্যাকটিক্যাল পরীক্ষা।'}</p>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">মোট প্রশ্ন</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{ex.questions?.length || 0} টি</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">সময়সীমা</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{ex.durationMinutes} মিনিট</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">পাস মার্ক</span>
                    <span className="font-extrabold text-emerald-600">{ex.passingScore}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">মোট মার্কস: <strong>{ex.totalMarks || 50} নম্বর</strong></span>
                  {onNavigateToExams && (
                    <button
                      type="button"
                      onClick={() => onNavigateToExams(currentReport.course.id)}
                      className="text-emerald-600 hover:text-emerald-700 font-bold text-xs cursor-pointer"
                    >
                      {language === 'bn' ? 'প্রশ্নপত্র দেখুন / সম্পাদনা' : 'Edit Questions'} →
                    </button>
                  )}
                </div>
              </div>
            ))}
            {currentReport.exams.length === 0 && (
              <div className="col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
                <Award className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {language === 'bn' ? 'এই কোর্সে এখনও কোনো পরীক্ষা তৈরি করা হয়নি।' : 'No exams created for this course yet.'}
                </p>
                {onNavigateToExams && (
                  <button
                    type="button"
                    onClick={() => onNavigateToExams(currentReport.course.id)}
                    className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                  >
                    {language === 'bn' ? '+ নতুন পরীক্ষা ও প্রশ্ন তৈরি করুন' : '+ Create Exam & Questions'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Student Exam Results Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {language === 'bn' ? 'শিক্ষার্থীদের পরীক্ষার বিস্তারিত ফলাফল' : 'Student Exam Results & Scorecard'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'কে কত স্কোর পেয়েছে এবং কে পাস বা ফেল করেছে তার তালিকা' : 'Student scores, correct answers, pass/fail status and submission times'}
                </p>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={examSearch}
                  onChange={(e) => setExamSearch(e.target.value)}
                  placeholder="শিক্ষার্থী বা পরীক্ষার নাম..."
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none"
                />
                <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                  {(['ALL', 'PASSED', 'FAILED'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setExamResultFilter(v)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                        examResultFilter === v
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {v === 'ALL' ? 'সব' : v === 'PASSED' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 font-extrabold uppercase tracking-wider">
                    <th className="py-3 px-4">{language === 'bn' ? 'শিক্ষার্থী' : 'Student'}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'পরীক্ষার নাম' : 'Exam Title'}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'প্রাপ্ত স্কোর' : 'Score'}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'সঠিক উত্তর' : 'Correct / Total'}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'ফলাফল' : 'Result'}</th>
                    <th className="py-3 px-4 text-right">{language === 'bn' ? 'জমাদানের সময়' : 'Submitted At'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredExamResults.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        {language === 'bn' ? 'কোনো পরীক্ষার ফলাফল রেকর্ড পাওয়া যায়নি।' : 'No exam submissions found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredExamResults.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 dark:text-white block">{sub.userName}</span>
                          <span className="text-[11px] text-slate-500">{sub.userEmail}</span>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {sub.examTitle}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`text-sm font-black ${
                            sub.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            {sub.score}%
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                          {sub.correctAnswersCount} / {sub.totalQuestions} টি
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            sub.passed
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                          }`}>
                            {sub.passed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            <span>{sub.passed ? 'উত্তীর্ণ (Passed)' : 'অনুত্তীর্ণ (Failed)'}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right text-slate-500 text-xs">
                          {new Date(sub.submittedAt).toLocaleDateString('bn-BD', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
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

      {/* ========================================================================= */}
      {/* TAB 3: LIVE CLASSES & ZOOM SCHEDULE                                       */}
      {/* ========================================================================= */}
      {activeReportTab === 'live' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'bn' ? 'কোর্সের লাইভ ক্লাস ও জুম সেশনসমূহ' : 'Course Live Classes & Zoom Sessions'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'শিডিউলকৃত ও সম্পন্নকৃত লাইভ ক্লাসের তালিকা ও জয়েন লিংক' : 'Scheduled and past live zoom links'}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black text-xs">
              মোট: {currentReport.liveClasses.length} টি সেশন
            </span>
          </div>

          <div className="space-y-3">
            {currentReport.liveClasses.map((lc: any) => (
              <div
                key={lc.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      lc.status === 'LIVE'
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : lc.status === 'COMPLETED'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {lc.status === 'LIVE' ? '🔴 লাইভ চলছে' : lc.status === 'COMPLETED' ? 'সম্পন্ন' : 'শিডিউলকৃত'}
                    </span>
                    <span className="text-xs text-slate-400">তারিখ: {lc.scheduledDate} ({lc.scheduledTime})</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {lc.topic}
                  </h4>
                  <p className="text-xs text-slate-500">{lc.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right text-xs text-slate-600 dark:text-slate-400">
                    <div>Meeting ID: <span className="font-mono font-bold">{lc.meetingId || 'N/A'}</span></div>
                    {lc.passcode && <div>Passcode: <span className="font-mono font-bold">{lc.passcode}</span></div>}
                  </div>
                  {lc.zoomJoinUrl && (
                    <a
                      href={lc.zoomJoinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'জুমে যান' : 'Join Zoom'}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
            {currentReport.liveClasses.length === 0 && (
              <p className="text-center py-8 text-xs text-slate-400">
                {language === 'bn' ? 'এই কোর্সের জন্য এখনও কোনো লাইভ ক্লাস শিডিউল করা হয়নি।' : 'No live classes scheduled for this course yet.'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CURRICULUM & LESSONS OVERVIEW                                      */}
      {/* ========================================================================= */}
      {activeReportTab === 'curriculum' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'bn' ? 'কোর্স কারিকুলাম ও মডিউল স্ট্রাকচার' : 'Curriculum Structure & Content Metrics'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'এই কোর্সের মডিউল সংখ্যা, পাঠ ও রিসোর্স ওভারভিউ' : 'Total modules, lessons and structure'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>মোট মডিউল: <strong className="text-emerald-600">{currentReport.course.modulesCount} টি</strong></span>
              <span>•</span>
              <span>মোট ক্লাস: <strong className="text-emerald-600">{currentReport.course.lessonsCount} টি</strong></span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p>
              <strong>কোর্স টাইটেল:</strong> {currentReport.course.titleBn || currentReport.course.title}
            </p>
            <p>
              <strong>কোর্স প্রাইসিং:</strong> রেগুলার ফি ৳{currentReport.course.price.toLocaleString()} | ডিসকাউন্ট ফি ৳{(currentReport.course.discountPrice || currentReport.course.price).toLocaleString()}
            </p>
            <p>
              <strong>স্ট্যাটাস:</strong> {currentReport.course.isPublished ? 'পাবলিশড ও লাইভ' : 'ড্রাফট'}
            </p>
          </div>
        </div>
      )}

      {/* Official Invoice Modal if triggered */}
      {viewInvoiceOrder && (
        <OfficialInvoice
          order={viewInvoiceOrder}
          onClose={() => setViewInvoiceOrder(null)}
        />
      )}

    </div>
  );
};
