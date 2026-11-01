import { create } from "zustand";
import { Project } from "@/content/projects";
import { EasterEgg, JOURNAL_ENTRIES } from "@/content/easter-eggs";

export interface InteractionTarget {
  type: "location" | "project" | "easter-egg" | "journal" | "door" | "mailbox" | "board";
  id: string;
  title: string;
  promptText: string;
  data?: any;
}

export type ModalType =
  | "home"
  | "workshop"
  | "pond"
  | "library"
  | "post_office"
  | "lookout"
  | "project_detail"
  | "easter_egg"
  | "journal"
  | "map"
  | "customizer"
  | "admin_login"
  | "guestbook";

export type GraphicsQuality = "low" | "medium" | "high";

interface GameState {
  viewMode: "3d" | "classic";
  graphicsQuality: GraphicsQuality;
  currentLocationName: string | null;
  interactionTarget: InteractionTarget | null;
  activeModal: ModalType | null;
  selectedProject: Project | null;
  activeEasterEgg: EasterEgg | null;
  randomJournalEntry: string | null;
  discoveredSecrets: string[];
  isHomeUnlocked: boolean;
  timeOfDay: number; // 0 to 24

  // Actions
  setViewMode: (mode: "3d" | "classic") => void;
  setGraphicsQuality: (quality: GraphicsQuality) => void;
  setCurrentLocationName: (name: string | null) => void;
  setInteractionTarget: (target: InteractionTarget | null) => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  setSelectedProject: (project: Project | null) => void;
  setActiveEasterEgg: (egg: EasterEgg | null) => void;
  triggerRandomJournal: () => void;
  unlockSecret: (secretId: string) => boolean;
  setIsHomeUnlocked: (unlocked: boolean) => void;
  setTimeOfDay: (time: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  viewMode: "3d",
  graphicsQuality: "high",
  currentLocationName: "Village Entrance",
  interactionTarget: null,
  activeModal: null,
  selectedProject: null,
  activeEasterEgg: null,
  randomJournalEntry: null,
  discoveredSecrets: [],
  isHomeUnlocked: false,
  timeOfDay: 14, // 2 PM afternoon sunlight

  setViewMode: (viewMode) => set({ viewMode }),
  setGraphicsQuality: (graphicsQuality) => set({ graphicsQuality }),
  setCurrentLocationName: (currentLocationName) => set({ currentLocationName }),
  setInteractionTarget: (interactionTarget) => set({ interactionTarget }),
  openModal: (activeModal) => set({ activeModal }),
  closeModal: () => set({ activeModal: null, selectedProject: null, activeEasterEgg: null }),
  setSelectedProject: (selectedProject) => set({ selectedProject, activeModal: "project_detail" }),
  setActiveEasterEgg: (activeEasterEgg) => set({ activeEasterEgg, activeModal: "easter_egg" }),
  triggerRandomJournal: () => {
    const entry = JOURNAL_ENTRIES[Math.floor(Math.random() * JOURNAL_ENTRIES.length)];
    set({ randomJournalEntry: entry, activeModal: "journal" });
  },
  unlockSecret: (secretId: string) => {
    const { discoveredSecrets } = get();
    if (!discoveredSecrets.includes(secretId)) {
      set({ discoveredSecrets: [...discoveredSecrets, secretId] });
      return true;
    }
    return false;
  },
  setIsHomeUnlocked: (isHomeUnlocked) => set({ isHomeUnlocked }),
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
}));

