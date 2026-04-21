"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";

import type { PhotoItem } from "./photo-data";

type PhotoGalleryProps = {
  photos: PhotoItem[];
};

const gridPattern = [
  { column: 1, row: 1 },
  { column: 2, row: 1 },
  { column: 4, row: 1 },
  { column: 2, row: 2 },
  { column: 3, row: 2 },
  { column: 4, row: 2 },
  { column: 1, row: 3 },
  { column: 2, row: 3 },
  { column: 3, row: 3 },
] as const;

function getFallbackLayer(fill?: string) {
  if (!fill) {
    return "linear-gradient(#ffffff, #ffffff)";
  }

  if (fill.includes("gradient(") || fill.startsWith("url(")) {
    return fill;
  }

  return `linear-gradient(${fill}, ${fill})`;
}

function getPhotoStyle(photo: PhotoItem, index: number) {
  const pattern = gridPattern[index % gridPattern.length];
  const rowOffset = Math.floor(index / gridPattern.length) * 3;

  return {
    "--photo-image": photo.src ? `url("${photo.src}")` : "none",
    "--photo-fill": getFallbackLayer(photo.fill),
    "--photo-position": photo.position ?? "center",
    "--photo-column": pattern.column,
    "--photo-row": pattern.row + rowOffset,
  } as CSSProperties;
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  const closePhoto = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showNextPhoto = useCallback(() => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null || photos.length === 0) {
        return currentIndex;
      }

      return (currentIndex + 1) % photos.length;
    });
  }, [photos.length]);

  const showPreviousPhoto = useCallback(() => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null || photos.length === 0) {
        return currentIndex;
      }

      return (currentIndex - 1 + photos.length) % photos.length;
    });
  }, [photos.length]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePhoto();
      }

      if (event.key === "ArrowRight") {
        showNextPhoto();
      }

      if (event.key === "ArrowLeft") {
        showPreviousPhoto();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, closePhoto, showNextPhoto, showPreviousPhoto]);

  if (photos.length === 0) {
    return null;
  }

  const lightbox =
    activePhoto && typeof document !== "undefined"
      ? createPortal(
          <div
            aria-label={`${activePhoto.title} photo viewer`}
            aria-modal="true"
            className="photo-lightbox"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closePhoto();
              }
            }}
            role="dialog"
          >
            <button
              aria-label="Close photo"
              className="photo-lightbox-close"
              onClick={closePhoto}
              type="button"
            >
              <span aria-hidden="true">x</span>
            </button>

            <button
              aria-label="Previous photo"
              className="photo-lightbox-arrow photo-lightbox-arrow-previous"
              onClick={showPreviousPhoto}
              type="button"
            >
              <span aria-hidden="true">{"<"}</span>
            </button>

            <figure className="photo-lightbox-figure">
              <div
                aria-label={activePhoto.alt}
                className="photo-lightbox-image"
                role="img"
                style={getPhotoStyle(activePhoto, activeIndex ?? 0)}
              />

              <figcaption className="photo-lightbox-caption">
                <span>{activePhoto.title}</span>
                <span>
                  {(activeIndex ?? 0) + 1} / {photos.length}
                </span>
              </figcaption>
            </figure>

            <button
              aria-label="Next photo"
              className="photo-lightbox-arrow photo-lightbox-arrow-next"
              onClick={showNextPhoto}
              type="button"
            >
              <span aria-hidden="true">{">"}</span>
            </button>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div aria-label="Photo gallery" className="photo-grid">
        {photos.map((photo, index) => (
          <button
            aria-label={`Open photo: ${photo.title}`}
            className="photo-tile"
            key={photo.id}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            <span
              aria-label={photo.alt}
              className="photo-surface"
              role="img"
              style={getPhotoStyle(photo, index)}
            />
          </button>
        ))}
      </div>

      {lightbox}
    </>
  );
}
