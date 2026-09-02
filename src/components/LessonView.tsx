import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Code2, Video, FileText, CheckCircle, Circle, 
  Sparkles, Clock, ChevronRight, ChevronLeft, ExternalLink, 
  Github, Lightbulb, Eye, EyeOff, CheckCircle2, Award 
} from 'lucide-react';
import { Lesson, Chapter } from '../types';
import { CodePlayground } from './CodePlayground';

interface LessonViewProps {
  lesson: Lesson;
  chapter: Chapter;
  isCompleted: boolean;
  onToggleComplete: (lessonId: string) => void;
  onOpenAiMentor: () => void;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  chapter,
  isCompleted,
  onToggleComplete,
  onOpenAiMentor,
  onNextLesson,
  onPrevLesson,
  hasNext,
  hasPrev
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'code' | 'resources' | 'practice'>('theory');
  const [showSolution, setShowSolution] = useState(false);

  // Reset tab and solution on lesson change
  React.useEffect(() => {
    setActiveTab('theory');
    setShowSolution(false);
  }, [lesson.id]);

  return (
    <main className="flex-1 bg-[#0A0A0C] p-4 lg:p-8 overflow-y-auto max-h-[88vh]">
      <motion.div 
        key={lesson.id}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Lesson Top Breadcrumb & Header */}
        <div className="space-y-3 pb-5 border-b border-white/[0.08]">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-cyan-400">الفصل {chapter.id}:</span>
              <span>{chapter.title}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleComplete(lesson.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50 shadow-sm shadow-emerald-950/50'
                    : 'bg-[#14141B] text-slate-300 border-white/[0.08] hover:border-emerald-500/50 hover:bg-[#1A1C26]'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-slate-500" />}
                <span>{isCompleted ? 'تم إكمال الدرس' : 'تحديد كمكتمل'}</span>
              </button>

              <button
                onClick={onOpenAiMentor}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161726] hover:bg-[#1F2034] text-indigo-200 border border-indigo-500/40 text-xs font-semibold transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>استشر المساعد الذكي</span>
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {lesson.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-1">
              {lesson.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {lesson.duration}
            </span>
            <span>•</span>
            <span>{lesson.readTime}</span>
            <span>•</span>
            <span className="text-slate-500 font-mono">ID: {lesson.id}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-white/[0.08] pb-px overflow-x-auto no-scrollbar">
          {[
            { id: 'theory', label: 'الشرح والرياضيات', icon: BookOpen },
            { id: 'code', label: 'المعمل ومحرر الكود', icon: Code2 },
            { id: 'resources', label: 'المحاضرات والأوراق البحثية', icon: Video },
            { id: 'practice', label: 'التطبيق العملي وتحدي المقابلة', icon: Lightbulb },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-[#12121A]'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#121217]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Theory and Math */}
        {activeTab === 'theory' && (
          <div className="space-y-6 animate-fadeIn">
            {lesson.sections.map((sec) => (
              <div key={sec.id} className="p-5 sm:p-6 rounded-2xl bg-[#111117] border border-white/[0.07] space-y-4 shadow-sm">
                <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>{sec.title}</span>
                </h2>

                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {sec.content}
                </div>

                {/* Mathematical Formulas Box */}
                {sec.mathFormulas && sec.mathFormulas.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#07070A] border border-cyan-500/25 space-y-2 shadow-inner">
                    <span className="text-xs font-mono font-bold text-cyan-400 block">
                      المعادلات الرياضية الصريحة (Mathematical Formulation):
                    </span>
                    <div className="space-y-2 font-mono text-xs sm:text-sm text-cyan-100 bg-[#0C0C10] p-3 rounded-lg border border-white/[0.06] overflow-x-auto" dir="ltr">
                      {sec.mathFormulas.map((f, i) => (
                        <div key={i} className="py-1">{f}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Architecture Flow Diagram */}
                {sec.architectureDiagram && (
                  <div className="p-3.5 rounded-xl bg-[#07070A] border border-white/[0.08] font-mono text-xs text-slate-300 space-y-1" dir="ltr">
                    <div className="text-slate-500 font-bold mb-1">[Architecture & Hardware Data Path]</div>
                    <div className="text-cyan-300 overflow-x-auto whitespace-pre p-2 bg-[#09090E] rounded border border-white/[0.04]">
                      {sec.architectureDiagram}
                    </div>
                  </div>
                )}

                {/* Key Takeaway Callout */}
                <div className="p-3.5 rounded-xl bg-[#10111D] border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">الخلاصة الهندسية المركزة (Key Engineering Takeaway):</span>
                    <span>{sec.takeaway}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Inline Code Preview Shortcut */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#111117] to-[#141522] border border-white/[0.08] flex items-center justify-between shadow-sm">
              <div>
                <h3 className="text-xs font-bold text-white">هل تريد تجربة كود هذا الدرس ومحاكاته الآن؟</h3>
                <p className="text-[11px] text-slate-400">انتقل للمعمل التفاعلي لتعديل المعاملات وتشغيل الكود بضغطة زر.</p>
              </div>
              <button
                onClick={() => setActiveTab('code')}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-cyan-950/40 border border-cyan-400/30"
              >
                فتح المحرر التفاعلي
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Code Editor */}
        {activeTab === 'code' && (
          <div className="space-y-4 animate-fadeIn">
            <CodePlayground
              initialSnippet={lesson.pythonCode}
              lessonId={lesson.id}
            />
          </div>
        )}

        {/* Tab 3: Video Lectures & Papers Hub */}
        {activeTab === 'resources' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Curated Video Lectures */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Video className="w-4 h-4 text-cyan-400" />
                <span>محاضرات الفيديو المرجعية (Curated Lectures)</span>
              </h3>

              {lesson.videoResources.map((vid, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#111117] border border-white/[0.07] space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white">{vid.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        المحاضر: <span className="text-cyan-300 font-semibold">{vid.instructor}</span> | المدة: {vid.duration} | المنصة: {vid.platform}
                      </p>
                    </div>
                    <a
                      href={vid.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-700/50 text-xs font-semibold transition-all w-fit"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>مشاهدة على YouTube</span>
                    </a>
                  </div>

                  {/* YouTube Embed Player if available */}
                  {vid.embedId && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/[0.08] bg-black">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${vid.embedId}`}
                        title={vid.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  <p className="text-xs text-slate-300 leading-relaxed">{vid.summary}</p>

                  <div className="p-3 rounded-lg bg-[#07070A] border border-white/[0.06] space-y-1">
                    <span className="text-xs font-bold text-cyan-400 block">أبرز النقاط المستخلصة (Key Takeaways):</span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                      {vid.keyTakeaways.map((point, pIdx) => (
                        <li key={pIdx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Authoritative Papers & GitHub Repos */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>الأوراق البحثية التأسيسية والمستودعات (Foundational Papers & Repos)</span>
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {lesson.referencePapers.map((paper, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#111117] border border-white/[0.06] hover:border-white/[0.14] transition-all space-y-2 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-800/60">
                          {paper.badge} • {paper.year}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1.5">{paper.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">{paper.authors}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {paper.githubUrl && (
                          <a
                            href={paper.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-[#181822] hover:bg-[#20202F] text-slate-300 transition-colors border border-white/[0.08]"
                            title="مستودع GitHub"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        <a
                          href={paper.arxivUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border border-purple-700/50 text-xs font-semibold transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>رابط arXiv</span>
                        </a>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 italic">"{paper.citation}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Practical Exercise & Interview Tips */}
        {activeTab === 'practice' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Practical Exercise Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#111117] border border-white/[0.07] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>تمرين تطبيقي مصغر (Hands-on Challenge)</span>
                </h3>
                <span className="text-xs text-emerald-400 font-mono">تطبيق حقيقي</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {lesson.practicalExercise.prompt}
              </p>

              <div className="p-3 rounded-lg bg-[#07070A] border border-amber-500/25 text-xs text-amber-300/90 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>إشارة للحل (Hint): {lesson.practicalExercise.expectedOutputHint}</span>
              </div>

              <div className="relative">
                <pre className="p-3.5 rounded-xl bg-[#07070A] border border-white/[0.06] font-mono text-xs text-slate-300 overflow-x-auto" dir="ltr">
                  {lesson.practicalExercise.initialCode}
                </pre>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#161622] hover:bg-[#202030] text-slate-200 text-xs font-semibold transition-colors border border-white/[0.08]"
                >
                  {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showSolution ? "إخفاء الحل النموذجي" : "إظهار الحل النموذجي"}</span>
                </button>
              </div>

              {showSolution && (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-700/40 space-y-2 animate-fadeIn">
                  <span className="text-xs font-bold text-emerald-400 block">كود الحل النموذجي (Reference Solution):</span>
                  <pre className="p-3 rounded-lg bg-[#07070A] font-mono text-xs text-emerald-200 overflow-x-auto border border-emerald-900/40" dir="ltr">
                    {lesson.practicalExercise.solutionCode}
                  </pre>
                </div>
              )}
            </div>

            {/* Meta & OpenAI Interview Secrets */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-950/30 via-[#111117] to-indigo-950/30 border border-indigo-500/30 space-y-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  أسرار المقابلات التقنية لشركات الذكاء الاصطناعي (Meta / OpenAI / DeepMind)
                </h3>
              </div>

              <div className="space-y-2 pt-1">
                {lesson.interviewTips.map((tip, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#07070A] border border-white/[0.06] text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                    <span className="font-bold text-indigo-400 font-mono flex-shrink-0">[{idx + 1}]</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Bar (Next / Prev Lessons) */}
        <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between gap-4">
          <button
            onClick={onPrevLesson}
            disabled={!hasPrev}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#14141B] hover:bg-[#1C1D28] disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 text-xs sm:text-sm font-medium transition-colors border border-white/[0.08]"
          >
            <ChevronRight className="w-4 h-4" />
            <span>الدرس السابق</span>
          </button>

          <button
            onClick={onNextLesson}
            disabled={!hasNext}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-cyan-950/50 border border-cyan-400/30"
          >
            <span>الدرس التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </main>
  );
};
