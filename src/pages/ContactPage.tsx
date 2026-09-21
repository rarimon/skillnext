import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Headphones,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ContactPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'কোর্সে ভর্তি সংক্রান্ত সহায়তা',
    category: 'ADMISSION',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'কোর্সে ভর্তি হওয়ার পর ক্লাসের অ্যাক্সেস কীভাবে পাব?',
      a: 'কোর্স ফি পরিশোধের সাথে সাথেই আপনার স্টুডেন্ট ড্যাশবোর্ডে কোর্সটি আনলক হয়ে যাবে। সেখান থেকে আপনি সরাসরি ভিডিও লেকচার, সোর্স কোড ও রিসোর্স ডাউনলোড করতে পারবেন।'
    },
    {
      q: 'পেমেন্ট কি কি মাধ্যমে করা যাবে?',
      a: 'আমরা বিকাশ (bKash), নগদ (Nagad), রকেট (Rocket), উপায় এবং যেকোনো স্থানীয় ও আন্তর্জাতিক ডেবিট/ক্রেডিট কার্ড সাপোর্ট করি।'
    },
    {
      q: 'কোর্সের কোডিং বা অ্যাসাইনমেন্টে আটকে গেলে সাপোর্ট কীভাবে পাব?',
      a: 'প্রতিটি কোর্সের জন্য আলাদা ডেডিকেটেড ডিসকর্ড চ্যানেল এবং প্রতিদিন নির্ধারিত সময়ে গুগল মিট (Google Meet) লাইভ হেল্পডেস্ক থাকে যেখানে আমাদের মেন্টর ও টিচিং অ্যাসিস্ট্যান্টরা সরাসরি স্ক্রিনশেয়ারের মাধ্যমে সমাধান দেন।'
    },
    {
      q: 'কোর্স শেষে কি সার্টিফিকেট প্রদান করা হবে?',
      a: 'হ্যাঁ, কোর্স কারিকুলাম ও ফাইনাল প্রজেক্ট সফলভাবে জমা দিলে ইউনিক কিউআর কোড যুক্ত আন্তর্জাতিক মানের ডিজিটাল ভেরিফায়েবল সার্টিফিকেট প্রদান করা হবে যা সরাসরি লিঙ্কডইনে শেয়ার করা যায়।'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('অনুগ্রহ করে নাম, ইমেইল এবং বার্তার বিবরণ পূরণ করুন।');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitSuccess(data.message);
        setTicketId(data.ticketId);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'কোর্সে ভর্তি সংক্রান্ত সহায়তা',
          category: 'ADMISSION',
          message: ''
        });
      } else {
        setErrorMessage(data.error || 'বার্তা পাঠানো সম্ভব হয়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।');
      }
    } catch (err) {
      setErrorMessage('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। সরাসরি আমাদের হটলাইনে যোগাযোগ করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors pb-24">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/40">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <Headphones className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? '২৪/৭ সাপোর্ট ও শিক্ষার্থী সেবা' : '24/7 Student Care & Support'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            {language === 'bn' ? (
              <>
                আমরা সাহায্য করতে প্রস্তুত —{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  যেকোনো প্রশ্নে আমাদের সাথে যোগাযোগ করুন
                </span>
              </>
            ) : (
              <>
                We Are Here to Help —{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  Get in Touch with SkillNest
                </span>
              </>
            )}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {language === 'bn'
              ? 'কোর্সের তথ্য, ভর্তি প্রক্রিয়া, পেমেন্ট অথবা ক্যারিয়ার পরামর্শের জন্য আমাদের হটলাইন, হোয়াটসঅ্যাপ বা নিচের ফর্মের মাধ্যমে বার্তা পাঠান।'
              : 'Need guidance choosing the right course or facing enrollment issues? Our dedicated counseling team responds within minutes.'}
          </p>
        </div>
      </section>

      {/* 2. Contact Cards Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Phone / Hotline */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">হটলাইন ও সরাসরি কল</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">সরাসরি কথা বলুন কাউন্সিলরের সাথে</p>
              <div className="mt-3 space-y-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                <a href="tel:+8801800754556" className="block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  +৮৮০ ১৮০০-৭৫৪৫৫৬
                </a>
                <a href="tel:+8801712345678" className="block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  +৮৮০ ১৭১২-৩৪৫৬৭৮
                </a>
              </div>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-4 block">
              টোল ফ্রি ও তাৎক্ষণিক কল
            </span>
          </div>

          {/* Card 2: WhatsApp Chat */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">হোয়াটসঅ্যাপ সাপোর্ট</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">তাৎক্ষণিক মেসেজ ও ফাইল শেয়ার</p>
              <p className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
                +৮৮০ ১৭১২-৩৪৫৬৭৮
              </p>
            </div>
            <a
              href="https://wa.me/8801712345678?text=Hello%20SkillNest,%20I%20want%20to%20know%20about%20your%20courses"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>হোয়াটসঅ্যাপে চ্যাট করুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: Email Support */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">ইমেইল সহায়তা</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">অফিসিয়াল ইনকোয়ারি ও পার্টনারশিপ</p>
              <a
                href="mailto:support@skillnest.academy"
                className="mt-3 block text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors truncate"
              >
                support@skillnest.academy
              </a>
            </div>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-4 block">
              গড় রেসপন্স টাইম: ১৫ মিনিট
            </span>
          </div>

          {/* Card 4: Office Location & Hours */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">প্রধান ক্যাম্পাস ও অফিস</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                লেভেল ৮, ভিশন টেক টাওয়ার, কারওয়ান বাজার, ঢাকা-১২১৫
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>সকাল ৯:০০ - রাত ১০:০০ (সপ্তাহে ৭ দিন)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Form & FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="mb-6">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                বার্তা পাঠান
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                আপনার জিজ্ঞাসা লিখে জানান
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                নিচের ফর্মটি পূরণ করুন, আমাদের ডেডিকেটেড টিম দ্রুত আপনার সাথে যোগাযোগ করবে।
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-600/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-100">
                  আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 mt-2 max-w-md mx-auto">
                  {submitSuccess}
                </p>
                {ticketId && (
                  <div className="inline-block mt-4 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-200">
                    রেফারেন্স টিকেট আইডি: {ticketId}
                  </div>
                )}
                <button
                  onClick={() => {
                    setSubmitSuccess(null);
                    setTicketId(null);
                  }}
                  className="mt-6 block mx-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  নতুন বার্তা পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      আপনার পুরো নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="যেমন: আরিফুল ইসলাম"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      ইমেইল ঠিকানা <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="যেমন: ariful@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      মোবাইল বা হোয়াটসঅ্যাপ নম্বর
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="যেমন: 017XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      আলোচনার বিষয় / ক্যাটাগরি
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    >
                      <option value="ADMISSION">কোর্সে ভর্তি সংক্রান্ত সহায়তা</option>
                      <option value="PAYMENT">পেমেন্ট বা চালান সংক্রান্ত সমস্যা</option>
                      <option value="COUNSELING">ফ্রি ক্যারিয়ার কাউন্সেলিং</option>
                      <option value="CORPORATE">কর্পোরেট ট্রেনিং বা ইনস্টিটিউট পার্টনারশিপ</option>
                      <option value="TECHNICAL">টেকনিক্যাল সাপোর্ট বা লগইন সমস্যা</option>
                      <option value="OTHER">অন্যান্য সাধারণ জিজ্ঞাসা</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    বার্তার শিরোনাম
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="বার্তার মূল বিষয়টি লিখুন"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    আপনার বিস্তারিত বার্তা <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="আপনার প্রশ্ন বা মতামত স্পষ্টভাবে এখানে লিখুন..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span>বার্তা পাঠানো হচ্ছে...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>বার্তা পাঠিয়ে দিন</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: FAQ Accordion (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  সাধারণ প্রশ্নোত্তর (FAQ)
                </h3>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full px-4 py-3 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                            isOpen ? 'rotate-180 text-emerald-500' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850/50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Campus Map Visual */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>ঢাকা ক্যাম্পাস ম্যাপ</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  সরাসরি ভিজিট করুন
                </span>
              </div>

              {/* Styled Mock Interactive Map Container */}
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center p-4 text-center">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:12px_12px]" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto mb-2 shadow-lg animate-bounce">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    স্কিলনেস্ট একাডেমি প্রধান কার্যালয়
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    ভিশন টেক টাওয়ার, কারওয়ান বাজার, ঢাকা
                  </p>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Karwan+Bazar+Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3.5 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>গুগল ম্যাপে দিকনির্দেশনা দেখুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
