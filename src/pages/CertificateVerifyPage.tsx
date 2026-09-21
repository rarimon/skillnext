import React, { useState, useEffect } from 'react';
import { Award, Search, CheckCircle2, XCircle, ShieldCheck, ArrowRight, Printer, Share2 } from 'lucide-react';
import { Certificate } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CertificateVerifyPageProps {
  initialCertId?: string;
  onNavigate: (route: string) => void;
}

export const CertificateVerifyPage: React.FC<CertificateVerifyPageProps> = ({
  initialCertId = '',
  onNavigate
}) => {
  const { language, t } = useLanguage();
  const [certInput, setCertInput] = useState(initialCertId);
  const [searchedId, setSearchedId] = useState(initialCertId);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sampleIds = ['SN-2025-8849', 'SN-2025-9921', 'SN-2025-1042'];

  const doVerify = async (idToVerify: string) => {
    if (!idToVerify.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setCertificate(null);
    setSearchedId(idToVerify.trim());

    try {
      const res = await fetch(`/api/certificates/verify/${encodeURIComponent(idToVerify.trim())}`);
      const data = await res.json();
      if (res.ok && data.certificate) {
        setCertificate(data.certificate);
      } else {
        setErrorMsg(data.error || 'সার্টিফিকেটটি খুঁজে পাওয়া যায়নি বা প্রত্যাহার করা হয়েছে');
      }
    } catch {
      setErrorMsg('ভেরিফিকেশন সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCertId) {
      setCertInput(initialCertId);
      doVerify(initialCertId);
    }
  }, [initialCertId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doVerify(certInput);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      
      {/* Page Title & Search Box */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{language === 'bn' ? 'অফিসিয়াল সার্টিফিকেট ডাটাবেজ' : 'Official Verification Registry'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {t('verifyCertificateTitle')}
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {language === 'bn'
            ? 'SkillNest Academy কর্তৃক ইস্যুকৃত যেকোনো ডিজিটাল সার্টিফিকেটের সত্যতা যাচাই করতে সার্টিফিকেটের ইউনিক নম্বরটি এখানে লিখুন।'
            : 'Enter the unique certificate serial number to instantly verify its authenticity directly from the institution register.'}
        </p>

        {/* Verification Input Form */}
        <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              placeholder={t('verifyInputPlaceholder')}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            {loading ? 'যাচাই হচ্ছে...' : t('verifyBtn')}
          </button>
        </form>

        {/* Quick Sample IDs */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1 flex-wrap">
          <span>{language === 'bn' ? 'ডেমো ট্রাই করুন:' : 'Try sample ID:'}</span>
          {sampleIds.map((sid) => (
            <button
              key={sid}
              type="button"
              onClick={() => {
                setCertInput(sid);
                doVerify(sid);
              }}
              className="font-mono text-emerald-600 dark:text-emerald-400 hover:underline bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded"
            >
              {sid}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Card */}
      {certificate && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-500/40 shadow-xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
          
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                  {t('certValid')}
                </h3>
                <p className="text-xs text-slate-500">
                  অফিসিয়াল ডাটাবেজে রেকর্ডটি সফলভাবে নিশ্চিত করা হয়েছে।
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">{t('certificateId')}</span>
              <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                {certificate.certificateNumber}
              </span>
            </div>
          </div>

          {/* Certificate Credential Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="text-slate-400 font-medium">শিক্ষার্থীর নাম (Student Name):</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {certificate.studentName}
              </h4>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="text-slate-400 font-medium">কোর্সের নাম (Completed Course):</span>
              <h4 className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                {certificate.courseTitle}
              </h4>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="text-slate-400 font-medium">ইস্যু তারিখ (Issue Date):</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {new Date(certificate.issueDate).toLocaleDateString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
              <span className="text-slate-400 font-medium">কোর্স ইনস্ট্রাক্টর (Instructor):</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {certificate.instructorName}
              </p>
            </div>
          </div>

          {/* Institution Guarantee footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>SkillNest Academy Center for Professional Excellence</span>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন</span>
            </button>
          </div>

        </div>
      )}

      {/* Error / Invalid State */}
      {errorMsg && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 p-6 sm:p-8 space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 mx-auto flex items-center justify-center">
            <XCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-rose-600 dark:text-rose-400">
              {t('certInvalid')}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              "{searchedId}" নম্বরের কোনো সার্টিফিকেট ডাটাবেজে পাওয়া যায়নি। বানান ও হাইফেন সঠিক রয়েছে কি না নিশ্চিত করে পুনরায় চেষ্টা করুন।
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
