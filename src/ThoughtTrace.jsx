/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THOUGHTTRACE
 * Live step-by-step reasoning trail for AI agents.
 *
 * Shows what each agent is doing before it delivers its final output.
 * Each step animates in real-time. Completed steps are clickable to
 * expand the full reasoning detail behind them.
 *
 * Usage:
 *   import { ThoughtTrace, useThoughtTrace } from "./ThoughtTrace";
 *
 *   const trace = useThoughtTrace(steps);
 *   trace.start();       // begin animating steps
 *   trace.complete();    // mark all done
 *   trace.reset();       // clear back to initial state
 *
 *   <ThoughtTrace
 *     steps={steps}         // array of { label, detail } objects
 *     completed={trace.completed}
 *     active={trace.active}
 *     accentColor="#B8FF47"
 *     accentTextColor="#0A0A0A"
 *   />
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useCallback, useRef } from "react";
import "./ThoughtTrace.css";

// ─── HOOK ─────────────────────────────────────────────────────────────────────
/**
 * useThoughtTrace — manages the animation state for a ThoughtTrace component.
 *
 * @param {Array}  steps            - array of { label, detail } step objects
 * @param {number} msPerStep        - base ms per step (default 900)
 * @param {number} msVariance       - random variance added per step (default 500)
 *
 * @returns {object} { completed, active, isRunning, isDone, start, complete, reset }
 */
export function useThoughtTrace(steps = [], msPerStep = 900, msVariance = 500) {
  const [completed, setCompleted] = useState(0);
  const [active, setActive]       = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone]       = useState(false);
  const cancelRef = useRef(false);

  const start = useCallback(async () => {
    cancelRef.current = false;
    setIsRunning(true);
    setIsDone(false);
    setCompleted(0);
    setActive(null);

    for (let i = 0; i < steps.length; i++) {
      if (cancelRef.current) break;
      setActive(i);
      setCompleted(i);
      const wait = msPerStep + Math.random() * msVariance;
      await new Promise((r) => setTimeout(r, wait));
    }

    if (!cancelRef.current) {
      setCompleted(steps.length);
      setActive(null);
      setIsRunning(false);
      setIsDone(true);
    }
  }, [steps, msPerStep, msVariance]);

  const complete = useCallback(() => {
    cancelRef.current = true;
    setCompleted(steps.length);
    setActive(null);
    setIsRunning(false);
    setIsDone(true);
  }, [steps.length]);

  const reset = useCallback(() => {
    cancelRef.current = true;
    setCompleted(0);
    setActive(null);
    setIsRunning(false);
    setIsDone(false);
  }, []);

  return { completed, active, isRunning, isDone, start, complete, reset };
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
/**
 * ThoughtTrace — renders the animated step list.
 *
 * Props:
 *   steps           {Array}   required — [{ label: string, detail: string }]
 *   completed       {number}  required — number of completed steps (from hook)
 *   active          {number|null} required — index of currently active step
 *   accentColor     {string}  optional — highlight color (default #B8FF47)
 *   accentTextColor {string}  optional — text on accent bg (default #0A0A0A)
 *   label           {string}  optional — section header label (default "Agent Reasoning")
 *   showHeader      {boolean} optional — show the section header (default true)
 */
export function ThoughtTrace({
  steps = [],
  completed = 0,
  active = null,
  accentColor = "#B8FF47",
  accentTextColor = "#0A0A0A",
  label = "Agent Reasoning",
  showHeader = true,
}) {
  const [expanded, setExpanded] = useState(null);

  const isRunning = active !== null;
  const isDone    = completed === steps.length && !isRunning;

  const toggle = (i) => {
    const step = steps[i];
    const isAccessible = i < completed || i === active;
    if (!isAccessible || !step?.detail) return;
    setExpanded((prev) => (prev === i ? null : i));
  };

  return (
    <div className="tt-root">
      {showHeader && (
        <div className="tt-header">
          <span className="tt-header-dot" style={{ color: accentColor }}>◈</span>
          <span className="tt-header-label">{label}</span>
          {isDone && (
            <span className="tt-header-badge tt-badge-done">
              {steps.length} steps
            </span>
          )}
          {isRunning && (
            <span className="tt-header-badge tt-badge-live" style={{ color: accentColor }}>
              ● LIVE
            </span>
          )}
        </div>
      )}

      <ol className="tt-list">
        {steps.map((step, i) => {
          const isStepDone   = i < completed;
          const isStepActive = i === active;
          const isStepLocked = !isStepDone && !isStepActive;
          const isOpen       = expanded === i;
          const hasDetail    = Boolean(step.detail);

          return (
            <li
              key={i}
              className={[
                "tt-step",
                isStepDone   ? "tt-step--done"   : "",
                isStepActive ? "tt-step--active"  : "",
                isStepLocked ? "tt-step--locked"  : "",
              ].filter(Boolean).join(" ")}
            >
              {/* ── ROW ── */}
              <button
                className="tt-row"
                onClick={() => toggle(i)}
                disabled={isStepLocked || !hasDetail}
                aria-expanded={isOpen}
                aria-label={`${step.label}${hasDetail ? " — click to expand reasoning" : ""}`}
              >
                {/* icon */}
                <div
                  className="tt-icon"
                  style={{
                    background: (isStepDone || isStepActive) ? accentColor : "#E8E6E0",
                    color:      (isStepDone || isStepActive) ? accentTextColor : "#BBBBBB",
                  }}
                >
                  {isStepActive ? (
                    <span className="tt-spinner" />
                  ) : isStepDone ? (
                    <span className="tt-check">✓</span>
                  ) : (
                    <span className="tt-num">{i + 1}</span>
                  )}
                </div>

                {/* label */}
                <span
                  className="tt-label"
                  style={{
                    color:      (isStepDone || isStepActive) ? "#0A0A0A" : "#CCCCCC",
                    fontWeight: isStepActive ? 600 : isStepDone ? 500 : 400,
                  }}
                >
                  {step.label}
                  {isStepActive && (
                    <span className="tt-ellipsis" aria-hidden="true">
                      <span>.</span><span>.</span><span>.</span>
                    </span>
                  )}
                </span>

                {/* chevron — only when expandable */}
                {(isStepDone || isStepActive) && hasDetail && (
                  <span
                    className="tt-chevron"
                    style={{
                      color:     accentColor,
                      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                )}
              </button>

              {/* ── EXPANDED DETAIL ── */}
              {isOpen && hasDetail && (
                <div className="tt-detail" role="region" aria-label={`Detail: ${step.label}`}>
                  <div
                    className="tt-detail-accent"
                    style={{ background: accentColor }}
                  />
                  <p className="tt-detail-text">{step.detail}</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default ThoughtTrace;
