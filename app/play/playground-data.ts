export type PlaygroundCard = {
  image: string;
  mediaHeight: number;
  mediaType?: "image" | "video";
  mediaWidth: number;
  title: string;
  caption: string;
  size: "small" | "medium" | "large";
};

export const playgroundCards: readonly PlaygroundCard[] = [
  {
    image: "/projects/hyperlight/Hyperlight 01.jpg",
    mediaHeight: 1280,
    mediaWidth: 2460,
    title: "Hyperlight",
    caption: "Glows, gradients, and interface atmosphere in one bright fragment.",
    size: "large",
  },
  {
    image: "/projects/dobar-tek/dobartek 01.jpg",
    mediaHeight: 1280,
    mediaWidth: 2460,
    title: "Dobar tek",
    caption: "A warmer take on workplace lunch rituals and quick daily choices.",
    size: "medium",
  },
  {
    image: "/projects/nutrivision/Nutri 01 20.03.37.jpg",
    mediaHeight: 1280,
    mediaWidth: 2460,
    title: "Nutrivision",
    caption: "Meal planning turned into a calmer dashboard with clearer rhythm.",
    size: "large",
  },
  {
    image: "/projects/rocket/01-Rocket-header.jpg",
    mediaHeight: 1280,
    mediaWidth: 2460,
    title: "Rocket",
    caption: "Sharper hosting tools with less friction and more confidence.",
    size: "medium",
  },
  {
    image: "/projects/hyperlight/Hyperlight 07.jpg",
    mediaHeight: 1280,
    mediaWidth: 2460,
    title: "Surface test",
    caption: "Trying density, blur, color, and softness in a single frame.",
    size: "medium",
  },
  {
    image: "/projects/dobar-tek/dobartek 06.jpg",
    mediaHeight: 1280,
    mediaWidth: 2460,
    title: "Menu rhythm",
    caption: "Little studies in appetite, hierarchy, and friendly motion.",
    size: "small",
  },
  {
    image: "/photos/Flower.jpg",
    mediaHeight: 1365,
    mediaWidth: 2048,
    title: "Color study",
    caption: "A tiny palette reminder borrowed from outside the screen.",
    size: "small",
  },
  {
    image: "/photos/27-DSC04647.jpg",
    mediaHeight: 1365,
    mediaWidth: 2048,
    title: "Evening archive",
    caption: "A softer horizon for the slower and more patient ideas.",
    size: "medium",
  },
  {
    image: "/photos/31-DSC04478.jpg",
    mediaHeight: 1365,
    mediaWidth: 2048,
    title: "Mono notes",
    caption: "Black-and-white frames that reset the eye before the next sketch.",
    size: "small",
  },
  {
    image: "/photos/33-DSC03004.jpg",
    mediaHeight: 2048,
    mediaWidth: 1365,
    title: "Island memory",
    caption: "Textures and tones that keep sneaking back into interface work.",
    size: "large",
  },
];
