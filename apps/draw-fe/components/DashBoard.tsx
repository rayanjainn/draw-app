"use client";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Star,
  Clock,
  Settings,
  LogOut,
  Plus,
  Shapes,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { NewDrawingDialog } from "./Dialog";
import { BACKEND_URL } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";

type Room = {
  id: string;
  slug: string;
  createdAt: string;
  adminId: string;
};

const getRooms = async (token: string) => {
  const response = await axios.get(`${BACKEND_URL}/rooms`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data.rooms;
};

const sidebarItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Users, label: "Shared with me", path: "/shared" },
  { icon: Star, label: "Starred", path: "/starred" },
  { icon: Clock, label: "Recent", path: "/recent" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Dashboard() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    getRooms(token).then((rooms) => setRooms(rooms));
  }, [rooms]);

  return (
    <div className="min-h-screen bg-[#121212] flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="w-72 bg-[#1a1a1a] border-r border-[#2a2a2a] p-6"
      >
        <div className="flex items-center gap-2 mb-8">
          <Shapes className="w-8 h-8 text-violet-500" />
          <span className="text-xl font-bold text-white">DrawFlow</span>
        </div>

        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ x: 4 }}
              onClick={() => router.push(item.path)}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </motion.button>
          ))}
          <hr className="border-[#2a2a2a] my-4" />
          <motion.button
            whileHover={{ x: 4 }}
            onClick={() => router.push("/signin")}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Your Drawings</h1>
            <div className="flex items-center gap-5">
              <NewDrawingDialog />
            </div>
          </div>

          {/* Recently Viewed */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4">
              Recently Viewed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => router.push(`/canvas/${room.id}`)}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden cursor-pointer group"
                >
                  <div className="relative w-full h-[200px] overflow-hidden">
                    <iframe
                      src={`http://localhost:3000/canvas/${room.id}`}
                      className="w-full h-full"
                      style={{
                        width: "200%",
                        height: "200%",
                        transform: "scale(0.5)",
                        transformOrigin: "top left",
                        zoom: "0.5", // 🔥 Alternative scaling for better fit
                        border: "none",
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium">
                        Open Drawing
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-white font-medium mb-1">{room.slug}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">
                        {room.createdAt}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* All Drawings */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              All Drawings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Similar grid as above, but with all drawings */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
