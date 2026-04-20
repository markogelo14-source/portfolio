import type { Metadata } from "next";

import { SiteFooter, SiteNav } from "../components";
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

      <section className="site-band photos-page">
        <div className="photos-intro column">
          <h1 className="identity-name">Photos</h1>
          <p className="photos-copy">Little bit of this, little bit of that...</p>
        </div>

        <PhotoGallery photos={photos} />
      </section>

      <SiteFooter />
    </main>
  );
}
