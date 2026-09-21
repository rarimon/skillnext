import React, { useState } from 'react';
import { BookOpen, Clock, Calendar, ArrowRight, User, Share2, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const BlogPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const articles = [
    {
      id: 'blog-1',
      title: '২০২৬ সালে বাংলাদেশে সফটওয়্যার ইঞ্জিনিয়ারিং ক্যারিয়ার গাইড',
      titleEn: 'Software Engineering Career Roadmap in Bangladesh for 2026',
      slug: 'bangladesh-software-engineering-career-2026',
      category: 'Career Guide',
      author: 'তানভীর হাসান',
      date: 'মে ১০, ২০২৬',
      readTime: '৬ মিনিট পড়া',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      summary: 'কীভাবে একজন ফ্রেশ গ্র্যাজুয়েট বা সেলফ-লার্নার বাংলাদেশ ও রিমোট গ্লোবাল টেক কোম্পানিতে হাই-পেয়িং ডেভেলপার চাকরি পেতে পারেন।',
      content: `
        বর্তমান প্রতিযোগিতামূলক বাজারে সফল সফটওয়্যার ইঞ্জিনিয়ার হতে হলে শুধুমাত্র কোডিং সিনট্যাক্স শেখা যথেষ্ট নয়। আপনার প্রয়োজন গভীর ফান্ডামেন্টাল জ্ঞান, বাস্তব প্রজেক্টে দক্ষতা এবং আধুনিক সফটওয়্যার আর্কিটেকচার বোঝা।

        ১. ফান্ডামেন্টালস অ্যান্ড ডাটা স্ট্রাকচার:
        প্রথমে জাভাস্ক্রিপ্ট/টাইপস্ক্রিপ্ট, পাইথন বা জাভার গভীর কোর কনসেপ্ট শিখুন। টাইম ও স্পেস কমপ্লেক্সিটি অ্যানালাইসিস করতে সক্ষম হোন।

        ২. বাস্তব ও প্রোডাকশন-রেডি প্রজেক্ট তৈরি:
        টিউটোরিয়াল দেখে ক্লোন না করে নিজস্ব সমস্যা সমাধানের জন্য প্রজেক্ট দাঁড় করান। যেমন: লোকাল পেমেন্ট গেটওয়ে ইন্টিগ্রেশন, রিয়েলটাইম চ্যাট, বা অ্যানালিটিক্স ড্যাশবোর্ড।

        ৩. সিস্টেম ডিজাইন ও ক্লাউড ডেপ্লয়মেন্ট:
        ডকার, সিআই/সিডি পাইপলাইন, এবং ক্লাউড প্ল্যাটফর্মের বেসিক জ্ঞান আপনাকে অন্যদের চেয়ে কয়েক ধাপ এগিয়ে রাখবে।
      `
    },
    {
      id: 'blog-2',
      title: 'ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশনে বিকাশ ও নগদ পেমেন্ট গেটওয়ে ইন্টিগ্রেশন',
      titleEn: 'Integrating bKash and Nagad Payment Gateways in Modern Web Apps',
      slug: 'integrating-bkash-nagad-payment-gateways',
      category: 'Technical',
      author: 'আরিফুল ইসলাম',
      date: 'এপ্রিল ২৮, ২০২৬',
      readTime: '৮ মিনিট পড়া',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800',
      summary: 'বিকাশ টোকেনাইজড চেকআউট এবং নগদ পেমেন্ট গেটওয়ের হ্যান্ডশেক, রিফান্ড ও ইনস্ট্যান্ট আইপিএন ভেরিফিকেশনের পূর্ণাঙ্গ বিস্তারিত বিশ্লেষণ।',
      content: `
        বাংলাদেশে ই-কমার্স ও এডটেক প্ল্যাটফর্মগুলোর সবচেয়ে গুরুত্বপূর্ণ অংশ হলো লোকাল পেমেন্ট সহজ করা। এই আর্টিকেলে আমরা আলোচনা করব কীভাবে মার্চেন্ট এপিআই ব্যবহার করে সুরক্ষিতভাবে লেনদেন পরিচালনা করা যায়।

        নিরাপত্তার গুরুত্বপূর্ণ দিকসমূহ:
        - কখনই ক্লায়েন্ট সাইডে মার্চেন্ট সিক্রেট কি (App Secret) এক্সপোজ করবেন না।
        - প্রতিটি ট্রানজেকশনের ক্ষেত্রে সার্ভার-টু-সার্ভার ভেরিফিকেশন চালান।
        - ডাটাবেজে স্ট্যাটাস আপডেট করার আগে গেটওয়ের নিজস্ব এপিআই দিয়ে কোয়েরি ভেরিফাই করুন।
      `
    },
    {
      id: 'blog-3',
      title: 'ফ্রন্টএন্ড ডেভেলপারদের জন্য আধুনিক টাইপস্ক্রিপ্ট ও নেক্সট.জেএস ১৫ আর্কিটেকচার',
      titleEn: 'Modern TypeScript & Next.js Architecture for Frontend Engineers',
      slug: 'modern-typescript-nextjs-architecture',
      category: 'Web Dev',
      author: 'নুসরাত জাহান',
      date: 'এপ্রিল ১৫, ২০২৬',
      readTime: '৫ মিনিট পড়া',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      summary: 'টাইপ-সেফ কোডবেস তৈরি, সার্ভার কম্পোনেন্টস এবং পারফরম্যান্স অপটিমাইজেশনের জন্য আধুনিক প্র্যাকটিস।',
      content: `
        আধুনিক ফ্রন্টএন্ড আর্কিটেকচার দ্রুত বিকশিত হচ্ছে। টাইপস্ক্রিপ্টের শক্তিশালী টাইপ গার্ড এবং সার্ভার কম্পোনেন্টের সাহায্যে এখন খুব কম মেমোরি খরচ করে বিদ্যুৎগতির ওয়েব অ্যাপ তৈরি সম্ভব।
      `
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>{language === 'bn' ? 'নলেজ হাব ও ব্লগ' : 'Knowledge Hub & Blog'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {language === 'bn' ? 'ক্যারিয়ার গাইড ও টেকনিক্যাল ব্লগ' : 'Career Guides & Technical Articles'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {language === 'bn'
            ? 'টেক ইন্ডাস্ট্রির লেটেস্ট ট্রেন্ড, ক্যারিয়ার পরামর্শ এবং কোডিং টিপস নিয়ে আমাদের বিশেষজ্ঞদের বিশ্লেষণ'
            : 'Insights from top industry practitioners on engineering, fintech, and modern careers'}
        </p>
      </div>

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((art) => (
          <article
            key={art.id}
            className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-emerald-500/40 transition-all"
          >
            <div>
              <div className="aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={art.thumbnail}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded-md font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950">
                    {art.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readTime}</span>
                  </span>
                </div>

                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {art.summary}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{art.author}</span>
              </div>

              <button
                onClick={() => setSelectedArticle(art)}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>{language === 'bn' ? 'বিস্তারিত পড়ুন' : 'Read Article'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {selectedArticle.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>লেখক: {selectedArticle.author}</span>
              <span>•</span>
              <span>{selectedArticle.date}</span>
              <span>•</span>
              <span>{selectedArticle.readTime}</span>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden">
              <img src={selectedArticle.thumbnail} alt={selectedArticle.title} className="w-full h-full object-cover" />
            </div>

            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
              {selectedArticle.content}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
