import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';

interface JinnaLogoProps {
  theme?: 'dark' | 'light';
}

export const JinnaLogo: React.FC<JinnaLogoProps> = () => {
  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer">
      {/* Luxurious Multi-stop Gradient Icon with Subtle Ambient Glow & Light Shimmer Animation */}
      <div className="relative flex-shrink-0">
        {/* Subtle breathing ambient glow */}
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 opacity-60 blur-xs animate-pulse" />

        {/* Main Luxurious Gradient Icon Box */}
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/40 flex-shrink-0 overflow-hidden">
          {/* Animated Light Sweep Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-jinna-shimmer pointer-events-none" />

          {/* Central Processor Core */}
          <Cpu className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />

          {/* Live pulsing dot indicator */}
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-200" />
          </span>
        </div>
      </div>

      {/* Typography & Creator Credential */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Original Luxurious Animated JINNA 5 Gradient (cyan-300 -> white -> blue-200) */}
          <span 
            className="font-black text-xl tracking-tight bg-clip-text text-transparent animate-jinna-shimmer"
            style={{
              backgroundImage: 'linear-gradient(90deg, #67e8f9 0%, #ffffff 25%, #93c5fd 50%, #ffffff 75%, #67e8f9 100%)',
              backgroundSize: '200% auto',
            }}
          >
            JINNA 5
          </span>

          {/* AI Systems & LLMs Badge */}
          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 shadow-sm shadow-cyan-950/40">
            <Sparkles className="w-2.5 h-2.5 text-cyan-300 animate-pulse" />
            <span>AI Systems & LLMs</span>
          </span>
        </div>

        {/* Lead Engineer & Attribution */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 flex-wrap">
          <span className="text-slate-400">تم التطوير بواسطة</span>
          <span className="text-cyan-300 font-bold">المهندس يوسف الباز</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-indigo-300 font-mono text-[10px] sm:text-[11px] bg-indigo-950/50 px-1.5 py-0.2 rounded border border-indigo-500/20">
            Automation Ai Yousuf Albaz
          </span>
        </div>
      </div>
    </div>
  );
};

