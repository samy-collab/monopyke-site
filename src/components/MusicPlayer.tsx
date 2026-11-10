"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_LOOP } from "@/data/media";

const YT_ORIGIN = "https://www.youtube-nocookie.com";
const MUSIC_VOLUME = 15;
const CLOSED_KEY = "pyke-music-closed";

function readClosed(): boolean {
  try {
    return window.localStorage.getItem(CLOSED_KEY) === "1";
  } catch {
    // why: storage throws in private modes; without this catch the player would never mount.
    return false;
  }
}

function writeClosed(closed: boolean) {
  try {
    if (closed) window.localStorage.setItem(CLOSED_KEY, "1");
    else window.localStorage.removeItem(CLOSED_KEY);
  } catch {
    // why: storage throws in private modes; the choice is then only kept for this visit.
  }
}

// why: browsers block audio before any interaction, so the player opens muted on arrival and
// turns the sound on at the visitor's first click, tap or key.
// invariant: the player stays visible while it plays; YouTube's terms forbid audio-only use
// through a hidden player.
export function MusicPlayer() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const wantSound = useRef(false);
  const [open, setOpen] = useState(false);
  const [audible, setAudible] = useState(false);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || readClosed()) return;
    // why: mounting after first paint keeps the hero splash as the first thing that loads.
    const t = window.setTimeout(() => setOpen(true), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    let ready = false;
    const command = (func: string, args: unknown[] = []) =>
      frameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), YT_ORIGIN);
    const turnSoundOn = () => {
      wantSound.current = true;
      if (!ready) return;
      command("setVolume", [MUSIC_VOLUME]);
      command("unMute");
      command("playVideo");
      setAudible(true);
    };
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== YT_ORIGIN || typeof e.data !== "string" || !e.data.includes('"onReady"')) return;
      ready = true;
      if (wantSound.current) turnSoundOn();
    };
    const onFirstGesture = () => {
      turnSoundOn();
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
    window.addEventListener("message", onMessage);
    window.addEventListener("pointerdown", onFirstGesture);
    window.addEventListener("keydown", onFirstGesture);
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
  }, [open]);

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: HERO_LOOP.id,
    controls: "1",
    rel: "0",
    playsinline: "1",
    enablejsapi: "1",
  });

  return (
    <div className={`music${open ? " is-open" : ""}`}>
      {open && !audible ? (
        <p className="music__hint" aria-live="polite">
          ♪ Toque em qualquer lugar para ouvir
        </p>
      ) : null}
      {open ? (
        <div className="music__player">
          <iframe
            ref={frameRef}
            src={`${YT_ORIGIN}/embed/${HERO_LOOP.id}?${params.toString()}`}
            title={`Trilha do Pyke: ${HERO_LOOP.title}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            onLoad={() =>
              frameRef.current?.contentWindow?.postMessage(
                JSON.stringify({ event: "listening", id: "music", channel: "widget" }),
                YT_ORIGIN,
              )
            }
          />
          <button
            type="button"
            className="music__close"
            onClick={() => {
              writeClosed(true);
              wantSound.current = false;
              setOpen(false);
              setAudible(false);
            }}
            aria-label="Fechar trilha do Pyke"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="music__toggle"
          onClick={() => {
            writeClosed(false);
            wantSound.current = true;
            setOpen(true);
          }}
        >
          <span className="music__note" aria-hidden="true">
            ♪
          </span>
          Trilha do Pyke
        </button>
      )}
    </div>
  );
}
