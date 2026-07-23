import type { FaqItem } from "@/lib/types";

export const DEMO_FAQ: FaqItem[] = [
  {
    id: "faq_pay_1",
    category: "payment",
    questionAr: "إيه أنظمة التقسيط المتاحة؟",
    answerAr:
      "حسب المشروع: مقدم من 5% إلى 20%، وأقساط من 7 إلى 10 سنوات. أهلي بارك ونخيل وست فيهم مقدم 5% demo. التفاصيل النهائية تُ confirm في العقد — البيانات هنا للتجربة فقط.",
    keywords: ["تقسيط", "مقدم", "أقساط", "دفع"],
  },
  {
    id: "faq_pay_2",
    category: "payment",
    questionAr: "هل في maintenance deposit؟",
    answerAr:
      "نعم في معظم مشاريع نخيل Demo:وديعة صيانة 8% من قيمة الوحدة تُسدد على دفعات مع الأقساط (قيمة تقريبية للعرض).",
    keywords: ["صيانة", "maintenance"],
  },
  {
    id: "faq_del_1",
    category: "delivery",
    questionAr: "امتى التسليم؟",
    answerAr:
      "أهلي بارك: منتصف 2028. مراسي الساحل: صيف 2027. نخيل هايتس: جاهز للتسليم الفوري. نخيل وست: pre-launch 2029.",
    keywords: ["تسليم", "امتى", "استلام", "delivery"],
  },
  {
    id: "faq_loc_1",
    category: "location",
    questionAr: "أهلي بارك فين بالظبط؟",
    answerAr:
      "التجمع الخامس، Cairo New Capital axis demo — 5 دقائق من الرحاب، 20 دقيقة تقريبًا من مطار العاصمة (أوقات تقريبية للعرض).",
    keywords: ["أهلي", "التجمع", "فين", "موقع"],
  },
  {
    id: "faq_gen_1",
    category: "general",
    questionAr: "ازاي أحجز معاينة؟",
    answerAr:
      "قوليلي اسمك ورقم موبايل والمشروع اللي عايزة تشوفيه وأقترح 2–3 مواعيد demo (سبت–خميس 10ص–6م). هسجل طلب lead في النظام.",
    keywords: ["معاينة", "زيارة", "موعد", "حجز"],
  },
  {
    id: "faq_gen_2",
    category: "general",
    questionAr: "الأسعار شامل التشطيب؟",
    answerAr:
      "أغلب وحدات under construction: semi-finished. نخيل هايتس الجاهز: في units fully finished بفرق سعر — اسألي عن unit محددة.",
    keywords: ["تشطيب", "أسعار", "شامل"],
  },
];

export function searchFaq(query: string, limit = 3): FaqItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return DEMO_FAQ.slice(0, limit);
  const scored = DEMO_FAQ.map((item) => {
    let score = 0;
    for (const kw of item.keywords) {
      if (q.includes(kw) || kw.includes(q)) score += 2;
    }
    if (item.questionAr.includes(query)) score += 3;
    if (item.answerAr.includes(query)) score += 1;
    return { item, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return (scored.length ? scored : DEMO_FAQ.map((item) => ({ item, score: 0 })))
    .slice(0, limit)
    .map((x) => x.item);
}
