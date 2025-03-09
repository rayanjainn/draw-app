import { motion } from "framer-motion";
import { LogOut, Shapes } from "lucide-react";
import { Home, Users, Star, Clock, Settings } from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Users, label: "Shared with me", path: "/shared" },
  { icon: Star, label: "Starred", path: "/starred" },
  { icon: Clock, label: "Recent", path: "/recent" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="w-72 bg-[#1a1a1a] border-r border-[#2a2a2a] p-6"
    >
      <div className="flex items-center gap-2 mb-8">
        <Shapes className="w-8 h-8 text-violet-500" />
        <span className="text-xl font-bold text-white">W-Draw</span>
      </div>

      <div className="space-y-2">
        {sidebarItems.map((item) => (
          <motion.button
            key={item.label}
            whileHover={{ x: 4 }}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </motion.button>
        ))}
        <hr className="border-[#2a2a2a] my-4" />
        <motion.button
          whileHover={{ x: 4 }}
          onClick={onClick}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Sidebar;
