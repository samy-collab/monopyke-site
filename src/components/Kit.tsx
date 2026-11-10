"use client";

import { useState } from "react";
import { PYKE_KIT, PYKE_PAGE } from "@/data/media";
import { PYKE } from "@/data/profile";
import { localSplashUrl } from "@/lib/ddragon";
import { ClipVideo } from "./ClipVideo";

export function Kit() {
  const [index, setIndex] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const current = index === null ? null : PYKE_KIT[index];

  return (
    <section className="section kit" aria-labelledby="kit-title">
      <h2 id="kit-title" className="section__title">
        O kit que eu domino
      </h2>
      <p className="section__intro">Toque em uma habilidade para ver o clipe oficial.</p>

      <div className="kit__layout">
        <ul className="kit__list" role="list">
          {PYKE_KIT.map((a, i) => (
            <li key={a.key}>
              <button
                type="button"
                className="kit__btn"
                aria-pressed={index === i}
                onClick={() => {
                  setIndex(i);
                  setFailed(false);
                }}
              >
                <span className="kit__icon">
                  <img src={a.icon} alt="" width={56} height={56} />
                  <span className="kit__key" aria-hidden="true">
                    {a.key}
                  </span>
                </span>
                <span className="kit__text">
                  <span className="kit__name">{a.name}</span>
                  <span className="kit__blurb">{a.blurb}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="kit__stage">
          {current === null ? (
            <div className="kit__placeholder">
              <img src={localSplashUrl} alt="" />
              <p>Escolha uma habilidade</p>
            </div>
          ) : failed ? (
            <div className="media-fallback">
              <img src={localSplashUrl} alt="" />
              <p>
                Não consegui carregar este clipe.{" "}
                <a href={PYKE_PAGE} target="_blank" rel="noreferrer">
                  Ver na página oficial do Pyke
                </a>
                .
              </p>
            </div>
          ) : (
            <ClipVideo
              key={current.ability}
              championKey={PYKE.key}
              ability={current.ability}
              poster={localSplashUrl}
              controls
              onFail={() => setFailed(true)}
              describedBy="kit-caption"
            />
          )}
          {current ? (
            <p id="kit-caption" className="kit__caption">
              <strong>
                {current.key} · {current.name}
              </strong>{" "}
              — clipe oficial, sem áudio.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
