"use client";
import ThreeBodyLoader from "./Loader";
import { useEffect } from "react";
import { Canvas } from "./Canvas";
import { useSocket } from "@/hooks/useSocket";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const { socket, loading } = useSocket();

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join",
          roomId: roomId,
        })
      );
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket, loading, roomId]);

  if (!socket || loading) {
    return (
      <div className="h-screen bg-[#121212] flex flex-col items-center justify-center">
        <ThreeBodyLoader />;
      </div>
    );
  }
  return <Canvas roomId={roomId} socket={socket} />;
}
