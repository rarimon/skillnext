import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Sparkles, ArrowRight, Shield, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { login, register, demoLogin } = useAuth();
  const { language, t } = useLanguage();
  const { success: toastSuccess, error: toastError } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'INSTRUCTOR'>('STUDENT');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'login') {
      const ok = await login(email, password);
      setLoading(false);
      if (ok) {
        toastSuccess(language === 'bn' ? 'লগইন সফল হয়েছে!' : 'Logged in successfully!');
        onClose();
      }
    } else {
      const ok = await register(name, email, password, phone, selectedRole);
      setLoading(false);
      if (ok) {
        toastSuccess(
          selectedRole === 'INSTRUCTOR'
            ? (language === 'bn' ? 'শিক্ষক অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!' : 'Teacher account created successfully!')
            : (language === 'bn' ? 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!' : 'Account created successfully!')
        );
        onClose();
      }
    }
  };

  const handleDemo = (role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') => {
    demoLogin(role === 'INSTRUCTOR' ? 'instructor' : role === 'ADMIN' ? 'admin' : 'student');
    toastSuccess(
      role === 'ADMIN'
        ? (language === 'bn' ? 'অ্যাডমিন ডেমো লগইন সফল!' : 'Admin Demo Login Success!')
        : role === 'INSTRUCTOR'
        ? (language === 'bn' ? 'শিক্ষক ডেমো লগইন সফল!' : 'Teacher Demo Login Success!')
        : (language === 'bn' ? 'স্টুডেন্ট ডেমো লগইন সফল!' : 'Student Demo Login Success!')
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {mode === 'login' ? t('loginTitle') : t('registerTitle')}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'login'
              ? (language === 'bn' ? 'আপনার অ্যাকাউন্টে লগইন করুন' : 'Sign in to access your courses')
              : (language === 'bn' ? 'নতুন অ্যাকাউন্ট খুলুন ও ক্যারিয়ার শুরু করুন' : 'Create an account to start learning')}
          </p>
        </div>

        {/* Demo One-Click Login Pills */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            {language === 'bn' ? '⚡ তাৎক্ষণিক ডেমো লগইন (পরীক্ষার জন্য)' : '⚡ Quick Instant Demo Logins'}
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemo('STUDENT')}
              className="px-2 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold hover:border-emerald-500 transition-colors shadow-xs text-center"
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => handleDemo('INSTRUCTOR')}
              className="px-2 py-2 rounded-xl bg-white dark:bg-slate-700 border border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors shadow-xs text-center"
            >
              👨‍🏫 Teacher
            </button>
            <button
              type="button"
              onClick={() => handleDemo('ADMIN')}
              className="px-2 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold hover:border-rose-500 transition-colors shadow-xs flex items-center justify-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-rose-500" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                অ্যাকাউন্টের ধরণ (Account Type)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('STUDENT')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    selectedRole === 'STUDENT'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>শিক্ষার্থী (Student)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('INSTRUCTOR')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    selectedRole === 'INSTRUCTOR'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>শিক্ষক (Instructor)</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">নাম (Full Name)</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={selectedRole === 'INSTRUCTOR' ? 'e.g. ড. রফিকুল ইসলাম (ইন্সট্রাক্টর)' : 'e.g. সাদিয়া ইসলাম'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">ইমেইল ঠিকানা (Email)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">পাসওয়ার্ড (Password)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">ফোন নম্বর (Phone)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>
              {loading
                ? (language === 'bn' ? 'অপেক্ষা করুন...' : 'Please wait...')
                : mode === 'login'
                ? t('loginBtn')
                : t('registerBtn')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch Mode */}
        <div className="pt-2 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <p>
              {language === 'bn' ? 'অ্যাকাউন্ট নেই? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-emerald-600 font-bold hover:underline"
              >
                {t('registerBtn')}
              </button>
            </p>
          ) : (
            <p>
              {language === 'bn' ? 'আগে থেকেই অ্যাকাউন্ট আছে? ' : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-600 font-bold hover:underline"
              >
                {t('loginBtn')}
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
