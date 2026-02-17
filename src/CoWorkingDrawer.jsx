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
  )
    return "decisions";

  if (
    c.includes("?") ||
    c.includes("choose") ||
    c.includes("confirm") ||
    c.includes("need input")
  )
    return "questions";

  return "live";
}

/* Short agent labels */
function shortName
