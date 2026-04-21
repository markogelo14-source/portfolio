import { readdirSync } from "node:fs";
import path from "node:path";

import photoTitlesData from "../../public/photos/photo-titles.json";

export type PhotoItem = {
  id: string;
  title: string;
  alt: string;
  src: string;
  position?: string;
  fill?: string;
};

const photoDirectory = path.join(process.cwd(), "public", "photos");
const supportedExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);
const naturalSort = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});
const photoTitles: Record<string, string> = photoTitlesData;

function getPhotoTitle(fileName: string) {
  const title = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+-/, "")
    .replace(/[-_]+/g, " ")
    .trim();

  if (!title) {
    return "Photo";
  }

  return title.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getPhotos() {
  let fileNames: string[] = [];

  try {
    fileNames = readdirSync(photoDirectory, { withFileTypes: true })
      .filter((file) => file.isFile())
      .map((file) => file.name)
      .filter((fileName) => supportedExtensions.has(path.extname(fileName).toLowerCase()))
      .sort((first, second) => naturalSort.compare(first, second));
  } catch {
    fileNames = [];
  }

  return fileNames.map((fileName, index): PhotoItem => {
    const title = photoTitles[fileName]?.trim() || getPhotoTitle(fileName);

    return {
      id: `${index}-${fileName}`,
      title,
      alt: `${title} photo.`,
      src: `/photos/${encodeURIComponent(fileName)}`,
    };
  });
}
