import type { Metadata } from "next";

import { PageHero, SiteFooter, SiteNav } from "../components";
import { PhotoGallery } from "./photo-gallery";
import { getPhotos } from "./photo-data";

export const metadata: Metadata = {
  title: "Photos | Marko Gelo",
  description: "A personal gallery of photos and observations by Marko Gelo.",
};

export default function PhotosPage() {
  const photos = getPhotos();

  return (
    <main className="portfolio-page">
      <SiteNav currentLabel="Photos" />

      <section className="site-band page-hero-band">
        <PageHero
          eyebrow={<p className="page-hero-label">Photos</p>}
          title="Photography became another way to observe details."
        />
      </section>

      <section className="site-band photos-page">
        <PhotoGallery photos={photos} />
      </section>

      <SiteFooter />
    </main>
  );
}
