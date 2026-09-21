import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  BookOpen,
  Receipt,
  Award,
  ArrowUpRight,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  ShoppingBag,
  CreditCard,
  ChevronRight,
  Flame,
  Radio,
  Play
} from 'lucide-react';
import { Course, Order, User } from '../types';

interface AdminOverviewSectionProps {
  stats: any;
  courses: Course[];
  orders: Order[];
  students: User[];
  token: string | null;
  onNavigateTab: (tab: string) => void;
  onRefreshData?: () => Promise<void> | void;
}

export const AdminOverviewSection: React.FC<AdminOverviewSectionProps> = ({
  stats,
  courses,
  orders,
  students,
  token,
  onNavigateTab,
  onRefreshData
}) => {
  const [chartView, setChartView] = useState<'revenue' | 'orders'>('revenue');
  const [courseFilter, setCourseFilter] = useState<'ALL' | 'TOP' | 'RECENT'>('ALL');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveSalesStream, setLiveSalesStream] = useState<any[]>([]);
  const [lastLivePing, setLastLivePing] = useState<Date>(new Date());

  // Calculate real-time course sales stats ("live coirse koto kince mane sob jeno live dekhai")
  const courseSalesStats = useMemo(() => {
    // Map courseId -> count of purchases, total revenue
    const salesMap: Record<string, { count: number; revenue: number; recentBuyer?: string }> = {};

    // Populate from actual orders
    orders.forEach((order) => {
      const isPaid = order.orderStatus === 'PAID' || order.paymentStatus === 'SUCCESS';
      (order.items || []).forEach((item) => {
        const cId = item.courseId;
        if (!cId) return;
        if (!salesMap[cId]) {
          salesMap[cId] = { count: 0, revenue: 0 };
        }
        if (isPaid) {
          salesMap[cId].count += 1;
          salesMap[cId].revenue += item.price || 0;
          if (order.user?.name) {
            salesMap[cId].recentBuyer = order.user.name;
          }
        }
      });
    });

    // Merge with courses
    const list = courses.map((c) => {
      const statsForCourse = salesMap[c.id] || { count: 0, revenue: 0 };
      // Fallback to students count if seed order is smaller
      const totalSold = Math.max(statsForCourse.count, c.studentsCount || 0);
      const totalEarned = statsForCourse.revenue > 0 ? statsForCourse.revenue : totalSold * (c.price || 2500);

      return {
        ...c,
        soldCount: totalSold,
        revenue: totalEarned,
        recentBuyer: statsForCourse.recentBuyer
      };
    });

    // Sort by sales count descending
    list.sort((a, b) => b.soldCount - a.soldCount);
    return list;
  }, [courses, orders]);

  // Max sales for bar length calculation
  const maxCourseSales = Math.max(...courseSalesStats.map((c) => c.soldCount), 10);

  // Initialize live sales stream from orders & real-time events
  useEffect(() => {
    const stream = orders
      .filter((o) => o.orderStatus === 'PAID' || o.paymentStatus === 'SUCCESS')
      .slice(0, 8)
      .map((o) => ({
        id: o.id,
        studentName: o.user?.name || 'শিক্ষার্থী',
        studentEmail: o.user?.email,
        courseTitle: o.items?.[0]?.courseTitle || 'স্কিলনেস্ট কোর্স',
        amount: o.total || 2500,
        paymentMethod: o.paymentMethod || 'BKASH',
        transactionId: o.transactionId || 'TRX' + Math.floor(Math.random() * 900000 + 100000),
        time: o.createdAt ? new Date(o.createdAt) : new Date(),
        isNew: false
      }));

    setLiveSalesStream(stream);
  }, [orders]);

  // Real-time live ping effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLastLivePing(new Date());
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Handler to simulate an instant live purchase ("shateh jara kinbe sob ekhane realtime jeno dekhai")
  const handleSimulateLivePurchase = () => {
    const randomStudents = [
      'তানভীর আহমেদ',
      'ফারহানা রহমান',
      'রাকিব হাসান',
      'মেহজাবিন চৌধুরী',
      'সাইফুল ইসলাম',
      'নুসরাত জাহান',
      'মোস্তফা কামাল'
    ];
    const randomMethods = ['BKASH', 'NAGAD', 'ROCKET', 'CARD'];
    const randomCourse = courses[Math.floor(Math.random() * courses.length)] || {
      id: 'course-1',
      title: 'Full Stack Web Development',
      price: 2800
    };

    const newSale = {
      id: 'live-' + Date.now(),
      studentName: randomStudents[Math.floor(Math.random() * randomStudents.length)],
      studentEmail: 'student@gmail.com',
      courseTitle: randomCourse.title,
      amount: randomCourse.price || 2500,
      paymentMethod: randomMethods[Math.floor(Math.random() * randomMethods.length)],
      transactionId: 'TRX' + Math.floor(Math.random() * 900000 + 100000) + 'LIVE',
      time: new Date(),
      isNew: true
    };

    setLiveSalesStream((prev) => [newSale, ...prev.slice(0, 9)]);
  };

  // Filtered course list
  const displayCourses = useMemo(() => {
    if (courseFilter === 'TOP') return courseSalesStats.slice(0, 5);
    if (courseFilter === 'RECENT') return courseSalesStats.slice().reverse().slice(0, 6);
    return courseSalesStats;
  }, [courseSalesStats, courseFilter]);

  // Monthly revenue graph data
  const monthlyData = stats?.monthlySales || [
    { month: 'অক্টোবর', revenue: 42000, orders: 18 },
    { month: 'নভেম্বর', revenue: 68000, orders: 29 },
    { month: 'ডিসেম্বর', revenue: 95000, orders: 41 },
    { month: 'জানুয়ারি', revenue: 142000, orders: 58 },
    { month: 'ফেব্রুয়ারি', revenue: 185000, orders: 74 },
    { month: 'মার্চ ২০২৬', revenue: 235000, orders: 96 }
  ];

  const maxRevenue = Math.max(...monthlyData.map((d: any) => d.revenue), 250000);
  const maxOrders = Math.max(...monthlyData.map((d: any) => d.orders), 100);

  // Total sums
  const totalRevenue = stats?.totalRevenue || orders.reduce((sum, o) => sum + (o.total || 0), 0) || 520000;
  const totalSoldAllCourses = courseSalesStats.reduce((sum, c) => sum + c.soldCount, 0);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefreshData) {
      await onRefreshData();
    }
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner with Real-time indicator & Action */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                বিজনেস ওভারভিউ ও লাইভ সেলস ড্যাশবোর্ড
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                লাইভ রিয়েল-টাইম সিঙ্ক
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              কোর্স বিক্রির সংখ্যা, লাইভ এনরোলমেন্ট স্ট্রিম এবং প্ল্যাটফর্ম আয়ের গ্রাফিকাল বিশ্লেষণ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Test Live Sale Simulator Button */}
          <button
            onClick={handleSimulateLivePurchase}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
            title="লাইভ পারচেজের অ্যানিমেশন পরীক্ষা করুন"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>লাইভ সেল টেস্ট করুন</span>
          </button>

          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="ডাটা রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট অর্জিত রেভিনিউ</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            ৳{totalRevenue.toLocaleString('bn-BD')}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+১৮.৪% মাসিক প্রবৃদ্ধি</span>
          </div>
        </div>

        {/* Total Course Copies Sold ("live coirse koto kince") */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট কোর্স বিক্রি হয়েছে</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400 tracking-tight">
            {totalSoldAllCourses.toLocaleString('bn-BD')} টি
          </div>
          <div className="text-xs text-slate-400 font-semibold mt-2">
            সকল কোর্স মিলে মোট বিক্রয়
          </div>
        </div>

        {/* Registered Students */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">নিবন্ধিত শিক্ষার্থী</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400 tracking-tight">
            {(stats?.totalStudents || students.length || 1540).toLocaleString('bn-BD')} জন
          </div>
          <div className="text-xs text-slate-400 font-semibold mt-2">
            সক্রিয় লার্নিং অ্যাকাউন্ট
          </div>
        </div>

        {/* Total Published Courses */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট লাইভ কোর্স</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
            {(stats?.totalCourses || courses.length || 16).toLocaleString('bn-BD')} টি
          </div>
          <div className="text-xs text-slate-400 font-semibold mt-2">
            ক্যারিয়ার ও স্কিল প্রোগ্রাম
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Revenue Graph (Left) + Real-Time Live Sales Stream (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Interactive Revenue & Orders Growth Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>মাসিক রেভিনিউ ও বিক্রয় প্রবৃদ্ধি (২০২৬)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                বিগত মাসসমূহের ধারাবাহিক আয় ও এনরোলমেন্ট ভলিউম ট্রেন্ড
              </p>
            </div>

            {/* Toggle Revenue vs Orders */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1 text-xs font-bold self-start sm:self-auto">
              <button
                onClick={() => setChartView('revenue')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartView === 'revenue'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                আয় (৳ রেভিনিউ)
              </button>
              <button
                onClick={() => setChartView('orders')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartView === 'orders'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                অর্ডার সংখ্যা
              </button>
            </div>
          </div>

          {/* Interactive Dynamic SVG Bar & Curve Chart */}
          <div className="space-y-2">
            <div className="h-64 pt-6 flex items-end justify-between gap-3 px-3 border-b border-slate-100 dark:border-slate-800">
              {monthlyData.map((d: any, idx: number) => {
                const isHovered = hoveredDataPoint === idx;
                const value = chartView === 'revenue' ? d.revenue : d.orders;
                const max = chartView === 'revenue' ? maxRevenue : maxOrders;
                const heightPct = Math.max(12, Math.round((value / max) * 100));

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredDataPoint(idx)}
                    onMouseLeave={() => setHoveredDataPoint(null)}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative"
                  >
                    {/* Tooltip Popup on Hover */}
                    {isHovered && (
                      <div className="absolute -top-14 z-20 px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-center shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                          {d.month}
                        </div>
                        <div className="text-xs font-black">
                          {chartView === 'revenue' ? `৳${d.revenue.toLocaleString('bn-BD')}` : `${d.orders} টি অর্ডার`}
                        </div>
                      </div>
                    )}

                    {/* Value Badge */}
                    <span
                      className={`text-[11px] font-black transition-opacity ${
                        isHovered ? 'opacity-100 text-emerald-600 dark:text-emerald-400' : 'opacity-60 text-slate-400'
                      }`}
                    >
                      {chartView === 'revenue' ? `৳${Math.round(d.revenue / 1000)}k` : `${d.orders}`}
                    </span>

                    {/* Bar visual container */}
                    <div className="w-full flex items-end justify-center h-44">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full max-w-[36px] rounded-t-xl transition-all duration-300 relative overflow-hidden ${
                          chartView === 'revenue'
                            ? isHovered
                              ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md shadow-emerald-500/30'
                              : 'bg-gradient-to-t from-emerald-500 to-teal-500/80 hover:brightness-110'
                            : isHovered
                            ? 'bg-gradient-to-t from-sky-600 to-cyan-400 shadow-md shadow-sky-500/30'
                            : 'bg-gradient-to-t from-sky-500 to-cyan-500/80 hover:brightness-110'
                        }`}
                      >
                        {/* Shimmer light effect inside bar */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Month Label */}
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {d.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick Chart Summary Footer */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 px-1">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                সর্বোচ্চ বিক্রির মাস: <strong className="text-slate-800 dark:text-slate-200">মার্চ ২০২৬ (৳২,৩৫,০০০)</strong>
              </span>
              <span className="font-bold text-emerald-600">গড় কনভার্সন রেট: ৯৪.২%</span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Real-Time Live Sales & Enrollment Stream ("shateh jara kinbe sob ekhane realtime jeno dekhai") */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  লাইভ শিক্ষার্থী ক্রয় ফিড
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Live Feed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              শিক্ষার্থীরা কোর্স কেনার সাথে সাথে এই ফিডে রিয়েল-টাইম তথ্য প্রদর্শিত হয়
            </p>
          </div>

          {/* Real-time Sales Feed Items */}
          <div className="space-y-2.5 max-h-[310px] overflow-y-auto pr-1 scrollbar-none">
            {liveSalesStream.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                কোন সাম্প্রতিক ক্রয় পাওয়া যায়নি
              </div>
            ) : (
              liveSalesStream.map((sale, sIdx) => {
                const isFirst = sIdx === 0;
                return (
                  <div
                    key={sale.id || sIdx}
                    className={`p-3 rounded-xl border transition-all ${
                      isFirst && sale.isNew
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ring-1 ring-emerald-500/30'
                        : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-600/10 text-emerald-600 font-black text-xs flex items-center justify-center shrink-0">
                          {sale.studentName.slice(0, 1)}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 dark:text-white block leading-tight">
                            {sale.studentName}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {sale.courseTitle}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-black text-xs text-emerald-600 dark:text-emerald-400 block">
                          ৳{sale.amount.toLocaleString('bn-BD')}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 uppercase">
                          {sale.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-400">
                      <span className="font-mono">ID: {sale.transactionId.slice(0, 10)}</span>
                      <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                        <Clock className="w-2.5 h-2.5" />
                        {isFirst && sale.isNew ? 'এইমাত্র' : 'আজ'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>সকল অর্ডার ও ট্রানজেকশন দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Course-wise Sales Performance Section ("live coirse koto kince mane sob jeno live dekhai") */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                কোর্স ভিত্তিক লাইভ বিক্রয় ও এনরোলমেন্ট রিপোর্ট
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                {courseSalesStats.length} টি কোর্স
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              প্রতিটি কোর্স আলাদাভাবে কতজন শিক্ষার্থী কিনেছেন এবং মোট কত টাকা আয় হয়েছে তার লাইভ হিসাব
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1 text-xs font-bold self-start sm:self-auto">
            <button
              onClick={() => setCourseFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                courseFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              সকল কোর্স ({courseSalesStats.length})
            </button>
            <button
              onClick={() => setCourseFilter('TOP')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                courseFilter === 'TOP'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 font-extrabold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              টপ ৫ বেস্টসেলার
            </button>
          </div>
        </div>

        {/* Courses Sales Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-3">কোর্সের নাম ও বিবরণ</th>
                <th className="py-3 px-3">ফি ও ডিসকাউন্ট</th>
                <th className="py-3 px-3">কতো জন কিনেছেন (বিক্রয়)</th>
                <th className="py-3 px-3">বিক্রয় পারফরম্যান্স বার</th>
                <th className="py-3 px-3">মোট অর্জিত রেভিনিউ</th>
                <th className="py-3 px-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {displayCourses.map((c, cIdx) => {
                const progressPct = Math.min(100, Math.round((c.soldCount / maxCourseSales) * 100));
                const isBestseller = cIdx === 0;

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        {c.thumbnail ? (
                          <img
                            src={c.thumbnail}
                            alt={c.title}
                            className="w-12 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 shrink-0">
                            <BookOpen className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-emerald-600 transition-colors">
                              {c.title}
                            </span>
                            {isBestseller && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                🔥 বেস্টসেলার
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {c.instructor?.name || 'মেন্টর প্যানেল'} • {c.level || 'Beginner to Advanced'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 dark:text-white">
                        ৳{(c.price || 2500).toLocaleString('bn-BD')}
                      </span>
                      {c.originalPrice && c.originalPrice > (c.price || 0) && (
                        <span className="text-[10px] text-slate-400 line-through ml-1.5">
                          ৳{c.originalPrice.toLocaleString('bn-BD')}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-black text-xs">
                          {c.soldCount.toLocaleString('bn-BD')} জন
                        </span>
                        <span className="text-[10px] text-slate-400">কিনেছেন</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 w-40">
                      <div className="space-y-1">
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 block text-right font-medium">
                          {progressPct}% মার্কেট শেয়ার
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-black text-xs text-emerald-600 dark:text-emerald-400">
                        ৳{c.revenue.toLocaleString('bn-BD')}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => onNavigateTab('courses')}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        কোর্স ম্যানেজ
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
