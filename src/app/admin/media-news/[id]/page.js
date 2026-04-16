import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { mediaNewsService } from "@/lib/media-news-service";
import { ArrowLeft, Calendar, Pencil, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MediaNewsDetailPage({ params }) {
  const { id } = await params;
  let article = await mediaNewsService.getBySlug(id);

  if (
    !article &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    article = await mediaNewsService.getById(id);
  }

  if (!article) {
    notFound();
  }

  return (
    <MainLayout
      breadcrumb={`SYSTEM CONSOLE / MEDIA NEWS / ${article.title.toUpperCase()}`}
    >
      <div className="px-6 space-y-8 w-full max-w-none">
        <div className="flex justify-between items-center">
          <Link href="/admin/media-news">
            <Button
              variant="ghost"
              className="pl-0 text-gray-400 hover:text-teal-400"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              BACK TO LIST
            </Button>
          </Link>
          <Link href={`/admin/media-news/${article.id}/edit`}>
            <Button
              variant="outline"
              className="text-teal-400 border-teal-500/30 hover:bg-teal-500/10 hover:text-teal-300"
            >
              <Pencil className="mr-2 w-4 h-4" />
              EDIT ENTRY
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-border bg-[#1a1a1a]">
            {article.coverImage ? (
              <img
                src={article.coverImage}
                alt={article.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                <div className="font-mono text-xl tracking-widest text-gray-700 uppercase">
                  No Image Available
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60"></div>
            <div className="absolute right-6 bottom-6 left-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium text-teal-400 rounded border backdrop-blur bg-teal-500/20 border-teal-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="mb-2 text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl shadow-black">
                {article.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between items-center pb-6 border-b border-border">
            <div className="flex gap-6 items-center text-sm text-gray-400">
              <div className="flex items-center">
                <User className="mr-2 w-4 h-4 text-teal-400" />
                {article.author || "Admin"}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 w-4 h-4 text-teal-400" />
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {article.excerpt && (
            <div className="py-2 pl-6 text-xl italic font-light leading-relaxed text-gray-300 border-l-4 border-teal-500">
              {article.excerpt}
            </div>
          )}

          <div
            className="max-w-none prose prose-invert prose-lg prose-headings:text-teal-400 prose-a:text-teal-400 hover:prose-a:text-teal-300 prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>
    </MainLayout>
  );
}
