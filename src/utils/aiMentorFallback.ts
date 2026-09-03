export function getLocalMentorResponse(
  query: string,
  lessonTitle?: string,
  chapterTitle?: string,
  _contextCode?: string
): string {
  const cleanQuery = query.toLowerCase().trim();

  // 1. Natural greetings
  if (
    cleanQuery === "ايه الاخبار" ||
    cleanQuery === "إيه الأخبار" ||
    cleanQuery === "ايه الاخبار؟" ||
    cleanQuery.includes("اخبارك") ||
    cleanQuery.includes("أخبارك") ||
    cleanQuery.includes("عامل ايه") ||
    cleanQuery.includes("كيف حالك") ||
    cleanQuery.includes("ازيك") ||
    cleanQuery.includes("مرحبا") ||
    cleanQuery.includes("مرحباً") ||
    cleanQuery.includes("سلام") ||
    cleanQuery.includes("صباح الخير") ||
    cleanQuery.includes("مساء الخير") ||
    cleanQuery.includes("hello") ||
    cleanQuery.includes("hi")
  ) {
    return `أهلاً بك يا باشمهندس! كل الأمور تسير بكفاءة وسرعة، وأنا هنا بكامل الجاهزية لمساعدتك في أي سؤال تقني أو برمجي أو دردشة عامة. إيه اللي بتفكر فيه أو شغال عليه حالياً؟`;
  }

  // 2. Time & timezone questions
  if (
    cleanQuery.includes("الساعة") || 
    cleanQuery.includes("وقت") || 
    cleanQuery.includes("توقيت") || 
    cleanQuery.includes("time") || 
    cleanQuery.includes("طوكيو") || 
    cleanQuery.includes("القاهرة") ||
    cleanQuery.includes("مصر") ||
    cleanQuery.includes("الرياض") ||
    cleanQuery.includes("دبي") ||
    cleanQuery === "في القاهرة" ||
    cleanQuery.includes("في القاهرة")
  ) {
    const now = new Date();
    const cairoTime = now.toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', hour12: true });
    const cairoDate = now.toLocaleDateString('ar-EG', { timeZone: 'Africa/Cairo', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const tokyoTime = now.toLocaleTimeString('ar-EG', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: true });
    const riyadhTime = now.toLocaleTimeString('ar-EG', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: true });
    const dubaiTime = now.toLocaleTimeString('ar-EG', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', hour12: true });

    if (cleanQuery.includes("طوكيو")) {
      return `الساعة الآن في **طوكيو**: ${tokyoTime}\nوفي **القاهرة**: ${cairoTime}.\nفرق التوقيت هو 7 ساعات (أو 6 ساعات في التوقيت الصيفي)، حيث تسبق طوكيو القاهرة دائماً.`;
    }

    if (cleanQuery.includes("الرياض") || cleanQuery.includes("مكة")) {
      return `الساعة الآن في **مكة المكرمة والرياض**: ${riyadhTime}\nاليوم: ${cairoDate}.`;
    }

    if (cleanQuery.includes("دبي")) {
      return `الساعة الآن في **دبي**: ${dubaiTime}\nاليوم: ${cairoDate}.`;
    }

    return `الساعة الآن في **القاهرة (مصر)** هي **${cairoTime}**.\nاليوم: ${cairoDate}.`;
  }

  // 3. Technical question about the current lesson if explicitly requested
  if (cleanQuery.includes("الدرس") || cleanQuery.includes("اشرح") || cleanQuery.includes("فصل")) {
    return `أهلاً بك يا زميلي. بخصوص **${lessonTitle || "الموضوع الحالي"}** (${chapterTitle || "هندسة النماذج اللغوية"}):\n\nسؤالك: *"${query}"*\n\nالهدف الأساسي هنا هو فهم كيفية تصميم وتدريب النماذج بكفاءة متوازية، مع التركيز على تقليل زمن الاستجابة (Latency) وتعظيم إنتاجية البيانات (Throughput). إذا كان لديك استفسار محدد عن سطر كود معين أو معادلة، تفضل بطرحها مباشرة وسأجيبك فوراً.`;
  }

  // 4. General fallback
  return `أهلاً بك يا باشمهندس يوسف. إجابة على استفسارك: *"${query}"*\n\nأنا معك وجاهز للإجابة بدقة وسرعة على أي تساؤل برمجي أو هندسي أو استفسار عام تفضله.`;
}

