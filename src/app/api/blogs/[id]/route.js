import { blogsService } from '@/lib/blogs-service';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const blog = await blogsService.getById(id);

  if (!blog) {
    return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  }

  return NextResponse.json(blog);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const updatedBlog = await blogsService.update(id, data);

    if (!updatedBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(updatedBlog);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const success = await blogsService.delete(id);

  if (!success) {
    return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Blog deleted successfully' });
}
