import React, { useState, useEffect } from 'react';
import {
  Bell,
  Megaphone,
  Plus,
  Search,
  Edit,
  Trash2,
  Pin,
  PinOff,
  AlertTriangle,
  Info,
  Calendar,
  User,
  GraduationCap,
  Shield,
  Layers,
  CheckCircle2,
  Clock,
  X,
  RefreshCw,
  Filter,
  Eye
} from 'lucide-react';
import { Notice, Course } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

interface NoticeManagementSectionProps {
  isAdmin?: boolean;
  courses?: Course[];
}

export const NoticeManagementSection: React.FC<NoticeManagementSectionProps> = ({
  isAdmin = false,
  courses = []
}) => {
  const { user, token } = useAuth();
  const { language } = useLanguage();
  const { success: toastSuccess, error: toastError } = useToast();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [filterTarget, setFilterTarget] = useState<'ALL' | 'GLOBAL' | 'COURSE'>('ALL');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetType: 'ALL' as 'ALL' | 'COURSE' | 'BATCH',
    targetCourseId: '',
    batchName: '',
    priority: 'NORMAL' as 'NORMAL' | 'IMPORTANT' | 'URGENT',
    isPinned: false
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Available courses list: If passed from props use them, else fetch
  const [availableCourses, setAvailableCourses] = useState<Course[]>(courses);

  useEffect(() => {
    if (courses.length > 0) {
      setAvailableCourses(courses);
    } else {
      fetch('/api/courses')
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.courses)) {
            setAvailableCourses(data.courses);
          }
        })
        .catch((err) => console.error('Error fetching courses:', err));
    }
  }, [courses]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/notices', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setNotices(data.notices || []);
      } else {
        toastError('নোটিশ লোড করা সম্ভব হয়নি');
      }
    } catch (err) {
      console.error('Error loading notices:', err);
      toastError('সার্ভার এরর: নোটিশ লোড ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [token]);

  const handleOpenCreateForm = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      content: '',
      targetType: 'ALL',
      targetCourseId: availableCourses[0]?.id || '',
      batchName: '',
      priority: 'NORMAL',
      isPinned: false
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      targetType: notice.targetType,
      targetCourseId: notice.targetCourseId || (availableCourses[0]?.id || ''),
      batchName: notice.batchName || '',
      priority: notice.priority,
      isPinned: Boolean(notice.isPinned)
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toastError('নোটিশের শিরোনাম ও বিষয়বস্তু আবশ্যক');
      return;
    }

    if ((formData.targetType === 'COURSE' || formData.targetType === 'BATCH') && !formData.targetCourseId) {
      toastError('অনুগ্রহ করে লক্ষ্যভিত্তিক কোর্স নির্বাচন করুন');
      return;
    }

    setSubmitting(true);
    try {
      const url = editingNotice ? `/api/notices/${editingNotice.id}` : '/api/notices';
      const method = editingNotice ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const resData = await res.json();
      if (res.ok) {
        toastSuccess(editingNotice ? 'নোটিশ সফলভাবে আপডেট হয়েছে' : 'নতুন নোটিশ সফলভাবে প্রকাশিত হয়েছে');
        setIsFormOpen(false);
        setEditingNotice(null);
        fetchNotices();
        // Dispatch window event so student dashboard & navbar can immediately blink/refresh
        window.dispatchEvent(new CustomEvent('notices_updated', { detail: resData.notice }));
      } else {
        toastError(resData.error || 'নোটিশ সংরক্ষণ করা সম্ভব হয়নি');
      }
    } catch (err) {
      console.error('Failed to save notice:', err);
      toastError('সার্ভার সংযোগ সমস্যা');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notices/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        toastSuccess('নোটিশ সফলভাবে মুছে ফেলা হয়েছে');
        setDeleteConfirmId(null);
        fetchNotices();
        window.dispatchEvent(new CustomEvent('notices_updated'));
      } else {
        const resData = await res.json();
        toastError(resData.error || 'নোটিশ মুছে ফেলা সম্ভব হয়নি');
      }
    } catch (err) {
      console.error('Failed to delete notice:', err);
      toastError('সার্ভার সংযোগ ত্রুটি');
    }
  };

  // Filter notices
  const filteredNotices = notices.filter((n) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchContent = n.content.toLowerCase().includes(q);
      const matchAuthor = n.authorName?.toLowerCase().includes(q);
      const matchCourse = n.targetCourseTitle?.toLowerCase().includes(q);
      const matchBatch = n.batchName?.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchAuthor && !matchCourse && !matchBatch) return false;
    }

    if (filterTarget === 'GLOBAL') {
      if (n.targetType !== 'ALL') return false;
    } else if (filterTarget === 'COURSE') {
      if (n.targetType === 'ALL') return false;
    }

    return true;
  });

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Megaphone className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isAdmin ? 'নোটিশ ব্যবস্থাপনা (Notice Management)' : 'আমার কোর্স নোটিশসমূহ'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {isAdmin
              ? 'সকল শিক্ষার্থী অথবা নির্দিষ্ট কোর্স ও ব্যাচের জন্য অফিসিয়াল নোটিশ প্রকাশ, সম্পাদনা ও নিয়ন্ত্রণ করুন।'
              : 'আপনার কোর্স ও নির্দিষ্ট ব্যাচের শিক্ষার্থীদের জন্য সরাসরি নোটিশ ও দিকনির্দেশনা প্রদান করুন।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchNotices}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreateForm}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন নোটিশ তৈরি করুন</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterTarget('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filterTarget === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            সকল নোটিশ ({notices.length})
          </button>
          <button
            onClick={() => setFilterTarget('GLOBAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filterTarget === 'GLOBAL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            সকল শিক্ষার্থীর জন্য
          </button>
          <button
            onClick={() => setFilterTarget('COURSE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filterTarget === 'COURSE'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            কোর্স ও ব্যাচ স্পেসিফিক
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="শিরোনাম বা কোর্স দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Notices Table or Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-indigo-600" />
          <p className="text-sm font-medium">নোটিশ তালিকা লোড হচ্ছে...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mx-auto">
            <Megaphone className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            কোনো নোটিশ পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            শিক্ষার্থীদের জন্য প্রয়োজনীয় এনাউন্সমেন্ট বা ব্যাচের আপডেট জানাতে ওপরের বাটনে ক্লিক করে নতুন নোটিশ তৈরি করুন।
          </p>
          <button
            onClick={handleOpenCreateForm}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নোটিশ তৈরি করুন</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((n) => {
            const isUrgent = n.priority === 'URGENT';
            const isImportant = n.priority === 'IMPORTANT';

            return (
              <div
                key={n.id}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all hover:shadow-md ${
                  n.isPinned
                    ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/20 dark:bg-indigo-950/20'
                    : isUrgent
                    ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Meta Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    {n.isPinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        <Pin className="w-3 h-3 fill-indigo-600" />
                        <span>পিন করা</span>
                      </span>
                    )}

                    {/* Priority */}
                    {isUrgent ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        <AlertTriangle className="w-3 h-3" />
                        <span>জরুরি</span>
                      </span>
                    ) : isImportant ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        <Info className="w-3 h-3" />
                        <span>গুরুত্বপূর্ণ</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        সাধারণ
                      </span>
                    )}

                    {/* Target Audience */}
                    {n.targetType === 'ALL' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>সকল শিক্ষার্থী ও সকল ব্যাচ</span>
                      </span>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>{n.targetCourseTitle || 'কোর্স স্পেসিফিক'}</span>
                        {n.batchName && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-200/80 dark:bg-blue-900 text-[10px] font-mono">
                            {n.batchName}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Date and Author */}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(n.createdAt)}</span>
                    </span>
                    {isAdmin && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                        {n.authorName} ({n.authorRole})
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="pt-3 space-y-2">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    {n.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {n.content}
                  </p>
                </div>

                {/* Actions Bar */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: {n.id}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditForm(n)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-indigo-600" />
                      <span>এডিট</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(n.id)}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              নোটিশটি মুছে ফেলতে চান?
            </h3>
            <p className="text-xs text-slate-500">
              এটি স্থায়ীভাবে ডিলিট হয়ে যাবে এবং শিক্ষার্থীরা আর এই নোটিশটি দেখতে পাবে না।
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Notice Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {editingNotice ? 'নোটিশ সম্পাদনা (Edit Notice)' : 'নতুন নোটিশ প্রকাশ (Create Notice)'}
                </h3>
                <p className="text-xs text-slate-500">
                  সঠিক লক্ষ্য ও ব্যাচ নির্ধারণ করে নোটিশ প্রকাশ করুন
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Target Selection: ALL vs SPECIFIC COURSE & BATCH */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                  লক্ষ্য নির্ধারণ (Audience Target):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setFormData({ ...formData, targetType: 'ALL', batchName: '' })}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      formData.targetType === 'ALL'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="targetType"
                      checked={formData.targetType === 'ALL'}
                      onChange={() => setFormData({ ...formData, targetType: 'ALL', batchName: '' })}
                      className="mt-1 accent-indigo-600"
                    />
                    <div>
                      <div className="font-bold text-xs">সকল শিক্ষার্থী ও সকল ব্যাচ (All Students)</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        প্ল্যাটফর্মের সকল নথিভুক্ত শিক্ষার্থী এটি দেখতে পাবে।
                      </div>
                    </div>
                  </label>

                  <label
                    onClick={() => setFormData({ ...formData, targetType: 'COURSE' })}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      formData.targetType === 'COURSE' || formData.targetType === 'BATCH'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="targetType"
                      checked={formData.targetType === 'COURSE' || formData.targetType === 'BATCH'}
                      onChange={() => setFormData({ ...formData, targetType: 'COURSE' })}
                      className="mt-1 accent-indigo-600"
                    />
                    <div>
                      <div className="font-bold text-xs">নির্দিষ্ট কোর্স ও ব্যাচ (Specific Course / Batch)</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        শুধুমাত্র নির্বাচিত কোর্স এবং ব্যাচের শিক্ষার্থীরা দেখতে পাবে।
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Conditional Course & Batch Pickers */}
              {(formData.targetType === 'COURSE' || formData.targetType === 'BATCH') && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      কোর্স নির্বাচন করুন:
                    </label>
                    <select
                      value={formData.targetCourseId}
                      onChange={(e) => setFormData({ ...formData, targetCourseId: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 cursor-pointer"
                      required
                    >
                      <option value="">-- কোর্স সিলেক্ট করুন --</option>
                      {availableCourses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.titleBn || c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      ব্যাচের নাম / নম্বর (যেমন: ব্যাচ ১, ব্যাচ ২, অথবা ফাঁকা রাখলে সম্পূর্ণ কোর্স):
                    </label>
                    <input
                      type="text"
                      value={formData.batchName}
                      onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                      placeholder="যেমন: ব্যাচ-১ (Batch 1) বা Batch 2025"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                    />
                    
                    {/* Quick Batch Pills */}
                    <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                      <span className="text-[10px] text-slate-400">কুইক সিলেক্ট:</span>
                      {['সকল ব্যাচ', 'ব্যাচ-১ (Batch 1)', 'ব্যাচ-২ (Batch 2)', 'ব্যাচ-৩ (Batch 3)'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setFormData({ ...formData, batchName: b === 'সকল ব্যাচ' ? '' : b })}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  নোটিশের শিরোনাম:
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="যেমন: আগামী ক্লাসের শিডিউল পরিবর্তন বা প্রজেক্ট সাবমিশন গাইডলাইন"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  বিস্তারিত বিবরণ ও নির্দেশনা:
                </label>
                <textarea
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="শিক্ষার্থীদের জন্য পরিষ্কারভাবে বিস্তারিত লিখুন..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 leading-relaxed resize-y"
                  required
                />
              </div>

              {/* Priority & Pinned Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    অগ্রাধিকার স্তর (Priority Level):
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="NORMAL">📢 সাধারণ নোটিশ (Normal)</option>
                    <option value="IMPORTANT">⚠️ গুরুত্বপূর্ণ নোটিশ (Important)</option>
                    <option value="URGENT">🚨 জরুরি নোটিশ (Urgent)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                      className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                    />
                    <span>📌 নোটিশটি তালিকায় শীর্ষে পিন করে রাখুন</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{editingNotice ? 'আপডেট করুন' : 'নোটিশ প্রকাশ করুন'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
