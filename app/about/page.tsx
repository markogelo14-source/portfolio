import type { Metadata } from "next";

import { PlaceholderPage } from "../placeholder-page";

export const metadata: Metadata = {
  title: "About | Marko Gelo",
  description: "Placeholder page for Marko Gelo's about section.",
};

export default function AboutPage() {
  return (
    <PlaceholderPage
      accent="#d59d42"
      eyebrow="Profile / Background / Approach"
      intro="A fuller introduction is on the way, with more context around experience, process, and the way I like to work."
      note="This route is intentionally lightweight for now so the navigation is settled before the final page design is ready."
      panels={[
        {
          title: "Background",
          description: "A short personal story, career path, and the kinds of teams and products I enjoy working on.",
        },
        {
          title: "Approach",
          description: "How I think about systems, collaboration, and making complex products feel calm and clear.",
        },
        {
          title: "Experience",
          description: "Selected roles, partnerships, and a quick snapshot of skills that support the project work.",
        },
      ]}
      softAccent="#f4ece0"
      tags={["Story", "Experience", "Process"]}
      title="About"
    />
  );
}
