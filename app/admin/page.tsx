"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { DEMO_PROJECTS } from "@/lib/data/projects";
import { DEMO_FAQ } from "@/lib/data/faq";
import { DEMO_TENANT } from "@/lib/data/tenant";
import type { Lead } from "@/lib/types";

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [storage, setStorage] = useState("memory");

  const refresh = useCallback(async () => {
    const res = await fetch("/api/leads");
    const data = await res.json();
    setLeads(data.leads ?? []);
    setStorage(data.storage ?? "memory");
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-emerald-700">
            ← الرئيسية
          </Link>
          <h1 className="text-2xl font-bold">لوحة Admin (Demo)</h1>
          <p className="text-sm text-zinc-500">
            Tenant: {DEMO_TENANT.slug} · Leads: {storage}
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="rounded-lg border px-3 py-1.5 text-sm"
        >
          تحديث
        </button>
      </div>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">Leads من الشات</h2>
        {leads.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-sm text-zinc-500">
            مفيش leads لسه. في وضع OpenAI، اطلبي من الوكيل يسجّل lead بعد ما
            تدّي اسم ورقم في المحادثة.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-100 dark:bg-zinc-900">
                <tr>
                  <th className="p-2">الاسم</th>
                  <th className="p-2">الهاتف</th>
                  <th className="p-2">الاهتمام</th>
                  <th className="p-2">معاينة</th>
                  <th className="p-2">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-t">
                    <td className="p-2">{l.name}</td>
                    <td className="p-2" dir="ltr">
                      {l.phone}
                    </td>
                    <td className="p-2">{l.interest ?? "—"}</td>
                    <td className="p-2">{l.preferredVisit ?? "—"}</td>
                    <td className="p-2 text-xs">
                      {new Date(l.createdAt).toLocaleString("ar-EG")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-semibold">المشاريع (Mock)</h2>
          <ul className="space-y-2 text-sm">
            {DEMO_PROJECTS.map((p) => (
              <li key={p.id} className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-900">
                <span className="font-medium">{p.nameAr}</span>
                <span className="text-zinc-500"> · {p.status}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold">FAQ المتوقعة</h2>
          <ul className="max-h-80 space-y-2 overflow-y-auto text-sm">
            {DEMO_FAQ.map((f) => (
              <li key={f.id} className="rounded-lg border p-2">
                <p className="font-medium">{f.questionAr}</p>
                <p className="text-zinc-600 dark:text-zinc-400">{f.answerAr}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
