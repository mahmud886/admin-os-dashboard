import { blogsService } from '@/lib/blogs-service';
import { NextResponse } from 'next/server';

export async function GET() {
  const blogs = await blogsService.getAll();
  return NextResponse.json(blogs);
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

    const newBlog = await blogsService.create(data);
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
