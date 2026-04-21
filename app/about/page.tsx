import type { Metadata } from "next";

import { SiteFooter, SiteNav } from "../components";

export const metadata: Metadata = {
  title: "About | Marko Gelo",
  description: "A short introduction to Marko Gelo's design background and approach.",
};

export default function AboutPage() {
  return (
    <main className="portfolio-page">
      <SiteNav currentLabel="About" />

      <section className="site-band about-page">
        <div className="about-heading">
          <p className="identity-name">About</p>
          <h1 className="about-title">
            I am Marko, a product designer who likes clean systems, useful details, and a little room to experiment.
          </h1>
        </div>

        <div className="about-copy">
          <p>
            Currently designing at Sofascore, where I work on digital products that make dense sports data feel faster,
            clearer, and easier to use.
          </p>
          <p>
            Before that, I worked across mobile apps, dashboards, websites, and design systems for teams that needed
            thoughtful interfaces with a practical point of view.
          </p>
          <p>
            Outside of product work, I like photography, visual experiments, and small coded ideas that help me test how
            something should feel before it becomes too polished.
          </p>

          <a className="about-link" href="mailto:markogelo14@gmail.com">
            markogelo14@gmail.com
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
