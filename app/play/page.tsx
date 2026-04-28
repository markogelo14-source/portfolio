import type { CSSProperties } from "react";
import type { Metadata } from "next";

import { SiteFooter, SiteNav } from "../components";

export const metadata: Metadata = {
  title: "Play | Marko Gelo",
  description: "Placeholder page for experiments, side projects, and playful explorations.",
};

export default function PlayPage() {
  return (
    <main className="portfolio-page">
      <SiteNav currentLabel="Play" />

      <section className="site-band project-detail-stack">
        <div className="detail-identity column">
          <p className="identity-name">Play</p>
          <h1 className="detail-intro">
            This page will become a home for smaller ideas, playful prototypes, and things that sit outside the polished
            case-study format.
          </h1>
        </div>

        <section
          aria-label="Play placeholder"
          className="placeholder-surface"
          style={
            {
              "--placeholder-accent": "#5f8fcb",
              "--placeholder-soft-accent": "#e7eef9",
            } as CSSProperties
          }
        >
          <p className="placeholder-eyebrow">Experiments / Motion / Side quests</p>

          <div className="project-copy-block column">
            <h2 className="section-title">Placeholder page</h2>
            <p className="project-body placeholder-note">
              For now, this placeholder keeps the route active and gives the section a clear destination until the final
              design direction is ready.
            </p>
          </div>

          <div aria-label="Play planned content" className="placeholder-tag-list">
            <span className="placeholder-tag">Prototypes</span>
            <span className="placeholder-tag">Motion</span>
            <span className="placeholder-tag">Sketches</span>
          </div>
        </section>

        <section aria-label="Play page plan" className="meta-grid">
          <article className="meta-card">
            <h2 className="meta-card-label">Experiments</h2>
            <p className="meta-card-value">
              Interface sketches, motion studies, and visual concepts that are more exploratory than client-facing.
            </p>
          </article>

          <article className="meta-card">
            <h2 className="meta-card-label">Builds</h2>
            <p className="meta-card-value">
              Small coded ideas, interactive prototypes, and side projects made to test an instinct quickly.
            </p>
          </article>

          <article className="meta-card">
            <h2 className="meta-card-label">Notes</h2>
            <p className="meta-card-value">
              Fragments, references, and unfinished directions that are still worth keeping visible.
            </p>
          </article>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
