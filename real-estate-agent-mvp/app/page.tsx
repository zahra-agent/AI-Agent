import Link from "next/link";
import { ChatPanel } from "@/components/ChatPanel";
import { DEMO_PROJECTS, formatPriceEgp } from "@/lib/data/projects";
import { DEMO_TENANT } from "@/lib/data/tenant";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-800">
            MVP · بيانات تجريبية
          </p>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {DEMO_TENANT.nameAr}
          </h1>
        </div>
        <nav className="flex gap-3 text-sm">
          <Link
            href="/chat"
            className="rounded-lg border border-emerald-700 px-3 py-1.5 text-emerald-800"
          >
            المحادثة
          </Link>
          <Link
            href="/admin"
            className="rounded-lg bg-emerald-700 px-3 py-1.5 text-white"
          >
            Admin
          </Link>
        </nav>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 lg:grid-cols-2">
        <section>
          <h2 className="mb-2 text-lg font-semibold">مشاريع Demo</h2>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            كل الأرقام والمواقع وهمية للتدريب على أسئلة العملاء الحقيقية.
          </p>
          <ul className="space-y-3">
            {DEMO_PROJECTS.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <h3 className="font-semibold">{p.nameAr}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {p.locationAr}
                </p>
                <p className="mt-2 text-xs text-emerald-800">{p.summaryAr}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-zinc-500">
            أمثلة أسعار: من {formatPriceEgp(2_100_000)} (studio demo) إلى{" "}
            {formatPriceEgp(12_500_000)} (فilla).
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold">جرّبي الوكيل — سارة</h2>
          <ChatPanel compact />
        </section>
      </div>
    </main>
  );
}
