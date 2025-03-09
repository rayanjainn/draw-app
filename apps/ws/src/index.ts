import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-config/config";
import { prisma } from "@repo/db/client";

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

let users: User[] = [];

const wss = new WebSocketServer({ port: 3002 });

const checkUser = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded && (decoded as JwtPayload).userId
      ? (decoded as JwtPayload).userId
      : null;
  } catch (e) {
    console.error("[ERROR] Error verifying JWT:", e);
    return null;
  }
};

wss.on("connection", (ws, req) => {
  const url = req.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  users.push({
    ws,
    rooms: [],
    userId,
  });

  ws.on("message", async (message) => {
    const parsedData = JSON.parse(message.toString());

    if (parsedData.type === "join") {
      const roomId = parsedData.roomId;
      const roomExists = await prisma.room.findUnique({
        where: { id: Number(roomId) },
      });

      if (!roomExists) {
        ws.send(JSON.stringify({ type: "error", message: "room not found" }));
        return;
      }

      const user = users.find((x) => x.ws === ws);
      if (user) {
        user.rooms.push(roomId);
      }
    }

    if (parsedData.type === "leave") {
      const user = users.find((x) => x.ws === ws);
      if (user) {
        user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
      }
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const msg = parsedData.message;

      try {
        await prisma.chat.create({
          data: {
            roomId: Number(roomId),
            message: msg,
            userId,
          },
        });
      } catch (error) {
        console.error("[ERROR] Failed to save message to DB:", error);
      }

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({ type: "chat", message: msg, roomId }));
        }
      });
    }
  });

  ws.on("close", () => {
    users = users.filter((x) => x.ws !== ws);
  });
});
