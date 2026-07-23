"use client";

import { useEffect, useRef, useState } from "react";
import { DEMO_TENANT } from "@/lib/data/tenant";

type Message = { role: "user" | "assistant"; content: string };

type ChatPanelProps = {
  compact?: boolean;
};

export function ChatPanel({ compact }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: DEMO_TENANT.welcomeMessageAr },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "failed");
      setMode(data.mode ?? null);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.message as string },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "حصل خطأ في الاتصال — جرّبي تاني بعد شوية.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950 ${
        compact ? "h-[420px]" : "min-h-[520px] flex-1"
      }`}
    >
      <div
        className="flex items-center justify-between rounded-t-2xl px-4 py-3 text-white"
        style={{ backgroundColor: DEMO_TENANT.primaryColor }}
      >
        <div>
          <p className="font-semibold">{DEMO_TENANT.agentNameAr}</p>
          <p className="text-xs opacity-90">مساعد عقاري · Demo</p>
        </div>
        {mode && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] uppercase">
            {mode}
          </span>
        )}
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-emerald-700 text-white"
                  : "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <p className="text-xs text-zinc-500">سارة بتجهّز الرد...</p>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 border-t border-zinc-100 p-3 dark:border-zinc-800">
        <input
          className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-emerald-600 dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="اسأل عن مشروع، سعر، تقسيط..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          dir="auto"
        />
        <button
          type="button"
          onClick={send}
          disabled={loading}
          className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}
