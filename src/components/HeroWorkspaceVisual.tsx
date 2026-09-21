import React, { useState } from 'react';
import {
  Code,
  Terminal,
  Play,
  Award,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';

interface HeroWorkspaceVisualProps {
  onExplore?: () => void;
}

export const HeroWorkspaceVisual: React.FC<HeroWorkspaceVisualProps> = ({ onExplore }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'react' | 'backend'>('react');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative w-full max-w-xl lg:max-w-none mx-auto select-none">
      {/* Background Ambient Glows */}
      <div className="absolute -top-12 -left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Terminal / Laptop Frame */}
      <div className="relative rounded-3xl bg-slate-900/95 dark:bg-slate-900/95 border border-slate-700/80 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl overflow-hidden text-left transition-all">
        {/* Top Window Bar */}
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              skillnest-workspace ~ main*
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
            <button
              onClick={() => setActiveCodeTab('react')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeCodeTab === 'react' ? 'bg-emerald-600/30 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              App.tsx
            </button>
            <button
              onClick={() => setActiveCodeTab('backend')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeCodeTab === 'backend' ? 'bg-emerald-600/30 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              server.ts
            </button>
          </div>
        </div>

        {/* Code Viewport with Syntax Highlighting */}
        <div className="p-4 sm:p-5 font-mono text-[12px] sm:text-[13px] leading-relaxed text-slate-300 overflow-x-auto">
          {activeCodeTab === 'react' ? (
            <div className="space-y-1">
              <div>
                <span className="text-purple-400">import</span>{' '}
                <span className="text-cyan-300">&#123; SkillNest, Course &#125;</span>{' '}
                <span className="text-purple-400">from</span>{' '}
                <span className="text-emerald-300">&apos;@skillnest/core&apos;</span>;
              </div>
              <div className="text-slate-500 italic">// 🚀 বাংলা ভাষায় আন্তর্জাতিক ক্যারিয়ার গড়ুন</div>
              <div>
                <span className="text-blue-400">export default function</span>{' '}
                <span className="text-amber-300">CareerPath</span>() &#123;
              </div>
              <div className="pl-4">
                <span className="text-purple-400">const</span> [skills, setSkills] ={' '}
                <span className="text-blue-300">useState</span>([<span className="text-emerald-300">&apos;React&apos;</span>, <span className="text-emerald-300">&apos;Node.js&apos;</span>, <span className="text-emerald-300">&apos;Cloud&apos;</span>]);
              </div>
              <div className="pl-4">
                <span className="text-purple-400">return</span> (
              </div>
              <div className="pl-8">
                &lt;<span className="text-rose-400">SkillNest.Workspace</span>{' '}
                <span className="text-amber-300">mode</span>=<span className="text-emerald-300">&quot;production-ready&quot;</span>&gt;
              </div>
              <div className="pl-12">
                &lt;<span className="text-cyan-300">MentorSupport</span>{' '}
                <span className="text-amber-300">status</span>=<span className="text-emerald-400">&quot;active-24/7&quot;</span> /&gt;
              </div>
              <div className="pl-12">
                &lt;<span className="text-cyan-300">CertifiedOutcome</span> /&gt;
              </div>
              <div className="pl-8">
                &lt;/<span className="text-rose-400">SkillNest.Workspace</span>&gt;
              </div>
              <div className="pl-4">);</div>
              <div>&#125;</div>
            </div>
          ) : (
            <div className="space-y-1">
              <div>
                <span className="text-purple-400">import</span> express{' '}
                <span className="text-purple-400">from</span>{' '}
                <span className="text-emerald-300">&apos;express&apos;</span>;
              </div>
              <div className="text-slate-500 italic">// 🛡️ সুরক্ষিত ও স্কেলেবল ব্যাকএন্ড এপিআই</div>
              <div>
                <span className="text-purple-400">const</span> app ={' '}
                <span className="text-blue-300">express</span>();
              </div>
              <div>
                app.<span className="text-blue-300">post</span>(
                <span className="text-emerald-300">&apos;/api/career/boost&apos;</span>, async (req, res) =&gt; &#123;
              </div>
              <div className="pl-4">
                <span className="text-purple-400">const</span> result ={' '}
                <span className="text-purple-400">await</span>{' '}
                <span className="text-blue-300">verifyCertificate</span>(req.user.id);
              </div>
              <div className="pl-4">
                res.<span className="text-blue-300">json</span>(&#123; success: <span className="text-amber-400">true</span>, ready: <span className="text-emerald-300">&apos;Hired!&apos;</span> &#125;);
              </div>
              <div>&#125;);</div>
            </div>
          )}
        </div>

        {/* Bottom Interactive Terminal Status */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-semibold">Ready to build</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">Vite 6 + React 19 + TypeScript</span>
          </div>
          <span className="text-slate-500 text-[11px]">8.4k+ learners online</span>
        </div>
      </div>

      {/* Floating Card 1: Active Course Learning Card (Top-Right / Overlap) */}
      <div className="absolute -top-6 -right-3 sm:-right-6 w-56 sm:w-64 p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-xl backdrop-blur-md animate-float-slow hidden sm:block">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-white truncate">ফুলস্ট্যাক রিঅ্যাক্ট ট্র্যাক</p>
            <p className="text-[10px] text-emerald-400 font-medium">লেসন ১৫/১৮ চলছে</p>
          </div>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1.5">
          <div className="bg-emerald-500 h-full w-[84%] rounded-full" />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>প্রগ্রেস</span>
          <span className="text-emerald-400 font-bold">৮৪% সম্পন্ন</span>
        </div>
      </div>

      {/* Floating Card 2: Verified Certificate Badge (Bottom-Left / Overlap) */}
      <div className="absolute -bottom-6 -left-3 sm:-left-6 w-56 sm:w-64 p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-xl backdrop-blur-md animate-float-medium hidden sm:block">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-extrabold text-white truncate">ডিজিটাল সার্টিফিকেট</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>
            <p className="text-[10px] text-slate-300 truncate">QR ভেরিফিকেশন কোডসহ</p>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
          <span className="text-emerald-400 font-bold">✓ ভেরিফাইড ক্রেডেনশিয়াল</span>
          <span className="text-slate-400 font-mono">ID: SN-2025</span>
        </div>
      </div>

      {/* Floating Badge: Technology Icons */}
      <div className="absolute top-1/2 -right-4 -translate-y-1/2 flex flex-col gap-2.5 hidden md:flex">
        <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 shadow-lg backdrop-blur-md flex items-center justify-center text-cyan-400 text-xs font-bold hover:scale-110 transition-transform" title="React.js">
          ⚛️
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 shadow-lg backdrop-blur-md flex items-center justify-center text-amber-400 text-xs font-bold hover:scale-110 transition-transform" title="JavaScript">
          JS
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 shadow-lg backdrop-blur-md flex items-center justify-center text-blue-400 text-xs font-bold hover:scale-110 transition-transform" title="Python">
          🐍
        </div>
      </div>

      {/* Central Play Trigger Button (Pulsing Video preview) */}
      <button
        onClick={() => {
          setIsPlaying(!isPlaying);
          if (onExplore) onExplore();
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/50 hover:scale-110 transition-transform animate-pulse-glow z-10"
        title="ভিডিও ডেমো প্রিভিউ"
      >
        <Play className="w-6 h-6 fill-white translate-x-0.5" />
      </button>

      {/* Mobile Badge Strip (shown under or inside on small screens) */}
      <div className="mt-4 flex sm:hidden items-center justify-between gap-2 text-xs">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          <span>৮৪% কোর্স সম্পন্ন</span>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-400 font-semibold flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5" />
          <span>ভেরিফায়েড সার্টিফিকেট</span>
        </div>
      </div>
    </div>
  );
};
