import { BACKEND_URL } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId: string) {
  const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
  const chats = response.data.chats;

  const shapes = chats.map((ch: { message: string }) => {
    const chatData = JSON.parse(ch.message);
    return chatData;
  });

  return shapes;
}
