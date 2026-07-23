import type { Project, Unit } from "@/lib/types";

export const DEMO_PROJECTS: Project[] = [
  {
    id: "proj_ahly_park",
    slug: "ahly-park",
    nameAr: "أهلي بارك ريزيدنس",
    nameEn: "Ahly Park Residence",
    locationAr: "التجمع الخامس — القاهرة الجديدة، على بعد 5 دقائق من الرحاب",
    developer: "نخيل للتطوير (Demo)",
    status: "under_construction",
    deliveryDate: "2028-06",
    summaryAr:
      "كمبوند سكني متكامل: شقق 2–4 غرف، club house، حمامات سباحة، أمن 24/7، وجراجات underground. مناسب للسكن والاستثمار.",
    amenities: [
      "Club House",
      "3 حمامات سباحة",
      "جيم وسبا",
      "أمن و gated",
      "جراج underground",
      "مساحات green",
    ],
    highlights: [
      "تقسيط حتى 10 سنوات",
      "مقدم يبدأ من 5%",
      "قريب من مدارس دولية",
    ],
  },
  {
    id: "proj_marasi_coast",
    slug: "marasi-coast",
    nameAr: "مراسي الساحل",
    nameEn: "Marasi Coast",
    locationAr: "رأس الحكمة — الساحل الشمالي، كيلو 165",
    developer: "نخيل للتطوير (Demo)",
    status: "under_construction",
    deliveryDate: "2027-08",
    summaryAr:
      "منتجع سكني على البحر: شاليهات و penthouses، شاطئ private، marina صغيرة، وخدمات فندقية optional.",
    amenities: [
      "شاطئ private",
      "Marina",
      "pools laguna",
      "مطاعم و cafés",
      "Housekeeping (optional)",
    ],
    highlights: ["إطلالة بحر", "تسليم 2027", "إيجار summer optional"],
  },
  {
    id: "proj_nakhil_heights",
    slug: "nakhil-heights",
    nameAr: "نخيل هايتس",
    nameEn: "Nakhil Heights",
    locationAr: "6 أكتوبر — محور الواحات، أمام مول مصر",
    developer: "نخيل للتطوير (Demo)",
    status: "ready_to_move",
    deliveryDate: "ready",
    summaryAr:
      "فيلات standalone و twin house في حي هادئ، جاهز للتسليم الفوري، تشطيب semi-finished أو fully finished حسب الوحدة.",
    amenities: [
      "Compound gated",
      "مدرسة داخلية (Demo)",
      "commercial area",
      "mosque & clinic",
    ],
    highlights: ["تسليم فوري", "فيلات 300–450 م²", "تقسيط 7 سنوات للجاهز"],
  },
  {
    id: "proj_nakhil_west",
    slug: "nakhil-west",
    nameAr: "نخيل وست",
    nameEn: "Nakhil West",
    locationAr: "الشيخ زايد — محور 26 يوليو",
    developer: "نخيل للتطوير (Demo)",
    status: "pre_launch",
    deliveryDate: "2029-12",
    summaryAr:
      "إطلاق قريب: apartment towers بحدائق rooftop، targeting young professionals. قائمة waiting list مفتوحة للعرض التجريبي.",
    amenities: ["Rooftop gardens", "Co-working", "Retail podium", "EV charging"],
    highlights: ["أسعار pre-launch demo", "أولوية حجز للمسجلين"],
  },
];

export const DEMO_UNITS: Unit[] = [
  {
    id: "unit_ap_2br_85",
    projectId: "proj_ahly_park",
    type: "apartment",
    bedrooms: 2,
    areaSqm: 85,
    priceEgp: 3_200_000,
    downPaymentPercent: 5,
    installmentYears: 10,
    floor: "3–8",
    view: "garden",
    available: true,
  },
  {
    id: "unit_ap_3br_120",
    projectId: "proj_ahly_park",
    type: "apartment",
    bedrooms: 3,
    areaSqm: 120,
    priceEgp: 4_850_000,
    downPaymentPercent: 10,
    installmentYears: 10,
    floor: "9–15",
    view: "pool",
    available: true,
  },
  {
    id: "unit_chalet_100",
    projectId: "proj_marasi_coast",
    type: "chalet",
    bedrooms: 2,
    areaSqm: 100,
    priceEgp: 5_500_000,
    downPaymentPercent: 10,
    installmentYears: 8,
    view: "sea partial",
    available: true,
  },
  {
    id: "unit_chalet_140",
    projectId: "proj_marasi_coast",
    type: "chalet",
    bedrooms: 3,
    areaSqm: 140,
    priceEgp: 8_200_000,
    downPaymentPercent: 15,
    installmentYears: 8,
    view: "sea front",
    available: true,
  },
  {
    id: "unit_villa_350",
    projectId: "proj_nakhil_heights",
    type: "villa",
    bedrooms: 4,
    areaSqm: 350,
    priceEgp: 12_500_000,
    downPaymentPercent: 20,
    installmentYears: 7,
    view: "park",
    available: true,
  },
  {
    id: "unit_twin_280",
    projectId: "proj_nakhil_heights",
    type: "twin_house",
    bedrooms: 3,
    areaSqm: 280,
    priceEgp: 9_800_000,
    downPaymentPercent: 15,
    installmentYears: 7,
    available: true,
  },
  {
    id: "unit_studio_zwest",
    projectId: "proj_nakhil_west",
    type: "studio",
    bedrooms: 1,
    areaSqm: 55,
    priceEgp: 2_100_000,
    downPaymentPercent: 5,
    installmentYears: 9,
    available: true,
  },
];

export function getProjectById(id: string): Project | undefined {
  return DEMO_PROJECTS.find((p) => p.id === id);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return DEMO_PROJECTS.find((p) => p.slug === slug);
}

export function getUnitsForProject(projectId: string): Unit[] {
  return DEMO_UNITS.filter((u) => u.projectId === projectId && u.available);
}

export function formatPriceEgp(amount: number): string {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(amount);
}
