import {
  getAuthenticatedUser,
  createResponse,
  createErrorResponse,
} from "@/lib/db-helpers";
import { createClient } from "@/lib/supabase-server";

export async function POST(request) {
  const { user } = await getAuthenticatedUser();
  if (!user) return createErrorResponse("Unauthorized", 401);

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) return createErrorResponse("No file provided", 400);

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return createErrorResponse(
      "Invalid file type. JPEG, PNG, WebP, or GIF only.",
      400,
    );
  }

  // Kept well under Vercel's ~4.5MB serverless request body limit so
  // oversized files are rejected here with a clear message instead of the
  // platform returning a plain-text 413 that the client can't parse as JSON.
  const MAX_SIZE = 1 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return createErrorResponse("File too large. Max 1MB.", 400);
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { data, error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return createErrorResponse(uploadError.message, 500);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(data.path);

  return createResponse({ url: publicUrl });
}
