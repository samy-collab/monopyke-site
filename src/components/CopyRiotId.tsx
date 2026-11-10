"use client";

import { useEffect, useState } from "react";

/** Copies the Riot ID so teammates can paste it straight into the client's friend search. */
export function CopyRiotId({ riotId }: { riotId: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const t = window.setTimeout(() => setStatus("idle"), 1800);
    return () => window.clearTimeout(t);
  }, [status]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(riotId);
      setStatus("copied");
      return;
    } catch {
      // why: the Clipboard API needs HTTPS (or localhost) and a focused page; plain HTTP on a
      // LAN address would always fail without the textarea fallback below.
    }
    const area = document.createElement("textarea");
    area.value = riotId;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    setStatus(ok ? "copied" : "failed");
  };

  return (
    <button
      type="button"
      className={`copy-id${status === "copied" ? " is-copied" : ""}`}
      onClick={copy}
      aria-label={`Copiar ${riotId}`}
      title={`Copiar ${riotId}`}
    >
      <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
        {status === "copied" ? (
          <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <rect x="8" y="8" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" fill="none" stroke="currentColor" strokeWidth="2" />
          </>
        )}
      </svg>
      <span className="copy-id__toast" role="status">
        {status === "copied" ? "Copiado!" : status === "failed" ? "Não foi possível copiar" : ""}
      </span>
    </button>
  );
}
