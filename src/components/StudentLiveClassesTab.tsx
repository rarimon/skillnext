import React, { useState, useEffect } from 'react';
import {
  Video,
  Clock,
  Calendar,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';
import { LiveClass, Enrollment } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LiveClassCountdownCard } from './LiveClassCountdownCard';

interface StudentLiveClassesTabProps {
  enrollments: Enrollment[];
}

export const StudentLiveClassesTab: React.FC<StudentLiveClassesTabProps> = ({ enrollments }) => {
  const { language } = useLanguage();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-2">
              <Video className="w-3.5 h-3.5" />
              <span>সরাসরি মেন্টরশিপ ও লাইভ ক্লাস</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              আসন্ন লাইভ ক্লাস ও জুম কাউন্টডাউন
            </h2>
            <p className="text-xs text-emerald-100 mt-1 max-w-xl">
              আপনার মেন্টরের সাথে সরাসরি প্রশ্নোত্তর ও প্রজেক্ট রিভিউ সেশনে অংশ নিন। ক্লাস শুরুর ১০ মিনিট পূর্বে জুম লিংক সক্রিয় হবে।
            </p>
          </div>

          <button
            type="button"
            onClick={fetchLiveClasses}
            className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>শিডিউল রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">লাইভ ক্লাসে যুক্ত হওয়ার নির্দেশনাবলী:</p>
          <p className="text-slate-600 dark:text-slate-300 text-[11px]">
            নির্ধারিত সময়ের পূর্বে জুম বাটন লক করা থাকবে। কাউন্টডাউন শেষ হওয়ার সাথে সাথে বাটনটি সবুজ হয়ে সক্রিয় হবে এবং আপনি সরাসরি ক্লিক করে মিটিংয়ে প্রবেশ করতে পারবেন।
          </p>
        </div>
      </div>

      {/* Classes List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-emerald-600" />
          <p className="text-sm font-medium">লাইভ ক্লাস শিডিউল যাচাই করা হচ্ছে...</p>
        </div>
      ) : liveClasses.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            এই মুহূর্তে কোনো লাইভ ক্লাস শিডিউল নেই
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            আপনার শিক্ষক শীঘ্রই পরবর্তী লাইভ ক্লাসের তারিখ ও সময়সূচি এখানে প্রকাশ করবেন। নিয়মিত নোটিফিকেশন চেক করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {liveClasses.map((lc) => (
            <LiveClassCountdownCard
              key={lc.id}
              liveClass={lc}
              isTeacher={false}
            />
          ))}
        </div>
      )}

    </div>
  );
};
