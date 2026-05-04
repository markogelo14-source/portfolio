import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PageHero, SiteFooter, SiteNav } from "../../components";
import { PageTransitionLink } from "../../page-transition-link";
import {
  getProjectGallery,
  type ProjectGalleryImage,
} from "../project-gallery-data";
import { getNextProject, getProjectBySlug, projects } from "../project-data";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const projectMediaSizes = "(max-width: 640px) calc(100vw - 2rem), 72rem";
const projectMediaPairSizes =
  "(max-width: 640px) calc((100vw - 3rem) / 2), (max-width: 980px) calc((100vw - 6rem) / 2), 34rem";

function getSurfaceStyle(base: string, accent: string, glow: string) {
  return {
    "--surface-base": base,
    "--surface-accent": accent,
    "--surface-glow": glow,
  } as CSSProperties;
}

type ProjectMediaProps = {
  media: ProjectGalleryImage;
  sizes: string;
  preload?: boolean;
};

function ProjectMedia({ media, sizes, preload = false }: ProjectMediaProps) {
  if (media.kind === "video") {
    return (
      <video
        aria-label={media.alt}
        autoPlay
        className="project-image project-video"
        height={media.height}
        loop
        muted
        playsInline
        preload="metadata"
        src={media.src}
        style={{ aspectRatio: `${media.width} / ${media.height}` }}
        width={media.width}
      />
    );
  }

  return (
    <Image
      alt={media.alt}
      className="project-image"
      decoding="async"
      fetchPriority={preload ? "high" : "auto"}
      height={media.height}
      loading={preload ? "eager" : "lazy"}
      preload={preload}
      sizes={sizes}
      src={media.src}
      width={media.width}
    />
  );
}

export function generateStaticParams() {
  return projects
    .filter((project) => project.isAvailable !== false)
    .map((project) => ({
    slug: project.slug,
    }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.isAvailable === false) {
    return {
      title: "Marko Gelo",
      description:
        "Editorial portfolio for Marko Gelo, a product designer building thoughtful digital experiences.",
    };
  }

  return {
    title: `${project.name} | Marko Gelo`,
    description: project.detailDescription,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.isAvailable === false) {
    notFound();
  }

  const nextProject = getNextProject(project.slug);
  const { galleryItems, heroImage } = getProjectGallery(project.slug, project.name);
  const websiteMeta = project.meta.find((item) => item.href);
  const detailItems = [
    {
      label: "Project",
      value: project.kicker,
    },
    ...project.meta
      .filter((item) => !item.href)
      .map((item) => ({
        label: item.label,
        value: item.value,
      })),
  ];

  return (
    <main className="portfolio-page">
      <SiteNav
        breadcrumb={{
          backHref: "/",
          label: "Work",
          href: "/",
          current: project.name,
        }}
      />

      <section className="site-band project-detail-band project-detail-stack">
        <PageHero eyebrow={<p className="page-hero-label">{project.name}</p>} title={project.detailIntro} />

        {heroImage ? (
          <div className="project-image-frame project-hero-image">
            <ProjectMedia media={heroImage} preload sizes={projectMediaSizes} />
          </div>
        ) : (
          <section
            aria-label={`${project.name} feature visual`}
            className="visual-surface visual-surface-large"
            style={getSurfaceStyle(project.detailColor, project.detailAccent, project.detailGlow)}
          />
        )}

        <section aria-label={`${project.name} project details`} className="project-detail-grid">
          <div className="project-detail-column">
            <div className="small-gap-column">
            <h2 className="project-section-label">Details</h2>

            <div className="project-detail-list">
              {detailItems.map((item) => (
                <p className="project-detail-row" key={item.label}>
                  <span className="project-detail-row-label">{item.label}:</span>{" "}
                  <span>{item.value}</span>
                </p>
              ))}
            </div>
            </div>

            {websiteMeta ? (
              <a
                className="project-detail-link"
                href={websiteMeta.href}
                rel="noreferrer"
                target="_blank"
              >
                Check live project
              </a>
            ) : null}
          </div>

          <div className="project-detail-column project-detail-copy">
            <section className="project-copy-block">
              <h2 className="project-section-label">Overview</h2>
              <p className="project-body">{project.detailDescription}</p>
            </section>

            <section className="project-copy-block">
              <h2 className="project-section-label">Goal</h2>
              <p className="project-body">
                {project.detailGoal ??
                  "Project goal details coming soon. This section is a placeholder until final case study copy is ready."}
              </p>
            </section>
          </div>
        </section>

        <div className="gallery-stack">
          {galleryItems.length > 0
            ? galleryItems.map((item) =>
                item.type === "pair" ? (
                  <div className="project-gallery-pair" key={item.id}>
                    {item.images.map((image) => (
                      <div
                        className="project-image-frame project-gallery-image project-gallery-image-square"
                        key={image.id}
                      >
                        <ProjectMedia media={image} sizes={projectMediaPairSizes} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="project-image-frame project-gallery-image" key={item.id}>
                    <ProjectMedia media={item.image} sizes={projectMediaSizes} />
                  </div>
                ),
              )
            : project.gallery.map((panel) => (
                <section
                  aria-label={panel.label}
                  className="visual-surface visual-surface-gallery"
                  key={panel.label}
                  style={getSurfaceStyle(panel.base, panel.accent, panel.glow)}
                />
              ))}
        </div>

        {nextProject ? (
          <PageTransitionLink
            className="next-project-card"
            href={`/projects/${nextProject.slug}`}
            style={getSurfaceStyle(
              nextProject.cardColor,
              nextProject.cardAccent,
              nextProject.cardGlow,
            )}
          >
            <h2 className="next-project-title">{nextProject.name}</h2>
            <p className="next-project-label">Next project</p>
          </PageTransitionLink>
        ) : null}
      </section>

      <SiteFooter />
    </main>
  );
}
