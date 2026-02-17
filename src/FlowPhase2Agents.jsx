import { useState, useRef } from "react";
import ThoughtTrace from "./ThoughtTrace";
import "./ThoughtTrace.css";
import "./FlowPhase2Agents.css";
import CoWorkingFab from "./CoWorkingFab";
import CoWorkingDrawer from "./CoWorkingDrawer";
import "./CoWorking.css";
import { useVersions } from "./useVersions";
import SaveVersionModal from "./SaveVersionModal";
import VersionsDrawer from "./VersionsDrawer";
import "./Versions.css";


// ─── BRAND CONTEXT ────────────────────────────────────────────────────────────
const BRAND_CONTEXT = `
FLOW — AI Program Manager | Phase 2: Visual Identity System

FROM PHASE 1 FOUNDATION:
- Brand Essence: "Flow is the invisible conductor that transforms chaos into choreography."
- Archetype: Magician + Sage. Core Metaphor: The Maestro, Adaptive Water
- Values: Invisibility as Excellence, Momentum Compounds, Calm Intelligence, Reality Over Prescription, Orchestration Not Ownership
- Voice: Clear+Direct, Intelligent+Confident, Calm+Reassuring, Human+Warm, Forward-Looking
- Tagline: "Flow replaces chaos with clarity"
- ICP: Startup PMs at Series A-C SaaS companies (30-300 employees)

VISUAL REFERENCE:
- Clean warm cream background (#F5F3EE)
- Bold near-black display typography (#0A0A0A)
- Electric lime-green accent (#B8FF47) as single bold pop
- Rounded editorial cards, generous white space, minimal nav

PHASE 2 DELIVERABLE: Visual Identity System deck covering:
1. Color System  2. Typography  3. Shape & Grid  4. Iconography  5. Motion  6. Brand-in-use
`;

// ─── THINKING STEPS ───────────────────────────────────────────────────────────
const AGENT_STEPS = {
  artDirector: [
    { label: "Reading Phase 1 brand foundation", detail: "Parsing brand essence, archetype, values, ICP, and voice from Phase 1 output to ensure creative direction is grounded in strategy." },
    { label: "Analysing visual reference image", detail: "Breaking down the reference: cream #F5F3EE background, near-black #0A0A0A type, electric lime-green accent, rounded editorial cards. Extracting transferable energy for a B2B SaaS context." },
    { label: "Mapping brand feeling to visual language", detail: "Translating 'Calm Intelligence' and 'Invisible Excellence' into visual decisions: restraint in layout, bold typography, a single electric accent that signals intelligence without aggression." },
    { label: "Setting visual IS / IS NOT guardrails", detail: "Defining what Flow must never look like: no corporate blue-grey, no dashboard anxiety, no feature-shouting. Referencing Linear, Vercel, and Stripe as directional — not copies." },
    { label: "Briefing Brand Strategist on narrative arc", detail: "Instructing the strategist on the emotional arc the deck must follow: pain recognition → intelligent response → confident system → calm outcome." },
    { label: "Briefing Brand Designer on key artifacts", detail: "Specifying the 8 core artifacts: color system, type specimen, shape grid, icon preview, motion principles diagram, brand-in-use mockups (dashboard, email, social)." },
  ],
  brandStrategist: [
    { label: "Reviewing Art Director creative brief", detail: "Absorbing the creative direction and stress-testing each decision against Phase 1 brand strategy and business model objectives." },
    { label: "Mapping Phase 1 values to visual rationale", detail: "Building the strategic argument for each visual decision. Why cream? Calm, premium without coldness. Why lime green? Unexpected energy in a sea of B2B blue — signals confidence." },
    { label: "Structuring 12-slide deck narrative", detail: "Architecting the story arc: Cover → Problem Space → Brand Essence recap → Color → Typography → Shape & Grid → Icons → Illustration → Motion → Voice → Brand-in-Use → Handoff." },
    { label: "Writing strategic rationale per section", detail: "Each section needs a one-sentence strategic justification — not just 'here are the colors' but 'this palette communicates trustworthy intelligence, validated against WCAG AA standards.'" },
    { label: "Identifying highest-weight artifacts", detail: "Flagging the 3 artifacts with most stakeholder persuasion weight: (1) brand-in-use dashboard mockup, (2) color system with WCAG ratios, (3) type specimen in full context." },
    { label: "Briefing Designer on production priorities", detail: "Sending priority order: lead with the brand-in-use mockup — it makes the entire system feel real. Specs support the story, not the other way around." },
  ],
  brandDesigner: [
    { label: "Cross-referencing both agent briefs", detail: "Reading AD's guardrails alongside BS's narrative priorities. Resolving gaps — e.g. strategist wants a dashboard mockup but AD hasn't specified which UI component to feature first." },
    { label: "Locking the full color token system", detail: "Defining all 10 tokens: --canvas #F5F3EE, --ink #0A0A0A, --lime #B8FF47, --void #0A0E27, --violet #6B4FFF, --amber #FFB020, --coral #FF6B35, --slate #6B7280, --success #00C97B, --error #FF3B3B. Each with WCAG contrast ratio." },
    { label: "Specifying typography stack", detail: "Display: Syne 900 — geometric, confident, modern. Body: DM Sans 400/500 — humanist, readable at 14-16px. Mono: DM Mono 400 — technical credibility for data. All Google Fonts." },
    { label: "Defining shape language & spacing grid", detail: "Border radius tokens: 4px chips, 8px buttons, 12px cards, 16px modals, 24px hero cards. 8px base grid. 12-column layout at 1440px max-width, 24px gutters." },
    { label: "Planning artifact production order", detail: "8 artifacts in order: (1) Color system slide, (2) Type specimen, (3) Shape & grid, (4) Icon library preview, (5) Illustration style guide, (6) Motion principles, (7) Dashboard mockup, (8) Email + social preview." },
    { label: "Defining master slide template system", detail: "3 templates: Dark (void background, lime headings) for cover/dividers; Light (canvas background, ink type) for content; Split (50/50 dark+light) for comparisons." },
  ],
  synthesizer: [
    { label: "Consolidating all three agent outputs", detail: "Reading Art Director (creative + guardrails), Brand Strategist (narrative + rationale), Brand Designer (tokens + artifacts). Identifying convergences, resolving conflicts." },
    { label: "Building the unified color system", detail: "Merging AD's palette mood, BS's accessibility requirements, and BD's exact tokens into one definitive documented color system with usage rules per token." },
    { label: "Assembling slide-by-slide blueprint", detail: "Combining strategist's narrative arc with designer's template specs — assigning each of 12 slides a master template, key visual, content requirements, and design notes." },
    { label: "Writing the artifact checklist", detail: "Prioritised production order with owner, format requirements, and deadline dependencies for each of the 8 artifacts — ready to assign in Notion or Linear." },
    { label: "Drafting Phase 2 to Phase 3 handoff notes", detail: "Documenting what this deck unlocks: Phase 3 (Logo & Mark) can begin because color and typography are locked. Flagging open questions for founder sign-off." },
    { label: "Finalising the Master Brief document", detail: "Assembling all sections into the definitive Phase 2 Master Brief — the single document the team executes from. Ready to export as Google Doc + Figma cover." },
  ],
};

// ─── AGENTS ───────────────────────────────────────────────────────────────────
const AGENTS = {
  artDirector: {
    id: "artDirector", name: "Art Director", title: "Creative Direction & Brand Vision",
    avatar: "AD", color: "#B8FF47", textColor: "#0A0A0A", emoji: "🎨",
    systemPrompt: `You are the Art Director for FLOW's Phase 2 Visual Identity System. Bold, opinionated, you think in systems and emotional resonance.
Your job: define creative direction, set visual guardrails, brief Brand Strategist on narrative, brief Brand Designer on artifacts.
Reference: cream background, bold black type, neon lime green accent, editorial cards.
Context: ${BRAND_CONTEXT}
Respond in Art Director voice. Use markdown headers. Max 400 words.`,
    userPrompt: `Kick off Phase 2 Visual Identity for Flow. Based on Phase 1 and the visual reference (cream background, bold black type, electric lime green, editorial cards), define the creative direction. Address Brand Strategist and Brand Designer directly.`,
  },
  brandStrategist: {
    id: "brandStrategist", name: "Brand Strategist", title: "Positioning & Deck Narrative",
    avatar: "BS", color: "#6B4FFF", textColor: "#FFFFFF", emoji: "📐",
    systemPrompt: `You are the Brand Strategist for FLOW's Phase 2 Visual Identity System.
Your job: define deck narrative arc, document strategic rationale, write positioning language per section, tie decisions to Phase 1.
Context: ${BRAND_CONTEXT}
Respond in Brand Strategist voice. Use markdown headers. Max 400 words.`,
  },
  brandDesigner: {
    id: "brandDesigner", name: "Brand Designer", title: "Artifacts & Visual Execution",
    avatar: "BD", color: "#FF6B35", textColor: "#FFFFFF", emoji: "✏️",
    systemPrompt: `You are the Brand Designer for FLOW's Phase 2 Visual Identity System. Meticulous, detail-obsessed.
Your job: define exact color tokens, specify typography stack, define shape language, plan artifacts, propose slide templates.
Be hyper-specific: exact hex codes, font names, spacing values.
Context: ${BRAND_CONTEXT}
Respond in Brand Designer voice. Use markdown headers. Max 500 words.`,
  },
};

const SYNTHESIS_SYSTEM = `You are the Lead Creative Producer synthesizing all Phase 2 kickoff work into one unified actionable brief. Be comprehensive but decisive. This will be handed directly to the team to build the deck.`;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const PALETTE = [
  { name: "Canvas", hex: "#F5F3EE" }, { name: "Ink",    hex: "#0A0A0A" },
  { name: "Lime",   hex: "#B8FF47" }, { name: "Void",   hex: "#0A0E27" },
  { name: "Violet", hex: "#6B4FFF" }, { name: "Amber",  hex: "#FFB020" },
  { name: "Coral",  hex: "#FF6B35" }, { name: "Slate",  hex: "#6B7280" },
];

const STEPS = [
  { id: "artDirector",     label: "Art Director" },
  { id: "brandStrategist", label: "Brand Strategist" },
  { id: "brandDesigner",   label: "Brand Designer" },
  { id: "synthesizer",     label: "Master Brief" },
];

const STATUS_LABEL = { waiting: "STANDBY", running: "ACTIVE", done: "COMPLETE" };

const MSG_COLORS = {
  SYSTEM:          { bg: "#1a1a1a", fg: "#666" },
  artDirector:     { bg: "#B8FF47", fg: "#0A0A0A" },
  brandStrategist: { bg: "#6B4FFF", fg: "#fff" },
  brandDesigner:   { bg: "#FF6B35", fg: "#fff" },
};
const MSG_SHORT = { SYSTEM: "SYS", artDirector: "AD", brandStrategist: "BS", brandDesigner: "BD" };

// ─── API CALL ─────────────────────────────────────────────────────────────────
async function callClaude(systemPrompt, userMessage, onChunk) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || "";
  const headers = {
    "Content-Type": "application/json",
    "anthropic-version": "2023-06-01",
    "anthropic-dangerous-direct-browser-access": "true",
  };
  if (apiKey) { headers["x-api-key"] = apiKey; }

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${resp.status}`);
  }

  const data = await resp.json();
  const text = data.content?.[0]?.text || "No response received.";
  const words = text.split(" ");
  let accumulated = "";
  for (let i = 0; i < words.length; i++) {
    accumulated += (i > 0 ? " " : "") + words[i];
    onChunk(accumulated);
    await new Promise((r) => setTimeout(r, 20));
  }
  return text;
}

// ─── MARKDOWN ─────────────────────────────────────────────────────────────────
function renderMd(text, accent) {
  if (!text) return "";
  const a = accent || "#B8FF47";
  return text
    .replace(/^# (.+)$/gm,     `<h1 class="md-h1" style="color:${a}">$1</h1>`)
    .replace(/^## (.+)$/gm,    `<h2 class="md-h2">$1</h2>`)
    .replace(/^### (.+)$/gm,   `<h3 class="md-h3">$1</h3>`)
    .replace(/\*\*(.+?)\*\*/g, `<strong class="md-strong">$1</strong>`)
    .replace(/\*(.+?)\*/g,     `<em class="md-em" style="color:${a}">$1</em>`)
    .replace(/`(.+?)`/g,       `<code class="md-code">$1</code>`)
    .replace(/^- (.+)$/gm,     `<div class="md-li"><span class="md-bullet" style="color:${a}">›</span><span>$1</span></div>`)
    .replace(/^\d+\. (.+)$/gm, `<div class="md-li"><span class="md-bullet" style="color:${a}">•</span><span>$1</span></div>`)
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

// ─── THINKING FEED COMPONENT ──────────────────────────────────────────────────
function ThinkingFeed({ agentId, completedSteps, activeStep, color, textColor }) {
  const [expanded, setExpanded] = useState(null);
  const steps = AGENT_STEPS[agentId] || [];

  return (
    <div className="think-feed">
      {steps.map((step, i) => {
        const isDone   = i < completedSteps;
        const isActive = i === activeStep;
        const isLocked = !isDone && !isActive;
        const isOpen   = expanded === i;

        return (
          <div
            key={i}
            className={["think-step", isDone ? "t-done" : "", isActive ? "t-active" : "", isLocked ? "t-locked" : ""].join(" ")}
          >
            <button
              className="think-row"
              onClick={() => { if (isDone || isActive) setExpanded(isOpen ? null : i); }}
              style={{ cursor: isLocked ? "default" : "pointer" }}
            >
              <div className="think-icon" style={{
                background: (isActive || isDone) ? color : "#E8E6E0",
                color:      (isActive || isDone) ? textColor : "#BBBBBB",
              }}>
                {isActive
                  ? <span className="think-spinner" />
                  : isDone
                  ? <span>✓</span>
                  : <span style={{ fontSize: "9px" }}>{i + 1}</span>
                }
              </div>

              <span className="think-label" style={{
                color:      (isActive || isDone) ? "#0A0A0A" : "#CCCCCC",
                fontWeight: isActive ? 600 : isDone ? 500 : 400,
              }}>
                {step.label}
                {isActive && (
                  <span className="think-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </span>
                )}
              </span>

              {(isDone || isActive) && (
                <span className="think-chevron" style={{ color, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
                  ›
                </span>
              )}
            </button>

            {isOpen && (
              <div className="think-detail">{step.detail}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function FlowPhase2Agents() {
  const [phase, setPhase]             = useState("idle");
  const [activeAgent, setActive]      = useState(null);
  const [outputs, setOutputs]         = useState({ artDirector: "", brandStrategist: "", brandDesigner: "", synthesizer: "" });
  const [statuses, setStatuses]       = useState({ artDirector: "waiting", brandStrategist: "waiting", brandDesigner: "waiting", synthesizer: "waiting" });
  const [messages, setMessages]       = useState([]);
  const [error, setError]             = useState(null);
  const [thinkSteps, setThinkSteps]   = useState({
    artDirector:     { completed: 0, active: null },
    brandStrategist: { completed: 0, active: null },
    brandDesigner:   { completed: 0, active: null },
    synthesizer:     { completed: 0, active: null },
  });
const {
  versions,
  approvedVersion,
  saveDraft,
  approveVersion,
  deleteVersion,
  exportJson,
} = useVersions();

const [saveOpen, setSaveOpen] = useState(false);
const [versionsOpen, setVersionsOpen] = useState(false);

const [coWorkingOpen, setCoWorkingOpen] = useState(false);
const [lastSeenMsgId, setLastSeenMsgId] = useState(null);

const unreadCount = (() => {
  if (!messages.length) return 0;
  if (!lastSeenMsgId) return messages.length;
  const idx = messages.findIndex((m) => m.id === lastSeenMsgId);
  if (idx === -1) return messages.length;
  return Math.max(0, messages.length - (idx + 1));
})();
  

function openCoWorking() {
  setCoWorkingOpen(true);
  const last = messages[messages.length - 1];
  if (last?.id) setLastSeenMsgId(last.id);
}
// ── Human + Co-Working UI state ───────────────────────────────

  const [expandedOutput, setExpandedOutput] = useState({});

  const scrollRefs = useRef({});
  const logRef     = useRef(null);

  const addMsg = (from, to, content, type) => {
    setMessages((prev) => [...prev, { from, to, content, type, id: Date.now() + Math.random() }]);
    setTimeout(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, 60);
  };

  const scrollOutput = (id) => {
    if (scrollRefs.current[id]) scrollRefs.current[id].scrollTop = scrollRefs.current[id].scrollHeight;
  };

  function buildSnapshot() {
  return {
    inputs: {
      brandContext: BRAND_CONTEXT,
      agents: AGENTS,
      synthesisSystem: SYNTHESIS_SYSTEM,
    },
    outputs: { ...outputs },
    statuses: { ...statuses },
    phase,
    activeAgent,
    messages: [...messages],
    thinkSteps: JSON.parse(JSON.stringify(thinkSteps || {})),
    expandedOutput: { ...(expandedOutput || {}) },
  };
}


  async function animateSteps(agentId) {
    const total = AGENT_STEPS[agentId]?.length || 0;
    for (let i = 0; i < total; i++) {
      setThinkSteps((prev) => ({ ...prev, [agentId]: { completed: i, active: i } }));
      await new Promise((r) => setTimeout(r, 900 + Math.random() * 500));
    }
    setThinkSteps((prev) => ({ ...prev, [agentId]: { completed: total, active: null } }));
  }

  async function runPipeline() {
    setError(null);
    setPhase("running");
    setMessages([]);
    setOutputs({ artDirector: "", brandStrategist: "", brandDesigner: "", synthesizer: "" });
    setStatuses({ artDirector: "waiting", brandStrategist: "waiting", brandDesigner: "waiting", synthesizer: "waiting" });
    setThinkSteps({ artDirector: { completed: 0, active: null }, brandStrategist: { completed: 0, active: null }, brandDesigner: { completed: 0, active: null }, synthesizer: { completed: 0, active: null } });
    setExpandedOutput({});
    const c = {};

    try {
      // 1 — ART DIRECTOR
      setActive("artDirector");
      setStatuses((s) => ({ ...s, artDirector: "running" }));
      addMsg("SYSTEM", "artDirector", "Initiating Phase 2 — Art Director, define the creative direction.", "system");
      const [adResult] = await Promise.all([
        callClaude(AGENTS.artDirector.systemPrompt, AGENTS.artDirector.userPrompt,
          (chunk) => { setOutputs((o) => ({ ...o, artDirector: chunk })); scrollOutput("artDirector"); }),
        animateSteps("artDirector"),
      ]);
      c.artDirector = adResult;
      setStatuses((s) => ({ ...s, artDirector: "done" }));
      addMsg("artDirector", "brandStrategist", "Creative direction locked. Passing narrative brief.", "handoff");
      addMsg("artDirector", "brandDesigner", "Visual guardrails set. Artifact brief incoming.", "handoff");
      await new Promise((r) => setTimeout(r, 700));

      // 2 — BRAND STRATEGIST
      setActive("brandStrategist");
      setStatuses((s) => ({ ...s, brandStrategist: "running" }));
      addMsg("brandStrategist", "ALL", "Acknowledged. Building 12-slide narrative architecture.", "status");
      const [bsResult] = await Promise.all([
        callClaude(AGENTS.brandStrategist.systemPrompt,
          `Art Director's creative direction:\n\n${c.artDirector}\n\nNow define the deck's strategic narrative — 12 slides, their purpose, and which artifacts carry most strategic weight.`,
          (chunk) => { setOutputs((o) => ({ ...o, brandStrategist: chunk })); scrollOutput("brandStrategist"); }),
        animateSteps("brandStrategist"),
      ]);
      c.brandStrategist = bsResult;
      setStatuses((s) => ({ ...s, brandStrategist: "done" }));
      addMsg("brandStrategist", "brandDesigner", "Narrative locked. Priority artifact brief embedded.", "handoff");
      await new Promise((r) => setTimeout(r, 700));

      // 3 — BRAND DESIGNER
      setActive("brandDesigner");
      setStatuses((s) => ({ ...s, brandDesigner: "running" }));
      addMsg("brandDesigner", "ALL", "Reading both briefs. Locking tokens and artifact list.", "status");
      const [bdResult] = await Promise.all([
        callClaude(AGENTS.brandDesigner.systemPrompt,
          `Art Director:\n\n${c.artDirector}\n\nBrand Strategist:\n\n${c.brandStrategist}\n\nNow define exact specs: every color hex, font name and weight, spacing value. List every artifact for the deck.`,
          (chunk) => { setOutputs((o) => ({ ...o, brandDesigner: chunk })); scrollOutput("brandDesigner"); }),
        animateSteps("brandDesigner"),
      ]);
      c.brandDesigner = bdResult;
      setStatuses((s) => ({ ...s, brandDesigner: "done" }));
      addMsg("brandDesigner", "ALL", "Specs confirmed. Artifact list locked. Ready for synthesis.", "handoff");
      await new Promise((r) => setTimeout(r, 900));

      // 4 — SYNTHESIS
      setPhase("synthesis");
      setActive("synthesizer");
      setStatuses((s) => ({ ...s, synthesizer: "running" }));
      addMsg("SYSTEM", "ALL", "All agents complete. Synthesizing Phase 2 Master Brief.", "system");
      const [synthResult] = await Promise.all([
        callClaude(SYNTHESIS_SYSTEM,
          `Synthesize into the final Phase 2 Master Brief:\n\n--- ART DIRECTOR ---\n${c.artDirector}\n\n--- BRAND STRATEGIST ---\n${c.brandStrategist}\n\n--- BRAND DESIGNER ---\n${c.brandDesigner}\n\nCreate:\n## FLOW — PHASE 2 VISUAL IDENTITY MASTER BRIEF\n### Creative Direction Summary\n### Strategic Deck Narrative (12 slides: Title | Purpose | Key Visual | Content | Design Notes)\n### Final Color System\n### Final Typography System\n### Master Slide Template Specs\n### Artifact Production Checklist\n### What This Deck Must Achieve`,
          (chunk) => { setOutputs((o) => ({ ...o, synthesizer: chunk })); scrollOutput("synthesizer"); }),
        animateSteps("synthesizer"),
      ]);
      c.synthesizer = synthResult;
      setStatuses((s) => ({ ...s, synthesizer: "done" }));
      setActive(null);
      setPhase("done");
      addMsg("SYSTEM", "ALL", "Phase 2 Master Brief complete. Ready to build the deck.", "system");

    } catch (err) {
      setError(err.message);
      setPhase("idle");
      setActive(null);
    }
  }

  return (
    <div className="app">

      {/* TOPBAR */}
      <header className="topbar">
        <div className="logo">
          <div className="logo-mark">FL</div>
          <div>
            <div className="logo-wordmark">FLOW</div>
            <div className="logo-sub">AI Program Manager</div>
          </div>
        </div>
        <div className="phase-pill">Phase 02 — Visual Identity</div>
        <button className="launch-btn" onClick={runPipeline} disabled={phase === "running" || phase === "synthesis"}>
          {phase === "idle" ? "▶ LAUNCH AGENTS" : phase === "running" ? "⟳ AGENTS WORKING..." : phase === "synthesis" ? "⟳ SYNTHESIZING..." : "↺ RE-RUN PIPELINE"}</button>

        <div className="version-actions">
          <button
            className="version-btn"
            type="button"
            onClick={() => setSaveOpen(true)}
            disabled={phase === "running" || phase === "synthesis"}
            title="Save the current outputs + system state as a version"
          >
            💾 Save
          </button>

          <button
            className="version-btn"
            type="button"
            onClick={() => setVersionsOpen(true)}
            title="Open saved versions"
          >
            🗂 Versions{approvedVersion ? " • Approved" : ""}
          </button>
        </div>

      </header>

      {/* PIPELINE BAR */}
      <div className="pipeline-bar">
        {STEPS.map((step, i) => {
          const isActive = activeAgent === step.id;
          const isDone   = statuses[step.id] === "done";
          return (
            <div key={step.id} className="pip-row">
              {i > 0 && <span className="pip-arrow">›</span>}
              <div className={`pip-step ${isActive ? "active" : isDone ? "done" : ""}`}>
                <div className={`pip-dot ${isActive ? "active" : isDone ? "done" : ""}`} />
                <span className="pip-label">{step.label}</span>
              </div>
            </div>
          );
        })}
        {phase === "done" && <span className="pip-done-tag">✓ BRIEF COMPLETE — READY TO BUILD DECK</span>}
      </div>

      {/* ERROR */}
      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error} — Check API key at <code>console.anthropic.com</code>
        </div>
      )}

      {/* HERO */}
      {phase === "idle" && (
        <div className="hero">
          <p className="hero-kicker">Multi-Agent Creative System · Phase 02</p>
          <h1 className="hero-title">Three agents.<br />One <span className="hero-accent">visual identity.</span></h1>
          <p className="hero-sub">Watch each agent think step-by-step before delivering output. Click any completed step to expand the reasoning behind it.</p>
        </div>
      )}

      {/* PALETTE STRIP */}
      <div className="palette-strip">
        <span className="palette-label">Proposed Palette</span>
        {PALETTE.map((s) => (
          <div key={s.name} className="swatch">
            <div className="swatch-color" style={{ background: s.hex }} />
            <span className="swatch-name">{s.name}</span>
            <span className="swatch-hex">{s.hex}</span>
          </div>
        ))}
        <span className="palette-note">Based on visual reference</span>
      </div>

      {/* AGENT GRID */}
      <div className="agent-grid">
        {[AGENTS.artDirector, AGENTS.brandStrategist, AGENTS.brandDesigner].map((agent) => {
          const status     = statuses[agent.id];
          const isRunning  = status === "running";
          const isDone     = status === "done";
          const isWaiting  = status === "waiting";
          const output     = outputs[agent.id];
          const steps      = thinkSteps[agent.id];
          const isExpanded = expandedOutput[agent.id];

          return (
            <div key={agent.id} className={`agent-card ${isRunning ? "is-running" : ""} ${isDone ? "is-done" : ""}`}>

              {isRunning && (
                <div className="agent-progress">
                  <div className="agent-progress-bar" style={{ background: agent.color }} />
                </div>
              )}

              <div className="agent-header">
                <div className="agent-avatar" style={{ background: (isDone || isRunning) ? agent.color : "#E8E6E0", color: (isDone || isRunning) ? agent.textColor : "#AAA" }}>
                  {agent.avatar}
                </div>
                <div className="agent-meta">
                  <div className="agent-name">{agent.name}</div>
                  <div className="agent-title">{agent.title}</div>
                </div>
                <div className="status-badge" style={{
                  background: isDone ? agent.color : isRunning ? "#0A0A0A" : "#E8E6E0",
                  color:      isDone ? agent.textColor : isRunning ? agent.color : "#AAA",
                }}>
                  {STATUS_LABEL[status]}
                </div>
              </div>

              {isWaiting && (
                <div className="waiting-state">
                  <div className="waiting-icon">{agent.emoji}</div>
                  <div className="waiting-label">Awaiting activation</div>
                </div>
              )}

              {!isWaiting && (
                <div className="think-section">
                  <div className="think-header">
                    <span style={{ color: agent.color }}>◈</span>
                    <span className="think-header-label">Agent Reasoning</span>
                    {isDone && <span className="think-header-count">{AGENT_STEPS[agent.id].length} steps completed</span>}
                    {isRunning && <span className="think-header-live" style={{ color: agent.color }}>● LIVE</span>}
                  </div>
                  <ThoughtTrace
                    steps={AGENT_STEPS[agent.id]}
                    completedSteps={steps.completed}
                    activeStep={steps.active}
                    accent={agent.color}
                    textColor={agent.textColor}
                    live={isRunning}
                    showHeader={false}
                  />
                </div>
              )}

              {isDone && (
                <button
                  className="output-toggle"
                  style={{ color: agent.color, borderColor: agent.color + "55" }}
                  onClick={() => setExpandedOutput((prev) => ({ ...prev, [agent.id]: !prev[agent.id] }))}
                >
                  {isExpanded ? "▲ Collapse full output" : "▼ Expand full output"}
                </button>
              )}

              {(isRunning || isExpanded) && (
                <div className="agent-output" ref={(el) => { scrollRefs.current[agent.id] = el; }}>
                  {isRunning && !output ? (
                    <div className="output-generating">
                      <span>{agent.emoji}</span>
                      <span>Generating response...</span>
                    </div>
                  ) : (
                    <>
                      <div dangerouslySetInnerHTML={{ __html: renderMd(output, agent.color) }} />
                      {isRunning && <span className="cursor-blink" style={{ background: agent.color }} />}
                    </>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* COMM LOG */}
      <div className="log-panel">
        <div className="log-header">
          <div>
            <div className="log-title">Agent Communication Log</div>
            <div className="log-sub">Real-time coordination between agents</div>
          </div>
          <div className="log-count">{messages.length} messages</div>
        </div>
        <div className="log-feed" ref={logRef}>
          {messages.length === 0
            ? <p className="log-empty">Agent communication will appear here once the pipeline launches.</p>
            : messages.map((msg) => {
                const fc = MSG_COLORS[msg.from] || { bg: "#222", fg: "#888" };
                return (
                  <div key={msg.id} className="log-entry">
                    <span className="log-from" style={{ background: fc.bg, color: fc.fg }}>{MSG_SHORT[msg.from] || msg.from}</span>
                    <span className="log-arrow">→</span>
                    <span className="log-to">{msg.to}</span>
                    <span className="log-msg">{msg.content}</span>
                  </div>
                );
              })
          }
        </div>
      </div>

      {/* SYNTHESIS */}
      <div className="synth-panel">
        <div className="synth-header">
          <div className="synth-title-row">
            <div className="synth-icon">⚡</div>
            <div>
              <div className="synth-title">Phase 2 Master Brief</div>
              <div className="synth-sub">Lead Creative Producer — Unified Output</div>
            </div>
          </div>
          {statuses.synthesizer === "running" && <div className="synth-status-running">SYNTHESIZING</div>}
          {statuses.synthesizer === "done" && (
            <div className="synth-status-done">
              <div>✓ BRIEF LOCKED</div>
              <div className="synth-status-sub">Ready → Build Deck</div>
            </div>
          )}
        </div>

        {statuses.synthesizer !== "waiting" && (
          <div className="think-section synth-think">
            <div className="think-header">
              <span style={{ color: "#B8FF47" }}>◈</span>
              <span className="think-header-label">Synthesis Reasoning</span>
              {statuses.synthesizer === "running" && <span className="think-header-live" style={{ color: "#B8FF47" }}>● LIVE</span>}
              {statuses.synthesizer === "done" && <span className="think-header-count">{AGENT_STEPS.synthesizer.length} steps completed</span>}
            </div>
            <ThoughtTrace
              steps={AGENT_STEPS.synthesizer}
              completedSteps={thinkSteps.synthesizer.completed}
              activeStep={thinkSteps.synthesizer.active}
              accent="#B8FF47"
              textColor="#0A0A0A"
              live={statuses.synthesizer === "running"}
              showHeader={false}
            />
          </div>
        )}

        {statuses.synthesizer === "waiting" ? (
          <div className="synth-empty">
            <div className="synth-empty-num">02</div>
            <div className="synth-empty-label">Awaiting Agent Pipeline</div>
            <p className="synth-empty-sub">Once all three agents complete, the unified Phase 2 brief will be synthesized here.</p>
          </div>
        ) : (
          <div className="synth-output" ref={(el) => { scrollRefs.current.synthesizer = el; }}>
            <div dangerouslySetInnerHTML={{ __html: renderMd(outputs.synthesizer, "#B8FF47") }} />
            {statuses.synthesizer === "running" && <span className="cursor-blink" style={{ background: "#B8FF47" }} />}
          </div>
        )}
      </div>

      {/* HUMAN + CO-WORKING (Floating button + message center) */}
      <CoWorkingFab
        isVisible={phase !== "idle"}
        isOpen={coWorkingOpen}
        onClick={() => (coWorkingOpen ? setCoWorkingOpen(false) : openCoWorking())}
        phase={phase}
        error={error}
        statuses={statuses}
        unreadCount={coWorkingOpen ? 0 : unreadCount}
      />

      <CoWorkingDrawer
        open={coWorkingOpen}
        onClose={() => setCoWorkingOpen(false)}
        messages={messages}
        accent={AGENTS.artDirector?.color || "#B8FF47"}
      />

      {/* VERSIONS (Save + Approve + Resume) */}
      <SaveVersionModal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        defaultName={
          statuses.synthesizer === "done"
            ? "Phase 2 Master Brief — baseline"
            : `Draft — ${new Date().toLocaleDateString()}`
        }
        onSave={({ name, notes, approve }) => {
          const v = saveDraft({ name, notes, snapshot: buildSnapshot() });
          setSaveOpen(false);
          if (approve) approveVersion(v.id);
        }}
      />

      <VersionsDrawer
        open={versionsOpen}
        onClose={() => setVersionsOpen(false)}
        versions={versions}
        approvedVersionId={approvedVersion?.id || null}
        onLoad={(v) => {
          if (!v) return;

          if (v.outputs) setOutputs(v.outputs);
          if (v.statuses) setStatuses(v.statuses);

          setPhase(v.phase || "idle");
          setActive(typeof v.activeAgent !== "undefined" ? v.activeAgent : null);

          if (Array.isArray(v.messages)) setMessages(v.messages);
          if (v.thinkSteps) setThinkSteps(v.thinkSteps);
          if (v.expandedOutput) setExpandedOutput(v.expandedOutput);

          setError(null);
          setVersionsOpen(false);
        }}
        onApprove={(id) => approveVersion(id)}
        onDelete={(id) => deleteVersion(id)}
        onExport={() => exportJson()}
      />

    </div>
  );
}
