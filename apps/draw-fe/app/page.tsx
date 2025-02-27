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

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="h-screen">
        <nav className="fixed w-full bg-[#121212]/80 backdrop-blur-sm z-50 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Shapes className="w-8 h-8 text-violet-500" />
                <span className="text-xl font-bold text-white">W-Draw</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  href="#features"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Docs
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="/signin"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <section className="pt-44 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Collaborate and Create
                <span className="text-violet-500"> Together</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                A powerful collaborative drawing platform that brings your
                team&apos;s ideas to life. Sketch, design, and brainstorm in
                real-time with anyone, anywhere.
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  href={"/signin"}
                  className="bg-violet-600 text-white px-8 py-3 rounded-lg hover:bg-violet-700 transition-colors flex items-center"
                >
                  Get Started <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  href={"https://github.com/rayanjainn/draw-app"}
                  className="border border-gray-700 text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                >
                  <Github className="mr-2 w-4 h-4" /> GitHub
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-[#121212]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              <div className="p-6 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors border border-gray-700">
                <div className="w-12 h-12 bg-violet-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Pencil className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Intuitive Drawing Tools
                </h3>
                <p className="text-gray-400">
                  Powerful yet simple tools that make drawing and designing a
                  breeze.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors border border-gray-700">
                <div className="w-12 h-12 bg-violet-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Real-time Collaboration
                </h3>
                <p className="text-gray-400">
                  Work together with your team in real-time, seeing changes
                  instantly.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors border border-gray-700">
                <div className="w-12 h-12 bg-violet-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Easy Sharing
                </h3>
                <p className="text-gray-400">
                  Share your work with anyone through a simple link or embed it
                  anywhere.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="py-20 bg-violet-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to bring your ideas to life?
          </h2>
          <p className="text-violet-200 mb-8 max-w-2xl mx-auto">
            Join thousands of teams who&apos;re already using W-Draw to
            collaborate and create amazing things together.
          </p>
          <button className="bg-white text-violet-900 px-8 py-3 rounded-lg hover:bg-violet-100 transition-colors flex items-center mx-auto">
            Start Drawing Now <Zap className="ml-2 w-4 h-4" />
          </button>
        </div>
      </section>

      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Use Cases
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-400 transition-colors"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p>© 2024 W-Draw. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
