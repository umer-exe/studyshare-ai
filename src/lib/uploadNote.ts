// src/lib/uploadNote.ts
import { supabase } from "@/lib/supabaseClient";

type UploadArgs = {
  userId: string;           // auth.user.id
  courseSlug: string;       // e.g. "dsa"
  title: string;            // note title from input
  file?: File | null;       // optional PDF/TXT file
  text?: string | null;     // optional pasted text
};

export type NoteRow = {
  id: string;
  user_id: string;
  course_slug: string;
  title: string;
  content: string | null;
  file_url: string | null;
  created_at: string;
};

const MAX_FILE_MB = 10;
const ALLOWED_MIME = ["application/pdf", "text/plain"];

function sanitizeName(name: string) {
  // keep it simple; remove risky chars
  return name.replace(/[^\w.-]+/g, "_");
}

export async function uploadNoteToSupabase({
  userId,
  courseSlug,
  title,
  file,
  text,
}: UploadArgs): Promise<NoteRow> {
  if (!userId) throw new Error("You must be logged in.");
  if (!title || !courseSlug) throw new Error("Missing title or course.");

  // At least one of file or text must be provided
  if (!file && !text) {
    throw new Error("Please attach a file or paste some text.");
  }

  let fileUrl: string | null = null;
  let content: string | null = text ?? null;

  // If a file is provided, validate + upload
  if (file) {
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      throw new Error(`File too large. Max ${MAX_FILE_MB} MB.`);
    }
    if (!ALLOWED_MIME.includes(file.type)) {
      throw new Error("Only PDF or TXT files are allowed.");
    }

    const uuid = (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const cleanName = sanitizeName(file.name);
    // IMPORTANT: userId as the first path segment (for owner policies)
    const path = `${userId}/${courseSlug}/${uuid}-${cleanName}`;

    // Upload to storage
    const { error: uploadErr } = await supabase.storage
      .from("notes")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadErr) {
      throw new Error(`Upload failed: ${uploadErr.message}`);
    }

    // Get a public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("notes").getPublicUrl(path);

    fileUrl = publicUrl;
  }

  // Insert metadata into DB
  const { data, error } = await supabase
    .from("notes")
    .insert([
      {
        user_id: userId,
        course_slug: courseSlug,
        title,
        content,     // null if this is a PDF-only note
        file_url: fileUrl,
      },
    ])
    .select("*")
    .single();

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  return data as NoteRow;
}
