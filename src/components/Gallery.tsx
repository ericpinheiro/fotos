"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { rowsFor, type Photo } from "@/lib/photo-types";
import styles from "./Gallery.module.css";

const NAME = "Eric Pinheiro";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Gallery({ photos }: { photos: Photo[] }) {
  const [idx, setIdx] = useState(0);
  const count = photos.length;

  // replaceState (not location.hash) so navigating doesn't fill the browser
  // history, fire hashchange or scroll. history.state is kept for Next's router.
  const show = useCallback(
    (i: number) => {
      setIdx(i);
      window.history.replaceState(
        window.history.state,
        "",
        `#${encodeURIComponent(photos[i].id)}`,
      );
    },
    [photos],
  );

  const goPrev = useCallback(() => {
    show((idx - 1 + count) % count);
  }, [idx, count, show]);

  const goNext = useCallback(() => {
    show((idx + 1) % count);
  }, [idx, count, show]);

  // The server can't see the fragment, so the photo from a shared link
  // (/#roda-gigante) is only picked after mount.
  useEffect(() => {
    const syncFromHash = () => {
      const raw = window.location.hash.slice(1);
      if (!raw) return;
      let id = raw;
      try {
        id = decodeURIComponent(raw);
      } catch {}
      const i = photos.findIndex((p) => p.id === id);
      if (i >= 0) {
        setIdx(i);
      } else {
        setIdx(0);
        window.history.replaceState(
          window.history.state,
          "",
          window.location.pathname + window.location.search,
        );
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [photos]);

  useEffect(() => {
    if (count === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, goNext, goPrev]);

  if (count === 0) {
    return (
      <div className={styles.empty}>
        Nenhuma foto encontrada em <code>public/photos</code>.
      </div>
    );
  }

  const photo = photos[idx];
  const rows = rowsFor(photo);
  const hasRows = rows.length > 0;
  const bare = !photo.caption && !hasRows;
  const counter = `${pad(idx + 1)} / ${pad(count)}`;

  return (
    <div className={styles.site}>
      <div className={styles.mHead}>
        <div className={styles.mHeadName}>{NAME}</div>
        <div className={styles.mHeadCounter}>{counter}</div>
      </div>

      <div className={styles.colMeta}>
        <div className={styles.metaTopDesktop}>
          <div>{NAME}</div>
          <div className={styles.metaTopDesktopSub}>
            fotos analógicas
            {/* &amp; digital */}
          </div>
        </div>
        <div className={styles.metaBottom}>
          <div className={styles.metaCard} key={photo.slug}>
            {photo.caption && (
              <div className={styles.caption}>{photo.caption}</div>
            )}
            {hasRows && (
              <div className={styles.rows}>
                {rows.map((r) => (
                  <div key={r.k}>
                    <span className={styles.rowKey}>{r.k}</span>
                    <span className={styles.rowValue}>{r.v}</span>
                  </div>
                ))}
              </div>
            )}
            {bare && <div className={styles.bare}>Sem legenda</div>}
          </div>
        </div>
      </div>

      <div className={styles.colStage}>
        <Image
          key={photo.slug}
          src={photo.src}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          className={styles.stageImg}
          placeholder="blur"
          blurDataURL={photo.blurDataURL}
          priority={idx === 0}
          sizes="(max-width: 820px) 100vw, calc(100vw - 450px)"
        />
        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={goPrev}
            aria-label="Foto anterior"
          >
            Anterior
          </button>
          <span className={styles.navCounter}>{counter}</span>
          <button
            type="button"
            className={styles.navBtn}
            onClick={goNext}
            aria-label="Próxima foto"
          >
            Próxima
          </button>
        </div>
      </div>

      <div className={styles.colRail}>
        {photos.map((t, i) => (
          <button
            type="button"
            key={t.slug}
            onClick={() => show(i)}
            className={`${styles.thmb} ${i === idx ? styles.thmbActive : ""}`}
            aria-label={`Ver foto: ${t.caption || t.alt}`}
            aria-current={i === idx}
          >
            <Image
              src={t.src}
              width={t.width}
              height={t.height}
              alt={t.alt}
              placeholder="blur"
              blurDataURL={t.blurDataURL}
              loading="lazy"
              sizes="(max-width: 820px) 64px, 120px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
