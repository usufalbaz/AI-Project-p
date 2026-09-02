import React, { useState, useEffect } from 'react';
import { 
  X, FileText, Save, Download, Trash2, Copy, Check, 
  BookOpen, Sparkles, CheckCircle2 
} from 'lucide-react';
import { Lesson, Chapter } from '../types';
import { useTheme } from '../context/ThemeContext';

interface StudentNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLesson?: Lesson;
  currentChapter?: Chapter;
}

const NOTES_STORAGE_KEY = 'jinna_student_notes_v1';

export const StudentNotesDrawer: React.FC<StudentNotesDrawerProps> = ({
  isOpen,
  onClose,
  currentLesson,
  currentChapter
}) => {
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const lessonKey = currentLesson?.id || 'general';
  const [currentText, setCurrentText] = useState(notes[lessonKey] || '');
  const [copied, setCopied] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    setCurrentText(notes[lessonKey] || '');
  }, [lessonKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated = { ...notes, [lessonKey]: currentText };
    setNotes(updated);
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JINNA5_Notes_${currentLesson?.id || 'General'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm('هل تريد مسح ملاحظات هذا الدرس؟')) {
      setCurrentText('');
      const updated = { ...notes, [lessonKey]: '' };
      setNotes(updated);
      try {
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in" dir="rtl">
      <div className={`w-full max-w-md h-full shadow-2xl flex flex-col border-r transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0E0F16] border-white/[0.08] text-slate-100'
      }`}>
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141520] border-white/[0.08]'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">دفتر ملاحظات الطالب</h3>
              <p className="text-[11px] text-slate-400">
                {currentLesson ? `ملاحظات: ${currentLesson.title}` : 'الملاحظات العامة للدبلومة'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Lesson Badge */}
        {currentLesson && (
          <div className={`px-5 py-2.5 border-b text-xs flex items-center justify-between ${
            isLight ? 'bg-purple-50/50 border-purple-100 text-purple-950' : 'bg-purple-950/20 border-purple-500/20 text-purple-200'
          }`}>
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>مرتبط بـ: {currentLesson.title}</span>
            </span>
            <span className="font-mono text-[10px] opacity-75">الفصل {currentChapter?.id}</span>
          </div>
        )}

        {/* Text Area */}
        <div className="flex-1 p-5 flex flex-col">
          <textarea
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder="اكتب ملاحظاتك، استفساراتك، المعادلات الرياضية، أو كود بايثون الذي تود مراجعته لاحقاً هنا..."
            className={`w-full flex-1 p-4 rounded-xl text-xs leading-relaxed resize-none focus:outline-none border transition-colors ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500 focus:bg-white'
                : 'bg-[#12131D] border-white/[0.08] text-slate-200 focus:border-purple-500/60 focus:bg-[#151624]'
            }`}
          />
        </div>

        {/* Action Controls */}
        <div className={`p-4 border-t flex items-center justify-between gap-2 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141520] border-white/[0.08]'
        }`}>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSave}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/30 flex items-center gap-1.5"
            >
              {savedStatus ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedStatus ? 'تم الحفظ!' : 'حفظ الملاحظة'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-2 rounded-xl border border-white/[0.08] hover:bg-white/[0.06] text-slate-300 text-xs transition-colors"
              title="نسخ الملاحظات"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDownload}
              className="p-2 rounded-xl border border-white/[0.08] hover:bg-white/[0.06] text-slate-300 text-xs transition-colors"
              title="تنزيل كملف نصي .txt"
            >
              <Download className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {currentText && (
            <button
              onClick={handleClear}
              className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/30 border border-rose-500/20 text-xs transition-colors"
              title="مسح الملاحظة"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
