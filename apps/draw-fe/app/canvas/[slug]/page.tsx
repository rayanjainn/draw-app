import { RoomCanvas } from "@/components/RoomCanvas";

export default async function CanvasInit({
  params,
}: {
  params: { slug: string };
}) {
  const roomId = (await params).slug;
  console.log(roomId);
  return <RoomCanvas roomId={roomId} />;
}
