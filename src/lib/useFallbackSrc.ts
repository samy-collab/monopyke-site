"use client";

import { useCallback, useState } from "react";

/**
 * Returns the first candidate URL that has not failed yet, or undefined when all failed.
 * invariant: failures are tracked per URL, so a new candidate list is tried from the top.
 */
export function useFallbackSrc(candidates: string[]) {
  const [failed, setFailed] = useState<string[]>([]);
  const src = candidates.find((c) => !failed.includes(c));
  const markFailed = useCallback((url: string) => setFailed((f) => (f.includes(url) ? f : [...f, url])), []);
  /** Ref callback: an image that failed before hydration never fires React's onError. */
  const checkSettled = useCallback(
    (el: HTMLImageElement | null) => {
      if (el && el.complete && el.naturalWidth === 0 && el.currentSrc) markFailed(el.getAttribute("src") ?? "");
    },
    [markFailed],
  );
  return { src, markFailed, checkSettled };
}
