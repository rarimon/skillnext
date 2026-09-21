import React, { useState, useEffect } from 'react';
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Link,
  Shield,
  Key,
  X,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { LiveClass, Course } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { LiveClassCountdownCard } from './LiveClassCountdownCard';

interface TeacherLiveClassesTabProps {
  courses: Course[];
}

export const TeacherLiveClassesTab: React.FC<TeacherLiveClassesTabProps> = ({ courses }) => {
  const { token, user } = useAuth();
  const { success, error } = useToast();
  const { language } = useLanguage();

  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [editingLiveClass, setEditingLiveClass] = useState<LiveClass | null>(null);
  const [courseId, setCourseId] = useState<string>(courses[0]?.id || '');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(90);
  const [zoomUrl, setZoomUrl] = useState<string>('');
  const [meetingId, setMeetingId] = useState<string>('');
  const [passcode, setPasscode] = useState<string>('');

  const fetchLiveClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/live-classes');
      if (res.ok) {
        const data = await res.json();
        setLiveClasses(data.liveClasses || []);
      }
    } catch (err) {
      console.error('Failed to load live classes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  useEffect(() => {
    if (courses.length > 0 && !courseId) {
      setCourseId(courses[0].id);
    }
  }, [courses]);

  const openCreateModal = () => {
    setEditingLiveClass(null);
    setCourseId(courses[0]?.id || '');
    setTitle('');
    setDescription('');
    // Default scheduledAt to tomorrow at 8:00 PM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0);
    setScheduledAt(tomorrow.toISOString().slice(0, 16));
    setDurationMinutes(90);
    setZoomUrl('');
    setMeetingId('');
    setPasscode('');
    setIsModalOpen(true);
  };

  const openEditModal = (lc: LiveClass) => {
    setEditingLiveClass(lc);
    setCourseId(lc.courseId);
    setTitle(lc.title);
    setDescription(lc.description || '');
    try {
      setScheduledAt(new Date(lc.scheduledAt).toISOString().slice(0, 16));
    } catch {
      setScheduledAt('');
    }
    setDurationMinutes(lc.durationMinutes || 90);
    setZoomUrl(lc.zoomUrl);
    setMeetingId(lc.meetingId || '');
    setPasscode(lc.passcode || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!title.trim() || !scheduledAt || !zoomUrl.trim()) {
      error(language === 'bn' ? 'দয়া করে শিরোনাম, সময় এবং জুম লিংক প্রদান করুন' : 'Please provide title, time and Zoom URL');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        courseId,
        title: title.trim(),
        description: description.trim(),
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: Number(durationMinutes) || 60,
        zoomUrl: zoomUrl.trim(),
        meetingId: meetingId.trim(),
        passcode: passcode.trim()
      };

      const url = editingLiveClass
        ? `/api/teacher/live-classes/${editingLiveClass.id}`
        : '/api/teacher/live-classes';

      const method = editingLiveClass ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        success(editingLiveClass ? 'লাইভ ক্লাস সফলভাবে আপডেট করা হয়েছে' : 'নতুন লাইভ ক্লাস সফলভাবে শিডিউল করা হয়েছে');
        setIsModalOpen(false);
        fetchLiveClasses();
      } else {
        error(data.error || 'সংরক্ষণ ব্যর্থ হয়েছে');
      }
    } catch (err) {
      console.error(err);
      error('সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!window.confirm('আপনি কি নিশ্চিতভাবে এই লাইভ ক্লাসটি মুছে ফেলতে চান?')) return;

    try {
      const res = await fetch(`/api/teacher/live-classes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        success('লাইভ ক্লাস সফলভাবে মুছে ফেলা হয়েছে');
        setLiveClasses((prev) => prev.filter((lc) => lc.id !== id));
      } else {
        error('ক্লাস মোছা যায়নি');
      }
    } catch (err) {
      console.error(err);
      error('সার্ভারে সমস্যা হয়েছে');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Video className="w-4 h-4" />
            <span>লাইভ ক্লাস ও জুম ইন্টিগ্রেশন</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            লাইভ সেশন শিডিউল ও কাউন্টডাউন
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            শিক্ষার্থীদের জন্য রিয়েল-টাইম কাউন্টডাউন সহ জুম লাইভ ক্লাসের শিডিউল নির্ধারণ করুন। ক্লাস শুরুর ১০ মিনিট পূর্বে লিংকটি সক্রিয় হবে।
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-900/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন লাইভ ক্লাস শিডিউল করুন</span>
        </button>
      </div>

      {/* LIVE CLASSES LIST */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-emerald-600" />
          <p className="text-sm font-medium">লাইভ ক্লাস শিডিউল লোড হচ্ছে...</p>
        </div>
      ) : liveClasses.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            কোনো লাইভ ক্লাস শিডিউল নেই
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            আপনার কোর্সের শিক্ষার্থীদের জন্য লাইভ ডাউট সলভিং বা প্রজেক্ট রিভিউ ক্লাস শিডিউল করুন।
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            প্রথম লাইভ ক্লাস তৈরি করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {liveClasses.map((lc) => (
            <LiveClassCountdownCard
              key={lc.id}
              liveClass={lc}
              isTeacher={true}
              onDelete={handleDelete}
              onEdit={openEditModal}
            />
          ))}
        </div>
      )}

      {/* CREATE / EDIT LIVE CLASS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {editingLiveClass ? 'লাইভ ক্লাস আপডেট করুন' : 'নতুন লাইভ ক্লাস শিডিউল করুন'}
                  </h3>
                  <p className="text-[11px] text-slate-500">জুম মিটিং লিংক ও টাইমার নির্ধারণ</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Select Course */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কোর্স নির্বাচন করুন *
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.titleBn || c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class Title */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  লাইভ ক্লাসের শিরোনাম *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: MERN Stack লাইভ ডাউট সলভিং ও কোড রিভিউ ক্লাস"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ক্লাসের বিবরণ বা আলোচ্য বিষয় (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ক্লাসে কী কী টপিক নিয়ে আলোচনা হবে তার সংক্ষেপ..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Schedule Date Time & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    তারিখ ও শুরুর সময় *
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ক্লাসের ব্যাপ্তি (মিনিট) *
                  </label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={45}>৪৫ মিনিট</option>
                    <option value={60}>৬০ মিনিট (১ ঘণ্টা)</option>
                    <option value={90}>৯০ মিনিট (১.৫ ঘণ্টা)</option>
                    <option value={120}>১২০ মিনিট (২ ঘণ্টা)</option>
                    <option value={180}>১৮০ মিনিট (৩ ঘণ্টা)</option>
                  </select>
                </div>
              </div>

              {/* Zoom Meeting Link */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  জুম লাইভ মিটিং লিংক (Zoom URL) *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={zoomUrl}
                    onChange={(e) => setZoomUrl(e.target.value)}
                    placeholder="https://zoom.us/j/98765432101?pwd=..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  * এই লিংকটি নির্ধারিত সময়ের পূর্বে নিষ্ক্রিয় থাকবে এবং ক্লাস শুরুর ১০ মিনিট পূর্বে শিক্ষার্থীদের জন্য উন্মুক্ত হবে।
                </p>
              </div>

              {/* Meeting ID & Passcode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মিটিং আইডি (Meeting ID)
                  </label>
                  <input
                    type="text"
                    value={meetingId}
                    onChange={(e) => setMeetingId(e.target.value)}
                    placeholder="987 6543 2101"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পাসকোড (Passcode)
                  </label>
                  <input
                    type="text"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="SN2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <span>{editingLiveClass ? 'আপডেট করুন' : 'শিডিউল নিশ্চিত করুন'}</span>
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
