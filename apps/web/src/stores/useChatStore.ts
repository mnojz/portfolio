import { create } from "zustand";
import { ChatMessage } from "@mosswood/shared";
import { useAudioStore } from "./useAudioStore";

interface ChatState {
  activePartner: { id: string; username: string } | null;
  pendingInvite: { fromId: string; fromName: string } | null;
  messages: ChatMessage[];
  inGracePeriod: boolean;
  gracePeriodSeconds: number;
  isOpen: boolean;

  // Actions
  setPendingInvite: (invite: { fromId: string; fromName: string } | null) => void;
  setActivePartner: (partner: { id: string; username: string } | null) => void;
  addMessage: (msg: ChatMessage) => void;
  setGracePeriod: (inGrace: boolean, seconds?: number) => void;
  setIsOpen: (isOpen: boolean) => void;
  resetChat: (reason?: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  activePartner: null,
  pendingInvite: null,
  messages: [],
  inGracePeriod: false,
  gracePeriodSeconds: 6,
  isOpen: false,

  setPendingInvite: (pendingInvite) => {
    set({ pendingInvite });
    if (pendingInvite) {
      useAudioStore.getState().playNotification();
    }
  },

  setActivePartner: (activePartner) => {
    set({
      activePartner,
      pendingInvite: null,
      isOpen: activePartner !== null,
      inGracePeriod: false,
    });
    if (activePartner) {
      useAudioStore.getState().playNotification();
    }
  },

  addMessage: (msg) => {
    set((state) => ({
      messages: [...state.messages, msg],
      isOpen: true,
    }));
    useAudioStore.getState().playNotification();
  },

  setGracePeriod: (inGracePeriod, seconds = 6) => {
    set({ inGracePeriod, gracePeriodSeconds: seconds });
  },

  setIsOpen: (isOpen) => set({ isOpen }),

  resetChat: () => {
    set({
      activePartner: null,
      inGracePeriod: false,
      isOpen: false,
    });
  },
}));

