import { readdirSync } from "node:fs";
import path from "node:path";

export type ProjectGalleryImage = {
  fileName: string;
  id: string;
  kind: "image" | "video";
  title: string;
  alt: string;
  src: string;
};

type ProjectGalleryItem =
  | {
      type: "image";
      id: string;
      image: ProjectGalleryImage;
    }
  | {
      type: "pair";
      id: string;
      images: readonly [ProjectGalleryImage, ProjectGalleryImage];
    };

const projectImageDirectory = path.join(process.cwd(), "public", "projects");
const projectImagePairs: Record<string, readonly (readonly [string, string])[]> = {
  hyperlight: [["Hyperlight 04.jpg", "Hyperlight 05.jpg"]],
  nutrivision: [["Nutri 04 20.03.37.jpg", "Nutri 05 20.03.37.jpg"]],
  rocket: [["Rocket 07.jpg", "Rocket 08.jpg"]],
};
const supportedImageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);
const supportedVideoExtensions = new Set([".m4v", ".mov", ".mp4", ".webm"]);
const supportedExtensions = new Set([
  ...supportedImageExtensions,
  ...supportedVideoExtensions,
]);
const naturalSort = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

function getProjectImageTitle(fileName: string) {
  const title = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+-/, "")
    .replace(/[-_]+/g, " ")
    .trim();

  if (!title) {
    return "Project image";
  }

  return title.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isProjectHeroImage(fileName: string) {
  const title = fileName.replace(/\.[^.]+$/, "").toLowerCase();

  return title.includes("header") || title.includes("hero");
}

function isSupportedImage(fileName: string) {
  return supportedImageExtensions.has(path.extname(fileName).toLowerCase());
}

function getProjectMediaKind(fileName: string) {
  return supportedVideoExtensions.has(path.extname(fileName).toLowerCase()) ? "video" : "image";
}

function toProjectImage(
  projectSlug: string,
  projectName: string,
  fileName: string,
  index: number,
): ProjectGalleryImage {
  const kind = getProjectMediaKind(fileName);
  const title = getProjectImageTitle(fileName);

  return {
    fileName,
    id: `${projectSlug}-${index}-${fileName}`,
    kind,
    title,
    alt: `${projectName} project ${kind}: ${title}.`,
    src: `/projects/${encodeURIComponent(projectSlug)}/${encodeURIComponent(fileName)}`,
  };
}

function getNormalizedFileName(fileName: string) {
  return fileName.toLowerCase();
}

function getProjectFileNames(projectSlug: string) {
  try {
    return readdirSync(path.join(projectImageDirectory, projectSlug), { withFileTypes: true })
      .filter((file) => file.isFile())
      .map((file) => file.name)
      .filter((fileName) => supportedExtensions.has(path.extname(fileName).toLowerCase()))
      .sort((first, second) => naturalSort.compare(first, second));
  } catch {
    return [];
  }
}

export function getProjectGallery(projectSlug: string, projectName: string) {
  const fileNames = getProjectFileNames(projectSlug);
  const heroFileName =
    fileNames.filter(isSupportedImage).find(isProjectHeroImage) ??
    fileNames.find(isSupportedImage) ??
    null;
  const heroImage = heroFileName ? toProjectImage(projectSlug, projectName, heroFileName, 0) : null;
  const images = fileNames
    .filter((fileName) => fileName !== heroFileName)
    .map((fileName, index) => toProjectImage(projectSlug, projectName, fileName, index));
  const pairDefinitions = projectImagePairs[projectSlug] ?? [];
  const imagesByFileName = new Map(
    images.map((image) => [getNormalizedFileName(image.fileName), image]),
  );
  const usedFileNames = new Set<string>();
  const galleryItems: ProjectGalleryItem[] = [];

  for (const image of images) {
    const normalizedFileName = getNormalizedFileName(image.fileName);

    if (usedFileNames.has(normalizedFileName)) {
      continue;
    }

    const pairDefinition = pairDefinitions.find(
      ([firstFileName]) => getNormalizedFileName(firstFileName) === normalizedFileName,
    );
    const pairImage = pairDefinition
      ? imagesByFileName.get(getNormalizedFileName(pairDefinition[1]))
      : null;

    if (pairImage) {
      usedFileNames.add(normalizedFileName);
      usedFileNames.add(getNormalizedFileName(pairImage.fileName));
      galleryItems.push({
        type: "pair",
        id: `${image.id}-${pairImage.id}`,
        images: [image, pairImage],
      });
      continue;
    }

    usedFileNames.add(normalizedFileName);
    galleryItems.push({
      type: "image",
      id: image.id,
      image,
    });
  }

  return {
    galleryItems,
    heroImage,
  };
}
