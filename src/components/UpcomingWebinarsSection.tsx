import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Users,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Share2,
  X,
  Ticket,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

export interface WebinarItem {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  mentor: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  time: string;
  duration: string;
  platform: string;
  seatsLeft: number;
  totalSeats: number;
  tags: string[];
  bannerGradient: string;
}

const WEBINARS_DATA: WebinarItem[] = [
  {
    id: 'webinar-1',
    title: 'Full Stack Web Development Roadmap & Career Guidelines 2026',
    titleBn: 'ফুলস্ট্যাক ওয়েব ডেভেলপমেন্ট ও ক্যারিয়ার গাইডলাইন ২০২৬',
    category: 'ওয়েব ডেভেলপমেন্ট',
    mentor: {
      name: 'তামিম শাহরিয়ার সাবিন',
      role: 'Principal Software Architect @ ShopUp, Ex-Grab',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
    },
    date: '১২ সেপ্টেম্বর ২০২৬ (শুক্রবার)',
    time: 'রাত ৯:০০ টা',
    duration: '১ ঘণ্টা ৩০ মিনিট',
    platform: 'Zoom Live Interactive',
    seatsLeft: 18,
    totalSeats: 150,
    tags: ['MERN', 'Next.js', 'Career'],
    bannerGradient: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'webinar-2',
    title: 'Generative AI & Practical Python Automation Masterclass',
    titleBn: 'জেনারেটিভ এআই ও আধুনিক পাইথনে বাস্তবমুখী অটোমেশন',
    category: 'আর্টিফিশিয়াল ইন্টেলিজেন্স',
    mentor: {
      name: 'সুমাইয়া আক্তার',
      role: 'AI Researcher & Data Engineer @ BUET AI Lab',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200'
    },
    date: '১৫ সেপ্টেম্বর ২০২৬ (সোমবার)',
    time: 'রাত ৮:৩০ টা',
    duration: '১ ঘণ্টা ১৫ মিনিট',
    platform: 'Zoom Live Interactive',
    seatsLeft: 12,
    totalSeats: 120,
    tags: ['Python', 'Gemini API', 'AI Agents'],
    bannerGradient: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'webinar-3',
    title: 'UI/UX Design to Remote Freelancing High-Ticket Blueprint',
    titleBn: 'ইউআই/ইউএক্স এবং ফিগমা দিয়ে আন্তর্জাতিক রিমোট ক্লায়েন্ট হান্টিং',
    category: 'ডিজাইন ও প্রডাক্ট',
    mentor: {
      name: 'ফারহান কবির',
      role: 'Lead Product Designer @ Pathao, Top Rated Freelancer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'
    },
    date: '১৮ সেপ্টেম্বর ২০২৬ (বৃহস্পতিবার)',
    time: 'রাত ৯:০০ টা',
    duration: '২ ঘণ্টা',
    platform: 'Google Meet Live',
    seatsLeft: 25,
    totalSeats: 180,
    tags: ['Figma', 'UI/UX', 'Remote Work'],
    bannerGradient: 'from-purple-600 to-pink-600'
  },
  {
    id: 'webinar-4',
    title: 'Next.js 19 & Scalable SaaS Cloud Architecture',
    titleBn: 'Next.js 19 ও সার্ভারলেস ফুলস্ট্যাক ক্লাউড প্রজেক্ট আর্কিটেকচার',
    category: 'সফটওয়্যার ইঞ্জিনিয়ারিং',
    mentor: {
      name: 'আসিফ ইকবাল',
      role: 'Senior Full Stack Lead @ Selise Digital Platforms',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
    },
    date: '২২ সেপ্টেম্বর ২০২৬ (সোমবার)',
    time: 'রাত ৮:০০ টা',
    duration: '১ ঘণ্টা ৪৫ মিনিট',
    platform: 'Zoom Live Interactive',
    seatsLeft: 9,
    totalSeats: 100,
    tags: ['Next.js 19', 'Docker', 'SaaS'],
    bannerGradient: 'from-amber-600 to-orange-700'
  }
];

export const UpcomingWebinarsSection: React.FC = () => {
  const { language } = useLanguage();
  const { success } = useToast();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWebinar, setSelectedWebinar] = useState<WebinarItem | null>(null);

  // Booking form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1 >= WEBINARS_DATA.length ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 < 0 ? WEBINARS_DATA.length - 1 : prev - 1));
  };

  const handleOpenBooking = (webinar: WebinarItem) => {
    setSelectedWebinar(webinar);
    setBookingConfirmed(false);
    setTicketId('');
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) return;

    const generatedTicket = `SNW-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedTicket);
    setBookingConfirmed(true);

    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    success(language === 'bn' ? 'অভিনন্দন! আপনার ওয়েবিনার সিট সফলভাবে কনফার্ম হয়েছে!' : 'Seat booked successfully!');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>{language === 'bn' ? 'আসন্ন লাইভ ওয়েবিনার ও ওয়ার্কশপ' : 'Upcoming Live Webinars'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'bn' ? 'শীর্ষ টেক এক্সপার্টদের সাথে ফ্রি লাইভ সেশন' : 'Free Live Sessions with Tech Leaders'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {language === 'bn'
              ? 'ক্যারিয়ার প্ল্যানিং, স্কিল ডেভেলপমেন্ট এবং ইন্ডাস্ট্রি প্রজেক্ট নিয়ে দেশের শীর্ষ ইঞ্জিনিয়ারদের ইন্টারঅ্যাক্টিভ লাইভ সেশন।'
              : 'Join interactive live workshops on tech trends, portfolio reviews, and software engineering career growth.'}
          </p>
        </div>

        {/* Carousel Slider Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="webinar-prev-btn"
            type="button"
            onClick={prevSlide}
            aria-label="Previous webinar"
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            id="webinar-next-btn"
            type="button"
            onClick={nextSlide}
            aria-label="Next webinar"
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Webinars Responsive Grid / Slider */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {WEBINARS_DATA.map((webinar, idx) => {
          const isHighlighted = idx === currentIndex;
          return (
            <div
              key={webinar.id}
              className={`rounded-3xl bg-white dark:bg-slate-900 border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg ${
                isHighlighted
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Card Header Banner */}
              <div className={`p-4 bg-gradient-to-r ${webinar.bannerGradient} text-white relative overflow-hidden`}>
                <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                    {webinar.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-200 font-extrabold bg-black/30 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ১০০% ফ্রি
                  </span>
                </div>

                <h3 className="font-extrabold text-sm sm:text-base leading-snug line-clamp-2">
                  {language === 'bn' ? webinar.titleBn : webinar.title}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Mentor Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={webinar.mentor.avatar}
                    alt={webinar.mentor.name}
                    className="w-11 h-11 rounded-2xl object-cover border-2 border-emerald-500 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                      {webinar.mentor.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                      {webinar.mentor.role}
                    </span>
                  </div>
                </div>

                {/* Date, Time & Platform details */}
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-medium">{webinar.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>{webinar.time} ({webinar.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>{webinar.platform}</span>
                  </div>
                </div>

                {/* Seats Left Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-rose-600 dark:text-rose-400 font-bold">
                      🔥 মাত্র {webinar.seatsLeft} টি সিট বাকি
                    </span>
                    <span className="text-slate-400">
                      {webinar.totalSeats - webinar.seatsLeft}/{webinar.totalSeats} বুকড
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-rose-500 h-full rounded-full"
                      style={{
                        width: `${Math.round(((webinar.totalSeats - webinar.seatsLeft) / webinar.totalSeats) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Booking Button */}
                <button
                  id={`book-webinar-${webinar.id}-btn`}
                  type="button"
                  onClick={() => handleOpenBooking(webinar)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ফ্রি সিট বুক করুন' : 'Book Free Seat'}</span>
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* WEBINAR BOOKING MODAL */}
      {/* ========================================================================= */}
      {selectedWebinar && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-white">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedWebinar(null)}
              className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className={`p-6 bg-gradient-to-r ${selectedWebinar.bannerGradient} text-white`}>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold mb-2">
                <Ticket className="w-3 h-3" />
                <span>লাইভ ওয়েবিনার ফ্রি রেজিস্ট্রেশন</span>
              </div>
              <h3 className="text-lg font-black leading-snug">
                {language === 'bn' ? selectedWebinar.titleBn : selectedWebinar.title}
              </h3>
              <p className="text-xs text-white/90 mt-1">
                মেন্টর: {selectedWebinar.mentor.name} • {selectedWebinar.date} {selectedWebinar.time}
              </p>
            </div>

            {/* Modal Body: Either Form or Confirmed Ticket */}
            <div className="p-6">
              {!bookingConfirmed ? (
                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="যেমন: তানভীর আহমেদ"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      মোবাইল নম্বর (হোয়াটসঅ্যাপ লিংক পাঠানো হবে) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="০১৭১২-৩৪৫৬৭৮"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                      ইমেইল ঠিকানা (জুম লিংক পাঠানোর জন্য) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>১০০% ফ্রি রেজিস্ট্রেশন। সেশন শুরুর ৩০ মিনিট আগে আপনার ইমেইল ও হোয়াটসঅ্যাপে জুম লিংক পাঠানো হবে।</span>
                  </div>

                  <button
                    id="submit-webinar-booking-btn"
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    সিট নিশ্চিত করুন (Confirm Booking)
                  </button>
                </form>
              ) : (
                /* Confirmed Ticket Pass */
                <div className="space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">
                      আপনার সিট সফলভাবে কনফার্ম হয়েছে!
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      ধন্যবাদ {name}, আপনার রেজিস্টার্ড ইমেইল ({email})-এ জুম লাইভ লিঙ্ক ও ক্যালেন্ডার ইনভাইটেশন পাঠানো হয়েছে।
                    </p>
                  </div>

                  {/* Digital Entry Pass */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-dashed border-emerald-500 text-left space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span>DIGITAL ENTRY PASS</span>
                      <span className="font-mono text-emerald-600 font-extrabold">{ticketId}</span>
                    </div>
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-100">
                      {language === 'bn' ? selectedWebinar.titleBn : selectedWebinar.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      তারিখ: {selectedWebinar.date} • {selectedWebinar.time}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedWebinar(null)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    সম্পন্ন (Done)
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
