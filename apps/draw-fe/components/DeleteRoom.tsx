"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Trash, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

export function DeleteRoom({
  roomId,
  deleteRoom,
}: {
  roomId: string;
  deleteRoom: (roomId: string) => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {/* Delete button */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-red-400 hover:text-red-500 transition-colors"
      >
        <Trash className="w-5 h-5" />
      </button>

      {isOpen &&
        createPortal(
          <AnimatePresence>
            <>
              {/* Fullscreen Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/50 z-50"
              />

              {/* Centered Modal (Now outside of any `relative` div) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 flex items-center justify-center z-50"
              >
                <div className="w-full max-w-md bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 shadow-lg">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">
                      Delete Room
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

                  <p className="text-gray-400 text-sm mb-4">
                    Are you sure you want to delete this room?
                  </p>

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
                      type="button"
                      className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                      onClick={async () => {
                        setIsLoading(true);
                        await deleteRoom(roomId);
                        setIsOpen(false);
                        setIsLoading(false);
                      }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

export default DeleteRoom;
