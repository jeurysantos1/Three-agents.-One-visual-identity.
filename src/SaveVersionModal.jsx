import { useEffect, useState } from "react";

export default function SaveVersionModal({
  open,
  onClose,
  onSave, // ({ name, notes, approve }) => void
  defaultName = "",
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

          <button className="vv-iconBtn" onClick={onClose} aria-label="Close">
            <span className="ms" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        <div className="vv-modal__body">
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
