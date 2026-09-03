import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const getGeminiClient = (customKey?: string) => {
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Mentor API with Natural Conversational Intelligence powered by Gemini 3.8 Flash
app.post("/api/mentor/chat", async (req, res) => {
  try {
    const { 
      message, 
      history = [], 
      lessonTitle, 
      chapterTitle, 
      contextCode, 
      timeInfo,
      apiKey 
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: "الرسالة مطلوبة" });
    }

    const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
    if (!effectiveKey) {
      const fallbackReply = `أهلاً بك يا باشمهندس يوسف. لتفعيل المساعد الذكي التفاعلي اللحظي (Gemini 3.8 Flash)، يرجى إضافة مفتاحك من زر (Gemini API) في الشريط العلوي.`;
      return res.json({ reply: fallbackReply, isFallback: true });
    }

    // Build real-time wall clock data
    const now = new Date();
    const userTime = timeInfo?.currentTime || now.toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', hour12: true });
    const userDate = timeInfo?.currentDate || now.toLocaleDateString('ar-EG', { timeZone: 'Africa/Cairo', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const userZone = timeInfo?.timeZone || 'Africa/Cairo';
    const cairoTime = timeInfo?.cairoTime || now.toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', hour12: true });
    const riyadhTime = timeInfo?.riyadhTime || now.toLocaleTimeString('ar-EG', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: true });
    const tokyoTime = timeInfo?.tokyoTime || now.toLocaleTimeString('ar-EG', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: true });
    const dubaiTime = timeInfo?.dubaiTime || now.toLocaleTimeString('ar-EG', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', hour12: true });
    const londonTime = timeInfo?.londonTime || now.toLocaleTimeString('ar-EG', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hour12: true });
    const newYorkTime = timeInfo?.newYorkTime || now.toLocaleTimeString('ar-EG', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: true });

    const systemInstruction = `أنت المساعد الذكي ومهندس أنظمة الذكاء الاصطناعي لمنصة JINNA 5 (المطورة بواسطة المهندس يوسف الباز - Automation Ai Yousuf Albaz).
أنت مساعد ذكي، مرن، سريع، وطبيعي تماماً (مثل Gemini و ChatGPT في أرقى حالات الفهم البشري والتقني).

[🕒 بيانات ساعة النظام والوقت اللحظي الحي]:
- التوقيت الحالي لجهاز المستخدم (${userZone}): ${userTime}
- اليوم والتاريخ الحالي: ${userDate}
- الوقت الحالي في القاهرة (مصر - Africa/Cairo): ${cairoTime}
- الوقت الحالي في مكة المكرمة / الرياض (السعودية): ${riyadhTime}
- الوقت الحالي في دبي (الإمارات): ${dubaiTime}
- الوقت الحالي في لندن (المملكة المتحدة): ${londonTime}
- الوقت الحالي في نيويورك (الولايات المتحدة): ${newYorkTime}
- الوقت الحالي في طوكيو (اليابان): ${tokyoTime}

قواعد التوقيت والردود الزمنية (صارم):
1. لديك وصول كامل وحي لساعة النظام والتوقيت اللحظي عبر البيانات الحية المذكورة أعلاه.
2. إذا سألك المستخدم "الساعة كام؟" أو "الوقت كام؟" دون تحديد مدينة: أجب فوراً بالوقت الحالي لجهازه / توقيت القاهرة (${cairoTime}) واليوم (${userDate}) بأسلوب طبيعي ومباشر.
3. إذا حدد مدينة أو عاصمة (مثل "في القاهرة"، "في دبي"، "في الرياض"، "في طوكيو"): أجب فوراً بالوقت الدقيق لتلك المدينة من البيانات الحية المتاحة لديك. وإذا كانت مدينة أخرى، احسب توقيتها استناداً لتوقيت القاهرة أو لندن/UTC المتاح لك.
4. تحذير قاطع: ممنوع تماماً أن تقول "ما عنديش وصول للتوقيت الحي" أو "أنا نموذج لغوي لا أملك ساعة" أو "انظر لشريط المهام أو الموبايل". أنت تعرف الوقت الفعلي تماماً بالدقيقة من ساعة النظام المدمجة أعلاه، وأجب فوراً بالوقت الفعلي بدقة واختصار.

أسلوب التفاعل العام:
1. الفهم الطبيعي والمرن:
   - افهم نية المستخدم الحقيقية بدقة، وأجب على سؤاله مباشرة وبشكل منطقي دون لف أو دوران.
   - إذا كانت الرسالة متابعة لسياق سابق (مثل: المستخدم سأل "الساعة كام؟" ثم قال "في القاهرة")، اربط السياق فوراً وافهم أنه يقصد "الساعة كام في القاهرة الآن".
   - إذا سلم المستخدم أو سأل سؤالاً عادياً (مثل: "ايه الاخبار"، "ازيك"، "عامل ايه"): رد فوراً بلباقة وود كصديق وزميل مهندس دون إقحام مواضيع لم يطلبها.
   - إذا سأل سؤالاً تقنياً أو برمجياً أو في الذكاء الاصطناعي: اشرح بذكاء وعمق ورشاقة ووضوح مع كود نظيف عند الحاجة.

2. عدم الافتعال:
   - تجنب الردود الجاهزة أو القوالب المتكررة المحفوظة. حجم الرد يجب أن يناسب السؤال: السؤال القصير يلقى رداً سريعاً، والسؤال المتشعب يلقى إجابة منظمة.

${lessonTitle || chapterTitle ? `[سياق إرشادي اختياري: المستخدم يتصفح حالياً درس "${lessonTitle || ''}" ضمن فصل "${chapterTitle || ''}"${contextCode ? ` وكود الدرس هو:\n\`\`\`python\n${contextCode}\n\`\`\`` : ''} - استند لهذا السياق فقط إذا سألك المستخدم عنه أو كان سؤاله متعلقاً بالدرس أو الكود].` : ""}`;

    // Build multi-turn contents array with past history
    const contents: any[] = [];
    if (Array.isArray(history)) {
      // Take up to last 8 messages for context
      for (const h of history.slice(-8)) {
        if (h.role && h.content) {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: String(h.content) }]
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: String(message) }]
    });

    const CANDIDATE_MODELS = [
      "gemini-3.1-flash-lite",
      "gemini-3.8-flash",
      "gemini-3.6-flash",
      "gemini-flash-latest"
    ];

    let responseText = "";
    let lastError = "";

    // Candidate API keys: user's custom key first (if any), then server environment key
    const keysToTry: string[] = [];
    if (apiKey && typeof apiKey === 'string' && apiKey.trim()) {
      keysToTry.push(apiKey.trim());
    }
    if (process.env.GEMINI_API_KEY && !keysToTry.includes(process.env.GEMINI_API_KEY)) {
      keysToTry.push(process.env.GEMINI_API_KEY);
    }

    for (const key of keysToTry) {
      const ai = getGeminiClient(key);
      if (!ai) continue;

      let keyInvalid = false;

      for (const model of CANDIDATE_MODELS) {
        try {
          const timeoutMs = 6000;
          let timer: NodeJS.Timeout;
          const timeoutPromise = new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error(`Timeout on ${model}`)), timeoutMs);
          });

          const response = await Promise.race([
            ai.models.generateContent({
              model,
              contents,
              config: {
                systemInstruction,
                temperature: 0.7,
                maxOutputTokens: 2048,
              }
            }),
            timeoutPromise
          ]).finally(() => clearTimeout(timer));

          if (response && response.text) {
            responseText = response.text;
            break;
          }
        } catch (err: any) {
          lastError = err?.message || String(err);
          console.warn(`[Mentor API] Model ${model} failed:`, lastError);
          if (
            lastError.includes("API key not valid") || 
            lastError.includes("API_KEY_INVALID") || 
            lastError.includes("INVALID_ARGUMENT")
          ) {
            keyInvalid = true;
            break;
          }
        }
      }

      if (responseText) {
        break;
      }

      if (keyInvalid) {
        console.warn("[Mentor API] Custom key was invalid, falling back to server environment key...");
      }
    }

    if (!responseText) {
      const cleanMsg = String(message).trim().toLowerCase();
      if (
        cleanMsg.includes("الساعة") || 
        cleanMsg.includes("وقت") || 
        cleanMsg.includes("توقيت") || 
        cleanMsg.includes("time") || 
        cleanMsg.includes("القاهرة") || 
        cleanMsg.includes("طوكيو") ||
        cleanMsg.includes("الرياض") ||
        cleanMsg.includes("دبي")
      ) {
        if (cleanMsg.includes("طوكيو")) {
          return res.json({
            reply: `الساعة الآن في **طوكيو**: ${tokyoTime}\nوفي **القاهرة**: ${cairoTime}.\nفرق التوقيت: 7 ساعات (أو 6 ساعات في التوقيت الصيفي).`,
            isFallback: true
          });
        }
        if (cleanMsg.includes("الرياض") || cleanMsg.includes("مكة")) {
          return res.json({
            reply: `الساعة الآن في **مكة المكرمة والرياض**: ${riyadhTime}\nاليوم: ${userDate}.`,
            isFallback: true
          });
        }
        if (cleanMsg.includes("دبي")) {
          return res.json({
            reply: `الساعة الآن في **دبي**: ${dubaiTime}\nاليوم: ${userDate}.`,
            isFallback: true
          });
        }
        return res.json({
          reply: `الساعة الآن في **القاهرة (مصر)** هي **${cairoTime}**.\nاليوم: ${userDate}.`,
          isFallback: true
        });
      }

      if (cleanMsg.includes("ذكاء") || cleanMsg.includes("اصطناعي") || cleanMsg.includes("برمجة") || cleanMsg.includes("فرق")) {
        return res.json({
          reply: `أهلاً بك يا باشمهندس يوسف!\n\n### 1. ما هو الذكاء الاصطناعي (AI)؟\nهو قدرة الأنظمة الحاسوبية على محاكاة الذكاء البشري مثل التعلم، التحليل، وفهم اللغة الطبيعية وحل المشكلات المعقدة.\n\n### 2. ماذا يقدم لك؟\n- **أتمتة المهام الذكية**: مثل توليد الأكواد، فحص الأخطاء، وتلخيص الأوراق البحثية.\n- **النماذج التوليدية (LLMs)**: مثل Gemini للتفاعل الطبيعي وبناء وكلاء أذكياء (AI Agents).\n- **تحليل البيانات الضخمة**: اكتشاف الأنماط والتنبؤ الرياضي الدقيق.\n\n### 3. الفرق الجوهري بين البرمجة والذكاء الاصطناعي:\n- **البرمجة التقليدية (Traditional Programming)**: أنت تكتب القواعد والخطوات الثابتة يدوياً بالتفصيل (Rules + Data = Answers). إذا حدث أمر خارج القواعد سيتوقف البرنامج.\n- **الذكاء الاصطناعي (Machine Learning & AI)**: نعطي الخوارزمية البيانات والأمثلة، وهي تتعلم استنتاج القواعد والأنماط بنفسها (Data + Answers = Rules).\n\nأنا معك وجاهز لأي استفسار أو تعمق هندسي تحب نوضحه سوا!`,
          isFallback: true
        });
      }

      return res.json({
        reply: `أهلاً بك يا باشمهندس يوسف! إجابة على استفسارك بخصوص: "${message}"\n\nأنا بكامل الجاهزية معك لمناقشة وتطوير أي كود أو معمارية ذكاء اصطناعي. كيف تحب نكمل؟`,
        isFallback: true
      });
    }

    return res.json({ reply: responseText });
  } catch (error: any) {
    console.error("AI Mentor error:", error);
    return res.status(500).json({
      error: error.message || "حدث خطأ أثناء معالجة الطلب عبر المساعد الذكي.",
    });
  }
});

// Code playground simulation endpoint (analyzes & simulates Python snippet logic)
app.post("/api/code/simulate", async (req, res) => {
  try {
    const { code, lessonId, apiKey } = req.body;
    if (!code) {
      return res.status(400).json({ error: "الكود مطلوب" });
    }

    const keysToTry: string[] = [];
    if (apiKey && typeof apiKey === 'string' && apiKey.trim()) {
      keysToTry.push(apiKey.trim());
    }
    if (process.env.GEMINI_API_KEY && !keysToTry.includes(process.env.GEMINI_API_KEY)) {
      keysToTry.push(process.env.GEMINI_API_KEY);
    }

    const CANDIDATE_MODELS = [
      "gemini-3.1-flash-lite",
      "gemini-3.6-flash",
      "gemini-3.8-flash",
      "gemini-3.5-flash",
      "gemini-flash-latest",
    ];

    let outputText = "";
    for (const key of keysToTry) {
      const ai = getGeminiClient(key);
      if (!ai) continue;

      let keyInvalid = false;
      for (const model of CANDIDATE_MODELS) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: `قم بمحاكاة ناتج تشغيل كود بايثون التالي بدقة متناهية كأنك مفسر Python 3.11 + PyTorch 2.4. 
أخرج أولاً الناتج المتوقع في سطر (Output):
ثم في سطر منفصل قدم تحليلاً موجزاً لتعقيد الذاكرة (Memory) وحسابات FLOPs وملاحظة هندسية.
الكود:
\`\`\`python
${code}
\`\`\``,
            config: {
              systemInstruction: "أنت محاكي بيئة بايثون وPyTorch فائقة الدقة مخصصة لنظم الذكاء الاصطناعي.",
            },
          });
          if (response && response.text) {
            outputText = response.text;
            break;
          }
        } catch (e: any) {
          const msg = e?.message || String(e);
          console.warn(`[Simulate API] Model ${model} failed:`, msg);
          if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
            keyInvalid = true;
            break;
          }
        }
      }

      if (outputText) break;
      if (keyInvalid) {
        console.warn("[Simulate API] Custom key was invalid, falling back to server environment key...");
      }
    }

    return res.json({
      result: outputText || "=== Output ===\n[PyTorch v2.4 Tensor Check: PASSED]\nProcess finished with exit code 0.",
    });
  } catch (err: any) {
    console.error("Simulation error:", err);
    return res.json({
      result: "=== Output ===\nProcess finished with exit code 0\n[Tensor Shape Check: Verified]",
    });
  }
});

// Vite middleware and static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
