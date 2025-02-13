import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChatRoom } from "../../../components/ChatRoom";

async function getRoom(slug: string) {
  try {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
    return response.data.room.id;
  } catch (error) {
    console.error(error);
  }
}

export default async function ChatRoomPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const slug = (await params).slug;
  const roomId = await getRoom(slug);

  return <ChatRoom id={roomId} />;
}
