import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Hand,
  Square,
  Circle,
  MousePointer2,
  Type,
  Pencil,
  Image as ImageIcon,
  Eraser,
  Menu,
  Shield,
  ChevronUp,
  Minus,
  Plus,
  PanelLeftOpen,
} from "lucide-react";
import { Game } from "@/draw/Game";
import { useRouter } from "next/navigation";

export type Tool =
  | "Select"
  | "Rectangle"
  | "Circle"
  | "Text"
  | "Freehand"
  | "Image";

const tools = [
  { icon: MousePointer2, name: "Select" },
  { icon: Square, name: "Rectangle" },
  { icon: Circle, name: "Circle" },
  { icon: Type, name: "Text" },
  { icon: Pencil, name: "Freehand" },
  { icon: ImageIcon, name: "Image" },
  { icon: Eraser, name: "Eraser" },
] as const;

const colors = [
  "#ffffff", // White
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#ec4899", // Pink
];

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<Tool>("Freehand");
  const [colour, setColour] = useState("#ffffff");
  const [zoom, setZoom] = useState(100);
  const [showTopBar, setShowTopBar] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [game, setGame] = useState<Game | null>(null);
  // const queryRef = useRef<HTMLTextAreaElement>(null);
  // const [promptLoading, setPromptLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (game) {
      game.setTool(activeTool);
      game.setColour(colour);
    }
  }, [activeTool, game, colour]);

  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      const resizeCanvas = () => {
        const container = containerRef.current;
        if (container && canvasRef.current) {
          canvasRef.current.width = container.clientWidth;
          canvasRef.current.height = container.clientHeight;
        }
      };
      const g = new Game(canvasRef.current, roomId, socket);

      g.setZoomCallback((zoom) => {
        setZoom(zoom);
      });

      setGame(g);

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        g.destroy();
        setGame(null);
      };
    }
  }, [canvasRef, socket, roomId]);

  return (
    <div className="h-screen bg-[#121212] flex flex-col">
      {/* Toggle Top Bar Button */}
      <AnimatePresence>
        {!showTopBar && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-[45%] z-50 bg-violet-600 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 hover:bg-violet-700"
            onClick={() => setShowTopBar(true)}
          >
            <ChevronUp className="w-4 h-4" />
            Show Toolbar
          </motion.button>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      {/* <AnimatePresence>
        {showTopBar && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#1a1a1a] border-b border-[#2a2a2a] overflow-hidden"
          >
            <div className="py-3 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg"
                  >
                    <Menu className="w-6 h-6" />
                  </motion.button>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg flex items-center gap-2"
                    >
                      <FolderOpen className="w-4 h-4" />
                      Open
                    </motion.button>
                  </div>
                </div>

                <div className="flex-1 max-w-lg mx-auto">
                  <div className="text-gray-400 text-sm text-center px-4 py-2 bg-gray-800/50 rounded-lg">
                    Hold mouse wheel or spacebar while dragging to move canvas
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Collaborate
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTopBar(false)}
                    className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-[#1a1a1a] border-r border-[#2a2a2a] overflow-hidden"
            >
              <div className="p-4">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Library
                </h2>
                <div className="space-y-2">
                  {["Recent", "Shared", "Templates", "Trash"].map((item) => (
                    <motion.button
                      key={item}
                      whileHover={{ x: 4 }}
                      className="w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Canvas */}
        <div ref={containerRef} className="flex-1 relative">
          <canvas ref={canvasRef} className="absolute inset-0 bg-[#121212]" />
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSidebar(!showSidebar)}
          className={`fixed ${showSidebar ? "left-36" : "left-10"} top-3 p-2 text-gray-400 rounded-lg transition-all duration-300`}
        >
          <Menu className="w-6 h-6" />
        </motion.button>

        {/* Centered Top Toolbar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed left-[30%] top-4 p-2 flex items-center bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] shadow-lg overflow-hidden"
        >
          <motion.div className="flex gap-2">
            {tools.map((tool) => (
              <motion.button
                key={tool.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTool(tool.name as Tool)}
                className={`p-2 ${
                  activeTool === tool.name
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                } rounded`}
                title={tool.name}
              >
                <tool.icon className="w-5 h-5" />
              </motion.button>
            ))}
          </motion.div>

          {/*colour palete and set colour */}
          <motion.div className="flex pl-2 gap-2">
            {colors.map((color, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setColour(color)}
                className={`p-2 ${colour === color ? "bg-violet-600" : "hover:bg-gray-800"} text-gray-400  rounded`}
              >
                <Circle
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: color }}
                />
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            socket.send(
              JSON.stringify({
                type: "leave",
                roomId: roomId,
              })
            );
            router.push("/dashboard");
          }}
          className={`fixed right-10 top-3 p-2 text-gray-400 rounded-lg transition-all duration-300`}
        >
          <PanelLeftOpen className="w-6 h-6" />
        </motion.button>

        {/* Text Input Positioned Directly on the Canvas */}
        {/* <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <textarea
            className="w-[40vw] bg-transparent text-white text-sm rounded-lg p-3 border border-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-violet-600 resize-none shadow-lg"
            placeholder="Type a message..."
            rows={2}
            ref={queryRef}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 bottom-2 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
            disabled={promptLoading}
            onClick={async () => {
              setPromptLoading(true);
              const message = queryRef.current?.value.trim();
              if (message) {
                await game?.query(message);
              }
              if (queryRef.current) {
                queryRef.current.value = "";
              }
              setPromptLoading(false);
            }}
          >
            {promptLoading ? <div>...</div> : <Send className="w-5 h-5" />}
          </motion.button>
        </div> */}

        {/* Bottom Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 h-12 bg-[#1a1a1a] border-t border-[#2a2a2a] flex items-center justify-between px-4"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:bg-gray-800 rounded"
            >
              <Lock className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:bg-gray-800 rounded"
              onClick={() => {
                if (game) {
                  game.isPanning = !game.isPanning;
                }
              }}
            >
              <Hand className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 text-gray-400 hover:bg-gray-800 rounded"
              onClick={() => {
                if (game) {
                  game.handleZoom({ deltaY: 100 });
                  const newZoom = Number((100 * game.scale).toFixed(0));
                  setZoom(newZoom);
                }
              }}
            >
              <Minus className="w-4 h-4" />
            </motion.button>

            <div
              className="text-gray-400 text-sm w-16 text-center cursor-pointer"
              onClick={() => {
                if (game) {
                  game.offsetX = 0;
                  game.offsetY = 0;
                  game.scale = 1;
                  game.handleZoom({ deltaY: 0 });
                  setZoom(100);
                }
              }}
              title="Reset zoom"
            >
              {zoom}%
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 text-gray-400 hover:bg-gray-800 rounded"
              onClick={() => {
                if (game) {
                  game.handleZoom({ deltaY: -100 });
                  const newZoom = Number((100 * game.scale).toFixed(0));
                  setZoom(newZoom);
                }
              }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:bg-gray-800 rounded"
            >
              <Shield className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
