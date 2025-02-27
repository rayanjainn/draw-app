"use client";
import { WS_URL_PROD } from "@/config";
import { useEffect, useState } from "react";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const ws = new WebSocket(`${WS_URL_PROD}?token=${token}`);
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };

    return () => {
      ws.close();
      setSocket(null);
      setLoading(true);
    };
  }, []);

  return { socket, loading };
}
