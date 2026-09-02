import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, Trophy, RotateCcw, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Chapter } from '../types';

interface QuizModalProps {
  chapter: Chapter;
  onClose: () => void;
  onSaveScore: (score: number, total: number) => void;
  initialPassed?: boolean;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  chapter,
  onClose,
  onSaveScore,
  initialPassed = false
}) => {
  const questions = chapter.quiz || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (showExplanation[currentIndex]) return; // locked once answered

    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
    setShowExplanation(prev => ({
      ...prev,
      [currentIndex]: true
    }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleFinish = () => {
    const finalScore = calculateScore();
    setIsFinished(true);
    onSaveScore(finalScore, questions.length);

    if (finalScore >= Math.ceil(questions.length * 0.7)) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);
    setIsFinished(false);
  };

  if (!currentQ && !isFinished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center max-w-md w-full">
          <p className="text-slate-300">لا يوجد اختبار مسجل لهذا الفصل حالياً.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-800 rounded-lg text-sm text-white">إغلاق</button>
        </div>
      </div>
    );
  }

  const score = calculateScore();
  const passed = score >= Math.ceil(questions.length * 0.7);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0E0E14] border border-white/[0.08] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#121218] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                اختبار تقييم المفاهيم: {chapter.title}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isFinished ? 'النتيجة النهائية' : `السؤال ${currentIndex + 1} من ${questions.length}`}
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

        {/* Content */}
        <div className="p-5 flex-1 bg-[#0A0A0C]">
          {isFinished ? (
            /* Results Screen */
            <div className="text-center py-6 space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                passed ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/50' : 'bg-rose-950/80 text-rose-400 border border-rose-600/50'
              }`}>
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-100">
                  {passed ? 'مبارك! لقد اجتزت اختبار الفصل بنجاح 🎉' : 'تحتاج لمراجعة بعض المفاهيم الرياضية 📚'}
                </h4>
                <p className="text-sm text-slate-400 mt-1">
                  النتيجة: <span className="font-bold text-white font-mono">{score}</span> من <span className="font-mono">{questions.length}</span> (
                  {Math.round((score / questions.length) * 100)}%)
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#161622] hover:bg-[#202030] text-slate-200 text-xs font-semibold border border-white/[0.08] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة الاختبار</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-950 border border-cyan-400/30 transition-all"
                >
                  متابعة المنهج
                </button>
              </div>
            </div>
          ) : (
            /* Active Question Screen */
            <div className="space-y-4">
              {/* Question Statement */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-700/50">
                    مستوى: {currentQ.difficulty}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-100 leading-relaxed">
                  {currentQ.question}
                </h4>

                {currentQ.codeSnippet && (
                  <pre className="p-3 rounded-lg bg-[#07070A] border border-white/[0.08] font-mono text-xs text-slate-300 overflow-x-auto" dir="ltr">
                    {currentQ.codeSnippet}
                  </pre>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2 pt-2">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentIndex] === idx;
                  const isAnswered = showExplanation[currentIndex];
                  const isCorrect = idx === currentQ.correctIndex;

                  let buttonStyle = 'bg-[#121218] border-white/[0.08] hover:border-white/[0.14] text-slate-200';
                  if (isAnswered) {
                    if (isCorrect) {
                      buttonStyle = 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200';
                    } else if (isSelected) {
                      buttonStyle = 'bg-rose-950/50 border-rose-500/60 text-rose-200';
                    } else {
                      buttonStyle = 'bg-[#0E0E13] border-white/[0.04] text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    buttonStyle = 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200 shadow-sm';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-right p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${buttonStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-md bg-[#1B1B26] border border-white/[0.08] flex items-center justify-center font-mono text-xs text-slate-300">
                          {idx + 1}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isAnswered && isCorrect && (
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {showExplanation[currentIndex] && (
                <div className="p-3.5 rounded-xl bg-[#08080C] border border-cyan-500/20 text-xs space-y-1.5 animate-fadeIn">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>التفسير العلمي والهندسي:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!isFinished && (
          <div className="px-5 py-3 bg-[#121218] border-t border-white/[0.08] flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#181822] hover:bg-[#20202F] disabled:opacity-40 text-slate-300 text-xs transition-colors border border-white/[0.06]"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                disabled={!showExplanation[currentIndex]}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 disabled:opacity-40 text-white text-xs font-semibold transition-all shadow-md shadow-cyan-950 border border-cyan-400/30"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!showExplanation[currentIndex]}
                className="flex items-center gap-1 px-5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 disabled:opacity-40 text-white text-xs font-semibold shadow-md border border-emerald-400/30 transition-all"
              >
                <span>إنهاء وحساب النتيجة</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
