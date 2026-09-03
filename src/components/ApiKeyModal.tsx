import React, { useState, useEffect } from 'react';
import { Key, CheckCircle2, AlertCircle, ExternalLink, Trash2, Eye, EyeOff, Sparkles, X, ShieldCheck } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const API_KEY_STORAGE_KEY = 'jinna_gemini_api_key';

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    setInputKey(apiKey || '');
    setTestResult(null);
  }, [apiKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = inputKey.trim();
    onSaveApiKey(trimmed);
    setTestResult({
      success: true,
      message: trimmed ? 'تم حفظ المفتاح بنجاح! الذكاء الاصطناعي جاهز للعمل.' : 'تم تفريغ المفتاح، سيعمل المساعد بنظام المعرفة المدمج.'
    });
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleTestKey = async () => {
    const trimmed = inputKey.trim();
    if (!trimmed) {
      setTestResult({ success: false, message: 'يرجى إدخال مفتاح الـ API أولاً لتجربته.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    // List of modern Gemini models in order of Google AI Studio availability
    const candidateModels = [
      'gemini-3.1-flash-lite',
      'gemini-3.6-flash',
      'gemini-3.8-flash',
      'gemini-3.5-flash',
      'gemini-flash-latest',
      'gemini-flash-lite-latest',
    ];

    let lastError = '';
    let successfulModel = '';

    try {
      for (const model of candidateModels) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'x-goog-api-key': trimmed
              },
              body: JSON.stringify({
                contents: [{ parts: [{ text: 'قل كلمة واحدة: متصل' }] }]
              })
            }
          );

          const data = await res.json();
          if (res.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            successfulModel = model;
            break;
          } else {
            lastError = data?.error?.message || 'المفتاح غير صالح أو انتهت صلاحيته.';
            // Stop early if key itself is completely invalid (not a model issue)
            if (data?.error?.status === 'INVALID_ARGUMENT' && data?.error?.message?.includes('API key not valid')) {
              break;
            }
          }
        } catch (callErr: any) {
          lastError = callErr.message || 'خطأ في الاتصال بخوادم Google';
        }
      }

      if (successfulModel) {
        localStorage.setItem('jinna_gemini_model', successfulModel);
        setTestResult({
          success: true,
          message: `🟢 رائع! المفتاح صالح ويعمل بنجاح فائق باستخدام أحدث نموذج معتمد (${successfulModel}).`
        });
        onSaveApiKey(trimmed);
      } else {
        setTestResult({
          success: false,
          message: `فشل التحقق: ${lastError || 'المفتاح غير صالح أو غير متاح لهذا النموذج حالياً.'}`
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `تعذر الاتصال بخوادم Google: ${err.message || 'تأكد من اتصالك بالإنترنت'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClear = () => {
    setInputKey('');
    onSaveApiKey('');
    setTestResult({ success: true, message: 'تم حذف المفتاح المخزن.' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-[#0F1016] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/50 overflow-hidden flex flex-col max-h-[90vh]"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#141520]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                إعدادات مفتاح الذكاء الاصطناعي
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Gemini API
                </span>
              </h3>
              <p className="text-xs text-slate-400">تفعيل المساعد الذكي التفاعلي ومحاكي بايثون</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Status Badge */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            apiKey 
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
          }`}>
            <div className="flex items-center gap-2.5">
              {apiKey ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              )}
              <div className="text-xs leading-relaxed">
                <p className="font-bold">
                  {apiKey ? 'مفتاح الـ API المخصص مفعّل ومربوط 🟢' : 'المساعد متصل ويعمل بالمفتاح السحابي المدمج 🟢'}
                </p>
                <p className="text-[11px] opacity-80 mt-0.5">
                  {apiKey 
                    ? 'المساعد الذكي ومحاكي بايثون يعملان بنماذج Gemini عبر مفتاحك المخصص.' 
                    : 'المنصة تعمل بكامل طاقتها الذكية عبر مفتاح الخادم المدمج، ويمكنك إضافة مفتاحك الخاص في أي وقت.'}
                </p>
              </div>
            </div>
          </div>

          {/* Key Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              أدخل مفتاح Gemini API الخاص بك:
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#161722] border border-white/[0.12] focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono transition-colors pl-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                title={showKey ? 'إخفاء المفتاح' : 'إظهار المفتاح'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              يتم حفظ المفتاح بأمان داخل متصفحك محلياً (Local Storage) ولا تتم مشاركته أبداً.
            </p>
          </div>

          {/* Test Feedback */}
          {testResult && (
            <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
              testResult.success
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}>
              {testResult.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/30 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>حفظ المفتاح وتفعيله</span>
            </button>

            <button
              onClick={handleTestKey}
              disabled={isTesting}
              className="py-2.5 px-4 rounded-xl bg-[#1A1C28] hover:bg-[#222536] text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isTesting ? (
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>تجربة المفتاح (Test)</span>
            </button>

            {apiKey && (
              <button
                onClick={handleClear}
                className="py-2.5 px-3 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-500/20 text-xs font-medium transition-colors flex items-center justify-center"
                title="حذف المفتاح"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* How to get a free key */}
          <div className="pt-4 border-t border-white/[0.08] text-xs space-y-2">
            <p className="font-semibold text-slate-300">كيف تحصل على مفتاح Gemini API مجاني 100%؟</p>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
              <li>ادخل إلى صفحة مفاتيح Google AI Studio الرسمية.</li>
              <li>اضغط على <strong>Create API Key</strong> ثم أنشئ المفتاح في ثوانٍ.</li>
              <li>انسخ الكود الذي يبدأ بـ <code>AIzaSy...</code> والصقه هنا.</li>
            </ol>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-xs font-semibold mt-1 transition-colors"
            >
              <span>فتح صفحة Google AI Studio للحصول على المفتاح مجاناً</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
