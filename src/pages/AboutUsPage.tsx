import React from 'react';
import {
  Sparkles,
  Target,
  Eye,
  Award,
  Users,
  CheckCircle,
  Briefcase,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Building2,
  Rocket,
  Heart,
  MessageSquare,
  ArrowRight,
  Code,
  Globe2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AboutUsPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();

  const milestones = [
    {
      year: '২০২২',
      title: 'যাত্রার সূচনা',
      desc: 'মাত্র ৩ জন সফটওয়্যার আর্কিটেক্ট ও ১০০ জন আগ্রহী শিক্ষার্থী নিয়ে স্কিলনেস্ট একাডেমির শুভ সূচনা।'
    },
    {
      year: '২০২৩',
      title: '১০,০০০+ লার্নার মাইলফলক',
      desc: 'লাইভ প্রজেক্ট ভিত্তিক কারিকুলাম ও সার্বক্ষণিক মেন্টরশিপের মাধ্যমে দ্রুত শিক্ষার্থীদের আস্থা অর্জন।'
    },
    {
      year: '২০২৪',
      title: 'কর্পোরেট পার্টনারশিপ',
      desc: '৫০টিরও বেশি শীর্ষস্থানীয় দেশি ও আন্তর্জাতিক আইটি প্রতিষ্ঠানের সাথে জব প্লেসমেন্ট চুক্তি সম্পাদন।'
    },
    {
      year: 'বর্তমান',
      title: '৪৫,০০০+ সফল গ্র্যাজুয়েট',
      desc: 'বাংলাদেশের অন্যতম শীর্ষ ও নির্ভরযোগ্য টেক স্কিল ডেভেলপমেন্ট প্ল্যাটফর্মে রূপান্তর।'
    }
  ];

  const coreValues = [
    {
      icon: Target,
      title: 'প্র্যাকটিকাল ফার্স্ট লার্নিং',
      desc: 'শুধু থিওরি নয়, প্রতিটি লেকচারের সাথে থাকে রিয়েল ওয়ার্ল্ড ইন্ডাস্ট্রি প্রজেক্ট ও হ্যান্ডস-অন কোডিং।'
    },
    {
      icon: Users,
      title: 'ডেডিকেটেড ১-অন-১ মেন্টরশিপ',
      desc: 'কোডিং ইরর বা কনসেপ্ট বুঝতে সমস্যা হলে সার্বক্ষণিক লাইভ স্ক্রিনশেয়ার হেল্পডেস্ক ও ডিসকর্ড সাপোর্ট।'
    },
    {
      icon: Briefcase,
      title: 'ক্যারিয়ার প্লেসমেন্ট নেটওয়ার্ক',
      desc: 'সিভি অপটিমাইজেশন, মক ইন্টারভিউ এবং শীর্ষ টেক কোম্পানিতে সরাসরি সুপারিশের সুযোগ।'
    },
    {
      icon: ShieldCheck,
      title: 'ভেরিফায়েবল সার্টিফিকেট',
      desc: 'প্রতিটি কোর্সে সফল সমাপনীতে কিউআর কোড ভেরিফায়েড আন্তর্জাতিক মানের ডিজিটাল সনদপত্র।'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors pb-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/40">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'আমাদের গল্প ও দর্শন' : 'Our Story & Vision'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            {language === 'bn' ? (
              <>
                দক্ষতাই বদলে দেয় ভবিষ্যৎ —{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  বিশ্বমানের টেক ক্যারিয়ার গড়ার প্ল্যাটফর্ম
                </span>
              </>
            ) : (
              <>
                Skills Transform the Future —{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  World-Class Tech Career Platform
                </span>
              </>
            )}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-10">
            {language === 'bn'
              ? 'স্কিলনেস্ট একাডেমি কেবল একটি অনলাইন কোর্স প্ল্যাটফর্ম নয়, এটি তরুণ প্রজন্মের জন্য একটি পূর্ণাঙ্গ ক্যারিয়ার রূপান্তর ইকোসিস্টেম। আমাদের লক্ষ্য বাংলাদেশের প্রতিটি তরুণ-তরুণীকে আন্তর্জাতিক মানের প্রযুক্তি দক্ষতায় দক্ষ করে গড়ে তোলা।'
              : 'SkillNest Academy is more than an online learning portal — it is a career transformation ecosystem dedicated to empowering tomorrow’s technology leaders.'}
          </p>

          {/* Core Stat Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">৪৫,০০০+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">সক্রিয় শিক্ষার্থী</div>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">৩৫+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">ইন্ডাস্ট্রি মেন্টর</div>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">৯৪%</div>
              <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">প্লেসমেন্ট রেট</div>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-3xl sm:text-4xl font-black text-amber-400">৪.৯ ★</div>
              <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">অ্যাভারেজ রেটিং</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
              <Target className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
              আমাদের লক্ষ্য (Our Mission)
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              দেশের সর্বত্র ছড়িয়ে থাকা প্রতিভাবান শিক্ষার্থীদের জন্য প্রযুক্তির সর্বাধুনিক শিক্ষা সহজলভ্য ও সাশ্রয়ী করা। প্রথাগত তাত্ত্বিক শিক্ষার গণ্ডি পেরিয়ে ইন্ডাস্ট্রি-উপযোগী বাস্তব প্রজেক্টের মাধ্যমে প্রতিটি শিক্ষার্থীকে প্রথম দিন থেকেই প্রফেশনাল হিসেবে প্রস্তুত করা।
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
              <Eye className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
              আমাদের ভিশন (Our Vision)
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              ২০৩০ সালের মধ্যে অন্তত ১ লক্ষ দক্ষ সফটওয়্যার ইঞ্জিনিয়ার, ডিজাইনার এবং ক্লাউড স্পেশালিস্ট তৈরি করে বৈশ্বিক প্রযুক্তি বাজারে বাংলাদেশের শক্ত অবস্থান নিশ্চিত করা। স্মার্ট বাংলাদেশ বিনির্মাণে প্রযুক্তি শিক্ষার প্রধান বাতিঘর হওয়া।
            </p>
          </div>
        </div>
      </section>

      {/* 3. Core Pillars / Why SkillNest is Different */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            কেন স্কিলনেস্ট অনন্য
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">
            আমাদের ৪টি মূল স্তম্ভ যা আপনার সাফল্য নিশ্চিত করে
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">
            আমরা শুধু ভিডিও দেখাই না — বাস্তব কাজের মতো টিমওয়ার্ক, প্রজেক্ট রিভিউ ও সার্বক্ষণিক জবাবদিহিতা নিশ্চিত করি।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                  <val.icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
                  {val.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {val.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>নিশ্চিত মানদণ্ড</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Timeline / Journey */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            আমাদের অগ্রযাত্রা
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">
            যেভাবে গড়ে উঠলো স্কিলনেস্ট পরিবার
          </h2>
        </div>

        <div className="space-y-6">
          {milestones.map((ms, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="px-4 py-2 rounded-2xl bg-emerald-600 text-white font-black text-base shrink-0 shadow-sm">
                {ms.year}
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {ms.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {ms.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Career Placement Partners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            আমাদের অ্যালামনাইরা যেখানে কাজ করছেন
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 mb-8">
            শীর্ষ দেশি ও বৈশ্বিক টেক প্রতিষ্ঠানে আমাদের গ্র্যাজুয়েটদের পদচারণা
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-80">
            {['Brain Station 23', 'bKash', 'Pathao', 'Chaldal', 'Enosis Solutions', 'Optimizely', 'Samsung R&D', 'Therap BD'].map((brand, i) => (
              <div
                key={i}
                className="px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 font-black text-sm text-slate-700 dark:text-slate-200"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-white text-center border border-emerald-800/40 relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-4">
              আজই শুরু হোক আপনার নতুন ক্যারিয়ারের শুভ সূচনা
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              দেরি না করে আমাদের অভিজ্ঞ মেন্টরদের সাথে যুক্ত হোন এবং আপনার পছন্দের বিষয়ে দক্ষতা অর্জন করে নিজেকে প্রস্তুত করুন।
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('courses')}
                className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2"
              >
                <span>কোর্সসমূহ দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('instructors')}
                className="px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
              >
                মেন্টর তালিকা দেখুন
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
