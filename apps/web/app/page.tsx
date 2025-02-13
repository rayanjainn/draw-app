"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [roomName, setRoomName] = useState<string>("");
  const router = useRouter();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div>
        <input
          style={{
            width: "300px",
            height: "50px",
            borderRadius: "10px",
            padding: "10px",
            margin: "10px",
          }}
          type="text"
          value={roomName}
          placeholder="Room Name"
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button
          style={{
            height: "50px",
            borderRadius: "10px",
            padding: "10px",
            margin: "10px",
          }}
          onClick={() => router.push(`/room/${roomName}`)}
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
