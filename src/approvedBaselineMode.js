/**
 * Approved Baseline Mode (LocalStorage)
 *
 * Purpose:
 * - When a version is approved, treat it as the "baseline"
 * - Switch UI + agent behavior from exploration -> execution
 * - Prevent accidental overwrites of approved outputs unless explicitly allowed
 *
 * This is intentionally "stand-alone":
 * - No React required
 * - Works with your existing useVersions() / approveVersion()
 */

const BASELINE_KEY = "flow_approved_baseline_v1";
const MODE_KEY = "flow_mode_v1"; // "exploration" | "execution"

/** Safe JSON helpers */
function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

/** Public API */

export function getAppMode() {
  if (!canUseStorage()) return "exploration";
  return window.localStorage.getItem(MODE_KEY) || "exploration";
}

export function setAppMode(mode) {
  if (!canUseStorage()) return;
  const next = mode === "execution" ? "execution" : "exploration";
  window.localStorage.setItem(MODE_KEY, next);
}

export function getApprovedBaseline() {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(BASELINE_KEY);
  return safeParse(raw, null);
}

/**
 * Call this when the user approves a version.
 * Pass in the FULL version object you already store (from useVersions()).
 */
export function setApprovedBaseline(version) {
  if (!canUseStorage()) return;
  if (!version?.id) return;

  const baseline = {
    id: version.id,
    name: version.name || "Approved baseline",
    createdAt: version.createdAt || Date.now(),
    // Keep the payload you will restore from (same fields you save in versions)
    outputs: version.outputs || {},
    statuses: version.statuses || {},
    phase: version.phase || "done",
    activeAgent: version.activeAgent ?? null,
    messages: version.messages || [],
    thinkSteps: version.thinkSteps || {},
    expanded: version.expanded ?? null,
    expandedOutput: version.expandedOutput || {},
    notes: version.notes || "",
  };

  window.localStorage.setItem(BASELINE_KEY, JSON.stringify(baseline));
  setAppMode("execution");
}

export function clearApprovedBaseline() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(BASELINE_KEY);
  setAppMode("exploration");
}

/**
 * Guardrail:
 * If a baseline exists, block "exploration outputs" from overwriting it.
 *
 * Use this in your agent update code:
 * if (shouldBlockOverwrite(agentKey)) return; // don't overwrite baseline
 */
export function shouldBlockOverwrite(agentKey) {
  const mode = getAppMode();
  const baseline = getApprovedBaseline();
  if (!baseline) return false;

  // In execution mode, you usually want to prevent overwriting baseline outputs.
  // Instead, write "new work" into separate fields or a new version.
  if (mode !== "execution") return false;

  // Block overwriting any of the baseline outputs by default.
  // agentKey examples: "artDirector", "brandStrategist", "brandDesigner", "synthesizer"
  if (!agentKey) return true;
  return Object.prototype.hasOwnProperty.call(baseline.outputs || {}, agentKey);
}

/**
 * Helper: Create an "execution brief" from the baseline for agents.
 * Feed this as system context so agents know the direction is approved.
 */
export function buildExecutionBrief() {
  const baseline = getApprovedBaseline();
  if (!baseline) return null;

  return {
    mode: "execution",
    baselineId: baseline.id,
    baselineName: baseline.name,
    summary: [
      "BASELINE APPROVED ✅",
      "Stop exploring alternatives.",
      "Do not change the approved direction unless user requests it.",
      "Focus on next deliverables: specs, UI, implementation, QA checklist, rollout steps.",
    ].join("\n"),
    baselineOutputs: baseline.outputs,
  };
}
