import { useEffect, useMemo, useState } from "react";

/**
 * ThoughtTrace (Material + Hybrid motion)
 * steps: [{ label, detail }]
 * completedSteps: number
 * activeStep: number | null
 * accent: hex
 * textColor: hex
 */
export default function ThoughtTrace({
  steps = [],
  completedSteps = 0,
  activeStep = null,
  accent = "#6750A4",
  textColor = "#1c1b1f",
  live = false,
  showHeader = true,
  title = "ThoughtTrace",
}) {
  const [expanded, setExpanded] = useState(null);

  // Ensure indices are sane
  const activeIdx = typeof activeStep === "number" ? activeStep : null;
  const doneCount = Math.max(0, Number(completedSteps || 0));

  const rows = useMemo(() => {
    return steps.map((s, i) => {
      const label = typeof s === "string" ? s : s?.label || "";
      const detail = typeof s === "string" ? "" : s?.detail || "";

      const isDone = i < doneCount;
      const isActive = !isDone && live && activeIdx === i;
      const isLocked = !isDone && !isActive;

      const t = label.toLowerCase();

      // Hybrid motion state based on semantics
      let mode = "idle";
      if (isDone) mode = "done";
      else if (isActive) {
        if (t.includes("lock")) mode = "locking";
        else if (t.includes("cross") || t.includes("review") || t.includes("reference")) mode = "processing";
        else if (t.includes("synth") || t.includes("consolidat") || t.includes("finalis") || t.includes("finaliz") || t.includes("assembling")) mode = "synthesizing";
        else mode = "thinking";
      } else mode = "idle";

      const icon =
        isDone ? "check_circle" :
        mode === "locking" ? "lock" :
        mode === "processing" ? "sync" :
        mode === "synthesizing" ? "hub" :
        mode === "thinking" ? "psychology" :
        "radio_button_unchecked";

      return { i, label, detail, isDone, isActive, isLocked, mode, icon };
    });
  }, [steps, doneCount, live, activeIdx]);

  // Close expanded when list changes
  useEffect(() => {
    if (expanded == null) return;
    if (expanded >= rows.length) setExpanded(null);
  }, [rows.length, expanded]);

  return (
    <div className="tt-root" style={{ ["--tt-accent"]: accent, ["--tt-on-accent"]: textColor }}>
      {showHeader ? (
        <div className="tt-header">
          <div className="tt-header__left">
            <div className="tt-header__title">{title}</div>
            <div className="tt-header__meta">{doneCount} steps completed</div>
          </div>
          {live ? (
            <div className="tt-live">
              <span className="tt-live__dot" aria-hidden="true" />
              LIVE
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="tt-list">
        {rows.map((r) => {
          const isOpen = expanded === r.i;
          const canOpen = !r.isLocked && (r.isDone || r.isActive) && !!r.detail;

          return (
            <div
              key={r.i}
              className={[
                "tt-step",
                r.isActive ? "tt-step--active" : "",
                r.isDone ? "tt-step--done" : "",
                r.isLocked ? "tt-step--locked" : "",
                r.mode ? `tt-mode--${r.mode}` : "",
              ].join(" ")}
            >
              <button
                type="button"
                className="tt-row"
                onClick={() => {
                  if (!canOpen) return;
                  setExpanded(isOpen ? null : r.i);
                }}
                aria-expanded={isOpen ? "true" : "false"}
                style={{ cursor: canOpen ? "pointer" : "default" }}
              >
                <div className="tt-icon" aria-hidden="true">
                  <span className={["ms", "tt-ms", r.isActive ? "tt-ms--active" : ""].join(" ")}>
                    {r.icon}
                  </span>

                  {/* inline synth dots when synthesizing */}
                  {r.isActive && r.mode === "synthesizing" ? (
                    <span className="tt-synthDots" aria-hidden="true">
                      <span className="tt-synthDot" />
                      <span className="tt-synthDot" />
                      <span className="tt-synthDot" />
                    </span>
                  ) : null}
                </div>

                <div className="tt-body">
                  <div className="tt-label">{r.label}</div>

                  {/* Inline annotation only when active */}
                  {r.isActive ? (
                    <div className="tt-inline">
                      {r.mode === "locking"
                        ? "Locking decisions into an approved baseline…"
                        : r.mode === "processing"
                        ? "Cross-checking constraints and aligning outputs…"
                        : r.mode === "synthesizing"
                        ? "Synthesizing into artifacts + next steps…"
                        : "Thinking through the best direction…"}
                    </div>
                  ) : null}
                </div>

                <div className="tt-right">
                  {r.isActive ? <span className="tt-pill tt-pill--live">LIVE</span> : null}
                  {r.isDone ? <span className="tt-pill tt-pill--done">DONE</span> : null}
                </div>
              </button>

              {isOpen ? (
                <div className="tt-expand">
                  <div className="tt-expand__text">{r.detail}</div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
