"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { COURSES } from "@/constants/courses";

export default function CoursesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Keep this page private like the dashboard
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white text-slate-800">
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-purple-600 hover:underline">
            ← Back to dashboard
          </Link>

          <div className="select-none font-extrabold">
            <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              StudyShare
            </span>
            <span className="text-slate-900">.AI</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
          📚 Browse Courses
        </h1>
        <p className="mt-2 mb-8 text-sm md:text-base text-slate-600">
          Select a course to view or upload notes.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c) => (
            <Link
              key={c.slug}
              href={`/courses/${c.slug}`}
              className="rounded-xl border bg-white p-6 text-center shadow-sm hover:shadow-md hover:scale-[1.02] transition"
            >
              <h2 className="text-lg font-semibold text-purple-600">{c.name}</h2>
              <span className="mt-2 block text-xs text-purple-600 underline">
                View course →
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-slate-500">
          More courses coming soon. You’ll be able to add new ones later.
        </p>
      </main>
    </div>
  );
}
