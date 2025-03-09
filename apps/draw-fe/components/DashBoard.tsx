"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { NewDrawingDialog } from "./Dialog";
import { BACKEND_URL_DEV, FE_URL_DEV } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { clearToken, setLoading, setUser } from "@/redux/authSlice";
import ThreeBodyLoader from "./Loader";
import Sidebar from "./Sidebar";
import DeleteRoom from "./DeleteRoom";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

type Room = {
  id: string;
  slug: string;
  createdAt: string;
  adminId: string;
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function Dashboard() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const dispatch = useAppDispatch();
  const { user, loading, token } = useAppSelector((state) => state.auth);

  const setDashboard = async () => {
    if (!token) {
      router.push("/signin");
      return;
    }
    try {
      if (user?.name === "") {
        const user = await axios.get(`${BACKEND_URL_DEV}/me`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        dispatch(setUser(user.data.user));
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(setLoading(true));
    getRooms(token).then((rooms) => setRooms(rooms));
    dispatch(setLoading(false));
  };

  const logout = () => {
    dispatch(setLoading(true));
    dispatch(clearToken());
    dispatch(setUser(null));
    dispatch(setLoading(false));
    router.push("/signin");
  };

  const deleteRoom = async (roomId: string) => {
    dispatch(setLoading(true));
    try {
      await axios.delete(`${BACKEND_URL_DEV}/room/${roomId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setRooms((prevRooms) => prevRooms.filter((r) => r.id !== roomId));
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
    }
  };

  const getRooms = async (token: string) => {
    const response = await axios.get(`${BACKEND_URL_DEV}/rooms`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data.rooms;
  };

  const dateToString = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();

    const time = `${hours}:${minutes}:${seconds}`;
    return `${day} ${months[month]} ${year}, ${time}`;
  };

  useEffect(() => {
    setDashboard();
  }, []);

  if (loading)
    return (
      <div className="h-screen bg-[#121212] flex flex-col items-center justify-center">
        <ThreeBodyLoader />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#121212] flex">
      {/* Sidebar */}
      <Sidebar onClick={logout} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div className="text-3xl font-semibold text-white mb-4 ">
              Welcome <span className="text-violet-500">{user?.name}</span>
            </div>
            <div className="flex items-center gap-5">
              <NewDrawingDialog />
            </div>
          </div>

          {/* Recently Viewed */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4">
              Your Drawings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden cursor-pointer group"
                >
                  <div
                    className="relative w-full h-[200px] overflow-hidden"
                    onClick={() => router.push(`/canvas/${room.slug}`)}
                  >
                    <iframe
                      src={`${FE_URL_DEV}/canvas/${room.slug}`}
                      className="w-full h-full"
                      style={{
                        width: "200%",
                        height: "200%",
                        transform: "scale(0.5)",
                        transformOrigin: "top left",
                        zoom: "0.5", //
                        border: "none",
                      }}
                    />
                    <div className="absolute inset-0  bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium">
                        Open Drawing
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex justify-between">
                    <div>
                      <div className="text-white font-bold mb-1 text-xl">
                        {room.slug}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-md">
                          {dateToString(room.createdAt)}
                        </span>
                      </div>
                    </div>
                    <DeleteRoom roomId={room.id} deleteRoom={deleteRoom} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
