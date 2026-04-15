import type { ReactNode } from "react";
import Link from "next/link";

type SiteNavProps = {
  breadcrumb?: {
    backHref?: string;
    label: string;
    href: string;
    current: string;
  };
  currentLabel?: string;
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

export function SiteNav({ breadcrumb, currentLabel = "Work" }: SiteNavProps) {
  if (breadcrumb) {
    return (
      <header className="site-chrome site-header">
        <div className="site-band">
          <div className="site-nav-shell">
            <Link className="back-link" href={breadcrumb.backHref ?? breadcrumb.href}>
              <span aria-hidden="true">{"<"}</span>
              <span>Back</span>
            </Link>

            <nav className="nav-links" aria-label="Primary">
              <span className="nav-breadcrumb">
                <Link className="nav-link nav-link-muted" href={breadcrumb.href}>
                  {breadcrumb.label}
                </Link>
                <span className="nav-slash">/</span>
                <span className="nav-link nav-link-current">{breadcrumb.current}</span>
              </span>

              <SmartLink className="nav-link nav-link-muted" href="/#contact">
                Contact
              </SmartLink>
              <SmartLink className="nav-link nav-link-muted" href="/about">
                About
              </SmartLink>
              <SmartLink className="nav-link nav-link-muted" href="/play">
                Play
              </SmartLink>
              <SmartLink className="nav-link nav-link-muted" href="/photos">
                Photos
              </SmartLink>
            </nav>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="site-chrome site-header">
      <div className="site-band">
        <div className="site-nav-shell">
          <Link aria-label="Marko Gelo home" className="brand-mark" href="/">
            <span className="brand-orb" />
          </Link>

          <nav className="nav-links" aria-label="Primary">
            <SmartLink
              className={`nav-link ${currentLabel === "Work" ? "nav-link-current" : "nav-link-muted"}`}
              href="/"
            >
              Work
            </SmartLink>
            <SmartLink
              className={`nav-link ${currentLabel === "About" ? "nav-link-current" : "nav-link-muted"}`}
              href="/about"
            >
              About
            </SmartLink>
            <SmartLink
              className={`nav-link ${currentLabel === "Play" ? "nav-link-current" : "nav-link-muted"}`}
              href="/play"
            >
              Play
            </SmartLink>
            <SmartLink
              className={`nav-link ${currentLabel === "Photos" ? "nav-link-current" : "nav-link-muted"}`}
              href="/photos"
            >
              Photos
            </SmartLink>
            <SmartLink
              className={`nav-link ${currentLabel === "Contact" ? "nav-link-current" : "nav-link-muted"}`}
              href="/#contact"
            >
              Contact
            </SmartLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-chrome site-footer" id="contact">
      <div className="site-band">
        <div className="site-footer-shell">
          <p className="footer-note">Designed + coded by Marko :)</p>

          <div className="footer-links">
            <SmartLink
              className="footer-link"
              href="mailto:markogelo14@gmail.com?subject=Marko%20Gelo%20CV"
            >
              CV
            </SmartLink>
            <SmartLink className="footer-link" href="mailto:markogelo14@gmail.com">
              markogelo14@gmail.com
            </SmartLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
