# 🌲 Mosswood — A Living, Multiplayer 3D Developer Portfolio

> **A peaceful, handcrafted 3D countryside exploration game that doubles as a personal developer portfolio.**

Visitors enter as independent characters in a synchronized low-poly countryside world. As they stroll along dirt paths, they explore different locations that reveal Manoj's engineering background, projects, knowledge stack, and personal side — and occasionally meet and chat with fellow visitors along the way.

---

## ✨ Features

- **🌐 Server-Authoritative Multiplayer**: Real-time visitor synchronization powered by Colyseus and WebSockets. Connected visitors see each other walking, jumping, sitting, dancing, and waving.
- **👑 Creator / Owner Account**: When Manoj logs in as the Owner, an exclusive glowing `👑 [OWNER]` badge and golden crown appears over his avatar, "The Home" cottage doors unlock for visitors, and Manoj can broadcast invitations to everyone in the world.
- **💬 Mutual Consent Proximity Chat**: Approach other visitors to trigger proximity detection. Conversations require mutual acceptance before opening, and smoothly close with a grace period warning if visitors walk away.
- **📍 Six Core Locations**:
  1. **The Home — About Manoj**: Biography, personal philosophy, desk with glowing computer, and developer stats.
  2. **The Workshop — Projects**: Interactive stations showcasing full-stack systems, 3D graphics engines, and tools (OmniCampus ERP, AuraKV, SynthForge AI, VoxelBloom, Mosswood).
  3. **The Pond — Personal Side**: A calm reflective pond with fishing dock, lily pads, vinyl record player, favorite games (*Outer Wilds*, *Stardew Valley*), movies, and music.
  4. **The Library — Knowledge & Stack**: Classical stone archive with floating enchanted tomes detailing skills across Languages, Frontend, Backend, Systems, and Databases.
  5. **The Post Office — Contact & Guestbook**: Postal depot with a red mailbox where visitors can leave real notes for Manoj or reach out via Email, GitHub, and LinkedIn.
  6. **The Lookout — Journey & Milestones**: Hilltop panoramic overlook with a brass telescope, fluttering flag, and golden trophy displaying degrees, awards, and milestones.
- **✨ Easter Eggs & The Forgotten Journal**: Scattered secrets hidden behind cottages, in hollow tree trunks, under bridges, and around campsite fire pits.
- **🎵 Procedural Web Audio Synth**: Synthesizes gentle pastoral chords, wind breezes, footstep Foley, and interaction chimes directly in the browser with zero external audio assets required.
- **☀️ Synchronized Day & Night Cycle**: Seamless transitions from warm morning dawn to golden afternoon, sunset amber, and starry twilight with glowing village lanterns and fireflies.
- **📄 2D Classic Portfolio Toggle**: Instantly switch between the 3D World and a clean, responsive 2D CV layout for recruiters or non-WebGL devices.
- **📱 Mobile Touch Controls**: Virtual D-pad and jump controls for mobile browsers.

---

## 🏗️ Architecture & Monorepo Structure

```
portfolio/
├── apps/
│   ├── web/                     # Next.js 14 + React Three Fiber (R3F) + Drei + Tailwind CSS + Prisma
│   │   ├── prisma/              # Database schema (User accounts, Guestbook, Discoveries)
│   │   ├── src/
│   │   │   ├── app/             # App Router pages & API routes (/api/auth, /api/guestbook)
│   │   │   ├── components/
│   │   │   │   ├── world/       # 3D R3F components (Terrain, Foliage, Water, Locations, Players)
│   │   │   │   ├── ui/          # HUD, Proximity Chat, Parchment Modals, Illustrated Map, Classic View
│   │   │   │   └── audio/       # Web Audio API procedural sound engine
│   │   │   ├── content/         # Centralized portfolio data (profile, projects, skills, education, etc.)
│   │   │   └── stores/          # Zustand state stores (game, multiplayer, chat, audio, auth)
│   └── server/                  # Colyseus multiplayer game server (Express + WebSockets)
│       └── src/
│           ├── rooms/           # WorldRoom (physics validation, proximity loop, chat consent)
│           └── services/        # JWT auth verification for Creator privileges
└── packages/
    └── shared/                  # Shared TypeScript types, schemas, and world constants
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development
Starts both the Next.js frontend (port `3000`) and Colyseus game server (port `2567`):
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👑 Logging in as Creator / Owner

1. Click **Owner Login** on the top right HUD.
2. Enter:
   - **Username**: `manoj`
   - **Password**: `creator2026` (or `password123`)
3. Click **Sign In as Creator**.
4. Your character avatar will now wear the golden **👑 Crown**, your overhead nameplate will display `👑 Manoj (Creator)`, and The Home cottage will unlock!

---

## 📝 Customizing Portfolio Content

All portfolio content is data-driven and lives in `apps/web/src/content/`:
- `profile.ts`: Biography, stats, tagline, and quote.
- `projects.ts`: Project titles, descriptions, categories, tech tags, and links.
- `skills.ts`: Programming languages, frameworks, databases, and systems.
- `education.ts`: Degrees, coursework, and college achievements.
- `achievements.ts`: Awards, hackathon victories, and milestones.
- `hobbies.ts`: Favorite games, movies, and music.
- `easter-eggs.ts`: Hidden secrets and random journal entries.

