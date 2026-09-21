import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onNavigate: (route: string, param?: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onNavigate
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const { login, register, demoLogin, user } = useAuth();
  const { language, t } = useLanguage();
  const { success: toastSuccess, error: toastError } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'INSTRUCTOR'>('STUDENT');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, show quick redirect option
  if (user) {
    const dashboardRoute =
      user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
        ? 'admin'
        : user.role === 'INSTRUCTOR'
        ? 'teacher-dashboard'
        : 'student-dashboard';

    const dashboardLabel =
      user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
        ? 'অ্যাডমিন প্যানেলে যান'
        : user.role === 'INSTRUCTOR'
        ? 'শিক্ষক ড্যাশবোর্ডে যান'
        : 'আমার ড্যাশবোর্ডে যান';

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {language === 'bn' ? 'আপনি ইতিমধ্যে লগইন আছেন' : 'You are already logged in'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? `স্বাগতম, ${user.name}! আপনার ড্যাশবোর্ডে প্রবেশ করুন।`
              : `Welcome back, ${user.name}! Access your dashboard.`}
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => onNavigate(dashboardRoute)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
            >
              <span>{dashboardLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('courses')}
              className="w-full py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer transition-colors"
            >
              {language === 'bn' ? 'সকল কোর্স ঘুরে দেখুন' : 'Browse All Courses'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toastError(language === 'bn' ? 'অনুগ্রহ করে সকল তথ্য পূরণ করুন' : 'Please fill all required fields');
      return;
    }

    if (mode === 'register') {
      if (!name) {
        toastError(language === 'bn' ? 'আপনার নাম লিখুন' : 'Please enter your name');
        return;
      }
      if (password !== confirmPassword) {
        toastError(language === 'bn' ? 'পাসওয়ার্ড দুটি মিলছে না' : 'Passwords do not match');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const ok = await login(email, password);
        if (ok) {
          toastSuccess(language === 'bn' ? 'লগইন সফল হয়েছে! স্বাগতম।' : 'Login successful! Welcome back.');
          onNavigate('student-dashboard');
        } else {
          toastError(language === 'bn' ? 'ভুল ইমেইল বা পাসওয়ার্ড' : 'Invalid email or password');
        }
      } else {
        const ok = await register(name, email, password, phone, selectedRole);
        if (ok) {
          toastSuccess(
            selectedRole === 'INSTRUCTOR'
              ? (language === 'bn' ? 'শিক্ষক অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!' : 'Teacher account created successfully!')
              : (language === 'bn' ? 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!' : 'Account registered successfully!')
          );
          onNavigate(selectedRole === 'INSTRUCTOR' ? 'teacher-dashboard' : 'student-dashboard');
        } else {
          toastError(language === 'bn' ? 'রেজিস্ট্রেশন ব্যর্থ হয়েছে' : 'Registration failed');
        }
      }
    } catch {
      toastError(language === 'bn' ? 'নেটওয়ার্ক সংযোগে সমস্যা হয়েছে' : 'Connection error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = (role: 'student' | 'instructor' | 'admin') => {
    demoLogin(role);
    toastSuccess(
      role === 'admin'
        ? (language === 'bn' ? 'অ্যাডমিন ডেমো লগইন সফল!' : 'Admin Demo Login Success!')
        : role === 'instructor'
        ? (language === 'bn' ? 'শিক্ষক ডেমো লগইন সফল!' : 'Teacher Demo Login Success!')
        : (language === 'bn' ? 'স্টুডেন্ট ডেমো লগইন সফল!' : 'Student Demo Login Success!')
    );
    onNavigate(role === 'admin' ? 'admin' : role === 'instructor' ? 'teacher-dashboard' : 'student-dashboard');
  };

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Left Side: Brand Highlights Banner */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl tracking-tight">
                Skill<span className="text-emerald-300">Nest</span> Academy
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                {language === 'bn'
                  ? 'আপনার টেক ক্যারিয়ার শুরু করুন সহজে'
                  : 'Kickstart Your Tech Career Today'}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
                {language === 'bn'
                  ? 'হাতে-কলমে প্রজেক্ট, অভিজ্ঞ ইন্ডাস্ট্রি মেন্টর ও আন্তর্জাতিক মানের ভেরিফায়েড সার্টিফিকেট।'
                  : 'Hands-on projects, industry mentors, and verifiable online credentials.'}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-emerald-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{language === 'bn' ? 'আজীবন যেকোনো ডিভাইসে অ্যাক্সেস' : 'Lifetime access on any device'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-emerald-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{language === 'bn' ? 'ইন্ডাস্ট্রি-স্ট্যান্ডার্ড কারিকুলাম' : 'Curated industry curriculum'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-emerald-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{language === 'bn' ? 'সরাসরি প্রজেক্ট রিভিউ ও সাপোর্ট' : 'Project reviews & 24/7 community'}</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-8 border-t border-white/10 mt-6 flex items-center gap-3 text-xs text-emerald-200">
            <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>
              {language === 'bn'
                ? '১০০% নিরাপদ ও সুরক্ষিত রেজিস্ট্রেশন'
                : '100% Encrypted & Secure Platform'}
            </span>
          </div>

          {/* Decorative Glow */}
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Right Side: Auth Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 mb-6">
            <button
              type="button"
              id="auth-tab-login"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('navLogin')}
            </button>
            <button
              type="button"
              id="auth-tab-register"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('navRegister')}
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {mode === 'login'
                ? (language === 'bn' ? 'অ্যাকাউন্টে লগইন করুন' : 'Sign in to your account')
                : (language === 'bn' ? 'নতুন শিক্ষার্থী নিবন্ধন' : 'Create student account')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'login'
                ? (language === 'bn' ? 'আপনার নিবন্ধিত ইমেইল ও পাসওয়ার্ড প্রদান করুন।' : 'Enter your email and password below.')
                : (language === 'bn' ? 'মাত্র ১ মিনিটে ফ্রি অ্যাকাউন্ট তৈরি করুন।' : 'Sign up in less than a minute to start learning.')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  {language === 'bn' ? 'অ্যাকাউন্টের ধরণ নির্বাচন করুন' : 'Select Account Type'} *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('STUDENT')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedRole === 'STUDENT'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>{language === 'bn' ? 'শিক্ষার্থী (Student)' : 'Student'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('INSTRUCTOR')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedRole === 'INSTRUCTOR'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{language === 'bn' ? 'শিক্ষক (Teacher)' : 'Teacher'}</span>
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'bn' ? 'আপনার পুরো নাম' : 'Full Name'} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={
                      selectedRole === 'INSTRUCTOR'
                        ? (language === 'bn' ? 'যেমন: ড. রফিকুল ইসলাম' : 'Dr. Rafiqul Islam')
                        : (language === 'bn' ? 'যেমন: আরিফুল ইসলাম' : 'John Doe')
                    }
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {language === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'bn' ? 'মোবাইল নম্বর (বিকাশ/নগদ এর জন্য)' : 'Mobile Phone (Optional)'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'} *
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => toastSuccess(language === 'bn' ? 'ডেমো ক্রেডেনশিয়াল নিচে দেওয়া আছে!' : 'Use 1-click demo login below')}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'bn' ? 'পুনরায় পাসওয়ার্ড লিখুন' : 'Confirm Password'} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              id="auth-submit-btn"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>
                {loading
                  ? (language === 'bn' ? 'অপেক্ষা করুন...' : 'Processing...')
                  : (mode === 'login' ? t('navLogin') : t('navRegister'))}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3 text-center">
              {language === 'bn' ? '⚡ টেস্ট করার জন্য এক-ক্লিক ডেমো লগইন' : '⚡ 1-Click Instant Demo Login'}
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="demo-student-login-btn"
                onClick={() => handleDemo('student')}
                className="py-2 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer text-center"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{language === 'bn' ? 'স্টুডেন্ট' : 'Student'}</span>
              </button>

              <button
                type="button"
                id="demo-teacher-login-btn"
                onClick={() => handleDemo('instructor')}
                className="py-2 px-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer text-center"
              >
                <GraduationCap className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{language === 'bn' ? 'শিক্ষক' : 'Teacher'}</span>
              </button>

              <button
                type="button"
                id="demo-admin-login-btn"
                onClick={() => handleDemo('admin')}
                className="py-2 px-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer text-center"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{language === 'bn' ? 'এডমিন' : 'Admin'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
