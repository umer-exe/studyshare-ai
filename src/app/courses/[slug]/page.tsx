"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Course = { id: string; name: string };

export default function CoursePage() {
  const params = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    supabase
      .from("courses")
      .select("id, name")
      .eq("slug", params.slug)
      .single()
      .then(({ data }) => setCourse(data ?? null));
  }, [params.slug]);

  if (!course) return <div className="p-8">Loading...</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-purple-700">{course.name}</h1>
      <p className="text-slate-600">Topics and notes will be displayed here.</p>
    </div>
  );
}
