import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to migrate data." },
        { status: 401 },
      );
    }

    // Read local blogs.json
    const dataPath = path.join(process.cwd(), "src/data/blogs.json");
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { error: "No local data found to migrate." },
        { status: 404 },
      );
    }

    const fileContents = fs.readFileSync(dataPath, "utf8");
    const localBlogs = JSON.parse(fileContents);

    if (!localBlogs.length) {
      return NextResponse.json({ message: "Local data is empty." });
    }

    // Map data to Supabase schema (snake_case)
    // Note: We are omitting 'id' to let Supabase generate UUIDs,
    // OR we can try to use the existing IDs if they are valid UUIDs.
    // Since current IDs are like "blog_001", we should let Supabase generate new UUIDs
    // and rely on slugs for identity.
    const records = localBlogs.map((blog) => ({
      // id: blog.id, // Skip ID to let Supabase generate UUID
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt || "",
      content: blog.content,
      cover_image: blog.coverImage || null,
      tags: blog.tags || [],
      author: blog.author || "EdenStone",
      published_at: blog.publishedAt || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Insert into Supabase
    const results = [];
    const errors = [];

    for (const record of records) {
      // Check if exists by slug
      const { data: existing } = await supabase
        .from("blogs")
        .select("id")
        .eq("slug", record.slug)
        .single();

      if (existing) {
        // Update
        const { error } = await supabase
          .from("blogs")
          .update(record)
          .eq("id", existing.id);

        if (error) errors.push({ slug: record.slug, error: error.message });
        else results.push({ slug: record.slug, action: "updated" });
      } else {
        // Insert
        const { error } = await supabase.from("blogs").insert(record);

        if (error) errors.push({ slug: record.slug, error: error.message });
        else results.push({ slug: record.slug, action: "inserted" });
      }
    }

    return NextResponse.json({
      message: "Migration completed",
      results,
      errors,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
