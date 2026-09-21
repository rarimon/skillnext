import React, { useState, useEffect } from 'react';
import { Sparkles, X, Tag, ArrowRight, Clock, CheckCircle, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWebsiteContent } from '../context/WebsiteContentContext';

interface PromoAdsPopupModalProps {
  onNavigate: (route: string, param?: string) => void;
}

export const PromoAdsPopupModal: React.FC<PromoAdsPopupModalProps> = ({ onNavigate }) => {
  const { settings } = useWebsiteContent();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { language } = useLanguage();
  const { applyCouponCode } = useCart();
  const { success } = useToast();

  // Simple countdown timer (e.g. 2 days, 14 hours, 35 minutes)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 50
  });

  useEffect(() => {
    if (settings.popupPromoEnabled === false) return;
    // Check if the user already dismissed it in this browser session
    const hasSeenAds = sessionStorage.getItem('skillnest_popup_ads_seen');
    if (!hasSeenAds) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [settings.popupPromoEnabled]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || settings.popupPromoEnabled === false) return null;

  const promoCode = settings.popupPromoCode || 'NINE';
  const promoTitle = (language === 'bn' ? settings.popupPromoTitleBn : settings.popupPromoTitleEn) || '৩৯% পর্যন্ত মেগা স্কলারশিপ!';
  const promoBadge = (language === 'bn' ? settings.popupPromoBadgeBn : settings.popupPromoBadgeEn) || '৯.৯ স্পেশাল স্কলারশিপ মেলা';
  const promoSub = (language === 'bn' ? settings.popupPromoSubBn : settings.popupPromoSubEn) || 'সকল প্রিমিয়াম টেক ও স্কিল কোর্সে সীমিত সময়ের বিশেষ ছাড়';

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('skillnest_popup_ads_seen', 'true');
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(promoCode);
      setCopied(true);
      success(language === 'bn' ? `কুপন কোড ${promoCode} কপি করা হয়েছে!` : `Coupon ${promoCode} copied!`);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleEnrollNow = async () => {
    if (promoCode) {
      await applyCouponCode(promoCode);
    }
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    handleClose();
    onNavigate('courses');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Special Discount Announcement"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-amber-300/40 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-white">
        
        {/* Close Button at top right */}
        <button
          id="close-popup-ads-btn"
          type="button"
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Visual Banner with Campaign Header */}
        <div className="relative bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 p-6 text-slate-950 text-center overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-200/30 rounded-full blur-xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider mb-2 shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            <span>{promoBadge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-slate-950">
            {promoTitle}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
            {promoSub}
          </p>

          {/* Countdown Clock Bar */}
          <div className="mt-4 inline-flex items-center gap-2 bg-slate-950/80 text-white px-3.5 py-1.5 rounded-full text-xs font-mono font-bold shadow-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>অফারের সময় বাকি:</span>
            <span className="text-amber-400 font-black">
              {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-7 space-y-5">
          
          {/* Feature Highlights */}
          <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{settings.trustBullet1 || 'আজীবন অ্যাক্সেস ও প্রজেক্টভিত্তিক হ্যান্ডস-অন কারিকুলাম'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{settings.trustBullet2 || '১-অন-১ ডেডিকেটেড মেন্টর সাপোর্ট ও কোড রিভিউ'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{settings.trustBullet3 || 'ভেরিফায়েড ডিজিটাল সার্টিফিকেট ও রিজিউমে সাপোর্ট'}</span>
            </div>
          </div>

          {/* Promo Code Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-700/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 block">
                  স্পেশাল প্রোমোকোড
                </span>
                <span className="text-base font-black font-mono tracking-widest text-slate-900 dark:text-white">
                  {promoCode}
                </span>
              </div>
            </div>

            <button
              id="copy-popup-promocode-btn"
              type="button"
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              id="popup-ads-enroll-btn"
              type="button"
              onClick={handleEnrollNow}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{language === 'bn' ? 'কোর্সসমূহ ব্রাউজ করুন ও স্কলারশিপ নিন' : 'Explore Courses with Scholarship'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="dismiss-popup-ads-btn"
              type="button"
              onClick={handleClose}
              className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer text-center"
            >
              {language === 'bn' ? 'ধন্যবাদ, পরবর্তীতে দেখব' : 'Dismiss for now'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
