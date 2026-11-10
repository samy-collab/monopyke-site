"use client";

import { useState } from "react";
import { COUNTERS, type Counter } from "@/data/profile";
import { squareUrl, type DdragonData } from "@/lib/ddragon";
import { useFallbackSrc } from "@/lib/useFallbackSrc";
import { ClipVideo } from "./ClipVideo";

export function Counters({ data }: { data: DdragonData }) {
  return (
    <section id="counters" className="section" aria-labelledby="counters-title">
      <h2 id="counters-title" className="section__title">
        Counters:
      </h2>
      <p className="section__intro">Suportes que mais dão trabalho para o Pyke. Toque em um para ver o porquê.</p>
      <ul className="counters" role="list">
        {COUNTERS.map((c) => (
          <li key={c.id}>
            <CounterCard counter={c} data={data} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function CounterCard({ counter, data }: { counter: Counter; data: DdragonData }) {
  const [open, setOpen] = useState(false);
  const [clip, setClip] = useState(0);
  const [clipFailed, setClipFailed] = useState(false);
  const current = counter.clips[clip];
  // why: Data Dragon is the source of truth; the bundled copy covers networks that block Riot's domain.
  const { src, markFailed, checkSettled } = useFallbackSrc([
    squareUrl(data.version, data.images[counter.id] ?? `${counter.id}.png`),
    `/images/champions/${counter.id}.png`,
  ]);
  const panelId = `counter-${counter.id}`;

  return (
    <div className={`counter${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="counter__btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="counter__portrait">
          {src ? (
            <img
              key={src}
              src={src}
              alt=""
              width={72}
              height={72}
              loading="lazy"
              decoding="async"
              onError={() => markFailed(src)}
              ref={checkSettled}
            />
          ) : (
            <span className="champ__monogram" aria-hidden="true">
              {counter.name.slice(0, 2)}
            </span>
          )}
        </span>
        <span className="counter__name">{counter.name}</span>
        <span className="counter__hint" aria-hidden="true">
          {open ? "−" : "?"}
        </span>
      </button>
      <div id={panelId} className="counter__reason" hidden={!open}>
        <p>{counter.reason}</p>
        {counter.clips.length > 1 ? (
          <div className="counter__tabs" role="group" aria-label={`Habilidades de ${counter.name}`}>
            {counter.clips.map((c, i) => (
              <button
                key={c.ability}
                type="button"
                className="tab"
                aria-pressed={i === clip}
                onClick={() => {
                  setClip(i);
                  setClipFailed(false);
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        ) : null}
        {/* why: the clip mounts only while the card is open, so nothing downloads until the tap. */}
        {open ? (
          <figure className="counter__clip">
            {clipFailed ? (
              <span className="champ__note">Clipe indisponível</span>
            ) : (
              <ClipVideo
                key={current.ability}
                championKey={counter.key}
                ability={current.ability}
                controls
                onFail={() => setClipFailed(true)}
              />
            )}
            <figcaption>{current.label}</figcaption>
          </figure>
        ) : null}
      </div>
    </div>
  );
}
