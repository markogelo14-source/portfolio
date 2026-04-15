import type { CSSProperties } from "react";

import { SiteFooter, SiteNav } from "./components";

type PlaceholderCard = {
  title: string;
  description: string;
};

type PlaceholderPageProps = {
  accent: string;
  eyebrow: string;
  intro: string;
  note: string;
  panels: readonly PlaceholderCard[];
  softAccent: string;
  tags: readonly string[];
  title: string;
};

function getPlaceholderStyle(
  accent: string,
  softAccent: string,
): CSSProperties {
  return {
    "--placeholder-accent": accent,
    "--placeholder-soft-accent": softAccent,
  } as CSSProperties;
}

export function PlaceholderPage({
  accent,
  eyebrow,
  intro,
  note,
  panels,
  softAccent,
  tags,
  title,
}: PlaceholderPageProps) {
  return (
    <main className="portfolio-page">
      <SiteNav currentLabel={title} />

      <section className="site-band project-detail-stack">
        <div className="detail-identity column">
          <p className="identity-name">{title}</p>
          <h1 className="detail-intro">{intro}</h1>
        </div>

        <section
          aria-label={`${title} placeholder`}
          className="placeholder-surface"
          style={getPlaceholderStyle(accent, softAccent)}
        >
          <p className="placeholder-eyebrow">{eyebrow}</p>

          <div className="project-copy-block column">
            <h2 className="section-title">Placeholder page</h2>
            <p className="project-body placeholder-note">{note}</p>
          </div>

          <div className="placeholder-tag-list" aria-label={`${title} planned content`}>
            {tags.map((tag) => (
              <span className="placeholder-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section aria-label={`${title} page plan`} className="meta-grid">
          {panels.map((panel) => (
            <article className="meta-card" key={panel.title}>
              <h2 className="meta-card-label">{panel.title}</h2>
              <p className="meta-card-value">{panel.description}</p>
            </article>
          ))}
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
