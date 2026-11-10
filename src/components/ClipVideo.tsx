"use client";

import { forwardRef } from "react";
import type { Ability } from "@/data/media";
import { abilityClipSources } from "@/lib/ddragon";

type Props = {
  championKey: number;
  ability: Ability;
  poster?: string;
  controls?: boolean;
  onFail: () => void;
  describedBy?: string;
};

/** Silent looping official ability clip; mounted only after the viewer asks for it. */
export const ClipVideo = forwardRef<HTMLVideoElement, Props>(function ClipVideo(
  { championKey, ability, poster, controls, onFail, describedBy },
  ref,
) {
  const sources = abilityClipSources(championKey, ability);
  return (
    <video
      ref={ref}
      poster={poster}
      controls={controls}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      aria-describedby={describedBy}
    >
      {sources.map((s, i) => (
        <source
          key={s.src}
          src={s.src}
          type={s.type}
          // invariant: <video> only reports source failures on the <source> nodes; the
          // last one failing means every candidate was tried.
          onError={i === sources.length - 1 ? onFail : undefined}
        />
      ))}
    </video>
  );
});
