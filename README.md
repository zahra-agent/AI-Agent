# Real Estate AI Agent MVP (Demo)

وكيل محادثة للعقارات — مشاريع وأسعار **وهمية** للتدريب والعرض. مبني على Next.js (Vercel) مع schema جاهز لـ Supabase.

## التشغيل محليًا

```bash
cd real-estate-agent-mvp   # أو جذر الريبو بعد النقل
npm install
cp .env.example .env.local
# optional: OPENAI_API_KEY=sk-...
npm run dev
```

افتحي [http://localhost:3000](http://localhost:3000) — `/chat` للمحادثة، `/admin` للـ leads وFAQ.

## أوضاع الوكيل

| الوضع | متى |
|--------|-----|
| **demo** | بدون `OPENAI_API_KEY` — ردود جاهزة على أسئلة شائعة |
| **openai** | مع المفتاح — tools: بحث مشاريع، وحدات، FAQ، تسجيل lead |

## GitHub (`zahra-agent`)

```bash
cd /path/to/AI-Agent
git add .
git commit -m "feat: real estate agent MVP with demo data"
gh repo create zahra-agent/AI-Agent --public --source=. --remote=origin
git push -u origin main
```

(أنشئي الريبو من [github.com/new](https://github.com/new) إذا `gh` غير مثبت.)

## Vercel

1. [vercel.com/new](https://vercel.com/new) → Import من `zahra-agent/AI-Agent`
2. Root Directory: `real-estate-agent-mvp` (أو `.` إذا نقلت الملفات للجذر)
3. Environment: `OPENAI_API_KEY` (+ Supabase لاحقًا)

## Supabase (لاحقًا)

1. مشروع جديد على supabase.com
2. SQL Editor → الصق `supabase/migrations/001_initial.sql`
3. أضيفي URL و `service_role` في Vercel

## بيانات Demo

- **Tenant:** نخيل للتطوير (تجريبي)
- **4 مشاريع:** أهلي بارك، مراسي الساحل، نخيل هايتس، نخيل وست
- **FAQ:** تقسيط، تسليم، معاينة

عدّلي `lib/data/projects.ts` و `lib/data/faq.ts` لأي سينario جديد.
