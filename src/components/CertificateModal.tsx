import React, { useRef } from 'react';
import { Award, Download, Copy, Check, X, ShieldCheck, Printer, ExternalLink } from 'lucide-react';
import { Certificate } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
  onVerifyLookup?: (certId: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
  onVerifyLookup
}) => {
  const { language, t } = useLanguage();
  const { success } = useToast();
  const [copied, setCopied] = React.useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !certificate) return null;

  const verifyUrl = `${window.location.origin}?page=verify-cert&id=${certificate.certificateNumber}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    success(language === 'bn' ? 'ভেরিফিকেশন লিঙ্ক কপি করা হয়েছে!' : 'Verification link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-100 flex flex-col">
        
        {/* Modal Top Actions */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm sm:text-base">
              {language === 'bn' ? 'অফিসিয়াল ডিজিটাল সার্টিফিকেট' : 'Official Verified Certificate'}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {certificate.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{t('copyVerifyLink')}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'bn' ? 'প্রিন্ট / PDF' : 'Print / PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="p-4 sm:p-8 overflow-x-auto flex justify-center bg-slate-100 dark:bg-slate-950">
          <div
            ref={certRef}
            id="printable-certificate"
            className="w-[780px] min-w-[700px] h-[550px] bg-white text-slate-900 rounded-xl p-8 shadow-xl border-8 border-double border-amber-600/60 relative flex flex-col justify-between select-none"
            style={{
              backgroundImage: 'radial-gradient(circle at center, #ffffff 0%, #fbfaf5 100%)'
            }}
          >
            {/* Elegant Corner Filigrees */}
            <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-amber-700/60" />
            <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-amber-700/60" />
            <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-amber-700/60" />
            <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-amber-700/60" />

            {/* Header / Brand */}
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
                  SN
                </div>
                <span className="font-extrabold text-xl tracking-wider text-slate-900">
                  SKILLNEST ACADEMY
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 tracking-widest uppercase">
                CENTER FOR PROFESSIONAL EXCELLENCE & ADVANCED TECHNOLOGY
              </p>
              <div className="pt-2">
                <h2 className="text-2xl font-serif font-black tracking-wide text-amber-900 uppercase">
                  CERTIFICATE OF COMPLETION
                </h2>
                <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-1" />
              </div>
            </div>

            {/* Recipient Content */}
            <div className="text-center space-y-3 my-auto">
              <p className="text-xs text-slate-500 italic tracking-wide">
                {language === 'bn'
                  ? 'এই মর্মে প্রত্যায়ন করা যাচ্ছে যে সফলভাবে কোর্স সম্পন্ন করেছেন'
                  : 'This is to officially certify that'}
              </p>
              <h1 className="text-3xl font-serif font-bold text-slate-900 border-b border-amber-400/40 pb-2 inline-block px-8">
                {certificate.studentName}
              </h1>
              <p className="text-xs text-slate-500 italic max-w-lg mx-auto">
                {language === 'bn'
                  ? 'তিনি সাফল্যের সাথে নিম্নলিখিত প্রফেশনাল কারিকুলাম ও সকল প্রজেক্ট অ্যাসাইনমেন্ট সম্পন্ন করেছেন:'
                  : 'has successfully demonstrated proficiency, completing all curriculum modules and required practical projects for:'}
              </p>
              <h3 className="text-xl font-bold text-emerald-800 max-w-xl mx-auto">
                {certificate.courseTitle}
              </h3>
            </div>

            {/* Bottom Signatures & Seal */}
            <div className="flex items-end justify-between pt-4 border-t border-slate-200">
              
              {/* Instructor Signature */}
              <div className="text-center w-48">
                <div className="font-serif italic text-base text-slate-700 mb-1 border-b border-slate-300 pb-1">
                  {certificate.instructorName}
                </div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">
                  {t('instructorSign')}
                </p>
              </div>

              {/* Gold Center Seal */}
              <div className="flex flex-col items-center">
                <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-1 shadow-md flex items-center justify-center text-amber-950">
                  <div className="w-full h-full rounded-full border border-amber-900/30 flex flex-col items-center justify-center text-center p-1">
                    <ShieldCheck className="w-5 h-5 text-amber-900" />
                    <span className="text-[8px] font-extrabold tracking-tighter uppercase">VERIFIED</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1">
                  ID: {certificate.certificateNumber}
                </span>
              </div>

              {/* Platform Authority */}
              <div className="text-center w-48">
                <div className="font-serif italic text-base text-slate-700 mb-1 border-b border-slate-300 pb-1">
                  Tanvir Ahmed
                </div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">
                  {t('platformSign')}
                </p>
              </div>

            </div>

            {/* Certificate Footer Meta */}
            <div className="pt-2 flex items-center justify-between text-[9px] text-slate-400">
              <span>ইস্যু তারিখ / Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
              <span>Verify authenticity at skillnest.academy/verify/{certificate.certificateNumber}</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Info */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-600 dark:text-slate-300">
            <span>কপি করার লিঙ্ক: </span>
            <code className="font-mono text-[11px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-emerald-700 dark:text-emerald-400">
              {certificate.certificateNumber}
            </code>
          </div>
          {onVerifyLookup && (
            <button
              onClick={() => {
                onClose();
                onVerifyLookup(certificate.certificateNumber);
              }}
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
            >
              <span>পাবলিক ভেরিফিকেশন পেজে চেক করুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
