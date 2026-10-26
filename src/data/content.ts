/**
 * Portfolio copy. Replace null links, the institution, location, and email
 * before publishing. Do not commit a resume until public/resume.pdf exists,
 * then set resumeHref to "/resume.pdf".
 */

export const site = {
  name: "Harsh Thakur",
  role: "Software Developer",
  location: "Edit location",
  availability: "Available",
  year: 2026,
  resumeHref: null as string | null,
};

export const nav = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const about = {
  kicker: "02 — Profile",
  heading: "A little about me",
  note: "built by hand, shipped in the browser",
  lede: "I am a software developer who enjoys building interactive web experiences, solving problems, and experimenting with technology.",
  body: "Most of my time goes into interfaces, the services behind them, and the details that make a product feel responsive. I like motion and 3D when they serve the work.",
};

export const skillGroups = [
  {
    label: "Languages",
    items: ["JavaScript", "TypeScript", "HTML", "CSS", "Java", "Python"],
  },
  {
    label: "Web",
    items: ["React", "Node.js", "Express", "Astro", "REST APIs", "Firebase"],
  },
  {
    label: "Data",
    items: ["MongoDB", "PostgreSQL", "MySQL"],
  },
  {
    label: "Motion",
    items: ["GSAP", "Three.js", "React Three Fiber"],
  },
  {
    label: "Tools",
    items: ["Git", "Postman", "Vercel", "Netlify"],
  },
] as const;

export interface ProjectLink {
  label: string;
  href: string | null;
}

export interface Project {
  index: string;
  title: string;
  description: string;
  tech: string[];
  preview: "qkart" | "autonomize" | "koinx" | "quests";
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    index: "01",
    title: "QKart",
    description:
      "React e-commerce application with authentication, cart, checkout, REST APIs, and a responsive interface.",
    tech: ["React", "REST APIs"],
    preview: "qkart",
    links: [
      { label: "Repository", href: null },
      { label: "Live site", href: null },
    ],
  },
  {
    index: "02",
    title: "Autonomize",
    description:
      "GitHub API application for exploring user profiles, followers, and related information.",
    tech: ["GitHub API"],
    preview: "autonomize",
    links: [
      { label: "Repository", href: null },
      { label: "Live site", href: null },
    ],
  },
  {
    index: "03",
    title: "Koinx",
    description:
      "Node.js and MongoDB application for parsing trade CSV data and calculating balances at specific timestamps.",
    tech: ["Node.js", "MongoDB"],
    preview: "koinx",
    links: [
      { label: "Repository", href: null },
      { label: "Live site", href: null },
    ],
  },
  {
    index: "04",
    title: "Quests and Games",
    description:
      "Quest-oriented web application with authentication and social-platform verification.",
    tech: ["Authentication"],
    preview: "quests",
    links: [
      { label: "Repository", href: null },
      { label: "Live site", href: null },
    ],
  },
];

export const experience = [
  {
    org: "ThroughBit",
    role: "Software Developer 1",
    dates: "May 2025 — Present",
    summary: "Frontend development, interactive animations, and integrations.",
  },
  {
    org: "DevKit",
    role: "Software Engineer Intern",
    dates: "July 2024 — December 2024",
    summary: "Frontend engineering, authentication, and API work.",
  },
];

export const education = {
  degree: "Computer Science and Engineering",
  year: "2023",
  institution: "EDIT_INSTITUTION",
  note: "replace with your school",
};

export const contact = {
  headingLead: "Let's build",
  headingTail: "something.",
  email: null as string | null,
  instagram: null as string | null,
  github: null as string | null,
  linkedin: null as string | null,
};

export const images = {
  hero: {
    src: "/assets/hero-mountain-placeholder.jpg",
    alt: "Snow-dusted mountain valley with evergreen forest in the foreground",
    width: 1800,
    height: 1200,
  },
  about: {
    src: "/assets/about-workspace-placeholder.jpg",
    alt: "Laptop on a desk with code on the screen, beside a monitor and headphones",
    width: 1600,
    height: 1065,
  },
  education: {
    src: "/assets/education-desk-placeholder.jpg",
    alt: "Open laptop showing source code on a white desk",
    width: 1600,
    height: 1067,
  },
  contact: {
    src: "/assets/contact-mountain-placeholder.jpg",
    alt: "Snowy mountain peaks under a dense field of stars",
    width: 1800,
    height: 1201,
  },
};
