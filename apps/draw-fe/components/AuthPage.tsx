"use client";

import { useState } from "react";
import { Shapes, Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { BACKEND_URL_PROD } from "@/config";
import { useRouter } from "next/navigation";
import ThreeBodyLoader from "./Loader";
import { setLoading, setToken, setUser } from "@/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { motion } from "framer-motion";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const signin = async (email: string, password: string) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post(`${BACKEND_URL_PROD}/signin`, {
        email,
        password,
      });
      const token = response.data.token;
      dispatch(setToken(token));
      dispatch(setUser(response.data.user));
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    dispatch(setLoading(true));
    try {
      await axios.post(`${BACKEND_URL_PROD}/signup`, {
        email,
        password,
        name,
      });
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignin) {
      await signin(email, password);
      router.push("/dashboard");
    } else {
      await signup(email, password, name);
      router.push("/signin");
    }
  };

  if (loading)
    return (
      <div className="h-screen bg-[#121212] flex flex-col items-center justify-center">
        <ThreeBodyLoader />
      </div>
    );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center px-4"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full space-y-8 bg-gray-800/50 p-8 rounded-xl border border-gray-700"
      >
        <motion.div className="text-center" variants={itemVariants}>
          <motion.div className="flex justify-center" variants={logoVariants}>
            <Shapes className="h-12 w-12 text-violet-500" />
          </motion.div>
          <motion.h2
            className="mt-4 text-3xl font-bold text-white"
            variants={itemVariants}
          >
            {isSignin ? "Welcome back" : "Create your account"}
          </motion.h2>
          <motion.p className="mt-2 text-gray-400" variants={itemVariants}>
            {isSignin
              ? "Sign in to continue to W-Draw"
              : "Start your journey with W-Draw"}
          </motion.p>
        </motion.div>
        <motion.form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          variants={containerVariants}
        >
          {!isSignin && (
            <motion.div variants={itemVariants}>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-700/50 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Name"
                />
              </div>
            </motion.div>
          )}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700/50 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700/50 block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <motion.button
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              {isSignin ? "Sign in" : "Create account"}
            </motion.button>
          </motion.div>
        </motion.form>
        <motion.div className="text-center" variants={itemVariants}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={isSignin ? "/signup" : "/signin"}
              className="text-violet-400 hover:text-violet-300 text-sm"
            >
              {isSignin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
