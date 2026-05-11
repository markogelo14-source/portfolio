import type { CSSProperties } from "react";

import { PageHero, SiteFooter, SiteNav } from "./components";
import { HomeIntroAnimator } from "./home-intro-animator";
import { PageTransitionLink } from "./page-transition-link";
import { projects } from "./projects/project-data";

const homeHeadline = "Product designer drawn to structure, exploration, and intuitive experiences.";

function renderAnimatedHeadline(title: string) {
  return title.split(" ").map((word, index, words) => (
    <span className="intro-headline-word-wrap" key={`${word}-${index}`}>
      <span className="intro-headline-word">
        {word}
        {index < words.length - 1 ? "\u00A0" : null}
      </span>
    </span>
  ));
}

export default function Home() {
  return (
    <main className="portfolio-page" data-home-intro="true" data-home-intro-state="pending">
      <noscript>
        <style>{`
          main[data-home-intro="true"] .site-header,
          main[data-home-intro="true"] .page-hero-eyebrow,
          main[data-home-intro="true"] .intro-headline-word,
          main[data-home-intro="true"] .project-stack > * {
            opacity: 1 !important;
            transform: none !important;
          }
        `}</style>
      </noscript>

      <SiteNav />

      <section className="site-band page-hero-band">
        <PageHero
          eyebrow={
            <p aria-label="Marko Gelo, Product designer at Sofascore" className="home-identity">
              <span className="home-identity-name">Marko Gelo</span>
              <span aria-hidden="true" className="home-identity-separator">
                ·
              </span>
              <span className="home-identity-role">
                Product designer @{" "}
                <a className="home-identity-link" href="https://corporate.sofascore.com/">
                  <span className="underline">Sofascore</span>
                </a>
              </span>
            </p>
          }
          title={renderAnimatedHeadline(homeHeadline)}
        />
      </section>

      <section aria-label="Selected work" className="site-band project-stack" id="work">
        {projects.map((project) => (
          project.isAvailable === false ? (
            <article
              className="project-card project-card-disabled"
              key={project.slug}
              style={
                {
                  "--project-base": project.cardColor,
                  "--project-accent": project.cardAccent,
                  "--project-glow": project.cardGlow,
                } as CSSProperties
              }
            >
              <div className="project-card-top">
                <div className="project-card-copy">
                  <p className="project-kicker">{project.kicker}</p>
                  <h2 className="project-card-title">{project.name}</h2>
                </div>

                {project.cardStatus ? <p className="project-status">{project.cardStatus}</p> : null}
              </div>

              <p className="project-summary">{project.cardSummary}</p>
            </article>
          ) : (
            <PageTransitionLink
              className="project-card"
              href={`/projects/${project.slug}`}
              key={project.slug}
              style={
                {
                  "--project-base": project.cardColor,
                  "--project-accent": project.cardAccent,
                  "--project-glow": project.cardGlow,
                } as CSSProperties
              }
            >
              <div className="project-card-top">
                <div className="project-card-copy">
                  <p className="project-kicker">{project.kicker}</p>
                  <h2 className="project-card-title">{project.name}</h2>
                </div>

                {project.cardStatus ? <p className="project-status">{project.cardStatus}</p> : null}
              </div>

              <p className="project-summary">{project.cardSummary}</p>
            </PageTransitionLink>
          )
        ))}
      </section>

      <SiteFooter />
      <HomeIntroAnimator />
    </main>
  );
}
