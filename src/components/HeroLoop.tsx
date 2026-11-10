"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_LOOP } from "@/data/media";

const YT_ORIGIN = "https://www.youtube-nocookie.com";
const HD_QUALITIES = new Set(["hd720", "hd1080", "hd1440", "hd2160", "highres"]);
const GIVE_UP_MS = 25000;
const MIN_DOWNLINK_MBPS = 2.5;

type NetworkInfo = { effectiveType?: string; downlink?: number; saveData?: boolean };

/**
 * Decides whether the background loop is worth trying on this visitor's connection.
 * why: browsers without the Network Information API (Safari, Firefox) report nothing, so
 * they get a try; the HD gate below still keeps a blurry stream off screen.
 */
function connectionAllowsVideo(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const net = (navigator as Navigator & { connection?: NetworkInfo }).connection;
  if (!net) return true;
  if (net.saveData) return false;
  if (net.effectiveType && net.effectiveType !== "4g") return false;
  // why: YouTube's own guidance for 720p is about 2.5 Mbps; below that HD is unlikely.
  if (typeof net.downlink === "number" && net.downlink < MIN_DOWNLINK_MBPS) return false;
  return true;
}

/**
 * Official Login Screen (the animated default splash) as a muted background loop.
 * invariant: the player is visible only while YouTube reports playerState 1 (playing) at an
 * HD quality; while loading, buffering, paused or below 720p the splash underneath shows.
 */
export function HeroLoop({ paused }: { paused: boolean }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hd, setHd] = useState(false);
  const hdRef = useRef(false);

  useEffect(() => {
    if (!connectionAllowsVideo()) return;
    // why: mounting after first paint keeps the splash as the LCP image and SSR video-free.
    const t = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let reveal = 0;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== YT_ORIGIN || typeof e.data !== "string") return;
      let msg: { info?: { playerState?: number; playbackQuality?: string } | number };
      try {
        msg = JSON.parse(e.data);
      } catch {
        // why: the embed also posts non-JSON strings; without this catch they would throw here.
        return;
      }
      const info = msg.info;
      const state = typeof info === "number" ? info : info?.playerState;
      const quality = typeof info === "object" ? info?.playbackQuality : undefined;
      if (quality) {
        hdRef.current = HD_QUALITIES.has(quality);
        setHd(hdRef.current);
      }
      if (state === 1) {
        window.clearTimeout(reveal);
        // why: a short delay lets YouTube's title overlay fade before the player is shown.
        reveal = window.setTimeout(() => setPlaying(true), 900);
      } else if (state !== undefined) {
        window.clearTimeout(reveal);
        setPlaying(false);
      }
    };
    window.addEventListener("message", onMessage);
    const giveUp = window.setTimeout(() => {
      if (!hdRef.current) setMounted(false);
    }, GIVE_UP_MS);
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(giveUp);
      window.clearTimeout(reveal);
    };
  }, [mounted]);

  useEffect(() => {
    const win = frameRef.current?.contentWindow;
    if (!win || !mounted) return;
    win.postMessage(JSON.stringify({ event: "command", func: paused ? "pauseVideo" : "playVideo", args: [] }), YT_ORIGIN);
  }, [paused, mounted]);

  if (!mounted) return null;

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: HERO_LOOP.id,
    controls: "0",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    rel: "0",
    playsinline: "1",
    enablejsapi: "1",
  });
  const visible = playing && hd && !paused;

  return (
    <iframe
      ref={frameRef}
      className={`hero__video${visible ? " is-visible" : ""}`}
      src={`${YT_ORIGIN}/embed/${HERO_LOOP.id}?${params.toString()}`}
      title={HERO_LOOP.title}
      allow="autoplay; encrypted-media"
      tabIndex={-1}
      aria-hidden="true"
      onLoad={() =>
        frameRef.current?.contentWindow?.postMessage(
          JSON.stringify({ event: "listening", id: "hero-loop", channel: "widget" }),
          YT_ORIGIN,
        )
      }
    />
  );
}
