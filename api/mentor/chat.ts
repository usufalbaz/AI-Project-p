import { GoogleGenAI, ThinkingLevel } from "@google/genai";

let geminiClient: GoogleGenAI | null = null;
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
};

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { message, lessonTitle, chapterTitle, contextCode, useThinking = true } = body;

    if (!message) {
      return res.status(400).json({ error: "الرسالة مطلوبة" });
    }

    const ai = getGeminiClient();
    const systemInstruction = `أنت "كبير مهندسي وباحثي الذكاء الاصطناعي لمنصة JINNA 5" (JINNA 5 Principal AI Systems & Research Mentor)، المنصة المتخصصة والمطورة بواسطة المهندس يوسف الباز (Automation Ai Yousuf Albaz).
أنت مرشد أكاديمي وهندسي رفيع المستوى متخصص في أبحاث الذكاء الاصطناعي وبناء وتدريب النماذج اللغوية الضخمة (LLMs) والأنظمة الموزعة فائقة الحوسبة.
السياق الحالي للطالب في منصة JINNA 5:
- الفصل: ${chapterTitle || "غير محدد"}
- الدرس الحالي: ${lessonTitle || "غير محدد"}
${contextCode ? `- الكود البرمجي المفتوح لدى الطالب حالياً:\n\`\`\`python\n${contextCode}\n\`\`\`` : ""}

إرشادات تقديم الإجابات:
1. الشرح باللغة العربية الفصحى الأكاديمية والتقنية الراقية، مع الحفاظ التام على المصطلحات التقنية العالمية بالإنجليزية (مثل: Backprop, VRAM, RoPE, KV Cache, DDP, ZeRO, FlashAttention, Tensor Parallelism).
2. فكك المعادلات الرياضية خطوة بخطوة مع توضيح أبعاد المصفوفات (Tensor Shapes) مثل (Batch, Seq_Len, Hidden_Dim).
3. عند تقديم كود، اجعله كود بايثون / PyTorch متقناً، نظيفاً، مع تعليقات تشرح كل سطر وتكاليف الذاكرة (Memory footprint) وحسابات FLOPs عند الاقتضاء.
4. اربط المفاهيم النظرية بكيفية تطبيقها في أشهر النماذج الحديثة مثل LLaMA 3 وDeepSeek وGPT-4.
5. قدم نصائح واقعية للمقابلات الهندسية المتقدمة في كبرى شركات الذكاء الاصطناعي (Meta, OpenAI, Google, Anthropic).`;

    let responseText = "";

    if (ai) {
      if (useThinking) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.1-pro-preview",
            contents: message,
            config: {
              systemInstruction,
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.HIGH,
              },
            },
          });
          responseText = response.text || "تم توليد الاستجابة بنجاح.";
        } catch (proError: any) {
          try {
            const fallbackResponse = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: message,
              config: { systemInstruction },
            });
            responseText = fallbackResponse.text || "";
          } catch (flashErr: any) {
            console.warn("Fallback model also failed");
          }
        }
      } else {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: message,
            config: { systemInstruction },
          });
          responseText = response.text || "";
        } catch (err: any) {
          console.warn("Gemini call failed:", err.message);
        }
      }
    }

    if (!responseText) {
      responseText = `**[نظام المعرفة الهندسية المدمج - JINNA 5 | المهندس يوسف الباز]**\n\n` +
        `أهلاً بك يا زميلي. بخصوص استفسارك حول **${lessonTitle || chapterTitle || "هندسة النماذج اللغوية"}**:\n\n` +
        `سؤالك: *"${message}"*\n\n` +
        `### التحليل الهندسي والنظري:\n` +
        `1. **الأساس الرياضي والحوسبي**: في أنظمة التدريب والاستدلال المتقدمة (LLMs)، يتم تمثيل المدخلات كمصفوفات أبعادها \`[Batch_Size, Seq_Len, Hidden_Dim]\`. عند معالجة هذه العمليات على مستوى عتاد الـ GPU، يتركز عنق الزجاجة (Bottleneck) في الذاكرة السريعة (SRAM vs HBM) ومعدل نقل البيانات (Memory Bandwidth).\n` +
        `2. **كفاءة الـ VRAM**: تذكر أن الذاكرة تنقسم إلى:\n` +
        `   - **أوزان النموذج (Weights)**: \`2 × النماذج في 16-bit\` أو \`0.5 × في 4-bit (AWQ / GPTQ)\`.\n` +
        `   - **حالات المحسن (Optimizer States)**: في AdamW تتطلب 8 بايت لكل معامل (fp32 master weights + momentum + variance).\n` +
        `   - **ذاكرة التنشيط (Activations & KV Cache)**: تتضاعف خطياً مع طول السياق (Sequence Length).\n` +
        `3. **نصيحة المقابلات في الشركات الكبرى**: ركز دائماً على موازنة الـ FLOPs مقابل استهلاك الذاكرة (Memory-bound vs Compute-bound operations) واستخدام تقنيات مثل FlashAttention وZeRO-3.\n\n` +
        `> 💡 **ملاحظة تفعيل المساعد الحي:** لتشغيل نماذج Gemini التوليدية المباشرة، تأكد من إضافة المتغير البيئي \`GEMINI_API_KEY\` في لوحة تحكم Vercel (Settings -> Environment Variables).`;
    }

    return res.status(200).json({ reply: responseText });
  } catch (error: any) {
    console.error("AI Mentor error:", error);
    return res.status(500).json({
      error: error.message || "حدث خطأ أثناء معالجة الطلب عبر المساعد الذكي.",
    });
  }
}
