"use client";
import { WS_URL_DEV } from "@/config";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { token } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!token) return;
    const ws = new WebSocket(`${WS_URL_DEV}?token=${token}`);
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
