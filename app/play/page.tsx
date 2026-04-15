import type { Metadata } from "next";

import { PlaceholderPage } from "../placeholder-page";

export const metadata: Metadata = {
  title: "Play | Marko Gelo",
  description: "Placeholder page for experiments, side projects, and playful explorations.",
};

export default function PlayPage() {
  return (
    <PlaceholderPage
      accent="#5f8fcb"
      eyebrow="Experiments / Motion / Side quests"
      intro="This page will become a home for smaller ideas, playful prototypes, and things that sit outside the polished case-study format."
      note="For now, this placeholder keeps the route active and gives the section a clear destination until the final design direction is ready."
      panels={[
        {
          title: "Experiments",
          description: "Interface sketches, motion studies, and visual concepts that are more exploratory than client-facing.",
        },
        {
          title: "Builds",
          description: "Small coded ideas, interactive prototypes, and side projects made to test an instinct quickly.",
        },
        {
          title: "Notes",
          description: "Fragments, references, and unfinished directions that are still worth keeping visible.",
        },
      ]}
      softAccent="#e7eef9"
      tags={["Prototypes", "Motion", "Sketches"]}
      title="Play"
    />
  );
}
