import React, { useState, useEffect } from 'react';
import {
  Globe,
  Save,
  RotateCcw,
  Sparkles,
  Megaphone,
  BarChart3,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
  CreditCard,
  Eye,
  Layers,
  HelpCircle,
  Sliders,
  Check,
  Zap,
  Info,
  ExternalLink,
  Users,
  MessageSquare,
  FolderTree,
  Plus,
  Trash2,
  Star,
  Image as ImageIcon
} from 'lucide-react';
import { PlatformSettings, ValuePropItem, MentorItem, TestimonialItem } from '../types';
import { useWebsiteContent } from '../context/WebsiteContentContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

interface AdminWebContentCMSProps {
  token: string | null;
  onPreviewHome?: () => void;
  activeSubTab?: 'hero' | 'promo' | 'stats' | 'sections' | 'features' | 'mentors' | 'testimonials' | 'cta' | 'contact' | 'footer' | 'gateways';
  onSubTabChange?: (tab: 'hero' | 'promo' | 'stats' | 'sections' | 'features' | 'mentors' | 'testimonials' | 'cta' | 'contact' | 'footer' | 'gateways') => void;
}

export const AdminWebContentCMS: React.FC<AdminWebContentCMSProps> = ({
  token,
  onPreviewHome,
  activeSubTab,
  onSubTabChange
}) => {
  const { settings, updateSettings, resetToDefaults } = useWebsiteContent();
  const { language } = useLanguage();
  const { success: toastSuccess, error: toastError } = useToast();

  const [form, setForm] = useState<PlatformSettings>({ ...settings });
  const [internalTab, setInternalTab] = useState<
    'hero' | 'promo' | 'stats' | 'sections' | 'features' | 'mentors' | 'testimonials' | 'cta' | 'contact' | 'footer' | 'gateways'
  >('hero');

  const activeTab = activeSubTab || internalTab;
  const setActiveTab = (tab: typeof activeTab) => {
    setInternalTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  useEffect(() => {
    if (activeSubTab) {
      setInternalTab(activeSubTab);
    }
  }, [activeSubTab]);

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setForm({ ...settings });
  }, [settings]);

  const handleChange = (field: keyof PlatformSettings, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleValuePropChange = (index: number, field: keyof ValuePropItem, value: string) => {
    const currentProps = [...(form.valueProps || [])];
    if (!currentProps[index]) {
      currentProps[index] = { title: '', desc: '' };
    }
    currentProps[index] = { ...currentProps[index], [field]: value };
    handleChange('valueProps', currentProps);
  };

  // Mentors handlers
  const handleMentorChange = (index: number, field: keyof MentorItem, value: any) => {
    const list = [...(form.mentorsList || [])];
    list[index] = { ...list[index], [field]: value };
    handleChange('mentorsList', list);
  };

  const handleAddMentor = () => {
    const newMentor: MentorItem = {
      id: `mentor-${Date.now()}`,
      name: 'নতুন মেন্টর',
      role: 'সফটওয়্যার ইঞ্জিনিয়ার',
      tag: 'টেক স্পেশালিস্ট',
      rating: '৪.৯',
      reviews: '১২০+',
      courses: '১টি কোর্স',
      students: '৫০০+ শিক্ষার্থী',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    };
    handleChange('mentorsList', [...(form.mentorsList || []), newMentor]);
  };

  const handleDeleteMentor = (index: number) => {
    const list = [...(form.mentorsList || [])];
    list.splice(index, 1);
    handleChange('mentorsList', list);
  };

  // Testimonials handlers
  const handleTestimonialChange = (index: number, field: keyof TestimonialItem, value: any) => {
    const list = [...(form.testimonialsList || [])];
    list[index] = { ...list[index], [field]: value };
    handleChange('testimonialsList', list);
  };

  const handleAddTestimonial = () => {
    const newTestimonial: TestimonialItem = {
      id: `test-${Date.now()}`,
      student: 'শিক্ষার্থীর নাম',
      company: 'সফটওয়্যার ইঞ্জিনিয়ার, টেক কোম্পানি',
      quote: 'SkillNest Academy থেকে কোর্স করে আমার ক্যারিয়ারে নতুন দিগন্ত উন্মোচিত হয়েছে!',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: 5
    };
    handleChange('testimonialsList', [...(form.testimonialsList || []), newTestimonial]);
  };

  const handleDeleteTestimonial = (index: number) => {
    const list = [...(form.testimonialsList || [])];
    list.splice(index, 1);
    handleChange('testimonialsList', list);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const ok = await updateSettings(form, token);
      if (ok) {
        toastSuccess('ওয়েবসাইট কন্টেন্ট সফলভাবে সেভ ও লাইভ আপডেট করা হয়েছে!');
        setHasChanges(false);
      } else {
        toastError('কন্টেন্ট সেভ করতে সমস্যা হয়েছে');
      }
    } catch {
      toastError('নেটওয়ার্ক ত্রুটি');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('আপনি কি নিশ্চিত যে সকল কন্টেন্ট প্রাথমিক ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?')) {
      setIsSaving(true);
      const ok = await resetToDefaults(token);
      setIsSaving(false);
      if (ok) {
        toastSuccess('সকল কন্টেন্ট ডিফল্ট অবস্থায় ফিরিয়ে আনা হয়েছে');
        setHasChanges(false);
      } else {
        toastError('রিসেট ব্যর্থ হয়েছে');
      }
    }
  };

  const subPageMeta: Record<
    string,
    { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    hero: {
      title: 'হিরো ব্যানার ও মূল শিরোনাম কনফিগারেশন',
      subtitle: 'ওয়েবসাইটের মূল ব্যানার, বড় শিরোনাম, সাব-টাইটেল, বাটন টেক্সট ও ট্রাস্ট ব্যাজ কাস্টমাইজ করুন',
      icon: Sparkles
    },
    promo: {
      title: 'প্রমো নোটিশ বার ও স্পেশাল অফার',
      subtitle: 'ওয়েবসাইটের শীর্ষে প্রদর্শিত নোটিশ বার, ডিসকাউন্ট অফার টেক্সট ও লিংক কনফিগার করুন',
      icon: Megaphone
    },
    stats: {
      title: 'প্ল্যাটফর্ম পরিসংখ্যান ও কাউন্টার সেটিংস',
      subtitle: 'মোট শিক্ষার্থী, কোর্স সংখ্যা, সাকসেস রেট ও মেন্টর কাউন্টার ডেটা আপডেট করুন',
      icon: BarChart3
    },
    sections: {
      title: 'সেকশন শিরোনাম ও ক্যাটাগরি ব্যাজ',
      subtitle: 'হোমপেজের বিভিন্ন সেকশন, ফিচারড কোর্স এবং ক্যাটাগরি ব্লকের শিরোনাম নির্ধারণ করুন',
      icon: FolderTree
    },
    features: {
      title: 'আমাদের বিশেষ সুবিধাসমূহ (Platform Features)',
      subtitle: 'প্ল্যাটফর্মের ৪টি মূল সুবিধা, আইকন, টাইটেল ও বর্ণনা এডিট করুন',
      icon: Layers
    },
    mentors: {
      title: 'শিক্ষক ও মেন্টর শোকেস কনফিগারেশন',
      subtitle: 'হোমপেজে প্রদর্শিত সেরা মেন্টরদের প্রোফাইল, ছবি, রেটিং ও বায়ো পরিচালনা করুন',
      icon: Users
    },
    testimonials: {
      title: 'শিক্ষার্থীদের সফলতার গল্প ও রিভিউ',
      subtitle: 'সফল শিক্ষার্থীদের প্রশংসাপত্র, অভিজ্ঞতা ও রেটিংস ম্যানেজ করুন',
      icon: MessageSquare
    },
    cta: {
      title: 'কল টু অ্যাকশন ও সাইন-আপ ব্যানার',
      subtitle: 'হোমপেজের নিচের আকর্ষণীয় নিবন্ধন ব্যানার, অ্যাকশন বাটন ও পার্সেন্টেজ অফার কাস্টমাইজ করুন',
      icon: Zap
    },
    contact: {
      title: 'যোগাযোগ ও ক্যাম্পাস তথ্য সেটিংস',
      subtitle: 'অফিস ঠিকানা, হেল্পলাইন নম্বর, ইমেইল ও সাপোর্ট কাজের সময়সূচি নির্ধারণ করুন',
      icon: Phone
    },
    footer: {
      title: 'ফুটার ও সোশ্যাল মিডিয়া লিংকস',
      subtitle: 'ওয়েবসাইট ফুটার কপিরাইট, সোশ্যাল চ্যানেল লিংক ও দরকারি পেইজ লিংক কনফিগার করুন',
      icon: Share2
    },
    gateways: {
      title: 'পেমেন্ট গেটওয়ে নির্দেশনা ও ট্রানজেকশন গাইড',
      subtitle: 'বিকাশ, নগদ ও রকেট পেমেন্ট নাম্বার ও ম্যানুয়াল ট্রানজেকশন গাইডলাইন আপডেট করুন',
      icon: CreditCard
    }
  };

  const currentMeta = subPageMeta[activeTab] || subPageMeta.hero;
  const PageIcon = currentMeta.icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Dedicated Page Header Card (No horizontal tab clutter - individual page per submenu) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-xs shrink-0">
            <PageIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                ওয়েব কন্টেন্ট (CMS)
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                {currentMeta.title.split(' ')[0]}
              </span>
              {hasChanges && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold animate-pulse">
                  পরিবর্তন আনসেভড
                </span>
              )}
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              {currentMeta.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentMeta.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
          {onPreviewHome && (
            <button
              onClick={onPreviewHome}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="লাইভ হোমপেজে দেখুন"
            >
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>লাইভ সাইট দেখুন</span>
            </button>
          )}

          <button
            onClick={handleReset}
            disabled={isSaving}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="ডিফল্ট অবস্থায় ফিরিয়ে আনুন"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">রিসেট</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>সেভ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>পরিবর্তন সেভ করুন</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main CMS Editor Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs">
        
        {/* ========================================================= */}
        {/* TAB 1: HERO SECTION */}
        {/* ========================================================= */}
        {activeTab === 'hero' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                হিরো সেকশন কন্টেন্ট (Hero Banner Settings)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                হোমপেজের মূল ব্যানার, বড় শিরোনাম, সাব-টাইটেল, বাটন টেক্সট ও ট্রাস্ট ব্যাজ কনফিগার করুন
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Badge text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  টপ স্মল ব্যাজ (Bangla)
                </label>
                <input
                  type="text"
                  value={form.heroBadgeBn || ''}
                  onChange={(e) => handleChange('heroBadgeBn', e.target.value)}
                  placeholder="যেমন: 🔥 বাংলায় সেরা টেক স্কিলস একাডেমি"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  টপ স্মল ব্যাজ (English)
                </label>
                <input
                  type="text"
                  value={form.heroBadgeEn || ''}
                  onChange={(e) => handleChange('heroBadgeEn', e.target.value)}
                  placeholder="e.g. 🔥 Bangladesh’s #1 Tech Skills Academy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Main Heading Bangla */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  মূল হেডলাইন (Bangla Title)
                </label>
                <input
                  type="text"
                  value={form.heroBannerTitleBn || ''}
                  onChange={(e) => handleChange('heroBannerTitleBn', e.target.value)}
                  placeholder="যেমন: নিজের স্কিলকে ক্যারিয়ারে রূপ দিন"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Main Heading English */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  মূল হেডলাইন (English Title)
                </label>
                <input
                  type="text"
                  value={form.heroBannerTitleEn || ''}
                  onChange={(e) => handleChange('heroBannerTitleEn', e.target.value)}
                  placeholder="e.g. Transform Your Skills Into a Dream Career"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Highlighted phrases */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  হাইলাইট কালার টেক্সট (Bangla Highlight)
                </label>
                <input
                  type="text"
                  value={form.heroHighlightBn || ''}
                  onChange={(e) => handleChange('heroHighlightBn', e.target.value)}
                  placeholder="যেমন: ক্যারিয়ারের রূপ"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  এই টেক্সটটি শিরোনামের মধ্যে সবুজ বা অ্যাকসেন্ট কালারে দেখাবে
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  হাইলাইট কালার টেক্সট (English Highlight)
                </label>
                <input
                  type="text"
                  value={form.heroHighlightEn || ''}
                  onChange={(e) => handleChange('heroHighlightEn', e.target.value)}
                  placeholder="e.g. Dream Career"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Subtitle Bangla */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  সাব-টাইটেল / বিবরণ (Bangla Subtitle)
                </label>
                <textarea
                  rows={2}
                  value={form.heroBannerSubBn || ''}
                  onChange={(e) => handleChange('heroBannerSubBn', e.target.value)}
                  placeholder="ইন্ডাস্ট্রি-ফোকাসড কোর্স, বাস্তব প্রজেক্ট এবং অভিজ্ঞ মেন্টরের গাইডলাইনে নিজের ক্যারিয়ার গড়ে তুলুন।"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Subtitle English */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  সাব-টাইটেল / বিবরণ (English Subtitle)
                </label>
                <textarea
                  rows={2}
                  value={form.heroBannerSubEn || ''}
                  onChange={(e) => handleChange('heroBannerSubEn', e.target.value)}
                  placeholder="Industry-focused curriculums, hands-on projects, and 1-on-1 mentor guidance to build your high-paying tech career."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* CTA 1 (Primary) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  প্রধান বাটন টেক্সট (Primary Button)
                </label>
                <input
                  type="text"
                  value={form.heroCta1TextBn || ''}
                  onChange={(e) => handleChange('heroCta1TextBn', e.target.value)}
                  placeholder="যেমন: কোর্স দেখুন →"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  বাটন ১ লিঙ্ক / রাউট (Button 1 Target)
                </label>
                <input
                  type="text"
                  value={form.heroCta1Link || 'courses'}
                  onChange={(e) => handleChange('heroCta1Link', e.target.value)}
                  placeholder="courses"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* CTA 2 (Secondary) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  সেকেন্ডারি বাটন টেক্সট (Secondary Button)
                </label>
                <input
                  type="text"
                  value={form.heroCta2TextBn || ''}
                  onChange={(e) => handleChange('heroCta2TextBn', e.target.value)}
                  placeholder="যেমন: শুরু করুন"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  বাটন ২ লিঙ্ক / রাউট (Button 2 Target)
                </label>
                <input
                  type="text"
                  value={form.heroCta2Link || 'courses'}
                  onChange={(e) => handleChange('heroCta2Link', e.target.value)}
                  placeholder="courses"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Trust Indicators */}
              <div className="md:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  ট্রাস্ট ইন্ডিকেটর ব্যাজসমূহ (Trust Bullets)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={form.trustBullet1 || ''}
                    onChange={(e) => handleChange('trustBullet1', e.target.value)}
                    placeholder="✓ প্র্যাকটিক্যাল লার্নিং"
                    className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                  <input
                    type="text"
                    value={form.trustBullet2 || ''}
                    onChange={(e) => handleChange('trustBullet2', e.target.value)}
                    placeholder="✓ প্রজেক্ট-বেসড কোর্স"
                    className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                  <input
                    type="text"
                    value={form.trustBullet3 || ''}
                    onChange={(e) => handleChange('trustBullet3', e.target.value)}
                    placeholder="✓ ভেরিফায়েড সার্টিফিকেট"
                    className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PROMO BANNER & POPUP */}
        {/* ========================================================= */}
        {activeTab === 'promo' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top Announcement Bar */}
            <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Megaphone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      টপ প্রমোশন অ্যানাউন্সমেন্ট বার (Top Promo Banner)
                    </h4>
                    <p className="text-xs text-slate-500">ওয়েবসাইটের একদম উপরে যে অফার বারটি থাকে</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.topBannerEnabled !== false}
                    onChange={(e) => handleChange('topBannerEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {form.topBannerEnabled !== false ? 'চালু আছে' : 'বন্ধ'}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ব্যানার ব্যাজ (Badge)
                  </label>
                  <input
                    type="text"
                    value={form.topBannerBadgeBn || ''}
                    onChange={(e) => handleChange('topBannerBadgeBn', e.target.value)}
                    placeholder="যেমন: ৯.৯ মেগা অফার"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    অফার ঘোষণা টেক্সট (Offer Headline)
                  </label>
                  <input
                    type="text"
                    value={form.topBannerTextBn || ''}
                    onChange={(e) => handleChange('topBannerTextBn', e.target.value)}
                    placeholder="যেমন: সীমিত সময়ের জন্য প্রতিটি কোর্সে সর্বোচ্চ ৩৯% ফ্ল্যাট ছাড় চলছে!"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কুপন কোড (Coupon Code)
                  </label>
                  <input
                    type="text"
                    value={form.topBannerCoupon || ''}
                    onChange={(e) => handleChange('topBannerCoupon', e.target.value.toUpperCase())}
                    placeholder="NINE"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    বাটন টেক্সট (Button Text)
                  </label>
                  <input
                    type="text"
                    value={form.topBannerBtnTextBn || ''}
                    onChange={(e) => handleChange('topBannerBtnTextBn', e.target.value)}
                    placeholder="ভর্তি হোন"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Promo Ads Popup Modal */}
            <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      প্রমো পপআপ মোডাল (Popup Ads Modal)
                    </h4>
                    <p className="text-xs text-slate-500">ভিজিটর ওয়েবসাইটে প্রবেশ করার পর যে ডিসকাউন্ট পপআপ আসে</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.promoModalEnabled !== false}
                    onChange={(e) => handleChange('promoModalEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {form.promoModalEnabled !== false ? 'চালু আছে' : 'বন্ধ'}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পপআপ টাইটেল (Popup Title)
                  </label>
                  <input
                    type="text"
                    value={form.promoModalTitle || ''}
                    onChange={(e) => handleChange('promoModalTitle', e.target.value)}
                    placeholder="বৈশাখী ও স্পেশাল মেগা স্কিল ডিসকাউন্ট!"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ডিসকাউন্ট হাইলাইট ব্যাজ
                  </label>
                  <input
                    type="text"
                    value={form.promoModalDiscount || ''}
                    onChange={(e) => handleChange('promoModalDiscount', e.target.value)}
                    placeholder="৩৯% ফ্ল্যাট ছাড়"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পপআপ বিবরণ (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={form.promoModalSubtitle || ''}
                    onChange={(e) => handleChange('promoModalSubtitle', e.target.value)}
                    placeholder="বাংলাদেশের সেরা ইন্ডাস্ট্রিয়াল প্রজেক্ট-ভিত্তিক কোর্সে এনরোল করুন বিশেষ ছাড়ে।"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    প্রমো কুপন কোড
                  </label>
                  <input
                    type="text"
                    value={form.promoModalCode || ''}
                    onChange={(e) => handleChange('promoModalCode', e.target.value.toUpperCase())}
                    placeholder="NINE"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কাউন্টডাউন টাইমার (ঘণ্টা)
                  </label>
                  <input
                    type="number"
                    value={form.promoModalHours || 14}
                    onChange={(e) => handleChange('promoModalHours', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Live Sales & Customer Engagement Social Proof Toast */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      লাইভ সেলস ও সোশ্যাল প্রুফ নোটিফিকেশন (Live Sales Toast)
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                        কাস্টমার এনগেজমেন্ট
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      কয়েক সেকেন্ড পর পর ওয়েবসাইটের কোণায় রিসেন্ট কোর্স কেনার অ্যালার্ট প্রদর্শন করে ট্রাস্ট ও এনগেজমেন্ট বাড়ায়
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.liveSalesNotificationEnabled !== false}
                    onChange={(e) => handleChange('liveSalesNotificationEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {form.liveSalesNotificationEnabled !== false ? 'চালু আছে' : 'বন্ধ'}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    নোটিফিকেশন বিরতি (Interval in Seconds)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={4}
                      max={60}
                      value={form.liveSalesIntervalSeconds || 8}
                      onChange={(e) => handleChange('liveSalesIntervalSeconds', Math.max(4, Number(e.target.value)))}
                      className="w-28 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                    <span className="text-xs text-slate-500">
                      প্রতি {form.liveSalesIntervalSeconds || 8} সেকেন্ড পর পর পরবর্তী নোটিফিকেশনটি আসবে
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    ডাটাবেসের নতুন যেকোনো অর্ডার স্বয়ংক্রিয়ভাবে সবার প্রথমে প্রদর্শিত হবে। ঢাকা, চট্টগ্রাম, সিলেট সহ বিভিন্ন জেলার রিয়েল-টাইম তথ্য দেখাবে।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: STATS & COUNTERS */}
        {/* ========================================================= */}
        {activeTab === 'stats' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                হোমপেজ পরিসংখ্যান কাউন্টার (Dynamic Stats Counters)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                হোমপেজে প্রদর্শিত ৪টি মূল সংখ্যা ও লেবেল পরিবর্তন করুন
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Stat 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold text-emerald-600 uppercase">কাউন্টার ১ (Counter 1)</span>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">মান / সংখ্যা</label>
                  <input
                    type="text"
                    value={form.stat1Value || ''}
                    onChange={(e) => handleChange('stat1Value', e.target.value)}
                    placeholder="১০,০০০+"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">লেবেল (Bangla)</label>
                  <input
                    type="text"
                    value={form.stat1LabelBn || ''}
                    onChange={(e) => handleChange('stat1LabelBn', e.target.value)}
                    placeholder="গ্র্যাজুয়েট ও শিক্ষার্থী"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold text-blue-600 uppercase">কাউন্টার ২ (Counter 2)</span>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">মান / সংখ্যা</label>
                  <input
                    type="text"
                    value={form.stat2Value || ''}
                    onChange={(e) => handleChange('stat2Value', e.target.value)}
                    placeholder="৯৪%"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">লেবেল (Bangla)</label>
                  <input
                    type="text"
                    value={form.stat2LabelBn || ''}
                    onChange={(e) => handleChange('stat2LabelBn', e.target.value)}
                    placeholder="সফল কর্মসংস্থান হার"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold text-purple-600 uppercase">কাউন্টার ৩ (Counter 3)</span>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">মান / সংখ্যা</label>
                  <input
                    type="text"
                    value={form.stat3Value || ''}
                    onChange={(e) => handleChange('stat3Value', e.target.value)}
                    placeholder="৫০+"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">লেবেল (Bangla)</label>
                  <input
                    type="text"
                    value={form.stat3LabelBn || ''}
                    onChange={(e) => handleChange('stat3LabelBn', e.target.value)}
                    placeholder="টপ টেক হায়ারিং পার্টনার"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold text-amber-600 uppercase">কাউন্টার ৪ (Counter 4)</span>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">মান / সংখ্যা</label>
                  <input
                    type="text"
                    value={form.stat4Value || ''}
                    onChange={(e) => handleChange('stat4Value', e.target.value)}
                    placeholder="৪.৯/৫"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">লেবেল (Bangla)</label>
                  <input
                    type="text"
                    value={form.stat4LabelBn || ''}
                    onChange={(e) => handleChange('stat4LabelBn', e.target.value)}
                    placeholder="গড় স্টুডেন্ট রেটিং"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: SECTIONS (Categories & Featured Courses Headers) */}
        {/* ========================================================= */}
        {activeTab === 'sections' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-emerald-600" />
                ক্যাটেগরি ও সেরা কোর্স সেকশন কন্টেন্ট
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                হোমপেজের শীর্ষ ক্যাটাগরি এবং সেরা ও ট্রেন্ডিং কোর্স সেকশনের টাইটেল, সাবটাইটেল এবং বাটন টেক্সট পরিবর্তন করুন
              </p>
            </div>

            {/* Categories Section Content */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-700/80">
                <FolderTree className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  শীর্ষ ক্যাটাগরি সেকশন (Explore Categories)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ক্যাটেগরি সেকশন ব্যাজ (Badge Text)
                  </label>
                  <input
                    type="text"
                    value={form.categoriesBadgeBn || ''}
                    onChange={(e) => handleChange('categoriesBadgeBn', e.target.value)}
                    placeholder="ক্যাটেগরি এক্সপ্লোর করুন"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    বাটন টেক্সট (Button Text)
                  </label>
                  <input
                    type="text"
                    value={form.categoriesBtnTextBn || ''}
                    onChange={(e) => handleChange('categoriesBtnTextBn', e.target.value)}
                    placeholder="সকল ক্যাটাগরি"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মূল শিরোনাম (Section Title)
                  </label>
                  <input
                    type="text"
                    value={form.categoriesTitleBn || ''}
                    onChange={(e) => handleChange('categoriesTitleBn', e.target.value)}
                    placeholder="শীর্ষ ক্যাটাগরিগুলো ব্রাউজ করুন"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    উপ-শিরোনাম (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={form.categoriesSubBn || ''}
                    onChange={(e) => handleChange('categoriesSubBn', e.target.value)}
                    placeholder="আপনার পছন্দের প্রযুক্তি বেছে নিয়ে শেখা শুরু করুন"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Featured Courses Section Content */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-700/80">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  জনপ্রিয় ও সেরা কোর্স সেকশন (Featured Courses)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    টপ হাইলাইট ব্যাজ (Badge Text)
                  </label>
                  <input
                    type="text"
                    value={form.featuredBadgeBn || ''}
                    onChange={(e) => handleChange('featuredBadgeBn', e.target.value)}
                    placeholder="★ জনপ্রিয় কোর্স"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    বাটন টেক্সট (Button Text)
                  </label>
                  <input
                    type="text"
                    value={form.featuredBtnTextBn || ''}
                    onChange={(e) => handleChange('featuredBtnTextBn', e.target.value)}
                    placeholder="সব কোর্স দেখুন"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মূল শিরোনাম (Section Title)
                  </label>
                  <input
                    type="text"
                    value={form.featuredTitleBn || ''}
                    onChange={(e) => handleChange('featuredTitleBn', e.target.value)}
                    placeholder="আমাদের সেরা কোর্সে ভর্তি হোন"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    উপ-শিরোনাম (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={form.featuredSubBn || ''}
                    onChange={(e) => handleChange('featuredSubBn', e.target.value)}
                    placeholder="ইন্ডাস্ট্রি বিশেষজ্ঞদের তৈরি হ্যান্ডস-অন প্রজেক্টভিত্তিক সিলেবাস"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: MENTORS & INSTRUCTORS */}
        {/* ========================================================= */}
        {activeTab === 'mentors' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  শিক্ষক ও মেন্টর ম্যানেজমেন্ট (Instructors & Mentors)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  হোমপেজের মেন্টর স্লাইডার সেকশনের হেডলাইন ও সকল মেন্টরের প্রোফাইল এডিট ও যুক্ত করুন
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddMentor}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন মেন্টর যোগ করুন</span>
              </button>
            </div>

            {/* Section Headings */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সেকশন ব্যাজ (Badge Text)
                </label>
                <input
                  type="text"
                  value={form.mentorsBadgeBn || ''}
                  onChange={(e) => handleChange('mentorsBadgeBn', e.target.value)}
                  placeholder="ইন্ডাস্ট্রি লিডার ও মেন্টরস"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মূল শিরোনাম (Section Title)
                </label>
                <input
                  type="text"
                  value={form.mentorsTitleBn || ''}
                  onChange={(e) => handleChange('mentorsTitleBn', e.target.value)}
                  placeholder="শীর্ষ ইন্ডাস্ট্রি এক্সপার্টদের সাথে শিখুন"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  উপ-শিরোনাম (Subtitle)
                </label>
                <input
                  type="text"
                  value={form.mentorsSubBn || ''}
                  onChange={(e) => handleChange('mentorsSubBn', e.target.value)}
                  placeholder="দেশি-বিদেশি শীর্ষ সফটওয়্যার প্রতিষ্ঠানে কর্মরত সিনিয়র ইঞ্জিনিয়ার..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
            </div>

            {/* Mentors List */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>বর্তমান মেন্টরদের তালিকা ({form.mentorsList?.length || 0} জন)</span>
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(form.mentorsList || []).map((mentor, idx) => (
                  <div
                    key={mentor.id || idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={mentor.image}
                          alt={mentor.name}
                          className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40"
                        />
                        <div>
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white">{mentor.name || `মেন্টর #${idx + 1}`}</h5>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{mentor.role}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteMentor(idx)}
                        className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="মেন্টর ডিলিট করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          নাম (Name)
                        </label>
                        <input
                          type="text"
                          value={mentor.name}
                          onChange={(e) => handleMentorChange(idx, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          পদবি ও প্রতিষ্ঠান (Role)
                        </label>
                        <input
                          type="text"
                          value={mentor.role}
                          onChange={(e) => handleMentorChange(idx, 'role', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          ট্যাগ / বিশেষজ্ঞতা (Tag)
                        </label>
                        <input
                          type="text"
                          value={mentor.tag}
                          onChange={(e) => handleMentorChange(idx, 'tag', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          রেটিং (Rating)
                        </label>
                        <input
                          type="text"
                          value={mentor.rating}
                          onChange={(e) => handleMentorChange(idx, 'rating', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-amber-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          কোর্স সংখ্যা
                        </label>
                        <input
                          type="text"
                          value={mentor.courses}
                          onChange={(e) => handleMentorChange(idx, 'courses', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          শিক্ষার্থী সংখ্যা
                        </label>
                        <input
                          type="text"
                          value={mentor.students}
                          onChange={(e) => handleMentorChange(idx, 'students', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          ছবি লিংক (Avatar Image URL)
                        </label>
                        <input
                          type="text"
                          value={mentor.image}
                          onChange={(e) => handleMentorChange(idx, 'image', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: TESTIMONIALS & REVIEWS */}
        {/* ========================================================= */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  শিক্ষার্থীদের রিভিউ ও সাফল্যগাঁথা (Testimonials)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  হোমপেজে প্রদর্শিত শিক্ষার্থীদের সফলতার গল্প এবং ফিডব্যাক পরিবর্তন ও নতুন রিভিউ যুক্ত করুন
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddTestimonial}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন রিভিউ যোগ করুন</span>
              </button>
            </div>

            {/* Section Headings */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সেকশন ব্যাজ (Badge Text)
                </label>
                <input
                  type="text"
                  value={form.testimonialsBadgeBn || ''}
                  onChange={(e) => handleChange('testimonialsBadgeBn', e.target.value)}
                  placeholder="শিক্ষার্থীদের সাফল্যগাঁথা"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মূল শিরোনাম (Section Title)
                </label>
                <input
                  type="text"
                  value={form.testimonialsTitleBn || ''}
                  onChange={(e) => handleChange('testimonialsTitleBn', e.target.value)}
                  placeholder="শিক্ষার্থীদের সফলতার গল্প"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  উপ-শিরোনাম (Subtitle)
                </label>
                <input
                  type="text"
                  value={form.testimonialsSubBn || ''}
                  onChange={(e) => handleChange('testimonialsSubBn', e.target.value)}
                  placeholder="সফলভাবে কোর্স শেষ করে যারা আজ বিভিন্ন প্রতিষ্ঠানে কাজ করছেন"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
            </div>

            {/* Testimonials List */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                বর্তমান রিভিউ তালিকা ({form.testimonialsList?.length || 0} টি)
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(form.testimonialsList || []).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3.5 relative group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.avatar}
                          alt={item.student}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white">{item.student}</h5>
                          <p className="text-xs text-slate-500">{item.company}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteTestimonial(idx)}
                        className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="রিভিউ ডিলিট করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          শিক্ষার্থীর উক্তি / মন্তব্য (Quote)
                        </label>
                        <textarea
                          rows={3}
                          value={item.quote}
                          onChange={(e) => handleTestimonialChange(idx, 'quote', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                            শিক্ষার্থীর নাম (Student Name)
                          </label>
                          <input
                            type="text"
                            value={item.student}
                            onChange={(e) => handleTestimonialChange(idx, 'student', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                            কর্মসংস্থান / পদবি (Company / Role)
                          </label>
                          <input
                            type="text"
                            value={item.company}
                            onChange={(e) => handleTestimonialChange(idx, 'company', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                            প্রোফাইল ছবি লিংক (Avatar URL)
                          </label>
                          <input
                            type="text"
                            value={item.avatar}
                            onChange={(e) => handleTestimonialChange(idx, 'avatar', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: CALL TO ACTION BANNER */}
        {/* ========================================================= */}
        {activeTab === 'cta' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                নিবন্ধন ও এনরোলমেন্ট ব্যানার (CTA Banner Settings)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                হোমপেজের নিচের আকর্ষণীয় গ্রিন ব্যানারের টাইটেল, সাবটাইটেল এবং বাটন টেক্সট ও লিংক কনফিগার করুন
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  টপ ব্যাজ (Badge Text)
                </label>
                <input
                  type="text"
                  value={form.ctaBannerBadgeBn || ''}
                  onChange={(e) => handleChange('ctaBannerBadgeBn', e.target.value)}
                  placeholder="সীমিত সময়ের অফার"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  মূল শিরোনাম (Banner Title)
                </label>
                <input
                  type="text"
                  value={form.ctaBannerTitleBn || ''}
                  onChange={(e) => handleChange('ctaBannerTitleBn', e.target.value)}
                  placeholder="আজই শুরু করুন আপনার টেক ক্যারিয়ার গড়ার যাত্রা"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  উপ-শিরোনাম ও বিবরণ (Subtitle)
                </label>
                <textarea
                  rows={2}
                  value={form.ctaBannerSubBn || ''}
                  onChange={(e) => handleChange('ctaBannerSubBn', e.target.value)}
                  placeholder="বিকাশ বা নগদে সরাসরি ভর্তি হোন এবং যেকোনো সময় যেকোনো ডিভাইস থেকে ক্লাস শুরু করুন।"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>

              {/* Button 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold text-emerald-600 uppercase">বাটন ১ (Primary CTA Button)</span>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">বাটন টেক্সট</label>
                  <input
                    type="text"
                    value={form.ctaBannerBtn1TextBn || ''}
                    onChange={(e) => handleChange('ctaBannerBtn1TextBn', e.target.value)}
                    placeholder="সকল কোর্সসমূহ দেখুন"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">ক্লিক লিংক / রুট</label>
                  <input
                    type="text"
                    value={form.ctaBannerBtn1Link || ''}
                    onChange={(e) => handleChange('ctaBannerBtn1Link', e.target.value)}
                    placeholder="courses"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Button 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold text-teal-600 uppercase">বাটন ২ (Secondary CTA Button)</span>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">বাটন টেক্সট</label>
                  <input
                    type="text"
                    value={form.ctaBannerBtn2TextBn || ''}
                    onChange={(e) => handleChange('ctaBannerBtn2TextBn', e.target.value)}
                    placeholder="আমাদের সাথে যোগাযোগ করুন"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">ক্লিক লিংক / রুট</label>
                  <input
                    type="text"
                    value={form.ctaBannerBtn2Link || ''}
                    onChange={(e) => handleChange('ctaBannerBtn2Link', e.target.value)}
                    placeholder="contact"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: VALUE PROPOSITIONS (4 Cards) */}
        {/* ========================================================= */}
        {activeTab === 'features' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                আমাদের বৈশিষ্ট্য (Why Choose Us - Value Propositions)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                হোমপেজে দেখানো ৪টি মূল আকর্ষণ ও সুবিধা এডিট করুন
              </p>
            </div>

            {/* Why Choose Us Section Title & Subtitle */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সেকশন শিরোনাম (Section Title)
                </label>
                <input
                  type="text"
                  value={form.whyChooseTitleBn || ''}
                  onChange={(e) => handleChange('whyChooseTitleBn', e.target.value)}
                  placeholder="কেন SkillNest Academy শিক্ষার্থীদের প্রথম পছন্দ?"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  উপ-শিরোনাম (Subtitle)
                </label>
                <input
                  type="text"
                  value={form.whyChooseSubBn || ''}
                  onChange={(e) => handleChange('whyChooseSubBn', e.target.value)}
                  placeholder="শুধুমাত্র ভিডিও টিউটোরিয়াল নয়; আমরা দিই সম্পূর্ণ ক্যারিয়ার গাইডলাইন..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[0, 1, 2, 3].map((idx) => {
                const item = form.valueProps?.[idx] || { title: '', desc: '' };
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <span className="text-xs font-bold text-emerald-600 uppercase">ফিচার #{idx + 1}</span>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        শিরোনাম (Title)
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleValuePropChange(idx, 'title', e.target.value)}
                        placeholder={`ফিচার ${idx + 1} শিরোনাম`}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        বিবরণ (Description)
                      </label>
                      <textarea
                        rows={2}
                        value={item.desc}
                        onChange={(e) => handleValuePropChange(idx, 'desc', e.target.value)}
                        placeholder={`ফিচার ${idx + 1} বিবরণ`}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: CONTACT & OFFICE */}
        {/* ========================================================= */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-600" />
                যোগাযোগ, ক্যাম্পাস ও সাপোর্ট তথ্য
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ফুটার ও যোগাযোগ পেজের ফোন নম্বর, হটলাইন, অফিস ঠিকানা ও সাপোর্ট সময়সূচি
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  সাপোর্ট ফোন নম্বর / হটলাইন
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.contactPhone || ''}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    placeholder="+৮৮০ ১৮০০-৭৫৪৫৫৬"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  অফিসিয়াল ইমেইল
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={form.contactEmail || ''}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    placeholder="support@skillnest.academy"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  সাপোর্ট কাজের সময় (Working Hours)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.contactWorkingHours || ''}
                    onChange={(e) => handleChange('contactWorkingHours', e.target.value)}
                    placeholder="সকাল ১০টা - রাত ৮টা (শনি - বৃহস্পতি)"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  মুদ্রা প্রতীক (Currency Symbol)
                </label>
                <input
                  type="text"
                  value={form.currencySymbol || '৳'}
                  onChange={(e) => handleChange('currencySymbol', e.target.value)}
                  placeholder="৳"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  ঢাকা ক্যাম্পাস / অফিস ঠিকানা
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={form.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="লেভেল ৮, ভিশন টেক টাওয়ার, কারওয়ান বাজার, ঢাকা-১২১৫"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: FOOTER & SOCIAL LINKS */}
        {/* ========================================================= */}
        {activeTab === 'footer' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-600" />
                ফুটার বায়ো ও সোশ্যাল মিডিয়া লিঙ্ক
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ফুটারের পরিচিতি টেক্সট, কপিরাইট নোটিশ এবং সোশ্যাল হ্যান্ডেল
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  ফুটার বায়ো / ব্র্যান্ড পরিচিতি
                </label>
                <textarea
                  rows={2}
                  value={form.footerBioBn || ''}
                  onChange={(e) => handleChange('footerBioBn', e.target.value)}
                  placeholder="বাংলাদেশের তরুণ প্রজন্মকে আন্তর্জাতিক মানের প্রযুক্তিবিদ হিসেবে গড়ে তোলার বিশ্বস্ত অনলাইন লার্নিং প্ল্যাটফর্ম।"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  কপিরাইট টেক্সট
                </label>
                <input
                  type="text"
                  value={form.copyrightText || ''}
                  onChange={(e) => handleChange('copyrightText', e.target.value)}
                  placeholder="© ২০২৬ SkillNest Academy Ltd. সর্বস্বত্ব সংরক্ষিত।"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  ফেসবুক পেজ লিঙ্ক (Facebook)
                </label>
                <input
                  type="url"
                  value={form.facebookUrl || ''}
                  onChange={(e) => handleChange('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/skillnest.academy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  ইউটিউব চ্যানেল লিঙ্ক (YouTube)
                </label>
                <input
                  type="url"
                  value={form.youtubeUrl || ''}
                  onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                  placeholder="https://youtube.com/@skillnest.academy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  লিঙ্কডইন পেজ লিঙ্ক (LinkedIn)
                </label>
                <input
                  type="url"
                  value={form.linkedinUrl || ''}
                  onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/company/skillnest-academy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  গিটহাব লিঙ্ক (GitHub)
                </label>
                <input
                  type="url"
                  value={form.githubUrl || ''}
                  onChange={(e) => handleChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/skillnest-academy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: PAYMENT GATEWAYS */}
        {/* ========================================================= */}
        {activeTab === 'gateways' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                পেমেন্ট গেটওয়ে সুইচ ও অ্যাক্টিভেশন
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                শিক্ষার্থীদের জন্য কোন কোন পেমেন্ট মেথড চেকআউটে সক্রিয় থাকবে তা নির্বাচন করুন
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* bKash */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#E2136E]">bKash (বিকাশ)</h4>
                  <p className="text-xs text-slate-500">বিকাশ পেমেন্ট গেটওয়ে ও ম্যানুয়াল ট্রানজেকশন</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.bkashEnabled !== false}
                    onChange={(e) => handleChange('bkashEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E2136E]"></div>
                </label>
              </div>

              {/* Nagad */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#F7931E]">Nagad (নগদ)</h4>
                  <p className="text-xs text-slate-500">নগদ মোবাইল ফিনান্সিয়াল সার্ভিস</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.nagadEnabled !== false}
                    onChange={(e) => handleChange('nagadEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F7931E]"></div>
                </label>
              </div>

              {/* SSLCommerz */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-indigo-600 dark:text-indigo-400">SSLCommerz</h4>
                  <p className="text-xs text-slate-500">ডেবিট/ক্রেডিট কার্ড, ইন্টারনেট ব্যাংকিং</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.sslcommerzEnabled !== false}
                    onChange={(e) => handleChange('sslcommerzEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Stripe */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400">Stripe International</h4>
                  <p className="text-xs text-slate-500">আন্তর্জাতিক কার্ড ও বৈশ্বিক মুদ্রা পেমেন্ট</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.stripeEnabled !== false}
                    onChange={(e) => handleChange('stripeEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar inside CMS container */}
        <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            সেভ করার সাথে সাথে ওয়েবসাইটের সকল ভিজিটর নতুন কন্টেন্ট দেখতে পাবেন
          </span>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>সেভ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>পরিবর্তন সেভ করুন</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
