import React, { useState, useEffect } from 'react';
import {
  Grid,
  Search,
  Code,
  Smartphone,
  Server,
  Palette,
  Cloud,
  Database,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  Layers,
  ArrowRight,
  BookOpen,
  Users,
  Star,
  Sparkles,
  CheckCircle,
  Clock,
  Compass
} from 'lucide-react';
import { Category } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CategoriesPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Icon map lookup
  const iconMap: Record<string, any> = {
    Code,
    Smartphone,
    Server,
    Palette,
    TrendingUp,
    ShieldCheck,
    Cloud,
    Database,
    Briefcase,
    Layers
  };

  // Color theme map for vibrant badges
  const colorMap: Record<string, { gradient: string; text: string; bg: string }> = {
    'web-development': {
      gradient: 'from-blue-600 to-indigo-700',
      text: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40'
    },
    'ui-ux-design': {
      gradient: 'from-amber-500 to-orange-600',
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40'
    },
    'digital-marketing': {
      gradient: 'from-pink-600 to-rose-700',
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40'
    },
    'networking-security': {
      gradient: 'from-purple-600 to-indigo-800',
      text: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40'
    },
    'mobile-development': {
      gradient: 'from-emerald-500 to-teal-700',
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40'
    },
    'cloud-devops': {
      gradient: 'from-cyan-600 to-blue-800',
      text: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/40'
    },
    'ai-data-science': {
      gradient: 'from-violet-600 to-fuchsia-700',
      text: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/40'
    },
    'freelancing-career': {
      gradient: 'from-teal-600 to-emerald-800',
      text: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/40'
    }
  };

  // Pre-configured rich metadata per category for skills & market demand
  const categoryDetailsMap: Record<
    string,
    { students: string; salaryBn: string; skills: string[]; badge: string }
  > = {
    'web-development': {
      students: '১৮,৫০০+ শিক্ষার্থী',
      salaryBn: 'মাসিক ৪০,০০০ - ১,৫০,০০০+ টাকা',
      skills: ['React.js', 'Next.js', 'Node.js', 'Full Stack', 'Tailwind CSS', 'TypeScript'],
      badge: 'সবচেয়ে জনপ্রিয়'
    },
    'ui-ux-design': {
      students: '৯,২০০+ শিক্ষার্থী',
      salaryBn: 'মাসিক ৩৫,০০০ - ১,২০,০০০+ টাকা',
      skills: ['Figma', 'UX Research', 'Design Systems', 'Wireframing', 'Prototyping'],
      badge: 'হাই ডিমান্ড'
    },
    'digital-marketing': {
      students: '৭,৮০০+ শিক্ষার্থী',
      salaryBn: 'মাসিক ৩০,০০০ - ১,০০,০০০+ টাকা',
      skills: ['Meta Ads', 'Google Ads', 'SEO Mastery', 'Content Strategy', 'Analytics'],
      badge: 'দ্রুত ইনকাম'
    },
    'networking-security': {
      students: '৫,৪০০+ শিক্ষার্থী',
      salaryBn: 'মাসিক ৫০,০০০ - ২,০০,০০০+ টাকা',
      skills: ['Cisco CCNA', 'Linux Enterprise', 'Cyber Defense', 'Packet Tracer', 'Security'],
      badge: 'কর্পোরেট ট্র্যাক'
    },
    'mobile-development': {
      students: '৬,৩০০+ শিক্ষার্থী',
      salaryBn: 'মাসিক ৪৫,০০০ - ১,৮০,০০০+ টাকা',
      skills: ['Flutter', 'Dart', 'React Native', 'Firebase', 'State Management'],
      badge: 'গ্লোবাল ডিমান্ড'
    },
    'cloud-devops': {
      students: '৪,১০০+ শিক্ষার্থী',
      salaryBn: 'মাসিক ৬০,০০০ - ২,৫০,০০০+ টাকা',
      skills: ['Docker', 'Kubernetes', 'AWS Cloud', 'CI/CD Pipelines', 'Terraform'],
      badge: 'সর্বোচ্চ বেতন'
    },
    'ai-data-science': {
      students: '৫,৯০০+ শিক্ষার্থী',
      salaryBn: 'মাসিক ৫৫,০০০ - ২,২০,০০০+ টাকা',
      skills: ['Python', 'Machine Learning', 'Deep Learning', 'LLMs', 'Prompt Engineering'],
      badge: 'ভবিষ্যতের প্রযুক্তি'
    },
    'freelancing-career': {
      students: '১২,১০০+ শিক্ষার্থী',
      salaryBn: 'মাসিক $৫০০ - $৩,০০০+ ডলার',
      skills: ['Upwork Mastery', 'Fiverr Pro', 'Client Communication', 'Proposal Writing'],
      badge: 'রিমোট জব'
    }
  };

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
      })
      .catch((err) => console.error('Failed to load categories:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      (cat.nameBn && cat.nameBn.toLowerCase().includes(q)) ||
      cat.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors pb-24">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/50">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'ক্যারিয়ার ক্যাটাগরি ও স্কিল পাথ' : 'Career Categories & Skill Paths'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight mb-4">
            {language === 'bn' ? (
              <>
                আপনার পছন্দের ডোমেইনে দক্ষ হয়ে{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  ক্যারিয়ার শুরু করুন
                </span>
              </>
            ) : (
              <>
                Master Your Domain &amp; Launch a{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  High-Growth Career
                </span>
              </>
            )}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            {language === 'bn'
              ? 'ওয়েব ডেভেলপমেন্ট, অ্যাপ ডিজাইন, সাইবার সিকিউরিটি থেকে শুরু করে ফ্রিল্যান্সিং — ইন্ডাস্ট্রি-স্ট্যান্ডার্ড কোর্সে এনরোল করুন।'
              : 'From Web Engineering and Mobile Development to Product Design and Cloud DevOps — choose your learning pathway.'}
          </p>

          {/* Quick Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'ক্যাটাগরি বা বিষয় খুঁজুন (যেমন: ওয়েব, ফ্লাটার)...' : 'Search categories or topics...'}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-400 transition-all shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* 2. Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Grid className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {language === 'bn' ? 'সকল লার্নিং ক্যাটাগরি' : 'All Learning Categories'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'bn'
                ? 'যেকোনো ক্যাটাগরিতে ক্লিক করে উক্ত বিষয়ের সকল কোর্স এক্সপ্লোর করুন'
                : 'Click any category card to browse related live & recorded courses'}
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            {filteredCategories.length}টি ক্যাটাগরি
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-850 animate-pulse" />
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Grid className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">
              কোনো ক্যাটাগরি পাওয়া যায়নি
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => {
              const IconComponent = iconMap[cat.icon] || Code;
              const color = colorMap[cat.slug] || {
                gradient: 'from-emerald-600 to-teal-700',
                text: 'text-emerald-600 dark:text-emerald-400',
                bg: 'bg-emerald-50 dark:bg-emerald-950/40'
              };
              const meta = categoryDetailsMap[cat.slug] || {
                students: '৫,০০০+ শিক্ষার্থী',
                salaryBn: 'মাসিক ৪০,০০০+ টাকা',
                skills: ['Core Concepts', 'Hands-on Projects', 'Industry Tools'],
                badge: 'পপুলার'
              };

              return (
                <div
                  key={cat.id}
                  onClick={() => onNavigate('courses', cat.slug)}
                  className="group relative cursor-pointer bg-white dark:bg-slate-900/95 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/70 dark:hover:border-emerald-500/70 shadow-xs hover:shadow-2xl hover:shadow-emerald-950/20 hover:-translate-y-1.5 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between overflow-hidden"
                >
                  {/* Ambient top corner background soft glow on hover */}
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br from-emerald-500/15 to-teal-500/0 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

                  <div>
                    {/* Top Row: Glowing Icon + Badge + Course Count */}
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="relative">
                        <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${color.gradient} opacity-25 blur-md group-hover:opacity-75 transition-opacity`} />
                        <div
                          className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${color.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-105 group-hover:rotate-2 transition-all duration-300`}
                        >
                          <IconComponent className="w-7 h-7 drop-shadow-sm" />
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50 shadow-2xs">
                          {meta.badge}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{cat.courseCount || 1}টি কোর্স উপলব্ধ</span>
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {language === 'bn' && cat.nameBn ? cat.nameBn : cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                      {cat.name}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>

                    {/* Meta highlights: Enrolled learners & market salary in a micro card */}
                    <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 shadow-xs grid grid-cols-2 gap-3 divide-x divide-slate-200 dark:divide-slate-800">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          <div className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                            <Users className="w-3 h-3" />
                          </div>
                          <span>এনরোল্ড শিক্ষার্থী:</span>
                        </div>
                        <div className="font-black text-xs sm:text-sm text-slate-900 dark:text-white pl-0.5">
                          {meta.students}
                        </div>
                      </div>

                      <div className="pl-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          <div className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                            <TrendingUp className="w-3 h-3" />
                          </div>
                          <span>ক্যারিয়ার স্যালারি:</span>
                        </div>
                        <div className="font-black text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 pl-0.5">
                          {meta.salaryBn}
                        </div>
                      </div>
                    </div>

                    {/* Skills Covered Pills */}
                    <div className="mt-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        প্রয়োজনীয় টুলস ও স্কিলস:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {meta.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 group-hover:border-emerald-500/40 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA with smooth arrow button */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      কোর্সগুলো এক্সপ্লোর করুন
                    </span>
                    <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:translate-x-1 transition-all shadow-2xs">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Learning Career Path Recommendation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-emerald-800/40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                ক্যারিয়ার কাউন্সিলিং গাইড
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 leading-tight">
                কোন ক্যাটাগরিটি আপনার জন্য সঠিক তা বুঝতে পারছেন না?
              </h3>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                আমাদের অভিজ্ঞ ক্যারিয়ার কাউন্সিলররা আপনার একাডেমিক ব্যাকগ্রাউন্ড ও আগ্রহ অনুযায়ী সঠিক লার্নিং ট্র্যাক বেছে নিতে সম্পূর্ণ ফ্রিতে সহায়তা করবেন।
              </p>

              <div className="flex flex-wrap gap-4 mt-6">
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20"
                >
                  ফ্রি ক্যারিয়ার কাউন্সেলিং নিন
                </button>
                <button
                  onClick={() => onNavigate('courses')}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 transition-all"
                >
                  সকল কোর্স ফিল্টার করুন
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <CheckCircle className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="font-bold text-sm">হাতে-কলমে প্রজেক্ট</h4>
                <p className="text-xs text-slate-300 mt-1">প্রতিটি ক্যাটাগরিতে অন্তত ৫টি রিয়েল ওয়ার্ল্ড প্রজেক্ট</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <Users className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="font-bold text-sm">১-অন-১ মেন্টরশিপ</h4>
                <p className="text-xs text-slate-300 mt-1">সরাসরি সিনিয়র ইঞ্জিনিয়ারদের সাথে লাইভ ডিসকাশন</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <Clock className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="font-bold text-sm">লাইফটাইম অ্যাক্সেস</h4>
                <p className="text-xs text-slate-300 mt-1">ভবিষ্যতের সকল আপডেট ও রেকর্ডিং সম্পূর্ণ ফ্রিতে পাবেন</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <Briefcase className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="font-bold text-sm">জব প্লেসমেন্ট সাপোর্ট</h4>
                <p className="text-xs text-slate-300 mt-1">টপ পারফর্মারদের জন্য সিভি ফরওয়ার্ডিং ও মক ইন্টারভিউ</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
