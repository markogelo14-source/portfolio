"use client";

import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
} from "react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { playgroundCards, type PlaygroundCard } from "./playground-data";

type Offset = {
  x: number;
  y: number;
};

type DragState = {
  lastTime: number;
  lastX: number;
  lastY: number;
  originX: number;
  originY: number;
  pointerId: number;
  startX: number;
  startY: number;
  velocityX: number;
  velocityY: number;
};

type LayoutCard = PlaygroundCard & {
  height: number;
  id: string;
  imageHeight: number;
  index: number;
  paper: string;
  rotation: number;
  width: number;
  x: number;
  y: number;
};

const TILE_WIDTH = 3360;
const TILE_HEIGHT = 2520;
const TILE_PADDING = 116;
const CARD_GAP = 52;
const RELEASE_TRANSITION = "transform 350ms cubic-bezier(0.22, 1, 0.36, 1)";
const TILE_RANGE = [-2, -1, 0, 1, 2];
const INITIAL_OFFSET = {
  x: -TILE_WIDTH * 0.34,
  y: -TILE_HEIGHT * 0.3,
};
const PAPER_SWATCHES = ["#faf5ef", "#f6eee2", "#f2eee7", "#eef2ec", "#eef3f8"];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRandom(seed: number) {
  let value = seed || 1;

  return function seededRandom() {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let next = Math.imul(value ^ (value >>> 15), 1 | value);

    next ^= next + Math.imul(next ^ (next >>> 7), 61 | next);

    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function normalizeAxis(value: number, size: number) {
  if (Math.abs(value) < size * 48) {
    return value;
  }

  return value % size;
}

function normalizeOffset(offset: Offset) {
  return {
    x: normalizeAxis(offset.x, TILE_WIDTH),
    y: normalizeAxis(offset.y, TILE_HEIGHT),
  };
}

function getCardMeasurements(card: PlaygroundCard, index: number) {
  const random = createSeededRandom(hashString(`${card.title}-${card.image}-${index}`));
  const baseWidth =
    card.size === "large" ? 520 : card.size === "medium" ? 390 : 286;
  const widthJitter =
    card.size === "large" ? 72 : card.size === "medium" ? 44 : 28;
  const imageAspectRatios = [0.82, 0.94, 1.08, 1.22, 1.36];
  const width = Math.round(baseWidth + (random() * 2 - 1) * widthJitter);
  const imageAspectRatio =
    imageAspectRatios[Math.floor(random() * imageAspectRatios.length)] ?? 1;
  const imageHeight = Math.round(width / imageAspectRatio);
  const textHeight = card.size === "large" ? 108 : card.size === "medium" ? 98 : 90;
  const rotation = (random() * 7 - 3.5).toFixed(2);
  const paper = PAPER_SWATCHES[Math.floor(random() * PAPER_SWATCHES.length)] ?? PAPER_SWATCHES[0];

  return {
    height: imageHeight + textHeight,
    imageHeight,
    paper,
    rotation: Number(rotation),
    width,
  };
}

function hasCollision(candidate: LayoutCard, placedCards: readonly LayoutCard[]) {
  return placedCards.some((existingCard) => {
    return (
      candidate.x < existingCard.x + existingCard.width + CARD_GAP &&
      candidate.x + candidate.width + CARD_GAP > existingCard.x &&
      candidate.y < existingCard.y + existingCard.height + CARD_GAP &&
      candidate.y + candidate.height + CARD_GAP > existingCard.y
    );
  });
}

function scoreCandidate(candidate: LayoutCard, placedCards: readonly LayoutCard[]) {
  if (placedCards.length === 0) {
    return Number.MAX_SAFE_INTEGER;
  }

  let nearestCardDistance = Number.POSITIVE_INFINITY;

  for (const placedCard of placedCards) {
    const dx =
      candidate.x + candidate.width / 2 - (placedCard.x + placedCard.width / 2);
    const dy =
      candidate.y + candidate.height / 2 - (placedCard.y + placedCard.height / 2);

    nearestCardDistance = Math.min(
      nearestCardDistance,
      Math.hypot(dx, dy),
    );
  }

  const edgeDistance = Math.min(
    candidate.x,
    candidate.y,
    TILE_WIDTH - (candidate.x + candidate.width),
    TILE_HEIGHT - (candidate.y + candidate.height),
  );

  return nearestCardDistance + edgeDistance * 0.35;
}

function placeCards(cards: readonly PlaygroundCard[]) {
  const preparedCards = cards.map((card, index) => {
    return {
      ...card,
      ...getCardMeasurements(card, index),
      id: `${index}-${card.title.toLowerCase().replace(/\s+/g, "-")}`,
      index,
      x: 0,
      y: 0,
    };
  });
  const placementQueue = [...preparedCards].sort((firstCard, secondCard) => {
    const sizeWeight = {
      large: 3,
      medium: 2,
      small: 1,
    };

    return (
      sizeWeight[secondCard.size] - sizeWeight[firstCard.size] ||
      firstCard.index - secondCard.index
    );
  });
  const placedCards: LayoutCard[] = [];

  for (const card of placementQueue) {
    const random = createSeededRandom(hashString(`${card.id}-placement`));
    let bestCandidate: LayoutCard | null = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (let attempt = 0; attempt < 260; attempt += 1) {
      const candidate: LayoutCard = {
        ...card,
        x:
          TILE_PADDING +
          random() * (TILE_WIDTH - card.width - TILE_PADDING * 2),
        y:
          TILE_PADDING +
          random() * (TILE_HEIGHT - card.height - TILE_PADDING * 2),
      };

      if (hasCollision(candidate, placedCards)) {
        continue;
      }

      const score = scoreCandidate(candidate, placedCards) + random() * 60;

      if (score > bestScore) {
        bestCandidate = candidate;
        bestScore = score;
      }
    }

    if (!bestCandidate) {
      for (
        let y = TILE_PADDING;
        y <= TILE_HEIGHT - card.height - TILE_PADDING;
        y += 40
      ) {
        for (
          let x = TILE_PADDING;
          x <= TILE_WIDTH - card.width - TILE_PADDING;
          x += 40
        ) {
          const fallbackCandidate: LayoutCard = {
            ...card,
            x,
            y,
          };

          if (!hasCollision(fallbackCandidate, placedCards)) {
            bestCandidate = fallbackCandidate;
            break;
          }
        }

        if (bestCandidate) {
          break;
        }
      }
    }

    placedCards.push(
      bestCandidate ?? {
        ...card,
        x: TILE_PADDING,
        y: TILE_PADDING,
      },
    );
  }

  return placedCards.sort((firstCard, secondCard) => firstCard.index - secondCard.index);
}

const layoutCards = placeCards(playgroundCards);

export function DraggablePlayground() {
  const [offset, setOffset] = useState<Offset>(INITIAL_OFFSET);
  const [isDragging, setIsDragging] = useState(false);
  const [isReleaseEasing, setIsReleaseEasing] = useState(false);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const offsetRef = useRef(INITIAL_OFFSET);
  const targetOffsetRef = useRef(INITIAL_OFFSET);
  const releaseTimeoutRef = useRef<number | null>(null);
  const releaseTransitionRef = useRef(false);

  function updateOffset(nextOffset: Offset) {
    const normalizedOffset = normalizeOffset(nextOffset);

    offsetRef.current = normalizedOffset;
    setOffset(normalizedOffset);
  }

  function stopScrollEasing() {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }

  function readCanvasOffset() {
    const canvas = canvasRef.current;

    if (!canvas) {
      return offsetRef.current;
    }

    const transform = window.getComputedStyle(canvas).transform;

    if (!transform || transform === "none") {
      return offsetRef.current;
    }

    const matrix = new DOMMatrixReadOnly(transform);

    return {
      x: matrix.m41,
      y: matrix.m42,
    };
  }

  function stopReleaseEasing() {
    if (!releaseTransitionRef.current) {
      return;
    }

    if (releaseTimeoutRef.current !== null) {
      window.clearTimeout(releaseTimeoutRef.current);
      releaseTimeoutRef.current = null;
    }

    releaseTransitionRef.current = false;
    setIsReleaseEasing(false);
    const currentOffset = readCanvasOffset();

    targetOffsetRef.current = currentOffset;
    updateOffset(currentOffset);
  }

  function animateTowardTarget() {
    if (animationFrameRef.current !== null || dragStateRef.current || releaseTransitionRef.current) {
      return;
    }

    const step = () => {
      animationFrameRef.current = null;

      if (dragStateRef.current || releaseTransitionRef.current) {
        return;
      }

      const currentOffset = offsetRef.current;
      const targetOffset = targetOffsetRef.current;
      const dx = targetOffset.x - currentOffset.x;
      const dy = targetOffset.y - currentOffset.y;

      if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
        updateOffset(targetOffset);
        return;
      }

      updateOffset({
        x: currentOffset.x + dx * 0.16,
        y: currentOffset.y + dy * 0.16,
      });

      animationFrameRef.current = window.requestAnimationFrame(step);
    };

    animationFrameRef.current = window.requestAnimationFrame(step);
  }

  function finishDrag(pointerId: number) {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== pointerId) {
      return;
    }

    dragStateRef.current = null;
    setIsDragging(false);

    const nextOffset = {
      x: offsetRef.current.x + clamp(dragState.velocityX * 220, -220, 220),
      y: offsetRef.current.y + clamp(dragState.velocityY * 220, -220, 220),
    };

    releaseTransitionRef.current = true;
    setIsReleaseEasing(true);
    targetOffsetRef.current = nextOffset;
    updateOffset(nextOffset);

    if (releaseTimeoutRef.current !== null) {
      window.clearTimeout(releaseTimeoutRef.current);
    }

    releaseTimeoutRef.current = window.setTimeout(() => {
      releaseTransitionRef.current = false;
      releaseTimeoutRef.current = null;
      setIsReleaseEasing(false);
    }, 350);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    stopReleaseEasing();
    stopScrollEasing();
    targetOffsetRef.current = offsetRef.current;
    dragStateRef.current = {
      lastTime: performance.now(),
      lastX: event.clientX,
      lastY: event.clientY,
      originX: offsetRef.current.x,
      originY: offsetRef.current.y,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      velocityX: 0,
      velocityY: 0,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const now = performance.now();
    const elapsed = Math.max(16, now - dragState.lastTime);
    const nextOffset = {
      x: dragState.originX + (event.clientX - dragState.startX),
      y: dragState.originY + (event.clientY - dragState.startY),
    };

    dragState.velocityX = (event.clientX - dragState.lastX) / elapsed;
    dragState.velocityY = (event.clientY - dragState.lastY) / elapsed;
    dragState.lastTime = now;
    dragState.lastX = event.clientX;
    dragState.lastY = event.clientY;
    targetOffsetRef.current = nextOffset;
    updateOffset(nextOffset);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    finishDrag(event.pointerId);
  }

  function handlePointerCancel(event: ReactPointerEvent<HTMLDivElement>) {
    finishDrag(event.pointerId);
  }

  function handleLostPointerCapture(event: ReactPointerEvent<HTMLDivElement>) {
    finishDrag(event.pointerId);
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    event.preventDefault();

    if (dragStateRef.current) {
      return;
    }

    stopReleaseEasing();
    targetOffsetRef.current = normalizeOffset({
      x: targetOffsetRef.current.x - event.deltaX,
      y: targetOffsetRef.current.y - event.deltaY,
    });
    animateTowardTarget();
  }

  useEffect(() => {
    document.body.classList.toggle("playground-dragging", isDragging);

    return () => {
      document.body.classList.remove("playground-dragging");
    };
  }, [isDragging]);

  useEffect(() => {
    return () => {
      stopScrollEasing();

      if (releaseTimeoutRef.current !== null) {
        window.clearTimeout(releaseTimeoutRef.current);
      }

      document.body.classList.remove("playground-dragging");
    };
  }, []);

  const currentTileX = Math.floor((-offset.x + TILE_WIDTH / 2) / TILE_WIDTH);
  const currentTileY = Math.floor((-offset.y + TILE_HEIGHT / 2) / TILE_HEIGHT);

  return (
    <section
      aria-label="Interactive playground of experiments and project fragments"
      className="playground-stage"
      data-dragging={isDragging ? "true" : "false"}
      onLostPointerCapture={handleLostPointerCapture}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      style={
        {
          "--playground-tile-height": `${TILE_HEIGHT}px`,
          "--playground-tile-width": `${TILE_WIDTH}px`,
        } as CSSProperties
      }
    >
      <div className="playground-helper">
        <span>SCROLL / DRAG TO MOVE</span>
      </div>

      <div
        className="playground-canvas"
        ref={canvasRef}
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          transition: isReleaseEasing ? RELEASE_TRANSITION : "none",
        }}
      >
        {TILE_RANGE.flatMap((rowOffset) =>
          TILE_RANGE.map((columnOffset) => {
            const tileX = currentTileX + columnOffset;
            const tileY = currentTileY + rowOffset;
            const isPrimaryTile = tileX === currentTileX && tileY === currentTileY;

            return (
              <div
                aria-hidden={!isPrimaryTile}
                className="playground-tile"
                key={`${tileX}-${tileY}`}
                style={{
                  transform: `translate3d(${tileX * TILE_WIDTH}px, ${tileY * TILE_HEIGHT}px, 0)`,
                }}
              >
                {layoutCards.map((card) => {
                  return (
                    <article
                      className="playground-card"
                      key={`${tileX}-${tileY}-${card.id}`}
                      style={
                        {
                          "--card-image-height": `${card.imageHeight}px`,
                          "--card-paper": card.paper,
                          "--card-rotation": `${card.rotation}deg`,
                          left: `${card.x}px`,
                          top: `${card.y}px`,
                          width: `${card.width}px`,
                          zIndex: card.index + 1,
                        } as CSSProperties
                      }
                    >
                      <div className="playground-card-media">
                        <Image
                          alt={isPrimaryTile ? `${card.title}. ${card.caption}` : ""}
                          className="playground-card-image"
                          draggable={false}
                          height={card.imageHeight}
                          sizes="(max-width: 640px) 76vw, (max-width: 1024px) 42vw, 28vw"
                          src={card.image}
                          width={card.width}
                        />
                      </div>

                      <div className="playground-card-copy">
                        <h2 className="playground-card-title">{card.title}</h2>
                        <p className="playground-card-caption">{card.caption}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            );
          }),
        )}
      </div>
    </section>
  );
}
