import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Star,
  BookOpen,
  Award,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Mail,
  Linkedin,
  Github,
  Globe,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  X,
  Briefcase,
  TrendingUp,
  Clock,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { Instructor, Course } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MentorsPageProps {
  onNavigate: (route: string, param?: string) => void;
  onEnrollCourse?: (course: Course) => void;
}

export const MentorsPage: React.FC<MentorsPageProps> = ({ onNavigate, onEnrollCourse }) => {
  const { language } = useLanguage();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [selectedMentor, setSelectedMentor] = useState<Instructor | null>(null);

  useEffect(() => {
    fetch('/api/instructors')
      .then((res) => res.json())
      .then((data) => {
        setInstructors(data.instructors || []);
      })
      .catch((err) => console.error('Failed to load mentors:', err))
      .finally(() => setLoading(false));
  }, []);

  const specialtiesList = [
    { id: 'ALL', labelBn: 'সকল মেন্টর', labelEn: 'All Mentors' },
    { id: 'Web', labelBn: 'ওয়েব ও ফুল-স্ট্যাক', labelEn: 'Web & Full Stack' },
    { id: 'Backend', labelBn: 'ব্যাকএন্ড ও এপিআই', labelEn: 'Backend & APIs' },
    { id: 'Design', labelBn: 'ইউআই/ইউএক্স ও ফিগমা', labelEn: 'UI/UX Design' },
    { id: 'Mobile', labelBn: 'মোবাইল অ্যাপস', labelEn: 'Mobile Apps' },
    { id: 'Marketing', labelBn: 'ডিজিটাল মার্কেটিং', labelEn: 'Digital Marketing' },
    { id: 'Security', labelBn: 'সাইবার ও নেটওয়ার্ক', labelEn: 'Security & Network' },
    { id: 'AI', labelBn: 'এআই ও ডেটা সায়েন্স', labelEn: 'AI & Data Science' }
  ];

  const filteredInstructors = instructors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mentor.company && mentor.company.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedSpecialty === 'ALL') return true;
    if (selectedSpecialty === 'Web') return mentor.expertise.toLowerCase().includes('stack') || mentor.expertise.toLowerCase().includes('next');
    if (selectedSpecialty === 'Backend') return mentor.expertise.toLowerCase().includes('laravel') || mentor.expertise.toLowerCase().includes('backend');
    if (selectedSpecialty === 'Design') return mentor.expertise.toLowerCase().includes('design') || mentor.expertise.toLowerCase().includes('figma');
    if (selectedSpecialty === 'Mobile') return mentor.expertise.toLowerCase().includes('mobile') || mentor.expertise.toLowerCase().includes('flutter');
    if (selectedSpecialty === 'Marketing') return mentor.expertise.toLowerCase().includes('marketing') || mentor.expertise.toLowerCase().includes('seo');
    if (selectedSpecialty === 'Security') return mentor.expertise.toLowerCase().includes('network') || mentor.expertise.toLowerCase().includes('security');
    if (selectedSpecialty === 'AI') return mentor.expertise.toLowerCase().includes('ai') || mentor.expertise.toLowerCase().includes('python');

    return true;
  });

  const totalGraduatesTaught = instructors.reduce((acc, curr) => acc + (curr.totalStudents || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors pb-24">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-teal-950 to-slate-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/40">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'শীর্ষ ইন্ডাস্ট্রি এক্সপার্ট মেন্টরস' : 'Top Industry Expert Mentors'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight mb-4">
            {language === 'bn' ? (
              <>
                অভিজ্ঞ মেন্টরদের নির্দেশনায় গড়ে তুলুন{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  আন্তর্জাতিক মানের ক্যারিয়ার
                </span>
              </>
            ) : (
              <>
                Learn from Industry Leaders &amp; Build a{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  Global Standard Career
                </span>
              </>
            )}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            {language === 'bn'
              ? 'দেশ-বিদেশের শীর্ষস্থানীয় টেক জায়ান্ট, ফিনটেক ও বহুজাতিক কোম্পানিতে কর্মরত অভিজ্ঞ প্রকৌশলী ও ডিজাইনারদের থেকে সরাসরি শিখুন।'
              : 'Directly learn from lead software architects, product designers, and senior engineers working in global tech giants.'}
          </p>

          {/* Quick Stat Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {instructors.length > 0 ? `${instructors.length}+` : '১০+'}
              </div>
              <div className="text-xs text-slate-300 font-medium mt-1">
                {language === 'bn' ? 'টপ ইন্ডাস্ট্রি মেন্টর' : 'Expert Mentors'}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {totalGraduatesTaught > 0 ? `${(totalGraduatesTaught / 1000).toFixed(0)}k+` : '৪৫k+'}
              </div>
              <div className="text-xs text-slate-300 font-medium mt-1">
                {language === 'bn' ? 'মোট শিক্ষার্থী পড়িয়েছেন' : 'Students Taught'}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center justify-center gap-1">
                <span>৪.৯</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <div className="text-xs text-slate-300 font-medium mt-1">
                {language === 'bn' ? 'গড় সন্তুষ্টি রেটিং' : 'Average Rating'}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">১০০%</div>
              <div className="text-xs text-slate-300 font-medium mt-1">
                {language === 'bn' ? 'লাইভ ১-টু-১ হেল্পডেস্ক' : '1-on-1 Helpdesk'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Search & Specialty Filter Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-black/30 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full lg:w-96 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'নাম, দক্ষতা বা কোম্পানি দিয়ে খুঁজুন...' : 'Search by name, skill or company...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Specialty Filter Label */}
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 self-start lg:self-center">
              <Filter className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'bn' ? 'দক্ষতা ও বিশেষত্ব অনুযায়ী ফিল্টার:' : 'Filter by specialty:'}</span>
            </div>
          </div>

          {/* Specialty Pills with flex-wrap so menus never cut off */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {specialtiesList.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedSpecialty(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSpecialty === item.id
                    ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30 ring-2 ring-emerald-500/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:text-slate-200'
                }`}
              >
                {language === 'bn' ? item.labelBn : item.labelEn}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Mentor Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>
              {language === 'bn' ? 'উপলব্ধ মেন্টর তালিকা' : 'Available Mentors'} ({filteredInstructors.length})
            </span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'সরাসরি প্রফেশনাল প্রোফাইল দেখুন' : 'Click to view full verified profile'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-850 animate-pulse" />
            ))}
          </div>
        ) : filteredInstructors.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">
              {language === 'bn' ? 'কোনো মেন্টর পাওয়া যায়নি' : 'No mentors found'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'bn' ? 'অন্য কোনো নাম বা ফিল্টার নির্বাচন করুন' : 'Try adjusting your search criteria'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstructors.map((mentor) => (
              <div
                key={mentor.id}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Top Banner Accent */}
                <div className="h-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 relative">
                  <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{language === 'bn' ? 'ভেরিফাইড মেন্টর' : 'Verified Mentor'}</span>
                  </div>
                </div>

                {/* Avatar & Profile Identity */}
                <div className="px-5 pt-0 pb-4 relative -mt-10 flex-1 flex flex-col">
                  <div className="flex items-end justify-between gap-3 mb-3">
                    <div className="relative">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-md bg-slate-100 dark:bg-slate-800"
                      />
                      <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" title="সক্রিয় মেন্টর" />
                    </div>

                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{mentor.rating || 4.9}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {mentor.experienceYears ? `${mentor.experienceYears}+ বছর অভিজ্ঞতা` : '১০+ বছর অভিজ্ঞতা'}
                      </p>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {mentor.name}
                  </h3>

                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 line-clamp-1">
                    {mentor.title}
                  </p>

                  {mentor.company && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{mentor.company}</span>
                    </p>
                  )}

                  {/* Highlight: HOW MANY STUDENTS TAUGHT */}
                  <div className="mt-4 p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {language === 'bn' ? 'মোট শিক্ষার্থী পড়িয়েছেন:' : 'Total Students Taught:'}
                        </span>
                      </div>
                      <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                        {(mentor.totalStudents || 1200).toLocaleString('bn-BD')} জন
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 pt-1.5 border-t border-emerald-100/70 dark:border-emerald-800/30">
                      <span>কোর্স সংখ্যা: {mentor.totalCourses || 1}টি</span>
                      <span>সফলতা রেট: ৯৮%</span>
                    </div>
                  </div>

                  {/* Bio summary */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                    {mentor.bio}
                  </p>

                  {/* Specialties Pills */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(mentor.specialties || mentor.expertise.split(',')).slice(0, 3).map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {typeof spec === 'string' ? spec.trim() : spec}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Action CTA */}
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedMentor(mentor)}
                      className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>{language === 'bn' ? 'প্রোফাইল দেখুন' : 'View Profile'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {mentor.courses && mentor.courses.length > 0 && (
                      <button
                        onClick={() => onNavigate('course-details', mentor.courses![0].slug)}
                        className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-colors border border-emerald-200 dark:border-emerald-800"
                        title="কোর্সে যান"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Mentorship Support Guarantee Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-10 text-white border border-emerald-800/40 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              {language === 'bn' ? 'স্কিলনেস্ট মেন্টরশিপের প্রতিশ্রুতি' : 'SkillNest Mentorship Commitment'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 leading-tight">
              {language === 'bn'
                ? 'কোডিংয়ে আটকে যাওয়ার দিন শেষ — প্রতিটি ধাপে আমরা আছি আপনার পাশে'
                : 'Never Get Stuck in Code — Personalized Guidance at Every Step'}
            </h3>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              {language === 'bn'
                ? 'প্রতিটি কোর্সের সাথে থাকছে ডেডিকেটেড ডিসকর্ড চ্যানেল, গুগল মিট লাইভ হেল্পডেস্ক এবং অভিজ্ঞ টিচিং অ্যাসিস্ট্যান্টদের সার্বক্ষণিক সাপোর্ট।'
                : 'Access dedicated community channels, daily live debugging sessions, code reviews, and mock interview preparations.'}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <button
                onClick={() => onNavigate('courses')}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                {language === 'bn' ? 'কোর্সসমূহ এক্সপ্লোর করুন' : 'Explore Courses'}
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 transition-all"
              >
                {language === 'bn' ? 'মেন্টরদের সাথে যোগাযোগ করুন' : 'Contact Support'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Rich Mentor Profile Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMentor(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-200 dark:border-slate-800">
              <img
                src={selectedMentor.avatar}
                alt={selectedMentor.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md bg-slate-100 dark:bg-slate-800 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {selectedMentor.name}
                  </h3>
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    ভেরিফাইড
                  </span>
                </div>

                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  {selectedMentor.title}
                </p>

                {selectedMentor.company && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{selectedMentor.company}</span>
                  </p>
                )}

                {/* Social Links */}
                <div className="flex items-center gap-2 mt-3">
                  {selectedMentor.socialLinks?.linkedin && (
                    <a
                      href={selectedMentor.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {selectedMentor.socialLinks?.github && (
                    <a
                      href={selectedMentor.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {selectedMentor.email && (
                    <a
                      href={`mailto:${selectedMentor.email}`}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Impact Metric Cards */}
            <div className="grid grid-cols-3 gap-3 my-6">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {(selectedMentor.totalStudents || 1200).toLocaleString('bn-BD')}+
                </div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  শিক্ষার্থী পড়িয়েছেন
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {selectedMentor.totalCourses || 1}টি
                </div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  এক্টিভ কোর্স
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                <div className="text-lg sm:text-xl font-black text-amber-500 flex items-center justify-center gap-1">
                  <span>{selectedMentor.rating || 4.9}</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  স্টুডেন্ট রেটিং
                </div>
              </div>
            </div>

            {/* About Mentor Bio & Quote */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {language === 'bn' ? 'শিক্ষকের বিস্তারিত পরিচিতি ও অভিজ্ঞতা' : 'About Mentor & Experience'}
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedMentor.bio}
                </p>
              </div>

              {selectedMentor.featuredQuote && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-500 text-xs italic text-emerald-900 dark:text-emerald-200">
                  "{selectedMentor.featuredQuote}"
                </div>
              )}

              {/* Skills & Specialties */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {language === 'bn' ? 'দক্ষতা ও বিশেষত্ব' : 'Skills & Specialties'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedMentor.specialties || selectedMentor.expertise.split(',')).map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      {typeof spec === 'string' ? spec.trim() : spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Courses taught by this mentor */}
              <div className="pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {language === 'bn' ? 'এই মেন্টরের কোর্সসমূহ' : 'Courses by this Mentor'}
                </h4>

                {selectedMentor.courses && selectedMentor.courses.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedMentor.courses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500 transition-colors gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {course.title}
                            </h5>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span>৳{course.discountPrice || course.price}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5 text-amber-500">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                {course.rating || 4.9}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedMentor(null);
                            onNavigate('course-details', course.slug);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 transition-colors"
                        >
                          বিস্তারিত দেখুন
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    কোর্সসমূহ শীঘ্রই যুক্ত করা হচ্ছে।
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedMentor(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                বন্ধ করুন
              </button>

              <button
                onClick={() => {
                  setSelectedMentor(null);
                  onNavigate('courses');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <span>সকল কোর্স দেখুন</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
