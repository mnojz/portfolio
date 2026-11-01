export interface SkillGroup {
  category: string;
  description: string;
  iconName: string;
  skills: {
    name: string;
    level: "Mastery" | "Proficient" | "Exploring";
    experienceYears: string;
    highlight?: string;
  }[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: "Languages",
    description: "The core vernaculars I think, architect, and problem-solve in",
    iconName: "Code2",
    skills: [
      { name: "TypeScript / JavaScript", level: "Mastery", experienceYears: "4 yrs", highlight: "Strict typing, AST tooling, modern ESNext" },
      { name: "Python", level: "Proficient", experienceYears: "3 yrs", highlight: "FastAPI, AI agent tooling, PyTorch scripting" },
      { name: "Rust", level: "Proficient", experienceYears: "2 yrs", highlight: "Systems programming, concurrency, TokIo" },
      { name: "SQL", level: "Mastery", experienceYears: "4 yrs", highlight: "Complex joins, indexing, query execution planning" },
      { name: "GLSL / WGSL", level: "Proficient", experienceYears: "2 yrs", highlight: "Custom vertex/fragment shaders, compute passes" },
    ],
  },
  {
    category: "Frontend & 3D Web",
    description: "Crafting fluid, high-frame-rate user interfaces and 3D worlds",
    iconName: "Layers",
    skills: [
      { name: "React / Next.js (App Router)", level: "Mastery", experienceYears: "4 yrs", highlight: "Server components, streaming SSR, performance" },
      { name: "Three.js / React Three Fiber", level: "Proficient", experienceYears: "3 yrs", highlight: "Custom geometries, lighting, Drei, Rapier" },
      { name: "Tailwind CSS & Styling", level: "Mastery", experienceYears: "4 yrs", highlight: "Design systems, responsive UX, micro-interactions" },
      { name: "Zustand / Redux Toolkit", level: "Mastery", experienceYears: "3 yrs", highlight: "Atomic state machines, selective re-renders" },
      { name: "Web Audio API", level: "Proficient", experienceYears: "2 yrs", highlight: "Procedural sound synth, spatial audio, FX nodes" },
    ],
  },
  {
    category: "Backend & Systems",
    description: "Scalable APIs, distributed communication, and real-time multiplayer",
    iconName: "Server",
    skills: [
      { name: "Node.js & Express", level: "Mastery", experienceYears: "4 yrs", highlight: "Event-driven runtime, streams, worker threads" },
      { name: "Colyseus & WebSockets", level: "Mastery", experienceYears: "2 yrs", highlight: "State delta sync, room matchmaking, proximity logic" },
      { name: "REST & GraphQL APIs", level: "Mastery", experienceYears: "4 yrs", highlight: "Clean contract design, rate-limiting, auth" },
      { name: "gRPC & Protocol Buffers", level: "Proficient", experienceYears: "2 yrs", highlight: "Compact binary transport, streaming RPCs" },
      { name: "Authentication (JWT / OAuth)", level: "Mastery", experienceYears: "4 yrs", highlight: "Stateless tokens, role-based access control" },
    ],
  },
  {
    category: "Databases & Storage",
    description: "Reliable persistence, caching layers, and search indexes",
    iconName: "Database",
    skills: [
      { name: "PostgreSQL", level: "Mastery", experienceYears: "4 yrs", highlight: "Relational modeling, migrations, foreign keys" },
      { name: "Prisma & Drizzle ORM", level: "Mastery", experienceYears: "3 yrs", highlight: "Type-safe schema modeling, query generation" },
      { name: "Redis", level: "Proficient", experienceYears: "3 yrs", highlight: "Pub/Sub, TTL caching, atomic counters, sessions" },
      { name: "SQLite", level: "Mastery", experienceYears: "4 yrs", highlight: "Embedded, zero-config local testing, WAL mode" },
      { name: "MongoDB", level: "Proficient", experienceYears: "2 yrs", highlight: "Document storage, aggregation pipelines" },
    ],
  },
  {
    category: "DevOps & Tooling",
    description: "CI/CD pipelines, containerization, and deployment infrastructure",
    iconName: "Wrench",
    skills: [
      { name: "Docker & Containerization", level: "Proficient", experienceYears: "3 yrs", highlight: "Multi-stage builds, compose networks" },
      { name: "Git & GitHub Actions", level: "Mastery", experienceYears: "4 yrs", highlight: "Automated test workflows, semantic versioning" },
      { name: "Linux / Bash Scripting", level: "Mastery", experienceYears: "4 yrs", highlight: "Server administration, custom dotfiles, CLI tools" },
      { name: "Vercel / Railway / Fly.io", level: "Mastery", experienceYears: "3 yrs", highlight: "Serverless edge, persistent WebSockets deployment" },
    ],
  },
  {
    category: "Currently Exploring",
    description: "Technologies on my workbench that spark new curiosities",
    iconName: "Sparkles",
    skills: [
      { name: "WebGPU Compute Shaders", level: "Exploring", experienceYears: "Recent", highlight: "Parallel GPU calculations in browser" },
      { name: "Local LLM Fine-Tuning (LoRA)", level: "Exploring", experienceYears: "Recent", highlight: "Domain-specific small models" },
      { name: "Rust Bevy Game Engine", level: "Exploring", experienceYears: "Recent", highlight: "Entity Component System (ECS) architecture" },
    ],
  },
];

