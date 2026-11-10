"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

const BUBBLES_MS = 2300;

// invariant: fixed values keep server and client markup identical (no hydration mismatch).
const BUBBLES = Array.from({ length: 42 }, (_, i) => ({
  left: (i * 23.7) % 100,
  size: 8 + ((i * 11) % 30),
  delay: ((i * 29) % 60) / 100,
  duration: 1.2 + ((i * 17) % 8) / 10,
  drift: ((i % 7) - 3) * 14,
}));

const VOICE_VOLUME = 0.35;
let voice: HTMLAudioElement | null = null;

function playVoice(src: string) {
  try {
    voice?.pause();
    voice = new Audio(src);
    voice.volume = VOICE_VOLUME;
    // why: play() rejects where Ogg Vorbis is unsupported (older Safari) or audio is blocked;
    // the jump still happens, just without the line.
    void voice.play().catch(() => undefined);
  } catch {
    // why: Audio is missing in some embedded webviews; without this catch the click would throw.
  }
}

function jumpTo(hash: string, smooth: boolean) {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;
  target.scrollIntoView({ behavior: smooth ? "smooth" : "instant", block: "start" });
  history.replaceState(null, "", hash);
  // why: moving focus to the section heading tells screen readers where the jump landed.
  const heading = target.querySelector<HTMLElement>("h2") ?? target;
  heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });
}

export function useDive() {
  const [burst, setBurst] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 0);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(timer.current);
    };
  }, []);

  const dive = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    const hash = event.currentTarget.getAttribute("href");
    if (!hash?.startsWith("#")) return;
    event.preventDefault();
    // invariant: only links with data-voice play a line; the rest jump silently.
    const line = event.currentTarget.dataset.voice;
    if (line) playVoice(line);
    // why: under prefers-reduced-motion the page jumps straight to the section, with no bubbles.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      jumpTo(hash, false);
      return;
    }
    setBurst(Date.now());
    jumpTo(hash, true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setBurst(null), BUBBLES_MS);
  }, []);

  const overlay =
    mounted && burst
      ? createPortal(
          <div key={burst} className="dive" aria-hidden="true">
            {BUBBLES.map((b, i) => (
              <span
                key={i}
                className="dive__bubble"
                style={
                  {
                    left: `${b.left}%`,
                    width: b.size,
                    height: b.size,
                    animationDelay: `${b.delay}s`,
                    animationDuration: `${b.duration}s`,
                    "--drift": `${b.drift}px`,
                  } as CSSProperties
                }
              />
            ))}
          </div>,
          document.body,
        )
      : null;

  return { dive, overlay };
}
