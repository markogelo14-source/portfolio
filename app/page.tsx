import type { CSSProperties } from "react";

import { SiteFooter, SiteNav } from "./components";
import { PageTransitionLink } from "./page-transition-link";
import { projects } from "./projects/project-data";

export default function Home() {
  return (
    <main className="portfolio-page">
      <SiteNav />

      <section className="site-band home-intro">
        <p aria-label="Marko Gelo, Product designer at Sofascore" className="home-identity">
          <span className="home-identity-name">Marko Gelo</span>
          <span aria-hidden="true" className="home-identity-separator">
            ·
          </span>
          <span className="home-identity-role">
            Product designer @{" "}
            <a className="home-identity-link" href="https://www.sofascore.com/hr">
              <span className="underline">Sofascore</span>
            </a>
          </span>
        </p>

        <h1 className="statement">I like to design and experiment.</h1>
      </section>

      <section aria-label="Selected work" className="site-band project-stack" id="work">
        {projects.map((project) => (
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
        ))}
      </section>

      <SiteFooter />
    </main>
  );
}
