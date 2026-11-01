export interface Achievement {
  id: string;
  year: string;
  title: string;
  issuer: string;
  description: string;
  category: "Award" | "Certification" | "Open Source" | "Milestone";
  badgeIcon: "Trophy" | "Award" | "Medal" | "Star" | "Flag";
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "national-hackathon-winner",
    year: "2023",
    title: "1st Place Winner — National Open Data Hackathon",
    issuer: "Ministry of Science & Technology",
    description: "Built an open-source real-time disaster relief routing app utilizing offline Bluetooth mesh and Mapbox telemetry.",
    category: "Award",
    badgeIcon: "Trophy",
  },
  {
    id: "aws-solutions-architect",
    year: "2023",
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    description: "Validated expertise in designing resilient, high-performing, cost-optimized distributed architectures on AWS.",
    category: "Certification",
    badgeIcon: "Award",
  },
  {
    id: "oss-contributor",
    year: "2024",
    title: "Core Contributor to Three.js Ecosystem & Drei",
    issuer: "GitHub Open Source",
    description: "Merged upstream PRs optimizing shader instancing and fixing bounding box calculation edge cases in mobile viewports.",
    category: "Open Source",
    badgeIcon: "Star",
  },
  {
    id: "tech-speaker",
    year: "2024",
    title: "Keynote Speaker: 'The Living Web: R3F & Multiplayer'",
    issuer: "DevFest Kathmandu",
    description: "Delivered a live-coding keynote on building real-time interactive 3D web games to an audience of 300+ developers.",
    category: "Milestone",
    badgeIcon: "Flag",
  },
  {
    id: "startup-lead",
    year: "2022",
    title: "Engineering Lead for Seed-Stage FinTech MVP",
    issuer: "Pinnacle Labs",
    description: "Architected end-to-end payment reconciliation pipeline processing $500k+ in test transaction volume.",
    category: "Milestone",
    badgeIcon: "Medal",
  },
];

