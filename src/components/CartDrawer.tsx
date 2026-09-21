import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Tag, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onCheckout?: () => void;
  onNavigate?: (route: any, param?: any) => void;
  onNavigateCheckout?: () => void;
  onNavigateCourses?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onCheckout,
  onNavigate,
  onNavigateCheckout,
  onNavigateCourses
}) => {
  const {
    cart,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    coupon,
    discountAmount,
    subtotal,
    total,
    applyCouponCode,
    removeCoupon
  } = useCart();
  const { language, t } = useLanguage();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const isDrawerOpen = isOpen !== undefined ? isOpen : isCartOpen;

  const handleClose = () => {
    setIsCartOpen(false);
    if (onClose) onClose();
  };

  const handleBrowseCourses = () => {
    handleClose();
    if (typeof onNavigateCourses === 'function') {
      onNavigateCourses();
    } else if (typeof onNavigate === 'function') {
      onNavigate('courses');
    }
  };

  const handleProceedCheckout = () => {
    handleClose();
    if (typeof onCheckout === 'function') {
      onCheckout();
    } else if (typeof onNavigateCheckout === 'function') {
      onNavigateCheckout();
    }
  };

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    const success = await applyCouponCode(couponInput.trim());
    if (success) {
      setCouponInput('');
    }
    setCouponLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                {t('cartTitle')} ({cart.length})
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-base">
                    {t('cartEmpty')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    {language === 'bn'
                      ? 'আপনার পছন্দের কোর্সগুলো খুঁজে নিয়ে কার্টে যোগ করুন এবং ক্যারিয়ার তৈরি করুন।'
                      : 'Explore our wide range of industry-standard courses and boost your skillset.'}
                  </p>
                </div>
                <button
                  onClick={handleBrowseCourses}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
                >
                  {t('browseCoursesBtn')}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                  <span>{cart.length} Courses</span>
                  <button onClick={clearCart} className="hover:text-rose-600 transition-colors">
                    {language === 'bn' ? 'সব মুছুন' : 'Clear All'}
                  </button>
                </div>

                {cart.map((course) => {
                  const price = (course.discountPrice !== undefined ? course.discountPrice : course.price) ?? 0;
                  return (
                    <div
                      key={course.id}
                      className="flex gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-20 h-14 rounded-lg object-cover shrink-0 bg-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-1">
                          {language === 'bn' && course.titleBn ? course.titleBn : course.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {course.instructor?.name || 'মেন্টর'}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                            ৳{(price ?? 0).toLocaleString()}
                          </span>
                          <button
                            onClick={() => removeFromCart(course.id)}
                            className="text-slate-400 hover:text-rose-500 p-1"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Coupon Box */}
                <div className="pt-2">
                  {coupon ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>
                          {coupon.code} ({coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `৳${coupon.discountValue}`} {t('off')})
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-rose-600 hover:text-rose-700 font-semibold text-[11px]"
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
                          placeholder={t('couponCodePlaceholder')}
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase placeholder:normal-case outline-none focus:border-emerald-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={couponLoading || !couponInput.trim()}
                        className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
                      >
                        {couponLoading ? '...' : t('applyCoupon')}
                      </button>
                    </form>
                  )}
                </div>

              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    ৳{(subtotal ?? 0).toLocaleString()}
                  </span>
                </div>
                {(discountAmount || 0) > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>{t('discount')}</span>
                    <span>- ৳{(discountAmount ?? 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>{t('totalAmount')}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ৳{(total ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  id="drawer-proceed-checkout-btn"
                  onClick={handleProceedCheckout}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>{language === 'bn' ? 'চেকআউটে এগিয়ে যান' : t('proceedToCheckout')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    if (typeof onNavigate === 'function') {
                      onNavigate('cart');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'কার্ট পেজ দেখুন' : 'View Full Cart'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
