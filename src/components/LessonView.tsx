import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, Code2, Video, FileText, Circle, 
  Sparkles, Clock, ChevronRight, ChevronLeft, 
  Lightbulb, Eye, EyeOff, CheckCircle2, Award,
  ExternalLink, Github 
} from 'lucide-react';
import { Lesson, Chapter } from '../types';
import { CodePlayground } from './CodePlayground';
import { useTheme } from '../context/ThemeContext';

interface LessonViewProps {
  lesson: Lesson;
  chapter: Chapter;
  isCompleted: boolean;
  onToggleComplete: (lessonId: string) => void;
  onOpenAiMentor: () => void;
  onOpenNotes?: () => void;
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
  onOpenNotes,
  onNextLesson,
  onPrevLesson,
  hasNext,
  hasPrev
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'code' | 'resources' | 'practice'>('theory');
  const [showSolution, setShowSolution] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Reset tab and solution on lesson change
  React.useEffect(() => {
    setActiveTab('theory');
    setShowSolution(false);
  }, [lesson.id]);

  return (
    <main className={`flex-1 p-4 lg:p-8 overflow-y-auto max-h-[88vh] transition-colors ${
      isLight ? 'bg-[#F8FAFC]' : 'bg-[#0A0A0C]'
    }`}>
      <motion.div 
        key={lesson.id}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Lesson Top Breadcrumb & Header */}
        <div className={`space-y-3 pb-5 border-b ${isLight ? 'border-slate-200' : 'border-white/[0.08]'}`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className={`flex items-center gap-2 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <span className={`font-semibold ${isLight ? 'text-blue-600' : 'text-cyan-400'}`}>الفصل {chapter.id}:</span>
              <span>{chapter.title}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onToggleComplete(lesson.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isCompleted
                    ? isLight
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50 shadow-sm shadow-emerald-950/50'
                    : isLight
                      ? 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50'
                      : 'bg-[#14141B] text-slate-300 border-white/[0.08] hover:border-emerald-500/50 hover:bg-[#1A1C26]'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-slate-400" />}
                <span>{isCompleted ? 'تم إكمال الدرس' : 'تحديد كمكتمل'}</span>
              </button>

              {onOpenNotes && (
                <button
                  onClick={onOpenNotes}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isLight
                      ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
                      : 'bg-[#181528] hover:bg-[#221D38] text-purple-200 border-purple-500/40'
                  }`}
                  title="ملاحظاتي الدراسية لهذا الدرس"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>ملاحظاتي</span>
                </button>
              )}

              <button
                onClick={onOpenAiMentor}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shadow-sm ${
                  isLight
                    ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                    : 'bg-[#161726] hover:bg-[#1F2034] text-indigo-200 border-indigo-500/40'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>المساعد الذكي</span>
              </button>
            </div>
          </div>

          <div>
            <h1 className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {lesson.title}
            </h1>
            <p className={`text-sm sm:text-base mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {lesson.subtitle}
            </p>
          </div>

          <div className={`flex items-center gap-4 text-xs pt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-500" />
              {lesson.duration}
            </span>
            <span>•</span>
            <span>{lesson.readTime}</span>
            <span>•</span>
            <span className="opacity-70 font-mono">ID: {lesson.id}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex items-center gap-1 border-b pb-px overflow-x-auto no-scrollbar ${
          isLight ? 'border-slate-200' : 'border-white/[0.08]'
        }`}>
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
                    ? isLight
                      ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                      : 'border-cyan-400 text-cyan-300 bg-[#12121A]'
                    : isLight
                      ? 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
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
              <div 
                key={sec.id} 
                className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-xs ${
                  isLight 
                    ? 'bg-white border-slate-200 text-slate-900' 
                    : 'bg-[#111117] border-white/[0.07] text-slate-100'
                }`}
              >
                <h2 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${
                  isLight ? 'text-slate-900' : 'text-slate-100'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span>{sec.title}</span>
                </h2>

                <div className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  {sec.content}
                </div>

                {/* Mathematical Formulas Box */}
                {sec.mathFormulas && sec.mathFormulas.length > 0 && (
                  <div className={`p-4 rounded-xl border space-y-2 ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300' 
                      : 'bg-[#07070A] border-cyan-500/25'
                  }`}>
                    <span className={`text-xs font-mono font-bold block ${isLight ? 'text-blue-700' : 'text-cyan-400'}`}>
                      المعادلات الرياضية الصريحة (Mathematical Formulation):
                    </span>
                    <div className={`space-y-2 font-mono text-xs sm:text-sm p-3 rounded-lg border overflow-x-auto ${
                      isLight 
                        ? 'bg-white text-slate-900 border-slate-200' 
                        : 'bg-[#0C0C10] text-cyan-100 border-white/[0.06]'
                    }`} dir="ltr">
                      {sec.mathFormulas.map((f, i) => (
                        <div key={i} className="py-1">{f}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Architecture Flow Diagram */}
                {sec.architectureDiagram && (
                  <div className={`p-3.5 rounded-xl border font-mono text-xs space-y-1 ${
                    isLight 
                      ? 'bg-slate-900 text-slate-200 border-slate-800' 
                      : 'bg-[#07070A] text-slate-300 border-white/[0.08]'
                  }`} dir="ltr">
                    <div className="text-cyan-400 font-bold mb-1">[Architecture & Hardware Data Path]</div>
                    <div className="text-cyan-200 overflow-x-auto whitespace-pre p-2 bg-black/40 rounded border border-white/[0.05]">
                      {sec.architectureDiagram}
                    </div>
                  </div>
                )}

                {/* Key Takeaway Callout */}
                <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  isLight
                    ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
                    : 'bg-[#10111D] border-indigo-500/30 text-indigo-200'
                }`}>
                  <Lightbulb className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className={`font-bold block mb-0.5 ${isLight ? 'text-indigo-900' : 'text-white'}`}>
                      الخلاصة الهندسية المركزة (Key Engineering Takeaway):
                    </span>
                    <span>{sec.takeaway}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Inline Code Preview Shortcut */}
            <div className={`p-4 rounded-xl border flex items-center justify-between shadow-xs ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800'
                : 'bg-gradient-to-r from-[#111117] to-[#141522] border-white/[0.08] text-white'
            }`}>
              <div>
                <h3 className="text-xs font-bold">هل تريد تجربة كود هذا الدرس ومحاكاته الآن؟</h3>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  انتقل للمعمل التفاعلي لتعديل المعاملات وتشغيل الكود بضغطة زر.
                </p>
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
              <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                <Video className="w-4 h-4 text-cyan-500" />
                <span>محاضرات الفيديو المرجعية (Curated Lectures)</span>
              </h3>

              {lesson.videoResources.map((vid, idx) => (
                <div 
                  key={idx} 
                  className={`p-5 rounded-2xl border space-y-4 shadow-xs ${
                    isLight 
                      ? 'bg-white border-slate-200 text-slate-900' 
                      : 'bg-[#111117] border-white/[0.07] text-slate-100'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className={`text-sm sm:text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{vid.title}</h4>
                      <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        المحاضر: <span className={isLight ? 'text-blue-700 font-semibold' : 'text-cyan-300 font-semibold'}>{vid.instructor}</span> | المدة: {vid.duration} | المنصة: {vid.platform}
                      </p>
                    </div>
                    <a
                      href={vid.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all w-fit ${
                        isLight 
                          ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200' 
                          : 'bg-red-950/40 hover:bg-red-900/50 text-red-300 border-red-700/50'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>مشاهدة على YouTube</span>
                    </a>
                  </div>

                  {/* YouTube Embed Player if available */}
                  {vid.embedId && (
                    <div className={`relative aspect-video rounded-xl overflow-hidden border bg-black ${
                      isLight ? 'border-slate-300' : 'border-white/[0.08]'
                    }`}>
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${vid.embedId}`}
                        title={vid.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{vid.summary}</p>

                  <div className={`p-3 rounded-lg border space-y-1 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#07070A] border-white/[0.06]'
                  }`}>
                    <span className={`text-xs font-bold block ${isLight ? 'text-blue-700' : 'text-cyan-400'}`}>
                      أبرز النقاط المستخلصة (Key Takeaways):
                    </span>
                    <ul className={`list-disc list-inside space-y-1 text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
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
              <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                <FileText className="w-4 h-4 text-purple-500" />
                <span>الأوراق البحثية التأسيسية والمستودعات (Foundational Papers & Repos)</span>
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {lesson.referencePapers.map((paper, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-xl border transition-all space-y-2 shadow-xs ${
                      isLight 
                        ? 'bg-white border-slate-200 hover:border-purple-300' 
                        : 'bg-[#111117] border-white/[0.06] hover:border-white/[0.14]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          isLight 
                            ? 'bg-purple-50 text-purple-800 border-purple-200' 
                            : 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                        }`}>
                          {paper.badge} • {paper.year}
                        </span>
                        <h4 className={`text-sm font-bold mt-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>{paper.title}</h4>
                        <p className={`text-xs mt-0.5 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{paper.authors}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {paper.githubUrl && (
                          <a
                            href={paper.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2 rounded-lg transition-colors border ${
                              isLight 
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                                : 'bg-[#181822] hover:bg-[#20202F] text-slate-300 border-white/[0.08]'
                            }`}
                            title="مستودع GitHub"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        <a
                          href={paper.arxivUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                            isLight 
                              ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200' 
                              : 'bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border-purple-700/50'
                          }`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>رابط arXiv</span>
                        </a>
                      </div>
                    </div>
                    <p className={`text-xs italic ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>"{paper.citation}"</p>
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
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-xs ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#111117] border-white/[0.07] text-slate-100'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-sm sm:text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Code2 className="w-4 h-4 text-emerald-500" />
                  <span>تمرين تطبيقي مصغر (Hands-on Challenge)</span>
                </h3>
                <span className={`text-xs font-mono font-semibold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>تطبيق حقيقي</span>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                {lesson.practicalExercise.prompt}
              </p>

              <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                isLight 
                  ? 'bg-amber-50 border-amber-200 text-amber-800' 
                  : 'bg-[#07070A] border-amber-500/25 text-amber-300/90'
              }`}>
                <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>إشارة للحل (Hint): {lesson.practicalExercise.expectedOutputHint}</span>
              </div>

              <div className="relative">
                <pre className={`p-3.5 rounded-xl border font-mono text-xs overflow-x-auto ${
                  isLight 
                    ? 'bg-slate-900 text-slate-100 border-slate-800' 
                    : 'bg-[#07070A] text-slate-300 border-white/[0.06]'
                }`} dir="ltr">
                  {lesson.practicalExercise.initialCode}
                </pre>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' 
                      : 'bg-[#161622] hover:bg-[#202030] text-slate-200 border-white/[0.08]'
                  }`}
                >
                  {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showSolution ? "إخفاء الحل النموذجي" : "إظهار الحل النموذجي"}</span>
                </button>
              </div>

              {showSolution && (
                <div className={`p-4 rounded-xl border space-y-2 animate-fadeIn ${
                  isLight 
                    ? 'bg-emerald-50 border-emerald-300' 
                    : 'bg-emerald-950/20 border-emerald-700/40'
                }`}>
                  <span className={`text-xs font-bold block ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>
                    كود الحل النموذجي (Reference Solution):
                  </span>
                  <pre className={`p-3 rounded-lg font-mono text-xs overflow-x-auto border ${
                    isLight 
                      ? 'bg-white text-emerald-950 border-emerald-200' 
                      : 'bg-[#07070A] text-emerald-200 border-emerald-900/40'
                  }`} dir="ltr">
                    {lesson.practicalExercise.solutionCode}
                  </pre>
                </div>
              )}
            </div>

            {/* Meta & OpenAI Interview Secrets */}
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-3 shadow-xs ${
              isLight 
                ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950' 
                : 'bg-gradient-to-r from-indigo-950/30 via-[#111117] to-indigo-950/30 border-indigo-500/30 text-white'
            }`}>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm sm:text-base font-bold">
                  أسرار المقابلات التقنية لشركات الذكاء الاصطناعي (Meta / OpenAI / DeepMind)
                </h3>
              </div>

              <div className="space-y-2 pt-1">
                {lesson.interviewTips.map((tip, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                      isLight 
                        ? 'bg-white border-indigo-100 text-slate-700' 
                        : 'bg-[#07070A] border-white/[0.06] text-slate-300'
                    }`}
                  >
                    <span className="font-bold text-indigo-500 font-mono flex-shrink-0">[{idx + 1}]</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Bar (Next / Prev Lessons) */}
        <div className={`pt-6 border-t flex items-center justify-between gap-4 ${
          isLight ? 'border-slate-200' : 'border-white/[0.08]'
        }`}>
          <button
            onClick={onPrevLesson}
            disabled={!hasPrev}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-colors border ${
              isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                : 'bg-[#14141B] hover:bg-[#1C1D28] text-slate-300 border-white/[0.08]'
            }`}
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
