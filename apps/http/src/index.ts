import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as argon from "argon2";
import { authMiddleware } from "./middlewares/auth";
import cors from "cors";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { JWT_SECRET } from "@repo/backend-config/config";
import { prisma } from "@repo/db/client";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req: Request, res: Response) => {
  const user = CreateUserSchema.safeParse(req.body);

  if (!user.success) {
    res.status(411).json({ message: "error in inputs" });
    return;
  }

  try {
    const { email, password, name } = user.data;
    const hashedPassword = await argon.hash(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    res
      .status(200)
      .json({ userId: newUser.id, message: "user created successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
    return;
  }
});

app.post("/signin", async (req: Request, res: Response) => {
  const user = SigninSchema.safeParse(req.body);

  if (!user.success) {
    res.status(411).json({ message: "error in inputs" });
    return;
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: {
        email: user.data.email,
      },
    });
    if (!dbUser) {
      res.status(401).json({ message: "invalid email" });
      return;
    }
    const validPassword = await argon.verify(
      dbUser.password,
      user.data.password
    );
    if (!validPassword) {
      res.status(401).json({ message: "invalid password" });
      return;
    }
    const token = jwt.sign({ userId: dbUser.id }, JWT_SECRET);

    res.status(200).json({ token: token, user: dbUser });
  } catch (err) {
    res.status(500).json({ message: "server error" });
    return;
  }
});

app.get("/me", authMiddleware, async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "server error" });
    return;
  }
});

app.post("/room", authMiddleware, async (req: Request, res: Response) => {
  const room = CreateRoomSchema.safeParse(req.body);

  if (!room.success) {
    res.status(411).json({ message: "error in inputs" });
    return;
  }
  try {
    const userId = req.userId;
    const newRoom = await prisma.room.create({
      data: {
        slug: room.data.name,
        adminId: userId,
      },
    });

    res
      .status(200)
      .json({ roomId: newRoom.id, message: "room created successfully" });
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

app.delete(
  "/room/:roomId",
  authMiddleware,
  async (req: Request, res: Response) => {
    const roomId = Number(req.params.roomId);
    try {
      const room = await prisma.room.findUnique({
        where: {
          id: roomId,
        },
      });

      if (!room) {
        res.status(404).json({ message: "room not found" });
        return;
      }

      await prisma.chat.deleteMany({
        where: {
          roomId: roomId,
        },
      });

      await prisma.room.delete({
        where: {
          id: roomId,
        },
      });

      res.status(200).json({ message: "room deleted successfully" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: e });
    }
  }
);

app.get("/chats/:roomId", async (req: Request, res: Response) => {
  const roomId = Number(req.params.roomId);
  try {
    const chats = await prisma.chat.findMany({
      where: {
        roomId: roomId,
      },
    });
    res.json({ chats });
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

app.get("/rooms", authMiddleware, async (req: Request, res: Response) => {
  const userId = req.userId;
  const rooms = await prisma.room.findMany({
    where: {
      adminId: userId,
    },
  });
  res.json({ rooms });
});

app.get("/room/:slug", async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const room = await prisma.room.findUnique({
    where: {
      slug,
    },
  });
  if (!room) {
    res.status(404).json({ message: "room not found" });
    return;
  }
  res.json({ room });
});

app.listen(3001);
