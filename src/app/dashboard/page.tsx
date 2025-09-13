"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Single redirect: only after auth has resolved
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-50 to-white text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="inline-flex items-baseline gap-0 font-extrabold text-xl">
            <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              StudyShare
            </span>
            <span className="text-slate-900">.AI</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100 transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-8 text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            👋 Welcome, {user.email?.split("@")[0] ?? "User"}!
          </h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {["DSA", "Discrete Math", "DBMS"].map((course) => (
              <div
                key={course}
                className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md hover:scale-[1.01] transition cursor-pointer"
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
            <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
              <h2 className="mb-2 text-lg font-semibold text-purple-600">Upload a Note</h2>
              <p className="text-sm text-slate-600">Upload a PDF or text note to any course.</p>
              <button className="mt-3 text-xs text-purple-600 underline hover:text-purple-700">
                Upload Note →
              </button>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
              <h2 className="mb-2 text-lg font-semibold text-purple-600">Create a Topic</h2>
              <p className="text-sm text-slate-600">
                Create a new topic to organize your notes. (Select a course first)
              </p>
              <button className="mt-3 text-xs text-purple-600 underline hover:text-purple-700 disabled:opacity-50">
                Create Topic →
              </button>
            </div>
          </div>

          {/* Recent activity */}
          <div className="mt-10 p-4 rounded-xl border border-dashed border-purple-200 bg-purple-50/50">
            <h2 className="mb-2 text-lg font-semibold text-purple-600">Resume where you left off</h2>
            <p className="text-sm text-slate-600">
              No recent activity yet. Start by selecting a course above!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
