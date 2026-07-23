import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  agentToolDefinitions,
  buildSystemPrompt,
  executeAgentTool,
  listProjectsSummary,
  toolGetProjectDetails,
  toolSearchProjects,
} from "@/lib/agent/real-estate";
import { searchFaq } from "@/lib/data/faq";
import { DEMO_TENANT } from "@/lib/data/tenant";

export const maxDuration = 60;

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

function demoReplyWithoutOpenAI(messages: ChatMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const text = (lastUser?.content ?? "").trim();
  const lower = text.toLowerCase();

  if (!text) {
    return DEMO_TENANT.welcomeMessageAr;
  }

  if (/معاين|زيار|موعد|حجز/.test(text)) {
    return (
      "تمام! للمعاينة في الـ Demo محتاجين اسمك ورقم الموبايل والمشروع اللي حابب تشوفه.\n\n" +
      "مثال: «اسمي أحمد، 010xxxx، أهلي بارك يوم السبت» — وفي وضع OpenAI هيتسجل lead أوتوماتيك."
    );
  }

  if (/تقسيط|مقدم|قسط/.test(text)) {
    const faq = searchFaq("تقسيط", 1)[0];
    return faq?.answerAr ?? "مقدم من 5% وأقساط حتى 10 سنوات حسب المشروع (Demo).";
  }

  if (/ساحل|مراسي|شاليه/.test(text)) {
    const details = toolGetProjectDetails("marasi-coast") as {
      project?: { nameAr: string; summaryAr: string };
      units?: { bedrooms: number; priceFormatted: string }[];
    };
    const units = details.units?.slice(0, 2) ?? [];
    return (
      `**${details.project?.nameAr}**\n${details.project?.summaryAr}\n\n` +
      units
        .map((u) => `- ${u.bedrooms} غرف من ${u.priceFormatted}`)
        .join("\n") +
      "\n\n*(رد Demo بدون OpenAI — فعّلي OPENAI_API_KEY لردود أذكى)*"
    );
  }

  if (/تجمع|أهلي|بارك|cairo|القاهرة/.test(lower) || /أهلي/.test(text)) {
    const details = toolGetProjectDetails("ahly-park") as {
      project?: { nameAr: string; locationAr: string };
      units?: { bedrooms: number; areaSqm: number; priceFormatted: string }[];
    };
    const units = details.units ?? [];
    return (
      `**${details.project?.nameAr}** — ${details.project?.locationAr}\n\n` +
      units
        .map(
          (u) =>
            `- ${u.bedrooms} غرف / ${u.areaSqm}م² — ${u.priceFormatted}`,
        )
        .join("\n") +
      "\n\nعايز مقارنة مع مشروع تاني؟"
    );
  }

  if (/budget|مليون|ميزانية|\d/.test(text)) {
    const nums = text.match(/\d[\d,]*/g);
    const budget = nums
      ? parseInt(nums[0].replace(/,/g, ""), 10) * (text.includes("مليون") ? 1_000_000 : 1)
      : 4_000_000;
    const result = toolSearchProjects({ maxBudgetEgp: budget }) as {
      projects: { nameAr: string; locationAr: string }[];
    };
    if (!result.projects?.length) {
      return "في الـ Demo مفيش وحدات تحت الميزانية دي — جرّبي 5 مليون أو اسألي عن التقسيط.";
    }
    return (
      `حسب budget ~${budget.toLocaleString("ar-EG")} EGP (Demo):\n` +
      result.projects.map((p) => `- **${p.nameAr}**: ${p.locationAr}`).join("\n")
    );
  }

  return (
    `${DEMO_TENANT.agentNameAr} هنا 👋\n\n` +
    `المشاريع المتاحة للتجربة:\n${listProjectsSummary()}\n\n` +
    "اسأل عن: موقع، أسعار، تقسيط، أو معاينة.\n\n" +
    "_ملاحظة: أضيفي `OPENAI_API_KEY` في `.env.local` لتفعيل الوكيل الكامل مع tools._"
  );
}

async function runOpenAIChat(messages: ChatMessage[]): Promise<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const apiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: buildSystemPrompt() },
    ...messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  for (let step = 0; step < 6; step++) {
    const completion = await openai.chat.completions.create({
      model,
      messages: apiMessages,
      tools: agentToolDefinitions,
      tool_choice: "auto",
    });

    const choice = completion.choices[0]?.message;
    if (!choice) {
      throw new Error("No response from model");
    }

    if (choice.tool_calls?.length) {
      apiMessages.push(choice);
      for (const call of choice.tool_calls) {
        if (call.type !== "function") continue;
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(call.function.arguments || "{}");
        } catch {
          args = {};
        }
        const result = executeAgentTool(call.function.name, args);
        apiMessages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify(result),
        });
      }
      continue;
    }

    return choice.content?.trim() || "عذرًا، حصل خطأ بسيط — جرّبي تاني.";
  }

  return "محتاجة توضيح أكتر — ممكن تقوليلي budget أو المنطقة اللي بتدوري عليها؟";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = (body.messages ?? []) as ChatMessage[];

    if (!messages.length || messages[messages.length - 1]?.role !== "user") {
      return NextResponse.json(
        { error: "Expected messages ending with user" },
        { status: 400 },
      );
    }

    const hasKey = Boolean(process.env.OPENAI_API_KEY);
    const reply = hasKey
      ? await runOpenAIChat(messages)
      : demoReplyWithoutOpenAI(messages);

    return NextResponse.json({
      message: reply,
      mode: hasKey ? "openai" : "demo",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Chat failed", details: String(err) },
      { status: 500 },
    );
  }
}
