"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "./icons";
import type { GalleryPhoto } from "@/lib/types";

export function PhotoMosaic({ photos, label }: { photos: GalleryPhoto[]; label: string }) {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const total = photos.length;
  const step = useCallback(
    (delta: number) => setActive((current) => (current === null ? current : (current + delta + total) % total)),
    [total],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active === null) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
  }, [active]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, step]);

  if (!total) return null;
  const current = active === null ? null : photos[active];

  return (
    <div className="photo-mosaic-wrap" id="photos">
      <div className="photo-mosaic">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className={index === 0 ? "lead" : undefined}
            onClick={() => setActive(index)}
            aria-label={`${photo.caption || photo.alt}. Open photograph`}
          >
            <Image src={photo.src} alt={photo.alt} fill sizes={index === 0 ? "(max-width: 800px) 100vw, 50vw" : "(max-width: 800px) 50vw, 25vw"} priority={index === 0} />
            {photo.caption && <span>{photo.caption}</span>}
          </button>
        ))}
      </div>
      <dialog ref={dialogRef} className="lightbox" onClose={() => setActive(null)} aria-label={`${label} photographs`} onClick={(event) => { if (event.target === dialogRef.current) setActive(null); }}>
        {current && (
          <div className="lightbox-inner">
            <div className="lightbox-top">
              <p><span>{label}</span><span>{String((active ?? 0) + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span></p>
              <button type="button" onClick={() => setActive(null)} aria-label="Close photograph"><X size={20} /></button>
            </div>
            <figure className="lightbox-stage">
              <Image key={current.id} src={current.src} alt={current.alt} fill sizes="100vw" priority />
            </figure>
            {current.caption && <p className="mosaic-caption">{current.caption}</p>}
            {total > 1 && (
              <>
                <button type="button" className="lightbox-nav prev" onClick={() => step(-1)} aria-label="Previous photograph"><ChevronLeft size={26} /></button>
                <button type="button" className="lightbox-nav next" onClick={() => step(1)} aria-label="Next photograph"><ChevronRight size={26} /></button>
              </>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
