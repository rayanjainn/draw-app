"use client";

import { useState } from "react";
import { Shapes, Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { BACKEND_URL_PROD } from "@/config";
import { useRouter } from "next/navigation";
import ThreeBodyLoader from "./Loader";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isSignin) {
      const response = await axios.post(`${BACKEND_URL_PROD}/signin`, {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      setLoading(false);
      router.push("/dashboard");
    } else {
      await axios.post(`${BACKEND_URL_PROD}/signup`, {
        email,
        password,
        name,
      });
      setLoading(false);
      router.push("/signin");
    }
  };

  if (loading)
    return (
      <div className="h-screen bg-[#121212] flex flex-col items-center justify-center">
        <ThreeBodyLoader />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800/50 p-8 rounded-xl border border-gray-700">
        <div className="text-center">
          <div className="flex justify-center">
            <Shapes className="h-12 w-12 text-violet-500" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-white">
            {isSignin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-2 text-gray-400">
            {isSignin
              ? "Sign in to continue to W-Draw"
              : "Start your journey with W-Draw"}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isSignin && (
            <div>
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
                <input
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
            </div>
          )}
          <div>
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
              <input
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
          </div>
          <div>
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
              <input
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
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              {isSignin ? "Sign in" : "Create account"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link
            href={isSignin ? "/signup" : "/signin"}
            className="text-violet-400 hover:text-violet-300 text-sm"
          >
            {isSignin
              ? "Don&apos;t have an account? Sign up"
              : "Already have an account? Sign in"}
          </Link>
        </div>
      </div>
    </div>
  );
}
