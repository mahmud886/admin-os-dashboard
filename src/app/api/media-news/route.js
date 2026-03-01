import { mediaNewsService } from '@/lib/media-news-service';
import { NextResponse } from 'next/server';

export async function GET() {
  const news = await mediaNewsService.getAll();
  return NextResponse.json(news);
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.title || !data.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const newArticle = await mediaNewsService.create(data);
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error('Failed to create media news:', error);
    return NextResponse.json({ error: 'Failed to create media news' }, { status: 500 });
  }
}
