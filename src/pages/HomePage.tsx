import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  PlayCircle,
  Code,
  Smartphone,
  Server,
  Palette,
  Cloud,
  Database,
  Users,
  Award,
  BookOpen,
  Headphones,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Star,
  Pause,
  Play,
  GraduationCap,
  PhoneCall,
  Compass,
  Flame,
  ShieldCheck,
  Quote
} from 'lucide-react';
import { Course } from '../types';
import { CourseCard } from '../components/CourseCard';
import { HeroWorkspaceVisual } from '../components/HeroWorkspaceVisual';
import { useLanguage } from '../context/LanguageContext';
import { useWebsiteContent } from '../context/WebsiteContentContext';

interface HomePageProps {
  onNavigate: (route: string, param?: string) => void;
  onEnrollCourse: (course: Course) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onEnrollCourse }) => {
  const { language, t } = useLanguage();
  const { settings } = useWebsiteContent();
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Auto Slider State for Mentors
  const [sliderIndex, setSliderIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCards, setVisibleCards] = useState(4);

  // Auto Slider State for Student Testimonials
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);
  const [testimonialVisibleCards, setTestimonialVisibleCards] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
        setTestimonialVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
        setTestimonialVisibleCards(2);
      } else {
        setVisibleCards(4);
        setTestimonialVisibleCards(2);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch('/api/courses?featured=true')
      .then((res) => res.json())
      .then((data) => {
        setFeaturedCourses(Array.isArray(data) ? data : (data?.courses || []));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    {
      id: 'cat-1',
      name: language === 'bn' ? 'ওয়েব ডেভেলপমেন্ট' : 'Web Development',
      slug: 'web-development',
      count: '18 Courses',
      icon: Code,
      color: 'from-blue-500 to-indigo-600',
      badge: '🔥 মোস্ট পপুলার'
    },
    {
      id: 'cat-2',
      name: language === 'bn' ? 'মোবাইল অ্যাপস' : 'Mobile Apps',
      slug: 'mobile-development',
      count: '9 Courses',
      icon: Smartphone,
      color: 'from-emerald-500 to-teal-600',
      badge: '⚡ হাই ডিমান্ড'
    },
    {
      id: 'cat-3',
      name: language === 'bn' ? 'ব্যাকএন্ড ও সিকিউরিটি' : 'Backend & Security',
      slug: 'networking-security',
      count: '12 Courses',
      icon: Server,
      color: 'from-violet-500 to-purple-600',
      badge: '🔒 হট ফিল্ড'
    },
    {
      id: 'cat-4',
      name: language === 'bn' ? 'ইউআই/ইউএক্স ডিজাইন' : 'UI/UX Design',
      slug: 'ui-ux-design',
      count: '8 Courses',
      icon: Palette,
      color: 'from-amber-500 to-orange-600',
      badge: '🎨 ক্রিয়েটিভ'
    },
    {
      id: 'cat-5',
      name: language === 'bn' ? 'ক্লাউড ও ডেভঅপস' : 'Cloud & DevOps',
      slug: 'cloud-devops',
      count: '7 Courses',
      icon: Cloud,
      color: 'from-cyan-500 to-blue-600',
      badge: '☁️ গ্লোবাল জব'
    },
    {
      id: 'cat-6',
      name: language === 'bn' ? 'ডাটা সাইন্স ও এআই' : 'Data Science & AI',
      slug: 'ai-data-science',
      count: '6 Courses',
      icon: Database,
      color: 'from-rose-500 to-pink-600',
      badge: '🤖 ফিউচার স্কিল'
    }
  ];

  const iconList = [Briefcase, Headphones, Award, BookOpen, Sparkles, Code];
  const fallbackValueProps = [
    {
      title: language === 'bn' ? 'ইন্ডাস্ট্রি-স্ট্যান্ডার্ড কারিকুলাম' : 'Industry-Standard Curriculum',
      desc: language === 'bn' ? 'দেশি ও বহুজাতিক টেক কোম্পানির চাহিদা অনুযায়ী প্রস্তুতকৃত বাস্তব প্রজেক্টভিত্তিক সিলেবাস। বিগিনার থেকে প্রো লেভেল রোডম্যাপ।' : 'Hands-on, project-driven curriculum designed with top tech companies. Structured roadmaps from beginner to pro.',
      icon: Briefcase,
      badge: language === 'bn' ? '৫০+ প্রজেক্ট' : '50+ Projects',
      stat: language === 'bn' ? '১০০% প্র্যাকটিক্যাল' : '100% Practical',
      points: language === 'bn' ? ['হ্যান্ডস-অন লাইভ প্রজেক্ট', 'গিটহাব পোর্টফোলিও বিল্ডিং'] : ['Hands-on Live Projects', 'GitHub Portfolio Building']
    },
    {
      title: language === 'bn' ? '২৪/৭ ডেডিকেটেড লাইভ মেন্টর সাপোর্ট' : '24/7 Live Dedicated Support',
      desc: language === 'bn' ? 'কোডিং বা ডিজাইনে আটকে গেলে আর সময় নষ্ট নয়। ডিসকর্ড হেল্পডেস্ক ও প্রতিদিন গুগল মিটে স্ক্রিন শেয়ার করে ১-অন-১ সমাধান।' : 'Get unstuck immediately. Dedicated Discord helpdesks and daily Google Meet 1-on-1 screen share debugging sessions.',
      icon: Headphones,
      badge: language === 'bn' ? '১৫ মিনিটে সলিউশন' : '15m Response',
      stat: language === 'bn' ? '১-অন-১ স্ক্রিন শেয়ার' : '1-on-1 Screen Share',
      points: language === 'bn' ? ['গুগল মিটে লাইভ সলভ', 'অ্যাক্টিভ ডিসকর্ড হেল্পডেস্ক'] : ['Google Meet Live Debug', 'Active Discord Helpdesk']
    },
    {
      title: language === 'bn' ? 'ভেরিফায়েড আন্তর্জাতিক সার্টিফিকেট' : 'Globally Verified Certificate',
      desc: language === 'bn' ? 'প্রতিটি কোর্স সমাপনীতে ইউনিক কিউআর কোড এবং ভেরিফিকেশন আইডি যুক্ত সার্টিফিকেট, যা সরাসরি লিঙ্কডইন ও সিভিতে যোগ করা যায়।' : 'Earn verifiable certificates with unique QR codes and IDs directly shareable to LinkedIn, resumes, and portfolios.',
      icon: Award,
      badge: language === 'bn' ? 'গ্লোবালি ভেরিফাইড' : 'QR Verified',
      stat: language === 'bn' ? 'লিঙ্কডইন ইন্টিগ্রেশন' : 'LinkedIn Ready',
      points: language === 'bn' ? ['ইউনিক কিউআর কোড ভেরিফিকেশন', 'সিভি ও লিঙ্কডইন শেয়ারেবল'] : ['Unique QR Code Verification', 'CV & LinkedIn Shareable']
    },
    {
      title: language === 'bn' ? 'জব প্লেসমেন্ট ও ক্যারিয়ার সাপোর্ট' : 'Job Placement & Career Support',
      desc: language === 'bn' ? 'টপ ৫০+ টেক হায়ারিং পার্টনারদের কাছে রেজুমে রেফারেল, টেকনিক্যাল মক ইন্টারভিউ এবং প্রফেশনাল ক্যারিয়ার গ্রুমিং সেশন।' : 'Direct CV referrals to 50+ hiring partners, technical mock interviews, resume optimization, and career coaching.',
      icon: BookOpen,
      badge: language === 'bn' ? '৯৪% সাকসেস রেট' : '94% Success Rate',
      stat: language === 'bn' ? '৫০+ হায়ারিং পার্টনার' : '50+ Hiring Partners',
      points: language === 'bn' ? ['টপ কোম্পানিতে সিভি রেফারেল', 'টেকনিক্যাল মক ইন্টারভিউ'] : ['Top Tech CV Referrals', 'Technical Mock Interviews']
    }
  ];

  const displayValueProps =
    settings.valueProps && settings.valueProps.length > 0
      ? settings.valueProps.map((vp: any, idx: number) => {
          const fallback = fallbackValueProps[idx % fallbackValueProps.length];
          const rawTitle = (language === 'bn' ? (vp.titleBn || vp.title) : (vp.titleEn || vp.title)) || vp.title || fallback.title;
          const rawDesc = (language === 'bn' ? (vp.descBn || vp.desc) : (vp.descEn || vp.desc)) || vp.desc || fallback.desc;
          return {
            title: rawTitle,
            desc: rawDesc,
            icon: iconList[idx % iconList.length] || fallback.icon,
            badge: fallback.badge,
            stat: fallback.stat,
            points: fallback.points
          };
        })
      : fallbackValueProps;

  const instructors = [
    {
      name: 'হাসান মাহমুদ (Hasan Mahmud)',
      role: 'Principal Software Engineer @ Optimizely',
      tag: 'Full-Stack & System Design',
      rating: '4.9',
      reviews: '280',
      courses: '4 Courses',
      students: '4,200+ Students',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
    },
    {
      name: 'আরিফুল ইসলাম (Ariful Islam)',
      role: 'Head of Mobile @ Brain Station 23',
      tag: 'Flutter & React Native',
      rating: '4.9',
      reviews: '310',
      courses: '3 Courses',
      students: '3,100+ Students',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
    },
    {
      name: 'রাশেদ খান (Rashed Khan)',
      role: 'Lead UI/UX Designer @ Pathao',
      tag: 'Product Design & Figma',
      rating: '4.8',
      reviews: '190',
      courses: '2 Courses',
      students: '2,800+ Students',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300'
    },
    {
      name: 'সাদিয়া জাহান (Sadia Jahan)',
      role: 'Senior Full Stack Developer @ Enosis',
      tag: 'Next.js, Node & TypeScript',
      rating: '5.0',
      reviews: '240',
      courses: '3 Courses',
      students: '2,500+ Students',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'
    },
    {
      name: 'তানভীর আহমেদ (Tanvir Ahmed)',
      role: 'DevOps & Cloud Lead @ Shohoz',
      tag: 'Docker, K8s & AWS Cloud',
      rating: '4.9',
      reviews: '175',
      courses: '3 Courses',
      students: '2,200+ Students',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300'
    },
    {
      name: 'নুসরাত ফারজানা (Nusrat Farzana)',
      role: 'Lead AI/ML Engineer @ TigerIT',
      tag: 'Python, LLMs & Deep Learning',
      rating: '4.9',
      reviews: '215',
      courses: '2 Courses',
      students: '1,900+ Students',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300'
    },
    {
      name: 'মাহবুবুর রহমান (Mahbubur Rahman)',
      role: 'Principal Backend Engineer @ bKash',
      tag: 'Go, Microservices & Kafka',
      rating: '5.0',
      reviews: '340',
      courses: '4 Courses',
      students: '3,800+ Students',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300'
    },
    {
      name: 'ফারহানা ইয়াসমিন (Farhana Yasmin)',
      role: 'Cybersecurity Specialist @ Cefalo',
      tag: 'Ethical Hacking & DevSecOps',
      rating: '4.8',
      reviews: '160',
      courses: '2 Courses',
      students: '1,650+ Students',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300'
    }
  ];

  const testimonials = [
    {
      quote: language === 'bn'
        ? 'SkillNest-এর ফুলস্ট্যাক ওয়েব ডেভেলপমেন্ট কোর্স করে আমি ব্রেন স্টেশন ২৩-এ জুনিয়র ইঞ্জিনিয়ার হিসেবে জয়েন করতে পেরেছি। মেন্টরদের লাইভ প্রজেক্ট রিভিউ ছিল অসাধারণ!'
        : 'After completing the Full Stack MERN track on SkillNest, I secured a junior engineer position at Brain Station 23. The live project reviews were invaluable!',
      student: 'তানজিম আহমেদ (Tanjim Ahmed)',
      course: 'MERN Stack & Next.js Bootcamp',
      company: 'Junior Software Engineer @ Brain Station 23',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    },
    {
      quote: language === 'bn'
        ? 'বাংলা ভাষায় এত নিখুঁতভাবে রিঅ্যাক্ট এবং নেক্সট.জেএস-এর অ্যাডভান্সড বিষয়গুলো বোঝানো হয়েছে যা আন্তর্জাতিক মানের। লাইভ সাপোর্ট আমাকে ইন্টারভিউ ক্র্যাক করতে সাহায্য করেছে।'
        : 'The depth of Next.js and Tailwind explained in Bangla is on par with international bootcamps. The prompt support helped me ace technical rounds.',
      student: 'মাহমুদুল করিম (Mahmudul Karim)',
      course: 'Advanced React & Next.js 14',
      company: 'Frontend Developer @ TechSolutions BD',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150'
    },
    {
      quote: language === 'bn'
        ? 'ফ্লাটার ও ডার্ট কোর্সের রিয়েল-লাইফ ই-কমার্স অ্যাপ প্রজেক্ট তৈরি করে আমার পোর্টফোলিও স্ট্রং হয়েছিল। এখন রিমোটলি গ্লোবাল ক্লায়েন্টদের সাথে সফলভাবে কাজ করছি।'
        : 'Building a real-world multi-vendor e-commerce app during the Flutter course gave my portfolio a massive edge. I am now working remotely with global clients.',
      student: 'সাদিয়া তাসনিম (Sadia Tasnim)',
      course: 'Complete Flutter & Mobile Apps',
      company: 'Mobile App Engineer @ Chaldal',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    {
      quote: language === 'bn'
        ? 'পাইথন, ডাটা সায়েন্স ও মেশিন লার্নিং কোর্সের ল্যাবগুলো ছিল খুবই প্র্যাকটিক্যাল। ইন্ডাস্ট্রির রিয়েল ডাটাবেইজ নিয়ে কাজ করার ফলে আত্মবিশ্বাস বহুগুণ বৃদ্ধি পেয়েছে।'
        : 'The Data Science and ML labs were deeply practical. Working with real industry datasets helped me transition into a data analytics role with high confidence.',
      student: 'আসিফ আল হাসান (Asif Al Hasan)',
      course: 'Python for AI & Data Science',
      company: 'Data Analyst @ Robi Axiata',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      quote: language === 'bn'
        ? 'সাইবার সিকিউরিটি ও এথিক্যাল হ্যাকিং কোর্সটি করে আমি সিস্টেমের দুর্বলতা খুঁজে বের করা ও ফায়ারওয়াল সিকিউরিটিতে দক্ষ হয়েছি। SkillNest-এর সার্টিফিকেশন খুবই কাজে দিয়েছে।'
        : 'The Cyber Security & Ethical Hacking track gave me hands-on skills in penetration testing and defense-in-depth. The verified certificate added huge credibility.',
      student: 'নাজমুল সাকিব (Nazmul Sakib)',
      course: 'Cyber Security & Ethical Hacking',
      company: 'Security Analyst @ TigerIT',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    },
    {
      quote: language === 'bn'
        ? 'নন-সিএস ব্যাকগ্রাউন্ড থেকে এসেও আমি সফটওয়্যার ইঞ্জিনিয়ারিংয়ের ফাউন্ডেশন মজবুত করতে পেরেছি। মেন্টরদের ডেডিকেটেড ১-অন-১ সাপোর্ট ছিল আমার সাফল্যের প্রধান চাবিকাঠি।'
        : 'Coming from a non-CS background, SkillNest gave me the structured foundation I needed. Dedicated 1-on-1 mentor guidance was the key to my career switch.',
      student: 'নুসরাত জাহান (Nusrat Jahan)',
      course: 'Python & Backend Engineering',
      company: 'Associate Software Engineer @ Pathao',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    }
  ];

  const rawInstructors =
    settings.mentorsList && settings.mentorsList.length > 0
      ? settings.mentorsList
      : instructors;

  // Guarantee carousel always has enough items to slide continuously across all viewports
  const displayInstructors =
    rawInstructors.length > 0 && rawInstructors.length <= visibleCards
      ? [...rawInstructors, ...rawInstructors]
      : rawInstructors;

  const rawTestimonials =
    settings.testimonialsList && settings.testimonialsList.length > 0
      ? settings.testimonialsList
      : testimonials;

  const displayTestimonials =
    rawTestimonials.length > 0 && rawTestimonials.length <= testimonialVisibleCards
      ? [...rawTestimonials, ...rawTestimonials]
      : rawTestimonials;

  const maxSliderIndex = Math.max(1, displayInstructors.length - visibleCards);
  const maxTestimonialIndex = Math.max(1, displayTestimonials.length - testimonialVisibleCards);

  // Continuous reliable auto-sliding effect for Mentors (every 3.2 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && maxSliderIndex > 0) {
        setSliderIndex((prev) => (prev >= maxSliderIndex ? 0 : prev + 1));
      }
    }, 3200);
    return () => clearInterval(interval);
  }, [isPaused, maxSliderIndex]);

  // Continuous reliable auto-sliding effect for Student Testimonials (every 4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTestimonialPaused && maxTestimonialIndex > 0) {
        setTestimonialIndex((prev) => (prev >= maxTestimonialIndex ? 0 : prev + 1));
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isTestimonialPaused, maxTestimonialIndex]);

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-emerald-50/50 via-white to-transparent dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Two-column layout on Desktop/Tablet, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Main Hero Content (7 cols on lg) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Small Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-700/60 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  {(language === 'bn' ? settings.heroBadgeBn : settings.heroBadgeEn) ||
                    settings.heroBadgeBn ||
                    '🔥 বাংলায় সেরা টেক স্কিলস একাডেমি'}
                </span>
              </div>

              {/* Large Heading with Radiant Gradient Highlight */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.18] sm:leading-[1.15]">
                {language === 'bn' ? (
                  <>
                    {(() => {
                      const fullTitle = settings.heroBannerTitleBn || 'নিজের স্কিলকে ক্যারিয়ারে রূপ দিন';
                      const hl = settings.heroHighlightBn || 'ক্যারিয়ারে রূপ দিন';
                      if (fullTitle.includes(hl)) {
                        const parts = fullTitle.split(hl);
                        return (
                          <>
                            <span className="text-slate-900 dark:text-white">{parts[0]}</span>
                            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent inline-block pb-1 drop-shadow-xs">
                              {hl}
                            </span>
                            <span className="text-slate-900 dark:text-white">{parts[1] || ''}</span>
                          </>
                        );
                      }
                      const words = fullTitle.split(' ');
                      if (words.length > 2) {
                        const firstPart = words.slice(0, words.length - 2).join(' ') + ' ';
                        const lastPart = words.slice(words.length - 2).join(' ');
                        return (
                          <>
                            <span className="text-slate-900 dark:text-white">{firstPart}</span>
                            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent inline-block pb-1 drop-shadow-xs">
                              {lastPart}
                            </span>
                          </>
                        );
                      }
                      return (
                        <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent inline-block pb-1 drop-shadow-xs">
                          {fullTitle}
                        </span>
                      );
                    })()}
                  </>
                ) : (
                  <>
                    {(() => {
                      const fullTitle = settings.heroBannerTitleEn || settings.heroBannerTitleBn || 'Transform Your Skills Into a Dream Career';
                      const hl = settings.heroHighlightEn || 'Dream Career';
                      if (fullTitle.includes(hl)) {
                        const parts = fullTitle.split(hl);
                        return (
                          <>
                            <span className="text-slate-900 dark:text-white">{parts[0]}</span>
                            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent inline-block pb-1 drop-shadow-xs">
                              {hl}
                            </span>
                            <span className="text-slate-900 dark:text-white">{parts[1] || ''}</span>
                          </>
                        );
                      }
                      const words = fullTitle.split(' ');
                      if (words.length > 2) {
                        const firstPart = words.slice(0, words.length - 2).join(' ') + ' ';
                        const lastPart = words.slice(words.length - 2).join(' ');
                        return (
                          <>
                            <span className="text-slate-900 dark:text-white">{firstPart}</span>
                            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent inline-block pb-1 drop-shadow-xs">
                              {lastPart}
                            </span>
                          </>
                        );
                      }
                      return (
                        <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent inline-block pb-1 drop-shadow-xs">
                          {fullTitle}
                        </span>
                      );
                    })()}
                  </>
                )}
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {(language === 'bn' ? settings.heroBannerSubBn : settings.heroBannerSubEn) ||
                  settings.heroBannerSubBn ||
                  'ইন্ডাস্ট্রি-ফোকাসড কোর্স, বাস্তব প্রজেক্ট এবং অভিজ্ঞ মেন্টরের গাইডলাইনে নিজের ক্যারিয়ার তৈরি করুন।'}
              </p>

              {/* CTA Buttons - fit side-by-side or stack on narrow */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  id="hero-explore-courses-btn"
                  onClick={() => onNavigate(settings.heroCta1Link || 'courses')}
                  className="px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>
                    {(language === 'bn' ? settings.heroCta1TextBn : settings.heroCta1TextEn) ||
                      settings.heroCta1TextBn ||
                      'কোর্স দেখুন →'}
                  </span>
                </button>

                <button
                  id="hero-get-started-btn"
                  onClick={() => onNavigate(settings.heroCta2Link || 'courses')}
                  className="px-7 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm sm:text-base shadow-xs transition-all flex items-center justify-center cursor-pointer"
                >
                  <span>
                    {(language === 'bn' ? settings.heroCta2TextBn : settings.heroCta2TextEn) ||
                      settings.heroCta2TextBn ||
                      'শুরু করুন'}
                  </span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-3 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{settings.trustBullet1 || '✓ প্র্যাকটিক্যাল লার্নিং'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{settings.trustBullet2 || '✓ প্রজেক্ট-বেসড কোর্স'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{settings.trustBullet3 || '✓ ভেরিফায়েড সার্টিফিকেট'}</span>
                </div>
              </div>

              {/* Quick Discovery Navigation Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">{language === 'bn' ? 'দ্রুত দেখুন:' : 'Explore:'}</span>
                <button
                  type="button"
                  onClick={() => onNavigate('instructors')}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <Users className="w-3 h-3 text-emerald-600" />
                  <span>{language === 'bn' ? 'শীর্ষ মেন্টরস' : 'Top Mentors'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('categories')}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <BookOpen className="w-3 h-3 text-teal-600" />
                  <span>{language === 'bn' ? 'সকল ক্যাটাগরি' : 'Categories'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <Award className="w-3 h-3 text-indigo-600" />
                  <span>{language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <PhoneCall className="w-3 h-3 text-emerald-600" />
                  <span>{language === 'bn' ? 'যোগাযোগ' : 'Contact'}</span>
                </button>
              </div>

            </div>

            {/* Right Column: Rich Interactive Coding / LMS Workspace Visual (5 cols on lg) */}
            <div className="lg:col-span-5 w-full pt-4 lg:pt-0">
              <HeroWorkspaceVisual onExplore={() => onNavigate('courses')} />
            </div>

          </div>

          {/* Key Stats Counter Grid */}
          <div className="mt-14 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {settings.stat1Value || '১০,০০০+'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {(language === 'bn' ? settings.stat1LabelBn : settings.stat1LabelEn) || t('statStudents')}
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
                {settings.stat2Value || '৯৪%'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {(language === 'bn' ? settings.stat2LabelBn : settings.stat2LabelEn) || 'সফল কর্মসংস্থান হার'}
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {settings.stat3Value || '৫০+'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {(language === 'bn' ? settings.stat3LabelBn : settings.stat3LabelEn) || 'টপ টেক হায়ারিং পার্টনার'}
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-amber-500">
                {settings.stat4Value || '৪.৯/৫'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {(language === 'bn' ? settings.stat4LabelBn : settings.stat4LabelEn) || 'গড় স্টুডেন্ট রেটিং'}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Top Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            {settings.categoriesBadgeBn && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 mb-2">
                <span>{settings.categoriesBadgeBn}</span>
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {settings.categoriesTitleBn || (language === 'bn' ? 'শীর্ষ ক্যাটাগরিগুলো ব্রাউজ করুন' : 'Explore Top Categories')}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {settings.categoriesSubBn || (language === 'bn' ? 'আপনার আগ্রহের প্রযুক্তি বেছে নিয়ে শেখা শুরু করুন' : 'Pick a domain and start your learning journey')}
            </p>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>{settings.categoriesBtnTextBn || (language === 'bn' ? 'সকল ক্যাটাগরি দেখুন' : 'All Categories')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Top Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {categories.map((cat: any) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onNavigate('courses', cat.slug || cat.name)}
                className="group relative p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-400/50 shadow-xs hover:shadow-xl hover:shadow-emerald-950/10 hover:-translate-y-1.5 cursor-pointer transition-all duration-300 text-center flex flex-col items-center justify-between overflow-hidden"
              >
                {/* Subtle top badge */}
                <div className="w-full flex justify-end mb-1">
                  <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/70 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
                    {cat.badge || 'কোর্স'}
                  </span>
                </div>

                <div className="relative my-2.5">
                  <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-tr ${cat.color} opacity-20 blur-md group-hover:opacity-60 transition-opacity`} />
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-2 transition-all duration-300`}>
                    <Icon className="w-7 h-7 drop-shadow-sm" />
                  </div>
                </div>

                <div className="w-full">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1.5 bg-emerald-50/80 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-transparent transition-all">
                    <span>{cat.count}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Courses Section with Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>{settings.featuredBadgeBn || (language === 'bn' ? 'জনপ্রিয় ও আপকামিং কোর্স' : 'Trending Courses')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {settings.featuredTitleBn || (language === 'bn' ? 'আমাদের সেরা কোর্সে ভর্তি হোন' : 'Featured & Bestselling Courses')}
            </h2>
            {settings.featuredSubBn && (
              <p className="text-sm text-slate-500 mt-1">
                {settings.featuredSubBn}
              </p>
            )}
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>{settings.featuredBtnTextBn || (language === 'bn' ? 'সব কোর্স দেখুন' : 'View All')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Course Quick Category Filter Tabs with flex-wrap so never cut off */}
        <div className="flex flex-wrap items-center gap-2 pb-1 mb-6">
          {[
            { id: 'all', label: language === 'bn' ? 'সকল কোর্স' : 'All Courses' },
            { id: 'web', label: language === 'bn' ? 'ওয়েব ও সফটওয়্যার' : 'Web & Software' },
            { id: 'mobile', label: language === 'bn' ? 'মোবাইল অ্যাপস' : 'Mobile Apps' },
            { id: 'design', label: language === 'bn' ? 'ইউআই/ইউএক্স ডিজাইন' : 'UI/UX Design' },
            { id: 'security', label: language === 'bn' ? 'সিকিউরিটি ও নেটওয়ার্ক' : 'Cyber Security' },
            { id: 'ai', label: language === 'bn' ? 'এআই ও ডেটা সায়েন্স' : 'AI & Data Science' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategoryFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategoryFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses
              .filter((c: any) => {
                if (selectedCategoryFilter === 'all') return true;
                const catName = (c.categoryName || '').toLowerCase();
                const catId = (c.categoryId || '').toLowerCase();
                const title = (c.title || '').toLowerCase();
                const titleBn = (c.titleBn || '').toLowerCase();

                if (selectedCategoryFilter === 'web') {
                  return (
                    catId === 'cat-1' ||
                    catName.includes('web') ||
                    catName.includes('software') ||
                    title.includes('web') ||
                    title.includes('mern') ||
                    title.includes('react') ||
                    titleBn.includes('ওয়েব') ||
                    titleBn.includes('রিয়্যাক্ট')
                  );
                }
                if (selectedCategoryFilter === 'mobile') {
                  return (
                    catId === 'cat-5' ||
                    catName.includes('mobile') ||
                    catName.includes('app') ||
                    title.includes('flutter') ||
                    title.includes('android') ||
                    title.includes('ios') ||
                    titleBn.includes('অ্যাপ')
                  );
                }
                if (selectedCategoryFilter === 'design') {
                  return (
                    catId === 'cat-2' ||
                    catName.includes('design') ||
                    catName.includes('ui') ||
                    catName.includes('ux') ||
                    title.includes('figma') ||
                    title.includes('design') ||
                    titleBn.includes('ডিজাইন')
                  );
                }
                if (selectedCategoryFilter === 'security') {
                  return (
                    catId === 'cat-4' ||
                    catName.includes('security') ||
                    catName.includes('network') ||
                    title.includes('security') ||
                    title.includes('ccna') ||
                    titleBn.includes('সিকিউরিটি') ||
                    titleBn.includes('নেটওয়ার্ক')
                  );
                }
                if (selectedCategoryFilter === 'ai') {
                  return (
                    catId === 'cat-7' ||
                    catName.includes('ai') ||
                    catName.includes('data') ||
                    catName.includes('intelligence') ||
                    title.includes('python') ||
                    title.includes('machine learning') ||
                    title.includes('ai') ||
                    titleBn.includes('এআই') ||
                    titleBn.includes('ডাটা')
                  );
                }
                return true;
              })
              .slice(0, 6)
              .map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onSelect={(slug) => onNavigate('course-details', slug)}
                  onEnrollNow={(c) => onEnrollCourse(c)}
                />
              ))}
          </div>
        )}
      </section>

      {/* Why SkillNest Academy - Elevated with Value Add Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 border border-slate-800 text-white p-8 sm:p-12 relative overflow-hidden shadow-xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'আমাদের বিশেষত্ব ও সুবিধা' : 'Our Key Advantages'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {(language === 'bn' ? settings.whyChooseTitleBn : settings.whyChooseTitleEn) ||
                settings.whyChooseTitleBn ||
                'কেন SkillNest Academy শিক্ষার্থীদের প্রথম পছন্দ?'}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {(language === 'bn' ? settings.whyChooseSubBn : settings.whyChooseSubEn) ||
                settings.whyChooseSubBn ||
                'শুধুমাত্র ভিডিও টিউটোরিয়াল নয়; আমরা দিই সম্পূর্ণ ক্যারিয়ার গাইডলাইন, রিয়েল-ওয়ার্ল্ড প্রজেক্ট বিল্ডিং এবং ডেডিকেটেড লাইভ সাপোর্ট।'}
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayValueProps.map((vp: any, idx: number) => {
              const Icon = vp.icon;
              return (
                <div
                  key={idx}
                  className="group p-6 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      {vp.badge && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {vp.badge}
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                        {vp.title}
                      </h3>
                      <p className="text-xs text-slate-300/90 leading-relaxed mt-2">
                        {vp.desc}
                      </p>
                    </div>

                    {/* Bullet Points */}
                    {vp.points && vp.points.length > 0 && (
                      <ul className="space-y-1.5 pt-2 border-t border-white/10 text-xs text-slate-300">
                        {vp.points.map((pt: string, pIdx: number) => (
                          <li key={pIdx} className="flex items-center gap-1.5 text-xs text-slate-300">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Stat / Highlight tag */}
                  {vp.stat && (
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-emerald-400">
                      <span>{vp.stat}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instructors Section with Auto Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{settings.mentorsBadgeBn || (language === 'bn' ? 'ইন্ডাস্ট্রি লিডার ও মেন্টরস' : 'Industry Leaders & Mentors')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {settings.mentorsTitleBn || (language === 'bn' ? 'শীর্ষ ইন্ডাস্ট্রি এক্সপার্টদের সাথে শিখুন' : 'Learn from Top Tech Mentors')}
            </h2>
            <p className="text-sm text-slate-500 max-w-xl">
              {settings.mentorsSubBn || (language === 'bn' 
                ? 'দেশি-বিদেশি শীর্ষ সফটওয়্যার প্রতিষ্ঠানে কর্মরত সিনিয়র ইঞ্জিনিয়ারদের সরাসরি তত্ত্বাবধানে ক্যারিয়ার গড়ুন' 
                : 'Accelerate your engineering journey guided by senior software architects from top tech firms')}
            </p>
          </div>

          {/* Slider Controls & Link to Mentors Page */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate('instructors')}
              className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer mr-1"
            >
              <span>{language === 'bn' ? 'সকল মেন্টর দেখুন' : 'All Mentors'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
              title={isPaused ? 'অটো-স্লাইড পুনরায় চালু করুন' : 'অটো-স্লাইড সাময়িক থামান'}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4 text-amber-500" />}
              <span className="hidden sm:inline">
                {isPaused 
                  ? (language === 'bn' ? 'চালু করুন' : 'Play') 
                  : (language === 'bn' ? 'পজ করুন' : 'Pause')}
              </span>
            </button>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSliderIndex((prev) => (prev <= 0 ? maxSliderIndex : prev - 1))}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                aria-label="Previous mentor"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setSliderIndex((prev) => (prev >= maxSliderIndex ? 0 : prev + 1))}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                aria-label="Next mentor"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative overflow-hidden -mx-2.5 py-2 select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${sliderIndex * (100 / visibleCards)}%)`
            }}
          >
            {displayInstructors.map((inst, i) => (
              <div
                key={i}
                className="w-full sm:w-1/2 lg:w-1/4 shrink-0 px-2.5"
              >
                <div className="h-full p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md hover:border-emerald-500/40 transition-all duration-300 group">
                  <div className="space-y-3.5">
                    {/* Avatar with status */}
                    <div className="relative w-20 h-20 mx-auto">
                      <img
                        src={inst.image}
                        alt={inst.name}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xs group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] text-white font-bold" title="সক্রিয় মেন্টর">
                        ✓
                      </span>
                    </div>

                    {/* Information */}
                    <div className="text-center space-y-1">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1">
                        {inst.name}
                      </h3>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold line-clamp-1">
                        {inst.role}
                      </p>
                      <div className="pt-1 flex items-center justify-center gap-1.5 flex-wrap">
                        {inst.tag && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                            {inst.tag}
                          </span>
                        )}
                        {inst.rating && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-[10px] font-bold text-amber-600 dark:text-amber-400 inline-flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{inst.rating}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Students Taught Highlight */}
                    <div className="px-3 py-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/50 flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{language === 'bn' ? 'শিক্ষার্থী পড়িয়েছেন' : 'Taught'}:</span>
                      </span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300 text-xs">
                        {inst.students ? (inst.students.includes('শিক্ষার্থী') ? inst.students : `${inst.students} জন`) : '৪,২০০+ জন'}
                      </span>
                    </div>
                  </div>

                  {/* Footer Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate('instructors')}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs shadow-emerald-600/20 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>{language === 'bn' ? 'প্রোফাইল দেখুন' : 'View Profile'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('courses')}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                      title={language === 'bn' ? 'কোর্সগুলো দেখুন' : 'View Courses'}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Dots & Auto-slide notice */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxSliderIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setSliderIndex(dotIdx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  sliderIndex === dotIdx 
                    ? 'w-6 bg-emerald-600' 
                    : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>
              {language === 'bn' 
                ? 'কার্ডে মাউস রাখলে বা টাচ করলে অটো-স্লাইড পজ হবে' 
                : 'Hovering or touching pauses the auto-slider'}
            </span>
          </p>
        </div>
      </section>

      {/* Student Testimonials with Auto Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{settings.testimonialsBadgeBn || (language === 'bn' ? 'সফল গ্র্যাজুয়েটদের গল্প' : 'Graduate Success Stories')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {settings.testimonialsTitleBn || (language === 'bn' ? 'শিক্ষার্থীদের সফলতার গল্প' : 'What Our Graduates Say')}
            </h2>
            <p className="text-sm text-slate-500 max-w-xl">
              {settings.testimonialsSubBn || (language === 'bn' ? 'সফলভাবে কোর্স শেষ করে যারা আজ দেশ ও বিদেশের শীর্ষ প্রতিষ্ঠানে কাজ করছেন' : 'Real career transformations from our successful learners across Bangladesh')}
            </p>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsTestimonialPaused(!isTestimonialPaused)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isTestimonialPaused ? 'অটো-স্লাইড চালু করুন' : 'অটো-স্লাইড থামান'}
            >
              {isTestimonialPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              type="button"
              onClick={() => setTestimonialIndex((prev) => (prev <= 0 ? maxTestimonialIndex : prev - 1))}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setTestimonialIndex((prev) => (prev >= maxTestimonialIndex ? 0 : prev + 1))}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div
          className="overflow-hidden relative -mx-2.5"
          onMouseEnter={() => setIsTestimonialPaused(true)}
          onMouseLeave={() => setIsTestimonialPaused(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${testimonialIndex * (100 / testimonialVisibleCards)}%)`
            }}
          >
            {displayTestimonials.map((test, index) => (
              <div
                key={index}
                className="w-full md:w-1/2 shrink-0 px-2.5"
              >
                <div className="h-full p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs hover:shadow-lg hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between relative group">
                  {/* Subtle quote watermark */}
                  <div className="absolute top-4 right-4 text-emerald-500/10 dark:text-emerald-400/10 pointer-events-none group-hover:text-emerald-500/20 transition-colors">
                    <Quote className="w-12 h-12" />
                  </div>

                  <div className="space-y-3.5 relative z-10">
                    {/* Top rating & Verified badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span>ভেরিফায়েড শিক্ষার্থী</span>
                      </span>
                    </div>

                    {/* Quote text */}
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                      "{test.quote}"
                    </p>
                  </div>

                  {/* Student Footer details */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={test.avatar}
                          alt={test.student}
                          className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/40 shadow-xs"
                          loading="lazy"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {test.student}
                        </h4>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                          {test.company}
                        </p>
                      </div>
                    </div>

                    {test.course && (
                      <span className="hidden sm:inline-block text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        {test.course}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Dots & Auto-slide notice */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxTestimonialIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setTestimonialIndex(dotIdx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  testimonialIndex === dotIdx 
                    ? 'w-6 bg-emerald-600' 
                    : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                }`}
                aria-label={`Go to testimonial ${dotIdx + 1}`}
              />
            ))}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>
              {language === 'bn' 
                ? 'কার্ডে মাউস রাখলে বা টাচ করলে অটো-স্লাইড পজ হবে' 
                : 'Hovering or touching pauses the auto-slider'}
            </span>
          </p>
        </div>
      </section>

      {/* CTA Newsletter/Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 p-8 sm:p-12 text-white text-center space-y-6 shadow-xl">
          {settings.ctaBannerBadgeBn && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-emerald-100">
              <span>{settings.ctaBannerBadgeBn}</span>
            </div>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold max-w-2xl mx-auto">
            {settings.ctaBannerTitleBn || (language === 'bn' ? 'আজই শুরু করুন আপনার টেক ক্যারিয়ার গড়ার যাত্রা' : 'Start Building Your Tech Career Today')}
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto">
            {settings.ctaBannerSubBn || (language === 'bn'
              ? 'বিকাশ বা নগদে সরাসরি ভর্তি হোন এবং যেকোনো সময় যেকোনো ডিভাইস থেকে ক্লাস শুরু করুন।'
              : 'Enroll via bKash or Nagad and start learning immediately with life-time access.')}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate(settings.ctaBannerBtn1Link || 'courses')}
              className="px-7 py-3.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              {settings.ctaBannerBtn1TextBn || (language === 'bn' ? 'সকল কোর্সসমূহ দেখুন' : 'Explore All Courses')}
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="px-7 py-3.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-400/40 font-bold text-sm sm:text-base shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              {language === 'bn' ? 'আমাদের সম্পর্কে জানুন' : 'About Us'}
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-7 py-3.5 rounded-xl bg-teal-900/80 hover:bg-teal-900 text-white border border-teal-400/40 font-bold text-sm sm:text-base shadow-md transition-transform hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{language === 'bn' ? 'যোগাযোগ ও সাপোর্ট' : 'Contact Support'}</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
