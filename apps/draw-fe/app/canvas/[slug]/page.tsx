import { RoomCanvas } from "@/components/RoomCanvas";

export default async function CanvasInit({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const roomId = (await params).slug;
  console.log(roomId);
  return <RoomCanvas roomId={roomId} />;
}
