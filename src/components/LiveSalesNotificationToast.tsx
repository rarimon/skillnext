import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, X, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import { LiveSaleNotification } from '../types';
import { useWebsiteContent } from '../context/WebsiteContentContext';
import { useLanguage } from '../context/LanguageContext';

interface LiveSalesNotificationToastProps {
  onNavigate: (route: string, param?: string) => void;
}

export const LiveSalesNotificationToast: React.FC<LiveSalesNotificationToastProps> = ({ onNavigate }) => {
  const { settings } = useWebsiteContent();
  const { language } = useLanguage();

  const isEnabled = settings.liveSalesNotificationEnabled !== false;
  const intervalSeconds = Math.max(5, settings.liveSalesIntervalSeconds || 8);

  const [salesQueue, setSalesQueue] = useState<LiveSaleNotification[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDismissedSession, setIsDismissedSession] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const displayDurationMs = 6000; // Visible for 6 seconds

  // 1. Fetch live sales notifications from the server (combines real database orders + popular course activities)
  const fetchLiveSales = async () => {
    try {
      const res = await fetch('/api/public/live-sales');
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          setSalesQueue(data.items);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch live sales data:', err);
    }
  };

  useEffect(() => {
    if (!isEnabled || isDismissedSession) return;
    fetchLiveSales();

    // Periodic refetch every 45 seconds to catch new orders placed in the database
    const pollInterval = setInterval(fetchLiveSales, 45000);
    return () => clearInterval(pollInterval);
  }, [isEnabled, isDismissedSession]);

  // 2. Cycle loop: show notification, pause, next
  useEffect(() => {
    if (!isEnabled || isDismissedSession || salesQueue.length === 0) {
      setIsVisible(false);
      return;
    }

    // Initial popup trigger after 3.5 seconds on website
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    return () => clearTimeout(initialTimer);
  }, [isEnabled, isDismissedSession, salesQueue.length]);

  useEffect(() => {
    if (!isVisible || isHovered || salesQueue.length === 0) return;

    // Automatically hide after displayDurationMs
    timerRef.current = setTimeout(() => {
      setIsVisible(false);

      // Schedule next notification after configured interval
      const waitMs = intervalSeconds * 1000;
      setTimeout(() => {
        if (!isDismissedSession) {
          setCurrentIndex((prev) => (prev + 1) % salesQueue.length);
          setIsVisible(true);
        }
      }, waitMs);
    }, displayDurationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible, isHovered, currentIndex, salesQueue.length, intervalSeconds, isDismissedSession]);

  if (!isEnabled || isDismissedSession || salesQueue.length === 0) {
    return null;
  }

  const currentItem = salesQueue[currentIndex % salesQueue.length];
  if (!currentItem) return null;

  const handleCardClick = () => {
    if (currentItem.courseSlug) {
      onNavigate('course-details', currentItem.courseSlug);
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    // Move to next item after regular wait
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % salesQueue.length);
      setIsVisible(true);
    }, intervalSeconds * 1000);
  };

  const handleMuteSession = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    setIsDismissedSession(true);
  };

  return (
    <div
      className="fixed bottom-20 md:bottom-6 left-3 sm:left-6 z-40 max-w-[340px] sm:max-w-[370px] pointer-events-none select-none"
      id="live-sales-notification-container"
    >
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, y: 35, scale: 0.94, x: -15 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, x: -20, transition: { duration: 0.25 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
            className="pointer-events-auto group relative cursor-pointer overflow-hidden rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-black/40 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all p-3 sm:p-3.5"
            role="alert"
            aria-live="polite"
          >
            {/* Top Bar: Live indicator, city tag and dismiss buttons */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {language === 'bn' ? 'লাইভ ভর্তি' : 'Live Enrollment'}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-0.5 truncate">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                  {currentItem.city}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="বন্ধ করুন"
                  aria-label="Close notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Main Content: Thumbnail + Details */}
            <div className="flex items-start gap-3">
              {/* Course Thumbnail */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 shrink-0 shadow-xs">
                <img
                  src={
                    currentItem.courseThumbnail ||
                    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={currentItem.courseTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-0.5 right-0.5 bg-emerald-500 text-white p-0.5 rounded-full shadow-xs">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* Text Information */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {currentItem.studentName}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    {language === 'bn' ? currentItem.actionBn : currentItem.actionEn}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 mt-0.5">
                  {currentItem.courseTitle}
                </h4>

                {/* Footer of card: relative time and action prompt */}
                <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {language === 'bn' ? currentItem.timeAgoBn : currentItem.timeAgoEn}
                  </span>

                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 group-hover:underline">
                    <span>{language === 'bn' ? 'কোর্সটি দেখুন' : 'View Course'}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Countdown Progress Bar at Bottom */}
            {!isHovered && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: displayDurationMs / 1000, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
