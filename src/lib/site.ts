export const siteConfig = {
  name: "One Active User",
  tagline: "A home for personal software",
  description:
    "Tools, stories, and ideas from people reducing friction in their own lives, one active user at a time.",
  nav: [
    { href: "/about", label: "Manifesto" },
    { href: "/stories", label: "Stories" },
    { href: "/builds", label: "Builds" },
    { href: "/submit", label: "Submit" },
  ],
  whatCounts: [
    "Software made in response to lived friction",
    "Tools that earn their keep through repeated usefulness",
    "Projects that fit one person precisely before they fit anyone else",
  ],
} as const;
