"use client";

import { useEffect, useRef, useState } from "react";
import { PYKE_TITLE } from "@/data/media";
import { localSplashUrl, pykeSplashUrl } from "@/lib/ddragon";
import { useFallbackSrc } from "@/lib/useFallbackSrc";
import { ActionDialog } from "./ActionDialog";
import { useDive } from "./DiveTransition";
import { HeroLoop } from "./HeroLoop";

// invariant: fixed values keep server and client markup identical (no hydration mismatch).
const MOTES = Array.from({ length: 14 }, (_, i) => ({
  left: 36 + ((i * 41) % 62),
  delay: -((i * 2.3) % 14),
  duration: 12 + ((i * 7) % 10),
}));

export function Hero() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { dive, overlay } = useDive();
  // why: Data Dragon is the source of truth; the bundled copy covers networks that block Riot's domain.
  const { src: splashSrc, markFailed: markSplashFailed, checkSettled: checkSplash } = useFallbackSrc([pykeSplashUrl, localSplashUrl]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    let frame = 0;
    const onPointer = (e: PointerEvent) => {
      if (reduce.matches || paused || !fine.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        scene.style.setProperty("--px", (e.clientX / window.innerWidth - 0.5).toFixed(3));
        scene.style.setProperty("--py", (e.clientY / window.innerHeight - 0.5).toFixed(3));
      });
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [paused]);

  return (
    <header className="hero" data-paused={paused || undefined}>
      <div className="hero__scene" ref={sceneRef} aria-hidden="true">
        <div className="hero__backdrop" />
        <div className="hero__art">
          {splashSrc ? (
            <img
              key={splashSrc}
              src={splashSrc}
              alt=""
              className="hero__splash"
              fetchPriority="high"
              decoding="async"
              onError={() => markSplashFailed(splashSrc)}
              ref={checkSplash}
            />
          ) : null}
          <HeroLoop paused={paused} />
        </div>
        <div className="hero__grade" />
        <div className="hero__motes">
          {MOTES.map((m, i) => (
            <span key={i} style={{ left: `${m.left}%`, animationDelay: `${m.delay}s`, animationDuration: `${m.duration}s` }} />
          ))}
        </div>
        <div className="hero__fog" />
        <div className="hero__vignette" />
      </div>

      <div className="hero__content">
        <p className="eyebrow">Suporte • League of Legends</p>
        <h1 className="hero__title">Mono Pyke</h1>
        <p className="hero__champ">
          Pyke, <span>{PYKE_TITLE}</span>
        </p>
        <p className="hero__lead">
          Shhhh, apenas...durma com os peixes...
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary btn--pulse" href="#picks" data-voice="/audio/pyke-choose-ptbr.ogg" onClick={dive}>
            O que pickar comigo <span aria-hidden="true">↓</span>
          </a>
          <a className="btn btn--sheen" href="#counters" data-voice="/audio/pyke-ban-ptbr.ogg" onClick={dive}>
            Meus counters
          </a>
          <a className="btn btn--orbit" href="#como-eu-jogo" onClick={dive}>
            Como eu jogo?
          </a>
          <button type="button" className="link-subtle link-subtle--button" onClick={() => setDialogOpen(true)}>
            <span aria-hidden="true">▶</span> Ver Pyke em ação
          </button>
        </div>
      </div>

      <button type="button" className="motion-toggle" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
        {paused ? "Retomar animação" : "Pausar animação"}
      </button>

      <ActionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      {overlay}
    </header>
  );
}
