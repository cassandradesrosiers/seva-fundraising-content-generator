# SEVA Content Generator

Internal fundraising communications tool for South End Village Academy.
Generates multi-channel content (email, social, WhatsApp, Slack, graphics) using the SEVA brand voice and approved messaging framework.

---

## Stack

- **Next.js 15** (App Router)
- **React 19**
- **Anthropic SDK** — `claude-sonnet-4-5` via server-side API routes
- **Tailwind-free** — all styling is inline React styles using the SEVA design system
- **Google Fonts** — Nunito via `next/font/google`

---

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your Anthropic API key

# 3. Run the dev server
npm run dev
# Open http://localhost:3000
```

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Your Anthropic API key. Get one at console.anthropic.com |

Never commit `.env.local`. It is in `.gitignore`.

---

## Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm install -g vercel
vercel

# Follow prompts, then add your env var:
vercel env add ANTHROPIC_API_KEY
vercel --prod
```

### Option B — Vercel Dashboard

1. Push this folder to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new) → Import the repo
3. In **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` = your key
4. Click **Deploy**

Vercel auto-detects Next.js. No `vercel.json` needed.

---

## API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/generate` | POST | Main content generation. Body: `{ prompt, maxTokens }`. Returns parsed JSON. |
| `/api/sync` | GET | Fetches live donation amount from southendvillageacademy.org via Anthropic web search. Returns `{ raised, timestamp }`. |

All Anthropic calls are server-side. The `ANTHROPIC_API_KEY` is never exposed to the browser.

---

## Project structure

```
seva-nextjs/
├── app/
│   ├── layout.tsx          # Root layout, Nunito font, metadata
│   ├── page.tsx            # Thin client wrapper → SEVAGenerator
│   ├── globals.css         # CSS baseline
│   └── api/
│       ├── generate/
│       │   └── route.ts    # Anthropic generation proxy
│       └── sync/
│           └── route.ts    # Live amount sync via web search
├── components/
│   └── SEVAGenerator.jsx   # Main application component
├── .env.local.example      # Copy → .env.local, add API key
├── package.json
├── tsconfig.json
└── next.config.mjs
```

---

## Updating campaign data

All campaign facts, brand colors, audiences, objectives, and events are defined at the top of `components/SEVAGenerator.jsx` in clearly labeled constants:

- `CAMPAIGN` — school name, goal, raised amount, match details, donation URL, brand tokens
- `AUDIENCES` — all 16 audience profiles across Internal / Relational / Corporate
- `OBJECTIVES` — 10 messaging objectives with framing and full guidance
- `EVENT_CONTEXTS` — 6 campaign moment contexts
- `TONE_RULES` — 6 tone modifiers

Update `CAMPAIGN.raised` to refresh the hardcoded fallback amount, or use the "Sync from website" button in the app to pull the live figure automatically.

---

## Notes

- The **Edit in Canva** button copies a structured design brief to clipboard and opens the relevant Canva template page in a new tab. (In the Claude.ai artifact version, it uses the Canva MCP connector to create a design directly.)
- The **Download PNG** button uses `html2canvas` loaded from `esm.sh`. It captures the rendered graphic preview at 2.5x resolution. For production-quality exports, use the Edit in Canva workflow.
- The **live sync** calls Anthropic's `web_search` tool server-side to fetch the current donation counter from southendvillageacademy.org, which updates from Zeffy every ~10 minutes.
