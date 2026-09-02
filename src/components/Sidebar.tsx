import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Binary, GitBranch, Layers, Database, Network, 
  Sliders, Zap, Bot, Award, CheckCircle2, Circle, ChevronDown, ChevronLeft, 
  HelpCircle, Clock
} from 'lucide-react';
import { Chapter, UserProgress } from '../types';

interface SidebarProps {
  chapters: Chapter[];
  currentChapterId: number;
  currentLessonId: string;
  progress: UserProgress;
  onSelectLesson: (chapterId: number, lessonId: string) => void;
  onOpenQuiz: (chapterId: number) => void;
  searchQuery: string;
}

const iconMap: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-4 h-4 text-cyan-400" />,
  Binary: <Binary className="w-4 h-4 text-blue-400" />,
  GitBranch: <GitBranch className="w-4 h-4 text-emerald-400" />,
  Layers: <Layers className="w-4 h-4 text-purple-400" />,
  Database: <Database className="w-4 h-4 text-amber-400" />,
  Network: <Network className="w-4 h-4 text-rose-400" />,
  Sliders: <Sliders className="w-4 h-4 text-indigo-400" />,
  Zap: <Zap className="w-4 h-4 text-yellow-400" />,
  Bot: <Bot className="w-4 h-4 text-teal-400" />,
  Award: <Award className="w-4 h-4 text-orange-400" />,
};

export const Sidebar: React.FC<SidebarProps> = ({
  chapters,
  currentChapterId,
  currentLessonId,
  progress,
  onSelectLesson,
  onOpenQuiz,
  searchQuery
}) => {
  const [expandedChapters, setExpandedChapters] = React.useState<Record<number, boolean>>({
    [currentChapterId]: true
  });

  // Auto-expand active chapter
  React.useEffect(() => {
    setExpandedChapters(prev => ({ ...prev, [currentChapterId]: true }));
  }, [currentChapterId]);

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const filteredChapters = chapters.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const matchTitle = c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q);
    const matchLesson = c.lessons.some(l => 
      l.title.toLowerCase().includes(q) || 
      l.subtitle.toLowerCase().includes(q) ||
      l.sections.some(s => s.content.toLowerCase().includes(q))
    );
    return matchTitle || matchLesson;
  });

  return (
    <aside className="w-full lg:w-84 xl:w-96 flex-shrink-0 bg-[#0D0D12] border-b lg:border-b-0 lg:border-l border-white/[0.07] p-3 lg:p-4 overflow-y-auto max-h-[88vh] select-none">
      <div className="flex items-center justify-between mb-3 px-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <span>خريطة المنهج (10 فصول)</span>
          <span className="px-2 py-0.5 rounded bg-[#161722] text-[10px] text-cyan-400 font-mono border border-white/[0.06]">
            {chapters.length} فصول
          </span>
        </h2>
        <span className="text-[11px] text-slate-500 font-medium">مستوى متقدم (Advanced)</span>
      </div>

      <div className="space-y-2">
        {filteredChapters.map((chapter) => {
          const isExpanded = expandedChapters[chapter.id] ?? false;
          const isActive = chapter.id === currentChapterId;
          const completedInChapter = chapter.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
          const isChapterComplete = completedInChapter === chapter.lessons.length && chapter.lessons.length > 0;
          const quizResult = progress.completedQuizzes[chapter.id];

          return (
            <div
              key={chapter.id}
              className={`rounded-xl border transition-all duration-200 ${
                isActive
                  ? 'border-cyan-500/40 bg-[#13141D] shadow-lg shadow-cyan-950/20'
                  : 'border-white/[0.06] bg-[#101015]/80 hover:border-white/[0.12] hover:bg-[#13141B]'
              }`}
            >
              {/* Chapter Header Card */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full text-right p-3 flex items-start justify-between gap-2.5 focus:outline-none"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-[#161722] border border-white/[0.08] flex-shrink-0 mt-0.5 shadow-sm">
                    {iconMap[chapter.iconName] || <Cpu className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                        الفصل {chapter.id}
                      </span>
                      {isChapterComplete && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-950/70 text-emerald-400 text-[10px] border border-emerald-700/50 flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-2.5 h-2.5" /> مكتمل
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-100 mt-0.5 leading-snug">
                      {chapter.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {chapter.estimatedHours} س
                      </span>
                      <span>•</span>
                      <span>{completedInChapter}/{chapter.lessons.length} درس</span>
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 p-1">
                  <motion.div
                    animate={{ rotate: isExpanded ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </div>
              </button>

              {/* Collapsible Lessons List with Smooth Animation */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="overflow-hidden border-t border-white/[0.06] bg-[#09090D]/90 rounded-b-xl"
                  >
                    <div className="p-2 space-y-1">
                      {chapter.lessons.map((lesson) => {
                        const isLessonActive = lesson.id === currentLessonId;
                        const isCompleted = progress.completedLessons.includes(lesson.id);

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => onSelectLesson(chapter.id, lesson.id)}
                            className={`w-full text-right px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-2 transition-all ${
                              isLessonActive
                                ? 'bg-cyan-950/50 text-cyan-200 border border-cyan-500/30 font-medium shadow-inner'
                                : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              {isCompleted ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                              )}
                              <span className="truncate">{lesson.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 flex-shrink-0 font-mono">
                              {lesson.duration}
                            </span>
                          </button>
                        );
                      })}

                      {/* End of Chapter Quiz Button */}
                      {chapter.quiz && chapter.quiz.length > 0 && (
                        <div className="pt-1 mt-1 border-t border-white/[0.06]">
                          <button
                            onClick={() => onOpenQuiz(chapter.id)}
                            className={`w-full text-right px-3 py-1.5 rounded-lg text-xs flex items-center justify-between gap-2 border transition-all ${
                              quizResult?.passed
                                ? 'bg-emerald-950/30 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900/40'
                                : 'bg-indigo-950/30 text-indigo-300 border-indigo-800/40 hover:bg-indigo-900/40'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span>
                                {quizResult?.passed
                                  ? `اختبار الفصل (تم الاجتياز ${quizResult.score}/${quizResult.total})`
                                  : `اختبار الفصل التقييمي (${chapter.quiz.length} أسئلة)`}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#101017] border border-white/[0.06]">
                              {quizResult?.passed ? 'إعادة' : 'ابدأ'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Developer & Platform Attribution Card */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-[#12121B] via-[#101018] to-[#0D0D14] border border-white/[0.08] text-right space-y-1 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-cyan-300 font-mono tracking-wider">JINNA 5</span>
          <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-medium">
            AI Platform
          </span>
        </div>
        <p className="text-[11px] text-slate-300 font-medium">
          تم التطوير بواسطة <span className="text-white font-bold">المهندس يوسف الباز</span>
        </p>
        <p className="text-[10px] text-indigo-300 font-mono">
          Automation Ai Yousuf Albaz
        </p>
      </div>
    </aside>
  );
};
