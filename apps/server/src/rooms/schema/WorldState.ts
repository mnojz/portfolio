import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class PlayerSchema extends Schema {
  @type("string") id: string = "";
  @type("string") sessionId: string = "";
  @type("string") username: string = "";
  @type("boolean") isOwner: boolean = false;
  @type("string") color: string = "#3B82F6";
  @type("string") hat: string = "none";
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
  @type("number") rotationY: number = 0;
  @type("string") animation: string = "idle";
  @type("string") activeChatWith: string = "";
}

export class ChatMessageSchema extends Schema {
  @type("string") id: string = "";
  @type("string") senderId: string = "";
  @type("string") senderName: string = "";
  @type("string") recipientId: string = "";
  @type("string") text: string = "";
  @type("number") timestamp: number = 0;
}

export class WorldState extends Schema {
  @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();
  @type("boolean") isHomeUnlocked: boolean = false;
  @type("number") onlineCount: number = 0;
  @type("number") timeOfDay: number = 14; // Default afternoon (14:00)
}

