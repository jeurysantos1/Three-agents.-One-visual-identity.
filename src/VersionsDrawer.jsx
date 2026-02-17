import { useMemo, useState } from "react";

function fmt(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "";
  }
}

export default function VersionsDrawer({
  open,
  onClose,
  versions = [],
  approvedVersionId = null,
  onLoad,     // (version) => void
  onApprove,  // (id) => void
  onDelete,   // (id) => void
  onExport,   // () => string
}) {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "approved") return versions.filter((v) => v.status === "approved");
    if (filter === "draft") return versions.filter((v) => v.status === "draft");
    return versions;
  }, [versions, filter]);

  if (!open) return null;

  return (
    <div className="vv-overlay" onClick={onClose}>
      <div
        className="vv-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Versions"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="vv-header">
          <div className="vv-header__titleRow">
            <span className="ms" aria-hidden="true">
              history
            </span>
            <h2 className="vv-header__title">Versions</h2>
          </div>

          <button className="vv-iconBtn" onClick={onClose} aria-label="Close">
            <span className="ms" aria-hidden="true">
              close
            </span>
          </button>
        </header>

        <div className="vv-toolbar">
          <div className="vv-seg">
            {[
              ["all", "All"],
              ["approved", "Approved"],
              ["draft", "Drafts"],
            ].map(([k, label]) => (
              <button
                key={k}
                className={`vv-seg__btn ${filter === k ? "vv-seg__btn--active" : ""}`}
                onClick={() => setFilter(k)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <button
            className="vv-btn vv-btn--ghost"
            type="button"
            onClick={() => {
              const json = onExport?.();
              if (!json) return;
              navigator.clipboard?.writeText(json);
            }}
            title="Copy export JSON to clipboard"
          >
            <span className="ms" aria-hidden="true">
              content_copy
            </span>
            Export
          </button>
        </div>

        <section className="vv-body">
          {filtered.length === 0 ? (
            <div className="vv-empty">
              <span className="ms vv-empty__icon" aria-hidden="true">
                bookmark
              </span>
              <div className="vv-empty__title">No saved versions</div>
              <div className="vv-empty__sub">Save a snapshot to keep work from being recreated.</div>
            </div>
          ) : (
            <ul className="vv-list">
              {filtered.map((v) => {
                const isApproved = v.status === "approved" || v.id === approvedVersionId;
                return (
                  <li key={v.id} className={`vv-item ${isApproved ? "vv-item--approved" : ""}`}>
                    <div className="vv-item__main">
                      <div className="vv-item__nameRow">
                        <div className="vv-item__name">{v.name}</div>
                        {isApproved && <span className="vv-pill">Approved</span>}
                        {!isApproved && <span className="vv-pill vv-pill--muted">Draft</span>}
                      </div>
                      <div className="vv-item__meta">{fmt(v.createdAt)}</div>
                      {v.notes ? <div className="vv-item__notes">{v.notes}</div> : null}
                    </div>

                    <div className="vv-item__actions">
                      <button className="vv-iconBtn" onClick={() => onLoad?.(v)} title="Load">
                        <span className="ms" aria-hidden="true">
                          play_arrow
                        </span>
                      </button>

                      <button className="vv-iconBtn" onClick={() => onApprove?.(v.id)} title="Approve">
                        <span className="ms" aria-hidden="true">
                          task_alt
                        </span>
                      </button>

                      <button className="vv-iconBtn" onClick={() => onDelete?.(v.id)} title="Delete">
                        <span className="ms" aria-hidden="true">
                          delete
                        </span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <footer className="vv-footer">
          <div className="vv-footer__hint">
            <span className="ms" aria-hidden="true">
              info
            </span>
            Approved versions act as your baseline. Load one to continue work without losing progress.
          </div>
        </footer>
      </div>
    </div>
  );
}
