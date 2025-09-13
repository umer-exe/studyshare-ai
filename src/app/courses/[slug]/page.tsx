"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

// Map slugs to friendly names
const COURSE_NAME: Record<string, string> = {
  "dsa": "Data Structures & Algorithms",
  "discrete-math": "Discrete Math",
  "dbms": "Database Management Systems",
  "diff-eq": "Differential Equations",
};

type LocalNote = {
  id: string;
  title: string;
  type: "pdf" | "text";
  fileName?: string;
  content?: string;
  createdAt: string;
};

export default function CoursePage() {
  const { slug } = useParams<{ slug: string | string[] }>();
  const { user, loading } = useAuth();
  const router = useRouter();

  // Resolve slug as a string (handle array/undefined safely)
  const slugStr = useMemo(() => {
    if (typeof slug === "string") return slug;
    if (Array.isArray(slug)) return slug[0];
    return "";
  }, [slug]);

  // Pretty course name
  const prettyName = useMemo(() => {
    if (!slugStr) return "Course";
    return COURSE_NAME[slugStr] ??
      slugStr.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }, [slugStr]);

  // Auth gate
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/");
  }, [user, loading, router]);

  // Local MVP state
  const [mode, setMode] = useState<"pdf" | "text">("pdf");
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState("");
  const [notes, setNotes] = useState<LocalNote[]>([]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleSaveLocal = () => {
    if (!title.trim()) {
      alert("Please add a title.");
      return;
    }
    if (mode === "pdf" && !pdfFile) {
      alert("Please choose a PDF file.");
      return;
    }
    if (mode === "text" && !textContent.trim()) {
      alert("Please paste some text.");
      return;
    }

    const newNote: LocalNote = {
      id: crypto.randomUUID(),
      title: title.trim(),
      type: mode,
      fileName: mode === "pdf" ? pdfFile?.name : undefined,
      content: mode === "text" ? textContent.trim() : undefined,
      createdAt: new Date().toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setTitle("");
    setPdfFile(null);
    setTextContent("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <Link href="/courses" className="mb-4 inline-block text-sm text-purple-600 hover:underline">
          ← Back to courses
        </Link>

        {/* Heading */}
        <h1 className="mb-6 text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
          {prettyName}
        </h1>

        {/* Upload + Coming Soon */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Upload card */}
          <section className="md:col-span-2 rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-purple-700">Upload a Note</h2>

            <label className="mb-1 block text-xs font-medium text-slate-600">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g. "Week 3 — Sorting Notes"'
              className="mb-3 w-full rounded-lg border border-purple-300 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 placeholder-slate-400"
            />
            <p className="mb-3 text-xs text-purple-600">
              💡 Use a descriptive title — it helps others find your note quickly.
            </p>

            {/* Mode toggle */}
            <div className="mb-4 flex gap-2 text-sm">
              <button
                className={`rounded-md border px-3 py-1 transition ${
                  mode === "pdf"
                    ? "border-purple-500 bg-purple-100 text-purple-700 font-medium"
                    : "border-slate-300 bg-white"
                }`}
                onClick={() => setMode("pdf")}
              >
                PDF
              </button>
              <button
                className={`rounded-md border px-3 py-1 transition ${
                  mode === "text"
                    ? "border-purple-500 bg-purple-100 text-purple-700 font-medium"
                    : "border-slate-300 bg-white"
                }`}
                onClick={() => setMode("text")}
              >
                Paste Text
              </button>
            </div>

            {mode === "pdf" ? (
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Upload PDF
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer rounded-lg border border-purple-300 bg-purple-50 px-3 py-1.5 text-sm text-purple-700 hover:bg-purple-100">
                    Choose File
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <span className="text-xs text-slate-500">
                    {pdfFile ? pdfFile.name : "No file chosen"}
                  </span>
                </div>
              </div>
            ) : (
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={6}
                placeholder="Paste your note content here…"
                className="mb-4 w-full rounded-lg border border-purple-300 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 placeholder-slate-400"
              />
            )}

            <button
              onClick={handleSaveLocal}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700"
            >
              Save (MVP — local only)
            </button>

            <p className="mt-2 text-xs text-slate-500">
              (In the real version, we’ll upload PDFs to Supabase Storage and save note metadata to the database.)
            </p>
          </section>

          {/* Coming soon */}
          <aside className="rounded-xl border border-dashed border-purple-200 bg-purple-50/60 p-6 text-slate-600">
            <h3 className="text-base font-semibold text-purple-700">
              Create Topic <span className="text-xs text-slate-500">— coming soon</span>
            </h3>
            <p className="mt-2 text-sm">
              You’ll be able to organize notes into topics inside each course.
            </p>
            <button
              disabled
              className="mt-3 cursor-not-allowed rounded-md border border-slate-300 bg-slate-100 px-3 py-1 text-xs text-slate-400"
            >
              Create Topic (disabled)
            </button>
          </aside>
        </div>

        {/* Notes list */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-purple-700">Notes</h2>

          {notes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-purple-200 bg-purple-50/50 p-6 text-sm text-slate-600">
              No notes yet. Be the first to upload!
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((n) => (
                <div key={n.id} className="rounded-lg border bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-800">{n.title}</h4>
                    <span className="text-xs text-slate-500">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {n.type === "pdf" ? (
                    <p className="mt-2 text-xs text-slate-500">
                      PDF selected: <span className="font-medium">{n.fileName}</span>
                    </p>
                  ) : (
                    <p className="mt-2 line-clamp-3 text-sm text-slate-600">{n.content}</p>
                  )}

                  <div className="mt-3 flex gap-2">
                    <button className="rounded border px-2 py-1 text-xs hover:bg-slate-50">
                      Summarize
                    </button>
                    <button className="rounded border px-2 py-1 text-xs hover:bg-slate-50">
                      Generate Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
