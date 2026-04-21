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

export type ProjectGalleryItem =
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

function getProjectImageFileNames(projectSlug: string) {
  const galleryDirectory = path.join(projectImageDirectory, projectSlug);
  let fileNames: string[] = [];

  try {
    fileNames = readdirSync(galleryDirectory, { withFileTypes: true })
      .filter((file) => file.isFile())
      .map((file) => file.name)
      .filter((fileName) => supportedExtensions.has(path.extname(fileName).toLowerCase()))
      .sort((first, second) => naturalSort.compare(first, second));
  } catch {
    fileNames = [];
  }

  return fileNames;
}

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

function getProjectHeroFileName(fileNames: string[]) {
  const imageFileNames = fileNames.filter(isSupportedImage);

  return imageFileNames.find(isProjectHeroImage) ?? imageFileNames[0] ?? null;
}

function toProjectImage(
  projectSlug: string,
  projectName: string,
  fileName: string,
  index: number,
): ProjectGalleryImage {
  const title = getProjectImageTitle(fileName);

  return {
    fileName,
    id: `${projectSlug}-${index}-${fileName}`,
    kind: getProjectMediaKind(fileName),
    title,
    alt: `${projectName} project ${getProjectMediaKind(fileName)}: ${title}.`,
    src: `/projects/${encodeURIComponent(projectSlug)}/${encodeURIComponent(fileName)}`,
  };
}

function getNormalizedFileName(fileName: string) {
  return fileName.toLowerCase();
}

export function getProjectHeroImage(projectSlug: string, projectName: string) {
  const heroImage = getProjectHeroFileName(getProjectImageFileNames(projectSlug));

  if (!heroImage) {
    return null;
  }

  return toProjectImage(projectSlug, projectName, heroImage, 0);
}

export function getProjectGalleryImages(projectSlug: string, projectName: string) {
  const projectFileNames = getProjectImageFileNames(projectSlug);
  const heroImage = getProjectHeroFileName(projectFileNames);
  const fileNames = projectFileNames.filter((fileName) => fileName !== heroImage);

  return fileNames.map((fileName, index): ProjectGalleryImage => {
    return toProjectImage(projectSlug, projectName, fileName, index);
  });
}

export function getProjectGalleryItems(projectSlug: string, projectName: string) {
  const images = getProjectGalleryImages(projectSlug, projectName);
  const pairDefinitions = projectImagePairs[projectSlug] ?? [];
  const usedFileNames = new Set<string>();

  return images.reduce<ProjectGalleryItem[]>((items, image) => {
    const normalizedFileName = getNormalizedFileName(image.fileName);

    if (usedFileNames.has(normalizedFileName)) {
      return items;
    }

    const pairDefinition = pairDefinitions.find(
      ([firstFileName]) => getNormalizedFileName(firstFileName) === normalizedFileName,
    );

    if (pairDefinition) {
      const pairImage = images.find(
        (candidate) =>
          getNormalizedFileName(candidate.fileName) === getNormalizedFileName(pairDefinition[1]),
      );

      if (pairImage) {
        usedFileNames.add(normalizedFileName);
        usedFileNames.add(getNormalizedFileName(pairImage.fileName));

        return [
          ...items,
          {
            type: "pair",
            id: `${image.id}-${pairImage.id}`,
            images: [image, pairImage],
          },
        ];
      }
    }

    usedFileNames.add(normalizedFileName);

    return [
      ...items,
      {
        type: "image",
        id: image.id,
        image,
      },
    ];
  }, []);
}
