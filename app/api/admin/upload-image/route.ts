import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { supabaseAdmin } from "@/lib/supabase";
import { consume, clientIp } from "@/lib/rate-limit";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

const ALLOWED_FOLDERS = new Set(["previews", "architecture"]);

const UPLOAD_LIMIT = 30;
const UPLOAD_WINDOW_SECONDS = 600;

/**
 * POST /api/admin/upload-image
 *
 * multipart/form-data with two fields:
 *   • file    — the image (required, image/* under 5 MB)
 *   • folder  — "previews" | "architecture" (defaults to "previews")
 *
 * Returns { url, path } on success. URL is the public CDN URL ready to
 * store in demos.preview_image_url or demos.architecture_diagram_url.
 *
 * Auth: admin cookie required (proxy already gates the page but we
 * defense-in-depth at the route level too).
 */
export async function POST(req: NextRequest) {
  const unauth = await requireAdmin(req);
  if (unauth) return unauth;

  // Rate limit — admin shouldn't be uploading 100s/min
  const ip = clientIp(req);
  const rl = consume(`upload-image:ip:${ip}`, UPLOAD_LIMIT, UPLOAD_WINDOW_SECONDS);
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Too many uploads. Try again in ${Math.ceil(rl.resetSeconds / 60)} min.` },
      { status: 429 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart body" }, { status: 400 });
  }

  const file = form.get("file");
  const folder = String(form.get("folder") || "previews");

  if (!ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use PNG, JPG, WebP, GIF, SVG, or PDF." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: `File too large. Max ${Math.round(MAX_SIZE_BYTES / 1024 / 1024)} MB.` },
      { status: 400 }
    );
  }

  // Sanitize the filename — keep extension, strip anything weird.
  const original = file.name || "image";
  const ext = (original.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = original
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .slice(0, 50) || "image";
  const path = `${folder}/${Date.now()}-${base}.${ext || "png"}`;

  const arrayBuffer = await file.arrayBuffer();
  // Supabase JS accepts ArrayBuffer / Blob / File directly.
  const { error: uploadError } = await supabaseAdmin.storage
    .from("demo-assets")
    .upload(path, new Uint8Array(arrayBuffer), {
      contentType: file.type,
      upsert: false,
      cacheControl: "31536000", // 1 year — filenames are timestamped
    });

  if (uploadError) {
    // Full detail to Vercel logs
    console.error("storage upload failed:", {
      message: uploadError.message,
      name: uploadError.name,
      bucket: "demo-assets",
      path,
      contentType: file.type,
      size: file.size,
    });

    // Surface the actual error to the admin so they don't have to dig
    // through Vercel logs. Admin route — no PII risk.
    const msg = uploadError.message || "Upload failed";
    return NextResponse.json(
      {
        error: `Upload failed: ${msg}`,
        detail: {
          name: uploadError.name,
          bucket: "demo-assets",
          path,
          contentType: file.type,
        },
      },
      { status: 500 }
    );
  }

  const { data: pub } = supabaseAdmin.storage.from("demo-assets").getPublicUrl(path);
  return NextResponse.json({ url: pub.publicUrl, path });
}
