export interface DeveloperProfile {
  name: string;
  preferredName: string;
  tagline: string;
  bio: string;
  story: string[];
  location: string;
  status: string;
  email: string;
  github: string;
  linkedin: string;
  twitter?: string;
  resumeUrl: string;
  stats: {
    yearsOfExperience: string;
    projectsBuilt: string;
    commitsCount: string;
    cupsOfChai: string;
  };
  quote: string;
  philosophy: string;
}

export const PROFILE: DeveloperProfile = {
  name: "Manoj",
  preferredName: "Manoj",
  tagline: "Full-Stack Engineer & Interactive 3D Web Architect",
  bio: "I craft living digital worlds, robust backend microservices, and human-centric software. Welcome to Mosswood — my interactive portfolio game where code meets craft.",
  story: [
    "I'm a software engineer passionate about blurring the boundary between utilitarian software and joyful digital playgrounds.",
    "Whether designing high-throughput real-time systems, architecting distributed databases, or crafting low-poly interactive experiences, I focus on clean code, performance, and memorable user experiences.",
    "Mosswood was born from a desire to turn a static résumé into a living countryside hamlet where developers, recruiters, and friends can meet, explore, and share conversations in real-time."
  ],
  location: "Kathmandu / Remote Worldwide",
  status: "Open to exciting full-time engineering roles, high-impact contracts & collaborations",
  email: "manoj@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  resumeUrl: "#resume",
  stats: {
    yearsOfExperience: "4+",
    projectsBuilt: "25+",
    commitsCount: "1,800+",
    cupsOfChai: "900+",
  },
  quote: "Welcome to my little world. A place where I build things, break things, learn things, and occasionally touch grass.",
  philosophy: "Software shouldn't just be functional — it should evoke curiosity, warmth, and craft."
};

