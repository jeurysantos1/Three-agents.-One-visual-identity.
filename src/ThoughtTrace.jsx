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

import { useState, useCallback, useRef, useMemo } from "react";
import "./ThoughtTrace.css";

/**
 * useThoughtTrace — manages the animation state for a ThoughtTrace component.
 */
export function useThoughtTrace(steps = [], msPerStep = 900, msVariance = 500) {
  const [completed, setCompleted] = useState(0);
  const [active, setActive] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
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

/**
 * ThoughtTrace — renders the animated step list.
 */
export function ThoughtTrace({
  steps = [],
  completed = 0,
  active = null,
  accentColor = "#6750A4",
  accentTextColor = "#0A0A0A", // kept for API compatibility (not heavily used now)
  label = "Agent Reasoning",
  showHeader = true,
}) {
  const [expanded, setExpanded] = useState(null);

  const isRunning = active !== null;
  const isDone = completed === steps.length && !isRunning;

  const rootStyle = useMemo(
    () => ({
      // Material You accent token
      ["--tt-accent"]: accentColor,
      // if you want to use this later in CSS
      ["--tt-accent-on"]: accentTextColor,
    }),
    [accentColor, accentTextColor]
  );

  const toggle = (i) => {
    const step = steps[i];
    const isAccessible = i < completed || i === active;
    if (!isAccessible || !step?.detail) return;
    setExpanded((prev) => (prev === i ? null : i));
  };

  const iconFor = ({ isStepDone, isStepActive, isStepLocked }) => {
    if (isStepActive) return "progress_activity";
    if (isStepDone) return "check_circle";
    if (isStepLocked) return "lock";
    return "radio_button_unchecked";
  };

  return (
    <div className="tt-root" style={rootStyle}>
      {showHeader && (
        <div className="tt-header">
          <span className="tt-header-dot" aria-hidden="true" />
          <span className="tt-header-label">{label}</span>

          {isDone && (
            <span className="tt-header-badge tt-badge-done">
              {steps.length} steps
            </span>
          )}

          {isRunning && (
            <span className="tt-header-badge tt-badge-live">LIVE</span>
          )}
        </div>
      )}

      <ol className="tt-list">
        {steps.map((step, i) => {
          const isStepDone = i < completed;
          const isStepActive = i === active;
          const isStepLocked = !isStepDone && !isStepActive;
          const isOpen = expanded === i;
          const hasDetail = Boolean(step.detail);
          const isExpandable = (isStepDone || isStepActive) && hasDetail;

          return (
            <li
              key={i}
              className={[
                "tt-step",
                isStepDone ? "tt-step--done" : "",
                isStepActive ? "tt-step--active" : "",
                isStepLocked ? "tt-step--locked" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <button
                className="tt-row"
                onClick={() => toggle(i)}
                disabled={isStepLocked || !hasDetail}
                aria-expanded={isOpen}
                aria-controls={`tt-detail-${i}`}
              >
                {/* Leading icon (Material Symbols Rounded) */}
                <div className="tt-icon" aria-hidden="true">
                  {isStepActive ? (
                    // Keep spinner for “activity” feel; icon swaps still possible
                    <span className="tt-spinner" />
                  ) : (
                    <span className="tt-ms">{iconFor({ isStepDone, isStepActive, isStepLocked })}</span>
                  )}
                </div>

                {/* Label */}
                <span className="tt-label">
                  {step.label}
                  {isStepActive && (
                    <span className="tt-ellipsis" aria-hidden="true">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  )}
                </span>

                {/* Trailing chevron (only if expandable) */}
                {isExpandable && (
                  <span
                    className="tt-chevron tt-ms"
                    style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                    aria-hidden="true"
                  >
                    chevron_right
                  </span>
                )}
              </button>

              {/* Expanded detail */}
              {isOpen && hasDetail && (
                <div
                  id={`tt-detail-${i}`}
                  className="tt-detail"
                  role="region"
                  aria-label={`Detail: ${step.label}`}
                >
                  <div className="tt-detail-accent" aria-hidden="true" />
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

