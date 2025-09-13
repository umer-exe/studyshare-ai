// src/app/courses/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient"; // when you switch to DB

type Course = { slug: string; name: string };

// Keep DB off for now
const USE_SUPABASE = false;

// ✅ Your 4 originals only
const HARDCODED: Course[] = [
  { slug: "dsa", name: "Data Structures & Algorithms" },
  { slug: "discrete-math", name: "Discrete Math" },
  { slug: "dbms", name: "Database Management Systems" },
  { slug: "diff-eq", name: "Differential Equations" },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(HARDCODED);
  const [loading, setLoading] = useState<boolean>(USE_SUPABASE);

  useEffect(() => {
    if (!USE_SUPABASE) return;

    const load = async () => {
      setLoading(true);
      // const { data, error } = await supabase.from("courses").select("slug,name").order("name");
      // if (error) {
      //   console.error(error);
      //   setCourses(HARDCODED);
      // } else {
      //   setCourses((data ?? []).map((c: any) => ({ slug: c.slug, name: c.name })));
      // }
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p>Loading courses…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
        Courses
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((c) => (
          <Link
            key={c.slug}
            href={`/courses/${c.slug}`}
            className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-purple-600">{c.name}</h2>
            <p className="text-xs text-slate-500">View course →</p>
          </Link>
        ))}
      </div>

      {!USE_SUPABASE && (
        <p className="mt-6 text-xs text-slate-500">
          (Using hardcoded list for now. We’ll switch to Supabase later.)
        </p>
      )}
    </div>
  );
}
