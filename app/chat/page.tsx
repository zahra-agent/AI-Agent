import Link from "next/link";
import { ChatPanel } from "@/components/ChatPanel";

export default function ChatPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8">
      <Link href="/" className="mb-4 text-sm text-emerald-700">
        ← الرئيسية
      </Link>
      <h1 className="mb-4 text-xl font-bold">محادثة العميل</h1>
      <ChatPanel />
    </main>
  );
}
