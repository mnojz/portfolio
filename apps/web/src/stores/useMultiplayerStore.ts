import { create } from "zustand";
import { Client, Room } from "colyseus.js";
import {
  PlayerData,
  ClientMovementMessage,
  ClientChatMessage,
  ClientInviteMessage,
  ClientRespondInviteMessage,
  ClientDoorToggleMessage,
} from "@mosswood/shared";
import { useChatStore } from "./useChatStore";
import { useGameStore } from "./useGameStore";
import { useAuthStore } from "./useAuthStore";

interface NearbyPlayer {
  id: string;
  username: string;
  isOwner: boolean;
  color: string;
  distance: number;
}

interface NotificationItem {
  id: string;
  type: "info" | "success" | "warning" | "invite" | "owner";
  title: string;
  message: string;
}

interface MultiplayerState {
  client: Client | null;
  room: Room<any> | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  mySessionId: string | null;
  myUsername: string;
  myColor: string;
  myHat: string;
  remotePlayers: Record<string, PlayerData>;
  nearbyPlayers: NearbyPlayer[];
  onlineCount: number;
  notifications: NotificationItem[];

  // Methods
  initConnection: () => Promise<void>;
  sendMovement: (data: ClientMovementMessage) => void;
  sendEmote: (emote: string) => void;
  customizeAvatar: (color?: string, hat?: string, username?: string) => void;
  sendChatInvite: (targetId: string) => void;
  respondChatInvite: (targetId: string, accept: boolean) => void;
  sendChatMessage: (text: string, targetId: string) => void;
  sendChatEnd: (targetId?: string) => void;
  toggleDoor: (unlocked: boolean) => void;
  ownerInviteHome: () => void;
  addNotification: (notification: Omit<NotificationItem, "id">) => void;
  dismissNotification: (id: string) => void;
}

const getWebSocketUrl = (): string => {
  if (process.env.NEXT_PUBLIC_MULTIPLAYER_WS_URL) {
    return process.env.NEXT_PUBLIC_MULTIPLAYER_WS_URL;
  }
  if (typeof window !== "undefined") {
    const isSecure = window.location.protocol === "https:";
    const protocol = isSecure ? "wss:" : "ws:";
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      return `${protocol}//${window.location.host}/multiplayer`;
    }
  }
  return "ws://localhost:2567";
};

export const useMultiplayerStore = create<MultiplayerState>((set, get) => ({
  client: null,
  room: null,
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  mySessionId: null,
  myUsername: "Guest",
  myColor: "#3B82F6",
  myHat: "none",
  remotePlayers: {},
  nearbyPlayers: [],
  onlineCount: 1,
  notifications: [],

  initConnection: async () => {
    if (get().isConnected || get().isConnecting) return;
    set({ isConnecting: true, connectionError: null });

    try {
      const wsUrl = getWebSocketUrl();
      const client = new Client(wsUrl);
      const token = useAuthStore.getState().token;
      const savedUser = useAuthStore.getState().user;

      const room: Room<any> = await client.joinOrCreate<any>("world", {
        token: token || undefined,
        username: savedUser?.username || undefined,
      });

      set({
        client,
        room,
        isConnected: true,
        isConnecting: false,
        mySessionId: room.sessionId,
      });

      // Welcome handshake
      room.onMessage("welcome", (data: any) => {
        set({
          myUsername: data.username,
          mySessionId: data.sessionId,
        });
        useGameStore.getState().setIsHomeUnlocked(data.isHomeUnlocked);
        useGameStore.getState().setTimeOfDay(data.timeOfDay);
      });

      // Player Join / Move / Leave via Colyseus Schema Listeners
      room.state.players.onAdd((player: any, sessionId: string) => {
        if (sessionId === room.sessionId) {
          set({
            myUsername: player.username,
            myColor: player.color,
            myHat: player.hat,
          });
        } else {
          set((state) => ({
            remotePlayers: {
              ...state.remotePlayers,
              [sessionId]: {
                id: sessionId,
                sessionId,
                username: player.username,
                isOwner: player.isOwner,
                color: player.color,
                hat: player.hat,
                position: { x: player.x, y: player.y, z: player.z },
                rotationY: player.rotationY,
                animation: player.animation,
                activeChatWith: player.activeChatWith,
                lastPing: Date.now(),
              },
            },
          }));
        }

        player.onChange(() => {
          if (sessionId === room.sessionId) {
            set({
              myColor: player.color,
              myHat: player.hat,
              myUsername: player.username,
            });
          } else {
            set((state) => {
              const existing = state.remotePlayers[sessionId];
              if (!existing) return state;
              return {
                remotePlayers: {
                  ...state.remotePlayers,
                  [sessionId]: {
                    ...existing,
                    username: player.username,
                    isOwner: player.isOwner,
                    color: player.color,
                    hat: player.hat,
                    position: { x: player.x, y: player.y, z: player.z },
                    rotationY: player.rotationY,
                    animation: player.animation,
                    activeChatWith: player.activeChatWith,
                    lastPing: Date.now(),
                  },
                },
              };
            });
          }
        });
      });

      room.state.players.onRemove((_: any, sessionId: string) => {
        set((state) => {
          const updated = { ...state.remotePlayers };
          delete updated[sessionId];
          return { remotePlayers: updated };
        });
      });

      room.state.listen("isHomeUnlocked", (unlocked: boolean) => {
        useGameStore.getState().setIsHomeUnlocked(unlocked);
      });

      room.state.listen("onlineCount", (count: number) => {
        set({ onlineCount: count });
      });

      room.state.listen("timeOfDay", (time: number) => {
        useGameStore.getState().setTimeOfDay(time);
      });

      // Proximity Update from Server
      room.onMessage("proximity_update", (data: { nearby: NearbyPlayer[] }) => {
        set({ nearbyPlayers: data.nearby });
      });

      // Chat Protocol Handlers
      room.onMessage("chat_invite_received", (data: { fromId: string; fromName: string }) => {
        useChatStore.getState().setPendingInvite(data);
      });

      room.onMessage("chat_connected", (data: any) => {
        const myId = room.sessionId;
        const partner =
          data.partnerIdA === myId
            ? { id: data.partnerIdB, username: data.partnerNameB }
            : { id: data.partnerIdA, username: data.partnerNameA };
        useChatStore.getState().setActivePartner(partner);
      });

      room.onMessage("chat_message", (msg: any) => {
        useChatStore.getState().addMessage(msg);
      });

      room.onMessage("chat_grace_period", (data: any) => {
        useChatStore.getState().setGracePeriod(true, data.secondsLeft);
        get().addNotification({
          type: "warning",
          title: "Proximity Warning",
          message: data.message,
        });
      });

      room.onMessage("chat_grace_cancelled", (data: any) => {
        useChatStore.getState().setGracePeriod(false);
      });

      room.onMessage("chat_ended", (data: { reason: string }) => {
        useChatStore.getState().resetChat(data.reason);
        get().addNotification({
          type: "info",
          title: "Chat Closed",
          message: data.reason,
        });
      });

      room.onMessage("notification", (notif: any) => {
        get().addNotification(notif);
      });

      room.onLeave((code) => {
        set({ isConnected: false, room: null });
      });
    } catch (err: any) {
      console.warn("Could not connect to Colyseus multiplayer server:", err.message);
      set({
        isConnected: false,
        isConnecting: false,
        connectionError: "Multiplayer offline (Playing in Single-Player peaceful mode)",
      });
    }
  },

  sendMovement: (data: ClientMovementMessage) => {
    const { room } = get();
    if (room) {
      room.send("move", data);
    }
  },

  sendEmote: (emote: string) => {
    const { room } = get();
    if (room) {
      room.send("emote", { emote });
    }
  },

  customizeAvatar: (color?: string, hat?: string, username?: string) => {
    const { room } = get();
    if (room) {
      room.send("customize", { color, hat, username });
    }
    set((state) => ({
      myColor: color || state.myColor,
      myHat: hat || state.myHat,
      myUsername: username || state.myUsername,
    }));
  },

  sendChatInvite: (targetId: string) => {
    const { room } = get();
    if (room) {
      room.send("chat_invite", { targetId } as ClientInviteMessage);
    }
  },

  respondChatInvite: (targetId: string, accept: boolean) => {
    const { room } = get();
    if (room) {
      room.send("chat_invite_respond", { targetId, accept } as ClientRespondInviteMessage);
    }
    useChatStore.getState().setPendingInvite(null);
  },

  sendChatMessage: (text: string, targetId: string) => {
    const { room } = get();
    if (room) {
      room.send("chat_message", { text, targetId } as ClientChatMessage);
    }
  },

  sendChatEnd: (targetId?: string) => {
    const { room } = get();
    if (room) {
      room.send("chat_end", { targetId });
    }
    useChatStore.getState().resetChat();
  },

  toggleDoor: (unlocked: boolean) => {
    const { room } = get();
    if (room) {
      room.send("door_toggle", { unlocked } as ClientDoorToggleMessage);
    }
  },

  ownerInviteHome: () => {
    const { room } = get();
    if (room) {
      room.send("owner_invite_home");
    }
  },

  addNotification: (notification) => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    set((state) => ({
      notifications: [...state.notifications.slice(-4), { ...notification, id }],
    }));
    setTimeout(() => {
      get().dismissNotification(id);
    }, 5000);
  },

  dismissNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));

