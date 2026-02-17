import { useMemo } from "react";

function getFabState({ phase, error, statuses, unreadCount }) {
  if (error) return { label: "Needs attention", icon: "error", tone: "danger" };
  if (unreadCount > 0) return { label: `${unreadCount} new updates`, icon: "mark_chat_unread", tone: "info" };

  if (phase === "running") return { label: "Agents collaborating", icon: "progress_activity", tone: "live" };
  if (phase === "synthesis") return { label: "Synthesizing decisions", icon: "auto_awesome", tone: "live" };

  if (statuses?.synthesizer === "done") return { label: "Decision ready", icon: "task_alt", tone: "success" };
  if (phase === "done") return { label: "Collaboration recap", icon: "forum", tone: "info" };

  return { label: "Human + Co-Working", icon: "forum", tone: "info" };
}

export default function CoWorkingFab({
  isVisible,
  isOpen,
  onClick,
  phase,
  error,
  statuses,
  unreadCount = 0,
}) {
  const state = useMemo(
    () => getFabState({ phase, error, statuses, unreadCount }),
    [phase, error, statuses, unreadCount]
  );

  if (!isVisible) return null;

  return (
    <button
      type="button"
      className={[
        "cw-fab",
        `cw-fab--${state.tone}`,
        isOpen ? "cw-fab--open" : "",
      ].filter(Boolean).join(" ")}
      onClick={onClick}
      aria-label="Open Human + Co-Working"
      aria-expanded={isOpen}
    >
      <span className="cw-fab__icon ms" aria-hidden="true">
        {state.icon}
      </span>

      <span className="cw-fab__text">
        <span className="cw-fab__title">{state.label}</span>
        <span className="cw-fab__sub">
          {phase === "running" ? "Live feed" : statuses?.synthesizer === "done" ? "Review decisions" : "Open message center"}
        </span>
      </span>

      {phase === "running" && <span className="cw-fab__liveDot" aria-hidden="true" />}

      {unreadCount > 0 && (
        <span className="cw-fab__badge" aria-label={`${unreadCount} unread`}>
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
