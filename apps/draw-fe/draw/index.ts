import { BACKEND_URL } from "@/config";
import axios from "axios";
import { type RefObject } from "react";

type Shape =
  | {
      type: "rect" | "circle";
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
    }
  | {
      type: "circle";
      centreX: number;
      centreY: number;
      radius: number;
      color: string;
    };

export async function initDraw(
  canvasRef: RefObject<HTMLCanvasElement>,
  roomId: string,
  socket: WebSocket
) {
  const canvas = canvasRef.current;
  if (!canvas) return;

  let existingShapes = await getExistingShapes(roomId);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  //socket.onmessage = null;
  socket.onmessage = (e) => {
    const message = JSON.parse(e.data);
    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShapes.push(parsedShape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  let isDrawing = false;
  let startX = 0;
  let startY = 0;

  clearCanvas(existingShapes, canvas, ctx);

  function getMousePos(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  canvas.addEventListener("mousedown", (e) => {
    const pos = getMousePos(e);
    isDrawing = true;
    startX = pos.x;
    startY = pos.y;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    const width = pos.x - startX;
    const height = pos.y - startY;

    clearCanvas(existingShapes, canvas, ctx);
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(startX, startY, width, height);
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    const width = pos.x - startX;
    const height = pos.y - startY;
    const shape = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
      color: "#ffffff",
    };
    //existingShapes.push(shape);

    isDrawing = false;

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify(shape),
        roomId,
      })
    );
  });

  canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
  });
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.fillStyle = "#121212";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = shape.color;
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

async function getExistingShapes(roomId: string) {
  const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
  const chats = response.data.chats;

  const shapes = chats.map((ch: { message: string }) => {
    const chatData = JSON.parse(ch.message);
    return chatData;
  });

  return shapes;
}
