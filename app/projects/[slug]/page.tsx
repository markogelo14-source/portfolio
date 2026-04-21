/* eslint-disable @next/next/no-img-element -- Project images are folder-driven and should keep their native aspect ratio. */
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter, SiteNav } from "../../components";
import { PageTransitionLink } from "../../page-transition-link";
import { getNextProject, getProjectBySlug, projects } from "../../site-data";
import {
  getProjectGalleryItems,
  getProjectHeroImage,
  type ProjectGalleryImage,
} from "../project-gallery-data";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getSurfaceStyle(base: string, accent: string, glow: string) {
  return {
    "--surface-base": base,
    "--surface-accent": accent,
    "--surface-glow": glow,
  } as CSSProperties;
}

function ProjectMedia({ media }: { media: ProjectGalleryImage }) {
  if (media.kind === "video") {
    return (
      <video
        aria-label={media.alt}
        autoPlay
        className="project-image project-video"
        loop
        muted
        playsInline
        preload="metadata"
        src={media.src}
      />
    );
  }

  return <img alt={media.alt} className="project-image" src={media.src} />;
}

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
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

  if (!project) {
    notFound();
  }

  const nextProject = getNextProject(project.slug);
  const heroImage = getProjectHeroImage(project.slug, project.name);
  const galleryItems = getProjectGalleryItems(project.slug, project.name);

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

      <section className="site-band project-detail-stack">
        <div className="detail-identity column">
          <p className="identity-name">{project.name}</p>
          <h1 className="detail-intro">{project.detailIntro}</h1>
        </div>

        {heroImage ? (
          <div className="project-image-frame project-hero-image">
            <ProjectMedia media={heroImage} />
          </div>
        ) : (
          <section
            aria-label={`${project.name} feature visual`}
            className="visual-surface visual-surface-large"
            style={getSurfaceStyle(project.detailColor, project.detailAccent, project.detailGlow)}
          />
        )}

        <section className="project-copy-block column">
          <h2 className="section-title">Project info</h2>
          <p className="project-body">{project.detailDescription}</p>
        </section>

        <section aria-label={`${project.name} project details`} className="meta-grid">
          {project.meta.map((item) => (
            <article className="meta-card" key={item.label}>
              <h3 className="meta-card-label">{item.label}</h3>
              {item.href ? (
                <a
                  className="meta-card-link meta-card-value"
                  href={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {item.value}
                </a>
              ) : (
                <p className="meta-card-value">{item.value}</p>
              )}
            </article>
          ))}
        </section>

        <div className="gallery-stack">
          {galleryItems.length > 0
            ? galleryItems.map((item) =>
                item.type === "pair" ? (
                  <div className="project-gallery-pair" key={item.id}>
                    {item.images.map((image) => (
                      <ProjectMedia key={image.id} media={image} />
                    ))}
                  </div>
                ) : (
                  <div className="project-image-frame project-gallery-image" key={item.id}>
                    <ProjectMedia media={item.image} />
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
