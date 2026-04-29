"use client";

import type {
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
} from "react";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";

import { playgroundCards, type PlaygroundCard } from "./playground-data";

type DragSession = {
  originX: number;
  originY: number;
  pointerId: number;
  startX: number;
  startY: number;
};

type Offset = {
  x: number;
  y: number;
};

type LayoutAnchor = {
  centerX: number;
  centerY: number;
};

type LayoutItemBase = {
  height: number;
  id: string;
  rotation: number;
  size: "small" | "medium" | "large";
  width: number;
  x: number;
  y: number;
  zIndex: number;
};

type LayoutCard = PlaygroundCard &
  LayoutItemBase & {
    imageHeight: number;
  };

type LayoutItem = LayoutCard;

type RenderedItemCopy = {
  copyX: number;
  copyY: number;
  item: LayoutItem;
  key: string;
};

const TILE_SIZE = 2200;
const TILE_PADDING = 96;
const CARD_CLEARANCE = 54;
const CARD_VISUAL_BLEED = 10;
const CARD_SCALE = 1.3;
const PLACEMENT_RING_STEPS = [0, 28, 64, 112, 168, 236] as const;
const TILE_RANGE = [-1, 0, 1] as const;
const LAYOUT_SEED = "playground-layout-v4";
const INITIAL_OFFSET = {
  x: -Math.round(TILE_SIZE * 0.34),
  y: -Math.round(TILE_SIZE * 0.22),
};
const IMAGE_SIZES = {
  large: "400px",
  medium: "290px",
  small: "190px",
} satisfies Record<PlaygroundCard["size"], string>;
const CARD_ANCHORS = {
  large: [
    { centerX: 290, centerY: 280 },
    { centerX: 1480, centerY: 1120 },
    { centerX: 330, centerY: 1840 },
  ],
  medium: [
    { centerX: 1020, centerY: 420 },
    { centerX: 1930, centerY: 380 },
    { centerX: 380, centerY: 980 },
    { centerX: 1230, centerY: 2020 },
  ],
  small: [
    { centerX: 1540, centerY: 230 },
    { centerX: 900, centerY: 1510 },
    { centerX: 1950, centerY: 1750 },
  ],
} satisfies Record<PlaygroundCard["size"], readonly LayoutAnchor[]>;

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

function seededShuffle<T>(items: readonly T[], random: () => number) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));

    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function scaleDimension(value: number) {
  return Math.round(value * CARD_SCALE);
}

function wrapOffset(value: number, size: number) {
  return ((value % size) + size) % size;
}

function getToroidalAxisDelta(firstValue: number, secondValue: number, size: number) {
  const directDistance = Math.abs(firstValue - secondValue);

  return Math.min(directDistance, size - directDistance);
}

function getRectGap(firstItem: LayoutItem, secondItem: LayoutItem) {
  const firstBounds = getRotatedBounds(firstItem);
  const secondBounds = getRotatedBounds(secondItem);
  const gapX = Math.max(
    secondBounds.left - firstBounds.right,
    firstBounds.left - secondBounds.right,
    0,
  );
  const gapY = Math.max(
    secondBounds.top - firstBounds.bottom,
    firstBounds.top - secondBounds.bottom,
    0,
  );

  return Math.hypot(gapX, gapY);
}

function getRotatedBounds(item: LayoutItem) {
  const radians = (Math.abs(item.rotation) * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const rotatedWidth =
    Math.abs(item.width * cos) + Math.abs(item.height * sin) + CARD_VISUAL_BLEED * 2;
  const rotatedHeight =
    Math.abs(item.width * sin) + Math.abs(item.height * cos) + CARD_VISUAL_BLEED * 2;
  const centerX = item.x + item.width / 2;
  const centerY = item.y + item.height / 2;

  return {
    bottom: centerY + rotatedHeight / 2,
    left: centerX - rotatedWidth / 2,
    right: centerX + rotatedWidth / 2,
    top: centerY - rotatedHeight / 2,
  };
}

function getToroidalRectGap(firstItem: LayoutItem, secondItem: LayoutItem) {
  let minimumGap = Number.POSITIVE_INFINITY;

  for (const shiftX of [-TILE_SIZE, 0, TILE_SIZE]) {
    for (const shiftY of [-TILE_SIZE, 0, TILE_SIZE]) {
      minimumGap = Math.min(
        minimumGap,
        getRectGap(firstItem, {
          ...secondItem,
          x: secondItem.x + shiftX,
          y: secondItem.y + shiftY,
        }),
      );
    }
  }

  return minimumGap;
}

function hasCollision(candidate: LayoutItem, placedItems: readonly LayoutItem[]) {
  return placedItems.some((placedItem) => {
    return getToroidalRectGap(candidate, placedItem) < CARD_CLEARANCE;
  });
}

function getItemRotation(seedKey: string, range: number) {
  const random = createSeededRandom(hashString(`${LAYOUT_SEED}:rotation:${seedKey}`));
  let rotation = (random() * 2 - 1) * range;

  if (Math.abs(rotation) < 0.7) {
    rotation = rotation < 0 ? rotation - 0.7 : rotation + 0.7;
  }

  return Number(rotation.toFixed(2));
}

function getCardMeasurements(card: PlaygroundCard, index: number) {
  const random = createSeededRandom(hashString(`${card.title}:${card.image}:${index}`));
  const baseWidth =
    card.size === "large" ? 322 : card.size === "medium" ? 252 : 198;
  const widthJitter =
    card.size === "large" ? 28 : card.size === "medium" ? 20 : 14;
  const width = scaleDimension(
    Math.round(baseWidth + (random() * 2 - 1) * widthJitter),
  );
  const mediaAspectRatio = card.mediaWidth / card.mediaHeight;
  const imageHeight = Math.round(width / mediaAspectRatio);
  const copyHeight = scaleDimension(
    card.size === "large" ? 62 : card.size === "medium" ? 58 : 54,
  );

  return {
    height: imageHeight + copyHeight,
    imageHeight,
    rotation: getItemRotation(
      `${card.title}:${card.image}:${card.size}:${index}`,
      card.size === "large" ? 2.8 : card.size === "medium" ? 3.5 : 4.2,
    ),
    width,
  };
}

function getPlacementScore(
  candidate: LayoutItem,
  placedItems: readonly LayoutItem[],
  anchor: LayoutAnchor,
) {
  if (placedItems.length === 0) {
    const anchorDx = candidate.x + candidate.width / 2 - anchor.centerX;
    const anchorDy = candidate.y + candidate.height / 2 - anchor.centerY;

    return -Math.hypot(anchorDx, anchorDy) * 0.08;
  }

  let nearestGap = Number.POSITIVE_INFINITY;
  let clusterPenalty = 0;
  let alignmentPenalty = 0;
  let centerDistanceSum = 0;
  const candidateCenterX = candidate.x + candidate.width / 2;
  const candidateCenterY = candidate.y + candidate.height / 2;

  for (const placedItem of placedItems) {
    const gap = getToroidalRectGap(candidate, placedItem);
    const placedCenterX = placedItem.x + placedItem.width / 2;
    const placedCenterY = placedItem.y + placedItem.height / 2;
    const dx = getToroidalAxisDelta(candidateCenterX, placedCenterX, TILE_SIZE);
    const dy = getToroidalAxisDelta(candidateCenterY, placedCenterY, TILE_SIZE);
    const centerDistance = Math.hypot(dx, dy);

    nearestGap = Math.min(nearestGap, gap);
    centerDistanceSum += centerDistance;

    if (centerDistance < 320) {
      clusterPenalty += (320 - centerDistance) / 320;
    }

    if (dx < 72) {
      alignmentPenalty += (72 - dx) * 0.16;
    }

    if (dy < 72) {
      alignmentPenalty += (72 - dy) * 0.16;
    }
  }

  const anchorDx = candidateCenterX - anchor.centerX;
  const anchorDy = candidateCenterY - anchor.centerY;
  const anchorDistancePenalty = Math.hypot(anchorDx, anchorDy) * 0.08;

  return (
    Math.min(nearestGap, 160) * 3.1 +
    centerDistanceSum * 0.02 -
    clusterPenalty * 22 -
    alignmentPenalty -
    anchorDistancePenalty
  );
}

function getCandidateAtAnchor(
  item: LayoutItem,
  anchor: LayoutAnchor,
  radius: number,
  random: () => number,
) {
  const turns = radius === 0 ? 1 : 5;
  let bestCandidate: LayoutItem | null = null;

  for (let attempt = 0; attempt < turns; attempt += 1) {
    const angle = random() * Math.PI * 2 + attempt * ((Math.PI * 2) / turns);
    const offsetX = Math.cos(angle) * radius + (random() * 2 - 1) * 10;
    const offsetY = Math.sin(angle) * radius + (random() * 2 - 1) * 10;
    const candidate: LayoutItem = {
      ...item,
      x: clamp(
        Math.round(anchor.centerX - item.width / 2 + offsetX),
        TILE_PADDING,
        TILE_SIZE - item.width - TILE_PADDING,
      ),
      y: clamp(
        Math.round(anchor.centerY - item.height / 2 + offsetY),
        TILE_PADDING,
        TILE_SIZE - item.height - TILE_PADDING,
      ),
    };

    if (!bestCandidate) {
      bestCandidate = candidate;
    }

    if (radius === 0) {
      break;
    }
  }

  return bestCandidate;
}

function placeScatterFallback(item: LayoutItem, placedItems: readonly LayoutItem[]) {
  const random = createSeededRandom(hashString(`${LAYOUT_SEED}:fallback:${item.id}`));
  let bestCandidate: LayoutItem | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  const fallbackAnchor = {
    centerX: TILE_SIZE / 2,
    centerY: TILE_SIZE / 2,
  };

  for (let attempt = 0; attempt < 240; attempt += 1) {
    const candidate: LayoutItem = {
      ...item,
      x: Math.round(
        TILE_PADDING + random() * (TILE_SIZE - item.width - TILE_PADDING * 2),
      ),
      y: Math.round(
        TILE_PADDING + random() * (TILE_SIZE - item.height - TILE_PADDING * 2),
      ),
    };

    if (hasCollision(candidate, placedItems)) {
      continue;
    }

    const score = getPlacementScore(candidate, placedItems, fallbackAnchor) + random() * 10;

    if (score > bestScore) {
      bestCandidate = candidate;
      bestScore = score;
    }
  }

  return (
    bestCandidate ?? {
      ...item,
      x: TILE_PADDING,
      y: TILE_PADDING,
    }
  );
}

function placeAnchoredItems<T extends LayoutItem>(
  items: readonly T[],
  anchors: readonly LayoutAnchor[],
  placedItems: LayoutItem[],
) {
  const groupRandom = createSeededRandom(
    hashString(`${LAYOUT_SEED}:group:${items.map((item) => item.id).join("|")}`),
  );
  const shuffledItems = seededShuffle(items, groupRandom);
  const shuffledAnchors = seededShuffle(anchors, groupRandom);
  const placedGroup: T[] = [];

  shuffledItems.forEach((item, itemIndex) => {
    const random = createSeededRandom(hashString(`${LAYOUT_SEED}:place:${item.id}`));
    const anchorOrder = seededShuffle(shuffledAnchors, random);
    const preferredAnchor = anchorOrder[itemIndex % anchorOrder.length] ?? anchorOrder[0];
    const candidates: Array<{ anchor: LayoutAnchor; candidate: LayoutItem; score: number }> = [];

    for (const anchor of preferredAnchor ? [preferredAnchor, ...anchorOrder] : anchorOrder) {
      for (const radius of PLACEMENT_RING_STEPS) {
        const candidate = getCandidateAtAnchor(item, anchor, radius, random);

        if (!candidate || hasCollision(candidate, placedItems)) {
          continue;
        }

        candidates.push({
          anchor,
          candidate,
          score: getPlacementScore(candidate, placedItems, anchor) + random() * 6,
        });
      }
    }

    const bestCandidate =
      candidates.sort((firstCandidate, secondCandidate) => {
        return secondCandidate.score - firstCandidate.score;
      })[0]?.candidate ?? placeScatterFallback(item, placedItems);

    placedItems.push(bestCandidate);
    placedGroup.push(bestCandidate as T);
  });

  return placedGroup;
}

function buildLayout(cards: readonly PlaygroundCard[]): LayoutItem[] {
  const preparedCards: LayoutCard[] = cards.map((card, index) => {
    return {
      ...card,
      ...getCardMeasurements(card, index),
      id: `${slugify(card.title)}-${index}`,
      x: 0,
      y: 0,
      zIndex: 0,
    };
  });
  const placedItems: LayoutItem[] = [];
  const cardsBySize: Record<PlaygroundCard["size"], LayoutCard[]> = {
    large: [],
    medium: [],
    small: [],
  };

  for (const card of preparedCards) {
    cardsBySize[card.size].push(card);
  }

  placeAnchoredItems(cardsBySize.large, CARD_ANCHORS.large, placedItems);
  placeAnchoredItems(cardsBySize.medium, CARD_ANCHORS.medium, placedItems);
  placeAnchoredItems(cardsBySize.small, CARD_ANCHORS.small, placedItems);

  return placedItems
    .sort((firstItem, secondItem) => {
      return (
        firstItem.y - secondItem.y ||
        firstItem.x - secondItem.x ||
        firstItem.id.localeCompare(secondItem.id)
      );
    })
    .map((item, index) => ({
      ...item,
      zIndex: index + 1,
    }));
}

function getItemTransform(item: LayoutItem, copyX: number, copyY: number, offset: Offset) {
  const x = wrapOffset(item.x + offset.x, TILE_SIZE) + copyX * TILE_SIZE;
  const y = wrapOffset(item.y + offset.y, TILE_SIZE) + copyY * TILE_SIZE;

  return `translate3d(${x}px, ${y}px, 0) rotate(${item.rotation}deg)`;
}

function getItemVisibleArea(
  item: LayoutItem,
  offset: Offset,
  viewportWidth: number,
  viewportHeight: number,
) {
  let largestVisibleArea = 0;

  for (const copyX of TILE_RANGE) {
    for (const copyY of TILE_RANGE) {
      const x = wrapOffset(item.x + offset.x, TILE_SIZE) + copyX * TILE_SIZE;
      const y = wrapOffset(item.y + offset.y, TILE_SIZE) + copyY * TILE_SIZE;
      const visibleWidth = Math.max(
        0,
        Math.min(viewportWidth, x + item.width) - Math.max(0, x),
      );
      const visibleHeight = Math.max(
        0,
        Math.min(viewportHeight, y + item.height) - Math.max(0, y),
      );

      largestVisibleArea = Math.max(largestVisibleArea, visibleWidth * visibleHeight);
    }
  }

  return largestVisibleArea;
}

function getOptimalInitialOffset(
  items: readonly LayoutItem[],
  viewportWidth: number,
  viewportHeight: number,
) {
  const candidateXs = new Set<number>([INITIAL_OFFSET.x]);
  const candidateYs = new Set<number>([INITIAL_OFFSET.y]);

  for (const item of items) {
    candidateXs.add(-item.x);
    candidateXs.add(viewportWidth - (item.x + item.width));
    candidateXs.add(Math.round(viewportWidth / 2 - (item.x + item.width / 2)));

    candidateYs.add(-item.y);
    candidateYs.add(viewportHeight - (item.y + item.height));
    candidateYs.add(Math.round(viewportHeight / 2 - (item.y + item.height / 2)));
  }

  let bestOffset = INITIAL_OFFSET;
  let bestVisibleCount = -1;
  let bestVisibleArea = -1;

  for (const x of candidateXs) {
    for (const y of candidateYs) {
      const candidateOffset = { x, y };
      let visibleCount = 0;
      let visibleArea = 0;

      for (const item of items) {
        const itemVisibleArea = getItemVisibleArea(
          item,
          candidateOffset,
          viewportWidth,
          viewportHeight,
        );

        if (itemVisibleArea > 400) {
          visibleCount += 1;
        }

        visibleArea += itemVisibleArea;
      }

      if (
        visibleCount > bestVisibleCount ||
        (visibleCount === bestVisibleCount && visibleArea > bestVisibleArea)
      ) {
        bestOffset = candidateOffset;
        bestVisibleCount = visibleCount;
        bestVisibleArea = visibleArea;
      }
    }
  }

  return bestOffset;
}

function isVideoCard(card: PlaygroundCard) {
  if (card.mediaType) {
    return card.mediaType === "video";
  }

  return /\.(mp4|webm|mov|m4v)$/i.test(card.image);
}

const playgroundLayout = buildLayout(playgroundCards);
const renderedItemCopies: readonly RenderedItemCopy[] = playgroundLayout.flatMap((item) =>
  TILE_RANGE.flatMap((copyY) =>
    TILE_RANGE.map((copyX) => ({
      copyX,
      copyY,
      item,
      key: `${item.id}-${copyX}-${copyY}`,
    })),
  ),
);

export function DraggablePlayground() {
  const stageRef = useRef<HTMLDivElement>(null);
  const dragSessionRef = useRef<DragSession | null>(null);
  const hasInteractedRef = useRef(false);
  const offsetRef = useRef(INITIAL_OFFSET);
  const animationFrameRef = useRef<number | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  function setDragging(isDragging: boolean) {
    const stage = stageRef.current;

    if (stage) {
      stage.dataset.dragging = isDragging ? "true" : "false";
    }

    document.body.classList.toggle("playground-dragging", isDragging);
  }

  function paintItems() {
    animationFrameRef.current = null;

    renderedItemCopies.forEach((entry, index) => {
      const itemElement = itemRefs.current[index];

      if (!itemElement) {
        return;
      }

      itemElement.style.transform = getItemTransform(
        entry.item,
        entry.copyX,
        entry.copyY,
        offsetRef.current,
      );
    });
  }

  function queuePaint() {
    if (animationFrameRef.current !== null) {
      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(paintItems);
  }

  function updateOffset(nextX: number, nextY: number) {
    offsetRef.current = {
      x: nextX,
      y: nextY,
    };
    queuePaint();
  }

  function finishDrag(pointerId: number) {
    if (!dragSessionRef.current || dragSessionRef.current.pointerId !== pointerId) {
      return;
    }

    if (stageRef.current?.hasPointerCapture(pointerId)) {
      stageRef.current.releasePointerCapture(pointerId);
    }

    dragSessionRef.current = null;
    setDragging(false);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    hasInteractedRef.current = true;
    dragSessionRef.current = {
      originX: offsetRef.current.x,
      originY: offsetRef.current.y,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const dragSession = dragSessionRef.current;

    if (!dragSession || dragSession.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    updateOffset(
      dragSession.originX + (event.clientX - dragSession.startX),
      dragSession.originY + (event.clientY - dragSession.startY),
    );
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

    if (dragSessionRef.current) {
      return;
    }

    hasInteractedRef.current = true;
    updateOffset(offsetRef.current.x - event.deltaX, offsetRef.current.y - event.deltaY);
  }

  useLayoutEffect(() => {
    function syncInitialViewport() {
      const stage = stageRef.current;

      if (!stage || hasInteractedRef.current) {
        return;
      }

      const { width, height } = stage.getBoundingClientRect();

      if (width <= 0 || height <= 0) {
        return;
      }

      offsetRef.current = getOptimalInitialOffset(playgroundLayout, width, height);
      paintItems();
    }

    syncInitialViewport();
    window.addEventListener("resize", syncInitialViewport);

    return () => {
      window.removeEventListener("resize", syncInitialViewport);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      document.body.classList.remove("playground-dragging");
    };
  }, []);

  return (
    <section
      aria-label="Infinite playground of experiments and project fragments"
      className="playground-stage"
      data-dragging="false"
      onLostPointerCapture={handleLostPointerCapture}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      ref={stageRef}
    >
      <div className="playground-helper">
        <span>SCROLL OR DRAG</span>
      </div>

      <div className="playground-canvas">
        {renderedItemCopies.map((entry, index) => {
          const isPrimaryCopy = entry.copyX === 0 && entry.copyY === 0;

          return (
            <article
              aria-hidden={!isPrimaryCopy}
              className="playground-card"
              data-size={entry.item.size}
              key={entry.key}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              style={{
                height: `${entry.item.height}px`,
                transform: getItemTransform(
                  entry.item,
                  entry.copyX,
                  entry.copyY,
                  INITIAL_OFFSET,
                ),
                width: `${entry.item.width}px`,
                zIndex: entry.item.zIndex,
              }}
            >
              <div className="playground-card-media">
                {isVideoCard(entry.item) ? (
                  <video
                    aria-label={isPrimaryCopy ? `${entry.item.title}. ${entry.item.caption}` : ""}
                    autoPlay
                    className="playground-card-video"
                    loop
                    muted
                    playsInline
                    src={entry.item.image}
                  />
                ) : (
                  <Image
                    alt={isPrimaryCopy ? `${entry.item.title}. ${entry.item.caption}` : ""}
                    className="playground-card-image"
                    draggable={false}
                    height={entry.item.mediaHeight}
                    sizes={IMAGE_SIZES[entry.item.size]}
                    src={entry.item.image}
                    width={entry.item.mediaWidth}
                  />
                )}
              </div>

              <div className="playground-card-copy">
                <h2 className="playground-card-title">{entry.item.title}</h2>
                <p className="playground-card-caption">{entry.item.caption}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
