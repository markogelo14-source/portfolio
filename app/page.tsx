import type { CSSProperties } from "react";
import Link from "next/link";

import { SiteFooter, SiteNav } from "./components";
import { projects, siteData } from "./site-data";

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

      <section className="site-band home-intro" id="about">
        <div className="identity-block">
          <p className="identity-name">{siteData.name}</p>
          <p className="identity-role">{siteData.role}</p>
        </div>

        <h1 className="statement">{siteData.statement}</h1>
      </section>

      <section aria-label="Selected work" className="site-band project-stack" id="work">
        {projects.map((project, index) => (
          <Link
            className="project-card"
            href={`/projects/${project.slug}`}
            id={index === 2 ? "play" : index === 4 ? "photos" : undefined}
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
          </Link>
        ))}
      </section>

      <SiteFooter />
    </main>
  );
}
