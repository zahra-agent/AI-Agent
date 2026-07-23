# AI Agent — Real Estate MVP (Demo)

```bash
npm install && npm run dev
```

## Vercel: Build OK لكن 404 على `/`

**اختبار:** افتحي `/next.svg` — لو شغال و `/` لا → المشروع متعامل كـ **Static** و Output غالبًا **`public`**.

### الحل (بالترتيب)

1. **Settings → General → Framework Preset** → اختاري **Next.js** (مش Other).
   - لما Preset = Next.js، حقل Output Directory **بيختفي** — ده المطلوب.
2. لو لسه ظاهر **Output Directory**، امسحي أي قيمة (خصوصًا `public`).
3. **Override** جنب Build Settings: اقفلي أي override غريب.
4. **Redeploy** (Clear cache).

لو `/` لسه بتعرض `index.html` التشخيصي → Preset لسه مش Next.js.  
لو `/` بقت «نخيل Demo» → شغّال.

Environment (اختياري): `OPENAI_API_KEY`
