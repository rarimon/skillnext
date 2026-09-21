import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useWebsiteContent } from '../context/WebsiteContentContext';

interface TopPromoAdsBannerProps {
  onNavigate: (route: string, param?: string) => void;
}

export const TopPromoAdsBanner: React.FC<TopPromoAdsBannerProps> = ({ onNavigate }) => {
  const { settings } = useWebsiteContent();
  const [isVisible, setIsVisible] = useState(() => {
    // Check if dismissed in this session
    return sessionStorage.getItem('skillnest_top_ads_closed') !== 'true';
  });

  const { language } = useLanguage();
  const { applyCouponCode } = useCart();

  if (!isVisible || settings.topPromoEnabled === false) return null;

  const promoCode = settings.topPromoCode || 'NINE';
  const promoTitle = (language === 'bn' ? settings.topPromoTitleBn : settings.topPromoTitleEn) || '9.9 SPECIAL OFFER';
  const promoDiscount = (language === 'bn' ? settings.topPromoDiscountBn : settings.topPromoDiscountEn) || '৩৯% স্কলারশিপ';
  const promoSub = (language === 'bn' ? settings.topPromoSubBn : settings.topPromoSubEn) || 'সকল টেক কোর্সে';
  const promoValidity = (language === 'bn' ? settings.topPromoValidityBn : settings.topPromoValidityEn) || 'চলবে ০১-০৯ সেপ্টেম্বর';

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    sessionStorage.setItem('skillnest_top_ads_closed', 'true');
  };

  const handleEnrollClick = async () => {
    if (promoCode) {
      await applyCouponCode(promoCode);
    }
    onNavigate('courses');
  };

  return (
    <aside
      id="top-promo-ads-banner"
      aria-label="Promotional Announcement"
      className="relative w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-sans border-b border-amber-500/30 overflow-hidden select-none z-50 transition-all"
    >
      {/* Subtle Pattern & Shine */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.4),transparent_60%)] pointer-events-none" />
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/30 rounded-full blur-xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-1.5 sm:py-2 flex items-center justify-between gap-2 relative z-10">
        
        {/* Banner Content (Clickable) */}
        <div
          onClick={handleEnrollClick}
          className="flex-1 flex items-center justify-center sm:justify-start gap-1.5 sm:gap-3 cursor-pointer text-xs font-black overflow-hidden"
        >
          {/* Mobile concise view */}
          <div className="flex sm:hidden items-center gap-1.5 min-w-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase shrink-0 animate-pulse">
              <Sparkles className="w-2.5 h-2.5 fill-yellow-300 text-yellow-300" />
              <span>{promoTitle}</span>
            </span>
            <span className="text-rose-950 font-black text-xs truncate">
              {promoDiscount}
            </span>
            <span className="bg-emerald-800 text-yellow-300 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0">
              {promoCode}
            </span>
            <span className="inline-flex items-center gap-0.5 bg-yellow-300 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black shrink-0">
              <span>Enroll</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>

          {/* Tablet & Desktop expanded view */}
          <div className="hidden sm:flex flex-wrap items-center gap-2 sm:gap-3.5">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-xs animate-pulse">
              <Sparkles className="w-3 h-3 fill-yellow-300 text-yellow-300" />
              <span>{promoTitle}</span>
            </div>

            {/* Offer Highlight Text */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-rose-900 font-black text-sm sm:text-base">
                {promoDiscount}
              </span>
              <span className="hidden md:inline text-slate-900 font-bold">
                {promoSub}
              </span>
            </div>

            {/* Promocode Pill */}
            <div className="flex items-center gap-1 bg-emerald-800 text-white px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-bold font-mono shadow-xs">
              <Tag className="w-3 h-3 text-emerald-300" />
              <span>PROMO: <strong className="text-yellow-300 tracking-wider">{promoCode}</strong></span>
            </div>

            {/* Validity Date */}
            <span className="hidden lg:inline-block text-[11px] bg-red-700 text-white px-2 py-0.5 rounded font-bold">
              {promoValidity}
            </span>

            {/* Action CTA Button */}
            <div className="inline-flex items-center gap-1 bg-yellow-300 hover:bg-yellow-200 text-slate-950 px-3 py-0.5 rounded-full text-xs font-black shadow-xs transition-colors border border-amber-600/30">
              <span>Enroll Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          id="close-top-ads-banner-btn"
          type="button"
          onClick={handleClose}
          title={language === 'bn' ? 'বিজ্ঞাপনটি বন্ধ করুন' : 'Dismiss banner'}
          className="p-1 rounded-full text-slate-800 hover:text-rose-700 hover:bg-amber-300/60 transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </aside>
  );
};
