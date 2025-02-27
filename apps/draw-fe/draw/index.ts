import { type RefObject } from "react";
import { getExistingShapes } from "./utils";

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

let isIniatilized = false;

export async function initDraw(
  canvasRef: RefObject<HTMLCanvasElement>,
  roomId: string,
  socket: WebSocket
) {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const existingShapes = await getExistingShapes(roomId);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (isIniatilized) {
    clearCanvas(existingShapes, canvas, ctx);
    console.log("[DEBUG] initDraw already initialized, skipping...");
    return;
  }
  isIniatilized = true;

  socket.onmessage = null;
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

  const mousedown = (e: MouseEvent) => {
    const pos = getMousePos(e);
    isDrawing = true;
    startX = pos.x;
    startY = pos.y;
  };

  const mousemove = (e: MouseEvent) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    const width = pos.x - startX;
    const height = pos.y - startY;

    clearCanvas(existingShapes, canvas, ctx);
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(startX, startY, width, height);
  };

  const mouseup = (e: MouseEvent) => {
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

    console.log("[DEBUG] Sending shape via WebSocket:", shape);

    isDrawing = false;

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify(shape),
        roomId,
      })
    );
  };

  canvas.addEventListener("mousedown", mousedown);

  canvas.addEventListener("mousemove", mousemove);

  canvas.addEventListener("mouseup", mouseup);

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
