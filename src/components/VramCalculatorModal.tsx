import React, { useState } from 'react';
import { X, Calculator, Cpu, HardDrive, Zap, Info, Server } from 'lucide-react';

interface VramCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VramCalculatorModal: React.FC<VramCalculatorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [paramsBillion, setParamsBillion] = useState<number>(8); // e.g. LLaMA 3 8B
  const [precision, setPrecision] = useState<'fp16' | 'fp8' | 'int4'>('fp16');
  const [mode, setMode] = useState<'training_full' | 'training_lora' | 'inference'>('inference');
  const [seqLen, setSeqLen] = useState<number>(4096);
  const [batchSize, setBatchSize] = useState<number>(1);
  const [zeroStage, setZeroStage] = useState<'none' | 'zero1' | 'zero2' | 'zero3'>('none');

  if (!isOpen) return null;

  // Calculation formulas
  const bytesPerParam = precision === 'fp16' ? 2 : precision === 'fp8' ? 1 : 0.5;
  const p = paramsBillion * 1e9;

  // 1. Weights
  const weightsGB = (p * bytesPerParam) / (1024 ** 3);

  // 2. Gradients & Optimizer
  let gradGB = 0;
  let optGB = 0;

  if (mode === 'training_full') {
    gradGB = (p * 2) / (1024 ** 3); // gradients in bf16
    // AdamW full = 16 bytes per param (FP32 master weights 4B + m 4B + v 4B + extra)
    let optBytes = 16;
    if (zeroStage === 'zero1') optBytes = 4; // partitioned across cluster
    if (zeroStage === 'zero2') optBytes = 2;
    if (zeroStage === 'zero3') optBytes = 1;
    optGB = (p * optBytes) / (1024 ** 3);
  } else if (mode === 'training_lora') {
    // LoRA rank r=16 trains ~0.2% of params
    const loraParams = p * 0.002;
    gradGB = (loraParams * 2) / (1024 ** 3);
    optGB = (loraParams * 16) / (1024 ** 3);
  }

  // 3. KV Cache for inference or training
  // Approximate KV Cache: 2 * num_layers * num_kv_heads * head_dim * seq_len * batch * bytesPerParam
  // For 8B: 32 layers, 8 KV heads (GQA), 128 dim
  const layers = paramsBillion <= 8 ? 32 : paramsBillion <= 70 ? 80 : 126;
  const kvHeads = paramsBillion <= 8 ? 8 : paramsBillion <= 70 ? 8 : 16;
  const headDim = 128;
  const kvCacheBytes = 2 * layers * kvHeads * headDim * seqLen * batchSize * bytesPerParam;
  const kvCacheGB = kvCacheBytes / (1024 ** 3);

  // 4. Activation Memory
  const activationsGB = (mode === 'inference')
    ? (seqLen * batchSize * headDim * 4) / (1024 ** 3)
    : (seqLen * batchSize * 4096 * layers * 12) / (1024 ** 3); // training activations without checkpointing

  const totalVramGB = weightsGB + gradGB + optGB + (mode === 'inference' ? kvCacheGB : activationsGB);

  // Recommendation
  let recommendation = "";
  if (totalVramGB <= 16) {
    recommendation = "بطاقة واحدة عادية (مثل RTX 4080 16GB)";
  } else if (totalVramGB <= 24) {
    recommendation = "بطاقة استهلاكية متطورة (1x RTX 3090 / 4090 24GB)";
  } else if (totalVramGB <= 48) {
    recommendation = "محطة عمل احترافية (1x RTX 6000 Ada 48GB أو 2x RTX 4090)";
  } else if (totalVramGB <= 80) {
    recommendation = "بطاقة ذكاء اصطناعي فائقة (1x NVIDIA H100 80GB أو A100 80GB)";
  } else if (totalVramGB <= 320) {
    const cards = Math.ceil(totalVramGB / 80);
    recommendation = `سيرفر متعدد البطاقات (${cards}x NVIDIA H100 80GB NVLink Node)`;
  } else {
    const cards = Math.ceil(totalVramGB / 80);
    recommendation = `عنقود حوسبة فائق (${cards}x NVIDIA H100 موزعة عبر NVLink و InfiniBand)`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0E0E14] border border-white/[0.08] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#121218] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                حاسبة ميزانية الـ VRAM والعتاد للنماذج اللغوية (LLM Memory Budgeter)
              </h3>
              <p className="text-[11px] text-slate-400">
                نمذجة دقيقة لحجم الأوزان، حالات AdamW، الـ KV Cache، وتنشيطات الطبقات
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

        {/* Body */}
        <div className="p-5 space-y-5 bg-[#0A0A0C]">
          {/* Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Parameters */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>حجم النموذج (مليارات المعلمات - Billion Params):</span>
                <span className="font-mono text-cyan-400 font-bold">{paramsBillion}B</span>
              </label>
              <div className="flex items-center gap-2">
                {[7, 8, 14, 70, 405].map(val => (
                  <button
                    key={val}
                    onClick={() => setParamsBillion(val)}
                    className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
                      paramsBillion === val
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500 font-bold shadow-sm'
                        : 'bg-[#121218] text-slate-400 border-white/[0.08] hover:border-white/[0.14]'
                    }`}
                  >
                    {val}B
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="1"
                max="405"
                step="1"
                value={paramsBillion}
                onChange={(e) => setParamsBillion(Number(e.target.value))}
                className="w-full accent-cyan-500 mt-1"
              />
            </div>

            {/* Precision */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                دقة الحوسبة والتكميم (Quantization):
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'fp16', label: 'BF16 / FP16', desc: '16-بت (2 بايت)' },
                  { id: 'fp8', label: 'FP8 (E4M3)', desc: '8-بت (1 بايت)' },
                  { id: 'int4', label: 'INT4 (AWQ)', desc: '4-بت (0.5 بايت)' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPrecision(p.id as any)}
                    className={`p-2 rounded-lg text-right border transition-all ${
                      precision === p.id
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-sm'
                        : 'bg-[#121218] border-white/[0.08] text-slate-400 hover:border-white/[0.14]'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">{p.label}</div>
                    <div className="text-[10px] text-slate-500">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                وضع التشغيل (Operation Mode):
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'inference', label: 'استنتاج (Inference)' },
                  { id: 'training_lora', label: 'ضبط LoRA' },
                  { id: 'training_full', label: 'تدريب كامل (Full)' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id as any)}
                    className={`p-2 rounded-lg text-center border text-xs font-medium transition-all ${
                      mode === m.id
                        ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 font-bold shadow-sm'
                        : 'bg-[#121218] border-white/[0.08] text-slate-400 hover:border-white/[0.14]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sequence Length */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>طول السياق (Context Length):</span>
                <span className="font-mono text-cyan-400 font-bold">{seqLen} توكن</span>
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[2048, 4096, 8192, 32768, 131072].map(s => (
                  <button
                    key={s}
                    onClick={() => setSeqLen(s)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all ${
                      seqLen === s
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500 font-bold shadow-sm'
                        : 'bg-[#121218] text-slate-400 border-white/[0.08] hover:border-white/[0.14]'
                    }`}
                  >
                    {s >= 1000 ? `${s / 1024}k` : s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Visual Box */}
          <div className="p-4 rounded-xl bg-[#0E0E14] border border-white/[0.08] space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <span>إجمالي الذاكرة المطلوبة (Estimated Total VRAM):</span>
              </span>
              <span className="text-xl font-extrabold font-mono text-cyan-300">
                {totalVramGB.toFixed(1)} GB
              </span>
            </div>

            {/* Visual Breakdown Bar */}
            <div className="h-3 rounded-full bg-[#181822] flex overflow-hidden border border-white/[0.08]">
              <div
                style={{ width: `${Math.min(100, (weightsGB / totalVramGB) * 100)}%` }}
                className="bg-cyan-500 h-full"
                title={`أوزان النموذج: ${weightsGB.toFixed(1)} GB`}
              />
              {optGB > 0 && (
                <div
                  style={{ width: `${Math.min(100, (optGB / totalVramGB) * 100)}%` }}
                  className="bg-indigo-500 h-full"
                  title={`حالات المحسن: ${optGB.toFixed(1)} GB`}
                />
              )}
              {gradGB > 0 && (
                <div
                  style={{ width: `${Math.min(100, (gradGB / totalVramGB) * 100)}%` }}
                  className="bg-purple-500 h-full"
                  title={`التدرجات: ${gradGB.toFixed(1)} GB`}
                />
              )}
              {mode === 'inference' && (
                <div
                  style={{ width: `${Math.min(100, (kvCacheGB / totalVramGB) * 100)}%` }}
                  className="bg-amber-500 h-full"
                  title={`KV Cache: ${kvCacheGB.toFixed(1)} GB`}
                />
              )}
            </div>

            {/* Breakdown details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
                <span>الأوزان: {weightsGB.toFixed(1)} GB</span>
              </div>
              {optGB > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
                  <span>حالات المحسن: {optGB.toFixed(1)} GB</span>
                </div>
              )}
              {gradGB > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
                  <span>التدرجات: {gradGB.toFixed(1)} GB</span>
                </div>
              )}
              {mode === 'inference' && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                  <span>KV Cache: {kvCacheGB.toFixed(1)} GB</span>
                </div>
              )}
            </div>
          </div>

          {/* Hardware Recommendation Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#111117] via-[#141524] to-[#111117] border border-indigo-500/30 flex items-start gap-3 shadow-sm">
            <Server className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-indigo-200">
                العتاد الموصى به للتشغيل بأعلى كفاءة:
              </div>
              <div className="text-sm font-semibold text-white mt-0.5">
                {recommendation}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                تشمل الحسابات هامش أمان 15% لحسابات الـ Caching Allocator الخاصة بـ PyTorch ومحركات vLLM.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#121218] border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#181822] hover:bg-[#222230] text-slate-200 text-xs font-semibold transition-colors border border-white/[0.08]"
          >
            إغلاق الحاسبة
          </button>
        </div>
      </div>
    </div>
  );
};
