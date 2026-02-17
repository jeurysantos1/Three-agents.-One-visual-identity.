import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "flow_versions_v1";

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function nowId() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `v_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(
    d.getHours()
  )}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function hashString(s) {
  // lightweight hash for change detection (not crypto)
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

function computeSnapshotHash(snapshot) {
  const stable = JSON.stringify(
    {
      inputs: snapshot.inputs,
      outputs: snapshot.outputs,
      statuses: snapshot.statuses,
      phase: snapshot.phase,
      activeAgent: snapshot.activeAgent,
    },
    null,
    0
  );
  return hashString(stable);
}

function loadAll() {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return safeParse(raw, []);
}

function saveAll(list) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/**
 * Version record (stored in localStorage)
 * {
 *  id, name, status: "draft"|"approved", notes, createdAt,
 *  inputs, outputs, statuses, phase, activeAgent, messages, thinkSteps, expandedOutput,
 *  hash
 * }
 */
export function useVersions() {
  const [versions, setVersions] = useState(() => loadAll());

  // Keep in sync across tabs
  useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEY) setVersions(loadAll());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const approvedVersion = useMemo(
    () => versions.find((v) => v.status === "approved") || null,
    [versions]
  );

  const persist = useCallback((next) => {
    setVersions(next);
    saveAll(next);
  }, []);

  const saveDraft = useCallback(
    ({ name, notes = "", snapshot }) => {
      const id = nowId();
      const createdAt = Date.now();

      const v = {
        id,
        name: name?.trim() || `Draft ${new Date(createdAt).toLocaleString()}`,
        status: "draft",
        notes,
        createdAt,

        inputs: snapshot.inputs || {},
        outputs: snapshot.outputs || {},
        statuses: snapshot.statuses || {},
        phase: snapshot.phase || "idle",
        activeAgent: typeof snapshot.activeAgent !== "undefined" ? snapshot.activeAgent : null,

        messages: snapshot.messages || [],
        thinkSteps: snapshot.thinkSteps || {},
        expandedOutput: snapshot.expandedOutput || {},
      };

      v.hash = computeSnapshotHash(v);

      const next = [v, ...versions];
      persist(next);
      return v;
    },
    [versions, persist]
  );

  const approveVersion = useCallback(
    (id) => {
      const next = versions.map((v) => {
        if (v.status === "approved") return { ...v, status: "draft" };
        if (v.id === id) return { ...v, status: "approved" };
        return v;
      });
      persist(next);
      return next.find((v) => v.id === id) || null;
    },
    [versions, persist]
  );

  const deleteVersion = useCallback(
    (id) => {
      const next = versions.filter((v) => v.id !== id);
      persist(next);
      return next;
    },
    [versions, persist]
  );

  const clearAll = useCallback(() => {
    persist([]);
  }, [persist]);

  const loadVersion = useCallback(
    (id) => versions.find((v) => v.id === id) || null,
    [versions]
  );

  const exportJson = useCallback(() => {
    return JSON.stringify({ exportedAt: Date.now(), versions }, null, 2);
  }, [versions]);

  return {
    versions,
    approvedVersion,
    saveDraft,
    approveVersion,
    deleteVersion,
    clearAll,
    loadVersion,
    exportJson,
  };
}
