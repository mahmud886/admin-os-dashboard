import { blogsService } from '@/lib/blogs-service';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Pencil } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  let blog = await blogsService.getBySlug(id);

  if (!blog && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    blog = await blogsService.getById(id);
  }

  if (!blog) {
    notFound();
  }

  return (
    <MainLayout breadcrumb={`SYSTEM CONSOLE / BLOGS / ${blog.title.toUpperCase()}`}>
      <div className="w-full max-w-none px-6 space-y-8">
        <div className="flex justify-between items-center">
          <Link href="/admin/blogs">
            <Button variant="ghost" className="pl-0 text-gray-400 hover:text-teal-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO LOGS
            </Button>
          </Link>
          <Link href={`/admin/blogs/${blog.id}/edit`}>
            <Button
              variant="outline"
              className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:text-teal-300"
            >
              <Pencil className="w-4 h-4 mr-2" />
              EDIT ENTRY
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-border bg-[#1a1a1a]">
            {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="object-cover w-full h-full" />}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex gap-2 mb-4">
                {blog.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-teal-500/20 backdrop-blur text-xs font-medium text-teal-400 border border-teal-500/30 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 shadow-black drop-shadow-lg">
                {blog.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-border pb-6">
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-teal-400" />
                {blog.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-teal-400" />
                {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>

          <div
            className="prose prose-invert prose-lg max-w-none prose-headings:text-teal-400 prose-a:text-teal-400 hover:prose-a:text-teal-300 prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </div>
    </MainLayout>
  );
}
