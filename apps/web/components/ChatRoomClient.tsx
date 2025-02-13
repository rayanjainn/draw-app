"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../app/hooks/useSocket";

export function ChatRoomClient({
  chats,
  id,
}: {
  chats: { message: string }[];
  id: string;
}) {
  const { socket, loading } = useSocket();
  const [message, setMessage] = useState(chats);
  const [currentMessage, setCurrentMessage] = useState("");
  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join",
          roomId: id,
        })
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setMessage((prevMessages) => [
            ...prevMessages,
            { message: parsedData.message },
          ]);
        }
      };
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket, loading, id]);

  return (
    <div>
      {message.map((msg, idx) => (
        <div key={idx}>{msg.message}</div>
      ))}

      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button
        onClick={() =>
          socket?.send(
            JSON.stringify({
              type: "chat",
              message: currentMessage,
              roomId: id,
            })
          )
        }
      >
        Send Message
      </button>
    </div>
  );
}
