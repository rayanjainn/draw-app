"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Plus, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/hooks/reduxHooks";
import { BACKEND_URL_PROD } from "@/config";

export const NewDrawingDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [join, setJoin] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    try {
      setIsLoading(true);
      axios.defaults.headers.common["Authorization"] = `${token}`;

      if (join) {
        router.push(`/canvas/${roomName}`);
      } else {
        await axios.post(`${BACKEND_URL_PROD}/room`, {
          name: roomName.trim(),
        });
        router.push(`/canvas/${roomName}`);
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setJoin(true);
        }}
        className="bg-violet-200 text-violet-900 px-4 py-2 rounded-lg hover:bg-violet-400 hover:text-white flex items-center gap-2"
      >
        <Users className="w-5 h-5" />
        Join Drawing
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        New Drawing
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-[35%] left-[40%] ] w-full max-w-md bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 z-50"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {join ? "Join Drawing" : "Create New Drawing"}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateRoom} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Enter drawing name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-transparent border border-[#3a3a3a] text-white rounded-lg hover:bg-[#2a2a2a]"
                    disabled={isLoading}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {join
                      ? isLoading
                        ? "Joining..."
                        : "Join"
                      : isLoading
                        ? "Creating..."
                        : "Create"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
