import React from 'react';
import { Award, Calculator, Sparkles, BookOpen, CheckCircle2, Key, FileCode } from 'lucide-react';
import { UserProgress } from '../types';
import { getTotalCurriculumStats } from '../data/curriculumData';
import { JinnaLogo } from './JinnaLogo';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  progress: UserProgress;
  onOpenCalculator: () => void;
  onOpenCertificate: () => void;
  onToggleAiMentor: () => void;
  onOpenApiKey: () => void;
  onOpenInstructions?: () => void;
  isApiKeyConfigured: boolean;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  onOpenCalculator,
  onOpenCertificate,
  onToggleAiMentor,
  onOpenApiKey,
  onOpenInstructions,
  isApiKeyConfigured,
  onSearchChange,
  searchQuery
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const stats = getTotalCurriculumStats();
  const completedCount = progress.completedLessons.length;
  const progressPercent = Math.round((completedCount / (stats.totalLessons || 1)) * 100);

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 lg:px-8 py-3 transition-colors ${
      isLight 
        ? 'bg-white/95 border-slate-200 text-slate-900 shadow-sm' 
        : 'bg-[#0A0A0C]/90 border-white/[0.08] text-slate-100 shadow-[0_1px_0_0_rgba(255,255,255,0.03)]'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Animated JINNA 5 Logo & Credential */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <JinnaLogo theme={theme} />

          {/* Mobile Actions: Theme Toggle, API Settings & AI Mentor Trigger */}
          <div className="md:hidden flex items-center gap-1.5">
            <ThemeToggle compact />

            <button
              onClick={onOpenApiKey}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isApiKeyConfigured
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                  : 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30'
              }`}
              title="إعدادات مفتاح Gemini API"
            >
              <Key className="w-3.5 h-3.5" />
              <span>API</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isApiKeyConfigured ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
            </button>

            <button
              onClick={onToggleAiMentor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14141F] text-indigo-300 border border-indigo-500/30 text-xs font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>المساعد</span>
            </button>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-52 md:w-60">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن مفهوم، CUDA، RoPE، vLLM..."
              className={`w-full rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 transition-all border ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-400/40 focus:bg-white'
                  : 'bg-[#121217] border-white/[0.08] hover:border-white/[0.14] text-slate-200 placeholder-slate-500 focus:border-cyan-500/60 focus:ring-cyan-500/40'
              }`}
            />
          </div>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* API Key Settings Button */}
          <button
            onClick={onOpenApiKey}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-xs ${
              isApiKeyConfigured
                ? isLight
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                  : 'bg-emerald-950/30 hover:bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                : isLight
                  ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-300'
                  : 'bg-[#141624] hover:bg-[#1A1D30] text-cyan-300 border-cyan-500/30 hover:border-cyan-400'
            }`}
            title="إعدادات مفتاح الذكاء الاصطناعي (Gemini API Key)"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">مفتاح API</span>
            <span className={`px-1.5 py-0.2 text-[9px] font-mono rounded ${
              isApiKeyConfigured 
                ? isLight ? 'bg-emerald-200/60 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'
                : isLight ? 'bg-cyan-200/60 text-cyan-900' : 'bg-cyan-500/20 text-cyan-300'
            }`}>
              {isApiKeyConfigured ? '🟢 مخصص' : '🟢 نشط'}
            </span>
          </button>

          {/* AI Instructions File Button */}
          {onOpenInstructions && (
            <button
              onClick={onOpenInstructions}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-xs ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-cyan-400'
                  : 'bg-[#13141B] hover:bg-[#1A1C26] text-slate-200 border-white/[0.08] hover:border-cyan-500/40'
              }`}
              title="تحميل ملف التعليمات الموجه لـ AI Studio (Instructions)"
            >
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">ملف التعليمات</span>
              <span className="text-[10px] font-mono px-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                .md
              </span>
            </button>
          )}

          {/* VRAM Calculator Button */}
          <button
            onClick={onOpenCalculator}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-xs ${
              isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-blue-400'
                : 'bg-[#13141B] hover:bg-[#1A1C26] text-slate-200 border-white/[0.08] hover:border-cyan-500/40'
            }`}
            title="حاسبة ميزانية الذاكرة والـ VRAM"
          >
            <Calculator className="w-4 h-4 text-cyan-500" />
            <span className="hidden sm:inline">حاسبة VRAM</span>
          </button>

          {/* Certificate Button */}
          <button
            onClick={onOpenCertificate}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-xs ${
              isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-amber-400'
                : 'bg-[#13141B] hover:bg-[#1A1C26] text-slate-200 border-white/[0.08] hover:border-amber-500/40'
            }`}
            title="شهادة التخرج والإنجاز"
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">الشهادة</span>
          </button>

          {/* AI Mentor Button with Thinking Mode Indicator */}
          <button
            onClick={onToggleAiMentor}
            className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-semibold shadow-md transition-all ${
              isLight
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700 shadow-indigo-200'
                : 'bg-gradient-to-r from-indigo-950/90 via-[#131422] to-indigo-950/90 text-indigo-100 border-indigo-500/40 hover:border-indigo-400 shadow-indigo-950/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
            <span>المساعد الذكي (AI Mentor)</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${
              isLight 
                ? 'bg-indigo-500/30 text-white border-indigo-400/40' 
                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
            }`}>
              High Thinking
            </span>
          </button>
        </div>
      </div>

      {/* Progress Metric Bar */}
      <div className={`max-w-7xl mx-auto mt-2 pt-2 border-t flex items-center justify-between gap-4 text-xs ${
        isLight ? 'border-slate-200 text-slate-600' : 'border-white/[0.06] text-slate-400'
      }`}>
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
          <span>المسار التعليمي: {stats.totalChapters} فصول متدرجة | {stats.totalLessons} درساً تطبيقياً | {stats.totalHours} ساعة تدريبية مكثفة</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>مكتمل: {completedCount}/{stats.totalLessons}</span>
          </div>
          <div className={`w-24 rounded-full h-2 overflow-hidden border ${
            isLight ? 'bg-slate-200 border-slate-300' : 'bg-[#14141B] border-white/[0.08]'
          }`}>
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-emerald-500 font-bold">{progressPercent}%</span>
        </div>
      </div>
    </header>
  );
};
