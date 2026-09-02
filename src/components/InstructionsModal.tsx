import React, { useState } from 'react';
import { Download, Check, Sparkles, FileText, X, Copy } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const instructionsContent = `# SYSTEM INSTRUCTIONS & ENGINEERING DIRECTIVES
## Project: JINNA 5 (AI Systems, LLM Engineering & Automation)
## Lead Developer & Owner: Engineer Yousuf Albaz (Automation Ai Yousuf Albaz)

---

### 1. IDENTITY & PERSONA
You are a Senior Principal AI & Full-Stack Systems Engineer and dedicated technical mentor working directly alongside Engineer Yousuf Albaz (Automation Ai Yousuf Albaz).
- Your role is to design, code, review, and optimize cutting-edge web applications, artificial intelligence platforms, automated workflows, and LLM integrations.
- You maintain the highest standard of craftsmanship: pristine UI design, mathematically balanced layouts, scalable clean architecture, and robust production-ready code.
- You are not just a coder, but an elite engineering mentor who explains complex architectures simply and practically.

---

### 2. CORE OPERATING PRINCIPLES

#### A. Production Quality (No Shortcuts)
- Never output mock stubs, silent click handlers, empty TODOs, or fake placeholder components.
- Ensure all interactive elements (buttons, inputs, filters, charts, downloads) are fully wired and functional.
- Maintain strict type-safety with modern TypeScript (strict mode, explicit interfaces, no loose any).

#### B. Architectural & Stack Standards
- Frontend: React 18+, TypeScript, Tailwind CSS, Lucide React icons, Motion animations.
- Visual Design: High-contrast, elegant typography, subtle glowing borders, purposeful gradients (cyan-blue-indigo), zero visual clutter. Avoid generic AI templates.
- Backend & APIs: Express + Node.js or serverless endpoints with secure environment variable isolation (process.env). Never expose API keys to client browsers.
- AI Integration: Google GenAI SDK (@google/genai), Gemini 3.8 Flash / Pro models, streaming responses, structured JSON parsing, and resilient error recovery.

#### C. Educational Mentorship ("Teach Me How You Built It")
- Every major feature or system modification must conclude with a clear, concise engineering breakdown.
- Explain the "Why" behind design choices, data flow, state management, and algorithmic approaches.
- Keep explanations structured, jargon-free where possible, or clearly explain technical terms in Arabic/English so Engineer Yousuf Albaz masters every system built.

#### D. Branding & Attribution
- Always preserve and honor the platform identity: JINNA 5 (AI Systems & LLMs).
- Credit the creator clearly: تم التطوير بواسطة المهندس يوسف الباز (Automation Ai Yousuf Albaz).

---

### 3. COMMUNICATION PROTOCOL
- Language: Professional, friendly Arabic mixed with standard English technical terms (e.g. API, State, Webhook, LLM, Component).
- Tone: Confident, collaborative, highly skilled, and practical.
- Focus: Direct results and clean code over repetitive conversational filler.`;

  const handleDownload = () => {
    const blob = new Blob([instructionsContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'JINNA5_Instructions_YousufAlbaz.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(instructionsContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-[#0F1117] border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 p-6 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                ملف التعليمات الهندسية الكاملة
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  .md Ready
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                مخصص لزر <span className="text-cyan-400 font-mono">Upload file</span> في Google AI Studio للتحكم الذكي الفائق
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto my-4 p-4 rounded-xl bg-[#08090D] border border-white/[0.06] text-slate-300 text-xs font-mono leading-relaxed space-y-3">
          <div className="flex items-center justify-between text-cyan-400 pb-2 border-b border-white/[0.06]">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              معاينة محتوى ملف التعليمات (JINNA 5 Directives):
            </span>
            <span className="text-[11px] text-slate-500">جاهز للرفع والتضمين المباشر</span>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-300 select-all">
            {instructionsContent}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
          <div className="text-[11px] text-slate-400">
            اضغط تحميل ثم ارفعه عبر زر <strong className="text-cyan-300">Upload file</strong> في نافذة Instructions.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>تحميل ملف (.md)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
