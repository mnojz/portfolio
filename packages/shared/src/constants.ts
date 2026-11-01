export const WORLD_CONFIG = {
  PROXIMITY_RADIUS: 3.5, // units for chat & interaction
  INTERACTION_RADIUS: 2.5,
  INVITATION_TIMEOUT_MS: 20000,
  GRACE_PERIOD_MS: 6000,
  MAX_MESSAGE_LENGTH: 300,
  MAX_PLAYERS_PER_ROOM: 30,
  SERVER_TICK_RATE: 20, // 20 ticks/sec
  MAP_SIZE: 120, // 120x120 units
  DEFAULT_SPAWN: { x: 0, y: 0, z: 12 },
} as const;

export const LOCATIONS = {
  HOME: {
    id: "home",
    name: "The Home — About Manoj",
    coordinates: { x: -18, y: 0, z: -10 },
    radius: 7,
    description: "Personal cottage, background, education, and passions",
  },
  WORKSHOP: {
    id: "workshop",
    name: "The Workshop — Projects",
    coordinates: { x: 20, y: 0, z: -8 },
    radius: 8,
    description: "Engineering laboratory, full-stack machines, and builds",
  },
  POND: {
    id: "pond",
    name: "The Pond — Personal Side",
    coordinates: { x: 16, y: 0, z: 18 },
    radius: 7,
    description: "Calm waters, favorite games, movies, music, and musings",
  },
  LIBRARY: {
    id: "library",
    name: "The Library — Knowledge & Stack",
    coordinates: { x: -20, y: 0, z: 16 },
    radius: 7,
    description: "Languages, frameworks, system architectures, and learning",
  },
  POST_OFFICE: {
    id: "post_office",
    name: "The Post Office — Contact",
    coordinates: { x: -2, y: 0, z: -22 },
    radius: 6,
    description: "Get in touch, send a message, GitHub, and social links",
  },
  LOOKOUT: {
    id: "lookout",
    name: "The Lookout — Journey & Milestones",
    coordinates: { x: 0, y: 3.5, z: -35 },
    radius: 7,
    description: "Hilltop scenic overlook, milestones, awards, and roadmap",
  },
} as const;

export const CHARACTER_HATS = [
  "none",
  "straw_hat",
  "beanie",
  "wizard_hat",
  "flower",
  "cap",
  "crown", // Reserved for Owner/Admin
] as const;

export type CharacterHat = (typeof CHARACTER_HATS)[number];

export const CHARACTER_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#8B5CF6", // Purple
  "#EF4444", // Red
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#6366F1", // Indigo
  "#D97706", // Gold
] as const;

