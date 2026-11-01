export interface EasterEgg {
  id: string;
  title: string;
  locationHint: string;
  coordinates: { x: number; y: number; z: number };
  radius: number;
  content: string;
  discoveryTag: string;
}

export const EASTER_EGGS: EasterEgg[] = [
  {
    id: "behind-home-garden",
    title: "The Secret Garden",
    locationHint: "Behind The Home cottage, nestled between wild ferns",
    coordinates: { x: -25, y: 0, z: -15 },
    radius: 2.2,
    content:
      "🌿 You discovered the tucked-away garden! Fun fact: My first computer was a beige Pentium 4 running Windows XP. I broke it three times trying to edit the boot screen bitmap, and fixing it was how I learned the command prompt.",
    discoveryTag: "Old Memories",
  },
  {
    id: "hollow-tree-trunk",
    title: "The Hollow Ancient Pine",
    locationHint: "Inside the thick ancient pine tree north of the crossroads",
    coordinates: { x: -8, y: 0, z: 2 },
    radius: 2.0,
    content:
      "🌲 Tucked in a hollow notch is a worn note: 'If you're reading this, play Outer Wilds completely blind. Don't look up a guide. It might just change how you view curiosity.'",
    discoveryTag: "Favorite Game Note",
  },
  {
    id: "under-the-bridge",
    title: "Under The Wooden Bridge",
    locationHint: "Under the wooden arch bridge over the flowing stream",
    coordinates: { x: 4, y: 0, z: 6 },
    radius: 2.2,
    content:
      "🪵 Etched into the damp underside of the oak bridge: '90% of solving a stubborn bug is explaining it aloud to a rubber duck or a sleeping cat. The other 10% is checking if you remembered to save the file.'",
    discoveryTag: "Bridge Inscription",
  },
  {
    id: "campsite-fire",
    title: "The Starlit Campfire",
    locationHint: "A cozy clearing with log benches and a crackling fire",
    coordinates: { x: -32, y: 0, z: 2 },
    radius: 2.5,
    content:
      "🔥 Pull up a log and warm your hands. The fire crackles peacefully. Take a deep breath — you don't have to check any emails right now.",
    discoveryTag: "Campfire Rest",
  },
  {
    id: "behind-workshop-graveyard",
    title: "The Project Graveyard",
    locationHint: "Hidden behind the workshop's waterwheel gear",
    coordinates: { x: 26, y: 0, z: -14 },
    radius: 2.2,
    content:
      "⚙️ A stack of rusty floppy disks: 'Here lies my attempt at writing a custom 3D physics engine in pure JavaScript over a single weekend. It made spheres explode into deep space at Mach 4. Rest in peace, Euler integrator.'",
    discoveryTag: "Failed Experiments",
  },
  {
    id: "lookout-summit-flag",
    title: "Summit Ambitions Flag",
    locationHint: "At the highest rocky precipice beyond The Lookout",
    coordinates: { x: 0, y: 5.5, z: -44 },
    radius: 2.2,
    content:
      "🚩 Looking out over the entire valley: 'My long-term ambition is to build tools and playful systems that make programming feel accessible, tactile, and deeply creative for the next generation of engineers.'",
    discoveryTag: "Summit Vista",
  },
];

export const JOURNAL_ENTRIES: string[] = [
  "Last Monday, I spent three hours debugging a WebSocket disconnect race condition that turned out to be an accidental trailing slash.",
  "I once tried building a completely unnecessary custom terminal file explorer in C just because I wanted to understand how ANSI escape codes worked.",
  "My current obsession is fine-tuning the exact spring physics of UI dropdowns so they feel like physical mechanical switches.",
  "I have an incurable habit of starting a project just to explore an interesting technology, and occasionally it turns into an entire multiplayer countryside game.",
  "The best code is not the cleverest code; it's the code you can still understand at 2 AM when a production alert rings.",
  "Sometimes the most productive engineering task you can do all day is closing your laptop and going for a 30-minute walk through the trees.",
];

