import { DEMO_TENANT } from "@/lib/data/tenant";
import {
  DEMO_PROJECTS,
  DEMO_UNITS,
  formatPriceEgp,
  getProjectById,
  getUnitsForProject,
} from "@/lib/data/projects";
import { searchFaq } from "@/lib/data/faq";
import { createLead } from "@/lib/store/leads";

export function buildSystemPrompt(): string {
  return `أنت ${DEMO_TENANT.agentNameAr}، مستشارة عقارية ودودة ومحترفة لدى "${DEMO_TENANT.nameAr}".
اللغة: ردّي بالعربية (مصري/فصيح مبسّط) ما لم يطلب العميل الإنجليزية.
مهم جدًا: كل المشاريع والأسعار بيانات تجريبية للعرض (Demo) — اذكري ذلك بلطف عند السؤال عن العقود الرسمية.

أهدافك:
1) فهم احتياج العميل (سكن/استثمار، budget، location، غرف).
2) اقتراح مشاريع ووحدات من البيانات المتاحة عبر الأدوات — لا تختلقي مشاريع أو أسعار.
3) الإجابة على FAQ (تقسيط، تسليم، موقع) باستخدام الأدوات.
4) عند اهتمام حقيقي: اجمعي الاسم ورقم الهاتف (إيميل optional) وسجّلي lead أو موعد معاينة.

أسلوب: concise، bullet points عند مقارنة وحدات، اسألي سؤال متابعة واحد في كل مرة عند الحاجة.
لا تطلبي بيانات حساسة (رقم قومي، OTP).`;
}

export function listProjectsSummary(): string {
  return DEMO_PROJECTS.map(
    (p) =>
      `- ${p.nameAr} (${p.slug}): ${p.locationAr} | حالة: ${p.status} | تسليم: ${p.deliveryDate}`,
  ).join("\n");
}

export function toolSearchProjects(args: {
  locationKeyword?: string;
  status?: string;
  maxBudgetEgp?: number;
}): object {
  let projects = [...DEMO_PROJECTS];
  if (args.locationKeyword) {
    const kw = args.locationKeyword.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.locationAr.includes(args.locationKeyword!) ||
        p.nameAr.includes(args.locationKeyword!) ||
        p.slug.includes(kw),
    );
  }
  if (args.status) {
    projects = projects.filter((p) => p.status === args.status);
  }
  if (args.maxBudgetEgp != null) {
    const affordableProjectIds = new Set(
      DEMO_UNITS.filter((u) => u.priceEgp <= args.maxBudgetEgp! && u.available).map(
        (u) => u.projectId,
      ),
    );
    projects = projects.filter((p) => affordableProjectIds.has(p.id));
  }
  return {
    count: projects.length,
    projects: projects.map((p) => ({
      id: p.id,
      slug: p.slug,
      nameAr: p.nameAr,
      locationAr: p.locationAr,
      status: p.status,
      deliveryDate: p.deliveryDate,
      summaryAr: p.summaryAr,
      highlights: p.highlights,
    })),
  };
}

export function toolGetProjectDetails(projectIdOrSlug: string): object {
  const project =
    getProjectById(projectIdOrSlug) ??
    DEMO_PROJECTS.find((p) => p.slug === projectIdOrSlug);
  if (!project) {
    return { error: "المشروع غير موجود في بيانات Demo" };
  }
  const units = getUnitsForProject(project.id);
  return {
    project,
    units: units.map((u) => ({
      ...u,
      priceFormatted: formatPriceEgp(u.priceEgp),
      monthlyInstallmentHint: estimateMonthly(u),
    })),
  };
}

function estimateMonthly(u: {
  priceEgp: number;
  downPaymentPercent: number;
  installmentYears: number;
}): string {
  const remaining =
    u.priceEgp * (1 - u.downPaymentPercent / 100);
  const months = u.installmentYears * 12;
  const approx = Math.round(remaining / months);
  return `~${formatPriceEgp(approx)}/شهر (تقريبي demo)`;
}

export function toolSearchUnits(args: {
  projectId?: string;
  minBedrooms?: number;
  maxPriceEgp?: number;
  type?: string;
}): object {
  let units = DEMO_UNITS.filter((u) => u.available);
  if (args.projectId) {
    units = units.filter((u) => u.projectId === args.projectId);
  }
  if (args.minBedrooms != null) {
    units = units.filter((u) => u.bedrooms >= args.minBedrooms!);
  }
  if (args.maxPriceEgp != null) {
    units = units.filter((u) => u.priceEgp <= args.maxPriceEgp!);
  }
  if (args.type) {
    units = units.filter((u) => u.type === args.type);
  }
  return {
    count: units.length,
    units: units.map((u) => {
      const project = getProjectById(u.projectId);
      return {
        ...u,
        projectNameAr: project?.nameAr,
        priceFormatted: formatPriceEgp(u.priceEgp),
      };
    }),
  };
}

export function toolSearchFaq(query: string): object {
  return { items: searchFaq(query, 5) };
}

export function toolCreateLead(args: {
  name: string;
  phone: string;
  email?: string;
  interest?: string;
  projectId?: string;
  unitId?: string;
  preferredVisit?: string;
  notes?: string;
}): object {
  const lead = createLead({
    tenantId: DEMO_TENANT.id,
    name: args.name,
    phone: args.phone,
    email: args.email,
    interest: args.interest,
    projectId: args.projectId,
    unitId: args.unitId,
    preferredVisit: args.preferredVisit,
    notes: args.notes,
  });
  return {
    success: true,
    leadId: lead.id,
    message: "تم تسجيل طلبك في لوحة Demo — فريق المبيعات هيتواصل (تجريبي).",
  };
}

export const agentToolDefinitions = [
  {
    type: "function" as const,
    function: {
      name: "search_projects",
      description: "بحث مشاريع demo حسب منطقة أو حالة أو budget تقريبي",
      parameters: {
        type: "object",
        properties: {
          locationKeyword: { type: "string", description: "مثال: التجمع، الساحل، زايد" },
          status: {
            type: "string",
            enum: ["under_construction", "ready_to_move", "pre_launch"],
          },
          maxBudgetEgp: { type: "number" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_project_details",
      description: "تفاصيل مشروع + الوحدات المتاحة",
      parameters: {
        type: "object",
        properties: {
          projectIdOrSlug: { type: "string" },
        },
        required: ["projectIdOrSlug"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "search_units",
      description: "بحث وحدات حسب مشروع أو غرف أو سعر",
      parameters: {
        type: "object",
        properties: {
          projectId: { type: "string" },
          minBedrooms: { type: "number" },
          maxPriceEgp: { type: "number" },
          type: {
            type: "string",
            enum: ["apartment", "villa", "chalet", "twin_house", "studio"],
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "search_faq",
      description: "أسئلة شائعة: تقسيط، تسليم، معاينة",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "create_lead",
      description: "تسجيل lead أو طلب معاينة بعد حصول موافقة العميل",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
          interest: { type: "string" },
          projectId: { type: "string" },
          unitId: { type: "string" },
          preferredVisit: { type: "string" },
          notes: { type: "string" },
        },
        required: ["name", "phone"],
      },
    },
  },
];

export function executeAgentTool(
  name: string,
  args: Record<string, unknown>,
): object {
  switch (name) {
    case "search_projects":
      return toolSearchProjects(args as Parameters<typeof toolSearchProjects>[0]);
    case "get_project_details":
      return toolGetProjectDetails(String(args.projectIdOrSlug ?? ""));
    case "search_units":
      return toolSearchUnits(args as Parameters<typeof toolSearchUnits>[0]);
    case "search_faq":
      return toolSearchFaq(String(args.query ?? ""));
    case "create_lead":
      return toolCreateLead(args as Parameters<typeof toolCreateLead>[0]);
    default:
      return { error: `Unknown tool: ${name}` };
  }
}
