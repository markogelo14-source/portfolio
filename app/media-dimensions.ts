import { readFileSync } from "node:fs";
import path from "node:path";

export type MediaDimensions = {
  width: number;
  height: number;
};

const jpegSofMarkers = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);
const riffHeader = Buffer.from("RIFF");
const webpHeader = Buffer.from("WEBP");
const ispeHeader = Buffer.from("ispe");
const mediaDimensionsCache = new Map<string, MediaDimensions | null>();

function readMediaBuffer(filePath: string) {
  try {
    return readFileSync(filePath);
  } catch {
    return null;
  }
}

function getPngDimensions(buffer: Buffer): MediaDimensions | null {
  if (buffer.length < 24) {
    return null;
  }

  const pngSignature = "89504e470d0a1a0a";

  if (buffer.subarray(0, 8).toString("hex") !== pngSignature) {
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function getGifDimensions(buffer: Buffer): MediaDimensions | null {
  if (buffer.length < 10) {
    return null;
  }

  const signature = buffer.subarray(0, 6).toString("ascii");

  if (signature !== "GIF87a" && signature !== "GIF89a") {
    return null;
  }

  return {
    width: buffer.readUInt16LE(6),
    height: buffer.readUInt16LE(8),
  };
}

function getJpegDimensions(buffer: Buffer): MediaDimensions | null {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let offset = 2;

  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];

    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }

    if (offset + 4 > buffer.length) {
      return null;
    }

    const blockLength = buffer.readUInt16BE(offset + 2);

    if (blockLength < 2) {
      return null;
    }

    if (jpegSofMarkers.has(marker)) {
      if (offset + 9 > buffer.length) {
        return null;
      }

      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
      };
    }

    offset += blockLength + 2;
  }

  return null;
}

function getWebpDimensions(buffer: Buffer): MediaDimensions | null {
  if (buffer.length < 16) {
    return null;
  }

  if (!buffer.subarray(0, 4).equals(riffHeader) || !buffer.subarray(8, 12).equals(webpHeader)) {
    return null;
  }

  let offset = 12;

  while (offset + 8 <= buffer.length) {
    const chunkType = buffer.subarray(offset, offset + 4).toString("ascii");
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const dataOffset = offset + 8;

    if (chunkType === "VP8X" && dataOffset + 10 <= buffer.length) {
      return {
        width: 1 + buffer.readUIntLE(dataOffset + 4, 3),
        height: 1 + buffer.readUIntLE(dataOffset + 7, 3),
      };
    }

    if (chunkType === "VP8L" && dataOffset + 5 <= buffer.length && buffer[dataOffset] === 0x2f) {
      const bits = buffer.readUInt32LE(dataOffset + 1);

      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
      };
    }

    if (chunkType === "VP8 " && dataOffset + 10 <= buffer.length) {
      const frameHeaderOffset = dataOffset + 3;

      if (
        buffer[frameHeaderOffset] === 0x9d &&
        buffer[frameHeaderOffset + 1] === 0x01 &&
        buffer[frameHeaderOffset + 2] === 0x2a
      ) {
        return {
          width: buffer.readUInt16LE(frameHeaderOffset + 3) & 0x3fff,
          height: buffer.readUInt16LE(frameHeaderOffset + 5) & 0x3fff,
        };
      }
    }

    offset += 8 + chunkSize + (chunkSize % 2);
  }

  return null;
}

function getAvifDimensions(buffer: Buffer): MediaDimensions | null {
  let offset = 0;

  while (offset >= 0) {
    offset = buffer.indexOf(ispeHeader, offset);

    if (offset === -1 || offset + 16 > buffer.length) {
      return null;
    }

    const width = buffer.readUInt32BE(offset + 8);
    const height = buffer.readUInt32BE(offset + 12);

    if (width > 0 && height > 0) {
      return { width, height };
    }

    offset += 4;
  }

  return null;
}

function readStoredDimensions(filePath: string) {
  if (mediaDimensionsCache.has(filePath)) {
    return mediaDimensionsCache.get(filePath) ?? null;
  }

  const extension = path.extname(filePath).toLowerCase();
  const buffer = readMediaBuffer(filePath);
  let dimensions: MediaDimensions | null = null;

  if (buffer) {
    if (extension === ".png") {
      dimensions = getPngDimensions(buffer);
    } else if (extension === ".gif") {
      dimensions = getGifDimensions(buffer);
    } else if (extension === ".jpg" || extension === ".jpeg") {
      dimensions = getJpegDimensions(buffer);
    } else if (extension === ".webp") {
      dimensions = getWebpDimensions(buffer);
    } else if (extension === ".avif") {
      dimensions = getAvifDimensions(buffer);
    }
  }

  mediaDimensionsCache.set(filePath, dimensions);

  return dimensions;
}

export function getMediaDimensions(filePath: string, fallback: MediaDimensions) {
  return readStoredDimensions(filePath) ?? fallback;
}
