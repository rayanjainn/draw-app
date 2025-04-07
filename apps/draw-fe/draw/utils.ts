import { BACKEND_URL_PROD } from "@/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const apikey = process.env.API_KEY as string;
const genAI = new GoogleGenerativeAI(apikey);

export async function getExistingShapes(roomId: string) {
  const response = await axios.get(`${BACKEND_URL_PROD}/chats/${roomId}`);
  const chats = response.data.chats;

  const shapes = chats.map((ch: { message: string }) => {
    const chatData = JSON.parse(ch.message);
    return chatData;
  });

  return shapes;
}

export async function query(data: string, roomId: string) {
  const existingShapes = await getExistingShapes(roomId);

  const prompt = `
    You are an AI that generates JSON shapes for a drawing application.
    The user gives a prompt, and you return only a JSON array with shapes.
    This is a drawing application. Below are the existing shapes on the canvas.
    Please analyze them and output only the new shapes for the given prompt.

    Existing shapes:
    ${JSON.stringify(existingShapes)}
    Place the new shape in empty regions of the canvas
    Shapes type : 
    { type: "rect"; x: number; y: number; width: number; height: number; color: string; },
    { type: "circle"; centreX: number; centreY: number; radius: number; color: string; },
    { type: "pencil"; points: { x: number; y: number }[]; color: string; };
    Output should be an array of shape objects in the SAME FORMAT as above.
    User Prompt: ${data}
    Ensure the response is ONLY a valid JSON array with NO extra text.
    Dont add new shapes, make with existing shapes only.
    Rules:
    - colour (default white)
    - Output only Array of JSON, no explanations.
    - If the prompt cannot be drawn, return: "Incorrect prompt".
    `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const response = await model.generateContent(prompt);
    const text = response.response.text();

    console.log(text);
    return text;
  } catch (error) {
    console.error("API Error:", error);
  }
}
