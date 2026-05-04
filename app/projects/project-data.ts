type ProjectMeta = {
  label: string;
  value: string;
  href?: string;
};

type ProjectPanel = {
  label: string;
  base: string;
  accent: string;
  glow: string;
};

export type Project = {
  slug: string;
  name: string;
  isAvailable?: boolean;
  kicker: string;
  cardStatus?: string;
  cardSummary: string;
  cardColor: string;
  cardAccent: string;
  cardGlow: string;
  detailIntro: string;
  detailDescription: string;
  detailGoal?: string;
  detailColor: string;
  detailAccent: string;
  detailGlow: string;
  meta: readonly ProjectMeta[];
  gallery: readonly ProjectPanel[];
};

export const projects: readonly Project[] = [
  {
    slug: "sofascore",
    name: "Sofascore",
    isAvailable: false,
    kicker: "Mobile & Web app",
    cardStatus: "Coming soon!",
    cardSummary: "Working on the most advanced competition editor in the world.",
    cardColor: "#ff407f",
    cardAccent: "#ff5f9b",
    cardGlow: "rgba(255, 158, 197, 0.65)",
    detailIntro:
      "Designing the next generation of tools that help live sports competitions stay fast, readable, and reliable.",
    detailDescription:
      "A broad product design effort focused on editorial speed, clearer hierarchy, and confident data-heavy layouts for sports coverage across devices.",
    detailGoal:
      "Create tools that help editorial teams work faster under pressure, reduce interface friction during live coverage, and keep complex competition data easy to scan.",
    detailColor: "#d96d89",
    detailAccent: "#f08ca3",
    detailGlow: "rgba(255, 214, 226, 0.55)",
    meta: [
      {
        label: "Services",
        value: "Product Design / Interaction Design / Interface Systems",
      },
      {
        label: "Project type",
        value: "In-house platform work focused on complex operational tooling",
      },
      {
        label: "Website",
        value: "www.sofascore.com",
        href: "https://www.sofascore.com",
      },
    ],
    gallery: [
      {
        label: "Competition editor overview",
        base: "#c65c7d",
        accent: "#df7d9a",
        glow: "rgba(255, 219, 230, 0.48)",
      },
      {
        label: "Publishing states",
        base: "#b25474",
        accent: "#d6728f",
        glow: "rgba(255, 205, 220, 0.44)",
      },
      {
        label: "System hierarchy",
        base: "#cb6383",
        accent: "#e48ca7",
        glow: "rgba(255, 227, 235, 0.5)",
      },
      {
        label: "Cross-platform audit",
        base: "#ba5678",
        accent: "#d97693",
        glow: "rgba(255, 214, 226, 0.46)",
      },
      {
        label: "Final interface review",
        base: "#d36d8a",
        accent: "#ef91ad",
        glow: "rgba(255, 230, 238, 0.52)",
      },
    ],
  },
  {
    slug: "dobar-tek",
    name: "Dobar tek",
    kicker: "Mobile app",
    cardSummary:
      "Crafting a mobile app for new generation of workplace lunch in Croatia",
    cardColor: "#cb190c",
    cardAccent: "#e22f1f",
    cardGlow: "rgba(255, 173, 149, 0.62)",
    detailIntro:
      "Crafting a mobile app for new generation of workplace lunch in Croatia",
    detailDescription:
      "This mobile app simplifies food ordering at the office, offering insights into your colleagues' orders and providing monthly billing based on your previous month's spending.",
    detailGoal:
      "Main goal was to create a seamless mobile experience for users already familiar with the web app. The result was a user-friendly mobile app featuring playful illustrations.",
    detailColor: "#96564d",
    detailAccent: "#af6a61",
    detailGlow: "rgba(237, 214, 209, 0.48)",
    meta: [
      {
        label: "Services",
        value: "User Interface Design / User Experience Design / Design systems",
      },
      {
        label: "Project type",
        value: "Sole designer, delivered as a part of team @ Blank",
      },
      {
        label: "Website",
        value: "www.dobartek.hr",
        href: "https://www.dobartek.hr",
      },
    ],
    gallery: [
      {
        label: "Ordering flow overview",
        base: "#925449",
        accent: "#ab695d",
        glow: "rgba(234, 214, 210, 0.46)",
      },
      {
        label: "Lunch preferences",
        base: "#8a4d43",
        accent: "#a76459",
        glow: "rgba(230, 205, 199, 0.42)",
      },
      {
        label: "Billing and spending",
        base: "#9d5d52",
        accent: "#b87468",
        glow: "rgba(241, 223, 218, 0.5)",
      },
      {
        label: "Office dashboard",
        base: "#8f5147",
        accent: "#a76459",
        glow: "rgba(233, 210, 204, 0.45)",
      },
      {
        label: "Final mobile states",
        base: "#97584d",
        accent: "#b16d62",
        glow: "rgba(238, 218, 212, 0.48)",
      },
    ],
  },
  {
    slug: "nutrivision",
    name: "Nutrivision",
    kicker: "Dashboard",
    cardSummary:
      "Enabling nutritionists and clients with an intuitive meal calendar dashboard.",
    cardColor: "#0c6887",
    cardAccent: "#2280a2",
    cardGlow: "rgba(140, 225, 255, 0.58)",
    detailIntro:
      "Designing a focused health dashboard that helps people read trends instead of getting lost in charts.",
    detailDescription:
      "Nutrivision is a tool that simplifies meal plan tracking and management for users. It helps nutritionists keep all their clients organized in one place, while clients can access their plans and communications easily.",
    detailGoal:
      "The challenge was to design an intuitive interface that effectively manages a full week's worth of meals, organized by their calorie content, for both, nutritionists and their clients. Users can effortlessly view their daily nutrient needs at a glance, making meal planning straightforward and efficient. This innovative tool not only simplifies meal management but also empowers users to make informed dietary choices with ease.",
    detailColor: "#277996",
    detailAccent: "#4497b4",
    detailGlow: "rgba(199, 240, 255, 0.5)",
    meta: [
      {
        label: "Services",
        value: "Art Direction / Product Design / Design System",
      },
      {
        label: "Project type",
        value: "Sole designer & Project has been done as a part of team @ Blank",
      },
      {
        label: "Website",
        value: "Health upp",
        href: "https://health-upp.com",
      },
    ],
    gallery: [
      {
        label: "Dashboard overview",
        base: "#236f8d",
        accent: "#3f89a6",
        glow: "rgba(205, 241, 255, 0.42)",
      },
      {
        label: "Health metrics",
        base: "#1e6682",
        accent: "#36809d",
        glow: "rgba(189, 233, 249, 0.4)",
      },
      {
        label: "Progress visualizations",
        base: "#2b7693",
        accent: "#4792af",
        glow: "rgba(212, 243, 255, 0.46)",
      },
      {
        label: "Daily summaries",
        base: "#266c88",
        accent: "#4285a1",
        glow: "rgba(195, 236, 251, 0.44)",
      },
      {
        label: "Responsive states",
        base: "#2f7a96",
        accent: "#4d99b5",
        glow: "rgba(214, 244, 255, 0.48)",
      },
    ],
  },
  {
    slug: "rocket",
    name: "Rocket",
    kicker: "Dashboard",
    cardSummary:
      "Redesigning the user interface for fast and secure WordPress hosting.",
    cardColor: "#3aabcc",
    cardAccent: "#5fc2df",
    cardGlow: "rgba(189, 244, 255, 0.68)",
    detailIntro:
      "Refreshing a hosting dashboard to feel faster, lighter, and more trustworthy for technical and non-technical users alike.",
    detailDescription:
      "Easily manage all your WordPress websites in intuitive, user-friendly interface designed to maximize your productivity, minimize friction and help you succeed.",
    detailGoal:
      "I was tasked to revamp the user interface, develop a cohesive design system, and ultimately create a prototype. I thoroughly enjoyed working on such a fantastic product with a wonderful client.",
    detailColor: "#5faec4",
    detailAccent: "#7bc7db",
    detailGlow: "rgba(220, 248, 255, 0.54)",
    meta: [
      {
        label: "Services",
        value: "Market Research / Art Direction / Product Design / Design System",
      },
      {
        label: "Project type",
        value: "Freelance project",
      },
      {
        label: "Website",
        value: "Rocket",
        href: "https://rocket.net/",
      },
    ],
    gallery: [
      {
        label: "Hosting overview",
        base: "#58abc1",
        accent: "#79c5d8",
        glow: "rgba(222, 248, 255, 0.46)",
      },
      {
        label: "Server controls",
        base: "#4ca4bb",
        accent: "#6fbed2",
        glow: "rgba(205, 242, 252, 0.42)",
      },
      {
        label: "Security states",
        base: "#60b2c9",
        accent: "#83ccdf",
        glow: "rgba(224, 248, 255, 0.5)",
      },
      {
        label: "Billing workflows",
        base: "#54a9c0",
        accent: "#75c0d4",
        glow: "rgba(212, 244, 252, 0.44)",
      },
      {
        label: "Dashboard polish",
        base: "#65b6cd",
        accent: "#88d0e2",
        glow: "rgba(226, 249, 255, 0.52)",
      },
    ],
  },
  {
    slug: "hyperlight",
    name: "Hyperlight",
    kicker: "Website / Ecommerce",
    cardSummary:
      "Premium eyewear brand's website that showcases advanced technology",
    cardColor: "#000000",
    cardAccent: "#191919",
    cardGlow: "rgba(255, 255, 255, 0.2)",
    detailIntro:
      "Building a premium commerce direction that balances technical storytelling with a restrained, luxury pace.",
    detailDescription:
      "Hyperlight Optics utilizes innovative lens technology that enhances visual clarity, reduces eye strain, and provides superior protection against digital screen exposure. Their lenses are engineered to improve overall eye health while offering a comfortable and clear viewing experience.",
    detailGoal:
      "When I got the request to design a striking website for Hyperlight Optics, an eyewear brand under the well-known Zepter company, I felt excited about the journey ahead. The client wanted a website that was modern, innovative, and futuristic, with a playful layout that would catch users' attention. The goal was clear: the design needed to showcase the advanced technology behind their glasses. After some research and creative brainstorming, we found a solution that truly matched the spirit of the new brand, leading to an engaging experience for users that represents the excellence of Hyperlight Optics.",
    detailColor: "#1f1f1f",
    detailAccent: "#353535",
    detailGlow: "rgba(255, 255, 255, 0.18)",
    meta: [
      {
        label: "Services",
        value: "Art Direction / User Interface Design / User Experiance Design / Design System",
      },
      {
        label: "Project type",
        value: "Freelance project, collaboration with partner Igor Carli",
      },
      {
        label: "Website",
        value: "Hyperlight",
        href: "https://hyperlightoptics.com/",
      },
    ],
    gallery: [
      {
        label: "Editorial landing view",
        base: "#171717",
        accent: "#292929",
        glow: "rgba(255, 255, 255, 0.12)",
      },
      {
        label: "Technology storytelling",
        base: "#131313",
        accent: "#242424",
        glow: "rgba(255, 255, 255, 0.1)",
      },
      {
        label: "Product spotlight",
        base: "#1c1c1c",
        accent: "#2f2f2f",
        glow: "rgba(255, 255, 255, 0.13)",
      },
      {
        label: "Shop states",
        base: "#141414",
        accent: "#252525",
        glow: "rgba(255, 255, 255, 0.11)",
      },
      {
        label: "Checkout rhythm",
        base: "#202020",
        accent: "#353535",
        glow: "rgba(255, 255, 255, 0.14)",
      },
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string) {
  const currentIndex = projects.findIndex((project) => project.slug === slug);

  if (currentIndex === -1) {
    return null;
  }

  for (let offset = 1; offset < projects.length; offset += 1) {
    const candidate = projects[(currentIndex + offset) % projects.length];

    if (candidate?.isAvailable !== false) {
      return candidate;
    }
  }

  return null;
}
