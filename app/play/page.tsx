import type { Metadata } from "next";

import { SiteFooter, SiteNav } from "../components";
import { DraggablePlayground } from "./draggable-playground";

export const metadata: Metadata = {
  title: "Play | Marko Gelo",
  description: "Infinite playground of experiments, project fragments, and visual references.",
};

export default function PlayPage() {
  return (
    <main className="portfolio-page playground-page">
      <SiteNav currentLabel="Play" />
      <DraggablePlayground />
      <SiteFooter />
    </main>
  );
}
