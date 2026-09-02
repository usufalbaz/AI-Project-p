# JINNA 5 - منصة تأهيل مهندسي وباحثي الذكاء الاصطناعي ونظم LLMs

> **تم التطوير بواسطة:** المهندس يوسف الباز (Automation Ai Yousuf Albaz)

منصة تفاعلية هندسية متقدمة لتأهيل وتدريب مهندسي وباحثي الذكاء الاصطناعي من مستوى العتاد والرياضيات حتى تدريب ونشر النماذج اللغوية الضخمة (LLMs) على بيئات الحوسبة الموزعة.

---

## 🌟 مميزات المنصة
- **10 فصول تخصصية عميقة:** من CUDA وVRAM وحتى Distillation وQuantization وDistributed Training (FSDP/Megatron-LM).
- **معمل كود تفاعلي:** تشغيل وتعديل خوارزميات PyTorch وNumPy ومحاكاة مصفوفات الانتباه وFlashAttention مباشرة في المتصفح.
- **مساعد ذكي مدعوم بـ Gemini:** يقدم شروحات معمقة، مراجعة أكواد، ونصائح مقابلات شركات الذكاء الاصطناعي الكبرى (Meta / OpenAI / DeepMind).
- **أوراق بحثية ومحاضرات مرجعية:** روابط مباشرة لـ arXiv ومستودعات GitHub ومحاضرات Stanford / MIT / Karpathy.
- **شهادة إتمام معتمدة:** تصدر باسم المتعلم وكود تحقق مشفر `JINNA5-XXXX` بعد إكمال كافة الفصول والتحديات.

---

## 🚀 كيفية تشغيل المنصة محلياً (Local Development)

```bash
# 1. تثبيت الحزم والمكتبات
npm install

# 2. إنشاء ملف المتغيرات البيئية
cp .env.example .env

# 3. تشغيل خادم التطوير
npm run dev
```

المنصة ستعمل على الرابط: `http://localhost:3000`

---

## 🔑 كيفية الحصول على مفتاح Gemini API مجاناً (Free API Key)

1. ادخل إلى منصة **Google AI Studio**:
   👉 [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. سجّل الدخول بحساب Google الخاص بك.
3. اضغط على الزر الأزرق **"Create API key"** (إنشاء مفتاح API).
4. اختر إنشاء المفتاح في مشروع جديد أو مشروع قائم (الخدمة مجانية تماماً للاستخدام العادي وتدعم أحدث نماذج Gemini مثل `gemini-2.5-flash` و `gemini-2.5-pro`).
5. انسخ المفتاح، وضعه في ملف `.env`:
   ```env
   GEMINI_API_KEY=your_copied_api_key_here
   ```

---

## 🌐 كيفية نشر المنصة لتكون متاحة للجميع (Deployment Guide)

المنصة مبنية بنظام **Full-stack (React + Express Server)** لضمان أمان مفتاح الـ API وعدم تسريبه للمتصفح. لذلك يفضل نشرها على منصات تدعم خوادم Node.js:

### الخيار 1: النشر على Render (موصى به وسهل ومجاني)
1. ادخل على [render.com](https://render.com) وسجل دخولك بحساب GitHub.
2. اضغط على **"New +"** ثم اختر **"Web Service"**.
3. اربط مستودع GitHub الخاص بـ `JINNA 5`.
4. اضبط الإعدادات التالية:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
5. في قسم **Environment Variables** (المتغيرات البيئية):
   - أضف المتغير `GEMINI_API_KEY` وقيمته مفتاحك من Google AI Studio.
6. اضغط **"Create Web Service"**. ستحصل على رابط مجاني مباشر (مثل: `https://jinna-5.onrender.com`).

### الخيار 2: النشر على Railway
1. ادخل على [railway.app](https://railway.app) وسجل دخولك بـ GitHub.
2. اضغط **New Project** -> **Deploy from GitHub repo**.
3. أضف المتغير `GEMINI_API_KEY` في تبويب **Variables**.
4. سيقوم Railway بالبناء والتشغيل تلقائياً.

---

## 👨‍💻 حقوق التطوير والملكية
- **المطور:** المهندس يوسف الباز
- **العلامة التقنية:** Automation Ai Yousuf Albaz
- **المنصة:** JINNA 5 AI Engineering Platform
