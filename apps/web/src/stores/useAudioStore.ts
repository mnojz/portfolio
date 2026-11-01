import { create } from "zustand";
import { proceduralAudio } from "@/components/audio/ProceduralAudio";

interface AudioState {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  playFootstep: () => void;
  playChime: () => void;
  playDiscovery: () => void;
  playNotification: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  isMuted: false,
  volume: 0.4,
  toggleMute: () => {
    const next = !get().isMuted;
    set({ isMuted: next });
    if (proceduralAudio) {
      proceduralAudio.setMuted(next);
    }
  },
  setVolume: (volume: number) => {
    set({ volume });
    if (proceduralAudio) {
      proceduralAudio.setVolume(volume);
    }
  },
  playFootstep: () => {
    if (proceduralAudio) proceduralAudio.playFootstep();
  },
  playChime: () => {
    if (proceduralAudio) proceduralAudio.playInteractChime();
  },
  playDiscovery: () => {
    if (proceduralAudio) proceduralAudio.playDiscoveryChime();
  },
  playNotification: () => {
    if (proceduralAudio) proceduralAudio.playNotificationSound();
  },
}));

