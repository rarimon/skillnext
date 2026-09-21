import React, { useState, useEffect } from 'react';
import {
  Bell,
  Megaphone,
  AlertTriangle,
  Info,
  Calendar,
  User,
  Shield,
  GraduationCap,
  Pin,
  Search,
  Filter,
  RefreshCw,
  Clock,
  Layers,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Tag
} from 'lucide-react';
import { Notice, Enrollment } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface StudentNoticesTabProps {
  enrollments: Enrollment[];
  onNoticesRead?: () => void;
}

export const StudentNoticesTab: React.FC<StudentNoticesTabProps> = ({ enrollments, onNoticesRead }) => {
  const { token, user } = useAuth();
  const { language } = useLanguage();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'COURSE_BATCH' | 'URGENT'>('ALL');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');
  const [selectedNoticeModal, setSelectedNoticeModal] = useState<Notice | null>(null);
  const [readNoticeIds, setReadNoticeIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`read_notices_${user?.id || 'guest'}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notices', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setNotices(data.notices || []);
      }
    } catch (err) {
      console.error('Failed to load notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [token]);

  // Sync readNoticeIds when user changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`read_notices_${user?.id || 'guest'}`);
      setReadNoticeIds(stored ? JSON.parse(stored) : []);
    } catch {
      setReadNoticeIds([]);
    }
  }, [user?.id]);

  // Listen for real-time notices update events from admin or teacher posting
  useEffect(() => {
    const handleNoticesUpdated = () => {
      fetchNotices();
    };
    window.addEventListener('notices_updated', handleNoticesUpdated);
    return () => window.removeEventListener('notices_updated', handleNoticesUpdated);
  }, []);

  const markNoticeAsRead = (id: string) => {
    if (!readNoticeIds.includes(id)) {
      const updated = [...readNoticeIds, id];
      setReadNoticeIds(updated);
      try {
        localStorage.setItem(`read_notices_${user?.id || 'guest'}`, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      window.dispatchEvent(new CustomEvent('notice_read', { detail: { id } }));
      if (onNoticesRead) onNoticesRead();
    }
  };

  const markAllAsRead = () => {
    const allIds = notices.map((n) => n.id);
    setReadNoticeIds(allIds);
    try {
      localStorage.setItem(`read_notices_${user?.id || 'guest'}`, JSON.stringify(allIds));
    } catch (err) {
      console.error(err);
    }
    window.dispatchEvent(new CustomEvent('notice_read', { detail: { all: true } }));
    if (onNoticesRead) onNoticesRead();
  };

  const unreadCount = notices.filter((n) => !readNoticeIds.includes(n.id)).length;

  // Filter logic
  const filteredNotices = notices.filter((n) => {
    // Search matching
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchContent = n.content.toLowerCase().includes(q);
      const matchCourse = n.targetCourseTitle?.toLowerCase().includes(q);
      const matchBatch = n.batchName?.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchCourse && !matchBatch) {
        return false;
      }
    }

    // Tab Type
    if (filterType === 'COURSE_BATCH') {
      if (n.targetType === 'ALL') return false;
    } else if (filterType === 'URGENT') {
      if (n.priority !== 'URGENT') return false;
    }

    // Specific Course selection
    if (selectedCourseFilter !== 'ALL') {
      if (n.targetType !== 'ALL' && n.targetCourseId !== selectedCourseFilter) {
        return false;
      }
    }

    return true;
  });

  const enrolledCourses = enrollments
    .filter((e) => e.course)
    .map((e) => e.course!);

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider">
                <Megaphone className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'অফিসিয়াল নোটিশ বোর্ড' : 'Official Notice Board'}</span>
              </div>
              {unreadCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-black shadow-xs animate-notice-blink">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  {unreadCount} {language === 'bn' ? 'নতুন নোটিশ' : 'New Notices'}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              {language === 'bn' ? 'গুরুত্বপূর্ণ নোটিশ ও ক্লাস এনাউন্সমেন্ট' : 'Notices & Announcements'}
            </h2>
            <p className="text-xs text-blue-100 mt-1 max-w-xl">
              {language === 'bn'
                ? 'আপনার ব্যাচ, কোর্স এবং প্ল্যাটফর্মের সার্বিক নোটিশসমূহ নিয়মিত এখানে হালনাগাদ করা হয়।'
                : 'Stay updated with announcements from your course instructors and academy management.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="px-3 py-2 rounded-xl bg-white text-indigo-700 hover:bg-blue-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'bn' ? 'সব পঠিত হিসেবে চিহ্নিত করুন' : 'Mark all as read'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={fetchNotices}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {language === 'bn' ? 'সকল নোটিশ' : 'All Notices'} ({notices.length})
            </button>

            <button
              onClick={() => setFilterType('COURSE_BATCH')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filterType === 'COURSE_BATCH'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {language === 'bn' ? 'কোর্স ও ব্যাচ স্পেসিফিক' : 'Course & Batch Specific'}
            </button>

            <button
              onClick={() => setFilterType('URGENT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                filterType === 'URGENT'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'জরুরি নোটিশ' : 'Urgent Only'}</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'bn' ? 'নোটিশ খুঁজুন...' : 'Search notices...'}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Course specific dropdown selector if student has enrolled courses */}
        {enrolledCourses.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500 font-medium shrink-0">
              {language === 'bn' ? 'কোর্স ফিল্টার:' : 'Filter by Course:'}
            </span>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL">{language === 'bn' ? 'সকল কোর্স' : 'All Courses'}</option>
              {enrolledCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.titleBn || c.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Notices List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-indigo-600" />
          <p className="text-sm font-medium">নোটিশ বোর্ড লোড হচ্ছে...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {language === 'bn' ? 'কোনো নোটিশ পাওয়া যায়নি' : 'No Notices Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'bn'
              ? 'এই ক্যাটাগরিতে এই মুহূর্তে নতুন কোনো নোটিশ প্রকাশিত হয়নি।'
              : 'There are no notices published under this category.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((notice) => {
            const isUrgent = notice.priority === 'URGENT';
            const isImportant = notice.priority === 'IMPORTANT';
            const isAllStudents = notice.targetType === 'ALL';
            const isUnread = !readNoticeIds.includes(notice.id);

            return (
              <div
                key={notice.id}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all hover:shadow-md relative overflow-hidden ${
                  isUnread
                    ? 'ring-2 ring-rose-500/80 border-rose-300 dark:border-rose-900/80 bg-rose-50/10 dark:bg-rose-950/10 shadow-sm'
                    : notice.isPinned
                    ? 'border-indigo-300 dark:border-indigo-800/80 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-xs'
                    : isUrgent
                    ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Notice Top Meta Line */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* NEW Blinking Tag for Unread Notices */}
                    {isUnread && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-500 text-white shadow-xs animate-notice-blink">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        <span>{language === 'bn' ? 'নতুন নোটিশ' : 'NEW'}</span>
                      </span>
                    )}

                    {/* Pinned Tag */}
                    {notice.isPinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        <Pin className="w-3 h-3 fill-indigo-600" />
                        <span>{language === 'bn' ? 'পিন করা নোটিশ' : 'Pinned'}</span>
                      </span>
                    )}

                    {/* Priority Badge */}
                    {isUrgent ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{language === 'bn' ? 'জরুরি নোটিশ' : 'Urgent'}</span>
                      </span>
                    ) : isImportant ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <Info className="w-3 h-3" />
                        <span>{language === 'bn' ? 'গুরুত্বপূর্ণ' : 'Important'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <Megaphone className="w-3 h-3" />
                        <span>{language === 'bn' ? 'সাধারণ নোটিশ' : 'General'}</span>
                      </span>
                    )}

                    {/* Target Audience Badge */}
                    {isAllStudents ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{language === 'bn' ? 'সকল শিক্ষার্থী ও সকল ব্যাচ' : 'All Students'}</span>
                      </span>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                        <GraduationCap className="w-3 h-3" />
                        <span>{notice.targetCourseTitle || 'কোর্স স্পেসিফিক'}</span>
                        {notice.batchName && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-200/70 dark:bg-blue-900 text-[10px] font-mono font-bold">
                            {notice.batchName}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(notice.createdAt)}</span>
                  </div>
                </div>

                {/* Notice Title & Content */}
                <div className="pt-3.5 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                      {notice.title}
                    </h3>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {notice.content}
                  </div>
                </div>

                {/* Notice Author & Actions Footer */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                      {notice.authorRole === 'TEACHER' || notice.authorRole === 'INSTRUCTOR' ? (
                        <GraduationCap className="w-3.5 h-3.5" />
                      ) : (
                        <Shield className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {notice.authorName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                      {notice.authorRole === 'TEACHER' || notice.authorRole === 'INSTRUCTOR'
                        ? (language === 'bn' ? 'কোর্স শিক্ষক' : 'Teacher')
                        : (language === 'bn' ? 'অ্যাডমিন' : 'Admin')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {isUnread && (
                      <button
                        type="button"
                        onClick={() => markNoticeAsRead(notice.id)}
                        className="text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'পঠিত' : 'Read'}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        markNoticeAsRead(notice.id);
                        setSelectedNoticeModal(notice);
                      }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'Full Details'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notice Detail View Modal */}
      {selectedNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {selectedNoticeModal.targetType === 'ALL'
                    ? 'সাধারণ নোটিশ (সকল শিক্ষার্থী)'
                    : `${selectedNoticeModal.targetCourseTitle || 'কোর্স নোটিশ'} ${selectedNoticeModal.batchName ? `• ${selectedNoticeModal.batchName}` : ''}`}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {selectedNoticeModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNoticeModal(null)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto pr-1 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">
              {selectedNoticeModal.content}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div>
                প্রকাশক: <strong className="text-slate-800 dark:text-slate-200">{selectedNoticeModal.authorName}</strong> ({selectedNoticeModal.authorRole})
              </div>
              <div>
                {formatDate(selectedNoticeModal.createdAt)}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedNoticeModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold text-xs cursor-pointer transition-colors"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
