import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, ExternalLink, Key, Server } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const AdminDatabaseSettings: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [testing, setTesting] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    configured: boolean;
    connected: boolean;
    message: string;
  }>({
    configured: false,
    connected: false,
    message: 'কানেকশন চেক করা হচ্ছে...'
  });
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  const checkConnection = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/supabase/status');
      const data = await res.json();
      setStatus(data);
      if (data.connected) {
        success('Supabase PostgreSQL ডাটাবেজে সফলভাবে কানেক্টেড হয়েছে!');
      }
    } catch (err: any) {
      setStatus({
        configured: false,
        connected: false,
        message: 'সার্ভারের সাথে যোগাযোগ করা সম্ভব হয়নি।'
      });
      toastError('কানেকশন চেক করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
      setTesting(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleCopyEnvGuide = () => {
    const envText = `# Supabase PostgreSQL Credentials
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"`;
    navigator.clipboard.writeText(envText);
    setCopiedSql(true);
    success('এনভায়রনমেন্ট ভ্যারিয়েবল টেমপ্লেট কপি হয়েছে!');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/40">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>Supabase PostgreSQL ডাটাবেজ ইন্টিগ্রেশন</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold uppercase">
                Production Ready
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              সমস্ত শিক্ষার্থী, কোর্স, অর্ডার ও প্ল্যাটফর্ম কনটেন্ট রিয়েলটাইম Supabase ডাটাবেজে পারসিস্ট করুন
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={checkConnection}
          disabled={testing}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
          <span>{testing ? 'চেক হচ্ছে...' : 'কানেকশন রিফ্রেশ করুন'}</span>
        </button>
      </div>

      {/* Live Status Indicator */}
      <div
        className={`p-4 rounded-2xl border flex items-start sm:items-center justify-between gap-4 transition-all ${
          status.connected
            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200'
            : status.configured
            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200'
            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {status.connected ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          )}
          <div>
            <div className="text-xs font-black uppercase tracking-wider">
              {status.connected
                ? 'ডাটাবেজ সক্রিয় ও সংযুক্ত (Connected)'
                : status.configured
                ? 'কনফিগারেশন পাওয়া গেছে, কিন্তু কানেকশন অপেক্ষমাণ'
                : 'Supabase কানেকশন কনফিগার করা বাকি'}
            </div>
            <div className="text-xs opacity-90 mt-0.5 font-medium">
              {status.message}
            </div>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-[11px] font-black shrink-0 ${
            status.connected
              ? 'bg-emerald-600 text-white'
              : status.configured
              ? 'bg-amber-500 text-white'
              : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          {status.connected ? 'LIVE ONLINE' : status.configured ? 'CONNECTING' : 'IN-MEMORY STORE'}
        </span>
      </div>

      {/* Step by step guide to connect */}
      <div className="space-y-4 pt-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-600" />
          <span>আপনার Supabase একাউন্টে কানেক্ট করার ৩টি সহজ ধাপ:</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                ১
              </span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 hover:underline"
              >
                <span>Supabase Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <h5 className="font-bold text-xs text-slate-900 dark:text-white">ফ্রি প্রজেক্ট তৈরি করুন</h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Supabase.com এ লগইন করে <strong>New Project</strong> তৈরি করুন এবং ডেটাবেজের জন্য একটি পাসওয়ার্ড সেট করুন।
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                ২
              </span>
              <span className="text-[10px] font-bold text-slate-400">supabase-schema.sql</span>
            </div>
            <h5 className="font-bold text-xs text-slate-900 dark:text-white">SQL Schema রান করুন</h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Supabase এর <strong>SQL Editor</strong> এ গিয়ে প্রজেক্টের রুট ফোল্ডারে থাকা <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">supabase-schema.sql</code> ফাইলের কোড রান করুন।
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                ৩
              </span>
              <Key className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <h5 className="font-bold text-xs text-slate-900 dark:text-white">API Keys যুক্ত করুন</h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              প্রজেক্ট Settings এ গিয়ে <strong>SUPABASE_URL</strong> এবং <strong>SUPABASE_SERVICE_ROLE_KEY</strong> বসান।
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleCopyEnvGuide}
            className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSql ? 'কপি হয়েছে!' : 'এনভায়রনমেন্ট ভ্যারিয়েবল ফরম্যাট কপি করুন'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
