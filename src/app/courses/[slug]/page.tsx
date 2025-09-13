"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type Note = {
  id: string;
  title: string;
  file_url?: string | null;
  content?: string | null;
  user_id: string;
  created_at: string;
  storage_path?: string | null;
};

export default function CoursePage() {
  const { slug } = useParams<{ slug: string | string[] }>();
  const slugStr = useMemo(
    () => (typeof slug === "string" ? slug : Array.isArray(slug) ? slug[0] : ""),
    [slug]
  );

  const router = useRouter();
  const { user, loading } = useAuth();

  const [mode, setMode] = useState<"pdf" | "text">("pdf");
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/");
  }, [user, loading, router]);

  // Fetch notes (stable reference for eslint)
  const fetchNotes = useCallback(async () => {
    if (!slugStr) return;
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("course_slug", slugStr)
      .order("created_at", { ascending: false });

    if (!error && data) setNotes(data as Note[]);
  }, [slugStr]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please give your note a title!");
      return;
    }

    try {
      setSubmitting(true);

      if (mode === "pdf") {
        if (!pdfFile) {
          alert("Please select a PDF file.");
          return;
        }
        if (pdfFile.type !== "application/pdf") {
          alert("Only PDF files are allowed.");
          return;
        }
        if (pdfFile.size > MAX_FILE_SIZE) {
          alert("File too large! Max size is 10MB.");
          return;
        }

        // Upload PDF to Supabase Storage
        const filePath = `${user.id}/${slugStr}/${crypto.randomUUID()}-${pdfFile.name}`;
        const { error: uploadError } = await supabase.storage.from("notes").upload(filePath, pdfFile);
        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage.from("notes").getPublicUrl(filePath);

        // Insert row in DB
        const { error: insertError } = await supabase.from("notes").insert({
          course_slug: slugStr,
          user_id: user.id,
          title: title.trim(),
          file_url: urlData.publicUrl,
          storage_path: filePath,
        });
        if (insertError) throw insertError;
      } else {
        if (!textContent.trim()) {
          alert("Please paste some text.");
          return;
        }
        const { error: insertError } = await supabase.from("notes").insert({
          course_slug: slugStr,
          user_id: user.id,
          title: title.trim(),
          content: textContent.trim(),
          storage_path: null,
          file_url: null,
        });
        if (insertError) throw insertError;
      }

      setTitle("");
      setPdfFile(null);
      setTextContent("");
      await fetchNotes();
      alert("Note uploaded successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(err);
      alert(`Something went wrong while uploading your note. ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (!error) fetchNotes();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <Link href="/courses" className="mb-4 inline-block text-sm text-purple-600 hover:underline">
          ← Back to courses
        </Link>

        <h1 className="mb-6 text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
          {slugStr.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </h1>

        {/* Upload Form */}
        <div className="grid gap-6 md:grid-cols-3">
          <section className="md:col-span-2 rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-purple-700">Upload a Note</h2>

            <label className="mb-1 block text-xs font-medium text-slate-600">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g. "Week 3 — Sorting Notes"'
              className="mb-3 w-full rounded-lg border border-purple-300 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 placeholder-slate-400"
            />

            {/* Mode toggle */}
            <div className="mb-4 flex gap-2 text-sm">
              <button
                type="button"
                onClick={() => setMode("pdf")}
                className={`rounded-md border px-3 py-1 transition ${
                  mode === "pdf" ? "border-purple-500 bg-purple-100 text-purple-700 font-medium" : "border-slate-300"
                }`}
              >
                PDF
              </button>
              <button
                type="button"
                onClick={() => setMode("text")}
                className={`rounded-md border px-3 py-1 transition ${
                  mode === "text" ? "border-purple-500 bg-purple-100 text-purple-700 font-medium" : "border-slate-300"
                }`}
              >
                Paste Text
              </button>
            </div>

            {mode === "pdf" ? (
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-slate-600">Upload PDF (max 10MB)</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer rounded-lg border border-purple-300 bg-purple-50 px-3 py-1.5 text-sm text-purple-700 hover:bg-purple-100">
                    Choose File
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  <span className="text-xs text-slate-500">
                    {pdfFile ? `${pdfFile.name} (${(pdfFile.size / 1024 / 1024).toFixed(1)} MB)` : "No file chosen"}
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
              onClick={handleSave}
              disabled={submitting}
              className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Note"}
            </button>
          </section>

          {/* Coming soon */}
          <aside className="rounded-xl border border-dashed border-purple-200 bg-purple-50/60 p-6 text-slate-600">
            <h3 className="text-base font-semibold text-purple-700">
              Create Topic <span className="text-xs text-slate-500">— coming soon</span>
            </h3>
            <p className="mt-2 text-sm">Organize notes into topics inside each course.</p>
          </aside>
        </div>

        {/* Notes list */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-purple-700">Notes</h2>

          {notes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-purple-200 bg-purple-50/50 p-6 text-center text-sm text-slate-600">
              No notes yet. Be the first to upload!
            </div>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li key={note.id} className="rounded-lg border bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-800">{note.title}</h4>
                    <span className="text-xs text-slate-500">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {note.file_url ? (
                    <a
                      href={note.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-xs text-purple-600 underline"
                    >
                      📄 View PDF
                    </a>
                  ) : (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{note.content}</p>
                  )}

                  {note.user_id === user.id && (
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="mt-2 text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
