import { useEffect, useMemo, useState } from "react";

/**
 * SaveVersionModal — M3 Expressive chips preview
 *
 * New props (optional, backwards compatible):
 * - preview: {
 *     hasArtDirector?: boolean,
 *     hasBrandStrategist?: boolean,
 *     hasBrandDesigner?: boolean,
 *     hasSynthesizer?: boolean,
 *     hasMasterBrief?: boolean,
 *     hasMessages?: boolean
 *   }
 * - doc: { url?: string, label?: string }  // if you later generate Google Docs
 */
export default function SaveVersionModal({
  open,
  onClose,
  onSave, // ({ name, notes, approve }) => void
  defaultName = "",
  preview,
  doc,
}) {
  const [name, setName] = useState(defaultName);
  const [notes, setNotes] = useState("");
  const [approve, setApprove] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(defaultName || "");
    setNotes("");
    setApprove(false);
  }, [open, defaultName]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const chips = useMemo(() => {
    // If caller doesn't pass preview, show the “expected artifacts” anyway
    const p = preview || {};
    const list = [
      { key: "ad", label: "Art Director output", icon: "palette", on: p.hasArtDirector ?? true },
      { key: "bs", label: "Brand Strategist output", icon: "strategy", on: p.hasBrandStrategist ?? true },
      { key: "bd", label: "Brand Designer output", icon: "draw", on: p.hasBrandDesigner ?? true },
      { key: "cp", label: "Synthesizer output", icon: "hub", on: p.hasSynthesizer ?? true },
      { key: "mb", label: "Master brief", icon: "description", on: p.hasMasterBrief ?? true },
      { key: "log", label: "Co-working log", icon: "forum", on: p.hasMessages ?? true },
    ].filter((c) => c.on);

    // If literally everything is false, show nothing instead of an empty area
    return list;
  }, [preview]);

  if (!open) return null;

  return (
    <div className="vv-overlay" onClick={onClose}>
      <div
        className="vv-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Save version"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vv-modal__header">
          <div className="vv-modal__titleRow">
            <span className="ms" aria-hidden="true">
              bookmark_add
            </span>
            <div className="vv-modal__title">Save version</div>
          </div>

          <button className="vv-iconBtn" onClick={onClose} aria-label="Close" type="button">
            <span className="ms" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        <div className="vv-modal__body">
          {/* M3 Expressive — “what will be saved” */}
          {chips.length ? (
            <div className="vv-section">
              <div className="vv-section__label">Will save</div>
              <div className="vv-chipRow" role="list">
                {chips.map((c) => (
                  <span className="vv-chip vv-chip--tonal" role="listitem" key={c.key}>
                    <span className="ms" aria-hidden="true">
                      {c.icon}
                    </span>
                    {c.label}
                  </span>
                ))}
              </div>

              {/* Optional: doc link (future) */}
              {doc?.url ? (
                <a className="vv-chip vv-chip--link" href={doc.url} target="_blank" rel="noreferrer">
                  <span className="ms" aria-hidden="true">
                    open_in_new
                  </span>
                  {doc.label || "Open doc"}
                </a>
              ) : null}
            </div>
          ) : null}

          <label className="vv-field">
            <div className="vv-label">Version name</div>
            <input
              className="vv-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Phase 2 baseline v1"
              autoFocus
            />
          </label>

          <label className="vv-field">
            <div className="vv-label">Notes (optional)</div>
            <textarea
              className="vv-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why this is the right direction, what changed, what to do next…"
              rows={4}
            />
          </label>

          <label className="vv-check">
            <input
              type="checkbox"
              checked={approve}
              onChange={(e) => setApprove(e.target.checked)}
            />
            <span>Approve immediately (lock as baseline)</span>

            {approve ? (
              <span className="vv-chip vv-chip--approve" style={{ marginLeft: 10 }}>
                <span className="ms" aria-hidden="true">task_alt</span>
                Approved baseline
              </span>
            ) : null}
          </label>
        </div>

        <div className="vv-modal__footer">
          <button className="vv-btn" onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className="vv-btn vv-btn--primary"
            type="button"
            onClick={() => onSave?.({ name, notes, approve })}
          >
            <span className="ms" aria-hidden="true">
              save
            </span>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
