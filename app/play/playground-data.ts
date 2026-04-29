export type PlaygroundCard = {
  image: string;
  title: string;
  caption: string;
  size: "small" | "medium" | "large";
};

export const playgroundCards: readonly PlaygroundCard[] = [
  {
    image: "/projects/hyperlight/Hyperlight 01.jpg",
    title: "Hyperlight",
    caption: "Glows, gradients, and interface atmosphere in one bright fragment.",
    size: "large",
  },
  {
    image: "/projects/dobar-tek/dobartek 01.jpg",
    title: "Dobar tek",
    caption: "A warmer take on workplace lunch rituals and quick daily choices.",
    size: "medium",
  },
  {
    image: "/projects/nutrivision/Nutri 01 20.03.37.jpg",
    title: "Nutrivision",
    caption: "Meal planning turned into a calmer dashboard with clearer rhythm.",
    size: "large",
  },
  {
    image: "/projects/rocket/01-Rocket-header.jpg",
    title: "Rocket",
    caption: "Sharper hosting tools with less friction and more confidence.",
    size: "medium",
  },
  {
    image: "/projects/hyperlight/Hyperlight 07.jpg",
    title: "Surface test",
    caption: "Trying density, blur, color, and softness in a single frame.",
    size: "medium",
  },
  {
    image: "/projects/dobar-tek/dobartek 06.jpg",
    title: "Menu rhythm",
    caption: "Little studies in appetite, hierarchy, and friendly motion.",
    size: "small",
  },
  {
    image: "/photos/Flower.jpg",
    title: "Color study",
    caption: "A tiny palette reminder borrowed from outside the screen.",
    size: "small",
  },
  {
    image: "/photos/27-DSC04647.jpg",
    title: "Evening archive",
    caption: "A softer horizon for the slower and more patient ideas.",
    size: "medium",
  },
  {
    image: "/photos/31-DSC04478.jpg",
    title: "Mono notes",
    caption: "Black-and-white frames that reset the eye before the next sketch.",
    size: "small",
  },
  {
    image: "/photos/33-DSC03004.jpg",
    title: "Island memory",
    caption: "Textures and tones that keep sneaking back into interface work.",
    size: "large",
  },
];
