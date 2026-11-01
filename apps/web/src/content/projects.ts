export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: "Full-Stack" | "3D & Graphics" | "Systems & Real-Time" | "AI & Tools";
  status: "completed" | "ongoing" | "experimental";
  technologies: string[];
  metrics?: string;
  github?: string;
  demo?: string;
  featured: boolean;
  worldModel: "computer" | "workbench" | "gear_machine" | "hologram" | "server_rack";
}

export const PROJECTS: Project[] = [
  {
    id: "mosswood-multiplayer",
    title: "Mosswood — Living 3D Multiplayer Portfolio",
    tagline: "Synchronized 3D countryside exploration game powered by WebSockets",
    description:
      "A complete reimagining of the personal portfolio as a living, multiplayer countryside world. Features real-time authoritative character synchronization, proximity-based mutual consent chat, day/night atmospheric transitions, and procedural Web Audio orchestration.",
    category: "3D & Graphics",
    status: "ongoing",
    technologies: ["React Three Fiber", "Next.js", "Colyseus", "Three.js", "Zustand", "TypeScript", "Prisma"],
    metrics: "60 FPS WebGL, <5s initial load, synchronized 30-player rooms",
    github: "https://github.com/manoj/mosswood",
    demo: "#",
    featured: true,
    worldModel: "computer",
  },
  {
    id: "college-erp",
    title: "OmniCampus — Enterprise University ERP",
    tagline: "Scalable role-based academic management & real-time attendance engine",
    description:
      "A high-concurrency educational resource planning system handling multi-tenant college departments, semester grade grading pipelines, fee disbursement ledgers, automated schedule timetable generators, and QR attendance tracking.",
    category: "Full-Stack",
    status: "completed",
    technologies: ["Next.js", "PostgreSQL", "Prisma", "Redis", "Tailwind CSS", "Docker"],
    metrics: "Serving 12,000+ active students with sub-80ms p95 query latency",
    github: "https://github.com/manoj/omnicampus",
    demo: "https://omnicampus-demo.example.com",
    featured: true,
    worldModel: "server_rack",
  },
  {
    id: "hyper-sync-db",
    title: "AuraKV — In-Memory Distributed Key-Value Store",
    tagline: "Lightweight append-only distributed memory cache with Raft consensus",
    description:
      "Engineered an educational distributed key-value cache engine featuring Raft consensus leadership election, log compaction, snapshot replication, and binary protocol socket clients.",
    category: "Systems & Real-Time",
    status: "completed",
    technologies: ["Rust", "Tokio", "gRPC", "Protobuf", "Docker"],
    metrics: "Over 85,000 writes/sec with automated failover in <1.2 seconds",
    github: "https://github.com/manoj/aurakv",
    featured: true,
    worldModel: "gear_machine",
  },
  {
    id: "synth-forge-ai",
    title: "SynthForge — Local LLM Workflow Orchestrator",
    tagline: "Agentic tool-augmented reasoning canvas with streaming DAG execution",
    description:
      "Visual node-based canvas for chaining local and cloud language models into self-correcting agent swarms. Supports streaming Markdown execution, function calling, code sandboxing, and prompt versioning.",
    category: "AI & Tools",
    status: "experimental",
    technologies: ["TypeScript", "Python", "FastAPI", "React Flow", "Ollama", "LangChain"],
    metrics: "Zero-latency local graph evaluation with multi-model fallbacks",
    github: "https://github.com/manoj/synthforge",
    demo: "https://synthforge.example.com",
    featured: true,
    worldModel: "hologram",
  },
  {
    id: "pixel-craft-engine",
    title: "VoxelBloom — WebGPU Procedural Voxel Engine",
    tagline: "Greedy-meshed infinite voxel landscape generator running in the browser",
    description:
      "A WebGPU and WebAssembly powered voxel playground demonstrating compute shader simplex noise terrain synthesis, octree Level of Detail (LOD), dynamic lighting, and greedy face merging algorithms.",
    category: "3D & Graphics",
    status: "experimental",
    technologies: ["WebGPU", "WGSL", "Wasm", "TypeScript", "Three.js"],
    metrics: "Smooth 60 FPS rendering of 2,000,000+ voxel volumes in Chrome",
    github: "https://github.com/manoj/voxelbloom",
    demo: "https://voxelbloom.example.com",
    featured: false,
    worldModel: "workbench",
  },
  {
    id: "stream-pulse",
    title: "StreamPulse — Collaborative Whiteboard & Voice Mesh",
    tagline: "CRDT-backed infinite canvas with WebRTC audio channels",
    description:
      "Peer-to-peer real-time collaborative sketchpad supporting pen smoothing, vector shapes, image pins, and spatial audio conferencing using Yjs CRDTs and WebRTC data channels.",
    category: "Systems & Real-Time",
    status: "completed",
    technologies: ["React", "Yjs", "WebRTC", "Canvas API", "Socket.io"],
    metrics: "Zero merge conflicts across 100+ concurrent vector edits",
    github: "https://github.com/manoj/streampulse",
    demo: "https://streampulse.example.com",
    featured: false,
    worldModel: "computer",
  },
];

