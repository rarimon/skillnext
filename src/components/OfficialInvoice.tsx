import React, { useRef } from 'react';
import {
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Globe,
  Calendar,
  CreditCard,
  User,
  MapPin,
  QrCode,
  FileCheck,
  X,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Order } from '../types';

interface OfficialInvoiceProps {
  order: any; // Can be completedOrder or Order
  onClose?: () => void;
  isModal?: boolean;
}

export const OfficialInvoice: React.FC<OfficialInvoiceProps> = ({ order, onClose, isModal = false }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const invoiceNumber = order.orderNumber || (order.id ? `INV-2026-${order.id.slice(-6).toUpperCase()}` : `INV-2026-98214`);
  const invoiceDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });

  const studentName = order.studentName || order.user?.name || 'শিক্ষার্থী';
  const studentEmail = order.studentEmail || order.user?.email || 'student@skillnest.bd';
  const studentPhone = order.studentPhone || order.user?.phone || '01712-345678';
  const district = order.district || 'ঢাকা, বাংলাদেশ';
  const paymentMethod = order.paymentMethod || 'bKash';
  const trxId = order.trxId || (order.paymentMethod === 'CARD' ? `CARD-${Date.now().toString().slice(-6)}` : `TXN${Date.now().toString().slice(-8)}`);
  const items = order.items || [];
  const subtotal = order.subtotal || order.total || 0;
  const discount = order.discountAmount || 0;
  const total = order.total || subtotal - discount;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate clean self-contained HTML invoice document for offline opening & PDF save
    const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>SkillNest-Invoice-${invoiceNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body { background: #f8fafc; padding: 30px 15px; color: #1e293b; }
    .invoice-card { max-width: 800px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #10b981; }
    .brand h1 { color: #065f46; font-size: 26px; font-weight: 900; }
    .brand p { color: #64748b; font-size: 12px; margin-top: 4px; }
    .invoice-title { text-align: right; }
    .invoice-title h2 { font-size: 22px; color: #0f172a; font-weight: 800; }
    .invoice-title .badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-top: 6px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 24px 0; padding: 18px; background: #f8fafc; border-radius: 12px; font-size: 13px; }
    .meta-col h3 { font-size: 12px; color: #64748b; text-transform: uppercase; margin-bottom: 6px; }
    .meta-col p { font-size: 13px; line-height: 1.5; color: #334155; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 13px; }
    th { background: #f1f5f9; padding: 12px; text-align: left; color: #475569; font-weight: 700; border-bottom: 1px solid #cbd5e1; }
    td { padding: 14px 12px; border-bottom: 1px solid #e2e8f0; }
    .text-right { text-align: right; }
    .totals { width: 320px; margin-left: auto; margin-top: 16px; font-size: 13px; }
    .totals .row { display: flex; justify-content: space-between; padding: 6px 0; color: #64748b; }
    .totals .row.grand { border-top: 2px solid #e2e8f0; padding-top: 10px; font-size: 16px; font-weight: 800; color: #065f46; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #64748b; }
    .seal { text-align: right; }
    .seal-box { border: 2px dashed #10b981; color: #065f46; padding: 8px 16px; border-radius: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: inline-block; }
    @media print {
      body { padding: 0; background: white; }
      .invoice-card { border: none; box-shadow: none; padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div class="brand">
        <h1>SkillNest Tech Academy</h1>
        <p>Govt. Approved Skill Development & Tech Training Platform</p>
        <p>Level 4, BDBL Bhaban, Kawran Bazar, Dhaka-1215</p>
        <p>Email: support@skillnest.bd | Helpline: +880 1712-345678</p>
      </div>
      <div class="invoice-title">
        <h2>মানি রিসিট ও ইনভয়েস</h2>
        <div class="badge">PAID & VERIFIED</div>
        <p style="font-size: 12px; margin-top: 6px; font-family: monospace;"># ${invoiceNumber}</p>
        <p style="font-size: 12px; color: #64748b;">তারিখ: ${invoiceDate}</p>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-col">
        <h3>বিল প্রাপক (শিক্ষার্থীর বিবরণ):</h3>
        <p><strong>নাম:</strong> ${studentName}</p>
        <p><strong>ইমেইল:</strong> ${studentEmail}</p>
        <p><strong>ফোন:</strong> ${studentPhone}</p>
        <p><strong>ঠিকানা:</strong> ${district}</p>
      </div>
      <div class="meta-col">
        <h3>পেমেন্ট বিবরণী:</h3>
        <p><strong>পেমেন্ট মাধ্যম:</strong> ${paymentMethod}</p>
        <p><strong>ট্রানজেকশন আইডি (TrxID):</strong> <span style="font-family: monospace; font-weight: bold;">${trxId}</span></p>
        <p><strong>পেমেন্ট স্ট্যাটাস:</strong> <span style="color: #065f46; font-weight: bold;">পরিশোধিত (PAID)</span></p>
        <p><strong>কোর্স অ্যাক্সেস:</strong> লাইফটাইম আনলিমিটেড</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>কোর্সের বিবরণ</th>
          <th>ধরন</th>
          <th class="text-right">মূল্য (৳)</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((item: any, idx: number) => `
          <tr>
            <td>${idx + 1}</td>
            <td>
              <strong>${item.courseTitle || 'স্কিল কোর্স'}</strong>
              <div style="font-size: 11px; color: #64748b;">লাইফটাইম এক্সেস • ভেরিফায়েড সার্টিফিকেট • মেন্টর সাপোর্ট</div>
            </td>
            <td>অনলাইন কোর্স</td>
            <td class="text-right">৳${((item.price || total) ?? 0).toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="row">
        <span>সাবটোটাল (Subtotal):</span>
        <span>৳${(subtotal ?? 0).toLocaleString()}</span>
      </div>
      ${discount > 0 ? `
      <div class="row" style="color: #065f46; font-weight: 600;">
        <span>কুপন ডিসকাউন্ট (Discount):</span>
        <span>- ৳${(discount ?? 0).toLocaleString()}</span>
      </div>
      ` : ''}
      <div class="row">
        <span>প্লাটফর্ম ও গেটওয়ে চার্জ:</span>
        <span>৳০ (ফ্রি)</span>
      </div>
      <div class="row grand">
        <span>সর্বমোট পরিশোধিত (Grand Total):</span>
        <span>৳${(total ?? 0).toLocaleString()}</span>
      </div>
    </div>

    <div class="footer">
      <div>
        <p><strong>শর্তাবলী:</strong> এটি একটি ইলেকট্রনিক কম্পিউটার-জেনারেটেড অফিসিয়াল ইনভয়েস।</p>
        <p>যেকোনো সহায়তার জন্য যোগাযোগ করুন: <strong>support@skillnest.bd</strong></p>
        <p>© 2026 SkillNest Tech Academy Ltd. সর্বস্বত্ব সংরক্ষিত।</p>
      </div>
      <div class="seal">
        <div class="seal-box">SKILLNEST VERIFIED</div>
        <p style="font-size: 10px; margin-top: 4px; color: #64748b;">Authorized Accounts Dept.</p>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() {
      // Auto prompt to print/save as PDF
      // window.print();
    }
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SkillNest-Invoice-${invoiceNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={isModal ? 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200' : 'w-full'}>
      
      {/* Invoice Card Container */}
      <div
        ref={invoiceRef}
        id="official-invoice-document"
        className={`w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden relative ${
          isModal ? 'my-auto' : ''
        }`}
      >
        
        {/* Action Header Bar (Hidden during print) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>অফিসিয়াল পেমেন্ট ইনভয়েস ও রসিদ</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px]">
              {invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Print to Paper or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট করুন</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer shadow-xs"
              title="Download Invoice File"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>ডাউনলোড (HTML/PDF)</span>
            </button>

            {isModal && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Printable Invoice Sheet Body */}
        <div className="p-6 sm:p-10 space-y-6 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 print:text-black print:bg-white">
          
          {/* Top Company & Invoice Identification Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-emerald-500">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  SN
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 print:text-emerald-800">
                    SkillNest Tech Academy
                  </h1>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Govt. Reg. Technical Training & Skill Development Platform
                  </p>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 space-y-0.5 leading-relaxed">
                <p>Level 4, BDBL Bhaban, Kawran Bazar, Dhaka-1215</p>
                <p>Helpline: +880 1712-345678 | Email: billing@skillnest.bd</p>
                <p>Web: www.skillnest.com.bd</p>
              </div>
            </div>

            {/* Invoice Meta & Seal */}
            <div className="sm:text-right space-y-1 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                ✓ PAID & VERIFIED
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white pt-1">
                পেমেন্ট মানি রিসিট
              </h2>
              <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                ইনভয়েস নং: <span className="text-emerald-600">{invoiceNumber}</span>
              </p>
              <p className="text-xs text-slate-500">
                ইস্যু তারিখ: {invoiceDate}
              </p>
            </div>
          </div>

          {/* Student Info & Payment Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs">
            {/* Student Info */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>বিল প্রাপক (Student Info)</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{studentName}</p>
              <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{studentEmail}</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{studentPhone}</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{district}</span>
              </p>
            </div>

            {/* Payment Details */}
            <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 md:pl-4 pt-3 md:pt-0">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>পেমেন্ট তথ্য (Payment Details)</span>
              </div>
              <p className="text-slate-700 dark:text-slate-200">
                <strong>মাধ্যম:</strong> <span className="font-bold text-emerald-600">{paymentMethod}</span>
              </p>
              <p className="text-slate-700 dark:text-slate-200">
                <strong>TrxID:</strong> <span className="font-mono font-bold">{trxId}</span>
              </p>
              <p className="text-slate-700 dark:text-slate-200">
                <strong>স্ট্যাটাস:</strong> <span className="font-bold text-emerald-600">সম্পন্ন ও ভেরিফায়েড</span>
              </p>
              <p className="text-slate-700 dark:text-slate-200">
                <strong>কোর্স এক্সেস:</strong> লাইফটাইম অ্যাক্সেস সক্রিয়
              </p>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">কোর্সের বিবরণ ও কারিকুলাম</th>
                  <th className="p-3">এক্সেস ধরন</th>
                  <th className="p-3 text-right">মূল্য (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.length === 0 ? (
                  <tr>
                    <td className="p-3 font-mono">1</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">ফুলস্ট্যাক প্রফেশনাল কোর্স</div>
                      <div className="text-[11px] text-slate-400">লাইফটাইম অ্যাক্সেস • ভেরিফায়েড ডিজিটাল সার্টিফিকেট • মেন্টর সাপোর্ট</div>
                    </td>
                    <td className="p-3">অনলাইন একাডেমি</td>
                    <td className="p-3 text-right font-bold text-slate-900 dark:text-white">৳{(total ?? 0).toLocaleString()}</td>
                  </tr>
                ) : (
                  items.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {item.courseTitle || 'টেক স্কিলস কোর্স'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          লাইফটাইম অ্যাক্সেস • ভেরিফায়েড ডিজিটাল সার্টিফিকেট • গিটহাব প্রজেক্ট রিভিউ
                        </div>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">ফুল কোর্স</td>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                        ৳{((item.price !== undefined ? item.price : total) ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown / Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-2">
            
            {/* Guarantee Note */}
            <div className="max-w-xs space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>৭ দিনের মানিব্যাক গ্যারান্টি পলিসি</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                SkillNest-এর সকল কোর্সে মানিব্যাক নিরাপত্তা রয়েছে। যেকোনো জিজ্ঞাসায় আমাদের হেল্পলাইনে যোগাযোগ করুন।
              </p>
            </div>

            {/* Total Math Table */}
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>কোর্সের সাবটোটাল:</span>
                <span className="font-bold text-slate-900 dark:text-white">৳{(subtotal ?? 0).toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>কুপন ছাড় (Discount):</span>
                  <span>- ৳{(discount ?? 0).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>প্লাটফর্ম ও গেটওয়ে ফি:</span>
                <span className="font-bold text-emerald-600">৳০ (ফ্রি)</span>
              </div>
              <div className="pt-2 border-t-2 border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-900 dark:text-white">সর্বমোট পরিশোধিত:</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">৳{(total ?? 0).toLocaleString()}</span>
              </div>
            </div>

          </div>

          {/* Official Verification Seal & Signature Footer */}
          <div className="pt-6 border-t border-dashed border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <QrCode className="w-8 h-8" />
              </div>
              <div className="text-[11px] text-slate-400">
                <p className="font-bold text-slate-700 dark:text-slate-300">ডিজিটাল ভেরিফিকেশন কোড</p>
                <p className="font-mono">{invoiceNumber}</p>
                <p>স্ক্যান করে রসিদের সত্যতা যাচাই করুন</p>
              </div>
            </div>

            {/* Authorized Signature Seal */}
            <div className="text-center sm:text-right">
              <div className="inline-block border-2 border-emerald-500/80 rounded-xl px-4 py-1.5 text-emerald-700 dark:text-emerald-400 font-black tracking-widest text-[11px] uppercase bg-emerald-50/60 dark:bg-emerald-950/40">
                SKILLNEST ACCOUNTS VERIFIED
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Authorized Accounts & Billing Signature
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
