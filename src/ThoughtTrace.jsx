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
import "./ThoughtTrace.css";

/**
 * ThoughtTrace
 * - Maps your thinkSteps shape:
 *    think = { completed: number, active: string | null }
 * - Renders a clean Material row list with icon + motion states
 *
 * Usage example:
 * <ThoughtTrace
 *   title="Agent Reasoning"
 *   steps={ART_DIRECTOR_STEPS}
 *   think={thinkSteps.artDirector}
 *   live={phase !== "idle"}
 * />
 */
export default function ThoughtTrace({
  title = "Agent Reasoning",
  steps = [],
  think = { completed: 0, active: null },
  live = false,
  showHeader = true,
}) {
  const completedCount = Number(think?.completed || 0);
  const activeLabel = think?.active || null;

  // Determine active index:
  // - If think.active is a label, match it
  // - else "next step" = completedCount
  const activeIndex =
    activeLabel && steps?.length
      ? Math.max(0, steps.findIndex((s) => s === activeLabel))
      : Math.min(completedCount, Math.max(0, steps.length - 1));

  function stepStatus(label, idx) {
    const done = idx < completedCount;
    const active = !done && idx === activeIndex && live;
    return { done, active };
  }

  function classifyMotion(label, done, active) {
    if (done) return "done";
    if (!active) return "idle";

    const t = String(label || "").toLowerCase();
    if (t.includes("lock")) return "locking";
    if (t.includes("cross") || t.includes("review") || t.includes("reference"))
      return "processing";
    if (t.includes("synth") || t.includes("brief") || t.includes("structure"))
      return "synthesizing";

    return "thinking";
  }

  function iconFor(motion, done) {
    if (done) return "check_circle";
    if (motion === "locking") return "lock";
    if (motion === "processing") return "sync";
    if (motion === "synthesizing") return "hub";
    if (motion === "thinking") return "psychology";
    return "radio_button_unchecked";
  }

  return (
    <div className="thoughttrace">
      {showHeader ? (
        <div className="thoughttrace-header">
          <div className="thoughttrace-titleRow">
            <div className="thoughttrace-title">{title}</div>
            <div className="thoughttrace-sub">
              {completedCount} steps completed
            </div>
          </div>

          {live ? (
            <div className="thoughttrace-livePill">
              <span className="dot" />
              LIVE
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="thoughttrace-list">
        {steps.map((label, idx) => {
          const { done, active } = stepStatus(label, idx);
          const motion = classifyMotion(label, done, active);
          const icon = iconFor(motion, done);

          return (
            <div
              key={`${idx}-${label}`}
              className={[
                "thought-step",
                motion,
                active ? "active" : "",
                done ? "done" : "",
              ].join(" ")}
            >
              <div className="thought-timeline" aria-hidden="true">
                <div className={`thought-dot ${done ? "done" : ""}`} />
                <div className="thought-line" />
              </div>

              <span className="thought-icon ms" aria-hidden="true">
                {icon}
              </span>

              <div className="thought-content">
                <div className="thought-title">{label}</div>

                {/* Inline annotation only when active */}
                {active ? (
                  <div className="thought-note">
                    {motion === "synthesizing" ? (
                      <span className="synth-dots" aria-label="Synthesizing">
                        <span className="synth-dot" />
                        <span className="synth-dot" />
                        <span className="synth-dot" />
                      </span>
                    ) : null}

                    <span className="thought-noteText">
                      {motion === "locking"
                        ? "Locking decisions into a stable baseline…"
                        : motion === "processing"
                        ? "Cross-checking constraints and aligning outputs…"
                        : motion === "synthesizing"
                        ? "Synthesizing into clear artifacts and next steps…"
                        : "Thinking through the best direction…"}
                    </span>
                  </div>
                ) : null}
              </div>

              {active ? <div className="thought-live">LIVE</div> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

