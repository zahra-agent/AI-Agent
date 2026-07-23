import type { Tenant } from "@/lib/types";

/** Demo tenant — no real company; for MVP demos only */
export const DEMO_TENANT: Tenant = {
  id: "tenant_nakhil_demo",
  slug: "nakhil-demo",
  nameAr: "نخيل للتطوير العقاري (تجريبي)",
  nameEn: "Nakhil Development (Demo)",
  vertical: "real_estate",
  agentNameAr: "سارة",
  welcomeMessageAr:
    "أهلًا! أنا سارة، مستشارتك العقارية من نخيل. اسأليني عن مشاريعنا، الأسعار، أنظمة التقسيط، أو احجزي معاينة — كل البيانات هنا للعرض التجريبي فقط.",
  primaryColor: "#0d6e4f",
};
