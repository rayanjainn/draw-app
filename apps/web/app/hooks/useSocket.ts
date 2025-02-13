import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNDdkYWQ1Yi1mOTk3LTQyZDktYTJmMi1hZWIyN2RhOTJjNjQiLCJpYXQiOjE3MzkzNjEwOTN9.60VB-RODTBP4EwmG8K9uKeWERA-FJO5pl9Tw6dPFvuw";

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return { socket, loading };
}
