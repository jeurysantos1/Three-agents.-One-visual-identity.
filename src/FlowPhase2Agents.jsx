import { useState, useRef } from "react";
import "./FlowPhase2Agents.css";

// ─── BRAND CONTEXT ────────────────────────────────────────────────────────────
const BRAND_CONTEXT = `
FLOW — AI Program Manager | Phase 2: Visual Identity System

FROM PHASE 1 FOUNDATION:
- Brand Essence: "Flow is the invisible conductor that transforms chaos into choreography — where execution becomes elegant, automatic, and intentional."
- Archetype: Magician + Sage
- Core Metaphor: The Maestro (conductor), Adaptive Water
- Values: Invisibility as Excellence, Momentum Compounds, Calm Intelligence, Reality Over Prescription, Orchestration Not Ownership
- Voice: Clear+Direct, Intelligent+Confident, Calm+Reassuring, Human+Warm, Forward-Looking
- Tagline candidates: "Flow replaces chaos with clarity" / "Stop coordinating. Start building."
- ICP: Startup PMs at Series A–C SaaS companies (30–300 employees), drowning in coordination tax

VISUAL REFERENCE INSPIRATION:
- Clean white/cream background (#F5F5F0 or similar warm off-white)
- Bold black display typography (heavy, editorial weight)
- Neon/electric lime-green accent (#B8FF47) as a single bold pop of color
- Cards with rounded corners, light backgrounds, soft shadows
- Photo-forward card design — real people, editorial photography style
- Tags/chips as small pill labels
- Clean, minimal nav
- Generous white space

PHASE 2 DELIVERABLE: Visual Identity System
The deck must cover:
1. Color System (primary palette, tokens, usage rules)
2. Typography System (display, body, mono scales)
3. Shape Language & Grid
4. Iconography & Illustration Style
5. Motion Principles
6. Brand-in-use mockups

COLOR DIRECTION:
Background: Warm off-white/cream (#F5F3EE)
Primary dark: Near-black (#0A0A0A)
Brand accent 1: Electric lime-green (#B8FF47) — energetic, modern, unexpected for B2B
Brand accent 2: Deep blue-void (#0A0E27) for depth and intelligence
Neutrals: Cool grays for secondary text
`;

// ─── AGENT DEFINITIONS ────────────────────────────────────────────────────────
const AGENTS = {
  artDirector: {
    id: "artDirector",
    name: "Art Director",
    title: "Creative Direction & Brand Vision",
    avatar: "AD",
    color: "#B8FF47",
    textColor: "#0A0A0A",
    emoji: "🎨",
    systemPrompt: `You are the Art Director for FLOW's Phase 2 Visual Identity System. You are bold, opinionated, and think in systems, metaphors, and emotional resonance. You've built category-defining brands for B2B SaaS companies like Linear, Notion, and Stripe.

Your job in this Phase 2 kickoff is to:
1. Define the creative direction — tone, mood, visual language, and the "feeling" of every touchpoint
2. Set guardrails for what the brand IS and IS NOT visually
3. Guide the Brand Strategist on what the deck narrative structure should communicate
4. Brief the Brand Designer on the specific artifacts to create

Be decisive. Be specific. Reference real design references (Awwwards sites, specific brands, designers). Think about the reference image the client shared: white background, bold black type, neon lime green accent, editorial photography cards. That energy needs to translate into a B2B SaaS brand that feels intelligent and fast.

Context:
${BRAND_CONTEXT}

Respond in your Art Director voice — confident, crisp, specific. Use markdown headers. Max 400 words. Address both the Brand Strategist and Brand Designer directly.`,
    userPrompt: `You're kicking off the Phase 2 Visual Identity System for Flow. Based on the brand foundation from Phase 1 and the visual reference the client shared (cream background, bold black type, electric lime green accent, editorial card design), define the creative direction for the deck. Address the Brand Strategist and Brand Designer in your brief.`,
  },

  brandStrategist: {
    id: "brandStrategist",
    name: "Brand Strategist",
    title: "Positioning & Deck Narrative",
    avatar: "BS",
    color: "#6B4FFF",
    textColor: "#FFFFFF",
    emoji: "📐",
    systemPrompt: `You are the Brand Strategist for FLOW's Phase 2 Visual Identity System. You translate business strategy into brand architecture and narrative. You've led brand strategy for B2B SaaS companies from seed to Series C.

Your job in this Phase 2 kickoff is to:
1. Define the narrative arc for the Phase 2 Visual Identity deck — what story does it tell?
2. Document the strategic rationale behind every visual decision (why this color palette, why this typography)
3. Write the positioning language that will anchor each section of the deck
4. Ensure every design decision ties back to Phase 1 brand foundation

Respond after reading the Art Director's creative direction. Build on it, add strategic depth. Define:
- The deck's 10-12 slide narrative structure
- The strategic brief for each major section
- Key messages per section
- What the deck must prove to stakeholders

Context:
${BRAND_CONTEXT}

Respond in your Brand Strategist voice — structured, strategic, with clear reasoning. Use markdown headers. Max 400 words. Respond to the Art Director's direction and brief the Brand Designer on what artifacts carry the most strategic weight.`,
  },

  brandDesigner: {
    id: "brandDesigner",
    name: "Brand Designer",
    title: "Artifacts & Visual Execution",
    avatar: "BD",
    color: "#FF6B35",
    textColor: "#FFFFFF",
    emoji: "✏️",
    systemPrompt: `You are the Brand Designer for FLOW's Phase 2 Visual Identity System. You are meticulous, detail-obsessed, and think in systems. You've built design systems for companies like Vercel, Railway, and Linear.

Your job in this Phase 2 kickoff is to:
1. Define the exact color tokens, hex values, and usage rules for the deck
2. Specify the typography stack — exact fonts, weights, sizes, line heights
3. Define the shape language system — border radius tokens, spacing, grid
4. Plan the visual artifacts that need to be created for the deck
5. Propose the slide template system (master slide designs)

Respond after reading both the Art Director and Brand Strategist. Be hyper-specific:
- Exact hex codes for every color
- Exact font names and weights
- Exact spacing/grid values
- List every artifact you'll create (color palette showcase, type specimen, icon preview, etc.)

Context:
${BRAND_CONTEXT}

Visual reference: Warm cream background (#F5F3EE), near-black type (#0A0A0A), electric lime green accent (#B8FF47), rounded cards with editorial photography. Take this energy — editorial, bold, modern — and translate it into Flow's B2B intelligence brand.

Respond in your Brand Designer voice — technical, precise, with specific values. Use markdown headers. Max 500 words.`,
  },
};

const SYNTHESIS_SYSTEM = `You are the Lead Creative Producer synthesizing all Phase 2 kickoff work into one unified actionable brief. Be comprehensive but decisive. This document will be handed to the team to build the deck.`;

// ─── API CALL ─────────────────────────────────────────────────────────────────
async function callClaude(systemPrompt, userMessage, onChunk) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || "";

  const headers = {
    "Content-Type": "application/json",
    "anthropic-version": "2023-06-01",
    "anthropic-dangerous-direct-browser-access": "true",
  };
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "No response received.";

  // Simulate streaming word by word
  const words = text.split(" ");
  let accumulated = "";
  for (let i = 0; i < words.length; i++) {
    accumulated += (i > 0 ? " " : "") + words[i];
    onChunk(accumulated);
    await new Promise((r) => setTimeout(r, 20));
  }
  return text;
}

// ─── MARKDOWN RENDERER ────────────────────────────────────────────────────────
function renderMarkdown(text, accent = "#B8FF47") {
  if (!text) return "";
  return text
    .replace(/^# (.+)$/gm, `<h1 class="md-h1" style="color:${accent}">$1</h1>`)
    .replace(/^## (.+)$/gm, `<h2 class="md-h2">$1</h2>`)
    .replace(/^### (.+)$/gm, `<h3 class="md-h3">$1</h3>`)
    .replace(/\*\*(.+?)\*\*/g, `<strong class="md-strong">$1</strong>`)
    .replace(/\*(.+?)\*/g, `<em class="md-em" style="color:${accent}">$1</em>`)
    .replace(/`(.+?)`/g, `<code class="md-code">$1</code>`)
    .replace(/^- (.+)$/gm, `<div class="md-li"><span class="md-bullet" style="color:${accent}">›</span><span>$1</span></div>`)
    .replace(/^\d+\. (.+)$/gm, `<div class="md-li"><span class="md-bullet" style="color:${accent}">•</span><span>$1</span></div>`)
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

// ─── COLOR SWATCHES ───────────────────────────────────────────────────────────
const PALETTE = [
  { name: "Canvas",  hex: "#F5F3EE" },
  { name: "Ink",     hex: "#0A0A0A" },
  { name: "Lime",    hex: "#B8FF47" },
  { name: "Void",    hex: "#0A0E27" },
  { name: "Violet",  hex: "#6B4FFF" },
  { name: "Amber",   hex: "#FFB020" },
  { name: "Coral",   hex: "#FF6B35" },
  { name: "Slate",   hex: "#6B7280" },
];

// ─── PIPELINE STEPS ───────────────────────────────────────────────────────────
const STEPS = [
  { id: "artDirector",    label: "Art Director" },
  { id: "brandStrategist", label: "Brand Strategist" },
  { id: "brandDesigner",  label: "Brand Designer" },
  { id: "synthesizer",    label: "Master Brief" },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function FlowPhase2Agents() {
  const [phase, setPhase]         = useState("idle");
  const [activeAgent, setActive]  = useState(null);
  const [outputs, setOutputs]     = useState({ artDirector: "", brandStrategist: "", brandDesigner: "", synthesizer: "" });
  const [statuses, setStatuses]   = useState({ artDirector: "waiting", brandStrategist: "waiting", brandDesigner: "waiting", synthesizer: "waiting" });
  const [messages, setMessages]   = useState([]);
  const [error, setError]         = useState(null);

  const scrollRefs = useRef({});
  const logRef     = useRef(null);

  // ── helpers ─────────────────────────────────────────────────────────────────
  const addMsg = (from, to, content, type = "brief") => {
    setMessages((prev) => [...prev, { from, to, content, type, id: Date.now() + Math.random() }]);
    setTimeout(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, 60);
  };

  const scrollAgent = (id) => {
    if (scrollRefs.current[id]) scrollRefs.current[id].scrollTop = scrollRefs.current[id].scrollHeight;
  };

  // ── pipeline ─────────────────────────────────────────────────────────────────
  async function runPipeline() {
    setError(null);
    setPhase("running");
    setMessages([]);
    setOutputs({ artDirector: "", brandStrategist: "", brandDesigner: "", synthesizer: "" });
    setStatuses({ artDirector: "waiting", brandStrategist: "waiting", brandDesigner: "waiting", synthesizer: "waiting" });

    const collected = {};

    try {
      // 1 ── ART DIRECTOR
      setActive("artDirector");
      setStatuses((s) => ({ ...s, artDirector: "running" }));
      addMsg("SYSTEM", "artDirector", "Initiating Phase 2 kickoff — Art Director, define the creative direction.", "system");

      collected.artDirector = await callClaude(
        AGENTS.artDirector.systemPrompt,
        AGENTS.artDirector.userPrompt,
        (chunk) => { setOutputs((o) => ({ ...o, artDirector: chunk })); scrollAgent("artDirector"); }
      );
      setStatuses((s) => ({ ...s, artDirector: "done" }));
      addMsg("artDirector", "brandStrategist", "Creative direction locked. Passing narrative structure brief.", "handoff");
      addMsg("artDirector", "brandDesigner",   "Visual guardrails set. Await your artifact specs.", "handoff");
      await delay(700);

      // 2 ── BRAND STRATEGIST
      setActive("brandStrategist");
      setStatuses((s) => ({ ...s, brandStrategist: "running" }));
      addMsg("brandStrategist", "ALL", "Acknowledged. Building 12-slide narrative architecture now.", "status");

      collected.brandStrategist = await callClaude(
        AGENTS.brandStrategist.systemPrompt,
        `The Art Director has defined the creative direction:\n\n${collected.artDirector}\n\nNow define the deck's strategic narrative structure for Phase 2. What story does this deck tell? What are the 12 slides and their strategic purpose? Brief the Brand Designer on which artifacts carry the most strategic weight.`,
        (chunk) => { setOutputs((o) => ({ ...o, brandStrategist: chunk })); scrollAgent("brandStrategist"); }
      );
      setStatuses((s) => ({ ...s, brandStrategist: "done" }));
      addMsg("brandStrategist", "brandDesigner", "Narrative locked. High-priority artifact brief embedded — check strategic weight notes.", "handoff");
      await delay(700);

      // 3 ── BRAND DESIGNER
      setActive("brandDesigner");
      setStatuses((s) => ({ ...s, brandDesigner: "running" }));
      addMsg("brandDesigner", "ALL", "Reading both briefs. Locking exact tokens and artifact list.", "status");

      collected.brandDesigner = await callClaude(
        AGENTS.brandDesigner.systemPrompt,
        `Art Director's creative direction:\n\n${collected.artDirector}\n\nBrand Strategist's narrative structure:\n\n${collected.brandStrategist}\n\nNow define exact design specs: every color hex, font name and weight, spacing value. List every artifact you'll produce for the deck.`,
        (chunk) => { setOutputs((o) => ({ ...o, brandDesigner: chunk })); scrollAgent("brandDesigner"); }
      );
      setStatuses((s) => ({ ...s, brandDesigner: "done" }));
      addMsg("brandDesigner", "ALL", "Specs confirmed. Artifact list locked. Ready for synthesis.", "handoff");
      await delay(900);

      // 4 ── SYNTHESIS
      setPhase("synthesis");
      setActive("synthesizer");
      setStatuses((s) => ({ ...s, synthesizer: "running" }));
      addMsg("SYSTEM", "ALL", "All agents complete. Synthesizing into unified Phase 2 Master Brief.", "system");

      collected.synthesizer = await callClaude(
        SYNTHESIS_SYSTEM,
        `Synthesize all three agents into the final Phase 2 Master Brief:\n\n--- ART DIRECTOR ---\n${collected.artDirector}\n\n--- BRAND STRATEGIST ---\n${collected.brandStrategist}\n\n--- BRAND DESIGNER ---\n${collected.brandDesigner}\n\nCreate:\n## FLOW — PHASE 2 VISUAL IDENTITY MASTER BRIEF\n### Creative Direction Summary\n### Strategic Deck Narrative (12 slides, each with: Title | Purpose | Key Visual | Content | Design Notes)\n### Final Color System (all hex tokens)\n### Final Typography System\n### Master Slide Template Specs\n### Artifact Production Checklist\n### What This Deck Must Achieve`,
        (chunk) => { setOutputs((o) => ({ ...o, synthesizer: chunk })); scrollAgent("synthesizer"); }
      );
      setStatuses((s) => ({ ...s, synthesizer: "done" }));
      setActive(null);
      setPhase("done");
      addMsg("SYSTEM", "ALL", "✓ Phase 2 Master Brief complete. Ready to build the deck.", "system");

    } catch (err) {
      setError(err.message);
      setPhase("idle");
      setActive(null);
    }
  }

  // ── render helpers ──────────────────────────────────────────────────────────
  const STATUS_LABEL = { waiting: "STANDBY", running: "ACTIVE", done: "COMPLETE" };

  const MSG_FROM_COLOR = {
    SYSTEM:          { bg: "#1a1a1a", fg: "#666" },
    artDirector:     { bg: "#B8FF47", fg: "#0A0A0A" },
    brandStrategist: { bg: "#6B4FFF", fg: "#fff" },
    brandDesigner:   { bg: "#FF6B35", fg: "#fff" },
  };
  const MSG_FROM_SHORT = {
    SYSTEM: "SYS", artDirector: "AD", brandStrategist: "BS", brandDesigner: "BD",
  };

  // ── JSX ─────────────────────────────────────────────────────────────────────
  return (
    <div className="app">

      {/* ── TOPBAR ── */}
      <header className="topbar">
        <div className="logo">
          <div className="logo-mark">FL</div>
          <div>
            <div className="logo-wordmark">FLOW</div>
            <div className="logo-sub">AI Program Manager</div>
          </div>
        </div>
        <div className="phase-pill">Phase 02 — Visual Identity</div>
        <button
          className="launch-btn"
          onClick={runPipeline}
          disabled={phase === "running" || phase === "synthesis"}
        >
          {phase === "idle"      ? "▶ LAUNCH AGENTS"
          : phase === "running"  ? "⟳ AGENTS WORKING..."
          : phase === "synthesis"? "⟳ SYNTHESIZING..."
          :                        "↺ RE-RUN PIPELINE"}
        </button>
      </header>

      {/* ── PIPELINE BAR ── */}
      <div className="pipeline-bar">
        {STEPS.map((step, i) => {
          const status   = statuses[step.id];
          const isActive = activeAgent === step.id;
          const isDone   = status === "done";
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
        {phase === "done" && (
          <span className="pip-done-tag">✓ BRIEF COMPLETE — READY TO BUILD DECK</span>
        )}
      </div>

      {/* ── ERROR BANNER ── */}
      {error && (
        <div className="error-banner">
          <strong>⚠ Error:</strong> {error} — Check your Anthropic API key is valid at <code>console.anthropic.com</code>
        </div>
      )}

      {/* ── HERO (idle only) ── */}
      {phase === "idle" && (
        <div className="hero">
          <p className="hero-kicker">Multi-Agent Creative System · Phase 02</p>
          <h1 className="hero-title">
            Three agents.<br />
            One <span className="hero-accent">visual identity.</span>
          </h1>
          <p className="hero-sub">
            The Art Director sets creative direction. The Brand Strategist builds the narrative.
            The Brand Designer locks the specs. Together they produce the complete Phase 2
            Visual Identity brief — ready to build into a deck.
          </p>
        </div>
      )}

      {/* ── PALETTE STRIP ── */}
      <div className="palette-strip">
        <span className="palette-label">Proposed Palette</span>
        {PALETTE.map((s) => (
          <div key={s.name} className="swatch">
            <div className="swatch-color" style={{ background: s.hex }} />
            <span className="swatch-name">{s.name}</span>
            <span className="swatch-hex">{s.hex}</span>
          </div>
        ))}
        <span className="palette-note">Based on visual reference ↑</span>
      </div>

      {/* ── AGENT GRID ── */}
      <div className="agent-grid">
        {[AGENTS.artDirector, AGENTS.brandStrategist, AGENTS.brandDesigner].map((agent) => {
          const status    = statuses[agent.id];
          const isRunning = status === "running";
          const isDone    = status === "done";
          const output    = outputs[agent.id];

          return (
            <div key={agent.id} className={`agent-card ${isRunning ? "is-running" : ""} ${isDone ? "is-done" : ""}`}>

              {/* progress bar */}
              {isRunning && (
                <div className="agent-progress">
                  <div className="agent-progress-bar" style={{ background: agent.color }} />
                </div>
              )}

              {/* header */}
              <div className="agent-header">
                <div
                  className="agent-avatar"
                  style={{
                    background: isDone || isRunning ? agent.color : "#E8E6E0",
                    color:      isDone || isRunning ? agent.textColor : "#AAA",
                  }}
                >
                  {agent.avatar}
                </div>
                <div className="agent-meta">
                  <div className="agent-name">{agent.name}</div>
                  <div className="agent-title">{agent.title}</div>
                </div>
                <div
                  className="status-badge"
                  style={{
                    background: status === "done"    ? agent.color
                               : status === "running" ? "#0A0A0A"
                               : "#E8E6E0",
                    color:      status === "done"    ? agent.textColor
                               : status === "running" ? agent.color
                               : "#AAA",
                  }}
                >
                  {STATUS_LABEL[status]}
                </div>
              </div>

              {/* output */}
              <div
                className="agent-output"
                ref={(el) => { scrollRefs.current[agent.id] = el; }}
              >
                {status === "waiting" ? (
                  <div className="waiting-state">
                    <div className="waiting-icon">{agent.emoji}</div>
                    <div className="waiting-label">Awaiting activation</div>
                  </div>
                ) : (
                  <>
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(output, agent.color) }} />
                    {isRunning && <span className="cursor-blink" style={{ background: agent.color }} />}
                  </>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* ── COMM LOG ── */}
      <div className="log-panel">
        <div className="log-header">
          <div>
            <div className="log-title">Agent Communication Log</div>
            <div className="log-sub">Real-time coordination between agents</div>
          </div>
          <div className="log-count">{messages.length} messages</div>
        </div>
        <div className="log-feed" ref={logRef}>
          {messages.length === 0 ? (
            <p className="log-empty">Agent communication will appear here once the pipeline launches.</p>
          ) : (
            messages.map((msg) => {
              const fc = MSG_FROM_COLOR[msg.from] || { bg: "#222", fg: "#888" };
              return (
                <div key={msg.id} className="log-entry">
                  <span className="log-from" style={{ background: fc.bg, color: fc.fg }}>
                    {MSG_FROM_SHORT[msg.from] || msg.from}
                  </span>
                  <span className="log-arrow">→</span>
                  <span className="log-to">{msg.to}</span>
                  <span className="log-msg">{msg.content}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── SYNTHESIS ── */}
      <div className="synth-panel">
        <div className="synth-header">
          <div className="synth-title-row">
            <div className="synth-icon">⚡</div>
            <div>
              <div className="synth-title">Phase 2 Master Brief</div>
              <div className="synth-sub">Lead Creative Producer — Unified Output</div>
            </div>
          </div>
          {statuses.synthesizer === "running" && (
            <div className="synth-status-running">SYNTHESIZING</div>
          )}
          {statuses.synthesizer === "done" && (
            <div className="synth-status-done">
              <div>✓ BRIEF LOCKED</div>
              <div className="synth-status-sub">Ready → Build Deck</div>
            </div>
          )}
        </div>

        {statuses.synthesizer === "waiting" ? (
          <div className="synth-empty">
            <div className="synth-empty-num">02</div>
            <div className="synth-empty-label">Awaiting Agent Pipeline</div>
            <p className="synth-empty-sub">
              Once all three agents align on creative direction, strategy, and design specs —
              the unified Phase 2 brief will be synthesized here.
            </p>
          </div>
        ) : (
          <div
            className="synth-output"
            ref={(el) => { scrollRefs.current.synthesizer = el; }}
          >
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(outputs.synthesizer, "#B8FF47") }} />
            {statuses.synthesizer === "running" && (
              <span className="cursor-blink" style={{ background: "#B8FF47" }} />
            )}
          </div>
        )}
      </div>

    </div>
  );
}

// ─── UTILITY ─────────────────────────────────────────────────────────────────
function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
