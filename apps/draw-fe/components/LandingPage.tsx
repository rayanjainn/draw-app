"use client";
import {
  Pencil,
  Users,
  Share2,
  Shapes,
  Zap,
  ChevronRight,
  Github,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Server-side animation setup
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const logoVariants = {
  initial: { rotate: -10, scale: 0.9 },
  animate: {
    rotate: 0,
    scale: 1,
  },
  transition: {
    type: "spring",
    stiffness: 260,
    damping: 20,
    repeat: Infinity,
    repeatType: "reverse",
    repeatDelay: 8,
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const featureCardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  hover: {
    scale: 1.05,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(107, 70, 193, 0.2)",
    borderColor: "#8B5CF6",
    transition: { type: "spring", stiffness: 400, damping: 20 },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 15 },
  },
  hover: {
    scale: 1.05,
    boxShadow:
      "0 10px 15px -3px rgba(139, 92, 246, 0.3), 0 4px 6px -2px rgba(139, 92, 246, 0.2)",
    transition: { type: "spring", stiffness: 500, damping: 10 },
  },
  tap: { scale: 0.95 },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="h-screen">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed w-full bg-[#121212]/80 backdrop-blur-sm z-50 border-b border-gray-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <motion.div
                  variants={logoVariants}
                  initial="initial"
                  animate="animate"
                >
                  <Shapes className="w-8 h-8 text-violet-500" />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-xl font-bold text-white"
                >
                  W-Draw
                </motion.span>
              </div>
              <motion.div
                className="hidden md:flex items-center space-x-8"
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={navItemVariants}>
                  <Link
                    href="#features"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default anchor behavior
                      document
                        .getElementById("features")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </motion.div>
                <motion.div variants={navItemVariants}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Docs
                  </Link>
                </motion.div>
                <motion.div variants={navItemVariants}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </motion.div>
                <motion.div variants={navItemVariants}>
                  <Link
                    href="/signin"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/signup"
                    className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.nav>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="pt-44 pb-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-6xl font-bold text-white mb-6"
              >
                Collaborate and Create
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-violet-500"
                >
                  {" "}
                  Together
                </motion.span>
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
              >
                A powerful collaborative drawing platform that brings your
                team&apos;s ideas to life. Sketch, design, and brainstorm in
                real-time with anyone, anywhere.
              </motion.p>
              <motion.div
                variants={stagger}
                className="flex justify-center space-x-4"
              >
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    href={"/signin"}
                    className="bg-violet-600 text-white px-8 py-3 rounded-lg hover:bg-violet-700 transition-colors flex items-center"
                  >
                    Get Started <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    href={"https://github.com/rayanjainn/draw-app"}
                    className="border border-gray-700 text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                  >
                    <Github className="mr-2 w-4 h-4" /> GitHub
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="features"
          className="py-20 bg-[#121212]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              <motion.div
                variants={featureCardVariants}
                whileHover="hover"
                className="p-6 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors border border-gray-700"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-violet-900/50 rounded-lg flex items-center justify-center mb-4"
                >
                  <Pencil className="w-6 h-6 text-violet-400" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Intuitive Drawing Tools
                </h3>
                <p className="text-gray-400">
                  Powerful yet simple tools that make drawing and designing a
                  breeze.
                </p>
              </motion.div>
              <motion.div
                variants={featureCardVariants}
                whileHover="hover"
                className="p-6 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors border border-gray-700"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-violet-900/50 rounded-lg flex items-center justify-center mb-4"
                >
                  <Users className="w-6 h-6 text-violet-400" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Real-time Collaboration
                </h3>
                <p className="text-gray-400">
                  Work together with your team in real-time, seeing changes
                  instantly.
                </p>
              </motion.div>
              <motion.div
                variants={featureCardVariants}
                whileHover="hover"
                className="p-6 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors border border-gray-700"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-violet-900/50 rounded-lg flex items-center justify-center mb-4"
                >
                  <Share2 className="w-6 h-6 text-violet-400" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Easy Sharing
                </h3>
                <p className="text-gray-400">
                  Share your work with anyone through a simple link or embed it
                  anywhere.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>

      <motion.section
        className="py-20 bg-violet-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-4"
          >
            Ready to bring your ideas to life?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-violet-200 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of teams who&apos;re already using W-Draw to
            collaborate and create amazing things together.
          </motion.p>
          <motion.div
            variants={{
              hover: {
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 20 },
              },
              tap: {
                scale: 0.95,
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover="hover"
            whileTap="tap"
          >
            <button className="bg-white text-violet-900 px-8 py-3 rounded-lg hover:bg-violet-100 transition-colors flex items-center mx-auto">
              Start Drawing Now
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Zap className="ml-2 w-4 h-4" />
              </motion.div>
            </button>
          </motion.div>
        </div>
      </motion.section>

      <motion.footer
        className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <motion.a
                    whileHover={{ x: 5, color: "#8B5CF6" }}
                    transition={{ type: "spring", stiffness: 400 }}
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Features
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ x: 5, color: "#8B5CF6" }}
                    transition={{ type: "spring", stiffness: 400 }}
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Pricing
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ x: 5, color: "#8B5CF6" }}
                    transition={{ type: "spring", stiffness: 400 }}
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Use Cases
                  </motion.a>
                </li>
              </ul>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <motion.a
                    whileHover={{ x: 5, color: "#8B5CF6" }}
                    transition={{ type: "spring", stiffness: 400 }}
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Documentation
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ x: 5, color: "#8B5CF6" }}
                    transition={{ type: "spring", stiffness: 400 }}
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Tutorials
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ x: 5, color: "#8B5CF6" }}
                    transition={{ type: "spring", stiffness: 400 }}
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Blog
                  </motion.a>
                </li>
              </ul>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <motion.a
                    whileHover={{ x: 5, color: "#8B5CF6" }}
                    transition={{ type: "spring", stiffness: 400 }}
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    About
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ x: 5, color: "#8B5CF6" }}
                    transition={{ type: "spring", stiffness: 400 }}
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Careers
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ x: 5, color: "#8B5CF6" }}
                    transition={{ type: "spring", stiffness: 400 }}
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Contact
                  </motion.a>
                </li>
              </ul>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <motion.a
                    whileHover={{ x: 5, color: "#8B5CF6" }}
                    transition={{ type: "spring", stiffness: 400 }}
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Privacy
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ x: 5, color: "#8B5CF6" }}
                    transition={{ type: "spring", stiffness: 400 }}
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Terms
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ x: 5, color: "#8B5CF6" }}
                    transition={{ type: "spring", stiffness: 400 }}
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Security
                  </motion.a>
                </li>
              </ul>
            </motion.div>
          </motion.div>
          <motion.div
            className="mt-12 pt-8 border-t border-gray-800 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p>© 2024 W-Draw. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
