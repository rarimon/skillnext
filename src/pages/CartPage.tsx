import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Tag,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  Sparkles,
  ArrowLeft,
  GraduationCap
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

interface CartPageProps {
  onNavigate: (route: string, param?: string) => void;
  onCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate, onCheckout }) => {
  const {
    cart,
    removeFromCart,
    clearCart,
    coupon,
    discountAmount,
    subtotal,
    total,
    applyCouponCode,
    removeCoupon
  } = useCart();
  const { language, t } = useLanguage();
  const { success: toastSuccess, error: toastError } = useToast();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    const ok = await applyCouponCode(couponInput.trim());
    if (ok) {
      setCouponInput('');
    }
    setCouponLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xs border border-emerald-100 dark:border-emerald-900/50">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {language === 'bn' ? 'আপনার শপিং কার্ট খালি' : 'Your Shopping Cart is Empty'}
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
          {language === 'bn'
            ? 'পছন্দের যেকোনো কোর্স নির্বাচন করে কার্টে যোগ করুন এবং ক্যারিয়ার তৈরিতে এক ধাপ এগিয়ে যান।'
            : 'Explore our wide range of professional courses and enroll to start learning immediately.'}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            id="cart-empty-browse-courses"
            onClick={() => onNavigate('courses')}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('browseCoursesBtn')}</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            {language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={() => onNavigate('courses')}
            className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সকল কোর্সে ফিরে যান' : 'Continue Shopping'}</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <span>{t('cartTitle')}</span>
            <span className="text-sm font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {cart.length} {language === 'bn' ? 'টি কোর্স' : 'courses'}
            </span>
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline self-start sm:self-auto flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'সব কার্ট আইটেম মুছুন' : 'Clear All Items'}</span>
        </button>
      </div>

      {/* Main Grid: Cart Items List on Left, Checkout Box on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((course) => {
            const price = (course.discountPrice !== undefined ? course.discountPrice : course.price) ?? 0;
            const originalPrice = course.price ?? 0;
            const hasDiscount = course.discountPrice !== undefined && course.discountPrice < (course.price ?? 0);

            return (
              <div
                key={course.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-24 sm:w-28 h-16 sm:h-18 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {course.categoryName}
                    </span>
                    <h3
                      onClick={() => onNavigate('course-details', course.slug)}
                      className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 hover:text-emerald-600 transition-colors cursor-pointer"
                    >
                      {language === 'bn' && course.titleBn ? course.titleBn : course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {language === 'bn' ? 'প্রশিক্ষক' : 'By'}: {course.instructor.name}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>{course.durationHours} {t('hours')}</span>
                      <span>•</span>
                      <span>{course.level}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left sm:text-right">
                    <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                      ৳{(price ?? 0).toLocaleString()}
                    </div>
                    {hasDiscount && (
                      <div className="text-xs text-slate-400 line-through">
                        ৳{(originalPrice ?? 0).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeFromCart(course.id)}
                    title={language === 'bn' ? 'কার্ট থেকে মুছুন' : 'Remove item'}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Quick Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              {language === 'bn'
                ? '৭ দিনের সম্পূর্ণ মানিব্যাক গ্যারান্টি। কোনো প্রশ্ন ছাড়া রিফান্ড পাবেন।'
                : '7-Day Full Money-Back Guarantee. Risk-free enrollment.'}
            </span>
          </div>
        </div>

        {/* Right: Checkout & Coupon Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
              {language === 'bn' ? 'অর্ডার সারাংশ' : 'Order Summary'}
            </h2>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ৳{(subtotal ?? 0).toLocaleString()}
                </span>
              </div>

              {(discountAmount || 0) > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>{t('discount')}</span>
                  <span>- ৳{(discountAmount ?? 0).toLocaleString()}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {t('totalAmount')}
                </span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ৳{(total ?? 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Coupon Code Form */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                {language === 'bn' ? 'ডিসকাউন্ট কুপন কোড' : 'Have a coupon code?'}
              </label>

              {coupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      {coupon.code} ({coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `৳${coupon.discountValue}`} ছাড়)
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-600 hover:text-rose-700 font-bold text-xs cursor-pointer"
                  >
                    {language === 'bn' ? 'মুছে ফেলুন' : 'Remove'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder={t('couponCodePlaceholder') || 'SKILL20'}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase placeholder:normal-case outline-none focus:border-emerald-500 font-mono font-bold"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-bold disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {couponLoading ? '...' : t('applyCoupon')}
                  </button>
                </form>
              )}

              {/* Quick Suggestion Pills */}
              {!coupon && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-slate-400">ট্রাই করুন:</span>
                  <button
                    type="button"
                    onClick={() => applyCouponCode('SKILL20')}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-bold hover:bg-emerald-100 transition-colors"
                  >
                    SKILL20 (20% ছাড়)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyCouponCode('SAVE10')}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-mono font-bold hover:bg-teal-100 transition-colors"
                  >
                    SAVE10
                  </button>
                </div>
              )}
            </div>

            {/* Checkout Action Button */}
            <button
              id="cart-page-checkout-btn"
              onClick={onCheckout}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{t('proceedToCheckout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Payment Methods Badges */}
            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-400 block mb-2">
                {language === 'bn' ? 'সহজ ও নিরাপদ পেমেন্ট মেথড' : 'Supported Payment Methods'}
              </span>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                <span className="px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900/40">bKash</span>
                <span className="px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 dark:border-amber-900/40">Nagad</span>
                <span className="px-2 py-1 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 border border-purple-200 dark:border-purple-900/40">Rocket</span>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Cards</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
