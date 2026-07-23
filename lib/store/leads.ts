import type { Lead } from "@/lib/types";

const globalStore = globalThis as typeof globalThis & {
  __demoLeads?: Lead[];
};

function getStore(): Lead[] {
  if (!globalStore.__demoLeads) {
    globalStore.__demoLeads = [];
  }
  return globalStore.__demoLeads;
}

export function createLead(
  input: Omit<Lead, "id" | "createdAt" | "source"> & { source?: Lead["source"] },
): Lead {
  const lead: Lead = {
    ...input,
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    source: input.source ?? "chat",
    createdAt: new Date().toISOString(),
  };
  getStore().unshift(lead);
  return lead;
}

export function listLeads(tenantId?: string): Lead[] {
  const all = getStore();
  if (!tenantId) return [...all];
  return all.filter((l) => l.tenantId === tenantId);
}
