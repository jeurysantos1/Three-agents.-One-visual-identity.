# Three-agents.-One-visual-identity.
Agent Coordination System — three specialized agents that talk to each other before producing art.
# 🌊 Flow — Phase 2 Agent System

> **Multi-agent AI creative pipeline for brand identity work.**  
> Three specialized agents — Art Director, Brand Strategist, Brand Designer — coordinate in real-time to produce a unified Visual Identity brief, ready to build into a deck.

---

## What This Is

This is the **Phase 2: Visual Identity System** agent interface for Flow, an AI Program Manager for modern product teams. It's a React app that orchestrates three Claude-powered agents through a sequential creative pipeline:

```
Art Director → Brand Strategist → Brand Designer → Synthesis
```

Each agent reads the previous agent's output, builds on it, and hands off to the next. The final **Phase 2 Master Brief** contains a full slide-by-slide deck blueprint, color system, typography specs, and artifact production checklist — all ready to execute.

---

## Live Demo

Deploy to Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/flow-phase2-agents)

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build Tool | Vite |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Styling | Inline CSS + Google Fonts (Syne + DM Mono) |
| Deployment | Vercel / Netlify / GitHub Pages |

---

## Project Structure

```
flow-phase2-agents/
├── src/
│   ├── App.jsx                   # Root — mounts FlowPhase2Agents
│   ├── flow_phase2_agents.jsx    # Main agent pipeline component
│   └── main.jsx                  # React entry point
├── public/
│   └── index.html
├── .env.example                  # API key template
├── vite.config.js
├── package.json
└── README.md
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/flow-phase2-agents.git
cd flow-phase2-agents
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Anthropic API key:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
```

> **Get your key:** [console.anthropic.com](https://console.anthropic.com)

### 4. Wire up the API key in the component

In `flow_phase2_agents.jsx`, update the `callClaude` function headers:

```js
headers: {
  "Content-Type": "application/json",
  "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true",
},
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## ⚠️ Important: API Key Security

This app calls the Anthropic API directly from the browser. **Never commit your API key to a public repo.**

For production, two options:

**Option A — Proxy via serverless function (recommended)**

Create `/api/claude.js` (Vercel Edge Function):

```js
export default async function handler(req, res) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  res.json(data);
}
```

Then update `callClaude` to hit `/api/claude` instead of the Anthropic URL directly.

**Option B — Keep it private**  
Use `.env.local` (never committed) and only run locally or in private Vercel deployments with env vars set in the dashboard.

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_ANTHROPIC_API_KEY` | Your Anthropic API key | Yes |

---

## How the Agent Pipeline Works

### Sequential Execution

The three agents run **in order** — each reads the previous agent's full output before generating its response. This creates genuine chained reasoning, not parallel hallucination.

```
1. Art Director
   Input:  Brand context + visual reference brief
   Output: Creative direction, mood, visual guardrails, brief to team

2. Brand Strategist
   Input:  Art Director's output + brand context
   Output: Deck narrative structure (12 slides), strategic rationale, artifact priority

3. Brand Designer
   Input:  AD output + BS output + brand context
   Output: Exact hex codes, font specs, spacing tokens, artifact checklist

4. Synthesizer
   Input:  All three outputs
   Output: Phase 2 Master Brief — slide-by-slide blueprint, complete specs
```

### Agent Communication Log

Every handoff between agents is logged in real-time in the **Agent Communication Log** panel (dark strip at the bottom of the agent grid). This shows:

- `SYS` → Agent: pipeline system messages
- `AD` → `BS` / `BD`: Art Director handoffs
- `BS` → `BD`: Strategist to Designer briefs
- `BD` → `ALL`: Designer specs confirmed

---

## Customizing for Your Project

### Swap the brand context

In `flow_phase2_agents.jsx`, update the `BRAND_CONTEXT` constant at the top of the file with your own brand foundation from Phase 1.

### Change the color palette

The proposed palette is defined in the `colorSwatches` array inside the component:

```js
const colorSwatches = [
  { name: "Canvas",  hex: "#F5F3EE" },
  { name: "Ink",     hex: "#0A0A0A" },
  { name: "Lime",    hex: "#B8FF47" },
  { name: "Void",    hex: "#0A0E27" },
  { name: "Slate",   hex: "#6B7280" },
  { name: "Amber",   hex: "#FFB020" },
];
```

### Modify agent prompts

Each agent's behavior is defined in the `AGENTS` object. Edit the `role` string for each agent to change their focus, output format, or persona.

### Add more agents

Extend the `AGENTS` object and add a new step to the `runPipeline` async function following the same pattern.

---

## Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

Set `VITE_ANTHROPIC_API_KEY` in your Vercel project environment variables dashboard.

### Netlify

```bash
npm run build
# drag-drop the /dist folder to netlify.com/drop
```

Set env vars in Site Settings → Environment Variables.

### GitHub Pages

```bash
npm run build
# push /dist to gh-pages branch
```

Note: GitHub Pages doesn't support server-side env vars — use a proxy function or keep it private.

---

## Vite Config

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

## package.json

```json
{
  "name": "flow-phase2-agents",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0"
  }
}
```

---

## Phase Context

This is part of the **Flow Brand System** — a phased brand-before-product build:

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 01 | ✅ Complete | Brand Foundation — essence, values, ICP, positioning |
| **Phase 02** | 🔄 **Active** | **Visual Identity System — color, type, shape, motion** |
| Phase 03 | ⏳ Upcoming | Logo, Mark & Brand Story |
| Phase 04 | ⏳ Upcoming | Brand Identity Deck & Guidelines |
| Phase 05 | ⏳ Upcoming | Pre-Launch Readiness |

The Phase 01 agent system (`flow_phase1_agents.jsx`) produced the brand foundation this pipeline builds on.

---

## Design Reference

The visual system is inspired by a reference site with:
- Warm cream/off-white background (`#F5F3EE`)
- Near-black bold editorial typography (`#0A0A0A`)
- Electric lime-green as the single bold accent (`#B8FF47`)
- Rounded cards with editorial photography
- Generous white space, minimal UI chrome

This language is being translated into Flow's B2B intelligence brand — editorial energy meets systems intelligence.

---

## License

MIT — use freely, build on it.

---

*Flow — Execution shouldn't depend on manual coordination.*  
*Flow replaces chaos with clarity.*
