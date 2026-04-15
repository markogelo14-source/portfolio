export const siteData = {
  name: "Marko Gelo",
  role: "Front-end Developer",
  status: "Building product experiences with a sharp visual point of view.",
  location: "Croatia",
  email: "hello@yourdomain.com",
  description:
    "A Next.js portfolio starter for showcasing selected work, your process, and a confident personal brand.",
  intro:
    "I build interfaces that feel clear, premium, and alive. This starter gives you a strong foundation to turn into a personal site, case study hub, or launchpad for freelance work.",
  focus:
    "Available for ambitious freelance builds, early-stage product collaboration, and design-minded front-end work.",
} as const;

export const stats = [
  { value: "3", label: "ready-made case study slots" },
  { value: "1", label: "focused homepage to customize" },
  { value: "100%", label: "TypeScript app-router foundation" },
] as const;

export const featuredProjects = [
  {
    name: "Invitation Platform",
    summary:
      "A polished event product with invitation flows, guest management, and checkout-ready architecture.",
    impact: "Next.js, Prisma, Stripe, MVP delivery",
    href: "#work",
    tags: ["Product build", "Checkout flow", "Admin UX"],
  },
  {
    name: "Creative Landing System",
    summary:
      "A reusable landing page approach that pairs strong typography, modular sections, and a flexible storytelling rhythm.",
    impact: "Design system thinking, conversion-oriented sections",
    href: "#process",
    tags: ["Brand expression", "Responsive UI", "Content flow"],
  },
  {
    name: "Portfolio Engine",
    summary:
      "This new portfolio starter itself: structured to make iteration easy, whether you evolve it by hand or with Paper MCP.",
    impact: "Fast edits, clean styling, design-friendly structure",
    href: "#contact",
    tags: ["Next.js", "Paper-ready", "Starter setup"],
  },
] as const;

export const principles = [
  {
    title: "Visual confidence",
    body: "Interfaces should feel authored, not assembled from defaults.",
  },
  {
    title: "Fast iteration",
    body: "A strong structure matters because good ideas show up during revision, not before it.",
  },
  {
    title: "Clean implementation",
    body: "Readable code makes it easier to keep refining the experience instead of fighting it.",
  },
] as const;

export const timeline = [
  {
    period: "Now",
    title: "Portfolio rebuild",
    body: "Creating a new home base for projects, experiments, and future case studies.",
  },
  {
    period: "Recent",
    title: "Product MVP work",
    body: "Shipping practical web experiences with authentication, dashboards, forms, and payment flows.",
  },
  {
    period: "Always",
    title: "Design-minded development",
    body: "Using layout, type, motion, and product thinking together instead of treating them as separate layers.",
  },
] as const;

export const contactLinks = [
  { label: "Email", href: "mailto:hello@yourdomain.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle" },
  { label: "GitHub", href: "https://github.com/your-handle" },
] as const;
