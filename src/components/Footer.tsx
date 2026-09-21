import React from 'react';
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Youtube,
  Linkedin,
  Github,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWebsiteContent } from '../context/WebsiteContentContext';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { settings } = useWebsiteContent();

  const platformName = settings.platformName || 'SkillNest Academy';
  const supportEmail = settings.supportEmail || 'support@skillnest.academy';
  const supportPhone = settings.supportPhone || '+৮৮০ ১৮০০-৭৫৪৫৫৬ (সকাল ১০টা - রাত ৮টা)';
  const address = (language === 'bn' ? settings.addressBn : settings.addressEn) || settings.addressBn || 'লেভেল ৮, ভিশন টেক টাওয়ার, কারওয়ান বাজার, ঢাকা-১২১৫';
  const slogan = (language === 'bn' ? settings.footerSloganBn : settings.footerSloganEn) || settings.footerSloganBn || 'বাংলাদেশের তরুণ প্রজন্মকে আন্তর্জাতিক মানের প্রযুক্তিবিদ, ডিজাইনার ও উদ্যোক্তা হিসেবে গড়ে তোলার বিশ্বস্ত অনলাইন লার্নিং প্ল্যাটফর্ম।';

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
                {platformName}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm leading-relaxed">
              {slogan}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {settings.socialFacebook && (
                <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.socialYoutube && (
                <a href={settings.socialYoutube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinkedin && (
                <a href={settings.socialLinkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings.socialGithub && (
                <a href={settings.socialGithub} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {language === 'bn' ? 'কোর্সসমূহ' : 'Popular Courses'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  {language === 'bn' ? 'ফুল স্ট্যাক ওয়েব ডেভেলপমেন্ট' : 'Full Stack Web Dev'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  {language === 'bn' ? 'রিঅ্যাক্ট ও নেক্সট.জেএস' : 'React & Next.js'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  {language === 'bn' ? 'লার্যাভেল ব্যাকএন্ড' : 'Laravel Backend'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  {language === 'bn' ? 'ইউআই/ইউএক্স ও ফিগমা' : 'UI/UX Design'}
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {language === 'bn' ? 'প্ল্যাটফর্ম' : 'Platform'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  {language === 'bn' ? 'সকল ক্যাটাগরি' : 'Categories'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('instructors')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  {language === 'bn' ? 'মেন্টরস ও শিক্ষক' : 'Mentors'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('verify-cert')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('navVerifyCert')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('navBlog')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer">
                  {language === 'bn' ? 'যোগাযোগ ও সাপোর্ট' : 'Contact Support'}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact / Office Dhaka */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {language === 'bn' ? 'অফিস ও যোগাযোগ' : 'Campus & Contact'}
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{supportPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{supportEmail}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
          
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="font-semibold text-slate-700 dark:text-slate-300 mr-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {language === 'bn' ? 'নিরাপদ পেমেন্ট গেটওয়ে:' : 'Secure Payments:'}
            </span>
            {settings.enableBkash !== false && (
              <span className="px-2.5 py-1 rounded bg-[#E2136E]/10 text-[#E2136E] font-bold border border-[#E2136E]/20">
                bKash বিকাশ
              </span>
            )}
            {settings.enableNagad !== false && (
              <span className="px-2.5 py-1 rounded bg-[#F7931E]/10 text-[#F7931E] font-bold border border-[#F7931E]/20">
                Nagad নগদ
              </span>
            )}
            {settings.enableSSLCommerz !== false && (
              <span className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                SSLCommerz
              </span>
            )}
            <span className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              Visa / MasterCard
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button onClick={() => onNavigate('terms')} className="hover:underline cursor-pointer">
              {language === 'bn' ? 'শর্তাবলী' : 'Terms of Service'}
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('privacy')} className="hover:underline cursor-pointer">
              {language === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('refund')} className="hover:underline cursor-pointer">
              {language === 'bn' ? 'রিফান্ড পলিসি' : 'Refund Policy'}
            </button>
            <span>•</span>
            <span>{settings.copyrightText || `© ${new Date().getFullYear()} ${platformName}. All rights reserved.`}</span>
          </div>

        </div>
      </div>
    </footer>
  );
};
