import type { CSSProperties } from "react";

import { SiteFooter, SiteNav } from "./components";
import { PageTransitionLink } from "./page-transition-link";
import { projects } from "./site-data";

function getProjectCardStyle(project: (typeof projects)[number]) {
  return {
    "--project-base": project.cardColor,
    "--project-accent": project.cardAccent,
    "--project-glow": project.cardGlow,
  } as CSSProperties;
}

export default function Home() {
  return (
    <main className="portfolio-page">
      <SiteNav />

      <section className="site-band home-intro">
        <div className="identity-block column">
          <p className="identity-name">Marko Gelo</p>
          <p className="identity-role">Product designer @ <a href="https://www.sofascore.com/hr"><span className="underline">Sofascore</span></a></p>
        </div>

        <h1 className="statement">I like to design and experiment.</h1>
      </section>

      <section aria-label="Selected work" className="site-band project-stack" id="work">
        {projects.map((project) => (
          <PageTransitionLink
            className="project-card"
            href={`/projects/${project.slug}`}
            key={project.slug}
            style={getProjectCardStyle(project)}
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
