import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { WorldRoom } from "./rooms/WorldRoom";

dotenv.config();

const port = Number(process.env.PORT || 2567);
const app = express();

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "mosswood-multiplayer", timestamp: Date.now() });
});

const server = http.createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({
    server,
  }),
});

// Register World Room
gameServer.define("world", WorldRoom);

server.listen(port, () => {
  console.log(`🌲 Mosswood Multiplayer Server running on ws://localhost:${port}`);
  console.log(`🌐 Health check available at http://localhost:${port}/health`);
});

