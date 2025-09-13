"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const user = useAuth();

  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const previewCourses = [
    "Data Structures & Algorithms",
    "Operating Systems",
    "DBMS",
    "Computer Networks",
    "Discrete Math",
  ];

  useEffect(() => setLoading(false), [user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAuth = async () => {
    setError(null);
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-base">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-50 to-white text-slate-800">
      {/* Header */}
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/50 ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 py-3">
          <a href="/" className="inline-flex items-baseline gap-0 font-extrabold text-lg md:text-xl">
            <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              StudyShare
            </span>
            <span className="text-slate-900">.AI</span>
          </a>
          <p className="mt-1 text-xs text-slate-500">
            Your AI-powered study assistant & collaborative CS resource hub.
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 py-10">
        {!user && (
          <div className="mx-auto max-w-5xl">
            {/* Hero */}
            <div className="mb-9 text-center">
              <h1 className="pb-1 text-[2.6rem] md:text-5xl font-extrabold tracking-tight leading-[1.2] bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text text-transparent">
                Study Smarter. Share Better.
              </h1>
              <p className="mt-3 text-[15px] md:text-lg text-slate-700">
                Learn faster with AI. Share and explore notes by course & topic.
              </p>
            </div>

            {/* Features */}
            <div className="mb-6 grid gap-5 md:grid-cols-2">
              <div className="relative -rotate-1 rounded-xl border border-purple-200 bg-purple-50 p-5 shadow-sm">
                <span className="absolute -top-2 left-6 h-5 w-16 -rotate-3 rounded-sm bg-purple-200/70" />
                <h2 className="mb-1 text-lg font-extrabold text-purple-700">AI Study Assistant</h2>
                <p className="text-[15px] text-slate-600">
                  Summarize notes and generate quick quizzes — available after login.
                </p>
              </div>

              <div className="relative rotate-1 rounded-xl border border-fuchsia-200 bg-fuchsia-50 p-5 shadow-sm">
                <span className="absolute -top-2 left-6 h-5 w-16 rotate-2 rounded-sm bg-fuchsia-200/70" />
                <h2 className="mb-1 text-lg font-extrabold text-fuchsia-700">Shared Resource Bank</h2>
                <p className="mb-3 text-[15px] text-slate-600">
                  Explore which CS courses are available. Sign in to view and upload notes.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {previewCourses.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center rounded-full border border-fuchsia-200 bg-fuchsia-100 px-3 py-0.5 text-xs font-medium text-fuchsia-700"
                    >
                      {c}
                    </span>
                  ))}
                  <span className="inline-flex items-center rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-0.5 text-xs font-medium text-fuchsia-700">
                    …and more
                  </span>
                </div>
              </div>
            </div>

            <p className="mb-9 text-center text-[13px] text-slate-500">
              🔒 Sign in to access notes, upload your own, and use AI features.
            </p>

            {/* Auth Card */}
            <div className="mx-auto max-w-md rounded-xl bg-white p-7 shadow-md">
              <h3 className="mb-5 text-center text-[1.3rem] font-extrabold text-purple-700">
                {isLogin ? "Login" : "Create an Account"}
              </h3>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-3 w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm placeholder-slate-400 outline-none focus:ring-2 focus:ring-purple-400"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-3 w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm placeholder-slate-400 outline-none focus:ring-2 focus:ring-purple-400"
              />

              {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

              <button
                onClick={handleAuth}
                className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>

              <p
                onClick={() => setIsLogin(!isLogin)}
                className="mt-3 cursor-pointer text-center text-xs text-purple-600 hover:underline"
              >
                {isLogin ? "New here? Create an account" : "Already have an account? Login"}
              </p>
            </div>
          </div>
        )}

        {user && (
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-7 text-2xl font-bold">
              👋 Welcome back, {user.email.split("@")[0]}!
            </h1>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <h2 className="mb-1 text-lg font-semibold text-purple-600">
                  Step 1: Pick a Course
                </h2>
                <p className="mb-2 text-sm text-slate-600">
                  Start with any CS course — DSA, OS, DBMS, Networks.
                </p>
                <button className="text-xs text-purple-600 underline hover:text-purple-700">
                  View Courses →
                </button>
              </div>
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <h2 className="mb-1 text-lg font-semibold text-purple-600">
                  Step 2: Upload a Note
                </h2>
                <p className="mb-2 text-sm text-slate-600">
                  Upload your first PDF or text note and auto-extract content.
                </p>
                <button className="text-xs text-purple-600 underline hover:text-purple-700">
                  Upload Note →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} StudyShare.AI — Study smarter, share better.</p>
          <div className="flex gap-3">
            <a href="https://github.com/umer-exe" className="hover:text-slate-700">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/umer-malik28" className="hover:text-slate-700">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
