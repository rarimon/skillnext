import React from 'react';

interface TopProgressBarProps {
  progress: number;
  isVisible: boolean;
}

export const TopProgressBar: React.FC<TopProgressBarProps> = ({ progress, isVisible }) => {
  if (!isVisible && progress === 0) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] pointer-events-none transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Background Track (semi-transparent) */}
      <div className="w-full h-[3.5px] bg-slate-900/10 dark:bg-white/10 overflow-hidden">
        {/* Active Animated Progress Bar */}
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 transition-all duration-200 ease-out shadow-[0_0_12px_rgba(16,185,129,0.9)] relative"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          {/* Glowing head light spark */}
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/90 blur-[1px]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_#10b981]" />
        </div>
      </div>
    </div>
  );
};
