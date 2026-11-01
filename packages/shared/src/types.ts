import { CharacterHat } from "./constants";

export type AnimationState = "idle" | "walk" | "run" | "jump" | "wave" | "sit" | "dance";

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface PlayerData {
  id: string;
  sessionId: string;
  username: string;
  isOwner: boolean;
  color: string;
  hat: CharacterHat;
  position: Vector3D;
  rotationY: number;
  animation: AnimationState;
  activeChatWith?: string | null;
  lastPing: number;
}

export type ChatInvitationStatus = "idle" | "sent" | "received" | "active" | "grace_period" | "declined" | "expired";

export interface ChatSessionData {
  playerA: string;
  playerB: string;
  startedAt: number;
  lastProximityCheck: number;
  inGracePeriod: boolean;
  gracePeriodEndsAt?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  timestamp: number;
}

export interface ChatInviteRequest {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  timestamp: number;
}

// Client-to-Server Message Types
export interface ClientMovementMessage {
  x: number;
  y: number;
  z: number;
  rotationY: number;
  animation: AnimationState;
}

export interface ClientEmoteMessage {
  emote: "wave" | "sit" | "dance" | "idle";
}

export interface ClientChatMessage {
  text: string;
  targetId: string;
}

export interface ClientInviteMessage {
  targetId: string;
}

export interface ClientRespondInviteMessage {
  targetId: string;
  accept: boolean;
}

export interface ClientAuthMessage {
  token: string;
}

export interface ClientDoorToggleMessage {
  unlocked: boolean;
}

export interface ClientOwnerBroadcastMessage {
  message: string;
}

// Server-to-Client Messages
export interface ServerNotificationMessage {
  type: "info" | "success" | "warning" | "invite" | "owner";
  title: string;
  message: string;
  senderId?: string;
  duration?: number;
}

export interface ServerProximityUpdate {
  nearbyPlayerIds: string[];
}

