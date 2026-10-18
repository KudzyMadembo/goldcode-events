"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "./icons";
import { allPhotos, galleryEvent, galleryPath, highlights } from "@/lib/gallery";
import { assetPath } from "@/lib/paths";

const INITIAL_REMAINDER = 12;
const indexOf = (file: string) => allPhotos.indexOf(file);
const pad = (value: number) => String(value).padStart(2, "0");

export function EventGallery() {
  const [active, setActive] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const total = allPhotos.length;

  const step = useCallback(
    (delta: number) =>
      setActive((current) => (current === null ? current : (current + delta + total) % total)),
    [total],
  );
  const close = () => setActive(null);

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

  const remaining = allPhotos.slice(highlights.length);
  const visible = expanded ? remaining : remaining.slice(0, INITIAL_REMAINDER);

  return (
    <>
      <section className="gallery-chapter">
        <header className="chapter-head">
          <p className="chapter-index">01</p>
          <div>
            <h2>Highlights</h2>
            <p>Thirteen frames that carry the feeling of the night.</p>
          </div>
        </header>
        <div className="highlight-grid">
          {highlights.map((item, position) => (
            <button
              key={item.file}
              type="button"
              className={`frame ${item.size}`}
              onClick={() => setActive(indexOf(item.file))}
              aria-label={`${item.caption}. Open photograph`}
            >
              <Image
                src={assetPath(galleryPath(item.file))}
                alt={item.alt}
                fill
                sizes={item.size === "large" ? "(max-width: 800px) 100vw, 66vw" : "(max-width: 800px) 50vw, 33vw"}
                priority={position < 2}
              />
              <span className="frame-caption">
                <small>{pad(position + 1)}</small>
                {item.caption}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="gallery-chapter">
        <header className="chapter-head">
          <p className="chapter-index">02</p>
          <div>
            <h2>Every frame</h2>
            <p>{total} photographs from {galleryEvent.name}, in the order they were taken.</p>
          </div>
        </header>
        <div className="frame-grid">
          {visible.map((file) => {
            const index = indexOf(file);
            return (
              <button
                key={file}
                type="button"
                className="frame"
                onClick={() => setActive(index)}
                aria-label={`Open photograph ${index + 1} of ${total}`}
              >
                <Image
                  src={assetPath(galleryPath(file))}
                  alt={`${galleryEvent.name} photograph ${index + 1}`}
                  fill
                  sizes="(max-width: 800px) 50vw, 25vw"
                  loading="lazy"
                />
                <span className="frame-caption"><small>{pad(index + 1)}</small></span>
              </button>
            );
          })}
        </div>
        <div className="gallery-foot">
          {!expanded && remaining.length > visible.length && (
            <button type="button" className="button ghost-button" onClick={() => setExpanded(true)}>
              View all {total} photographs
            </button>
          )}
          <a className="text-link" href={galleryEvent.driveUrl} target="_blank" rel="noreferrer">
            Full-resolution originals <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Photograph viewer"
        onClose={close}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        {active !== null && (
          <div className="lightbox-inner">
            <div className="lightbox-top">
              <p>
                <span>{galleryEvent.name}</span>
                <span>{pad(active + 1)} / {total}</span>
              </p>
              <button type="button" onClick={close} aria-label="Close viewer"><X size={20} /></button>
            </div>
            <figure className="lightbox-stage">
              <Image
                key={allPhotos[active]}
                src={assetPath(galleryPath(allPhotos[active]))}
                alt={`${galleryEvent.name} photograph ${active + 1}`}
                fill
                sizes="100vw"
                priority
              />
            </figure>
            <button type="button" className="lightbox-nav prev" onClick={() => step(-1)} aria-label="Previous photograph"><ChevronLeft size={26} /></button>
            <button type="button" className="lightbox-nav next" onClick={() => step(1)} aria-label="Next photograph"><ChevronRight size={26} /></button>
          </div>
        )}
      </dialog>
    </>
  );
}
