import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  ShieldCheck,
  Tag,
  CreditCard,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  Lock,
  Award,
  Copy,
  Check,
  CheckCircle2,
  Trash2,
  BookOpen,
  Sparkles,
  Download,
  Printer,
  Calendar,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Course } from '../types';
import { OfficialInvoice } from '../components/OfficialInvoice';

interface CheckoutPageProps {
  onNavigate: (route: string, param?: string) => void;
  directItems?: Array<{ courseId: string; courseTitle: string; price: number; course?: Course }>;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate, directItems }) => {
  const { user } = useAuth();
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
  const { language } = useLanguage();
  const { success: toastSuccess, error: toastError } = useToast();

  // Active items: if cart has items, use cart; otherwise check directItems
  const checkoutItems = cart.length > 0
    ? cart
    : (directItems?.map(d => d.course).filter(Boolean) as Course[]) || [];

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '01712345678');
  const [district, setDistrict] = useState('ঢাকা');
  const [note, setNote] = useState('');

  // Payment Method
  type Method = 'BKASH' | 'NAGAD' | 'ROCKET' | 'CARD' | 'INSTANT';
  const [paymentMethod, setPaymentMethod] = useState<Method>('BKASH');
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState(user?.phone || '01712345678');
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Sync user details if user loads late
  useEffect(() => {
    if (user) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
      if (user.phone && (!phone || phone === '01712345678')) setPhone(user.phone);
    }
  }, [user]);

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    toastSuccess(language === 'bn' ? 'নম্বর কপি করা হয়েছে' : 'Number copied to clipboard');
    setTimeout(() => setCopiedNumber(false), 2500);
  };

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

  const handlePlaceOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (checkoutItems.length === 0) {
      toastError(language === 'bn' ? 'অর্ডার করার জন্য কার্টে কোনো কোর্স নেই' : 'No courses to checkout');
      return;
    }

    if (!name.trim()) {
      toastError(language === 'bn' ? 'অনুগ্রহ করে আপনার পুরো নাম দিন' : 'Please enter your full name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      toastError(language === 'bn' ? 'সঠিক ইমেইল এড্রেস দিন' : 'Please enter a valid email address');
      return;
    }

    if (!phone.trim()) {
      toastError(language === 'bn' ? 'মোবাইল নম্বর দিন' : 'Please enter your phone number');
      return;
    }

    if ((paymentMethod === 'BKASH' || paymentMethod === 'NAGAD' || paymentMethod === 'ROCKET') && !trxId.trim()) {
      // Auto-generate test TrxId if left empty so user doesn't get blocked
      const autoTrx = `${paymentMethod.slice(0, 2)}${Date.now().toString().slice(-7)}`;
      setTrxId(autoTrx);
    }

    setIsSubmitting(true);

    try {
      const courseIds = checkoutItems.map(c => c.id);
      const token = localStorage.getItem('skillnest_token');

      // 1. Create Order
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          courseIds,
          couponCode: coupon?.code,
          paymentMethod: paymentMethod === 'INSTANT' ? 'BKASH' : paymentMethod
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'অর্ডার প্রক্রিয়া সম্পন্ন করা যায়নি');
      }

      const orderId = data.order.id;
      const finalTrx = trxId.trim() || `TXN${Date.now().toString().slice(-8)}`;

      // 2. Complete Payment & Auto-enroll
      const payRes = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          trxId: finalTrx,
          mobileNumber: senderPhone || phone
        })
      });

      const payData = await payRes.json();
      if (!payRes.ok) {
        throw new Error(payData.error || 'পেমেন্ট ভেরিফিকেশন ব্যর্থ হয়েছে');
      }

      // 3. Complete Checkout success
      clearCart();
      setCompletedOrder({
        ...payData.order,
        studentName: name,
        studentEmail: email,
        studentPhone: phone,
        district
      });

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });

      toastSuccess(
        language === 'bn'
          ? 'অভিনন্দন! আপনার ভর্তি সম্পন্ন হয়েছে।'
          : 'Congratulations! Your enrollment is complete.'
      );
    } catch (err: any) {
      toastError(err.message || 'অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS ORDER RECEIPT VIEW
  if (completedOrder) {
    const firstCourseSlug = completedOrder.items?.[0]?.courseSlug || completedOrder.items?.[0]?.courseId;

    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in zoom-in-95 duration-300 space-y-6">
        
        {/* Celebration Header */}
        <div className="no-print bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {language === 'bn' ? 'ভর্তি সফল হয়েছে! অভিনন্দন' : 'Enrollment Successful! Welcome'}
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1.5 max-w-lg mx-auto">
            {language === 'bn'
              ? 'আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে এবং অফিসিয়াল মানি রিসিট ও ইনভয়েস তৈরি করা হয়েছে।'
              : 'Your enrollment has been confirmed. Below is your official tax receipt and payment invoice.'}
          </p>

          {/* Quick Order Badge Stats */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <div className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs font-mono font-bold text-white/90">
              অর্ডার নং: {completedOrder.orderNumber || completedOrder.id}
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-900/40 backdrop-blur-xs font-bold text-emerald-200">
              পরিশোধিত: ৳{completedOrder.total?.toLocaleString() || '0'}
            </div>
            <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs font-bold text-white">
              লাইফটাইম অ্যাক্সেস সক্রিয়
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => {
                if (firstCourseSlug) {
                  onNavigate('learn', firstCourseSlug);
                } else {
                  onNavigate('student-dashboard');
                }
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>{language === 'bn' ? 'সরাসরি কোর্স শুরু করুন' : 'Start Learning Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('student-dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer border border-emerald-500/30 flex items-center justify-center"
            >
              {language === 'bn' ? 'আমার ড্যাশবোর্ড' : 'My Dashboard'}
            </button>
          </div>
        </div>

        {/* The Official Printable & Downloadable Invoice Component */}
        <OfficialInvoice order={completedOrder} />

      </div>
    );
  }

  // EMPTY CHECKOUT STATE
  if (checkoutItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {language === 'bn' ? 'চেকআউট করার জন্য কোনো কোর্স নির্বাচন করা হয়নি' : 'No courses selected for checkout'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
          {language === 'bn'
            ? 'আমাদের কোর্স তালিকা থেকে আপনার পছন্দের স্কিল বেছে নিয়ে চেকআউট সম্পন্ন করুন।'
            : 'Explore our catalog and pick an industry-standard course to proceed with enrollment.'}
        </p>
        <button
          onClick={() => onNavigate('courses')}
          className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
        >
          <BookOpen className="w-4 h-4" />
          <span>{language === 'bn' ? 'কোর্স ব্রাউজ করুন' : 'Browse Courses'}</span>
        </button>
      </div>
    );
  }

  const finalSubtotal = (cart.length > 0
    ? subtotal
    : checkoutItems.reduce((sum, item) => sum + ((item.discountPrice !== undefined ? item.discountPrice : item.price) ?? 0), 0)) ?? 0;
  const finalDiscount = discountAmount ?? 0;
  const finalPayable = Math.max(0, finalSubtotal - finalDiscount);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Top Breadcrumb & Step Tracker */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <button onClick={() => onNavigate('home')} className="hover:text-emerald-600 cursor-pointer">
            {language === 'bn' ? 'হোম' : 'Home'}
          </button>
          <span>/</span>
          <button onClick={() => onNavigate('courses')} className="hover:text-emerald-600 cursor-pointer">
            {language === 'bn' ? 'কোর্সসমূহ' : 'Courses'}
          </button>
          <span>/</span>
          <span className="text-emerald-600 font-bold">{language === 'bn' ? 'চেকআউট' : 'Checkout'}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <span>{language === 'bn' ? 'নিরাপদ চেকআউট' : 'Secure Checkout'}</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                SSL 256-Bit
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'আপনার তথ্য দিয়ে পেমেন্ট সম্পন্ন করে কোর্সের অ্যাক্সেস নিন।'
                : 'Fill in your student details and complete payment to unlock course access.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="self-start sm:self-auto text-xs font-semibold text-slate-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'আরও কোর্স দেখুন' : 'Add more courses'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout: Left Inputs, Right Summary */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN: Course Review + Student Info + Payment Gateway (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          {/* 1. Selected Courses Review Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? '১. অর্ডারকৃত কোর্সসমূহ' : '1. Selected Courses'}</span>
                <span className="text-xs font-normal text-slate-400">({checkoutItems.length})</span>
              </h2>
              {cart.length > 1 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  {language === 'bn' ? 'সব মুছুন' : 'Clear All'}
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
              {checkoutItems.map((course) => {
                const currentPrice = (course.discountPrice !== undefined ? course.discountPrice : course.price) ?? 0;
                return (
                  <div key={course.id} className="py-3 flex items-center gap-3 group">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-16 h-12 sm:w-20 sm:h-14 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200/60 dark:border-slate-800"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                        {language === 'bn' && course.titleBn ? course.titleBn : course.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="text-emerald-600 font-medium">{course.categoryName}</span>
                        <span>•</span>
                        <span>{course.instructor?.name || 'মেন্টর'}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {currentPrice === 0 ? 'ফ্রি' : `৳${(currentPrice ?? 0).toLocaleString()}`}
                      </div>
                      {course.discountPrice !== undefined && course.discountPrice < (course.price ?? 0) && (
                        <div className="text-[10px] text-slate-400 line-through">
                          ৳{(course.price ?? 0).toLocaleString()}
                        </div>
                      )}
                    </div>
                    {cart.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFromCart(course.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Student & Billing Information Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <UserIcon className="w-4 h-4 text-emerald-600" />
              <span>{language === 'bn' ? '২. প্রশিক্ষার্থীর তথ্য (লগইন ও সার্টিফিকেট)' : '2. Student & Billing Details'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Full Name */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {language === 'bn' ? 'পূর্ণ নাম (সার্টিফিকেটে যেমন থাকবে) *' : 'Full Name (As on Certificate) *'}
                </label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. তানভীর আহমেদ"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {language === 'bn' ? 'ইমেইল এড্রেস (কোর্স এক্সেস পাঠানো হবে) *' : 'Email Address (For LMS Login) *'}
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {language === 'bn' ? 'মোবাইল / হোয়াটসঅ্যাপ নম্বর *' : 'Phone / WhatsApp Number *'}
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:border-emerald-500 font-medium font-mono"
                  />
                </div>
              </div>

              {/* District */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {language === 'bn' ? 'জেলা / ঠিকানা' : 'District / Location'}
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="ঢাকা, বাংলাদেশ"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 text-xs">
                {language === 'bn' ? 'কোনো বিশেষ নির্দেশনা বা প্রশ্ন (ঐচ্ছিক)' : 'Special Note (Optional)'}
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={language === 'bn' ? 'আপনার কোনো জিজ্ঞাসা থাকলে এখানে লিখুন...' : 'Any special notes for instructor or support team...'}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 3. Payment Method Selection Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? '৩. পেমেন্ট পদ্ধতি নির্বাচন করুন' : '3. Payment Method'}</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                ইনস্ট্যান্ট অ্যাক্টিভেশন
              </span>
            </h2>

            {/* Method Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* bKash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('BKASH')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'BKASH'
                    ? 'border-pink-500 bg-pink-50/70 dark:bg-pink-950/30 text-pink-700 dark:text-pink-400 font-bold shadow-xs scale-[1.02]'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-pink-600 text-white flex items-center justify-center font-black text-xs">
                  bK
                </div>
                <span className="text-xs font-bold">bKash (বিকাশ)</span>
              </button>

              {/* Nagad */}
              <button
                type="button"
                onClick={() => setPaymentMethod('NAGAD')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'NAGAD'
                    ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 font-bold shadow-xs scale-[1.02]'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black text-xs">
                  নগদ
                </div>
                <span className="text-xs font-bold">Nagad (নগদ)</span>
              </button>

              {/* Rocket */}
              <button
                type="button"
                onClick={() => setPaymentMethod('ROCKET')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'ROCKET'
                    ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 font-bold shadow-xs scale-[1.02]'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center font-black text-xs">
                  🚀
                </div>
                <span className="text-xs font-bold">Rocket (রকেট)</span>
              </button>

              {/* Card / 1-Click Fast Sandbox */}
              <button
                type="button"
                onClick={() => setPaymentMethod('INSTANT')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'INSTANT'
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs scale-[1.02]'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                  ⚡
                </div>
                <span className="text-xs font-bold">1-Click Test</span>
              </button>
            </div>

            {/* Instruction Container based on selected method */}
            {paymentMethod === 'INSTANT' ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
                <p className="font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'bn' ? '১-ক্লিক ফাস্ট টেস্ট এনরোলমেন্ট' : 'Instant 1-Click Sandbox Enrollment'}</span>
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {language === 'bn'
                    ? 'কোনো ঝামেলা ছাড়াই সরাসরি কোর্সে ভর্তি হতে নিচের বাটনে ক্লিক করুন। ট্রানজেকশন অটোমেটিক ভেরিফাই হয়ে ইনস্ট্যান্ট এক্সেস চালু হবে।'
                    : 'Click Place Order to complete sandbox checkout instantly without typing a transaction ID.'}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-500 font-medium">
                    {language === 'bn' ? 'মার্চেন্ট / পার্সোনাল নম্বর (Send Money):' : 'Merchant Number:'}
                  </span>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs">
                      +880 1712-345678
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber('01712345678')}
                      className="text-slate-400 hover:text-emerald-600 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                    >
                      {copiedNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedNumber ? 'কপি হয়েছে' : 'কপি'}</span>
                    </button>
                  </div>
                </div>

                <ol className="list-decimal list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <li>আপনার {paymentMethod} অ্যাপ থেকে উপরের নম্বরে সর্বমোট <strong>৳{(finalPayable ?? 0).toLocaleString()}</strong> টাকা পাঠান।</li>
                  <li>সফল পেমেন্টের পর এসএমএস বা অ্যাপ থেকে ট্রানজেকশন আইডি (TrxID) সংগ্রহ করুন।</li>
                  <li>নিচের বক্সে TrxID লিখে "অর্ডার সম্পন্ন করুন" বাটনে চাপ দিন।</li>
                </ol>

                {/* TrxID Input */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {language === 'bn' ? 'পেমেন্ট TrxID (যেমন: 9J32KL8P)' : 'Transaction ID (TrxID)'}
                    </label>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                      placeholder="9J32KL8P"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold uppercase outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {language === 'bn' ? 'যে নম্বর থেকে টাকা পাঠিয়েছেন' : 'Sender Mobile Number'}
                    </label>
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Order Summary & Coupon & CTA (4-5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5 lg:sticky lg:top-24">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>{language === 'bn' ? 'অর্ডার সামারি' : 'Order Summary'}</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                {checkoutItems.length} {language === 'bn' ? 'টি কোর্স' : 'Courses'}
              </span>
            </h3>

            {/* Bill Breakdown */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>{language === 'bn' ? 'কোর্সের মোট মূল্য' : 'Subtotal'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ৳{(finalSubtotal ?? 0).toLocaleString()}
                </span>
              </div>

              {(finalDiscount || 0) > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>{language === 'bn' ? 'কুপন ডিসকাউন্ট' : 'Coupon Discount'}</span>
                  <span>- ৳{(finalDiscount ?? 0).toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500">
                <span>{language === 'bn' ? 'প্লাটফর্ম ও পেমেন্ট ফি' : 'Processing Fee'}</span>
                <span className="font-semibold text-emerald-600">{language === 'bn' ? 'ফ্রি (৳০)' : 'Free'}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'সর্বমোট প্রদেয়' : 'Total Payable'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ৳{(finalPayable ?? 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Coupon Code Box */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {language === 'bn' ? 'প্রমোকোড / কুপন প্রয়োগ করুন' : 'Have a coupon code?'}
              </label>

              {coupon ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{coupon.code} (-৳{discountAmount})</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-rose-600 hover:text-rose-700 font-bold text-xs cursor-pointer"
                  >
                    {language === 'bn' ? 'বাদ দিন' : 'Remove'}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="e.g. SKILL20"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold uppercase outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
                  >
                    {couponLoading ? '...' : (language === 'bn' ? 'প্রয়োগ' : 'Apply')}
                  </button>
                </div>
              )}

              {/* Recommended Coupons */}
              {!coupon && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                  <span className="text-slate-400">কুপন:</span>
                  <button
                    type="button"
                    onClick={() => applyCouponCode('SKILL20')}
                    className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-bold hover:bg-emerald-100 cursor-pointer"
                  >
                    SKILL20 (20% ছাড়)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyCouponCode('NINE')}
                    className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-mono font-bold hover:bg-amber-100 cursor-pointer"
                  >
                    NINE (39% অফার)
                  </button>
                </div>
              )}
            </div>

            {/* Place Order CTA Button */}
            <button
              id="place-order-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? (language === 'bn' ? 'অর্ডার প্রসেস হচ্ছে...' : 'Processing Order...')
                  : (language === 'bn' ? `অর্ডার সম্পন্ন করুন (৳${(finalPayable ?? 0).toLocaleString()})` : `Place Order (৳${(finalPayable ?? 0).toLocaleString()})`)}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust and Guarantee Badges */}
            <div className="pt-2 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'bn' ? '১০০% মানিব্যাক গ্যারান্টি (৭ দিনের রিফান্ড)' : '7-Day 100% Money-Back Guarantee'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'bn' ? 'লাইফটাইম এক্সেস ও কমপ্লিশন সার্টিফিকেট' : 'Lifetime Access & Verified Certificate'}</span>
              </div>
            </div>

          </div>

        </div>

      </form>

    </div>
  );
};
