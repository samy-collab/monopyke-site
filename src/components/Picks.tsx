"use client";

import { useEffect, useState } from "react";
import { AVOID_PICKS, GOOD_PICKS, PICK_TEXT, type Champion } from "@/data/profile";
import { loadDdragon, squareUrl, type DdragonData } from "@/lib/ddragon";
import { useFallbackSrc } from "@/lib/useFallbackSrc";
import { ClipVideo } from "./ClipVideo";

export function Picks({ initial }: { initial: DdragonData }) {
  const [data, setData] = useState(initial);

  useEffect(() => {
    if (initial.source === "live") return;
    // why: the build server may be offline or behind a filter that blocks Riot's domain;
    // the visitor's browser often can reach it, so it retries champion.json there.
    let alive = true;
    loadDdragon(Object.keys(initial.images)).then((live) => {
      if (alive && live.source === "live") setData(live);
    });
    return () => {
      alive = false;
    };
  }, [initial]);

  return (
    <section id="picks" className="section" aria-labelledby="picks-title">
      <h2 id="picks-title" className="section__title">
        O que pickar comigo:
      </h2>
      <p className="section__intro">
        Minhas duplas preferidas no bot. Toque em um campeão para ver uma prévia rápida.
      </p>
      <div className="picks">
        <PickList tone="good" title={PICK_TEXT.good.title} body={PICK_TEXT.good.body} champions={GOOD_PICKS} data={data} />
        <PickList
          tone="avoid"
          title={PICK_TEXT.avoid.title}
          body={PICK_TEXT.avoid.body}
          extra={PICK_TEXT.avoid.extra}
          champions={AVOID_PICKS}
          data={data}
        />
      </div>
    </section>
  );
}

function PickList(props: {
  tone: "good" | "avoid";
  title: string;
  body: string;
  extra?: string;
  champions: Champion[];
  data: DdragonData;
}) {
  const { tone, title, body, extra, champions, data } = props;
  return (
    <article className={`pick-list pick-list--${tone}`}>
      <h3 className="pick-list__title">
        <span className="pick-list__icon" aria-hidden="true">
          {tone === "good" ? "✓" : "–"}
        </span>
        {title}
      </h3>
      <ul className="pick-grid">
        {champions.map((c) => (
          <li key={c.id}>
            <ChampionCard champion={c} data={data} />
          </li>
        ))}
        {extra ? (
          <li className="pick-extra">
            <span>+ {extra}</span>
          </li>
        ) : null}
      </ul>
      <p className="pick-list__body">{body}</p>
    </article>
  );
}

function ChampionCard({ champion, data }: { champion: Champion; data: DdragonData }) {
  const [preview, setPreview] = useState(false);
  const [clipFailed, setClipFailed] = useState(false);
  // why: Data Dragon is the source of truth; the bundled copy covers networks that block Riot's domain.
  const { src, markFailed, checkSettled } = useFallbackSrc([
    squareUrl(data.version, data.images[champion.id] ?? `${champion.id}.png`),
    `/images/champions/${champion.id}.png`,
  ]);
  const imgFailed = src === undefined;

  const showVideo = preview && !clipFailed;

  return (
    <div className={`champ${showVideo ? " is-playing" : ""}`}>
      <button
        type="button"
        className="champ__media"
        aria-pressed={preview}
        aria-label={preview ? `Fechar prévia de ${champion.name}` : `Ver prévia de ${champion.name}`}
        onClick={() => {
          setPreview((p) => !p);
          setClipFailed(false);
        }}
      >
        {imgFailed ? (
          <span className="champ__monogram" aria-hidden="true">
            {champion.name.slice(0, 2)}
          </span>
        ) : (
          <img
            key={src}
            src={src}
            alt=""
            width={120}
            height={120}
            loading="lazy"
            decoding="async"
            onError={() => markFailed(src)}
            ref={checkSettled}
          />
        )}
        {showVideo ? (
          <ClipVideo
            championKey={champion.key}
            ability="R1"
            poster={imgFailed ? undefined : src}
            onFail={() => setClipFailed(true)}
          />
        ) : null}
        <span className="champ__badge" aria-hidden="true">
          {showVideo ? "❚❚" : "▶"}
        </span>
      </button>
      <span className="champ__name">{champion.name}</span>
      {preview && clipFailed ? (
        <span className="champ__note" role="status">
          Prévia indisponível
        </span>
      ) : null}
    </div>
  );
}
