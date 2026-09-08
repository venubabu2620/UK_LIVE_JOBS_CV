import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { extractPdf, extractDocx } from "@/lib/resume-files";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const u = await requireUser();
    const form = await req.formData();
    const f = form.get("file");

    if (!(f instanceof File)) {
      return NextResponse.json({ error: "File required." }, { status: 400 });
    }

    if (f.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Maximum file size is 5MB." },
        { status: 400 }
      );
    }

    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(f.type)) {
      return NextResponse.json(
        { error: "Only PDF and DOCX are supported." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await f.arrayBuffer());

    const text =
      f.type === "application/pdf"
        ? await extractPdf(buffer)
        : await extractDocx(buffer);

    if (text.length < 80) {
      return NextResponse.json(
        { error: "Could not extract enough text." },
        { status: 400 }
      );
    }

    const path = `${(u as any).id}/${crypto.randomUUID()}-${f.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    )}`;

    const s = supabaseAdmin();

    const { error } = await s.storage
      .from(process.env.SUPABASE_RESUME_BUCKET || "private-resumes")
      .upload(path, buffer, {
        contentType: f.type,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const resume = await db.resume.create({
      data: {
        userId: (u as any).id,
        name: f.name,
        sourceText: text,
        storagePath: path,
        mimeType: f.type,
        isMaster: true,
      },
    });

    return NextResponse.json({
      resume: {
        id: resume.id,
        name: resume.name,
      },
    });
  } catch (e) {
    console.error("RESUME UPLOAD ERROR:", e);

    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : String(e),
      },
      { status: 500 }
    );
  }
}
