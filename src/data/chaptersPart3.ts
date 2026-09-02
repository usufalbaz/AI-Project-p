import { Chapter } from '../types';

export const chaptersPart3: Chapter[] = [
  {
    id: 7,
    title: "ما بعد التدريب والمحاذاة (Post-Training, RLHF & DPO)",
    subtitle: "الضبط الدقيق PEFT/LoRA، التعلم التعزيزي RLHF، التحسين المباشر للتفضيل DPO، وتقييم النماذج",
    description: "النموذج الخام بعد مرحلة Pre-training هو مجرد مكمل نصوص عشوائي. هنا يتحول النموذج إلى مساعد ذكي مطيع وآمن ومحاذٍ للقيم عبر أرقى تقنيات الـ Post-Training المعتمدة في كبرى المختبرات.",
    iconName: "Sliders",
    estimatedHours: 18,
    badge: "Post-Training & Alignment Specialist",
    lessons: [
      {
        id: "7-1",
        title: "من RLHF و PPO إلى التحسين المباشر للتفضيل (Direct Preference Optimization - DPO)",
        subtitle: "كيف تم الاستغناء عن نموذج المكافأة المنفصل وتدريب النموذج مباشرة عبر أزواج التفضيل",
        duration: "60 دقيقة",
        readTime: "22 دقيقة",
        sections: [
          {
            id: "7-1-1",
            title: "المشكلة في RLHF التقليدي والحل الرياضي العبقري لـ DPO",
            content: `في أسلوب RLHF الكلاسيكي (كما في InstructGPT):
1. تدريب نموذج مكافأة (Reward Model) على بيانات تقييم البشر للإجابات الفائزة ($y_w$) والخاسرة ($y_l$).
2. استخدام خوارزمية PPO (Proximal Policy Optimization) لضبط سياسة النموذج التوليدي، مع إضافة عقوبة KL-Divergence لمنع النموذج من تدمير قدراته اللغوية.

المشكلة: تدريب PPO معقد جداً، غير مستقر، ويتطلب حفظ 4 نماذج في الذاكرة في آن واحد (Actor, Critic, Reference Model, Reward Model)!\n\nجاءت ورقة DPO (جامعة ستانفورد 2023) لتبين رياضياً أن دالة الخسارة يمكن التعبير عنها مباشرة بدلالة النسبة الاحتمالية دون الحاجة لنموذج مكافأة ولا تدريب تعزيزي بالـ Reinforcement Learning!`,
            mathFormulas: [
              "\\mathcal{L}_{\\text{DPO}}(\\pi_\\theta; \\pi_{\\text{ref}}) = -\\mathbb{E}_{(x, y_w, y_l)} \\left[ \\log \\sigma \\left( \\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)} \\right) \\right]"
            ],
            takeaway: "DPO جعلت محاذاة النماذج مستقرة مثل الـ Supervised Fine-Tuning العادي، مع خفض استهلاك الـ VRAM بأكثر من النصف."
          }
        ],
        pythonCode: {
          title: "بناء دالة خسارة DPO كاملة بلغة PyTorch",
          filename: "dpo_loss_function.py",
          explanation: "تنفيذ دقيق لدالة خسارة DPO مع حساب اللوغاريتمات النسبية وحساب نسبة احتمالية الاستجابة المفضلة $y_w$ مقارنة بالمرفوضة $y_l$.",
          code: `import torch
import torch.nn as nn
import torch.nn.functional as F

def compute_dpo_loss(
    policy_chosen_logps,
    policy_rejected_logps,
    reference_chosen_logps,
    reference_rejected_logps,
    beta=0.1
):
    """
    حساب خسارة DPO:
    beta: معامل التحكم في قوة عقوبة KL مع النموذج المرجعي
    """
    # 1. حساب لوغاريتم النسبة الاحتمالية للاختيار المفضل
    pi_logratios = policy_chosen_logps - policy_rejected_logps
    ref_logratios = reference_chosen_logps - reference_rejected_logps
    
    # 2. اللوغاريتم الفارق الموزون بـ beta
    logits = beta * (pi_logratios - ref_logratios)
    
    # 3. خسارة DPO = -log(sigmoid(logits))
    losses = -F.logsigmoid(logits)
    
    # حساب المكافآت الضمنية (Implicit Rewards) لمتابعة سير التدريب
    chosen_rewards = beta * (policy_chosen_logps - reference_chosen_logps).detach()
    rejected_rewards = beta * (policy_rejected_logps - reference_rejected_logps).detach()
    
    return losses.mean(), chosen_rewards.mean(), rejected_rewards.mean()

# تجربة محاكاة بيانات
batch_size = 4
policy_chosen = torch.tensor([-1.2, -0.8, -1.5, -0.9])
policy_rejected = torch.tensor([-2.5, -2.1, -2.8, -2.0])
ref_chosen = torch.tensor([-1.3, -0.9, -1.6, -1.0])
ref_rejected = torch.tensor([-2.2, -1.8, -2.5, -1.7])

loss, r_chosen, r_rejected = compute_dpo_loss(
    policy_chosen, policy_rejected, ref_chosen, ref_rejected, beta=0.1
)

print(f"قيمة خسارة DPO المحسوبة: {loss.item():.4f}")
print(f"متوسط مكافأة الإجابات المفضلة: {r_chosen.item():.4f}")
print(f"متوسط مكافأة الإجابات المرفوضة: {r_rejected.item():.4f}")`
        },
        videoResources: [
          {
            title: "Direct Preference Optimization: Your Language Model is Secretly a Reward Model",
            instructor: "Rafael Rafailov (Stanford University)",
            duration: "42 دقيقة",
            videoUrl: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
            embedId: "kCc8FmEb1nY",
            platform: "Conference",
            summary: "المؤلف الرئيسي لورقة DPO يشرح الاشتقاق الرياضي الكامل من صياغة مشكلة Bradley-Terry إلى صياغة الخسارة المبسطة.",
            keyTakeaways: [
              "كيف تستبدل خطوة تدريب نموذج المكافأة بالكامل",
              "أهمية ضبط المعامل التجريبي beta لمنع انهيار النموذج"
            ]
          }
        ],
        referencePapers: [
          {
            title: "Direct Preference Optimization: Your Language Model is Secretly a Reward Model",
            authors: "Rafael Rafailov et al. (Stanford)",
            year: 2023,
            arxivUrl: "https://arxiv.org/abs/2305.18290",
            badge: "Best Paper Runner-up (NeurIPS)",
            citation: "The groundbreaking paper introducing Direct Preference Optimization."
          }
        ],
        practicalExercise: {
          prompt: "ماذا يحدث لقيمة خسارة DPO عندما تكون نسبة تفضيل النموذج لـ y_w أعلى بكثير من النموذج المرجعي مقارنة بـ y_l؟",
          initialCode: `# اختبر تأثير زيادة logits على خسارة DPO
import torch
import torch.nn.functional as F

logits = torch.tensor([10.0, 20.0]) # إشارة قوية جداً لصالح chosen
loss = -F.logsigmoid(logits)
print("الخسارة:", loss.mean().item())`,
          expectedOutputHint: "تقترب الخسارة من الصفر تماماً لأن sigmoid(10) تقترب من 1.0 و log(1.0) = 0.",
          solutionCode: `import torch
import torch.nn.functional as F
logits = torch.tensor([10.0, 20.0])
loss = -F.logsigmoid(logits)
print(f"الخسارة عند التفوق الواضح: {loss.mean().item():.6f}")`
        },
        interviewTips: [
          "في مقابلة OpenAI لفرق Alignment: 'ما هي ثغرة DPO مقارنة بـ PPO؟' الإجابة الذكية: DPO مقيد ببيانات التفضيل الثابتة (Off-policy)، ولا يستطيع توليد عينات جديدة واستكشاف الفضاء التوليدي بنمط On-policy كما يفعل PPO، ولهذا ظهرت أبحاث مثل Online DPO و RLoo."
        ]
      }
    ],
    quiz: [
      {
        id: "q7-1",
        question: "ما المعامل الحرج في دالة خسارة DPO الذي يتحكم في مدى التزام النموذج بالمخرج المرجعي (KL penalty constraint)؟",
        options: [
          "معامل التعلم Learning Rate فقط",
          "المعامل بيتا Beta (المعامل التنظيمي لقوة الـ KL Penalty)",
          "حجم الدفعة Batch Size",
          "طول السياق Sequence Length"
        ],
        correctIndex: 1,
        explanation: "المعامل بيتا (Beta) يتحكم في التوازن بين تحسين التفضيل وبين الحفاظ على تشابه النموذج مع السياسة المرجعية لتفادي التراجع اللغوي.",
        difficulty: "Medium"
      }
    ]
  },
  {
    id: 8,
    title: "تحسين الاستنتاج ومحركات التشغيل (Inference Engines: vLLM & PagedAttention)",
    subtitle: "نظام vLLM، خوارزمية PagedAttention، التكميم AWQ و GPTQ، وفك التشفير التخميني Speculative Decoding",
    description: "تدريب النموذج يستهلك الملايين، لكن تشغيله في بيئة الإنتاج يستهلك المليارات. ستتعلم هنا كيف تضاعف سرعة الاستنتاج 5x إلى 10x عبر إدارة الذاكرة الظاهرية والتكميم والـ Batching الحركي.",
    iconName: "Zap",
    estimatedHours: 18,
    badge: "Inference Performance Engineer",
    lessons: [
      {
        id: "8-1",
        title: "كيف حلت خوارزمية PagedAttention مشكلة تفتت الذاكرة (Memory Fragmentation)",
        subtitle: "استلهام تقنيات الذاكرة الظاهرية (Virtual Memory & Paging) في أنظمة التشغيل وحفظ الـ KV Cache في كتل غير متصلة",
        duration: "60 دقيقة",
        readTime: "24 دقيقة",
        sections: [
          {
            id: "8-1-1",
            title: "أزمة الـ KV Cache الكلاسيكية قبل ابتكار vLLM",
            content: `في أنظمة الاستنتاج السابقة، كان حجز الـ KV Cache يتطلب ذاكرة متصلة مسبقاً (Contiguous Pre-allocation) للحد الأقصى الممكن للطلب (مثلاً 4096 توكن). إذا طلب المستخدم إجابة من 50 توكن فقط، يتم إهدار أكثر من 90% من الـ VRAM المحجوزة! كما أن تفتت الذاكرة (Internal & External Fragmentation) كان يمنع تشغيل أكثر من طلبات قليلة متزامنة.\n\nابتكر باحثو جامعة بيركلي (vLLM) خوارزمية PagedAttention المستوحاة من صفحات الذاكرة الظاهرية لأنظمة التشغيل (OS Paging): يتم تقسيم الـ KV Cache إلى كتل صغيرة (Logical Blocks - مثلاً 16 توكن لكل كتلة)، ويتم تخزينها في أي مكان متاح في الـ VRAM (Physical Blocks)، مع جدول خرائط كتل (Block Table) يربط الكتل المنطقية بالفيزيائية.`,
            takeaway: "خوارزمية PagedAttention قللت إهدار ذاكرة الـ KV Cache من 60-80% إلى أقل من 4%، مما ضاعف إنتاجية النظام (Throughput) بمقدار 2x إلى 4x فوراً."
          }
        ],
        pythonCode: {
          title: "محاكاة جدول كتل الـ KV Cache في PagedAttention",
          filename: "paged_attention_simulator.py",
          explanation: "كود بايثون يوضح كيف يعمل جدول التعيين (Block Table) وتخصيص الكتل الحركي وتشارك الكتل عبر تقنية Copy-on-Write في الـ Parallel Sampling.",
          code: `class PagedAttentionBlockManager:
    def __init__(self, block_size=16, total_gpu_blocks=64):
        self.block_size = block_size
        self.total_blocks = total_gpu_blocks
        self.free_blocks = list(range(total_gpu_blocks))
        self.block_tables = {} # req_id -> list of physical_block_ids
        print(f"تم تهيئة PagedAttention: {total_gpu_blocks} كتلة فيزيائية (كل كتلة {block_size} توكن).")

    def allocate(self, req_id, num_tokens):
        num_blocks = (num_tokens + self.block_size - 1) // self.block_size
        if len(self.free_blocks) < num_blocks:
            raise MemoryError("نفاد كتل الـ VRAM الفيزيائية!")
        
        assigned = [self.free_blocks.pop(0) for _ in range(num_blocks)]
        self.block_tables[req_id] = assigned
        return assigned

    def append_token(self, req_id, current_token_count):
        # فحص هل نحتاج تخصيص كتلة جديدة
        if current_token_count % self.block_size == 0:
            if not self.free_blocks:
                raise MemoryError("نفاد الذاكرة أثناء توليد التوكن الجديد!")
            new_block = self.free_blocks.pop(0)
            self.block_tables[req_id].append(new_block)
            print(f"[طلب {req_id}] تم تخصيص كتلة فيزيائية جديدة رقم: {new_block}")

    def free(self, req_id):
        if req_id in self.block_tables:
            freed = self.block_tables.pop(req_id)
            self.free_blocks.extend(freed)
            print(f"[طلب {req_id}] انتهى التوليد وتم تحرير {len(freed)} كتلة بنجاح.")

# تجربة عملية
mgr = PagedAttentionBlockManager(block_size=16, total_gpu_blocks=10)
# بدء طلب بـ 25 توكن
blocks_assigned = mgr.allocate("req_101", 25)
print(f"الكتل المخصصة لطلب req_101: {blocks_assigned}")
print(f"الكتل الحرة المتبقية في VRAM: {len(mgr.free_blocks)}")

# توليد 8 توكنات إضافية (تتجاوز الكتلة الحالية)
mgr.append_token("req_101", 32)
mgr.free("req_101")
print(f"الكتل الحرة بعد الانتهاء: {len(mgr.free_blocks)}")`
        },
        videoResources: [
          {
            title: "vLLM: Easy, Fast, and Cheap LLM Serving with PagedAttention",
            instructor: "Woosuk Kwon (UC Berkeley)",
            duration: "35 دقيقة",
            videoUrl: "https://www.youtube.com/watch?v=5ZlavKF_98U",
            embedId: "5ZlavKF_98U",
            platform: "Conference",
            summary: "العرض التقديمي الرسمي في مؤتمر SOSP 2023 لشرح خوارزمية PagedAttention ونظام vLLM المفتوح المصدر.",
            keyTakeaways: [
              "كيف تمنع PagedAttention ضياع الذاكرة وتتيح مشاركة الذاكرة في Beam Search",
              "استراتيجية Continuous Batching ومعالجة الطلبات غير المتساوية في الطول"
            ]
          }
        ],
        referencePapers: [
          {
            title: "Efficient Memory Management for Large Language Model Serving with PagedAttention",
            authors: "Woosuk Kwon et al. (UC Berkeley)",
            year: 2023,
            arxivUrl: "https://arxiv.org/abs/2309.06180",
            badge: "Best Paper (SOSP 2023)",
            citation: "The original paper that introduced PagedAttention and vLLM."
          }
        ],
        practicalExercise: {
          prompt: "في نظام تقليدي بدون PagedAttention، إذا كان الحد الأقصى للسياق 4096 توكن، لكن متوسط أطوال الاستعلامات هو 512 توكن، كم نسبة الذاكرة المهدورة؟",
          initialCode: `max_len = 4096
avg_len = 512
# احسب نسبة الإهدار
waste_percent = ((max_len - avg_len) / max_len) * 100
print(f"نسبة الإهدار: {waste_percent:.2f}%")`,
          expectedOutputHint: "نسبة الإهدار تصل إلى 87.5% في النظام التقليدي!",
          solutionCode: `max_len = 4096
avg_len = 512
waste_percent = ((max_len - avg_len) / max_len) * 100
print(f"نسبة الإهدار في الأنظمة التقليدية: {waste_percent:.2f}%")`
        },
        interviewTips: [
          "في مقابلة Groq / NVIDIA / Anyscale: 'ما هو الفرق بين Prefill Phase و Decode Phase في استنتاج المحولات؟' الإجابة الحاسمة: Prefill مرحلة Compute-bound تحسب كل توكنات المدخلات بالتوازي، بينما Decode مرحلة Memory-bound تولد توكناً واحداً في كل خطوة وتعتمد سرعتها على سرعة قراءة الـ KV Cache من HBM."
        ]
      }
    ],
    quiz: [
      {
        id: "q8-1",
        question: "لماذا تعد مرحلة توليد التوكنات (Decode Phase) في المحولات مقيدة بالذاكرة (Memory-Bound) وليست مقيدة بالحوسبة؟",
        options: [
          "لأن معالجات الـ GPU لا تدعم حسابات الجمع",
          "لأننا نحتاج لقراءة جميع أوزان النموذج وذاكرة الـ KV Cache السابقة من الـ HBM لتوليد توكن واحد فقط في كل خطوة",
          "لأن خوارزمية Softmax بطيئة في الـ CPU",
          "لأن نماذج الذكاء الاصطناعي لا تستخدم الـ Caching"
        ],
        correctIndex: 1,
        explanation: "في كل خطوة توليد (Decode Step)، نقوم بتحميل مليارات معلمات النموذج والـ KV Cache عبر ناقل الذاكرة فقط لتنفيذ عملية ضرب متجه في مصفوفة (GEMV)، مما يجعل معدل نقل الذاكرة (Memory Bandwidth) هو عنق الزجاجة الرئيسي.",
        difficulty: "Hard"
      }
    ]
  },
  {
    id: 9,
    title: "الوكلاء الأذكياء والأنظمة متعددة الوسائط (AI Agents & Advanced RAG)",
    subtitle: "بروتوكول استدعاء الأدوات Tool Calling، دورات التفكير والتنفيذ ReAct، تقنيات RAG المتقدمة، و Vision-Language Projectors",
    description: "النماذج اللغوية لم تعد مجرد روبوتات محادثة، بل عقول رقمية قادرة على التخطيط، واستدعاء واجهات البرمجة (APIs)، واسترجاع المعرفة المحدثة، ورؤية الصور والفيديوهات.",
    iconName: "Bot",
    estimatedHours: 16,
    badge: "Agent & Multimodal Systems Lead",
    lessons: [
      {
        id: "9-1",
        title: "هندسة الوكلاء الذاتيين: دورات ReAct، استدعاء الأدوات و بروتوكول MCP",
        subtitle: "كيف يحلل النموذج المشكلات المعقدة، ويولد استدعاءات الدوال المهيكلة JSON، ويصحح أخطاءه ذاتياً",
        duration: "65 دقيقة",
        readTime: "22 دقيقة",
        sections: [
          {
            id: "9-1-1",
            title: "نمط التفكير والعمل (ReAct: Reason + Act)",
            content: `في أبحاث الوكلاء الأذكياء (ورقة ReAct، برينستون وجوجل 2022)، وجد الباحثون أن فصل مسار التفكير (Thought) عن مسار الإجراء (Action) يقلل من الهلوسة بنسبة تفوق 40%. يتبع الوكيل حلقة متكررة:\n1. التفكير (Thought): يحلل الوكيل حالته الحالية وما ينقصه من معلومات.\n2. الإجراء (Action): يستدعي أداة محددة مثل البحث في قاعدة البيانات أو تشغيل كود بايثون.\n3. الملاحظة (Observation): يتلقى مخرجات الأداة.\n4. التكرار أو الإجابة النهائية (Final Answer).`,
            takeaway: "الوكيل الحقيقي ليس مجرد استدعاء API، بل هو نظام حالة متصل ببيئة تفاعلية مع آليات إعادة المحاولة (Retry) والتحقق من صحة المخرجات."
          }
        ],
        pythonCode: {
          title: "بناء وكيل ذكي كامل مع نظام استدعاء الأدوات Tool Dispatcher",
          filename: "react_agent_executor.py",
          explanation: "كود بايثون نقي يبني حلقة وكيل ذكي ReAct يقوم باختيار الأدوات وتمرير المتغيرات ومعالجة الملاحظات تلقائياً.",
          code: `import json

class SimpleAgent:
    def __init__(self):
        self.tools = {
            "query_vram_db": self.query_vram_db,
            "calculate_flops": self.calculate_flops
        }

    def query_vram_db(self, gpu_name):
        db = {"H100": "80GB HBM3 (3.35 TB/s)", "A100": "80GB HBM2e (2.0 TB/s)", "RTX4090": "24GB GDDR6X"}
        return db.get(gpu_name, "معالج غير معروف")

    def calculate_flops(self, params_b, tokens_b):
        # تقريب 6 * P * D لحساب الـ FLOPs للتدريب
        p = float(params_b) * 1e9
        d = float(tokens_b) * 1e9
        flops = 6 * p * d
        return f"{flops / 1e21:.2f} ZettaFLOPs"

    def step(self, user_query):
        print(f"استعلام المستخدم: {user_query}")
        # محاكاة اختيار الوكيل للأداة المناسبة
        if "H100" in user_query:
            tool_name = "query_vram_db"
            args = {"gpu_name": "H100"}
        else:
            tool_name = "calculate_flops"
            args = {"params_b": 70, "tokens_b": 2000}
            
        print(f"[Thought]: أحتاج لاستدعاء أداة {tool_name} بالمدخلات {args}")
        # تنفيذ الأداة
        result = self.tools[tool_name](**args)
        print(f"[Observation]: نتيجة استدعاء الأداة: {result}")
        print(f"[Final Answer]: بناءً على الأداة، الإجابة هي: {result}")

agent = SimpleAgent()
agent.step("ما هي مواصفات ذاكرة بطاقة H100؟")`
        },
        videoResources: [
          {
            title: "Building LLM Agents from Scratch",
            instructor: "Harrison Chase (LangChain)",
            duration: "45 دقيقة",
            videoUrl: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
            embedId: "kCc8FmEb1nY",
            platform: "Conference",
            summary: "شرح شامل لهندسة الوكلاء الذاتية والتعامل مع استدعاء الأدوات والتنسيق متعدد الوكلاء (Multi-Agent Workflows).",
            keyTakeaways: [
              "الفرق بين التوجيه الخطي والحلقات المستقلة",
              "إدارة سياق الذاكرة طويلة المدى للوكلاء"
            ]
          }
        ],
        referencePapers: [
          {
            title: "ReAct: Synergizing Reasoning and Acting in Language Models",
            authors: "Shunyu Yao et al. (Princeton & Google)",
            year: 2022,
            arxivUrl: "https://arxiv.org/abs/2210.03629",
            badge: "Pioneering Agent Paper",
            citation: "The seminal paper demonstrating combining reasoning traces with task-specific actions."
          }
        ],
        practicalExercise: {
          prompt: "صمم مخطط JSON Schema صالح لتعريف أداة (Tool Definition) تستقبل اسم النموذج اللغوي وترجع حجم الـ VRAM المطلوب.",
          initialCode: `tool_schema = {
    "name": "get_model_vram",
    "description": "تسترجع حجم الذاكرة المطلوب لنموذج لغوي محدد",
    "parameters": {
        "type": "object",
        # أكمل الحقول المطلوبة وخصائص المعاملات
    }
}`,
          expectedOutputHint: "تأكد من وجود 'properties' و 'required'.",
          solutionCode: `tool_schema = {
    "name": "get_model_vram",
    "description": "تسترجع حجم الذاكرة المطلوب لنموذج لغوي محدد",
    "parameters": {
        "type": "object",
        "properties": {
            "model_name": {"type": "string", "description": "اسم النموذج مثل LLaMA-3-70B"}
        },
        "required": ["model_name"]
    }
}`
        },
        interviewTips: [
          "في مقابلة AI Platform Engineer: 'كيف تضمن عدم وقوع الوكيل في حلقة تكرار لانهائية (Infinite Loop) عند استدعاء الأدوات؟' الإجابة: تحديد سقف أقصى للخطوات (Max Iteration Guardrail)، تتبع بصمة الإجراءات السابقة لمنع تكرار نفس المعاملات، واستخدام آلية Fallback للإجابة البشرية."
        ]
      }
    ],
    quiz: [
      {
        id: "q9-1",
        question: "ما هو المبدأ الرئيسي لنمط ReAct مقارنة بنمط Chain-of-Thought (CoT) البسيط؟",
        options: [
          "ReAct يلغي الحاجة لاستخدام نماذج المحولات",
          "ReAct يدمج التفكير الذاتي الداخلي مع القدرة على تنفيذ إجراءات خارجية والتفاعل مع بيئة حقيقية",
          "ReAct يعمل فقط مع النماذج الصوتية",
          "ReAct يسرع عملية التوليد بمقدار 100 ضعف"
        ],
        correctIndex: 1,
        explanation: "نمط ReAct يجمع بين مسارات الاستدلال (Reasoning traces) وبين الإجراءات التفاعلية (Actions) مع البيئات الخارجية مثل محركات البحث وقواعد البيانات وواجهات البرمجة.",
        difficulty: "Medium"
      }
    ]
  },
  {
    id: 10,
    title: "مشاريع التخرج والتحضير لمقابلات كبرى شركات الذكاء الاصطناعي (Meta & OpenAI Prep)",
    subtitle: "تدريب نموذج GPT كامل، نشره على Hugging Face، ودليل المقابلات التقنية لمهندسي وباحثي الذكاء الاصطناعي",
    description: "المحطة الختامية للتحول إلى مهندس وباحث ذكاء اصطناعي من الطراز الأول. سنبني هنا مشروع تخرج متكامل، ونجهز Portfolio احترافي، ونستعرض أصعب أسئلة المقابلات في Meta وOpenAI.",
    iconName: "Award",
    estimatedHours: 25,
    badge: "Principal AI Engineer Graduate",
    lessons: [
      {
        id: "10-1",
        title: "مشروع التخرج الشامل: تدريب ونشر نموذج لغوي متكامل على Hugging Face Hub",
        subtitle: "من تهيئة المعمارية وتدريب التوكنات، إلى التدريب الفعلي ورفع الأوزان وكتابة Model Card علمي رصين",
        duration: "80 دقيقة",
        readTime: "30 دقيقة",
        sections: [
          {
            id: "10-1-1",
            title: "معايير الـ Portfolio المتميز لباحثي ومهندسي النظم",
            content: `لا تبحث شركات الذكاء الاصطناعي العالمية عن من يعرف استخدام واجهات برمجة جاهزة (API Callers)، بل يبحثون عن مهندسين وباحثين يفهمون ما يحدث داخل الـ Kernel والذاكرة:\n\n1. مشروع إعادة بناء معمارية حديثة (Cleanroom Implementation): بناء معمارية LLaMA أو Mistral أو FlashAttention من الصفر بـ PyTorch ومقارنة النتائج بنسخة Hugging Face الرسمية.\n2. مشروع تحسين استنتاج عالي الأداء (High-Performance Serving): كتابة خادم استنتاج يدعم Continuous Batching وتكميم INT4/FP8 مع قياسات دقيقة لـ TTFT (Time-to-First-Token) و Inter-Token Latency.\n3. أوراق بحثية ومدونات تقنية دقيقة: كتابة تحليلات رياضية وهندسية مفصلة مع رسوم بيانية توضح مسارات التدرجات والـ VRAM Profile.`,
            takeaway: "الـ Codebase النظيف الموثق باختبارات Unit Tests وقياسات الأداء الحقيقية هو بطاقة عبورك الأقوى لمقابلات Meta وGoogle DeepMind وOpenAI."
          }
        ],
        pythonCode: {
          title: "كود رفع نموذج وبطاقة النموذج المكتملة إلى Hugging Face Hub",
          filename: "push_to_hf_hub.py",
          explanation: "سكربت بايثون لتصدير أوزان النموذج والـ Tokenizer وتوليد بطاقة نموذج (Model Card) متوافقة مع المعايير القياسية.",
          code: `import os

def create_model_card_markdown():
    return """---
language:
- ar
- en
license: apache-2.0
tags:
- transformer
- research-engineering
- pytorch
---

# نموذج الأنظمة اللغوية المصغر (AI Systems Mini-LLM)

تم بناء وتدريب هذا النموذج من الصفر كجزء من مسار أبحاث ونظم الذكاء الاصطناعي المتقدمة.

## المواصفات المعمارية:
- **المعمارية**: Decoder-only Transformer مع RMSNorm و SwiGLU
- **التشفير الموضعي**: Rotary Positional Embedding (RoPE)
- **آلية الانتباه**: Grouped-Query Attention (GQA)
- **حجم المفردات**: 32,000 توكن مدرب بنظام Byte-level BPE
- **طول السياق المدعوم**: 4,096 توكن

## الاستخدام البرمجي:
\`\`\`python
from transformers import AutoModelForCausalLM, AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("username/ai-systems-mini-llm")
model = AutoModelForCausalLM.from_pretrained("username/ai-systems-mini-llm")
\`\`\`
"""

print("تم تجهيز بطاقة النموذج القياسية (Model Card):")
print(create_model_card_markdown()[:300] + "... [بقية البطاقة]")`
        },
        videoResources: [
          {
            title: "How to Ace the AI Systems & Machine Learning Engineering Interview",
            instructor: "Chip Huyen (Author of Designing Machine Learning Systems)",
            duration: "55 دقيقة",
            videoUrl: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
            embedId: "kCc8FmEb1nY",
            platform: "YouTube",
            summary: "دليل شامل لاجتياز مقابلات هندسة وتصميم أنظمة الذكاء الاصطناعي في الشركات الكبرى.",
            keyTakeaways: [
              "هيكلة إجابات أسئلة تصميم الأنظمة (System Design for ML)",
              "كيف تجيب على أسئلة مقايضة الذاكرة بالحوسبة بثقة واحترافية"
            ]
          }
        ],
        referencePapers: [
          {
            title: "The Llama 3 Herd of Models",
            authors: "Meta AI LLaMA Team",
            year: 2024,
            arxivUrl: "https://arxiv.org/abs/2407.21783",
            badge: "Modern Benchmark",
            citation: "The comprehensive engineering and research report for training LLaMA 3 on 16K GPUs."
          }
        ],
        practicalExercise: {
          prompt: "اكتب الإطار المنهجي (Framework) المكون من 5 خطوات للإجابة على سؤال 'صمم نظام تدريب وتوزيع نموذج لغوي ضخم 70B' في مقابلة System Design.",
          initialCode: `# اكتب الخطوات الخمس الرئيسية لإجابة سؤال تصميم الأنظمة
steps = [
    # 1. توضيح المتطلبات والقيود (Requirements & Constraints)
    # 2. ...
]`,
          expectedOutputHint: "1. المتطلبات وحجم البيانات، 2. ميزانية الحوسبة والـ VRAM، 3. استراتيجية الموازاة (TP/PP/DP)، 4. خط أنابيب البيانات والتحقق، 5. معالجة الأعطال (Fault Tolerance & Checkpointing).",
          solutionCode: `steps = [
    "1. توضيح المتطلبات والقيود وحساب ميزانية الـ FLOPs والـ VRAM",
    "2. اختيار المعمارية (GQA, RoPE, RMSNorm) وحجم المعجم",
    "3. استراتيجية التوزيع الهجين (3D Parallelism: TP=8, PP=4, DP=8)",
    "4. شبكة الربط والاتصالات (InfiniBand, NCCL Overlap)",
    "5. استراتيجية المراقبة وحفظ الحالات المرجعية (Checkpointing & Fault Tolerance)"
]
for s in steps:
    print(s)`
        },
        interviewTips: [
          "في المقابلة النهائية في Meta / OpenAI: لا تبدأ أبداً بكتابة الحل فوراً؛ ابدأ بحساب الأرقام التقريبية أولاً (Back-of-the-envelope calculations): كم بايت في الذاكرة؟ كم فلوبس؟ كم عقدة حوسبة نحتاج؟ هذا هو ما يميز كبار المهندسين."
        ]
      }
    ],
    quiz: [
      {
        id: "q10-1",
        question: "عند تصميم عنقود حوسبة لتدريب نموذج 405 مليار معلمة، ما هي الأولوية الهندسية الأولى لضمان عدم توقف التدريب عند تعطل إحدى بطاقات الـ GPU؟",
        options: [
          "إلغاء استخدام مسرى NVLink",
          "نظام حفظ نقاط التفتيش غير المتزامن والسريع (Asynchronous Checkpointing) مع استبدال العقد الفاشلة تلقائياً دون إعادة تشغيل العنقود بالكامل",
          "تقليل عدد طبقات النموذج إلى 4 طبقات",
          "استخدام دقة FP64 في كل الحسابات"
        ],
        correctIndex: 1,
        explanation: "عند تشغيل آلاف الـ GPUs، يكون معدل تعطل العتاد (Hardware Failure Rate) حتمياً ويحدث كل بضع ساعات. نظام Checkpointing غير المتزامن إلى جانب آليات استبدال العقد التلقائي يضمن استمرار التدريب بنسبة استغلال عالية (High MFU).",
        difficulty: "Hard"
      }
    ]
  }
];
