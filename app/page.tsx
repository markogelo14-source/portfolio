import {
  contactLinks,
  featuredProjects,
  principles,
  siteData,
  stats,
  timeline,
} from "./site-data";

export default function Home() {
  return (
    <main className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="site-header">
        <a className="brand" href="#top">
          <span className="brand-mark">MG</span>
          <span className="brand-copy">
            <strong>{siteData.name}</strong>
            <span>{siteData.role}</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero section-card" id="top">
        <div className="hero-copy">
          <p className="eyebrow">{siteData.status}</p>
          <h1>
            A high-clarity portfolio starter built for strong first impressions.
          </h1>
          <p className="lede">{siteData.intro}</p>

          <div className="cta-row">
            <a className="button button-primary" href="#work">
              Explore the structure
            </a>
            <a className="button button-secondary" href="#contact">
              Make it yours
            </a>
          </div>

          <div className="hero-meta">
            <div>
              <span className="meta-label">Based in</span>
              <strong>{siteData.location}</strong>
            </div>
            <div>
              <span className="meta-label">Focus</span>
              <strong>{siteData.focus}</strong>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <p className="panel-label">Starter direction</p>
          <div className="panel-stack">
            <article>
              <span>01</span>
              <h2>Show signature work</h2>
              <p>Swap in your best projects and add proof, not just screenshots.</p>
            </article>
            <article>
              <span>02</span>
              <h2>Tell the story</h2>
              <p>Use the process area to explain how you think, decide, and ship.</p>
            </article>
            <article>
              <span>03</span>
              <h2>Keep momentum high</h2>
              <p>Iterate section by section in code or use Paper MCP to explore layouts.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="stats-grid" aria-label="Project stats">
        {stats.map((item) => (
          <article className="stat-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="section-card" id="work">
        <div className="section-heading">
          <p className="eyebrow">Selected work slots</p>
          <h2>Replace these cards with your strongest shipped projects.</h2>
        </div>

        <div className="project-grid">
          {featuredProjects.map((project) => (
            <article className="project-card" key={project.name}>
              <p className="project-impact">{project.impact}</p>
              <h3>{project.name}</h3>
              <p>{project.summary}</p>
              <div className="tag-row">
                {project.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <a className="project-link" href={project.href}>
                Use this slot
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section" id="process">
        <article className="section-card">
          <div className="section-heading">
            <p className="eyebrow">How I work</p>
            <h2>A simple process that keeps design and implementation moving together.</h2>
          </div>

          <div className="principle-list">
            {principles.map((item) => (
              <article className="principle-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="section-card">
          <div className="section-heading">
            <p className="eyebrow">Current arc</p>
            <h2>Use the timeline to position where you are and what you are building toward.</h2>
          </div>

          <div className="timeline">
            {timeline.map((item) => (
              <article className="timeline-item" key={item.title}>
                <span>{item.period}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="section-card contact-card" id="contact">
        <div className="section-heading">
          <p className="eyebrow">Contact</p>
          <h2>Make it easy for the right people to reach out when the timing is good.</h2>
        </div>

        <div className="contact-layout">
          <p>
            Update the contact details in <code>app/site-data.ts</code>, add your real
            links, and this section is ready to go live.
          </p>

          <div className="contact-links" aria-label="Contact links">
            {contactLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
