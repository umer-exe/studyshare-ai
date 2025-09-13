import { supabase } from "@/lib/supabaseClient";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

type UploadParams =
  | {
      mode: "pdf";
      userId: string;
      courseSlug: string;
      title: string;
      pdfFile: File;
    }
  | {
    mode: "text";
    userId: string;
    courseSlug: string;
    title: string;
    textContent: string;
  };

export async function uploadNote(params: UploadParams): Promise<{ ok: boolean; message?: string }> {
  try {
    if (params.mode === "pdf") {
      const { pdfFile, title, userId, courseSlug } = params;

      if (pdfFile.type !== "application/pdf") {
        return { ok: false, message: "Only PDF files are allowed." };
      }
      if (pdfFile.size > MAX_FILE_SIZE) {
        return { ok: false, message: "File too large! Max size is 10MB." };
      }

      const filePath = `${userId}/${courseSlug}/${crypto.randomUUID()}-${pdfFile.name}`;
      const { error: uploadError } = await supabase.storage.from("notes").upload(filePath, pdfFile);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("notes").getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("notes").insert({
        course_slug: courseSlug,
        user_id: userId,
        title: title.trim(),
        file_url: urlData.publicUrl,
        storage_path: filePath,
      });
      if (insertError) throw insertError;

      return { ok: true };
    }

    // mode === "text"
    const { textContent, title, userId, courseSlug } = params;
    const content = textContent.trim();
    if (!content) {
      return { ok: false, message: "Please paste some text." };
    }

    const { error: insertError } = await supabase.from("notes").insert({
      course_slug: courseSlug,
      user_id: userId,
      title: title.trim(),
      content,
      storage_path: null,
      file_url: null,
    });
    if (insertError) throw insertError;

    return { ok: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message };
  }
}
