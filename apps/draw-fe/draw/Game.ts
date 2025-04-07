import { Tool } from "@/components/Canvas";
import { getExistingShapes, query } from "./utils";

type Shape =
  | {
      type: "rect";
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
    }
  | {
      type: "pencil";
      points: { x: number; y: number }[];
      color: string;
    }
  | {
      type: "text";
      x: number;
      y: number;
      content: string;
      color: string;
      fontSize: number;
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private socket: WebSocket;
  private isDrawing = false;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "Freehand";
  scale = 1;
  offsetX = 0;
  offsetY = 0;
  isPanning = false;
  private lastX = 0;
  private lastY = 0;
  private colour = "#ffffff";
  private onZoomChange?: (zoom: number) => void;
  private isTyping = false;
  private currentText = "";
  private textX = 0;
  private textY = 0;
  private fontSize = 20;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  setZoomCallback(callback: (zoom: number) => void) {
    this.onZoomChange = callback;
  }

  getMousePos(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    // Convert screen coordinates to canvas coordinates
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    // Convert screen coordinates to drawing coordinates
    return {
      x: (screenX - this.offsetX) / this.scale,
      y: (screenY - this.offsetY) / this.scale,
    };
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mousedown);
    this.canvas.removeEventListener("mouseup", this.mouseup);
    this.canvas.removeEventListener("mousemove", this.mousemove);
    this.canvas.removeEventListener("wheel", this.handleZoom);
    this.canvas.removeEventListener("mousedown", this.startPan);
    this.canvas.removeEventListener("mousemove", this.panCanvas);
    this.canvas.removeEventListener("mouseup", this.endPan);
    this.canvas.removeEventListener("mouseleave", this.endPan);
    window.removeEventListener("keydown", this.handleKeyPress);
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  setColour(colour: string) {
    this.colour = colour;
  }

  initHandlers() {
    this.socket.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape);
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = "#121212";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.setTransform(
      this.scale,
      0,
      0,
      this.scale,
      this.offsetX,
      this.offsetY
    );

    this.existingShapes.forEach((shape) => {
      this.ctx.strokeStyle = shape.color;

      if (shape.type === "rect") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centreX,
          shape.centreY,
          shape.radius,
          0,
          2 * Math.PI
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "pencil") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "text") {
        this.ctx.font = `${shape.fontSize}px Arial`;
        this.ctx.fillStyle = shape.color;
        this.ctx.fillText(shape.content, shape.x, shape.y);
      }
    });

    if (this.isTyping) {
      this.ctx.font = `${this.fontSize}px Arial`;
      this.ctx.fillStyle = this.colour;
      this.ctx.fillText(this.currentText + "|", this.textX, this.textY);
    }
  }

  mousedown = (e: MouseEvent) => {
    if (e.button !== 0) return;
    if (this.isPanning) return;
    const pos = this.getMousePos(e);
    this.isDrawing = true;
    this.startX = pos.x;
    this.startY = pos.y;

    if (this.selectedTool === "Text") {
      this.isTyping = true;
      this.currentText = "";
      this.textX = pos.x;
      this.textY = pos.y;
      this.clearCanvas();
    } else if (this.selectedTool === "Freehand") {
      this.isTyping = false;
      this.existingShapes.push({
        type: "pencil",
        points: [{ x: pos.x, y: pos.y }],
        color: this.colour,
      });
    } else {
      this.isTyping = false;
    }
  };

  mouseup = (e: MouseEvent) => {
    if (!this.isDrawing) return;
    if (this.isPanning) return;
    this.isDrawing = false;

    const pos = this.getMousePos(e);
    const width = pos.x - this.startX;
    const height = pos.y - this.startY;

    let shape: Shape | null = null;

    if (this.selectedTool === "Rectangle") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width,
        height,
        color: this.colour,
      };
    }

    if (this.selectedTool === "Circle") {
      shape = {
        type: "circle",
        centreX: this.startX,
        centreY: this.startY,
        radius: Math.sqrt(width ** 2 + height ** 2),
        color: this.colour,
      };
    }

    if (this.selectedTool === "Freehand") {
      const lastShape = this.existingShapes[this.existingShapes.length - 1];
      if (lastShape && lastShape.type === "pencil") {
        this.socket.send(
          JSON.stringify({
            type: "chat",
            message: JSON.stringify(lastShape),
            roomId: this.roomId,
          })
        );
      }
      return;
    }

    if (!shape) return;

    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify(shape),
        roomId: this.roomId,
      })
    );
  };

  mousemove = (e: MouseEvent) => {
    if (!this.isDrawing) return;
    if (this.isPanning) return;

    const pos = this.getMousePos(e);

    // Calculate width and height in the transformed coordinate system
    const width = pos.x - this.startX;
    const height = pos.y - this.startY;

    // Clear and apply transformation
    this.clearCanvas();

    // No need to reset transform as clearCanvas already sets it correctly
    this.ctx.strokeStyle = this.colour;

    if (this.selectedTool === "Rectangle") {
      this.ctx.strokeRect(this.startX, this.startY, width, height);
    }

    if (this.selectedTool === "Circle") {
      const radius = Math.sqrt(width ** 2 + height ** 2);
      this.ctx.beginPath();
      this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.closePath();
    }

    if (this.selectedTool === "Freehand") {
      const lastShape = this.existingShapes[this.existingShapes.length - 1];
      if (lastShape && lastShape.type === "pencil") {
        lastShape.points.push({ x: pos.x, y: pos.y });
      }
    }

    // Reset transform after drawing
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  query = async (prompt: string) => {
    const response = await query(prompt, this.roomId);
    if (response === "Incorrect prompt") {
      alert("Incorrect prompt");
      return;
    }
    const shapes = JSON.parse(response as string);

    shapes.forEach((shape: Shape) => {
      this.existingShapes.push(shape);
      this.socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify(shape),
          roomId: this.roomId,
        })
      );
      this.clearCanvas();
    });
  };

  handleKeyPress = (e: KeyboardEvent) => {
    if (!this.isTyping) return;

    if (e.key === "Enter") {
      // Save text shape and stop typing
      this.existingShapes.push({
        type: "text",
        x: this.textX,
        y: this.textY,
        content: this.currentText,
        color: this.colour,
        fontSize: this.fontSize,
      });

      // Send text over WebSocket
      this.socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({
            type: "text",
            x: this.textX,
            y: this.textY,
            content: this.currentText,
            color: this.colour,
            fontSize: this.fontSize,
          }),
          roomId: this.roomId,
        })
      );

      this.isTyping = false;
      this.currentText = "";
      this.clearCanvas();
    } else if (e.key === "Backspace") {
      this.currentText = this.currentText.slice(0, -1);
    } else {
      this.currentText += e.key;
    }

    this.clearCanvas();
  };

  handleZoom = (e?: WheelEvent | { deltaY: number }) => {
    let deltaY: number;
    if (e instanceof WheelEvent) {
      e.preventDefault();
      deltaY = e.deltaY;
    } else if (e && "deltaY" in e) {
      deltaY = e.deltaY;
    } else {
      return;
    }
    if (deltaY === 0) {
      this.clearCanvas();
      return;
    }

    const zoomFactor = 1.05;
    const scaleFactor = deltaY < 0 ? zoomFactor : 1 / zoomFactor;

    const mouseX = (this.canvas.width / 2 - this.offsetX) / this.scale;
    const mouseY = (this.canvas.height / 2 - this.offsetY) / this.scale;

    this.scale *= scaleFactor;
    this.offsetX = this.canvas.width / 2 - mouseX * this.scale;
    this.offsetY = this.canvas.height / 2 - mouseY * this.scale;

    if (this.onZoomChange) {
      this.onZoomChange(Math.round(this.scale * 100));
    }

    this.clearCanvas();
  };

  startPan = (e: MouseEvent) => {
    if (e.button !== 1 || this.isPanning) return; // Middle mouse button only
    this.isPanning = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  };

  panCanvas = (e: MouseEvent) => {
    if (!this.isPanning) return;

    this.offsetX += e.clientX - this.lastX;

    this.offsetY += e.clientY - this.lastY;

    this.lastX = e.clientX;
    this.lastY = e.clientY;

    this.clearCanvas();
  };

  endPan = () => {
    this.isPanning = false;
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mousedown);
    this.canvas.addEventListener("mouseup", this.mouseup);
    this.canvas.addEventListener("mousemove", this.mousemove);
    this.canvas.addEventListener("wheel", this.handleZoom);
    this.canvas.addEventListener("mousedown", this.startPan);
    this.canvas.addEventListener("mousemove", this.panCanvas);
    this.canvas.addEventListener("mouseup", this.endPan);
    this.canvas.addEventListener("mouseleave", this.endPan);
    window.addEventListener("keydown", this.handleKeyPress);
  }
}
