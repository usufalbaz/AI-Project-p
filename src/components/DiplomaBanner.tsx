import React, { useState } from 'react';
import { 
  GraduationCap, Award, BookOpen, Clock, FileText, ChevronDown, 
  ChevronUp, CheckCircle2, ShieldCheck, Sparkles, ExternalLink 
} from 'lucide-react';
import { UserProgress } from '../types';
import { getTotalCurriculumStats } from '../data/curriculumData';
import { useTheme } from '../context/ThemeContext';

interface DiplomaBannerProps {
  progress: UserProgress;
  onOpenSyllabus: () => void;
  onOpenCertificate: () => void;
  onOpenNotes: () => void;
}

export const DiplomaBanner: React.FC<DiplomaBannerProps> = ({
  progress,
  onOpenSyllabus,
  onOpenCertificate,
  onOpenNotes
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const stats = getTotalCurriculumStats();
  const completedCount = progress.completedLessons.length;
  const progressPercent = Math.round((completedCount / (stats.totalLessons || 1)) * 100);

  // Count passed quizzes
  const passedQuizzesCount = Object.values(progress.completedQuizzes || {}).filter((q: any) => Boolean(q?.passed)).length;

  return (
    <div className={`border-b transition-colors ${
      isLight 
        ? 'bg-slate-50/90 border-slate-200' 
        : 'bg-[#0B0C11] border-white/[0.06]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left / Main info */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className={`p-1.5 rounded-lg flex items-center justify-center ${
              isLight 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            }`}>
              <GraduationCap className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                الدبلومة التخصصية المعتمدة:
              </span>
              <span className={`font-medium ${isLight ? 'text-blue-700' : 'text-cyan-300'}`}>
                أبحاث ونظم الذكاء الاصطناعي وبناء النماذج اللغوية (AI Systems & LLMs)
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${
                isLight 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
              }`}>
                معتمدة أكاديمياً
              </span>
            </div>
          </div>

          {/* Right Action buttons (edX style) */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            {/* Syllabus Roadmap Button */}
            <button
              onClick={onOpenSyllabus}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-medium transition-colors ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-[#141520] hover:bg-[#1C1E2D] text-slate-200 border-white/[0.08] hover:border-cyan-500/30'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>خريطة المنهج والدبلومة</span>
            </button>

            {/* Student Notebook */}
            <button
              onClick={onOpenNotes}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-medium transition-colors ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-[#141520] hover:bg-[#1C1E2D] text-slate-200 border-white/[0.08] hover:border-purple-500/30'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>ملاحظاتي الدراسية</span>
            </button>

            {/* Verified Certificate Readiness */}
            <button
              onClick={onOpenCertificate}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-semibold transition-colors ${
                progressPercent === 100
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white border-amber-400 shadow-xs'
                  : isLight
                    ? 'bg-white hover:bg-slate-100 text-amber-700 border-amber-200'
                    : 'bg-amber-950/20 hover:bg-amber-950/40 text-amber-300 border-amber-500/30'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>استحقاق الشهادة ({passedQuizzesCount}/10 اختبارات)</span>
            </button>

            {/* Collapse toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-1 rounded-md text-slate-400 hover:text-slate-200 transition-colors ${
                isLight ? 'hover:bg-slate-200' : 'hover:bg-white/[0.06]'
              }`}
              title={isExpanded ? 'إخفاء التفاصيل' : 'عرض تفاصيل الاعتماد'}
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible edX Specialization details */}
        {isExpanded && (
          <div className={`mt-3 pt-3 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs animate-fadeIn ${
            isLight ? 'border-slate-200 text-slate-600' : 'border-white/[0.06] text-slate-300'
          }`}>
            <div className={`p-2.5 rounded-lg border ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#12131C] border-white/[0.06]'
            }`}>
              <div className="font-semibold flex items-center gap-1.5 text-cyan-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>المشرف والمطور الأكاديمي</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed">
                المهندس يوسف الباز (Automation Ai Yousuf Albaz) - خبير بحوث الذكاء الاصطناعي وبناء النماذج التوليدية.
              </p>
            </div>

            <div className={`p-2.5 rounded-lg border ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#12131C] border-white/[0.06]'
            }`}>
              <div className="font-semibold flex items-center gap-1.5 text-emerald-400">
                <Clock className="w-3.5 h-3.5" />
                <span>المدة والجهد المعتمد</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed">
                10 فصول أكاديمية مكثفة تعادل 176 ساعة تدريبية وتطبيقية على وحدات معالجة الرسوميات GPU.
              </p>
            </div>

            <div className={`p-2.5 rounded-lg border ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#12131C] border-white/[0.06]'
            }`}>
              <div className="font-semibold flex items-center gap-1.5 text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>معامل ومختبرات تفاعلية</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed">
                محرر كود بايثون تفاعلي، محاكاة نوى CUDA، وحاسبة ميزانية VRAM دقيقة للموديلات.
              </p>
            </div>

            <div className={`p-2.5 rounded-lg border ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#12131C] border-white/[0.06]'
            }`}>
              <div className="font-semibold flex items-center gap-1.5 text-amber-400">
                <Award className="w-3.5 h-3.5" />
                <span>شروط نيل الدبلومة</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed">
                إكمال 100% من الدروس واجتياز اختبارات الفصول بنسبة 70% فأكثر للحصول على الشهادة الرسمية الموثقة.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
