"use client";

import { useEffect, useRef, useState } from "react";
import { PYKE } from "@/data/profile";
import { PYKE_PAGE, PYKE_VIDEOS } from "@/data/media";
import { localSplashUrl } from "@/lib/ddragon";
import { ClipVideo } from "./ClipVideo";

type Props = { open: boolean; onClose: () => void };

export function ActionDialog({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const current = PYKE_VIDEOS[index];

  return (
    <dialog
      ref={dialogRef}
      className="action-dialog"
      aria-labelledby="action-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="action-dialog__inner">
        <div className="action-dialog__head">
          <h2 id="action-title">Pyke em ação</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar vídeo">
            ✕
          </button>
        </div>

        <div className="tabs" role="group" aria-label="Escolha o vídeo">
          {PYKE_VIDEOS.map((v, i) => (
            <button
              key={v.label}
              type="button"
              className="tab"
              aria-pressed={i === index}
              onClick={() => {
                setIndex(i);
                setFailed(false);
              }}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="action-dialog__stage">
          {/* why: media is only mounted while the dialog is open, so closing it stops playback and nothing downloads before the click. */}
          {!open ? null : failed ? (
            <div className="media-fallback">
              <img src={localSplashUrl} alt="" />
              <p>
                Não consegui carregar este vídeo agora.{" "}
                <a href={PYKE_PAGE} target="_blank" rel="noreferrer">
                  Ver na página oficial do Pyke
                </a>
                .
              </p>
            </div>
          ) : current.kind === "youtube" ? (
            <iframe
              key={current.id}
              src={`https://www.youtube-nocookie.com/embed/${current.id}?autoplay=1&rel=0&modestbranding=1`}
              title={current.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <ClipVideo
              key={current.ability}
              championKey={PYKE.key}
              ability={current.ability}
              poster={localSplashUrl}
              controls
              onFail={() => setFailed(true)}
              describedBy="action-caption"
            />
          )}
        </div>
        <p id="action-caption" className="action-dialog__caption">
          {current.kind === "clip"
            ? `${current.caption} Clipe oficial, sem áudio, da página do Pyke em leagueoflegends.com.`
            : current.caption}
        </p>
      </div>
    </dialog>
  );
}
