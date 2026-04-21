"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, type ComponentProps, type MouseEvent } from "react";

type PageTransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

const pageTransitionDuration = 500;
let activeSnapshot: HTMLElement | null = null;
let cleanupTimeout: number | null = null;
let enterTransitionPending = false;
let pendingScrollTarget: string | null | undefined;

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey || event.button !== 0;
}

function shouldSkipTransition(href: string, target?: string) {
  if (target && target !== "_self") {
    return true;
  }

  if (!href.startsWith("/") && !href.startsWith("#")) {
    return true;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clearPageTransition() {
  document.documentElement.classList.remove("page-transition-entering");
  enterTransitionPending = false;
  pendingScrollTarget = undefined;
  activeSnapshot?.remove();
  activeSnapshot = null;

  if (cleanupTimeout !== null) {
    window.clearTimeout(cleanupTimeout);
    cleanupTimeout = null;
  }
}

function createPageSnapshot() {
  const page = document.querySelector<HTMLElement>("body > .portfolio-page");

  if (!page) {
    return null;
  }

  const snapshot = document.createElement("div");
  const snapshotInner = page.cloneNode(true) as HTMLElement;

  snapshot.className = "page-transition-snapshot";
  snapshotInner.classList.add("page-transition-snapshot-inner");
  snapshotInner.style.top = `${-window.scrollY}px`;

  snapshot.appendChild(snapshotInner);
  document.body.appendChild(snapshot);

  return snapshot;
}

function runPageEnterTransition() {
  if (!document.documentElement.classList.contains("page-transition-entering")) {
    return;
  }

  if (enterTransitionPending) {
    return;
  }

  enterTransitionPending = true;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      document.documentElement.classList.remove("page-transition-entering");
      activeSnapshot?.classList.add("page-transition-snapshot-leaving");

      cleanupTimeout = window.setTimeout(() => {
        activeSnapshot?.remove();
        activeSnapshot = null;
        cleanupTimeout = null;
        enterTransitionPending = false;
      }, pageTransitionDuration);
    });
  });
}

function applyPendingScrollTarget() {
  if (pendingScrollTarget === undefined) {
    return;
  }

  if (pendingScrollTarget) {
    const targetId = decodeURIComponent(pendingScrollTarget.slice(1));
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "auto", block: "start" });
      pendingScrollTarget = undefined;
      return;
    }
  }

  window.scrollTo({ left: 0, top: 0, behavior: "auto" });
  pendingScrollTarget = undefined;
}

function resetScrollBehindSnapshot() {
  window.scrollTo({ left: 0, top: 0, behavior: "auto" });
}

export function PageTransitionLink({
  href,
  onClick,
  replace,
  scroll,
  target,
  ...props
}: PageTransitionLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  useLayoutEffect(() => {
    applyPendingScrollTarget();
    runPageEnterTransition();
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (!document.documentElement.classList.contains("page-transition-entering")) {
        clearPageTransition();
      }
    };
  }, []);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (event.defaultPrevented || isModifiedClick(event) || shouldSkipTransition(href, target)) {
      return;
    }

    const nextUrl = new URL(href, window.location.href);
    const samePath = nextUrl.pathname === window.location.pathname;
    const sameSearch = nextUrl.search === window.location.search;
    const sameHash = nextUrl.hash === window.location.hash;

    if (samePath && sameSearch && (sameHash || nextUrl.hash)) {
      return;
    }

    event.preventDefault();
    clearPageTransition();

    activeSnapshot = createPageSnapshot();
    pendingScrollTarget = scroll === false ? undefined : nextUrl.hash || null;
    document.documentElement.classList.add("page-transition-entering");

    if (scroll !== false) {
      resetScrollBehindSnapshot();
    }

    const nextHref = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;

    if (replace) {
      router.replace(nextHref, { scroll: false });
      return;
    }

    router.push(nextHref, { scroll: false });
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      replace={replace}
      scroll={scroll}
      target={target}
      {...props}
    />
  );
}
