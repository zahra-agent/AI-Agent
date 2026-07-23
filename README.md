# AI Agent — Real Estate MVP (Demo)

وكيل عقارات تجريبي (Next.js). محلي: `npm install && npm run dev`.

## Vercel — Build ناجح لكن `404 NOT_FOUND`

الـ log بتاعك سليم؛ المشكلة غالبًا **إعدادات المشروع** مش الكود.

في **Settings → General → Build & Development Settings**:

| الإعداد | المطلوب |
|---------|---------|
| **Framework Preset** | **Next.js** |
| **Root Directory** | فاضي |
| **Output Directory** | **فاضي تمامًا** — لو فيه `.next` أو `out` **امسحيه** (ده سبب شائع جدًا) |
| **Build Command** | فاضي أو `npm run build` |

بعد آخر push: من **Deployments** اضغطي **Visit** على **نفس الـ deployment** (مش domain قديم).

Environment (اختياري): `OPENAI_API_KEY`

## مسارات

- `/` — landing + شات
- `/chat` — محادثة
- `/admin` — leads (Demo)
