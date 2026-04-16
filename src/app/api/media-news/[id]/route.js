import { mediaNewsService } from "@/lib/media-news-service";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;
  const article = await mediaNewsService.getById(id);
  if (!article) {
    return NextResponse.json(
      { error: "Media news not found" },
      { status: 404 },
    );
  }
  return NextResponse.json(article);
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const updatedArticle = await mediaNewsService.update(id, data);
    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error("Failed to update media news:", error);
    return NextResponse.json(
      { error: "Failed to update media news" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const success = await mediaNewsService.delete(id);
  if (!success) {
    return NextResponse.json(
      { error: "Failed to delete media news" },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true });
}
