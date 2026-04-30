"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";

import { ChevronLeft, ChevronRight, CloseIcon } from "../icons";
import type { PhotoItem } from "./photo-data";

type PhotoGalleryProps = {
  photos: PhotoItem[];
};

const photoTileSizes = [
  "(max-width: 640px) calc((100vw - 2.5rem) / 2)",
  "(max-width: 980px) calc((100vw - 3rem) / 3)",
  "calc((min(100vw - 2rem, 73.875rem) - 1.5rem) / 4)",
].join(", ");

function getFallbackLayer(fill?: string) {
  if (!fill) {
    return "linear-gradient(#ffffff, #ffffff)";
  }

  if (fill.includes("gradient(") || fill.startsWith("url(")) {
    return fill;
  }

  return `linear-gradient(${fill}, ${fill})`;
}

function getPhotoStyle(photo: PhotoItem) {
  return {
    "--photo-fill": getFallbackLayer(photo.fill),
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
              <CloseIcon size={20} />
            </button>

            <button
              aria-label="Previous photo"
              className="photo-lightbox-arrow photo-lightbox-arrow-previous"
              onClick={showPreviousPhoto}
              type="button"
            >
              <ChevronLeft size={24} />
            </button>

            <figure className="photo-lightbox-figure">
              <div
                className="photo-lightbox-media"
                style={{ "--photo-fill": getFallbackLayer(activePhoto.fill) } as CSSProperties}
              >
                <Image
                  alt={activePhoto.alt}
                  className="photo-lightbox-image"
                  decoding="async"
                  draggable={false}
                  height={activePhoto.height}
                  loading="eager"
                  sizes="100vw"
                  src={activePhoto.src}
                  style={{ objectPosition: activePhoto.position ?? "center" }}
                  width={activePhoto.width}
                />
              </div>

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
              <ChevronRight size={24} />
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
            style={getPhotoStyle(photo)}
            type="button"
          >
            <span className="photo-surface">
              <Image
                alt={photo.alt}
                className="photo-image"
                decoding="async"
                draggable={false}
                fetchPriority={index === 0 ? "high" : "auto"}
                height={photo.height}
                loading={index < 4 ? "eager" : "lazy"}
                sizes={photoTileSizes}
                src={photo.src}
                style={{ objectPosition: photo.position ?? "center" }}
                width={photo.width}
              />
            </span>
          </button>
        ))}
      </div>

      {lightbox}
    </>
  );
}
