import React from 'react';
import { Cpu, Award, Calculator, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import { UserProgress } from '../types';
import { getTotalCurriculumStats } from '../data/curriculumData';

interface HeaderProps {
  progress: UserProgress;
  onOpenCalculator: () => void;
  onOpenCertificate: () => void;
  onToggleAiMentor: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  onOpenCalculator,
  onOpenCertificate,
  onToggleAiMentor,
  onSearchChange,
  searchQuery
}) => {
  const stats = getTotalCurriculumStats();
  const completedCount = progress.completedLessons.length;
  const progressPercent = Math.round((completedCount / (stats.totalLessons || 1)) * 100);

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0C]/90 backdrop-blur-md border-b border-white/[0.08] px-4 lg:px-8 py-3 transition-colors shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30 flex-shrink-0">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-cyan-300 via-white to-blue-200 bg-clip-text text-transparent">
                  JINNA 5
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  AI Systems & LLMs
                </span>
              </div>
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

          {/* Mobile AI Mentor Trigger */}
          <button
            onClick={onToggleAiMentor}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14141F] text-indigo-300 border border-indigo-500/30 text-xs font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>المساعد الذكي</span>
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-56 md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن مفهوم، CUDA، RoPE، vLLM..."
              className="w-full bg-[#121217] border border-white/[0.08] hover:border-white/[0.14] rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all shadow-inner"
            />
          </div>

          {/* VRAM Calculator Button */}
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#13141B] hover:bg-[#1A1C26] text-slate-200 border border-white/[0.08] hover:border-cyan-500/40 text-xs font-medium transition-all shadow-sm"
            title="حاسبة ميزانية الذاكرة والـ VRAM"
          >
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">حاسبة VRAM</span>
          </button>

          {/* Certificate Button */}
          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#13141B] hover:bg-[#1A1C26] text-slate-200 border border-white/[0.08] hover:border-amber-500/40 text-xs font-medium transition-all shadow-sm"
            title="شهادة التخرج والإنجاز"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">الشهادة</span>
          </button>

          {/* AI Mentor Button with Thinking Mode Indicator */}
          <button
            onClick={onToggleAiMentor}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-950/90 via-[#131422] to-indigo-950/90 text-indigo-100 border border-indigo-500/40 hover:border-indigo-400 text-xs font-semibold shadow-md shadow-indigo-950/40 transition-all"
          >
            <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
            <span>المساعد الذكي (AI Mentor)</span>
            <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-[10px] text-indigo-300 font-mono border border-indigo-500/30">
              High Thinking
            </span>
          </button>
        </div>
      </div>

      {/* Progress Metric Bar */}
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>المسار التعليمي: {stats.totalChapters} فصول متدرجة | {stats.totalLessons} درساً تطبيقياً | {stats.totalHours} ساعة تدريبية مكثفة</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>مكتمل: {completedCount}/{stats.totalLessons}</span>
          </div>
          <div className="w-24 bg-[#14141B] rounded-full h-2 overflow-hidden border border-white/[0.08]">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-emerald-400 font-bold">{progressPercent}%</span>
        </div>
      </div>
    </header>
  );
};
