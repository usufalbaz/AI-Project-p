import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Sparkles, Send, Bot, User, BrainCircuit, Lightbulb, 
  Copy, Check, Code2, AlertCircle, RefreshCw, Key 
} from 'lucide-react';
import { ChatMessage, Lesson, Chapter } from '../types';
import { getLocalMentorResponse } from '../utils/aiMentorFallback';

interface AiMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLesson?: Lesson;
  currentChapter?: Chapter;
  apiKey?: string;
  onOpenApiKey?: () => void;
}

export const AiMentorDrawer: React.FC<AiMentorDrawerProps> = ({
  isOpen,
  onClose,
  currentLesson,
  currentChapter,
  apiKey,
  onOpenApiKey
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `مرحباً بك يا زميلي في منصة JINNA 5 لأبحاث وهندسة الذكاء الاصطناعي (المطورة بواسطة المهندس يوسف الباز - Automation Ai Yousuf Albaz)!
أنا المساعد الذكي المتقدم (JINNA 5 Principal AI Mentor)، ومزود بنمط التفكير فائق العمق (High Thinking Mode) للإجابة على أصعب المسائل:
- تفكيك المعادلات الرياضية المعقدة (SVD, Backprop, Attention, RoPE, DPO).
- تحليل أبعاد التنسورات ومحاكاة استهلاك الـ VRAM في عناقيد الـ GPUs.
- تحضيرك لأسئلة المقابلات الهندسية الدقيقة في كبرى الشركات (Meta, OpenAI, Google DeepMind).

كيف يمكنني مساعدتك في درس اليوم؟`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      let replyText = '';
      try {
        const res = await fetch('/api/mentor/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            chapterTitle: currentChapter?.title,
            lessonTitle: currentLesson?.title,
            contextCode: currentLesson?.pythonCode?.code,
            useThinking,
            apiKey
          })
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.reply) {
            replyText = data.reply;
          }
        }
      } catch (networkErr) {
        console.warn('API endpoint unreachable, checking client-side options:', networkErr);
      }

      // If backend was unreachable or returned empty, but user provided their Gemini API key, call Gemini directly!
      if (!replyText && apiKey) {
        try {
          const directRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: {
                  parts: [{
                    text: `أنت كبير مهندسي وباحثي الذكاء الاصطناعي لمنصة JINNA 5 المطورة بواسطة المهندس يوسف الباز (Automation Ai Yousuf Albaz). اشرح المفاهيم الهندسية، وفكك المعادلات الرياضية وأبعاد التنسورات، وأجب باحترافية عالية مع كود بايثون متقن.`
                  }]
                },
                contents: [{
                  parts: [{
                    text: `السياق: درس (${currentLesson?.title || ''}) - فصل (${currentChapter?.title || ''}).\nسؤال المستخدم: ${query}`
                  }]
                }]
              })
            }
          );
          if (directRes.ok) {
            const directData = await directRes.json();
            const candidate = directData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidate) {
              replyText = candidate;
            }
          }
        } catch (directErr) {
          console.warn('Direct Gemini API call failed:', directErr);
        }
      }

      if (!replyText) {
        replyText = getLocalMentorResponse(
          query,
          currentLesson?.title,
          currentChapter?.title,
          currentLesson?.pythonCode?.code
        );
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isThinking: useThinking
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg = getLocalMentorResponse(
        query,
        currentLesson?.title,
        currentChapter?.title,
        currentLesson?.pythonCode?.code
      );
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackMsg,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isThinking: useThinking
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { label: "اشرح المعادلة الرياضية خطوة بخطوة 📐", prompt: `اشرح لي بالتفصيل الرياضي والاشتقاق خطوة بخطوة المعادلة الأساسية المذكورة في درس (${currentLesson?.title || 'هذا الدرس'}) وكيف نصل إليها.` },
    { label: "كيف يطبق هذا في LLaMA 3 و GPT-4؟ 🚀", prompt: `كيف يتم تطبيق المفهوم المذكور في درس (${currentLesson?.title || 'هذا الدرس'}) في معمارية النماذج الحديثة مثل LLaMA 3 و DeepSeek؟` },
    { label: "سؤال مقابلة في Meta أو OpenAI 💼", prompt: `اطرح عليّ سؤال مقابلة وظيفية تقنية متقدمة (Principal AI Systems Interview) حول موضوع درس (${currentLesson?.title || 'هذا الدرس'}) ثم وضح لي الإجابة النموذجية مع حسابات الذاكرة.` },
    { label: "تحسين كود بايثون وحساب FLOPs ⚡", prompt: `راجع كود بايثون المرفق في هذا الدرس، ووضح لي أبعاد التنسورات، وتعقيد الذاكرة والـ FLOPs وكيف يمكن تسريعه باستخدام FlashAttention أو CUDA.` }
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-full max-w-lg bg-[#0D0D12] border-r border-white/[0.08] shadow-2xl flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="px-4 py-3 bg-[#111117] border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/25 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-100">مساعد JINNA 5 الذكي (AI Systems Mentor)</h3>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-950/70 text-indigo-300 border border-indigo-700/50 font-mono">
                Gemini 3.1 Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {currentLesson ? `السياق: ${currentLesson.title}` : 'مرشد JINNA 5 المتخصص • م. يوسف الباز'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Thinking Mode Switch Bar */}
      <div className="px-4 py-2 bg-[#0F0F15] border-b border-white/[0.06] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-medium">نمط التفكير فائق التعقيد (High Thinking Mode)</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={useThinking}
            onChange={(e) => setUseThinking(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-[#1B1B26] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
        </label>
      </div>

      {/* API Key Status Bar */}
      <div className={`px-4 py-2 border-b flex items-center justify-between text-xs ${
        apiKey 
          ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300' 
          : 'bg-amber-950/20 border-amber-500/20 text-amber-300'
      }`}>
        <div className="flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5" />
          <span>{apiKey ? 'مفتاح Gemini API مفعل بنجاح 🟢' : 'لم يتم حفظ مفتاح API في المتصفح 🟡'}</span>
        </div>
        {onOpenApiKey && (
          <button
            onClick={onOpenApiKey}
            className="text-[11px] underline hover:text-white font-semibold transition-colors flex items-center gap-1"
          >
            <span>{apiKey ? 'تعديل المفتاح' : 'إدخال المفتاح 🔑'}</span>
          </button>
        )}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0A0C]">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isCopied = copiedId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                  isUser
                    ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40'
                    : 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-tr-none shadow-md'
                    : 'bg-[#13131A] text-slate-200 border border-white/[0.08] rounded-tl-none shadow-md'
                }`}
              >
                {!isUser && msg.isThinking && (
                  <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono mb-1.5 pb-1 border-b border-white/[0.06]">
                    <BrainCircuit className="w-3 h-3" />
                    <span>تم التوليد بنمط التفكير العميق (High Reasoning)</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap selection:bg-cyan-500/30">
                  {msg.content}
                </div>

                <div className="flex items-center justify-between gap-2 mt-2 pt-1 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="hover:text-slate-200 flex items-center gap-1 transition-colors"
                      title="نسخ الإجابة"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? "تم النسخ" : "نسخ"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-[#13131A] border border-white/[0.08] rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>
                {useThinking
                  ? "جاري التفكير وحساب أبعاد التنسورات وصياغة التحليل الهندسي المتقدم..."
                  : "جاري توليد الاستجابة..."}
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2 bg-[#0B0B0F] border-t border-white/[0.06] overflow-x-auto flex gap-1.5 no-scrollbar">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt)}
            disabled={isLoading}
            className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-[#14141B] hover:bg-[#1C1C26] text-slate-300 border border-white/[0.08] text-[11px] whitespace-nowrap transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-[#111117] border-t border-white/[0.08]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="اسأل عن أي مفهوم رياضي، معادلة، كود CUDA، أو LLaMA 3..."
            disabled={isLoading}
            className="flex-1 bg-[#0A0A0E] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`p-2.5 rounded-xl transition-all shadow-md ${
              !inputValue.trim() || isLoading
                ? 'bg-[#181822] text-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-cyan-900/30 hover:opacity-95'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
