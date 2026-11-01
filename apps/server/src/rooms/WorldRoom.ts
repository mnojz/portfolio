import { Room, Client } from "@colyseus/core";
import { WorldState, PlayerSchema } from "./schema/WorldState";
import {
  WORLD_CONFIG,
  CHARACTER_COLORS,
  CHARACTER_HATS,
  ClientMovementMessage,
  ClientChatMessage,
  ClientInviteMessage,
  ClientRespondInviteMessage,
  ClientAuthMessage,
  ClientDoorToggleMessage,
} from "@mosswood/shared";
import { verifyToken } from "../services/auth";

interface ActiveChat {
  playerAId: string;
  playerBId: string;
  establishedAt: number;
  gracePeriodStartedAt?: number;
}

export class WorldRoom extends Room<WorldState> {
  maxClients = WORLD_CONFIG.MAX_PLAYERS_PER_ROOM;
  private activeChats: Map<string, ActiveChat> = new Map(); // key: "idA:idB"
  private pendingInvites: Map<string, { fromId: string; toId: string; expiresAt: number }> = new Map();

  onCreate(options: any) {
    this.setState(new WorldState());

    // Day/Night Cycle Tick (synchronous for all visitors)
    this.clock.setInterval(() => {
      let t = this.state.timeOfDay + 0.02;
      if (t >= 24) t = 0;
      this.state.timeOfDay = t;
    }, 1000);

    // Proximity and Chat Loop (runs every 500ms)
    this.clock.setInterval(() => {
      this.checkProximitiesAndChats();
    }, 500);

    // Movement Handler
    this.onMessage("move", (client, message: ClientMovementMessage) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      // Map bounds validation (-60 to +60)
      const halfMap = WORLD_CONFIG.MAP_SIZE / 2;
      const clampedX = Math.max(-halfMap, Math.min(halfMap, message.x));
      const clampedZ = Math.max(-halfMap, Math.min(halfMap, message.z));

      player.x = clampedX;
      player.y = message.y;
      player.z = clampedZ;
      player.rotationY = message.rotationY;
      player.animation = message.animation;
    });

    // Emote Handler
    this.onMessage("emote", (client, message: { emote: string }) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      player.animation = message.emote;
    });

    // Customization Handler
    this.onMessage("customize", (client, message: { color?: string; hat?: string; username?: string }) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      if (message.color && (CHARACTER_COLORS as readonly string[]).includes(message.color)) {
        player.color = message.color;
      }
      if (message.hat && (CHARACTER_HATS as readonly string[]).includes(message.hat)) {
        // Only owner can wear crown
        if (message.hat === "crown" && !player.isOwner) {
          // ignore
        } else {
          player.hat = message.hat;
        }
      }
      if (message.username && message.username.trim().length > 0) {
        player.username = message.username.trim().slice(0, 16);
      }
    });

    // Owner Auth Token Verification
    this.onMessage("auth", (client, message: ClientAuthMessage) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      if (!message.token) return;
      const decoded = verifyToken(message.token);
      if (decoded && (decoded.role === "OWNER" || decoded.role === "ADMIN")) {
        player.isOwner = true;
        player.username = `${decoded.username} (Creator)`;
        player.hat = "crown";
        player.color = "#F59E0B"; // Gold color
        this.state.isHomeUnlocked = true;

        this.broadcast("notification", {
          type: "owner",
          title: "Creator Connected",
          message: `👑 ${decoded.username} (Portfolio Owner) has joined the world! The Home is unlocked.`,
        });
      }
    });

    // Owner Door Toggle
    this.onMessage("door_toggle", (client, message: ClientDoorToggleMessage) => {
      const player = this.state.players.get(client.sessionId);
      if (!player || !player.isOwner) return;

      this.state.isHomeUnlocked = message.unlocked;
      this.broadcast("notification", {
        type: "info",
        title: "The Home",
        message: message.unlocked
          ? "The Creator unlocked The Home! Everyone is welcome inside."
          : "The Creator closed The Home doors.",
      });
    });

    // Owner Broadcast Invite to Home
    this.onMessage("owner_invite_home", (client) => {
      const player = this.state.players.get(client.sessionId);
      if (!player || !player.isOwner) return;

      this.state.isHomeUnlocked = true;
      this.broadcast("notification", {
        type: "owner",
        title: "Home Invitation",
        message: `🏡 ${player.username} has invited everyone to visit The Home!`,
      });
    });

    // Proximity Chat: Step 1 - Send Invitation
    this.onMessage("chat_invite", (client, message: ClientInviteMessage) => {
      const sender = this.state.players.get(client.sessionId);
      const target = this.state.players.get(message.targetId);
      if (!sender || !target || sender.id === target.id) return;

      // Check proximity distance
      const dist = this.getDistance(sender, target);
      if (dist > WORLD_CONFIG.PROXIMITY_RADIUS) {
        client.send("notification", {
          type: "warning",
          title: "Too Far",
          message: `${target.username} is out of proximity range.`,
        });
        return;
      }

      const inviteKey = `${sender.sessionId}:${target.sessionId}`;
      this.pendingInvites.set(inviteKey, {
        fromId: sender.sessionId,
        toId: target.sessionId,
        expiresAt: Date.now() + WORLD_CONFIG.INVITATION_TIMEOUT_MS,
      });

      // Notify recipient
      const targetClient = this.clients.find((c) => c.sessionId === target.sessionId);
      if (targetClient) {
        targetClient.send("chat_invite_received", {
          fromId: sender.sessionId,
          fromName: sender.username,
        });
      }

      client.send("notification", {
        type: "info",
        title: "Invitation Sent",
        message: `Waiting for ${target.username} to accept...`,
      });
    });

    // Proximity Chat: Step 2 & 3 - Mutual Consent Response
    this.onMessage("chat_invite_respond", (client, message: ClientRespondInviteMessage) => {
      const responder = this.state.players.get(client.sessionId);
      const inviter = this.state.players.get(message.targetId);
      if (!responder || !inviter) return;

      const inviteKey = `${inviter.sessionId}:${responder.sessionId}`;
      const invite = this.pendingInvites.get(inviteKey);
      this.pendingInvites.delete(inviteKey);

      if (!invite || Date.now() > invite.expiresAt) {
        client.send("notification", {
          type: "warning",
          title: "Expired",
          message: "The chat invitation has expired.",
        });
        return;
      }

      const inviterClient = this.clients.find((c) => c.sessionId === inviter.sessionId);

      if (message.accept) {
        // Check proximity again
        const dist = this.getDistance(responder, inviter);
        if (dist > WORLD_CONFIG.PROXIMITY_RADIUS * 1.5) {
          client.send("notification", {
            type: "warning",
            title: "Out of Range",
            message: "You moved too far away to connect.",
          });
          return;
        }

        // Establish Chat Session
        const chatKey = this.getChatKey(responder.sessionId, inviter.sessionId);
        this.activeChats.set(chatKey, {
          playerAId: responder.sessionId,
          playerBId: inviter.sessionId,
          establishedAt: Date.now(),
        });

        responder.activeChatWith = inviter.sessionId;
        inviter.activeChatWith = responder.sessionId;

        const payload = {
          partnerIdA: responder.sessionId,
          partnerNameA: responder.username,
          partnerIdB: inviter.sessionId,
          partnerNameB: inviter.username,
        };

        client.send("chat_connected", payload);
        if (inviterClient) {
          inviterClient.send("chat_connected", payload);
        }
      } else {
        if (inviterClient) {
          inviterClient.send("notification", {
            type: "info",
            title: "Invitation Declined",
            message: `${responder.username} declined the chat invitation.`,
          });
        }
      }
    });

    // Proximity Chat: Step 4 - Chat Message Exchange
    this.onMessage("chat_message", (client, message: ClientChatMessage) => {
      const sender = this.state.players.get(client.sessionId);
      if (!sender) return;

      const target = this.state.players.get(message.targetId);
      if (!target) return;

      const chatKey = this.getChatKey(sender.sessionId, target.sessionId);
      const activeChat = this.activeChats.get(chatKey);
      if (!activeChat) return;

      const cleanText = message.text.trim().slice(0, WORLD_CONFIG.MAX_MESSAGE_LENGTH);
      if (!cleanText) return;

      const msgPayload = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        senderId: sender.sessionId,
        senderName: sender.username,
        recipientId: target.sessionId,
        text: cleanText,
        timestamp: Date.now(),
      };

      // Echo to sender and deliver to recipient
      client.send("chat_message", msgPayload);
      const targetClient = this.clients.find((c) => c.sessionId === target.sessionId);
      if (targetClient) {
        targetClient.send("chat_message", msgPayload);
      }
    });

    // End Chat Handler
    this.onMessage("chat_end", (client, message: { targetId?: string }) => {
      this.terminateChatForPlayer(client.sessionId, "Conversation ended.");
    });
  }

  onJoin(client: Client, options: any) {
    const player = new PlayerSchema();
    player.id = client.sessionId;
    player.sessionId = client.sessionId;

    // Default anonymous guest name
    const guestNum = Math.floor(100 + Math.random() * 900);
    player.username = options.username ? options.username.slice(0, 16) : `Guest_${guestNum}`;

    // Random colorful apparel
    const randomColor = CHARACTER_COLORS[Math.floor(Math.random() * CHARACTER_COLORS.length)];
    player.color = options.color || randomColor;

    // Random starter hat (excluding crown)
    const availableHats = CHARACTER_HATS.filter((h) => h !== "crown");
    player.hat = options.hat || availableHats[Math.floor(Math.random() * availableHats.length)];

    // Spawn point with small random jitter around entrance
    const jitterX = (Math.random() - 0.5) * 3;
    const jitterZ = (Math.random() - 0.5) * 3;
    player.x = WORLD_CONFIG.DEFAULT_SPAWN.x + jitterX;
    player.y = WORLD_CONFIG.DEFAULT_SPAWN.y;
    player.z = WORLD_CONFIG.DEFAULT_SPAWN.z + jitterZ;
    player.rotationY = Math.PI; // Face north toward the countryside

    // Check if token was supplied at connection
    if (options.token) {
      const decoded = verifyToken(options.token);
      if (decoded && (decoded.role === "OWNER" || decoded.role === "ADMIN")) {
        player.isOwner = true;
        player.username = `${decoded.username} (Creator)`;
        player.hat = "crown";
        player.color = "#F59E0B";
        this.state.isHomeUnlocked = true;
      }
    }

    this.state.players.set(client.sessionId, player);
    this.state.onlineCount = this.state.players.size;

    client.send("welcome", {
      sessionId: client.sessionId,
      username: player.username,
      isOwner: player.isOwner,
      isHomeUnlocked: this.state.isHomeUnlocked,
      timeOfDay: this.state.timeOfDay,
    });
  }

  onLeave(client: Client, consented: boolean) {
    this.terminateChatForPlayer(client.sessionId, "Other visitor disconnected.");
    this.state.players.delete(client.sessionId);
    this.state.onlineCount = this.state.players.size;
  }

  private getChatKey(idA: string, idB: string): string {
    return [idA, idB].sort().join(":");
  }

  private getDistance(a: PlayerSchema, b: PlayerSchema): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  private terminateChatForPlayer(sessionId: string, reason: string) {
    const player = this.state.players.get(sessionId);
    if (!player) return;

    for (const [key, chat] of this.activeChats.entries()) {
      if (chat.playerAId === sessionId || chat.playerBId === sessionId) {
        this.activeChats.delete(key);

        const partnerId = chat.playerAId === sessionId ? chat.playerBId : chat.playerAId;
        const partner = this.state.players.get(partnerId);

        player.activeChatWith = "";
        if (partner) {
          partner.activeChatWith = "";
          const partnerClient = this.clients.find((c) => c.sessionId === partnerId);
          if (partnerClient) {
            partnerClient.send("chat_ended", { reason });
          }
        }

        const client = this.clients.find((c) => c.sessionId === sessionId);
        if (client) {
          client.send("chat_ended", { reason });
        }
      }
    }
  }

  private checkProximitiesAndChats() {
    const now = Date.now();

    // Clean expired pending invites
    for (const [key, invite] of this.pendingInvites.entries()) {
      if (now > invite.expiresAt) {
        this.pendingInvites.delete(key);
      }
    }

    // Check active chats proximity & grace period
    for (const [key, chat] of this.activeChats.entries()) {
      const playerA = this.state.players.get(chat.playerAId);
      const playerB = this.state.players.get(chat.playerBId);

      if (!playerA || !playerB) {
        this.activeChats.delete(key);
        continue;
      }

      const dist = this.getDistance(playerA, playerB);
      if (dist > WORLD_CONFIG.PROXIMITY_RADIUS) {
        if (!chat.gracePeriodStartedAt) {
          chat.gracePeriodStartedAt = now;
          // Notify both players they are leaving range
          const clientA = this.clients.find((c) => c.sessionId === chat.playerAId);
          const clientB = this.clients.find((c) => c.sessionId === chat.playerBId);
          const gracePayload = {
            message: "Leaving proximity range! Chat will close in 6 seconds.",
            secondsLeft: 6,
          };
          if (clientA) clientA.send("chat_grace_period", gracePayload);
          if (clientB) clientB.send("chat_grace_period", gracePayload);
        } else if (now - chat.gracePeriodStartedAt > WORLD_CONFIG.GRACE_PERIOD_MS) {
          // Grace period elapsed -> close chat
          this.terminateChatForPlayer(chat.playerAId, "Visitors moved too far apart.");
        }
      } else {
        // Back in range -> cancel grace period
        if (chat.gracePeriodStartedAt) {
          chat.gracePeriodStartedAt = undefined;
          const clientA = this.clients.find((c) => c.sessionId === chat.playerAId);
          const clientB = this.clients.find((c) => c.sessionId === chat.playerBId);
          const resumedPayload = { message: "Back in range. Chat resumed." };
          if (clientA) clientA.send("chat_grace_cancelled", resumedPayload);
          if (clientB) clientB.send("chat_grace_cancelled", resumedPayload);
        }
      }
    }

    // Send Proximity Updates to each connected client
    const playersArray = Array.from(this.state.players.values());
    for (const client of this.clients) {
      const me = this.state.players.get(client.sessionId);
      if (!me) continue;

      const nearby = playersArray
        .filter((other) => other.id !== me.id && this.getDistance(me, other) <= WORLD_CONFIG.PROXIMITY_RADIUS)
        .map((other) => ({
          id: other.id,
          username: other.username,
          isOwner: other.isOwner,
          color: other.color,
          distance: Math.round(this.getDistance(me, other) * 10) / 10,
        }));

      client.send("proximity_update", { nearby });
    }
  }
}

