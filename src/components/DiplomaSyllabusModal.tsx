import React, { useState } from 'react';
import { 
  X, GraduationCap, Award, BookOpen, Clock, CheckCircle2, 
  ShieldCheck, BrainCircuit, Cpu, Binary, Layers, Database, 
  Network, Sliders, Zap, Bot, ExternalLink, Sparkles 
} from 'lucide-react';
import { allChapters } from '../data/curriculumData';
import { useTheme } from '../context/ThemeContext';

interface DiplomaSyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter?: (chapterId: number, lessonId: string) => void;
}

export const DiplomaSyllabusModal: React.FC<DiplomaSyllabusModalProps> = ({
  isOpen,
  onClose,
  onSelectChapter
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'grading' | 'instructor'>('overview');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className={`w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border flex flex-col overflow-hidden transition-colors ${
          isLight 
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300' 
            : 'bg-[#0E0F16] border-cyan-500/30 text-slate-100 shadow-cyan-950/50'
        }`}
        dir="rtl"
      >
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141520] border-white/[0.08]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-base sm:text-lg">
                  خريطة الدبلومة الأكاديمية المعتمدة
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  MicroMasters / Specialization
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                برنامج تدريب وبحوث أنظمة الذكاء الاصطناعي وبناء وتدريب النماذج اللغوية الضخمة (LLMs)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-white/[0.08] text-slate-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (edX Style) */}
        <div className={`flex border-b px-6 overflow-x-auto ${
          isLight ? 'border-slate-200 bg-white' : 'border-white/[0.08] bg-[#10111A]'
        }`}>
          {[
            { id: 'overview', label: 'نظرة عامة ومخرجات التعلم' },
            { id: 'curriculum', label: 'الخطة التدريبية (10 فصول)' },
            { id: 'grading', label: 'معايير تقييم الشهادة' },
            { id: 'instructor', label: 'المشرف الأكاديمي (المطور)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-500'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-5 text-sm leading-relaxed">
              <div className={`p-4 rounded-xl border ${
                isLight ? 'bg-blue-50/70 border-blue-100 text-blue-900' : 'bg-cyan-950/20 border-cyan-500/20 text-cyan-200'
              }`}>
                <h3 className="font-bold text-base mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  عن هذا المسار التخصصي (Specialization Overview)
                </h3>
                <p className="text-xs leading-relaxed opacity-90">
                  صُممت دبلومة JINNA 5 لتكون المرجع الشامل والأول من نوعه باللغة العربية لنقل مهندس البرمجيات من مستوى المبتدئ إلى مستوى 
                  <strong> كبير مهندسي وباحثي نظم الذكاء الاصطناعي (Principal AI Research & Systems Engineer)</strong>، مع التركيز على الكفاءة الحسابية، 
                  وتحسين استهلاك ذاكرة VRAM، وبناء نماذج المحولات (Transformers) من الصفر حتى مرحلة الاستدلال السريع والتوزيع الموازي.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-cyan-400" />
                  ماذا ستكتسب وتتقن بعد إتمام المنهج؟ (Core Learning Outcomes)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { title: 'عتاد الحوسبة وذاكرة GPU', desc: 'إتقان مساحات الذاكرة SRAM vs HBM، وحساب ميزانية VRAM بدقة 100% للأوزان والتنشيطات.' },
                    { title: 'رياضيات التنسورات ونظم المحولات', desc: 'تفكيك مصفوفات Q, K, V، وحساب التعقيد الحسابي O(N²)، وبناء آلية الانتباه يدويًا.' },
                    { title: 'تشفير المواقع الدوراني (RoPE)', desc: 'تطبيق Complex Rotary Embeddings وهندسة تمديد السياق الطويل حتى 128k توكن.' },
                    { title: 'تقنيات الـ FlashAttention-3', desc: 'التغلب على عنق زجاجة الذاكرة عبر Tiling وتحسين استخدام On-Chip SRAM.' },
                    { title: 'محركات الاستدلال فائق السرعة (vLLM)', desc: 'تطبيق PagedAttention للتخلص من التجزئة الداخلية ورفع الـ Throughput بنحو 24 ضعفاً.' },
                    { title: 'التدريب الموزع والتوسع المتوازي', desc: 'إتقان تقنيات ZeRO-1/2/3، وTensor Parallelism و Pipeline Parallelism على مجمعات الحوسبة.' },
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141520] border-white/[0.06]'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-xs">{item.title}</h4>
                        <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                يتكون المسار من 10 فصول متسلسلة تدريبياً، مرتبة من الأساسيات العتادية والرياضية حتى أعلى مستويات هندسة وتدريب النماذج:
              </p>

              <div className="space-y-2.5">
                {allChapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141520] border-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 flex-shrink-0">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-cyan-400">الفصل {chapter.id}</span>
                          <span className={`text-[10px] px-2 py-0.2 rounded font-mono ${
                            isLight ? 'bg-slate-200 text-slate-700' : 'bg-white/[0.06] text-slate-300'
                          }`}>
                            {chapter.estimatedHours} ساعة تدريبية
                          </span>
                        </div>
                        <h4 className="font-bold text-sm mt-0.5">{chapter.title}</h4>
                        <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          {chapter.subtitle}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                          <span>الدروس: {chapter.lessons.length} درس تطبيقي</span>
                          <span>•</span>
                          <span>معمل بايثون تفاعلي</span>
                          <span>•</span>
                          <span>اختبار فصلي معتمد</span>
                        </div>
                      </div>
                    </div>

                    {onSelectChapter && chapter.lessons[0] && (
                      <button
                        onClick={() => {
                          onSelectChapter(chapter.id, chapter.lessons[0].id);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors flex-shrink-0"
                      >
                        بدء الفصل
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'grading' && (
            <div className="space-y-4 text-xs leading-relaxed">
              <div className={`p-4 rounded-xl border ${
                isLight ? 'bg-amber-50/80 border-amber-200 text-amber-900' : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
              }`}>
                <h3 className="font-bold text-sm mb-1 flex items-center gap-2 text-amber-400">
                  <Award className="w-4 h-4" />
                  شروط ومعايير استحقاق الشهادة الرقمية المعتمدة
                </h3>
                <p className="leading-relaxed">
                  تمنح منصة JINNA 5 شهادة إنجاز واحتراف موثقة برقم تسلسلي فريد وباسم الطالب، وفق المعايير الأكاديمية العالمية:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-3.5 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141520] border-white/[0.06]'
                }`}>
                  <div className="text-2xl font-black text-cyan-400 font-mono">100%</div>
                  <div className="font-bold text-xs mt-1">إكمال المنهج كاملاً</div>
                  <p className="text-[11px] text-slate-400 mt-1">قراءة وتطبيق كافة الـ 11 درساً في الفصول العشرة وتجربة الأكواد.</p>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141520] border-white/[0.06]'
                }`}>
                  <div className="text-2xl font-black text-emerald-400 font-mono">70%+</div>
                  <div className="font-bold text-xs mt-1">اجتياز الاختبارات</div>
                  <p className="text-[11px] text-slate-400 mt-1">الحصول على درجة 70% على الأقل في كل اختبار فصلي لضمان رسوخ الفهم.</p>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141520] border-white/[0.06]'
                }`}>
                  <div className="text-2xl font-black text-amber-400 font-mono">Verified</div>
                  <div className="font-bold text-xs mt-1">توثيق رسمي</div>
                  <p className="text-[11px] text-slate-400 mt-1">شهادة قابلة للتنزيل كصورة ومستند رسمي معتمد من المهندس يوسف الباز.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'instructor' && (
            <div className={`p-5 rounded-2xl border space-y-4 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141520] border-white/[0.08]'
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-cyan-900/40 border-2 border-cyan-400/40 flex-shrink-0">
                  YB
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg">المهندس يوسف الباز</h3>
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-xs text-cyan-400 font-mono mt-0.5">
                    Automation Ai Yousuf Albaz • Principal AI Systems Architect
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    مهندس ومطور أنظمة وأبحاث الذكاء الاصطناعي وبناء النماذج اللغوية الضخمة والأتمتة الذكية.
                  </p>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#0E0F16] border-white/[0.06] text-slate-300'
              }`}>
                <p>
                  "تم تصميم وتطوير هذه المنصة التعليمية والهندسية المتكاملة JINNA 5 بهدف سد الفجوة بين المعرفة النظرية للتعلم العميق 
                  والتطبيق الهندسي الواقعي على أنظمة الحوسبة الفائقة (GPU Clusters). نضمن لك من خلالها تجربة تطبيقية رائدة توازي كبرى المعاهد والمراكز البحثية العالمية."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`px-6 py-3 border-t flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141520] border-white/[0.08]'
        }`}>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>منصة JINNA 5 التعليمية - جميع الحقوق محفوظة للمهندس يوسف الباز</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
