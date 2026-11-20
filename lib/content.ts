// All site copy lives here — edit this file to update the portfolio.

export const profile = {
  name: "Sudheer",
  fullName: "Sudheer Reddy Kancharla",
  role: "UI/UX & Product Designer",
  headline: ["Hi, I'm Sudheer.", "I design experiences", "that convert."],
  email: "sudheerr643@hotmail.com",
  phone: "+91 90635 10510",
  phoneHref: "tel:+919063510510",
  resume: "/assets/resume.pdf",
  linkedin: "https://www.linkedin.com/in/sudheerr643/",
  instagram: "https://www.instagram.com/am__sudheer/",
  currently: "Moksh Corp",
  previously: "Ex-Skygoal",
  // Used by the experience ruler — years are computed live from this date.
  careerStart: "2023-02-01",
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST • GMT+5:30",
  bio: "I enjoy the craft of building things that feel right. I design intuitive digital products across web and mobile, from payments and fintech to CRM platforms and design systems, and I've shipped live products across fintech, sports, crypto and CRM, always putting the user first.",
  stats: [
    { value: "3+", label: "Years designing" },
    { value: "6+", label: "Products shipped" },
    { value: "100K+", label: "Users reached" },
  ],
};

export type Role = {
  company: string;
  title: string;
  start: string; // YYYY-MM
  end?: string; // YYYY-MM, undefined = present
  summary: string;
  points: string[];
  tags: string[];
};

export const experience: Role[] = [
  {
    company: "Moksh Corp",
    title: "UX/UI Designer",
    start: "2024-11",
    summary:
      "Designing for B2B and B2C brands, crafting websites, user interfaces, and social media creatives with a sharp focus on conversion optimization and user retention.",
    points: [
      "Designed multiple brand websites for B2B and B2C clients from brief to final handoff.",
      "Delivered visually compelling, intuitive UIs while maintaining a strong focus on conversion and retention metrics.",
      "Partnered with the Digital Marketing team on social media creatives for in-house and client campaigns.",
    ],
    tags: ["B2B", "B2C", "Web Design", "Marketing", "Figma"],
  },
  {
    company: "Aptagrim Limited",
    title: "UX/UI Designer",
    start: "2024-09",
    end: "2024-11",
    summary:
      "Designed the full UI/UX for a CRM-style support ticketing web app, from information architecture through to a clean, scalable design handoff.",
    points: [
      "Designed UI/UX for a CRM-style support ticketing app with SLA tracking and agent collaboration workflows.",
      "Prioritised seamless UI patterns that reduced cognitive load for support agents under time pressure.",
      "Delivered a clean, scalable design handoff that improved clarity between design and engineering teams.",
    ],
    tags: ["CRM", "SaaS", "B2B", "Design Handoff"],
  },
  {
    company: "Skygoal Innova Technologies",
    title: "UI/UX Designer",
    start: "2023-02",
    end: "2024-06",
    summary:
      "My most formative role: shipped 3 live products across fintech, sports, and crypto, reaching 100K+ users and delivering measurable outcomes across all of them.",
    points: [
      "Designed a live web and mobile payments, recharges & rent app, achieving an 18% bounce rate reduction and scaling to 100K+ users.",
      "Spearheaded design of a sports slot booking app, improving booking efficiency by 25%.",
      "Built a crypto-based online raffle app with a seamless transaction UI that simplified complex flows for non-crypto-native users.",
      "Developed design systems to maintain UI consistency across all projects and partnered with developers for scalable, responsive implementation.",
    ],
    tags: ["Fintech", "Mobile", "Android/iOS", "Design Systems", "Crypto", "Sports"],
  },
];

export const tools = ["Figma", "Adobe XD", "Blender", "ProtoPie", "Framer", "Webflow", "HTML/CSS"];
export const skills = [
  "UI Mockups",
  "Wireframing",
  "Prototyping",
  "Design Systems",
  "Responsive Web",
  "Design Reviews",
  "Sitemaps",
  "User Research",
];

export const interests = [
  { label: "Photography", img: "/assets/interests/photography.jpeg" },
  { label: "Games", img: "/assets/interests/games.jpg" },
  { label: "Music", img: "/assets/interests/music.jpg" },
  { label: "Travel", img: "/assets/interests/travel.jpeg" },
  { label: "Cricket", img: "/assets/interests/cricket.jpg" },
  { label: "Anime", img: "/assets/interests/anime.jpg" },
];

export function formatRange(start: string, end?: string) {
  const fmt = (s: string) => {
    const [y, m] = s.split("-").map(Number);
    return new Date(y, m - 1).toLocaleString("en-US", { month: "short", year: "numeric" }).toUpperCase();
  };
  return `${fmt(start)} – ${end ? fmt(end) : "PRESENT"}`;
}

export function formatDuration(start: string, end?: string, now = new Date()) {
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = end ? end.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1];
  const months = Math.max(1, (ey - sy) * 12 + (em - sm));
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} YR${y > 1 ? "S" : ""}`, m && `${m} MO${m > 1 ? "S" : ""}`].filter(Boolean).join(" ");
}
