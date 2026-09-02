import React, { useState } from 'react';
import { X, Award, ShieldCheck, Download, Printer, CheckCircle2, Sparkles } from 'lucide-react';
import { UserProgress } from '../types';
import { getTotalCurriculumStats } from '../data/curriculumData';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onSaveName: (name: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  progress,
  onSaveName
}) => {
  const [name, setName] = useState(progress.studentName || 'مهندس وباحث الذكاء الاصطناعي');
  const [isEditing, setIsEditing] = useState(!progress.studentName);

  if (!isOpen) return null;

  const stats = getTotalCurriculumStats();
  const completedCount = progress.completedLessons.length;
  const percent = Math.round((completedCount / (stats.totalLessons || 1)) * 100);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    onSaveName(name);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0E0E14] border border-white/[0.08] rounded-2xl max-w-3xl w-full my-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#121218] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">
              شهادة إتمام برنامج تأهيل مهندسي وباحثي الذكاء الاصطناعي
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Preview Card */}
        <div className="p-6 bg-[#0A0A0C]">
          <div className="relative p-8 rounded-2xl bg-gradient-to-b from-[#111119] via-[#0D0D14] to-[#0A0A0F] border-2 border-amber-500/25 shadow-2xl text-center space-y-6 overflow-hidden">
            {/* Background watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <Award className="w-96 h-96 text-amber-300" />
            </div>

            {/* Top Seal */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-[#0A0A0F] rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-amber-400/90 font-mono font-semibold">
                AI Research & Systems Engineering Fellowship
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                شهادة تأهيل مهندس وباحث ذكاء اصطناعي معتمد
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
                يشهد البرنامج بأن الزميل الباحث قد أتم بنجاح متطلبات المسار المتكامل لبناء وتدريب وتشغيل النماذج اللغوية الضخمة (LLMs) والأنظمة الموزعة.
              </p>
            </div>

            {/* Student Name */}
            <div className="py-2 border-y border-amber-500/20 max-w-md mx-auto">
              {isEditing ? (
                <div className="flex items-center gap-2 justify-center">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اكتب اسمك الكامل للشهادة..."
                    className="bg-[#14141E] border border-white/[0.12] rounded-lg px-3 py-1.5 text-sm text-center text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleSave}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-colors"
                  >
                    حفظ الاسم
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">
                    {name}
                  </span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[10px] text-slate-500 hover:text-slate-300 underline"
                  >
                    (تعديل)
                  </button>
                </div>
              )}
            </div>

            {/* Verified Skills Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-right max-w-xl mx-auto text-[11px] text-slate-300">
              <div className="p-2.5 rounded-lg bg-[#14141E] border border-white/[0.08]">
                <span className="font-bold text-cyan-400 block">CUDA & VRAM</span>
                <span className="text-slate-500 text-[10px]">إدارة الذاكرة والحوسبة</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#14141E] border border-white/[0.08]">
                <span className="font-bold text-blue-400 block">Autograd & Backprop</span>
                <span className="text-slate-500 text-[10px]">الاشتقاق من الصفر</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#14141E] border border-white/[0.08]">
                <span className="font-bold text-purple-400 block">Transformers & RoPE</span>
                <span className="text-slate-500 text-[10px]">معمارية الانتباه الموزع</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#14141E] border border-white/[0.08]">
                <span className="font-bold text-emerald-400 block">Distributed Training</span>
                <span className="text-slate-500 text-[10px]">DeepSpeed ZeRO & FSDP</span>
              </div>
            </div>

            {/* Credential Meta Footer */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 border-t border-white/[0.08]">
              <div>
                <span className="block font-mono text-[10px] text-slate-500">معرف الاعتماد (Credential ID):</span>
                <span className="font-mono text-amber-400 text-xs">AIRS-LLM-{Date.now().toString().slice(-8)}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">نسبة الإنجاز المعتمدة:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {percent}% مكتمل ({completedCount}/{stats.totalLessons} درس)
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">تاريخ الإصدار:</span>
                <span className="font-mono text-slate-300 text-xs">{new Date().toLocaleDateString('ar-EG')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-3 bg-[#121218] border-t border-white/[0.08] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {percent < 100 ? "يمكنك استخراج مسودة الشهادة حالياً، وتحديثها مع إكمال بقية الفصول." : "تهانينا! لقد أتممت 100% من المسار العلمي والهندسي."}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#181822] hover:bg-[#222230] text-slate-200 text-xs font-semibold border border-white/[0.08] transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white text-xs font-semibold border border-cyan-400/30 transition-all shadow-md shadow-cyan-950"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
