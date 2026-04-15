import type { ReactNode } from "react";
import Link from "next/link";

import { navLinks, siteData } from "./site-data";

type SiteNavProps = {
  currentProject?: string;
};

type SmartLinkProps = {
  className?: string;
  href: string;
  children: ReactNode;
};

function SmartLink({ className, href, children }: SmartLinkProps) {
  if (href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

export function SiteNav({ currentProject }: SiteNavProps) {
  if (currentProject) {
    return (
      <header className="site-band">
        <div className="site-nav-shell">
          <Link className="back-link" href="/">
            <span aria-hidden="true">{"<"}</span>
            <span>Back</span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            <span className="nav-breadcrumb">
              <Link className="nav-link nav-link-muted" href="/#work">
                Work
              </Link>
              <span className="nav-slash">/</span>
              <span className="nav-link nav-link-current">{currentProject}</span>
            </span>

            {navLinks
              .filter((link) => link.label !== "Work")
              .map((link) => (
                <SmartLink className="nav-link nav-link-muted" href={link.href} key={link.label}>
                  {link.label}
                </SmartLink>
              ))}
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="site-band">
      <div className="site-nav-shell">
        <Link aria-label={`${siteData.name} home`} className="brand-mark" href="/">
          <span className="brand-orb" />
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {navLinks.map((link, index) => (
            <SmartLink
              className={`nav-link ${index === 0 ? "nav-link-current" : "nav-link-muted"}`}
              href={link.href}
              key={link.label}
            >
              {link.label}
            </SmartLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-band" id="contact">
      <div className="site-footer-shell">
        <p className="footer-note">{siteData.footerNote}</p>

        <div className="footer-links">
          <SmartLink className="footer-link" href={siteData.cvHref}>
            CV
          </SmartLink>
          <SmartLink className="footer-link" href={`mailto:${siteData.email}`}>
            {siteData.email}
          </SmartLink>
        </div>
      </div>
    </footer>
  );
}
