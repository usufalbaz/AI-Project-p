export function getLocalMentorResponse(
  query: string,
  lessonTitle?: string,
  chapterTitle?: string,
  contextCode?: string
): string {
  const cleanQuery = query.toLowerCase();

  // If asking about math / equations
  if (cleanQuery.includes("معادلة") || cleanQuery.includes("رياضي") || cleanQuery.includes("اشتقاق") || cleanQuery.includes("math")) {
    return `### 📐 التحليل والاشتقاق الرياضي المعمق (${lessonTitle || "هندسة النماذج"})

أهلاً بك يا زميلي. للإجابة على تساؤلك الرياضي حول: *"${query}"*

1. **صياغة المسألة الأساسية**:
   في قلب هذه العملية، نتعامل مع فضاء متجهات بأبعاد:
   $$\\mathbf{X} \\in \\mathbb{R}^{B \\times S \\times D}$$
   حيث:
   - $B$: حجم الدفعة (Batch Size)
   - $S$: طول السياق (Sequence Length)
   - $D$: البعد الخفي للتمثيل (Hidden Dimension / Embedding Size)

2. **الاشتقاق وتدفق التدرجات (Gradients Flow)**:
   عند تطبيق خوارزمية الانحدار التدريجي (Backpropagation through Time):
   $$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{W}} = \\sum_{t=1}^{S} \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{h}_t} \\cdot \\frac{\\partial \\mathbf{h}_t}{\\partial \\mathbf{W}}$$
   - للحفاظ على استقرار التدرجات ومنع تلاشيها (Vanishing Gradients)، يتم تطبيق تقنيات المعايرة مثل **RMSNorm** بدلاً من LayerNorm لتوفير حسابات المتوسط الحسابي.

3. **حساب التكلفة الحسابية (FLOPs)**:
   - ضرب المصفوفات $[S, D] \\times [D, D]$ يتطلب بالضبط:
     $$\\text{FLOPs} = 2 \\times S \\times D^2$$
   - في مرحلة التدريب (Forward + Backward) تتضاعف التكلفة إلى $6 \\times \\text{Params} \\times \\text{Tokens}$.

> 💡 **نصيحة هندسية**: راقب دائماً نسبة التكلفة الحسابية إلى سعة نقل الذاكرة (Arithmetic Intensity = FLOPs / Byte).`;
  }

  // If asking about LLaMA / GPT-4 / DeepSeek
  if (cleanQuery.includes("llama") || cleanQuery.includes("gpt") || cleanQuery.includes("deepseek") || cleanQuery.includes("تطبيق") || cleanQuery.includes("حديثة")) {
    return `### 🚀 التطبيق العملي في النماذج الحديثة (LLaMA 3 & DeepSeek-V3)

بخصوص تطبيق مفهوم **${lessonTitle || "هذا الدرس"}** في كبرى النماذج مفتوحة ومغلقة المصدر:

1. **في معمارية LLaMA 3 (Meta)**:
   - تستخدم Meta دمج تقنية **RoPE (Rotary Position Embeddings)** مع قاعدة تردد أساسية مرتفعة (Base Frequency = 500,000) لتوسيع نافذة السياق إلى 128k Tokens.
   - استخدام **Grouped Query Attention (GQA)** بنسبة 8:1 لتقليل حجم الـ KV Cache في الذاكرة بنسبة 87.5%، مما يتيح خدمة آلاف المستخدمين المتزامنين على شريحة H100 واحدة.

2. **في معمارية DeepSeek-V3 / DeepSeek-R1**:
   - الاعتماد على **Multi-Head Latent Attention (MLA)**: ضغط متجهات الـ Keys والـ Values إلى فضاء كامن (Low-Rank Latent Vector)، مما يقلل استهلاك الذاكرة أكثر من GQA بمراحل.
   - تطبيق خوارزميات التوجيه غير المتناظر في نماذج الخبراء (MoE) مع موازنة أحمال بدون فقدان (Auxiliary-loss-free Load Balancing).

3. **إدارة عناقيد الحوسبة الموزعة**:
   - استخدام **Megatron-LM Tensor Parallelism** عبر كابلات NVLink السريعة (900 GB/s) بالتوازي مع **Pipeline Parallelism** لتقسيم طبقات النموذج الـ 128 على مئات الكروت.`;
  }

  // If asking about Interview question
  if (cleanQuery.includes("مقابلة") || cleanQuery.includes("سؤال") || cleanQuery.includes("meta") || cleanQuery.includes("openai") || cleanQuery.includes("interview")) {
    return `### 💼 سؤال مقابلة تقنية متقدمة (Principal AI Systems Engineer)

**سؤال المقابلة (من أسئلة Meta AI و OpenAI Systems Team)**:
> *"لدينا نموذج لغوي بحجم 70 مليار معامل (70B Parameters). نريد تدريبه باستخدام محفز AdamW بدقة BF16، مع طول سياق 4096 وحجم دفعة 4. احسب بدقة كمية ذاكرة VRAM المطلوبة لكل شريحة GPU، وكيف توزعها على عنقود 8x H100 (80GB)؟"*

---

#### الإجابة النموذجية مع الحسابات:
1. **أوزان النموذج (Model Weights)**:
   - $70 \\times 10^9 \\times 2 \\text{ bytes} = 140 \\text{ GB}$.
2. **التدرجات (Gradients)**:
   - $70 \\times 10^9 \\times 2 \\text{ bytes} = 140 \\text{ GB}$.
3. **حالات المحسن (AdamW Optimizer States)**:
   - يتطلب 16 بايت لكل معامل (FP32 master weights + FP32 momentum + FP32 variance):
   - $70 \\times 10^9 \\times 16 \\text{ bytes} = 1,120 \\text{ GB}$.
4. **المجموع بدون التنشيطات**:
   - $140 + 140 + 1,120 = 1,400 \\text{ GB}$.

**الحل الهندسي**:
- لا يمكن وضع هذا على كارت واحد (80GB). الحل هو استخدام **FSDP (ZeRO-3)** لتقسيم الأوزان وحالات المحسن على 64 كارت GPU:
  $$\\frac{1,400 \\text{ GB}}{64} \\approx 21.87 \\text{ GB / GPU}$$
  مما يترك أكثر من 50GB على كل كارت لذاكرة التنشيطات (Activation Memory) وFlashAttention.`;
  }

  // Default deep technical reply
  return `### 🧠 التحليل الهندسي الشامل - منصة JINNA 5
**الموضوع:** ${lessonTitle || "هندسة النماذج اللغوية الضخمة"} (${chapterTitle || "الذكاء الاصطناعي التوليدي"})

أهلاً بك يا زميلي. إجابة على استفسارك:
*"${query}"*

1. **الأساس المعماري**:
   - في معالجة هذا المفهوم، يجب دائماً موازنة معادلة **Compute-to-Memory Ratio**. في مرحلة التدريب (Pre-training)، تكون العمليات مقيدة بقوة المعالجة (Compute-bound)، بينما في مرحلة التوليد (Inference Decoding)، تصبح مقيدة بنطاق تردد الذاكرة (Memory Bandwidth-bound).

2. **التنفيذ البرمجي الأمثل**:
   - تجنب دائماً تخصيص مصفوفات مؤقتة كبيرة في الـ VRAM داخل الـ Loop.
   - استخدم \`torch.cuda.amp.autocast(dtype=torch.bfloat16)\` لتسريع عمليات التنسورات والاستفادة من وحدات Tensor Cores.
   - عند معالجة طبقات الانتباه، احرص على تفعيل \`scaled_dot_product_attention\` التي تستدعي كيرنل FlashAttention تلقائياً.

3. **توصية عملية في مشروعك**:
   - راجع الكود البرمجي المرفق في هذا الدرس لتجربة التعديل على أبعاد التنسورات ومراقبة استهلاك الذاكرة عبر محاكي الكود المدمج.`;
}
