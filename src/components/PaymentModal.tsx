import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  Smartphone,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Order, PaymentMethod } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

interface PaymentModalProps {
  order?: Order | null;
  items?: Array<{ courseId: string; courseTitle: string; price: number }>;
  totalAmount?: number;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (paidOrder: Order) => void;
  onSuccess?: (paidOrder: any) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  order,
  items,
  totalAmount = 0,
  isOpen,
  onClose,
  onPaymentSuccess,
  onSuccess
}) => {
  const { user, token, demoLogin } = useAuth();
  const { language, t } = useLanguage();
  const { error: toastError } = useToast();

  const [activeOrder, setActiveOrder] = useState<Order | null>(order || null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(order?.paymentMethod || 'BKASH');
  const [mobileNumber, setMobileNumber] = useState('01712345678');
  const [step, setStep] = useState<'DETAILS' | 'OTP' | 'PIN' | 'SUCCESS'>('DETAILS');
  const [otp, setOtp] = useState('123456');
  const [pin, setPin] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [trxId, setTrxId] = useState('');

  // Sync activeOrder if order prop changes
  React.useEffect(() => {
    if (order) {
      setActiveOrder(order);
      if (order.paymentMethod) setSelectedMethod(order.paymentMethod);
    }
  }, [order]);

  // Reset steps when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setStep('DETAILS');
      setLoading(false);
      setTrxId('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayTotal = (activeOrder ? activeOrder.total : totalAmount) ?? 0;
  const displayOrderNumber = activeOrder?.orderNumber || 'ORD-SANDBOX';

  const handleProcessPayment = async () => {
    setLoading(true);
    try {
      let currentOrder = activeOrder;
      let currentToken = token;

      // Ensure user token or auto demo login for seamless student preview
      if (!currentToken) {
        demoLogin('STUDENT');
        currentToken = 'usr-student-1';
      }

      // If we don't have an order yet, create one first via /api/orders/checkout
      if (!currentOrder && items && items.length > 0) {
        const checkoutRes = await fetch('/api/orders/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`
          },
          body: JSON.stringify({
            courseIds: items.map((i) => i.courseId),
            paymentMethod: selectedMethod
          })
        });

        const checkoutData = await checkoutRes.json();
        if (!checkoutRes.ok) {
          toastError(checkoutData.error || 'অর্ডার প্রক্রিয়া করা যায়নি');
          setLoading(false);
          return;
        }

        currentOrder = checkoutData.order;
        setActiveOrder(checkoutData.order);
      }

      const orderIdToPay = currentOrder ? currentOrder.id : (order?.id || 'ord-fallback');
      const generatedTrxId = `${selectedMethod}${Math.floor(10000000 + Math.random() * 90000000)}`;

      const res = await fetch(`/api/orders/${orderIdToPay}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          trxId: generatedTrxId,
          mobileNumber
        })
      });

      const data = await res.json();
      if (!res.ok) {
        toastError(data.error || 'পেমেন্ট ব্যর্থ হয়েছে');
        setLoading(false);
        return;
      }

      setTrxId(generatedTrxId);
      setStep('SUCCESS');
      
      // Celebrate with confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Ignore confetti error if canvas is not ready
      }

      setTimeout(() => {
        if (onSuccess) onSuccess(data.order || currentOrder);
        if (onPaymentSuccess) onPaymentSuccess(data.order || currentOrder);
      }, 1500);
    } catch {
      toastError('পেমেন্ট গেটওয়েতে যোগাযোগ করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const getMethodTheme = () => {
    switch (selectedMethod) {
      case 'BKASH':
        return {
          headerBg: 'bg-[#D12053]',
          accentText: 'text-[#D12053]',
          accentBorder: 'border-[#D12053]',
          btnBg: 'bg-[#D12053] hover:bg-[#b01744]',
          title: 'bKash Payment Gateway'
        };
      case 'NAGAD':
        return {
          headerBg: 'bg-[#E2136E]',
          accentText: 'text-[#E2136E]',
          accentBorder: 'border-[#E2136E]',
          btnBg: 'bg-[#E2136E] hover:bg-[#ba0c57]',
          title: 'Nagad Payment Gateway'
        };
      default:
        return {
          headerBg: 'bg-indigo-600',
          accentText: 'text-indigo-600',
          accentBorder: 'border-indigo-600',
          btnBg: 'bg-indigo-600 hover:bg-indigo-700',
          title: 'SSLCommerz Gateway'
        };
    }
  };

  const theme = getMethodTheme();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        id="bangladesh-payment-modal"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-100"
      >
        {/* Modal Brand Header */}
        <div className={`${theme.headerBg} p-5 text-white flex items-center justify-between transition-colors`}>
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-base leading-tight">{theme.title}</h3>
              <p className="text-[11px] text-white/80">
                {language === 'bn' ? 'সুরক্ষিত মোবাইল পেমেন্ট (Sandbox)' : 'Secured Bangladesh Gateway (Sandbox)'}
              </p>
            </div>
          </div>
          {step !== 'SUCCESS' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Amount Summary */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500">অর্ডার নম্বর:</span>{' '}
            <span className="font-bold text-slate-700 dark:text-slate-200">{displayOrderNumber}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500">মোট প্রদেয়:</span>{' '}
            <span className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">
              ৳{(displayTotal ?? 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'DETAILS' && (
            <div className="space-y-4">
              {/* Method Selector Tabs */}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">
                  {language === 'bn' ? 'পেমেন্ট মাধ্যম বেছে নিন:' : 'Select Gateway:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('BKASH')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedMethod === 'BKASH'
                        ? 'border-[#D12053] bg-[#D12053]/10 text-[#D12053]'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    বিকাশ
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('NAGAD')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedMethod === 'NAGAD'
                        ? 'border-[#E2136E] bg-[#E2136E]/10 text-[#E2136E]'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    নগদ
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('SSLCOMMERZ')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedMethod === 'SSLCOMMERZ'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    SSLCommerz
                  </button>
                </div>
              </div>

              {/* Mobile Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {selectedMethod === 'SSLCOMMERZ' ? 'কার্ডহোল্ডারের মোবাইল নম্বর' : `${selectedMethod} অ্যাকাউন্ট নম্বর`}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Smartphone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-slate-500">
                  {language === 'bn'
                    ? 'পরীক্ষামূলক স্যান্ডবক্স মোড - যেকোনো বাংলাদেশি ১১-ডিজিট নম্বর কাজ করবে।'
                    : 'Sandbox Mock Mode - Any 11-digit mobile number works.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="payment-step-proceed-btn"
                  onClick={() => setStep('OTP')}
                  className={`w-full py-3 rounded-xl ${theme.btnBg} text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2`}
                >
                  <span>{language === 'bn' ? 'পরবর্তী ধাপে যান' : 'Proceed'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 'OTP' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="font-bold text-sm">যাচাইকরণ ওটিপি কোড (OTP Verification)</h4>
                <p className="text-xs text-slate-500">
                  {mobileNumber} নম্বরে ৬ সংখ্যার একটি ওটিপি পাঠানো হয়েছে।
                </p>
              </div>

              <div className="space-y-1.5">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center tracking-widest text-xl font-mono py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-center text-[11px] text-slate-400">
                  স্যান্ডবক্স ডিফল্ট ওটিপি: <strong className="text-slate-600 dark:text-slate-300">123456</strong>
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('DETAILS')}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  {language === 'bn' ? 'পেছনে' : 'Back'}
                </button>
                <button
                  id="payment-otp-confirm-btn"
                  onClick={() => setStep('PIN')}
                  className={`flex-1 py-2.5 rounded-xl ${theme.btnBg} text-white font-bold text-sm transition-all`}
                >
                  {language === 'bn' ? 'ওটিপি নিশ্চিত করুন' : 'Confirm OTP'}
                </button>
              </div>
            </div>
          )}

          {step === 'PIN' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="font-bold text-sm">পিন নম্বর প্রদান করুন (Enter PIN)</h4>
                <p className="text-xs text-slate-500">
                  লেনদেন সম্পন্ন করতে আপনার ৪ বা ৫ ডিজিটের গোপন পিন দিন।
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    type="password"
                    maxLength={5}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full text-center tracking-widest text-2xl font-mono py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-center text-[11px] text-slate-400">
                  স্যান্ডবক্স ডেমো পিন: <strong className="text-slate-600 dark:text-slate-300">1234</strong>
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setStep('OTP')}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  {language === 'bn' ? 'পেছনে' : 'Back'}
                </button>
                <button
                  id="payment-final-confirm-btn"
                  disabled={loading}
                  onClick={handleProcessPayment}
                  className={`flex-1 py-3 rounded-xl ${theme.btnBg} text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying...'}</span>
                    </>
                  ) : (
                    <span>{language === 'bn' ? `৳${(displayTotal ?? 0).toLocaleString()} পরিশোধ করুন` : `Pay ৳${(displayTotal ?? 0).toLocaleString()}`}</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="font-extrabold text-xl text-emerald-600 dark:text-emerald-400">
                  {t('paymentSuccess')}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {language === 'bn'
                    ? 'আপনার কোর্স এনরোলমেন্ট সফলভাবে সম্পন্ন হয়েছে।'
                    : 'Your course enrollment has been successfully activated.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{trxId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">পরিশোধিত অর্থ:</span>
                  <span className="font-bold text-emerald-600">৳{(displayTotal ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">পেমেন্ট মেথড:</span>
                  <span className="font-semibold">{selectedMethod}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 animate-pulse">
                {language === 'bn' ? 'কোর্সে রিডাইরেক্ট করা হচ্ছে...' : 'Redirecting to your course...'}
              </p>
            </div>
          )}
        </div>

        {/* Safe Guarantee Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-bit SSL Encrypted & Bangladesh Bank Compliant Sandbox</span>
        </div>
      </div>
    </div>
  );
};
