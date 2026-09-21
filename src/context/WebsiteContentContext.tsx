import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlatformSettings } from '../types';

export const defaultWebsiteSettings: PlatformSettings = {
  platformName: 'SkillNest Academy',
  taglineBn: 'শিখুন। তৈরি করুন। ক্যারিয়ারে এগিয়ে যান।',
  taglineEn: 'Learn. Build. Advance Your Career.',
  contactEmail: 'support@skillnest.academy',
  contactPhone: '+৮৮০ ১৮০০-৭৫৪৫৫৬',
  contactWorkingHours: 'সকাল ১০টা - রাত ৮টা (শনি - বৃহস্পতি)',
  address: 'লেভেল ৮, ভিশন টেক টাওয়ার, কারওয়ান বাজার, ঢাকা-১২১৫',
  currencySymbol: '৳',
  defaultLanguage: 'bn',
  bkashEnabled: true,
  nagadEnabled: true,
  sslcommerzEnabled: true,
  stripeEnabled: true,

  // Hero Section
  heroBadgeBn: '🔥 বাংলায় সেরা টেক স্কিলস একাডেমি',
  heroBadgeEn: '🔥 Bangladesh’s #1 Tech Skills Academy',
  heroBannerTitleBn: 'নিজের স্কিলকে ক্যারিয়ারে রূপ দিন',
  heroBannerTitleEn: 'Transform Your Skills Into a Dream Career',
  heroHighlightBn: 'ক্যারিয়ারে রূপ দিন',
  heroHighlightEn: 'Dream Career',
  heroBannerSubBn: 'ইন্ডাস্ট্রি-ফোকাসড কোর্স, বাস্তব প্রজেক্ট এবং অভিজ্ঞ মেন্টরের ১-অন-১ গাইডলাইনে নিজের ক্যারিয়ার গড়ে তুলুন।',
  heroBannerSubEn: 'Industry-focused curriculums, hands-on projects, and 1-on-1 mentor guidance to build your high-paying tech career.',
  heroCta1TextBn: 'কোর্স দেখুন →',
  heroCta1TextEn: 'Explore Courses →',
  heroCta1Link: 'courses',
  heroCta2TextBn: 'শুরু করুন',
  heroCta2TextEn: 'Get Started',
  heroCta2Link: 'courses',
  trustBullet1: '✓ প্র্যাকটিক্যাল লার্নিং',
  trustBullet2: '✓ প্রজেক্ট-বেসড কোর্স',
  trustBullet3: '✓ ভেরিফায়েড সার্টিফিকেট',

  // Stats Counters
  stat1Value: '১০,০০০+',
  stat1LabelBn: 'গ্র্যাজুয়েট ও শিক্ষার্থী',
  stat1LabelEn: 'Graduates & Students',
  stat2Value: '৯৪%',
  stat2LabelBn: 'সফল কর্মসংস্থান হার',
  stat2LabelEn: 'Job Placement Rate',
  stat3Value: '৫০+',
  stat3LabelBn: 'টপ টেক হায়ারিং পার্টনার',
  stat3LabelEn: 'Tech Hiring Partners',
  stat4Value: '৪.৯/৫',
  stat4LabelBn: 'গড় স্টুডেন্ট রেটিং',
  stat4LabelEn: 'Average Student Rating',

  // Top Promo Ads Banner
  topBannerEnabled: true,
  topBannerBadgeBn: '৯.৯ মেগা অফার',
  topBannerTextBn: 'সীমিত সময়ের জন্য প্রতিটি কোর্সে সর্বোচ্চ ৩৯% ফ্ল্যাট ছাড় চলছে!',
  topBannerTextEn: 'Limited time mega offer: Up to 39% OFF on all courses!',
  topBannerCoupon: 'NINE',
  topBannerBtnTextBn: 'ভর্তি হোন',
  topBannerBtnTextEn: 'Enroll Now',

  // Live Sales Social Proof Toast
  liveSalesNotificationEnabled: true,
  liveSalesIntervalSeconds: 8,

  // Promo Popup Modal
  promoModalEnabled: true,
  promoModalTitle: 'বৈশাখী ও স্পেশাল মেগা স্কিল ডিসকাউন্ট!',
  promoModalSubtitle: 'বাংলাদেশের সেরা ইন্ডাস্ট্রিয়াল প্রজেক্ট-ভিত্তিক কোর্সে এনরোল করুন বিশেষ ছাড়ে।',
  promoModalDiscount: '৩৯% ফ্ল্যাট ছাড়',
  promoModalCode: 'NINE',
  promoModalHours: 14,

  // Categories Section
  categoriesBadgeBn: 'ক্যাটেগরি এক্সপ্লোর করুন',
  categoriesTitleBn: 'শীর্ষ ক্যাটাগরিগুলো ব্রাউজ করুন',
  categoriesSubBn: 'আপনার পছন্দের প্রযুক্তি বেছে নিয়ে শেখা শুরু করুন',
  categoriesBtnTextBn: 'সকল ক্যাটাগরি →',

  // Featured Courses Section
  featuredBadgeBn: '★ জনপ্রিয় কোর্স',
  featuredTitleBn: 'আমাদের সেরা কোর্সে ভর্তি হোন',
  featuredSubBn: 'ইন্ডাস্ট্রি বিশেষজ্ঞদের তৈরি হ্যান্ডস-অন প্রজেক্টভিত্তিক সিলেবাস',
  featuredBtnTextBn: 'সকল কোর্স দেখুন →',

  // Value propositions (Why choose us)
  whyChooseTitleBn: 'কেন SkillNest Academy শিক্ষার্থীদের প্রথম পছন্দ?',
  whyChooseTitleEn: 'Why Choose SkillNest Academy?',
  whyChooseSubBn: 'শুধুমাত্র ভিডিও টিউটোরিয়াল নয়; আমরা দিই সম্পূর্ণ ক্যারিয়ার গাইডলাইন, রিয়েল-ওয়ার্ল্ড প্রজেক্ট বিল্ডিং এবং লাইভ সাপোর্ট।',
  whyChooseSubEn: 'Not just passive video watching; we offer comprehensive career paths, production-level projects, and dedicated live mentoring.',
  valueProps: [
    {
      title: 'ইন্ডাস্ট্রি-স্ট্যান্ডার্ড কারিকুলাম',
      titleEn: 'Industry-Ready Curriculum',
      desc: 'দেশি ও আন্তর্জাতিক চাকরির বাজারের চাহিদামাফিক বাস্তব প্রজেক্টভিত্তিক সিলেবাস।',
      descEn: 'Project-based curriculums mapped to modern job market requirements.',
      icon: 'Briefcase'
    },
    {
      title: '১-অন-১ ডেডিকেটেড সাপোর্ট',
      titleEn: '1-on-1 Mentor Support',
      desc: 'কোডিং বা প্রজেক্টে আটকে গেলে অভিজ্ঞ সাপোর্ট টিম থেকে দ্রুত সমাধান।',
      descEn: 'Quick resolution from active mentors whenever you get stuck on any bug.',
      icon: 'Headphones'
    },
    {
      title: 'ভেরিফায়েড ডিজিটাল সার্টিফিকেট',
      titleEn: 'Verified Digital Certificate',
      desc: 'কোর্স শেষে পাওয়া সার্টিফিকেট লিঙ্কডইন এবং রিজিউমে যুক্ত করার উপযোগী।',
      descEn: 'Shareable credentials with unique QR verification codes for your portfolio.',
      icon: 'Award'
    },
    {
      title: 'লাইফটাইম অ্যাক্সেস ও আপডেট',
      titleEn: 'Lifetime Access & Free Updates',
      desc: 'একবার ভর্তি হয়ে আজীবন ভিডিও দেখা ও ভবিষ্যৎ কারিকুলাম আপডেটের সুযোগ।',
      descEn: 'Once enrolled, enjoy uninterrupted lifetime access across all your devices.',
      icon: 'BookOpen'
    }
  ],

  // Instructors & Mentors Section
  mentorsBadgeBn: 'ইন্ডাস্ট্রি লিডার ও মেন্টরস',
  mentorsTitleBn: 'শীর্ষ ইন্ডাস্ট্রি এক্সপার্টদের সাথে শিখুন',
  mentorsSubBn: 'দেশি-বিদেশি শীর্ষ সফটওয়্যার প্রতিষ্ঠানে কর্মরত সিনিয়র ইঞ্জিনিয়ারদের সরাসরি তত্ত্বাবধানে ক্যারিয়ার গড়ুন',
  mentorsList: [
    {
      id: 'm-1',
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
      id: 'm-2',
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
      id: 'm-3',
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
      id: 'm-4',
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
      id: 'm-5',
      name: 'ফারহান আহমেদ (Farhan Ahmed)',
      role: 'DevOps & Cloud Architect @ Selise',
      tag: 'Docker, K8s, AWS & CI/CD',
      rating: '4.9',
      reviews: '195',
      courses: '3 Courses',
      students: '1,900+ Students',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300'
    },
    {
      id: 'm-6',
      name: 'নুসরাত জাহান (Nusrat Jahan)',
      role: 'Data Science Lead @ TigerIT',
      tag: 'Python, ML & Data Analytics',
      rating: '4.9',
      reviews: '220',
      courses: '4 Courses',
      students: '2,200+ Students',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300'
    },
    {
      id: 'm-7',
      name: 'মাহিন চৌধুরী (Mahin Chowdhury)',
      role: 'Lead Cybersecurity Specialist @ bKash',
      tag: 'Ethical Hacking & Network Defense',
      rating: '4.8',
      reviews: '180',
      courses: '2 Courses',
      students: '1,750+ Students',
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300'
    },
    {
      id: 'm-8',
      name: 'তানজিলা হক (Tanjila Haque)',
      role: 'Head of Growth & Digital Strategy @ ShopUp',
      tag: 'Performance Marketing & SEO',
      rating: '5.0',
      reviews: '260',
      courses: '3 Courses',
      students: '2,900+ Students',
      image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300'
    }
  ],

  // Student Testimonials Section
  testimonialsBadgeBn: 'শিক্ষার্থীদের সাফল্যগাঁথা',
  testimonialsTitleBn: 'শিক্ষার্থীদের সফলতার গল্প',
  testimonialsSubBn: 'সফলভাবে কোর্স শেষ করে যারা আজ বিভিন্ন শীর্ষ প্রতিষ্ঠানে কাজ করছেন',
  testimonialsList: [
    {
      id: 't-1',
      student: 'তানজিম আহমেদ (Tanjim Ahmed)',
      company: 'Junior Software Engineer @ Brain Station 23',
      quote: 'SkillNest-এর ফুলস্ট্যাক ওয়েব ডেভেলপমেন্ট কোর্স করে আমি ব্রেন স্টেশন ২৩-এ জুনিয়র ইঞ্জিনিয়ার হিসেবে জয়েন করতে পেরেছি। মেন্টরদের গাইডলাইন ছিল অসাধারণ!',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      rating: 5
    },
    {
      id: 't-2',
      student: 'মাহমুদুল করিম (Mahmudul Karim)',
      company: 'Frontend Developer @ TechSolutions BD',
      quote: 'বাংলায় এত নিখুঁতভাবে রিঅ্যাক্ট এবং নেক্সট.জেএস-এর অ্যাডভান্সড বিষয়গুলো বোঝানো হয়েছে যা যেকোনো আন্তর্জাতিক কোর্সের সমকক্ষ। বিকাশ দিয়ে সহজেই পেমেন্ট করা গেছে।',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      rating: 5
    },
    {
      id: 't-3',
      student: 'নাজমুন নাহার (Najmun Nahar)',
      company: 'UI/UX Designer @ Cefalo Bangladesh',
      quote: 'ফিগমা ও প্রোডাক্ট ডিজাইনের লাইভ প্রজেক্টগুলো আমার পোর্টফোলিওকে নতুন মাত্রা দিয়েছিল। ইন্টারভিউতে মেন্টরের ফিডব্যাক আমাকে ভীষণ সাহায্য করেছে।',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      rating: 5
    },
    {
      id: 't-4',
      student: 'শরীফুল ইসলাম (Shariful Islam)',
      company: 'Mobile App Engineer @ Kaz Software',
      quote: 'ফ্লাটার মাস্টারক্লাসের স্টেট ম্যানেজমেন্ট ও ফায়ারবেস ইন্টিগ্রেশন প্রজেক্ট সরাসরি ইন্টারভিউ টেস্টে কাজে লেগেছে। ক্লাস টাইমের পূর্বে কাউন্টডাউন ও সরাসরি জুম লিংক দারুণ!',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      rating: 5
    },
    {
      id: 't-5',
      student: 'ফারজানা আক্তার (Farjana Akter)',
      company: 'Junior SQA Engineer @ BJIT Group',
      quote: 'অটোমেশন টেস্টিং এবং সাইপ্রেসের প্র্যাকটিক্যাল অ্যাসাইনমেন্ট ও কুইজ সিস্টেম আমাকে কনফিডেন্ট করেছে। সাপোর্ট সেশনের মেন্টররা প্রতিটি সমস্যার সমাধান দিয়েছেন।',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      rating: 5
    },
    {
      id: 't-6',
      student: 'রাকিবুল হাসান (Rakibul Hasan)',
      company: 'Python Developer @ Dynamic Solution Innovators',
      quote: 'পাইথন এবং ব্যাকএন্ড এপিআই কোর্সের কোডিং চ্যালেঞ্জগুলো অসাধারণ ছিল। কোর্স সমাপ্তির পর ভেরিফায়েড সার্টিফিকেট লিঙ্কডইনে শেয়ার করায় প্রচুর রিক্রুটার নক পেয়েছি।',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      rating: 5
    }
  ],

  // Bottom CTA Enrollment Banner
  ctaBannerBadgeBn: 'ক্যারিয়ার গঠনের সেরা সুযোগ',
  ctaBannerTitleBn: 'আজই শুরু করুন আপনার টেক ক্যারিয়ার গড়ার যাত্রা',
  ctaBannerSubBn: 'বিকাশ বা নগদে সরাসরি ভর্তি হোন এবং যেকোনো সময় যেকোনো ডিভাইস থেকে ক্লাস শুরু করুন।',
  ctaBannerBtn1TextBn: 'সকল কোর্সসমূহ দেখুন',
  ctaBannerBtn1Link: 'courses',
  ctaBannerBtn2TextBn: 'আমাদের সাথে যোগাযোগ করুন',
  ctaBannerBtn2Link: 'contact',

  // Footer & Socials
  footerBioBn: 'বাংলাদেশের তরুণ প্রজন্মকে আন্তর্জাতিক মানের প্রযুক্তিবিদ, ডিজাইনার ও উদ্যোক্তা হিসেবে গড়ে তোলার বিশ্বস্ত অনলাইন লার্নিং প্ল্যাটফর্ম।',
  footerBioEn: 'Bangladesh’s premier online EdTech academy transforming ambitious learners into world-class engineers, designers, and tech leaders.',
  copyrightText: '© ২০২৬ SkillNest Academy Ltd. সর্বস্বত্ব সংরক্ষিত।',
  facebookUrl: 'https://facebook.com/skillnest.academy',
  youtubeUrl: 'https://youtube.com/@skillnest.academy',
  linkedinUrl: 'https://linkedin.com/company/skillnest-academy',
  githubUrl: 'https://github.com/skillnest-academy'
};

interface WebsiteContentContextType {
  settings: PlatformSettings;
  loading: boolean;
  updateSettings: (newSettings: Partial<PlatformSettings>, token?: string | null) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
  resetToDefaults: (token?: string | null) => Promise<boolean>;
}

const WebsiteContentContext = createContext<WebsiteContentContextType | undefined>(undefined);

export const WebsiteContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    // Try reading cached settings for instant render
    try {
      const cached = localStorage.getItem('skillnest_platform_settings');
      if (cached) {
        return { ...defaultWebsiteSettings, ...JSON.parse(cached) };
      }
    } catch {
      // ignore
    }
    return defaultWebsiteSettings;
  });
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        const merged = { ...defaultWebsiteSettings, ...data };
        setSettings(merged);
        try {
          localStorage.setItem('skillnest_platform_settings', JSON.stringify(merged));
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Failed to fetch platform settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const updateSettings = async (
    newSettings: Partial<PlatformSettings>,
    token?: string | null
  ): Promise<boolean> => {
    try {
      const updated = { ...settings, ...newSettings };
      // Optimistic update
      setSettings(updated);
      try {
        localStorage.setItem('skillnest_platform_settings', JSON.stringify(updated));
      } catch {
        // ignore
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify(updated)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings({ ...defaultWebsiteSettings, ...data.settings });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to save settings to server:', err);
      return false;
    }
  };

  const resetToDefaults = async (token?: string | null): Promise<boolean> => {
    return await updateSettings(defaultWebsiteSettings, token);
  };

  return (
    <WebsiteContentContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        refreshSettings,
        resetToDefaults
      }}
    >
      {children}
    </WebsiteContentContext.Provider>
  );
};

export const useWebsiteContent = () => {
  const context = useContext(WebsiteContentContext);
  if (!context) {
    throw new Error('useWebsiteContent must be used within a WebsiteContentProvider');
  }
  return context;
};
