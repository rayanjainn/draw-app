import { RoomCanvas } from "@/components/RoomCanvas";
import axios from "axios";

export default async function CanvasInit({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const roomName = (await params).slug;
  const room = await axios.get(`http://localhost:3001/room/${roomName}`);
  return <RoomCanvas roomId={room.data.room.id} />;
}
