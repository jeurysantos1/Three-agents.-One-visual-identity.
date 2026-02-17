import { useEffect, useMemo, useState } from "react";

/* Categorize messages into UX-friendly buckets */
function categorize(msg) {
  const t = (msg.type || "").toLowerCase();
  const c = (msg.content || "").toLowerCase();

  if (t.includes("system") || msg.from === "SYSTEM") return "actions";

  if (
    c.includes("decision") ||
    c.includes("locked") ||
    c.includes("final") ||
    c.includes("approved")
  ) {
    return "decisions";
  }

  if (
    c.includes("?") ||
    c.includes("choose") ||
    c.includes("confirm") ||
    c.includes("need input") ||
    c.includes("need your input")
  ) {
    return "questions";
  }

  return "live";
}

/* Short agent labels */
function shortName(from) {
  if (!from) return "AG";
  if (from === "SYSTEM") return "SYS";
  if (from === "artDirector") return "AD";
  if (from === "brandStrategist") return "BS";
  if (from === "brandDesigner") return "BD";
  if (from === "synthesizer") return "CP";
  return String(from).slice(0, 2).toUpperCase();
}

export default function CoWorkingDrawer({
  open,
  onClose,
  messages = [],
  accent = "#B8FF47",
  title = "Human + Co-Working",
  subtitle = "A transparent view of how your agents align and decide.",
}) {
  const [tab, setTab] = useState("live");

  useEffect(() => {
    if (!open) return;

    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const grouped = useMemo(() => {
    const out = { live: [], decisions: [], questions: [], actions: [] };

    for (const m of messages) {
      const cat = categorize(m);
      out[cat].push(m);
    }

    return out;
  }, [messages]);

  const items = grouped[tab] || [];

  if (!open) return null;

  return (
    <div className="cw-overlay" onClick={onClose}>
      <div
        className="cw-drawer"
        style={{ ["--cw-accent"]: accent }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <header className="cw-header">
          <div className="cw-header__titles">
            <div className="cw-header__titleRow">
              <span className="ms cw-header__spark" aria-hidden="true">
                hub
              </span>
              <h2 className="cw-header__title">{title}</h2>
            </div>
            <p className="cw-header__subtitle">{subtitle}</p>
          </div>

          <button className="cw-iconBtn" onClick={onClose} aria-label="Close">
            <span className="ms" aria-hidden="true">
              close
            </span>
          </button>
        </header>

        {/* Tabs */}
        <nav className="cw-tabs" aria-label="Co-working tabs">
          {[
            ["live", "Live feed", grouped.live.length],
            ["decisions", "Decisions", grouped.decisions.length],
            ["questions", "Questions", grouped.questions.length],
            ["actions", "Actions", grouped.actions.length],
          ].map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              className={`cw-tab ${tab === key ? "cw-tab--active" : ""}`}
              onClick={() => setTab(key)}
            >
              {label}
              <span className="cw-tab__count">{count}</span>
            </button>
          ))}
        </nav>

        {/* Body */}
        <section className="cw-body">
          {items.length === 0 ? (
            <div className="cw-empty">
              <span className="ms cw-empty__icon" aria-hidden="true">
                chat_bubble_outline
              </span>
              <div className="cw-empty__title">No updates yet</div>
              <div className="cw-empty__sub">
                When agents collaborate, messages will appear here.
              </div>
            </div>
          ) : (
            <ul className="cw-feed" aria-label="Agent collaboration feed">
              {items.map((m) => (
                <li key={m.id} className="cw-item">
                  <div className="cw-item__avatar" aria-hidden="true">
                    {shortName(m.from)}
                  </div>

                  <div className="cw-item__content">
                    <div className="cw-item__meta">
                      <span>{shortName(m.from)}</span>
                      <span aria-hidden="true">→</span>
                      <span>{String(m.to || "ALL")}</span>
                    </div>

                    <div className="cw-item__text">{m.content}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Footer */}
        <footer className="cw-footer">
          <div className="cw-footer__hint">
            <span className="ms" aria-hidden="true">
              info
            </span>
            This shows collaboration outputs and decisions — not private AI
            reasoning.
          </div>
        </footer>
      </div>
    </div>
  );
}
