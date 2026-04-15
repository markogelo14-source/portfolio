import type { Metadata } from "next";

import { PlaceholderPage } from "../placeholder-page";

export const metadata: Metadata = {
  title: "Photos | Marko Gelo",
  description: "Placeholder page for Marko Gelo's photography work.",
};

export default function PhotosPage() {
  return (
    <PlaceholderPage
      accent="#6e7a67"
      eyebrow="Still frames / Observations / Atmosphere"
      intro="A photo archive is coming soon for moments, textures, and scenes that sit a little outside the product-design work."
      note="This is a temporary holding page until the gallery design and image curation are ready to be published."
      panels={[
        {
          title: "Selections",
          description: "A curated set of favorite frames, grouped in a way that feels more like an edit than a dump.",
        },
        {
          title: "Series",
          description: "Small collections built around mood, place, or repeated visual details worth revisiting.",
        },
        {
          title: "Context",
          description: "Short notes about when the photos were taken, what drew the eye, and why the image stayed.",
        },
      ]}
      softAccent="#eaeee6"
      tags={["Gallery", "Series", "Field notes"]}
      title="Photos"
    />
  );
}
