"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";

export function HomeIntroAnimator() {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>('main[data-home-intro="true"]');

    if (!root) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.dataset.homeIntroState = "done";
      return;
    }

    root.dataset.homeIntroState = "animating";

    const context = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".intro-headline-word");
      const eyebrow = root.querySelector<HTMLElement>(".page-hero-eyebrow");
      const nav = root.querySelector<HTMLElement>(".site-header");
      const projects = gsap.utils.toArray<HTMLElement>(".project-stack > *");

      gsap.set(words, {
        opacity: 0,
        yPercent: 105,
      });

      if (eyebrow) {
        gsap.set(eyebrow, {
          opacity: 0,
          y: 24,
        });
      }

      if (nav) {
        gsap.set(nav, {
          opacity: 0,
          y: 24,
        });
      }

      if (projects.length > 0) {
        gsap.set(projects, {
          opacity: 0,
          y: 24,
        });
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
        onComplete: () => {
          root.dataset.homeIntroState = "done";
        },
      });

      if (words.length > 0) {
        timeline.to(words, {
          duration: 0.8,
          opacity: 1,
          yPercent: 0,
          stagger: 0.08,
        });
      }

      if (eyebrow) {
        timeline.to(
          eyebrow,
          {
            duration: 0.55,
            opacity: 1,
            y: 0,
          },
          "-=0.2",
        );
      }

      if (nav) {
        timeline.to(
          nav,
          {
            duration: 0.55,
            opacity: 1,
            y: 0,
          },
          "-=0.15",
        );
      }

      if (projects.length > 0) {
        timeline.to(
          projects,
          {
            duration: 0.7,
            opacity: 1,
            y: 0,
            stagger: 0.12,
          },
          "-=0.1",
        );
      }
    }, root);

    return () => {
      context.revert();
      root.dataset.homeIntroState = "done";
    };
  }, []);

  return null;
}
