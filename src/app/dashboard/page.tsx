"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const user = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Redirect unauthenticated users to home
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/");
  }, [user, loading, router]);

  useEffect(() => setLoading(false), [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-base">Loading...</p>
      </div>
    );
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="/" className="inline-flex items-baseline gap-0 font-extrabold text-xl">
            <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              StudyShare
            </span>
            <span className="text-slate-900">.AI</span>
          </a>

          <button
            onClick={handleSignOut}
            className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main dashboard */}
      <main className="flex-1 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-3xl font-bold">
            👋 Welcome, {user.email.split("@")[0]}!
          </h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Course cards */}
            {["DSA", "Operating Systems", "DBMS", "Networks"].map((course) => (
              <div
                key={course}
                className="rounded-xl border bg-white p-5 shadow hover:shadow-md transition cursor-pointer"
              >
                <h2 className="mb-2 text-lg font-semibold text-purple-600">{course}</h2>
                <p className="text-sm text-slate-600">
                  Explore notes, upload resources, and ask AI for help in this course.
                </p>
                <button className="mt-3 text-xs text-purple-600 underline hover:text-purple-700">
                  Go to course →
                </button>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border bg-white p-5 shadow">
              <h2 className="mb-2 text-lg font-semibold text-purple-600">Upload a Note</h2>
              <p className="text-sm text-slate-600">Upload a PDF or text note to any course.</p>
              <button className="mt-3 text-xs text-purple-600 underline hover:text-purple-700">
                Upload Note →
              </button>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow">
              <h2 className="mb-2 text-lg font-semibold text-purple-600">Create a Topic</h2>
              <p className="text-sm text-slate-600">
                Create a new topic to organize your notes. (Select a course first)
              </p>
              <button className="mt-3 text-xs text-purple-600 underline hover:text-purple-700 disabled:opacity-50">
                Create Topic →
              </button>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="mb-3 text-lg font-semibold text-purple-600">Resume where you left off</h2>
            <p className="text-sm text-slate-600">No recent activity yet.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
