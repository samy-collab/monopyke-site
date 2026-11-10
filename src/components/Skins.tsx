"use client";

import { useEffect, useState } from "react";
import { PYKE_SKINS, skinSrc } from "@/data/media";
import { useReducedMotion } from "@/lib/useReducedMotion";

const INTERVAL_MS = 5000;

/** Full-bleed slideshow of Pyke's skin splashes, crossfading with a slow Ken Burns pan. */
export function Skins() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const running = !paused && !reduced;

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % PYKE_SKINS.length), INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [running]);

  const go = (delta: number) => setIndex((i) => (i + delta + PYKE_SKINS.length) % PYKE_SKINS.length);
  const current = PYKE_SKINS[index];

  return (
    <section className="skins" aria-label="Galeria de skins" aria-roledescription="carrossel" data-running={running || undefined}>
      {PYKE_SKINS.map((s, i) => (
        <img
          key={s.num}
          src={skinSrc(s.num)}
          alt={i === index ? s.name : ""}
          aria-hidden={i !== index}
          className={`skins__slide${i === index ? " is-active" : ""}`}
          // why: the next slide is fetched eagerly so the crossfade never reveals an empty frame.
          loading={i === index || i === (index + 1) % PYKE_SKINS.length ? "eager" : "lazy"}
          decoding="async"
        />
      ))}
      <div className="skins__shade" aria-hidden="true" />
      <p className="skins__caption" aria-live="polite">
        <span key={current.num} className="skins__name">
          {current.name}
        </span>
      </p>
      <button type="button" className="skins__nav skins__nav--prev" aria-label="Skin anterior" onClick={() => go(-1)}>
        ‹
      </button>
      <button type="button" className="skins__nav skins__nav--next" aria-label="Próxima skin" onClick={() => go(1)}>
        ›
      </button>
      <button type="button" className="motion-toggle skins__pause" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
        {paused ? "Retomar" : "Pausar"}
      </button>
      {running ? <span key={index} className="skins__progress" aria-hidden="true" /> : null}
    </section>
  );
}
