import { NextResponse } from "next/server";
import { listLeads } from "@/lib/store/leads";
import { DEMO_TENANT } from "@/lib/data/tenant";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  const tenantId = DEMO_TENANT.id;
  let leads = listLeads(tenantId);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (data?.length) {
        leads = data.map((row) => ({
          id: row.id,
          tenantId: row.tenant_id,
          name: row.name,
          phone: row.phone,
          email: row.email ?? undefined,
          interest: row.interest ?? undefined,
          projectId: row.project_id ?? undefined,
          unitId: row.unit_id ?? undefined,
          preferredVisit: row.preferred_visit ?? undefined,
          notes: row.notes ?? undefined,
          source: "chat" as const,
          createdAt: row.created_at,
        }));
      }
    }
  }

  return NextResponse.json({ leads, storage: isSupabaseConfigured() ? "supabase" : "memory" });
}
