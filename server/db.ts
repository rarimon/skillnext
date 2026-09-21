// SkillNest Academy - Persistent Database & Data Access Layer
// Simulates relational storage with full CRUD, disk persistence to JSON, relations, and realistic Bangladesh seed data

import fs from 'fs';
import path from 'path';
import {
  User,
  Category,
  Instructor,
  Course,
  Enrollment,
  Order,
  Coupon,
  Certificate,
  BlogPost,
  PlatformSettings,
  CourseReview,
  QuizAttempt,
  NotificationItem,
  SupportConversation,
  ChatMessage,
  LiveClass,
  Exam,
  ExamQuestion,
  ExamSubmission,
  Notice
} from '../src/types.js';

// Initial Seed Data
export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Web & Software Development',
    nameBn: 'ওয়েব ও সফটওয়্যার ডেভেলপমেন্ট',
    slug: 'web-development',
    icon: 'Code',
    description: 'Frontend, Backend, MERN & Full Stack programming',
    courseCount: 4
  },
  {
    id: 'cat-2',
    name: 'UI/UX & Product Design',
    nameBn: 'ইউআই/ইউএক্স ও প্রডাক্ট ডিজাইন',
    slug: 'ui-ux-design',
    icon: 'Palette',
    description: 'Figma, User Research, Wireframing & Prototyping',
    courseCount: 1
  },
  {
    id: 'cat-3',
    name: 'Digital Marketing & Growth',
    nameBn: 'ডিজিটাল মার্কেটিং ও গ্রোথ',
    slug: 'digital-marketing',
    icon: 'TrendingUp',
    description: 'SEO, Meta Ads, Content Strategy & Funnel Optimization',
    courseCount: 1
  },
  {
    id: 'cat-4',
    name: 'Cyber Security & Networking',
    nameBn: 'সাইবার সিকিউরিটি ও নেটওয়ার্কিং',
    slug: 'networking-security',
    icon: 'ShieldCheck',
    description: 'CCNA, Network Defense, Linux Administration',
    courseCount: 1
  },
  {
    id: 'cat-5',
    name: 'Mobile App Development',
    nameBn: 'মোবাইল অ্যাপ ডেভেলপমেন্ট',
    slug: 'mobile-development',
    icon: 'Smartphone',
    description: 'Flutter, React Native, iOS & Android App Development',
    courseCount: 2
  },
  {
    id: 'cat-6',
    name: 'Cloud Computing & DevOps',
    nameBn: 'ক্লাউড ও ডেভঅপস ইঞ্জিনিয়ারিং',
    slug: 'cloud-devops',
    icon: 'Cloud',
    description: 'Docker, Kubernetes, AWS, CI/CD Pipelines & Cloud Architecture',
    courseCount: 2
  },
  {
    id: 'cat-7',
    name: 'Artificial Intelligence & Data Science',
    nameBn: 'আর্টিফিশিয়াল ইন্টেলিজেন্স ও ডেটা সায়েন্স',
    slug: 'ai-data-science',
    icon: 'Database',
    description: 'Python, Machine Learning, Deep Learning & Generative AI',
    courseCount: 2
  },
  {
    id: 'cat-8',
    name: 'Freelancing & Career Mastery',
    nameBn: 'ফ্রিল্যান্সিং ও ক্যারিয়ার গ্রোথ',
    slug: 'freelancing-career',
    icon: 'Briefcase',
    description: 'Upwork, Fiverr, Remote Job Strategies & Client Communication',
    courseCount: 2
  }
];

export const initialInstructors: Instructor[] = [
  {
    id: 'inst-1',
    name: 'তানভীর হাসান (Tanvir Hasan)',
    email: 'tanvir@skillnest.com',
    title: 'Lead Software Architect & Tech Educator',
    expertise: 'Full Stack, Next.js, Node.js & Cloud Architecture',
    bio: '১০+ বছরের আন্তর্জাতিক ইন্ডাস্ট্রিয়াল অভিজ্ঞতা এবং ৩০,০০০+ তরুণ প্রোগ্রামারদের সফল মেন্টরশিপ। সাবেক ব্রেন স্টেশন ২৩ আর্কিটেক্ট।',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    totalStudents: 14200,
    totalCourses: 3,
    rating: 4.9,
    company: 'TechVentures & Ex-Brain Station 23',
    experienceYears: 10,
    specialties: ['React.js', 'Next.js', 'Node.js', 'System Design', 'TypeScript'],
    featuredQuote: 'কোডিং শুধু সিনট্যাক্স নয়, এটি একটি বাস্তব সমস্যা সমাধানের বিজ্ঞান।',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      website: 'https://tanvirhasan.dev'
    }
  },
  {
    id: 'inst-2',
    name: 'রাহাত মাহমুদ (Rahat Mahmud)',
    email: 'rahat@skillnest.com',
    title: 'Senior Backend Engineer & Microservices Lead',
    expertise: 'Laravel, PHP, Microservices & High-Scale Systems',
    bio: 'দেশি ও বিদেশি ফিনটেক কোম্পানিতে কাজ করার ৮ বছরের প্র্যাকটিকাল অভিজ্ঞতা। লার্জ স্কেল এপিআই ও পেমেন্ট গেটওয়ে স্পেশালিস্ট।',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    totalStudents: 8500,
    totalCourses: 1,
    rating: 4.8,
    company: 'Fintech Innovations Ltd',
    experienceYears: 8,
    specialties: ['Laravel', 'PHP', 'PostgreSQL', 'Redis', 'Microservices'],
    featuredQuote: 'ব্যাকএন্ডের নির্ভরযোগ্যতাই যেকোনো সফটওয়্যারের আসল মেরুদণ্ড।',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    }
  },
  {
    id: 'inst-3',
    name: 'সাদিয়া আফরিন (Sadia Afrin)',
    email: 'sadia@skillnest.com',
    title: 'Product Design Lead & Design Educator',
    expertise: 'UI/UX Design, Design Systems, UX Research & Figma',
    bio: 'গ্লোবাল ইউজার এক্সপেরিয়েন্স ডিজাইনার এবং ডিজাইন কনসালটেন্ট। ৪০+ আন্তর্জাতিক সফল প্রডাক্টে কাজ করার অভিজ্ঞতা।',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    totalStudents: 6200,
    totalCourses: 1,
    rating: 4.9,
    company: 'Global Design Studio (Pathao Alumni)',
    experienceYears: 7,
    specialties: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping'],
    featuredQuote: 'সুন্দর ডিজাইন শুধুমাত্র দেখার জন্য নয়, এটি ইউজারকে সঠিক সিদ্ধান্ত নিতে সাহায্য করে।',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      website: 'https://sadiaafrin.design'
    }
  },
  {
    id: 'inst-4',
    name: 'মাহমুদুল ইসলাম (Mahmudul Islam)',
    email: 'mahmudul@skillnest.com',
    title: 'Digital Marketing Strategist & Growth Lead',
    expertise: 'Performance Marketing, Global SEO & Analytics',
    bio: 'শীর্ষস্থানীয় ই-কমার্স ব্র্যান্ডের গ্রোথ মার্কেটার ও ট্রেইনার। ২ কোটি+ টাকার সফল অ্যাড ক্যাম্পেইন ম্যানেজমেন্ট অভিজ্ঞতা।',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    totalStudents: 5100,
    totalCourses: 1,
    rating: 4.7,
    company: 'GrowthScale Agency',
    experienceYears: 6,
    specialties: ['Meta Ads', 'Google Ads', 'SEO', 'Data Analytics', 'Conversion Funnel'],
    featuredQuote: 'ডাটা-চালিত মার্কেটিং যেকোনো ব্যবসাকে দ্রুত এবং নির্ভরযোগ্যভাবে বড় করতে পারে।',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    }
  },
  {
    id: 'inst-5',
    name: 'ইঞ্জিনিয়ার কামরুল হাসান (Kamrul Hasan)',
    email: 'kamrul@skillnest.com',
    title: 'Senior Network & Infrastructure Consultant',
    expertise: 'Cisco CCNA, CCNP, Linux Enterprise & Cloud Security',
    bio: '১২+ বছরের টেলিকম ও ডেটাসেন্টার নেটওয়ার্ক ডিজাইনিং অভিজ্ঞতা। সিসকো ও রেডহ্যাট সার্টিফায়েড এক্সপার্ট।',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    totalStudents: 3900,
    totalCourses: 1,
    rating: 4.8,
    company: 'Enterprise Cloud & Data Systems',
    experienceYears: 12,
    specialties: ['Cisco CCNA', 'Linux RedHat', 'Cyber Security', 'Network Architecture'],
    featuredQuote: 'নেটওয়ার্কের নিরাপত্তা এবং অপটিমাইজেশন হলো আধুনিক ডিজিটাল ইনফ্রাস্ট্রাকচারের ভিত্তি।',
    socialLinks: {
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'inst-6',
    name: 'আরিফুল ইসলাম (Ariful Islam)',
    email: 'ariful@skillnest.com',
    title: 'Lead Mobile Architect (Flutter & React Native)',
    expertise: 'Cross-Platform Mobile Apps, Dart, State Management',
    bio: '৮+ বছরের ক্রস-প্ল্যাটফর্ম মোবাইল অ্যাপ ডেভেলপমেন্ট অভিজ্ঞতা। প্লে স্টোর ও অ্যাপ স্টোরে ৫০+ লাইভ অ্যাপ।',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    totalStudents: 4800,
    totalCourses: 1,
    rating: 4.9,
    company: 'MobileCraft Studio',
    experienceYears: 8,
    specialties: ['Flutter', 'Dart', 'React Native', 'Firebase', 'App Store Publishing'],
    featuredQuote: 'মসৃণ ইউজার এক্সপেরিয়েন্স এবং পারফর্মেন্সই একটি মোবাইল অ্যাপকে বিশ্বমানের করে তোলে।',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    }
  },
  {
    id: 'inst-7',
    name: 'নুসরাত ফারজানা (Nusrat Farzana)',
    email: 'nusrat@skillnest.com',
    title: 'Senior AI/ML Engineer & Researcher',
    expertise: 'Python, Machine Learning, NLP & LLMs',
    bio: 'মেশিন লার্নিং ও জেনারেটিভ এআই ট্রেইনার। আন্তর্জাতিক কনফারেন্সে গবেষণাপত্র প্রকাশিত এবং এআই সল্যুশন ডেভেলপমেন্টের বাস্তব অভিজ্ঞতা।',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    totalStudents: 3400,
    totalCourses: 1,
    rating: 4.9,
    company: 'Applied AI Labs',
    experienceYears: 6,
    specialties: ['Python', 'TensorFlow', 'LLMs', 'Prompt Engineering', 'Data Analytics'],
    featuredQuote: 'ভবিষ্যতের সকল প্রযুক্তি আবর্তিত হবে কৃত্রিম বুদ্ধিমত্তা ও ডেটার দক্ষ ব্যবহারের চারপাশে।',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    }
  }
];

export const initialUsers: User[] = [
  {
    id: 'usr-admin-1',
    name: 'এডমিন তানজিম (Admin Tanjim)',
    email: 'admin@skillnest.com',
    phone: '+8801711000001',
    role: 'SUPER_ADMIN',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    headline: 'Platform Super Administrator',
    bio: 'SkillNest Academy Management & Curriculum Oversight',
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-inst-1',
    name: 'তানভীর হাসান (Tanvir Hasan)',
    email: 'tanvir@skillnest.com',
    phone: '+8801711223344',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    headline: 'Lead Software Architect & Tech Educator',
    bio: '১০+ বছরের আন্তর্জাতিক ইন্ডাস্ট্রিয়াল অভিজ্ঞতা এবং ৩০,০০০+ তরুণ প্রোগ্রামারদের সফল মেন্টরশিপ।',
    isActive: true,
    createdAt: '2025-01-05T00:00:00.000Z'
  },
  {
    id: 'usr-inst-2',
    name: 'রাহাত মাহমুদ (Rahat Mahmud)',
    email: 'rahat@skillnest.com',
    phone: '+8801711556677',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    headline: 'Senior Backend Engineer',
    bio: 'দেশি ও বিদেশি ফিনটেক কোম্পানিতে কাজ করার ৮ বছরের প্র্যাকটিকাল অভিজ্ঞতা।',
    isActive: true,
    createdAt: '2025-01-08T00:00:00.000Z'
  },
  {
    id: 'usr-inst-3',
    name: 'সাদিয়া আফরিন (Sadia Afrin)',
    email: 'sadia@skillnest.com',
    phone: '+8801711889900',
    role: 'INSTRUCTOR',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    headline: 'Product Design Lead',
    bio: 'গ্লোবাল ইউজার এক্সপেরিয়েন্স ডিজাইনার এবং ডিজাইন কনসালটেন্ট।',
    isActive: true,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'usr-student-1',
    name: 'আমিনুল ইসলাম (Aminul Islam)',
    email: 'aminulislamdeveloper@gmail.com',
    phone: '+8801812345678',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    headline: 'Aspiring Full Stack Engineer',
    bio: 'Passionate about web technologies, Next.js, and cloud systems.',
    isActive: true,
    createdAt: '2025-01-15T00:00:00.000Z'
  },
  {
    id: 'usr-student-2',
    name: 'নুসরাত জাহান (Nusrat Jahan)',
    email: 'nusrat@gmail.com',
    phone: '+8801912345678',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    headline: 'Frontend Learner & Designer',
    bio: 'Learning modern JavaScript and React.',
    isActive: true,
    createdAt: '2025-02-01T00:00:00.000Z'
  }
];

export const initialCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Complete Full Stack Web Development',
    titleBn: 'কমপ্লিট ফুল স্ট্যাক ওয়েব ডেভেলপমেন্ট (MERN + Next.js)',
    slug: 'complete-full-stack-web-development',
    subtitle: 'HTML, CSS, Tailwind, JavaScript, React 19, Next.js, Node, Express, MongoDB ও বাস্তব প্রজেক্ট',
    description: `এই কোর্সে একদম জিরো লেভেল থেকে শুরু করে আধুনিক ফুল স্ট্যাক ওয়েব ডেভেলপমেন্টের প্রতিটি খুঁটিনাটি শেখানো হবে। 
আপনি শিখবেন কীভাবে রেসপন্সিভ ওয়েব অ্যাপ্লিকেশন বানাতে হয়, RESTful API তৈরি করতে হয়, ক্লাউড ডাটাবেজ ইন্টিগ্রেট করতে হয় এবং প্রোডাকশনে ডিপ্লয় করতে হয়। 
বাস্তব ৫টি পূর্ণাঙ্গ প্রজেক্টের সাথে থাকবে লাইভ সাপোর্ট ও কোড রিভিউ।`,
    learningOutcomes: [
      'HTML5, Modern CSS3 ও Tailwind CSS দিয়ে পিক্সেল-পারফেক্ট রেসপন্সিভ ডিজাইন',
      'JavaScript ES6+, DOM Manipulation, Async/Await ও Event Loop এর গভীর ধারণা',
      'React 19 & Next.js App Router আর্কিটেকচার এবং স্টেট ম্যানেজমেন্ট',
      'Node.js & Express দিয়ে সিকিউর REST API ও JWT অথেন্টিকেশন সিস্টেম',
      'MongoDB, Mongoose ও PostgreSQL ডাটাবেজ মডেলিং',
      'পেমেন্ট গেটওয়ে (bKash, Nagad, SSLCommerz) ইন্টিগ্রেশন ও লাইভ সার্ভার ডিপ্লয়মেন্ট'
    ],
    requirements: [
      'একটি কম্পিউটার/ল্যাপটপ এবং ইন্টারনেট সংযোগ',
      'নতুন কিছু শেখার অদম্য আগ্রহ ও প্রতিদিন ২ ঘণ্টা অনুশীলনের মানসিকতা',
      'পূর্বের কোনো কোডিং জ্ঞান থাকা আবশ্যক নয়'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    promoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    price: 4500,
    discountPrice: 2800,
    level: 'ALL_LEVELS',
    language: 'বাংলা (Bangla)',
    durationHours: 64,
    lessonsCount: 18,
    rating: 4.9,
    reviewsCount: 340,
    studentsCount: 3820,
    isBestseller: true,
    isFeatured: true,
    isPublished: true,
    categoryId: 'cat-1',
    categoryName: 'Web & Software Development',
    instructorId: 'inst-1',
    instructor: initialInstructors[0],
    faqs: [
      {
        question: 'কোর্সটি শেষ করতে কত সময় লাগবে?',
        answer: 'প্রতিদিন ১-২ ঘণ্টা সময় দিলে ৩ থেকে ৪ মাসের মধ্যে আপনি সম্পূর্ণ কোর্স এবং সমস্ত প্রজেক্ট শেষ করতে পারবেন।'
      },
      {
        question: 'কোর্স শেষে কী সার্টিফিকেট পাবো?',
        answer: 'হ্যাঁ, সমস্ত লেসন সম্পন্ন করে ও কুইজ সফলভাবে পাস করলে আপনি একটি কিউআর কোড ভেরিফাইড ডিজিটাল সার্টিফিকেট পাবেন।'
      },
      {
        question: 'কোনো সমস্যায় পড়লে সাপোর্ট কীভাবে পাবো?',
        answer: 'প্রতিটি লেসনের সাথে ডেডিকেটেড ডিসকাশন ট্যাব এবং ফেসবুক প্রাইভেট সাপোর্ট গ্রুপে মেন্টরদের সার্বক্ষণিক সহায়তা পাবেন।'
      }
    ],
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-02-15T00:00:00.000Z',
    modules: [
      {
        id: 'mod-1-1',
        courseId: 'course-1',
        title: 'Module 01: ওয়েব ডেভেলপমেন্ট পরিচিতি ও এনভায়রনমেন্ট সেটআপ',
        orderIndex: 1,
        lessons: [
          {
            id: 'les-1-1',
            moduleId: 'mod-1-1',
            title: 'ওয়েব কীভাবে কাজ করে এবং ফুল স্ট্যাক রোডম্যাপ',
            description: 'ইন্টারনেট ক্লায়েন্ট-সার্ভার মডেল, DNS, HTTP/HTTPS ও একজন আধুনিক ডেভেলপারের দায়িত্ব সম্পর্কে সামগ্রিক ধারণা।',
            durationMinutes: 18,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            isFreePreview: true,
            orderIndex: 1,
            resources: [
              {
                id: 'res-1-1',
                title: 'Fullstack Roadmap PDF Guide',
                fileUrl: '/resources/roadmap.pdf',
                fileSize: '2.4 MB',
                fileType: 'PDF'
              }
            ]
          },
          {
            id: 'les-1-2',
            moduleId: 'mod-1-1',
            title: 'VS Code, Git & GitHub প্রফেশনাল সেটআপ',
            description: 'ডেভেলপমেন্টের জন্য প্রয়োজনীয় কোড এডিটর এক্সটেনশন, টার্মিনাল কমান্ড এবং গিট ভার্সন কন্ট্রোল।',
            durationMinutes: 24,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            isFreePreview: true,
            orderIndex: 2,
            resources: []
          },
          {
            id: 'les-1-3',
            moduleId: 'mod-1-1',
            title: 'HTML5 সিমান্টিক স্ট্রাকচার ও মডার্ন ফর্মস',
            description: 'হেডিং, প্যারাগ্রাফ, অডিও/ভিডিও ট্যাগ, ইনপুট টাইপস ও এক্সেসিবিলিটি স্ট্যান্ডার্ডস।',
            durationMinutes: 32,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            isFreePreview: false,
            orderIndex: 3,
            resources: []
          }
        ],
        quiz: {
          id: 'quiz-1-1',
          moduleId: 'mod-1-1',
          title: 'Module 01 কুইজ: ওয়েব ফান্ডামেন্টালস',
          passingScore: 70,
          questions: [
            {
              id: 'q-1-1-1',
              question: 'ওয়েব ব্রাউজার এবং ওয়েব সার্ভারের মধ্যে যোগাযোগের প্রধান প্রটোকল কোনটি?',
              options: [
                { id: 'opt-1', text: 'FTP' },
                { id: 'opt-2', text: 'HTTP / HTTPS' },
                { id: 'opt-3', text: 'SMTP' },
                { id: 'opt-4', text: 'SSH' }
              ],
              correctOptionIndex: 1,
              explanation: 'HTTP (Hypertext Transfer Protocol) ও এর সিকিউর রূপ HTTPS হলো ওয়েব ট্রাফিকের প্রধান প্রোটোকল।'
            },
            {
              id: 'q-1-1-2',
              question: 'HTML5 এর সিমান্টিক ট্যাগ কোনটি?',
              options: [
                { id: 'opt-1', text: '<div>' },
                { id: 'opt-2', text: '<article>' },
                { id: 'opt-3', text: '<span>' },
                { id: 'opt-4', text: '<font>' }
              ],
              correctOptionIndex: 1,
              explanation: '<article>, <section>, <header>, <nav> ইত্যাদি হলো HTML5 এর সিমান্টিক ট্যাগ।'
            }
          ]
        }
      },
      {
        id: 'mod-1-2',
        courseId: 'course-1',
        title: 'Module 02: Modern JavaScript (ES6+) ও DOM আর্কিটেকচার',
        orderIndex: 2,
        lessons: [
          {
            id: 'les-1-4',
            moduleId: 'mod-1-2',
            title: 'JavaScript ভ্যারিয়েবল, ডেটা টাইপ ও অ্যারো ফাংশন',
            description: 'let, const, scope, destructuring, rest/spread অপারেটর নিয়ে আলোচনা।',
            durationMinutes: 30,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            isFreePreview: false,
            orderIndex: 1,
            resources: []
          },
          {
            id: 'les-1-5',
            moduleId: 'mod-1-2',
            title: 'Async/Await, Promises ও Fetch API দিয়ে লাইভ ডেটা হ্যান্ডলিং',
            description: 'অ্যাসিঙ্ক্রোনাস প্রোগ্রামিং, এরর হ্যান্ডলিং ও থার্ড-পার্টি REST API থেকে ডেটা কল।',
            durationMinutes: 45,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            isFreePreview: false,
            orderIndex: 2,
            resources: []
          }
        ]
      },
      {
        id: 'mod-1-3',
        courseId: 'course-1',
        title: 'Module 03: React 19 & Next.js প্রোডাকশন সিস্টেম',
        orderIndex: 3,
        lessons: [
          {
            id: 'les-1-6',
            moduleId: 'mod-1-3',
            title: 'React কম্পোনেন্ট, প্রপ্স ও হুকস (useState, useEffect, useMemo)',
            description: 'রিয়্যাক্ট ডিরেকশনাল ডাটা ফ্লো এবং স্টেট লাইফসাইকেল।',
            durationMinutes: 52,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            isFreePreview: false,
            orderIndex: 1,
            resources: []
          },
          {
            id: 'les-1-7',
            moduleId: 'mod-1-3',
            title: 'Next.js App Router, সার্ভার অ্যাকশনস ও ফুলস্ট্যাক এপিআই',
            description: 'সার্ভার কম্পোনেন্ট, ডায়নামিক রাউটিং ও ক্যাশিং স্ট্যাটেজি।',
            durationMinutes: 58,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
            isFreePreview: false,
            orderIndex: 2,
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    title: 'React & Next.js Mastery',
    titleBn: 'রিঅ্যাক্ট ও নেক্সট.জেএস মাস্টারি (React 19, Server Components & SSR)',
    slug: 'react-nextjs-mastery',
    subtitle: 'ইন্টারমিডিয়েট ও অ্যাডভান্সড ফ্রন্টএন্ড ইঞ্জিনিয়ারিং ও রিয়েল ওয়ার্ল্ড ওয়েব অ্যাপ',
    description: 'মডার্ন ফ্রন্টএন্ড আর্কিটেকচার, পারফরম্যান্স অপটিমাইজেশন, এসইও ফ্রেন্ডলি পেজ এবং স্কেলেবল রিঅ্যাক্ট অ্যাপ্লিকেশন তৈরির অ্যাডভান্সড গাইড।',
    learningOutcomes: [
      'React 19 নতুন ফিচারসমূহ: Server Actions, useOptimistic, useFormStatus',
      'Next.js 15 App Router, Parallel Routes & Intercepting Routes',
      'Zustand ও TanStack Query দিয়ে রোবাস্ট স্টেট সিনক্রোনাইজেশন',
      'Core Web Vitals অপটিমাইজেশন ও প্রোডাকশন বেস্ট প্র্যাকটিস'
    ],
    requirements: [
      'JavaScript ES6 এর মৌলিক ধারণা থাকা আবশ্যক',
      'HTML ও CSS সম্পর্কে প্রাথমিক জ্ঞান'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    promoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    price: 3500,
    discountPrice: 2200,
    level: 'INTERMEDIATE',
    language: 'বাংলা (Bangla)',
    durationHours: 38,
    lessonsCount: 12,
    rating: 4.8,
    reviewsCount: 180,
    studentsCount: 2150,
    isBestseller: true,
    isFeatured: true,
    isPublished: true,
    categoryId: 'cat-1',
    categoryName: 'Web & Software Development',
    instructorId: 'inst-1',
    instructor: initialInstructors[0],
    createdAt: '2025-01-20T00:00:00.000Z',
    updatedAt: '2025-02-18T00:00:00.000Z',
    modules: [
      {
        id: 'mod-2-1',
        courseId: 'course-2',
        title: 'Module 01: Advanced React Core',
        orderIndex: 1,
        lessons: [
          {
            id: 'les-2-1',
            moduleId: 'mod-2-1',
            title: 'রিয়্যাক্ট রেন্ডার সাইকেল ও ইন্টারনালস',
            description: 'Virtual DOM, Fiber আর্কিটেকচার ও রেন্ডারিং বিহেভিয়ার।',
            durationMinutes: 28,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            isFreePreview: true,
            orderIndex: 1,
            resources: []
          },
          {
            id: 'les-2-2',
            moduleId: 'mod-2-1',
            title: 'কাস্টম হুকস ও রিইউজেবল প্যাটার্নস',
            description: 'ক্লিন কোড নীতি মেনে প্রোডাকশন গ্রেড কাস্টম হুক ডিজাইন।',
            durationMinutes: 35,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
            isFreePreview: false,
            orderIndex: 2,
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Laravel Backend Development',
    titleBn: 'লার্যাভেল ব্যাকএন্ড ডেভেলপমেন্ট (Zero to Enterprise Architect)',
    slug: 'laravel-backend-development',
    subtitle: 'পিএইচপি, লার্যাভেল ১১, রোবাস্ট সিকিউরিটি, পেমেন্ট ও রেস্টফুল মাইক্রোসার্ভিসেস',
    description: 'দেশের কর্পোরেট ও গ্লোবাল রিমোট মার্কেটে লার্যাভেলের ব্যাপক চাহিদা রয়েছে। এই কোর্সে ডাটাবেজ অপ্টিমাইজেশন, কিউ, ক্যাশিং ও এন্টারপ্রাইজ সিস্টেম তৈরি শিখবেন।',
    learningOutcomes: [
      'Laravel 11 আর্কিটেকচার ও Eloquent ORM রিলেশনশিপ',
      'Authentication, Multi-Auth, Roles & Permissions (Spatie)',
      'API ডেভেলপমেন্ট, Sanctum & Passport টোকেন অথেন্টিকেশন',
      'বিকাশ, নগদ ও এসএসএলকমার্স পেমেন্ট গেটওয়ে ইন্টিগ্রেশন'
    ],
    requirements: [
      'মৌলিক PHP ও অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিং (OOP) ধারণা'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    price: 4000,
    discountPrice: 2500,
    level: 'INTERMEDIATE',
    language: 'বাংলা (Bangla)',
    durationHours: 46,
    lessonsCount: 16,
    rating: 4.8,
    reviewsCount: 154,
    studentsCount: 1980,
    isBestseller: false,
    isFeatured: true,
    isPublished: true,
    categoryId: 'cat-1',
    categoryName: 'Web & Software Development',
    instructorId: 'inst-2',
    instructor: initialInstructors[1],
    createdAt: '2025-01-25T00:00:00.000Z',
    updatedAt: '2025-02-20T00:00:00.000Z',
    modules: [
      {
        id: 'mod-3-1',
        courseId: 'course-3',
        title: 'Module 01: Laravel ফ্রেস আর্কিটেকচার ও MVC',
        orderIndex: 1,
        lessons: [
          {
            id: 'les-3-1',
            moduleId: 'mod-3-1',
            title: 'Laravel রাউটিং, কন্ট্রোলার ও ব্লেড টেমপ্লেট',
            durationMinutes: 26,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isFreePreview: true,
            orderIndex: 1,
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-4',
    title: 'Node.js & Express API Development',
    titleBn: 'নোড.জেএস ও এক্সপ্রেস রেস্ট এপিআই মাস্টারি',
    slug: 'nodejs-express-api-development',
    subtitle: 'ইভেন্ট ড্রিভেন ব্যাকএন্ড, নোএসকিউএল ডাটাবেজ ও মাইক্রোসার্ভিসেস',
    description: 'হাই-কনকারেন্ট রিয়েল-টাইম সিস্টেম এবং স্কেলেবল এপিআই তৈরির জন্য নোড.জেএস এর এ টু জেড শিখুন।',
    learningOutcomes: [
      'Node.js Event Loop ও V8 ইঞ্জিন কীভাবে কাজ করে',
      'Express.js মিডলওয়্যার, ভ্যালিডেশন (Zod/Joi) ও এরর হ্যান্ডলিং',
      'JWT অথেন্টিকেশন ও রিফ্রেশ টোকেন প্যাটার্ন',
      'Redis ক্যাশিং ও রেট লিমিটিং প্র্যাকটিস'
    ],
    requirements: ['মডার্ন জাভাস্ক্রিপ্ট নলেজ'],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    price: 3200,
    discountPrice: 1950,
    level: 'INTERMEDIATE',
    language: 'বাংলা (Bangla)',
    durationHours: 32,
    lessonsCount: 14,
    rating: 4.7,
    reviewsCount: 96,
    studentsCount: 1420,
    isBestseller: false,
    isFeatured: false,
    isPublished: true,
    categoryId: 'cat-1',
    categoryName: 'Web & Software Development',
    instructorId: 'inst-1',
    instructor: initialInstructors[0],
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-22T00:00:00.000Z',
    modules: [
      {
        id: 'mod-4-1',
        courseId: 'course-4',
        title: 'Module 01: Node.js কোর ফান্ডামেন্টালস',
        orderIndex: 1,
        lessons: [
          {
            id: 'les-4-1',
            moduleId: 'mod-4-1',
            title: 'Node.js ইকোসিস্টেম ও মডিউল সিস্টেম (ESM vs CJS)',
            durationMinutes: 22,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            isFreePreview: true,
            orderIndex: 1,
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-5',
    title: 'UI/UX Design with Figma',
    titleBn: 'ইউআই/ইউএক্স ডিজাইন ও ফিগমা মাস্টারক্লাস',
    slug: 'ui-ux-design-with-figma',
    subtitle: 'ইউজার রিসার্চ, ওয়্যারফ্রেম, ডিজাইন সিস্টেম ও ইন্টারঅ্যাক্টিভ প্রোটোটাইপিং',
    description: 'আন্তর্জাতিক মানের আধুনিক মোবাইল অ্যাপ ও ওয়েব ইন্টারফেস ডিজাইন করার বাস্তবমুখি কোর্স। শিখুন কীভাবে যেকোনো প্রোডাক্টের এক্সপেরিয়েন্স নিখুঁত করতে হয়।',
    learningOutcomes: [
      'Figma অটো লেআউট, কম্পোনেন্টস ও ভ্যারিয়েন্টস তৈরি',
      'প্রফেশনাল ডিজাইন সিস্টেম এবং টোকেন ম্যানেজমেন্ট',
      'ইউজার জার্নি ম্যাপিং ও ওয়্যারফ্রেমিং স্ট্র্যাটেজি',
      'বিহ্যাঙ্কস এবং ড্রিবল পোর্টফোলিও বিল্ডিং'
    ],
    requirements: ['ডিজাইনের প্রতি আগ্রহ ও একটি পিসি বা ল্যাপটপ'],
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
    price: 3600,
    discountPrice: 2200,
    level: 'BEGINNER',
    language: 'বাংলা (Bangla)',
    durationHours: 35,
    lessonsCount: 15,
    rating: 4.9,
    reviewsCount: 210,
    studentsCount: 2600,
    isBestseller: true,
    isFeatured: true,
    isPublished: true,
    categoryId: 'cat-2',
    categoryName: 'UI/UX & Product Design',
    instructorId: 'inst-3',
    instructor: initialInstructors[2],
    createdAt: '2025-01-18T00:00:00.000Z',
    updatedAt: '2025-02-10T00:00:00.000Z',
    modules: [
      {
        id: 'mod-5-1',
        courseId: 'course-5',
        title: 'Module 01: ডিজাইন বেসিক্স ও ফিগমা পরিচিতি',
        orderIndex: 1,
        lessons: [
          {
            id: 'les-5-1',
            moduleId: 'mod-5-1',
            title: 'কালার থিওরি, টাইপোগ্রাফি ও ভিজ্যুয়াল হায়ারার্কি',
            durationMinutes: 30,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            isFreePreview: true,
            orderIndex: 1,
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-6',
    title: 'Digital Marketing & Growth Strategy',
    titleBn: 'ডিজিটাল মার্কেটিং ও হাইপার গ্রোথ স্ট্র্যাটেজি',
    slug: 'digital-marketing-growth-strategy',
    subtitle: 'এসইও, মেটা অ্যাডস ম্যানেজার, গুগল ক্যাম্পেইন ও কনটেন্ট ফানেল',
    description: 'স্থানীয় ও বৈশ্বিক বিজনেসের জন্য আরও বেশি লিড ও সেলস আনার কার্যকর ডাটা-ড্রিভেন মার্কেটিং টেকনিক শিখুন।',
    learningOutcomes: [
      'Facebook ও Instagram অ্যাড ক্যাম্পেইন নিখুঁত টার্গেটিং',
      'Google Search, Display ও YouTube Ads সেটআপ',
      'Advanced On-Page & Technical SEO অপ্টিমাইজেশন',
      'Conversion Rate Optimization (CRO) ও অ্যানালিটিক্স'
    ],
    requirements: ['বেসিক কম্পিউটার ও সোশ্যাল মিডিয়া ব্যবহারের জ্ঞান'],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    price: 3000,
    discountPrice: 1800,
    level: 'BEGINNER',
    language: 'বাংলা (Bangla)',
    durationHours: 30,
    lessonsCount: 12,
    rating: 4.7,
    reviewsCount: 140,
    studentsCount: 1850,
    isBestseller: false,
    isFeatured: true,
    isPublished: true,
    categoryId: 'cat-3',
    categoryName: 'Digital Marketing & Growth',
    instructorId: 'inst-4',
    instructor: initialInstructors[3],
    createdAt: '2025-01-28T00:00:00.000Z',
    updatedAt: '2025-02-14T00:00:00.000Z',
    modules: [
      {
        id: 'mod-6-1',
        courseId: 'course-6',
        title: 'Module 01: ডিজিটাল মার্কেটিং ল্যান্ডস্কেপ',
        orderIndex: 1,
        lessons: [
          {
            id: 'les-6-1',
            moduleId: 'mod-6-1',
            title: 'মার্কেটিং ফানেল ও গ্রাহক মানসিকতা বোঝা',
            durationMinutes: 25,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            isFreePreview: true,
            orderIndex: 1,
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-7',
    title: 'Networking & Cisco CCNA Professional',
    titleBn: 'নেটওয়ার্কিং ও সিসকো CCNA (200-301) প্রফেশনাল কোর্স',
    slug: 'networking-ccna-professional',
    subtitle: 'আইপিভি৪/৬, রাউটিং, সুইচিং, নেটওয়ার্ক সিকিউরিটি ও প্যাকেট ট্রেসার ল্যাব',
    description: 'টেলিকম ও আইটি সেক্টরে নেটওয়ার্ক ইঞ্জিনিয়ার হিসেবে ক্যারিয়ার গড়ার পূর্ণাঙ্গ গাইডলাইন। প্র্যাকটিকাল ল্যাব ও রিয়েল ডিভাইস কনফিগারেশন।',
    learningOutcomes: [
      'OSI Model, TCP/IP Suite ও IPv4 Subnetting মাস্টারি',
      'VLAN, Trunking, Spanning Tree Protocol (STP) কনফিগারেশন',
      'OSPF রাউটিং ও Access Control Lists (ACL) সিকিউরিটি',
      'Cisco Packet Tracer এ হ্যান্ডস-অন ল্যাব প্রজেক্টস'
    ],
    requirements: ['কম্পিউটার অপারেটিং সিস্টেমের সাধারণ জ্ঞান'],
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    price: 4800,
    discountPrice: 2900,
    level: 'ALL_LEVELS',
    language: 'বাংলা (Bangla)',
    durationHours: 42,
    lessonsCount: 16,
    rating: 4.8,
    reviewsCount: 115,
    studentsCount: 1350,
    isBestseller: false,
    isFeatured: true,
    isPublished: true,
    categoryId: 'cat-4',
    categoryName: 'Cyber Security & Networking',
    instructorId: 'inst-5',
    instructor: initialInstructors[4],
    createdAt: '2025-01-30T00:00:00.000Z',
    updatedAt: '2025-02-25T00:00:00.000Z',
    modules: [
      {
        id: 'mod-7-1',
        courseId: 'course-7',
        title: 'Module 01: নেটওয়ার্কের ফান্ডামেন্টালস',
        orderIndex: 1,
        lessons: [
          {
            id: 'les-7-1',
            moduleId: 'mod-7-1',
            title: 'নেটওয়ার্ক ডিভাইস (Router, Switch, Firewall) কীভাবে কাজ করে',
            durationMinutes: 28,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            isFreePreview: true,
            orderIndex: 1,
            resources: []
          }
        ]
      }
    ]
  }
];

export const initialCoupons: Coupon[] = [
  {
    id: 'coup-1',
    code: 'EID2026',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderAmount: 1500,
    maxDiscountAmount: 1000,
    expiresAt: '2026-12-31T23:59:59.000Z',
    usageCount: 142,
    maxUsage: 500,
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'SKILL10',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderAmount: 1000,
    maxDiscountAmount: 500,
    expiresAt: '2026-12-31T23:59:59.000Z',
    usageCount: 89,
    maxUsage: 1000,
    isActive: true
  },
  {
    id: 'coup-3',
    code: 'FIRST500',
    discountType: 'FIXED',
    discountValue: 500,
    minOrderAmount: 2000,
    expiresAt: '2026-12-31T23:59:59.000Z',
    usageCount: 65,
    maxUsage: 200,
    isActive: true
  }
];

export const initialEnrollments: Enrollment[] = [
  {
    id: 'enr-1',
    userId: 'usr-student-1',
    courseId: 'course-1',
    course: initialCourses[0],
    enrolledAt: '2025-01-20T10:30:00.000Z',
    completionPercentage: 71,
    completedLessons: ['les-1-1', 'les-1-2', 'les-1-3', 'les-1-4', 'les-1-5']
  },
  {
    id: 'enr-2',
    userId: 'usr-student-1',
    courseId: 'course-5',
    course: initialCourses[4],
    enrolledAt: '2025-02-05T14:15:00.000Z',
    completionPercentage: 100,
    completedAt: '2025-02-28T18:00:00.000Z',
    certificateId: 'cert-sn-2025-001',
    completedLessons: ['les-5-1']
  }
];

export const initialCertificates: Certificate[] = [
  {
    id: 'cert-1',
    certificateNumber: 'SN-2025-8849',
    userId: 'usr-student-1',
    studentName: 'আমিনুল ইসলাম (Aminul Islam)',
    courseId: 'course-5',
    courseTitle: 'UI/UX Design with Figma',
    instructorName: 'সাদিয়া আফরিন (Sadia Afrin)',
    issueDate: '2025-02-28',
    status: 'VALID',
    verificationUrl: '/certificate/verify/SN-2025-8849'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ORD-2025-1001',
    userId: 'usr-student-1',
    user: {
      name: 'আমিনুল ইসলাম',
      email: 'aminulislamdeveloper@gmail.com',
      phone: '+8801812345678'
    },
    items: [
      {
        id: 'ord-item-1',
        courseId: 'course-1',
        courseTitle: 'Complete Full Stack Web Development',
        courseSlug: 'complete-full-stack-web-development',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
        price: 2800
      }
    ],
    subtotal: 2800,
    discount: 560,
    total: 2240,
    couponCode: 'EID2026',
    paymentMethod: 'BKASH',
    paymentStatus: 'SUCCESS',
    orderStatus: 'PAID',
    transactionId: 'TRX9A87BKASH',
    createdAt: '2025-01-20T10:28:14.000Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'ORD-2025-1002',
    userId: 'usr-student-1',
    user: {
      name: 'আমিনুল ইসলাম',
      email: 'aminulislamdeveloper@gmail.com',
      phone: '+8801812345678'
    },
    items: [
      {
        id: 'ord-item-2',
        courseId: 'course-5',
        courseTitle: 'UI/UX Design with Figma',
        courseSlug: 'ui-ux-design-with-figma',
        thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=400&q=80',
        price: 2200
      }
    ],
    subtotal: 2200,
    discount: 0,
    total: 2200,
    paymentMethod: 'NAGAD',
    paymentStatus: 'SUCCESS',
    orderStatus: 'PAID',
    transactionId: 'TRX77BNAGAD',
    createdAt: '2025-02-05T14:10:00.000Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'ORD-2025-1003',
    userId: 'usr-student-2',
    user: {
      name: 'নুসরাত জাহান',
      email: 'nusrat@gmail.com',
      phone: '+8801912345678'
    },
    items: [
      {
        id: 'ord-item-3',
        courseId: 'course-2',
        courseTitle: 'React & Next.js Mastery',
        courseSlug: 'react-nextjs-mastery',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=80',
        price: 2200
      }
    ],
    subtotal: 2200,
    discount: 220,
    total: 1980,
    couponCode: 'SKILL10',
    paymentMethod: 'SSLCOMMERZ',
    paymentStatus: 'SUCCESS',
    orderStatus: 'PAID',
    transactionId: 'SSL88392193',
    createdAt: '2025-02-12T16:20:00.000Z'
  }
];

export const initialReviews: CourseReview[] = [
  {
    id: 'rev-1',
    courseId: 'course-1',
    userId: 'usr-student-1',
    userName: 'আমিনুল ইসলাম',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    comment: 'অসাধারণ কোর্স! তানভীর ভাইয়ার ব্যাখ্যার ধরণ এক কথায় দারুণ। প্রতিটি কনসেপ্ট রিয়েল লাইফ প্রজেক্টের সাথে বুঝিয়ে দেওয়া হয়েছে।',
    createdAt: '2025-02-01T12:00:00.000Z',
    isApproved: true
  },
  {
    id: 'rev-2',
    courseId: 'course-1',
    userId: 'usr-student-2',
    userName: 'নুসরাত জাহান',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    comment: 'বাংলাদেশের সবচেয়ে আপডেটেড ফুলস্ট্যাক কারিকুলাম। কুইজ আর অ্যাসাইনমেন্টগুলো সত্যিই চ্যালেঞ্জিং ছিল।',
    createdAt: '2025-02-14T09:30:00.000Z',
    isApproved: true
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'modern-fullstack-roadmap-bangladesh-2026',
    title: 'Modern Full-Stack Roadmap for Bangladeshi Developers in 2026',
    titleBn: '২০২৬ সালে বাংলাদেশে ফুলস্ট্যাক ডেভেলপার হওয়ার আধুনিক রোডম্যাপ',
    excerpt: 'কী কী ফ্রেমওয়ার্ক শিখবেন, কীভাবে প্রজেক্ট সাজাবেন এবং রিমোট চাকরির প্রস্তুতি কীভাবে নেবেন তার সার্বিক পর্যালোচনা।',
    content: `বর্তমান টেক ইন্ডাস্ট্রিতে ফুলস্ট্যাক ডেভেলপারদের চাহিদা আকাশচুম্বী। তবে কেবল সিনট্যাক্স মুখস্থ করে এখন আর চাকরি বা ফ্রিল্যান্সিংয়ে টিকে থাকা সম্ভব নয়।
১. স্ট্রং কোর ফান্ডামেন্টালস: জাভাস্ক্রিপ্ট এবং ব্রাউজারের কাজের প্রক্রিয়া বোঝা অত্যন্ত গুরুত্বপূর্ণ।
২. ফ্রন্টএন্ড আধুনিকায়ন: রিঅ্যাক্ট ১৯, নেক্সট.জেএস ১৫ এর মতো টুলিংয়ে সার্ভার কম্পোনেন্ট ব্যবহার করা।
৩. সিকিউর ব্যাকএন্ড: ডাটাবেজ অপ্টিমাইজেশন, রেট লিমিটিং এবং সিকিউর কুকি ম্যানেজমেন্ট।
৪. বাস্তব প্রজেক্ট তৈরি: কেবল টিউটোরিয়াল দেখে তৈরি ক্লোন নয়, রিয়েল লাইফ প্রবলেম সলভ করে এমন অ্যাপ্লিকেশন তৈরি করা উচিত।`,
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    authorName: 'তানভীর হাসান',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    category: 'Career & Tech',
    readTimeMinutes: 6,
    publishedAt: '2025-02-10',
    isPublished: true
  },
  {
    id: 'blog-2',
    slug: 'ui-ux-mistakes-beginners-make',
    title: 'Top 5 UI/UX Design Mistakes Beginners Often Make in Products',
    titleBn: 'নতুন প্রোডাক্ট ডিজাইনারদের সাধারণ ৫টি ভুল এবং তা এড়ানোর উপায়',
    excerpt: 'সাদামাটা ডিজাইনের সাথে প্রফেশনাল ইউজার ইন্টারফেসের প্রধান পার্থক্যের স্থানগুলো চিহ্নিত করুন।',
    content: `একটি চমৎকার ইউজার ইন্টারফেস তৈরিতে টাইপোগ্রাফি, স্পেসিং এবং কালার কন্ট্রাস্টের ভূমিকা অনস্বীকার্য।
১. অতিরিক্ত কালার গ্রেডিয়েন্ট পরিহার করা।
২. হেডিং ও বডি টেক্সটের মধ্যে সুস্পষ্ট অপটিক্যাল ব্যালান্স বজায় রাখা।
৩. মোবাইল ইউজারদের জন্য মিনিমাম ৪৪ পিক্সেল টাচ টার্গেট নিশ্চিত করা।
৪. এক্সেসিবিলিটি স্ট্যান্ডার্ডস (WCAG AA) মেনে চলা।`,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    authorName: 'সাদিয়া আফরিন',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    category: 'UI/UX Design',
    readTimeMinutes: 4,
    publishedAt: '2025-02-18',
    isPublished: true
  }
];

export const initialSettings: PlatformSettings = {
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

  // Value propositions
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

  // Footer & Socials
  footerBioBn: 'বাংলাদেশের তরুণ প্রজন্মকে আন্তর্জাতিক মানের প্রযুক্তিবিদ, ডিজাইনার ও উদ্যোক্তা হিসেবে গড়ে তোলার বিশ্বস্ত অনলাইন লার্নিং প্ল্যাটফর্ম।',
  footerBioEn: 'Bangladesh’s premier online EdTech academy transforming ambitious learners into world-class engineers, designers, and tech leaders.',
  copyrightText: '© ২০২৬ SkillNest Academy Ltd. সর্বস্বত্ব সংরক্ষিত।',
  facebookUrl: 'https://facebook.com/skillnest.academy',
  youtubeUrl: 'https://youtube.com/@skillnest.academy',
  linkedinUrl: 'https://linkedin.com/company/skillnest-academy',
  githubUrl: 'https://github.com/skillnest-academy'
};

export const initialConversations: SupportConversation[] = [
  {
    id: 'conv-1',
    userName: 'আব্দুল্লাহ আল মামুন (Abdullah Al Mamun)',
    userEmail: 'mamun.dev@gmail.com',
    userPhone: '01712-349812',
    lastMessage: 'নেক্সট.জেএস কোর্সের অফার কি এখনও চালু আছে?',
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    unreadCountAdmin: 1,
    unreadCountUser: 0,
    status: 'OPEN',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        senderName: 'আব্দুল্লাহ আল মামুন',
        text: 'আসসালামু আলাইকুম! নেক্সট.জেএস ফুলস্ট্যাক কোর্সের অফার কি এখনও চালু আছে?',
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString()
      },
      {
        id: 'msg-2',
        sender: 'admin',
        senderName: 'SkillNest Support',
        text: 'ওয়ালাইকুম আসসালাম! জি, BOISHAKH2026 কুপন কোড ব্যবহার করে আপনি বিশেষ ছাড় পেতে পারেন।',
        timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString()
      },
      {
        id: 'msg-3',
        sender: 'user',
        senderName: 'আব্দুল্লাহ আল মামুন',
        text: 'ধন্যবাদ ভাইয়া, পেমেন্ট করার পর এক্সেস কি সাথে সাথে পেয়ে যাব?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
      }
    ]
  },
  {
    id: 'conv-2',
    userName: 'ফারিয়া তাসনিম (Faria Tasnim)',
    userEmail: 'faria.tasnim@yahoo.com',
    userPhone: '01988-765432',
    lastMessage: 'সার্টিফিকেটে কি ভেরিফিকেশন কিউআর কোড থাকবে?',
    updatedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    unreadCountAdmin: 0,
    unreadCountUser: 0,
    status: 'RESOLVED',
    messages: [
      {
        id: 'msg-4',
        sender: 'user',
        senderName: 'ফারিয়া তাসনিম',
        text: 'হাই, কোর্স কমপ্লিট করার পর যে সার্টিফিকেট পাব তাতে কি অনলাইন ভেরিফিকেশন লিংক আর কিউআর কোড থাকবে?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      },
      {
        id: 'msg-5',
        sender: 'admin',
        senderName: 'SkillNest Support',
        text: 'হ্যাঁ আপু, প্রতিটি সার্টিফিকেটে ইউনিক আইডি ও স্ক্যানযোগ্য ভেরিফিকেশন কিউআর কোড থাকে যা আন্তর্জাতিকভাবে গ্রহণযোগ্য।',
        timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString()
      }
    ]
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'order',
    title: 'নতুন কোর্স অর্ডার প্লেস হয়েছে',
    message: 'নুসরত জাহান ৳১,৯৮০ টাকার অর্ডার (#ORD-2025-1003) করেছেন। নগদ পেমেন্ট ভেরিফিকেশন প্রয়োজন।',
    link: 'orders',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString()
  },
  {
    id: 'notif-2',
    type: 'chat',
    title: 'নতুন সাপোর্ট মেসেজ',
    message: 'ফারিয়া তাসনিম লাইভ চ্যাটে কোর্সের মেয়াদ ও সার্টিফিকেট সংক্রান্ত প্রশ্ন করেছেন।',
    link: 'messages',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    id: 'notif-3',
    type: 'student',
    title: 'নতুন শিক্ষার্থী নিবন্ধন',
    message: 'মাহমুদুল হাসান (mahmudul@gmail.com) প্ল্যাটফর্মে নতুন একাউন্ট খুলেছেন।',
    link: 'students',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  },
  {
    id: 'notif-4',
    type: 'certificate',
    title: 'নতুন সার্টিফিকেট ইস্যু অনুরোধ',
    message: 'সাকিব আল হাসান "Full-Stack Web Development" কোর্সের কুইজ ১০০% সম্পন্ন করেছেন।',
    link: 'certificates',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: 'notif-5',
    type: 'review',
    title: 'নতুন ৫-স্টার রিভিউ',
    message: 'তানজিনা আক্তার "MERN Stack Masterclass" কোর্সে ৫-স্টার রেটিং প্রদান করেছেন।',
    link: 'courses',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString()
  }
];

export const initialLiveClasses: LiveClass[] = [
  {
    id: 'live-1',
    courseId: 'course-1',
    courseTitle: 'Full-Stack Web Development with MERN & Next.js',
    instructorId: 'inst-1',
    instructorName: 'হাসান মাহমুদ (Hasan Mahmud)',
    title: 'MERN Stack লাইভ ডাউট সলভিং ও কোড রিভিউ ক্লাস',
    description: 'এই সেশনে আমরা রিয়েল প্রজেক্টের এপিআই অথেনটিকেশন, এরর হ্যান্ডলিং ও গিটহাব কোড রিভিউ করব।',
    // Scheduled 4 hours from now for testing and countdown display
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    durationMinutes: 90,
    zoomUrl: 'https://zoom.us/j/98765432101?pwd=SkillNestLive2026',
    meetingId: '987 6543 2101',
    passcode: 'SN2026',
    status: 'SCHEDULED',
    createdAt: new Date().toISOString()
  },
  {
    id: 'live-2',
    courseId: 'course-1',
    courseTitle: 'Full-Stack Web Development with MERN & Next.js',
    instructorId: 'inst-1',
    instructorName: 'হাসান মাহমুদ (Hasan Mahmud)',
    title: 'React 19 Server Actions ও পারফরম্যান্স অপটিমাইজেশন',
    description: 'নেক্সট.জেএস এবং রিঅ্যাক্ট সার্ভার অ্যাকশন ব্যবহার করে কীভাবে হাই-পারফরম্যান্ট ওয়েবসাইট তৈরি করবেন।',
    // Scheduled 2 days from now
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    durationMinutes: 60,
    zoomUrl: 'https://zoom.us/j/98765432102?pwd=SkillNestLive2026',
    meetingId: '987 6543 2102',
    passcode: 'SN2026',
    status: 'SCHEDULED',
    createdAt: new Date().toISOString()
  }
];

export const initialExams: Exam[] = [
  {
    id: 'exam-1',
    courseId: 'course-1',
    courseTitle: 'Full-Stack Web Development with MERN & Next.js',
    instructorId: 'inst-1',
    instructorName: 'হাসান মাহমুদ (Hasan Mahmud)',
    title: 'MERN Stack ও Next.js মিডটার্ম প্র্যাকটিক্যাল পরীক্ষা',
    description: 'এই পরীক্ষায় রিঅ্যাক্ট স্টেট ম্যানেজমেন্ট, হুকস, নোড এপিআই এবং নেক্সট.জেএস এর ওপর বাস্তবমুখী প্রশ্ন রয়েছে।',
    durationMinutes: 15,
    passingScore: 70,
    totalMarks: 50,
    isPublished: true,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'eq-1',
        question: 'React 18-এ সার্ভার সাইড রেন্ডারিং এবং ডেটা ফেচিংয়ের জন্য সবচেয়ে জনপ্রিয় ফ্রেমওয়ার্ক কোনটি?',
        options: ['Next.js App Router', 'jQuery', 'Backbone.js', 'AngularJS 1.x'],
        correctAnswerIndex: 0,
        explanation: 'Next.js App Router রিঅ্যাক্ট সার্ভার কম্পোনেন্টস এবং স্ট্রিমিং এসএসআর এর জন্য আদর্শ।'
      },
      {
        id: 'eq-2',
        question: 'Node.js Express এ ক্রস-অরিজিন রিকোয়েস্ট নিয়ন্ত্রণ করার জন্য কোন মিডলওয়্যার ব্যবহার করা হয়?',
        options: ['cors', 'body-parser', 'dotenv', 'multer'],
        correctAnswerIndex: 0,
        explanation: 'cors মিডলওয়্যারের মাধ্যমে ব্রাউজারের অরিজিন হেডারের নিরাপত্তা পরিচালনা করা হয়।'
      },
      {
        id: 'eq-3',
        question: 'MongoDB-তে কোন ইন্ডেক্সিং টেকনিক অনুসন্ধান কোয়েরির গতি সর্বাধিক বৃদ্ধি করে?',
        options: ['B-Tree Indexing on compound keys', 'Random indexing', 'No indexing is faster', 'XML schema mapping'],
        correctAnswerIndex: 0,
        explanation: 'কম্পাউন্ড কি-র ওপর বি-ট্রি ইন্ডেক্সিং কুয়েরি এক্সিকিউশন টাইম বহু গুণ কমিয়ে আনে।'
      },
      {
        id: 'eq-4',
        question: 'React এর `useEffect` হুকে dependency array খালি (`[]`) রাখলে কী ঘটে?',
        options: [
          'হুকটি কম্পোনেন্ট মাউন্ট হওয়ার পর কেবল একবার রান করে',
          'হুকটি প্রতি রেন্ডারে বারবার রান করে',
          'হুকটি কখনো রান করে না',
          'ব্রাউজার এরর প্রদান করে'
        ],
        correctAnswerIndex: 0,
        explanation: 'খালি dependency array নির্দেশ করে যে এফেক্টটি শুধুমাত্র কম্পোনেন্ট ইনিশিয়াল মাউন্টের পর একবার চলবে।'
      },
      {
        id: 'eq-5',
        question: 'JWT (JSON Web Token) এর তিনটি প্রধান অংশ কী কী?',
        options: [
          'Header, Payload, Signature',
          'Username, Password, SecretKey',
          'Client, Server, Database',
          'Cookie, Session, Cache'
        ],
        correctAnswerIndex: 0,
        explanation: 'JWT মূলত ডট (.) দ্বারা বিভক্ত তিনটি অংশ নিয়ে গঠিত: Header, Payload এবং Signature।'
      }
    ]
  },
  {
    id: 'exam-2',
    courseId: 'course-2',
    courseTitle: 'React & Next.js Mastery',
    instructorId: 'inst-1',
    instructorName: 'হাসান মাহমুদ (Hasan Mahmud)',
    title: 'React 19 Hooks & Next.js App Router অ্যাসেসমেন্ট',
    description: 'সার্ভার অ্যাকশন, অপটিমিস্টিক ইউআই এবং পারফরম্যান্স অপটিমাইজেশন যাচাইয়ের বিশেষ পরীক্ষা।',
    durationMinutes: 20,
    passingScore: 70,
    totalMarks: 40,
    isPublished: true,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'eq-201',
        question: 'React 19 এ `useActionState` হুকের মূল কাজ কী?',
        options: [
          'ফর্ম অ্যাকশনের পেন্ডিং স্টেট ও রেসপন্স পরিচালনা করা',
          'শুধুমাত্র ডেটাবেজ কানেকশন তৈরি করা',
          'কম্পোনেন্ট আনমাউন্ট ঠেকানো',
          'কুকি ডিলিট করা'
        ],
        correctAnswerIndex: 0,
        explanation: 'React 19 useActionState ফর্ম অ্যাকশন ও অ্যাসিনক্রোনাস সাবমিশনের স্টেট ট্র্যাক করার আধুনিক হুক।'
      },
      {
        id: 'eq-202',
        question: 'Next.js App Router এ ডায়নামিক রাউটিং এর জন্য কোন ফোল্ডার নেমিং কনভেনশন ব্যবহৃত হয়?',
        options: ['[slug]', '(slug)', '@slug', '_slug'],
        correctAnswerIndex: 0,
        explanation: 'স্কয়ার ব্র্যাকেট [slug] দিয়ে ডাইনামিক রুট প্যারামিটার নির্দিষ্ট করা হয়।'
      },
      {
        id: 'eq-203',
        question: 'Next.js এ ক্লায়েন্ট সাইড কম্পোনেন্ট তৈরি করতে ফাইলের শীর্ষে কী লিখতে হয়?',
        options: ["'use client'", "'use server'", "'use strict'", "'use react'"],
        correctAnswerIndex: 0,
        explanation: 'App Router এ ক্লায়েন্ট কম্পোনেন্ট ডিক্লেয়ার করার জন্য শীর্ষে use client নির্দেশিকা দিতে হয়।'
      },
      {
        id: 'eq-204',
        question: 'SSR (Server-Side Rendering) ব্যবহারের প্রধান সুবিধা কী?',
        options: [
          'উন্নত এসইও (SEO) এবং দ্রুত ফার্স্ট কনটেন্টফুল পেইন্ট (FCP)',
          'জাভাস্ক্রিপ্ট কোড ছোট হয়ে যাওয়া',
          'ডাটাবেজ প্রয়োজন না হওয়া',
          'ব্রাউজারের র‍্যাম কম ব্যবহার'
        ],
        correctAnswerIndex: 0,
        explanation: 'সার্ভার সাইড রেন্ডারিং সার্চ ইঞ্জিন ক্রলারদের জন্য পূর্ণ এইচটিএমএল প্রদান করে যা এসইও বৃদ্ধি করে।'
      }
    ]
  }
];

export const initialExamSubmissions: ExamSubmission[] = [
  {
    id: 'sub-1',
    examId: 'exam-1',
    examTitle: 'MERN Stack ও Next.js মিডটার্ম প্র্যাকটিক্যাল পরীক্ষা',
    courseId: 'course-1',
    courseTitle: 'Complete Full Stack Web Development',
    userId: 'usr-student-1',
    userName: 'আমিনুল ইসলাম (Aminul Islam)',
    userEmail: 'aminulislamdeveloper@gmail.com',
    score: 80,
    correctAnswersCount: 4,
    totalQuestions: 5,
    passed: true,
    answers: [
      { questionId: 'eq-1', selectedIndex: 0, isCorrect: true },
      { questionId: 'eq-2', selectedIndex: 0, isCorrect: true },
      { questionId: 'eq-3', selectedIndex: 0, isCorrect: true },
      { questionId: 'eq-4', selectedIndex: 1, isCorrect: false },
      { questionId: 'eq-5', selectedIndex: 0, isCorrect: true }
    ],
    submittedAt: '2025-02-18T14:32:00.000Z'
  },
  {
    id: 'sub-2',
    examId: 'exam-1',
    examTitle: 'MERN Stack ও Next.js মিডটার্ম প্র্যাকটিক্যাল পরীক্ষা',
    courseId: 'course-1',
    courseTitle: 'Complete Full Stack Web Development',
    userId: 'usr-student-2',
    userName: 'নুসরাত জাহান (Nusrat Jahan)',
    userEmail: 'nusrat@gmail.com',
    score: 100,
    correctAnswersCount: 5,
    totalQuestions: 5,
    passed: true,
    answers: [
      { questionId: 'eq-1', selectedIndex: 0, isCorrect: true },
      { questionId: 'eq-2', selectedIndex: 0, isCorrect: true },
      { questionId: 'eq-3', selectedIndex: 0, isCorrect: true },
      { questionId: 'eq-4', selectedIndex: 0, isCorrect: true },
      { questionId: 'eq-5', selectedIndex: 0, isCorrect: true }
    ],
    submittedAt: '2025-02-19T10:15:00.000Z'
  },
  {
    id: 'sub-3',
    examId: 'exam-1',
    examTitle: 'MERN Stack ও Next.js মিডটার্ম প্র্যাকটিক্যাল পরীক্ষা',
    courseId: 'course-1',
    courseTitle: 'Complete Full Stack Web Development',
    userId: 'usr-student-3',
    userName: 'তানভীর আহমেদ (Tanvir Ahmed)',
    userEmail: 'tanvir.stu@gmail.com',
    score: 60,
    correctAnswersCount: 3,
    totalQuestions: 5,
    passed: false,
    answers: [
      { questionId: 'eq-1', selectedIndex: 0, isCorrect: true },
      { questionId: 'eq-2', selectedIndex: 1, isCorrect: false },
      { questionId: 'eq-3', selectedIndex: 0, isCorrect: true },
      { questionId: 'eq-4', selectedIndex: 1, isCorrect: false },
      { questionId: 'eq-5', selectedIndex: 0, isCorrect: true }
    ],
    submittedAt: '2025-02-20T16:45:00.000Z'
  },
  {
    id: 'sub-4',
    examId: 'exam-1',
    examTitle: 'MERN Stack ও Next.js মিডটার্ম প্র্যাকটিক্যাল পরীক্ষা',
    courseId: 'course-1',
    courseTitle: 'Complete Full Stack Web Development',
    userId: 'usr-student-4',
    userName: 'সায়মা খান (Sayma Khan)',
    userEmail: 'sayma.k@gmail.com',
    score: 80,
    correctAnswersCount: 4,
    totalQuestions: 5,
    passed: true,
    answers: [
      { questionId: 'eq-1', selectedIndex: 0, isCorrect: true },
      { questionId: 'eq-2', selectedIndex: 0, isCorrect: true },
      { questionId: 'eq-3', selectedIndex: 2, isCorrect: false },
      { questionId: 'eq-4', selectedIndex: 0, isCorrect: true },
      { questionId: 'eq-5', selectedIndex: 0, isCorrect: true }
    ],
    submittedAt: '2025-02-21T09:20:00.000Z'
  },
  {
    id: 'sub-5',
    examId: 'exam-2',
    examTitle: 'React 19 Hooks & Next.js App Router অ্যাসেসমেন্ট',
    courseId: 'course-2',
    courseTitle: 'React & Next.js Mastery',
    userId: 'usr-student-1',
    userName: 'আমিনুল ইসলাম (Aminul Islam)',
    userEmail: 'aminulislamdeveloper@gmail.com',
    score: 100,
    correctAnswersCount: 4,
    totalQuestions: 4,
    passed: true,
    answers: [
      { questionId: 'eq-201', selectedIndex: 0, isCorrect: true },
      { questionId: 'eq-202', selectedIndex: 0, isCorrect: true },
      { questionId: 'eq-203', selectedIndex: 0, isCorrect: true },
      { questionId: 'eq-204', selectedIndex: 0, isCorrect: true }
    ],
    submittedAt: '2025-02-22T11:00:00.000Z'
  }
];

export const initialNotices: Notice[] = [
  {
    id: 'notice-1',
    title: 'স্বাগত বার্তা ও নতুন সেমিস্টারের জরুরি গাইডলাইন',
    content: 'সকল প্রিয় শিক্ষার্থীদের অবগতির জন্য জানানো যাচ্ছে যে, আমাদের নতুন স্প্রিং সেশনের প্রতিটি কোর্সের লাইভ ক্লাসের শিডিউল ও অ্যাসাইনমেন্ট প্ল্যাটফর্মে প্রকাশ করা হয়েছে। সময়মতো ক্লাসে উপস্থিত থেকে প্রজেক্ট সম্পূর্ণ করার অনুরোধ করা হচ্ছে।',
    targetType: 'ALL',
    priority: 'IMPORTANT',
    authorId: 'usr-admin-1',
    authorName: 'সুপার এডমিন (Super Admin)',
    authorRole: 'SUPER_ADMIN',
    isPinned: true,
    createdAt: '2025-02-20T10:00:00.000Z'
  },
  {
    id: 'notice-2',
    title: 'লারাভেল ব্যাকএন্ড ব্যাচ-১: রবিবার বিশেষ মেন্টরিং সেশন',
    content: 'লারাভেল ব্যাকএন্ড ডেভেলপমেন্ট কোর্সের ব্যাচ-১ এর শিক্ষার্থীদের জন্য আগামী রবিবার রাত ৯:০০ টায় বিশেষ ডাটাবেজ অপটিমাইজেশন ও রেস্ট API সেশন অনুষ্ঠিত হবে। জুম লিংক লাইভ ক্লাস ট্যাবে নির্ধারিত সময়ে সক্রিয় হবে।',
    targetType: 'COURSE',
    targetCourseId: 'course-1',
    targetCourseTitle: 'Full-Stack Web Development with MERN & Next.js',
    batchName: 'ব্যাচ-১ (Batch 1)',
    priority: 'URGENT',
    authorId: 'usr-inst-2',
    authorName: 'রাহাত মাহমুদ (Rahat Mahmud)',
    authorRole: 'TEACHER',
    isPinned: true,
    createdAt: '2025-02-21T14:30:00.000Z'
  },
  {
    id: 'notice-3',
    title: 'রিঅ্যাক্ট ও নেক্সটজেএস ব্যাচ-২: মডিউল ৪ কুইজ ও প্রজেক্ট সাবমিশন',
    content: 'React & Next.js Mastery কোর্সের ব্যাচ-২ এর শিক্ষার্থীরা আগামী ২৪ ঘণ্টার মধ্যে মডিউল ৪ এর অনলাইন MCQ কুইজ এবং গিটহাব রেপো লিংক সাবমিট করুন। কুইজ অপশন এক্সাম ট্যাবে চালু করা হয়েছে।',
    targetType: 'COURSE',
    targetCourseId: 'course-2',
    targetCourseTitle: 'React & Next.js Mastery',
    batchName: 'ব্যাচ-২ (Batch 2)',
    priority: 'NORMAL',
    authorId: 'usr-inst-1',
    authorName: 'তানভীর হাসান (Tanvir Hasan)',
    authorRole: 'TEACHER',
    isPinned: false,
    createdAt: '2025-02-22T08:00:00.000Z'
  }
];

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const DATA_FILE = path.join(DATA_DIR, 'database.json');

// Database State Holder
class Database {
  public users: User[] = [...initialUsers];
  public categories: Category[] = [...initialCategories];
  public instructors: Instructor[] = [...initialInstructors];
  public courses: Course[] = [...initialCourses];
  public coupons: Coupon[] = [...initialCoupons];
  public enrollments: Enrollment[] = [...initialEnrollments];
  public orders: Order[] = [...initialOrders];
  public certificates: Certificate[] = [...initialCertificates];
  public reviews: CourseReview[] = [...initialReviews];
  public blogPosts: BlogPost[] = [...initialBlogPosts];
  public settings: PlatformSettings = { ...initialSettings };
  public quizAttempts: QuizAttempt[] = [];
  public notifications: NotificationItem[] = [...initialNotifications];
  public conversations: SupportConversation[] = [...initialConversations];
  public liveClasses: LiveClass[] = [...initialLiveClasses];
  public exams: Exam[] = [...initialExams];
  public examSubmissions: ExamSubmission[] = [...initialExamSubmissions];
  public notices: Notice[] = [...initialNotices];

  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.loadFromDisk();
  }

  public loadFromDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.users) && parsed.users.length) this.users = parsed.users;
          if (Array.isArray(parsed.categories) && parsed.categories.length) this.categories = parsed.categories;
          if (Array.isArray(parsed.instructors) && parsed.instructors.length) this.instructors = parsed.instructors;
          if (Array.isArray(parsed.courses) && parsed.courses.length) this.courses = parsed.courses;
          if (Array.isArray(parsed.coupons) && parsed.coupons.length) this.coupons = parsed.coupons;
          if (Array.isArray(parsed.enrollments)) this.enrollments = parsed.enrollments;
          if (Array.isArray(parsed.orders)) this.orders = parsed.orders;
          if (Array.isArray(parsed.certificates)) this.certificates = parsed.certificates;
          if (Array.isArray(parsed.reviews)) this.reviews = parsed.reviews;
          if (Array.isArray(parsed.blogPosts)) this.blogPosts = parsed.blogPosts;
          if (parsed.settings && typeof parsed.settings === 'object') {
            this.settings = { ...this.settings, ...parsed.settings };
          }
          if (Array.isArray(parsed.quizAttempts)) this.quizAttempts = parsed.quizAttempts;
          if (Array.isArray(parsed.notifications)) this.notifications = parsed.notifications;
          if (Array.isArray(parsed.conversations)) this.conversations = parsed.conversations;
          if (Array.isArray(parsed.liveClasses) && parsed.liveClasses.length) this.liveClasses = parsed.liveClasses;
          if (Array.isArray(parsed.exams) && parsed.exams.length) this.exams = parsed.exams;
          if (Array.isArray(parsed.examSubmissions) && parsed.examSubmissions.length) {
            this.examSubmissions = parsed.examSubmissions;
          } else {
            this.examSubmissions = [...initialExamSubmissions];
          }
          if (Array.isArray(parsed.notices) && parsed.notices.length) {
            this.notices = parsed.notices;
          } else {
            this.notices = [...initialNotices];
          }
          console.log(`💾 [SkillNest DB] Successfully loaded database state from disk: ${DATA_FILE}`);
          return;
        }
      }
      // If file doesn't exist, save initial seed data
      this.saveToDiskSync();
    } catch (err) {
      console.warn('⚠️ [SkillNest DB] Could not load database from disk, using seed data:', err);
    }
  }

  public saveToDiskSync() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = {
        users: this.users,
        categories: this.categories,
        instructors: this.instructors,
        courses: this.courses,
        coupons: this.coupons,
        enrollments: this.enrollments,
        orders: this.orders,
        certificates: this.certificates,
        reviews: this.reviews,
        blogPosts: this.blogPosts,
        settings: this.settings,
        quizAttempts: this.quizAttempts,
        notifications: this.notifications,
        conversations: this.conversations,
        liveClasses: this.liveClasses,
        exams: this.exams,
        examSubmissions: this.examSubmissions,
        notices: this.notices,
        lastSavedAt: new Date().toISOString()
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`💾 [SkillNest DB] Successfully saved database state to disk: ${DATA_FILE}`);
    } catch (err) {
      console.error('❌ [SkillNest DB] Failed to save database to disk:', err);
    }
  }

  public save() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.saveToDiskSync();
      this.saveTimeout = null;
    }, 150);
  }

  // Helper Methods
  public findUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string) {
    return this.users.find((u) => u.id === id);
  }

  public findCourseBySlug(slug: string) {
    return this.courses.find((c) => c.slug === slug);
  }

  public findCourseById(id: string) {
    return this.courses.find((c) => c.id === id);
  }

  public isUserEnrolled(userId: string, courseId: string) {
    return this.enrollments.some((e) => e.userId === userId && e.courseId === courseId);
  }

  public getEnrollment(userId: string, courseId: string) {
    return this.enrollments.find((e) => e.userId === userId && e.courseId === courseId);
  }
}

export const db = new Database();
