import React, { useState, useEffect } from 'react';
import {
  Video,
  Clock,
  Calendar,
  Lock,
  ExternalLink,
  CheckCircle,
  Copy,
  Trash2,
  Edit,
  Sparkles,
  Users,
  AlertCircle
} from 'lucide-react';
import { LiveClass } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LiveClassCountdownCardProps {
  liveClass: LiveClass;
  isTeacher?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (liveClass: LiveClass) => void;
}

export const LiveClassCountdownCard: React.FC<LiveClassCountdownCardProps> = ({
  liveClass,
  isTeacher = false,
  onDelete,
  onEdit
}) => {
  const { language } = useLanguage();
  const [copiedPasscode, setCopiedPasscode] = useState(false);
  const [copiedMeetingId, setCopiedMeetingId] = useState(false);

  // Time remaining calculation
  const calculateTimeLeft = () => {
    const scheduledTime = new Date(liveClass.scheduledAt).getTime();
    const now = Date.now();
    const diff = scheduledTime - now;
    const durationMs = (liveClass.durationMinutes || 90) * 60 * 1000;

    const isEnded = diff < -durationMs;
    // Active from 10 minutes prior to start until class duration concludes
    const isActive = diff <= 10 * 60 * 1000 && !isEnded;
    const isFuture = diff > 10 * 60 * 1000;

    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      diff,
      isEnded,
      isActive,
      isFuture,
      days,
      hours,
      minutes,
      seconds
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [liveClass.scheduledAt, liveClass.durationMinutes]);

  const copyToClipboard = (text: string, type: 'id' | 'pass') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedMeetingId(true);
      setTimeout(() => setCopiedMeetingId(false), 2000);
    } else {
      setCopiedPasscode(true);
      setTimeout(() => setCopiedPasscode(false), 2000);
    }
  };

  const formatBnNumber = (num: number) => {
    if (language !== 'bn') return String(num).padStart(2, '0');
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num)
      .padStart(2, '0')
      .split('')
      .map((d) => bnDigits[parseInt(d, 10)] || d)
      .join('');
  };

  const dateStr = new Date(liveClass.scheduledAt).toLocaleDateString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  );

  const timeStr = new Date(liveClass.scheduledAt).toLocaleTimeString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
  );

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden">
      
      {/* Top Banner & Status Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <div className="flex items-center gap-2">
          {timeLeft.isActive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>{language === 'bn' ? '🔴 লাইভ চলছে' : 'LIVE NOW'}</span>
            </span>
          ) : timeLeft.isEnded ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ক্লাস সমাপ্ত' : 'Ended'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
              <Clock className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'আসন্ন লাইভ ক্লাস' : 'Upcoming Session'}</span>
            </span>
          )}

          {liveClass.courseTitle && (
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
              • {liveClass.courseTitle}
            </span>
          )}
        </div>

        {/* Teacher Actions */}
        {isTeacher && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(liveClass)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                title="সম্পাদনা করুন"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(liveClass.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="মুছে ফেলুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Title & Description */}
      <div>
        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
          {liveClass.title}
        </h3>
        {liveClass.description && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {liveClass.description}
          </p>
        )}
      </div>

      {/* Schedule Info (Date, Time, Duration, Instructor) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 font-medium">{language === 'bn' ? 'তারিখ' : 'Date'}</div>
            <div className="font-bold text-slate-800 dark:text-slate-200">{dateStr}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 font-medium">{language === 'bn' ? 'সময় ও ব্যাপ্তি' : 'Time & Duration'}</div>
            <div className="font-bold text-slate-800 dark:text-slate-200">
              {timeStr} ({liveClass.durationMinutes || 90} {language === 'bn' ? 'মিনিট' : 'min'})
            </div>
          </div>
        </div>

        {liveClass.instructorName && (
          <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
            <Users className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">{language === 'bn' ? 'শিক্ষক / মেন্টর' : 'Instructor'}</div>
              <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{liveClass.instructorName}</div>
            </div>
          </div>
        )}
      </div>

      {/* COUNTDOWN TIMER DISPLAY */}
      {!timeLeft.isEnded && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-bold mb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {timeLeft.isActive
                  ? language === 'bn'
                    ? 'ক্লাস চলছে! এখনই যোগ দিন'
                    : 'Class in Session!'
                  : language === 'bn'
                  ? 'লাইভ ক্লাস শুরু হতে বাকি:'
                  : 'Time Remaining:'}
              </span>
            </span>
            <span className="text-[11px] text-slate-300 font-mono">
              {liveClass.zoomUrl.includes('meet') ? 'Google Meet' : 'Zoom Live Room'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-white/10 rounded-lg p-2 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black font-mono text-white">
                {formatBnNumber(timeLeft.days)}
              </div>
              <div className="text-[10px] text-slate-300 uppercase">{language === 'bn' ? 'দিন' : 'Days'}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-300">
                {formatBnNumber(timeLeft.hours)}
              </div>
              <div className="text-[10px] text-slate-300 uppercase">{language === 'bn' ? 'ঘণ্টা' : 'Hours'}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black font-mono text-amber-300">
                {formatBnNumber(timeLeft.minutes)}
              </div>
              <div className="text-[10px] text-slate-300 uppercase">{language === 'bn' ? 'মিনিট' : 'Mins'}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-black font-mono text-rose-300">
                {formatBnNumber(timeLeft.seconds)}
              </div>
              <div className="text-[10px] text-slate-300 uppercase">{language === 'bn' ? 'সেকেন্ড' : 'Secs'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Credentials (Meeting ID / Passcode) */}
      {(liveClass.meetingId || liveClass.passcode) && (
        <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          {liveClass.meetingId && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Meeting ID:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{liveClass.meetingId}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(liveClass.meetingId!, 'id')}
                className="text-emerald-600 hover:text-emerald-700 p-0.5"
                title="Copy Meeting ID"
              >
                {copiedMeetingId ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {liveClass.passcode && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Passcode:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{liveClass.passcode}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(liveClass.passcode!, 'pass')}
                className="text-emerald-600 hover:text-emerald-700 p-0.5"
                title="Copy Passcode"
              >
                {copiedPasscode ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ZOOM LINK ACTION BUTTON (DISABLED BEFORE TIME / ACTIVE DURING CLASS) */}
      <div className="pt-1">
        {timeLeft.isActive ? (
          // ACTIVE BUTTON
          <a
            href={liveClass.zoomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Video className="w-5 h-5 animate-pulse" />
            <span>{language === 'bn' ? '🔴 সরাসরি লাইভ ক্লাসে যোগ দিন (Zoom)' : 'Join Live Class Now (Zoom)'}</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        ) : timeLeft.isEnded ? (
          // ENDED BUTTON
          <button
            type="button"
            disabled
            className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200 dark:border-slate-700"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{language === 'bn' ? 'এই লাইভ ক্লাসটি সম্পন্ন হয়েছে' : 'This live session has ended'}</span>
          </button>
        ) : (
          // LOCKED / DISABLED BUTTON BEFORE START TIME
          <div className="space-y-1.5">
            <button
              type="button"
              disabled
              className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200 dark:border-slate-700"
            >
              <Lock className="w-4 h-4 text-slate-400" />
              <span>{language === 'bn' ? '🔒 জুম লিংক নিষ্ক্রিয় (ক্লাসের ১০ মিনিট পূর্বে সক্রিয় হবে)' : 'Zoom Link Locked (Unlocks 10m before class)'}</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
              {language === 'bn'
                ? 'টাইমার শূন্যে পৌঁছালে ও ক্লাস শুরুর ১০ মিনিট পূর্বে লিংকটি স্বয়ংক্রিয়ভাবে সক্রিয় হবে।'
                : 'The link will automatically unlock 10 minutes prior to scheduled start time.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
