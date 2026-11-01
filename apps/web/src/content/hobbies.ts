export interface HobbyCategory {
  category: string;
  items: {
    title: string;
    subtitle?: string;
    note: string;
  }[];
}

export const HOBBIES: HobbyCategory[] = [
  {
    category: "Favorite Games",
    items: [
      {
        title: "Stardew Valley",
        subtitle: "ConcernedApe",
        note: "The gold standard of solo developer craftsmanship, warmth, and pastoral soundtrack design.",
      },
      {
        title: "Outer Wilds",
        subtitle: "Mobius Digital",
        note: "The most brilliant curiosity-driven exploration game ever created. Curiosity as the only progression mechanic.",
      },
      {
        title: "Hollow Knight",
        subtitle: "Team Cherry",
        note: "Flawless controls, atmospheric worldbuilding, and unmatched hand-drawn artistry.",
      },
      {
        title: "Chrono Trigger",
        subtitle: "Square",
        note: "The timeless JRPG masterclass that first inspired me to wonder how games are programmed.",
      },
    ],
  },
  {
    category: "Music on Repeat",
    items: [
      {
        title: "Lofi Beats & Ambient Chimes",
        subtitle: "Nujabes, Tycho, Bonobo",
        note: "My default soundtrack for entering deep coding flow states and architecture sketching.",
      },
      {
        title: "Acoustic Fingerstyle & Classical",
        subtitle: "Sungha Jung, Joe Hisaishi",
        note: "Peaceful acoustic melodies that bring calm and focus to busy days.",
      },
      {
        title: "Synthwave / Cyberpunk OSTs",
        subtitle: "Disasterpeace, HOME, Com Truise",
        note: "When debugging low-level memory leaks late at night.",
      },
    ],
  },
  {
    category: "Cinema & Stories",
    items: [
      {
        title: "Studio Ghibli (Spirited Away & Totoro)",
        subtitle: "Hayao Miyazaki",
        note: "Celebration of quiet environmental moments, handcrafted detail, and lush nature.",
      },
      {
        title: "Interstellar",
        subtitle: "Christopher Nolan",
        note: "A breathtaking collision of physics, love, and Hans Zimmer organ chords.",
      },
      {
        title: "Mr. Robot",
        subtitle: "Sam Esmail",
        note: "The only show with realistic terminal commands, Linux ricing, and psychological depth.",
      },
    ],
  },
  {
    category: "Off-Screen Life",
    items: [
      {
        title: "Himalayan Day Hikes",
        note: "Stepping away from the keyboard to breathe crisp mountain pine air and touch actual grass.",
      },
      {
        title: "Brewing Specialty Tea & Coffee",
        note: "Mastering the perfect pour-over extraction ratio with single-origin beans.",
      },
      {
        title: "Custom Mechanical Keyboards",
        note: "Lubing linear switches, soldering custom PCBs, and tuning acoustic foam dampening.",
      },
    ],
  },
];

