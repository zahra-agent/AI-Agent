export type ProjectStatus = "under_construction" | "ready_to_move" | "pre_launch";

export type UnitType = "apartment" | "villa" | "chalet" | "twin_house" | "studio";

export type Unit = {
  id: string;
  projectId: string;
  type: UnitType;
  bedrooms: number;
  areaSqm: number;
  priceEgp: number;
  downPaymentPercent: number;
  installmentYears: number;
  floor?: string;
  view?: string;
  available: boolean;
};

export type Project = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  locationAr: string;
  developer: string;
  status: ProjectStatus;
  deliveryDate: string;
  summaryAr: string;
  amenities: string[];
  highlights: string[];
};

export type FaqItem = {
  id: string;
  category: "payment" | "delivery" | "location" | "general";
  questionAr: string;
  answerAr: string;
  keywords: string[];
};

export type Lead = {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email?: string;
  interest?: string;
  projectId?: string;
  unitId?: string;
  preferredVisit?: string;
  notes?: string;
  source: "chat";
  createdAt: string;
};

export type Tenant = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  vertical: "real_estate";
  agentNameAr: string;
  welcomeMessageAr: string;
  primaryColor: string;
};

export type AgentConfig = {
  tenantId: string;
  model: string;
  language: "ar" | "en" | "ar_en";
};
