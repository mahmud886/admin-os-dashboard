"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ExternalLink, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MediaNewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/media-news");
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error("Failed to fetch media news:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / MEDIA NEWS">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-400 sm:text-3xl lg:text-4xl">
            MEDIA NEWS
          </h1>
          <Link href="/admin/media-news/create">
            <Button className="font-semibold text-black bg-teal-500 hover:bg-teal-600">
              NEW ENTRY
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-lg bg-[#1a1a1a] animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.map((article) => (
              <Card
                key={article.id}
                className="bg-[#111111] border-border overflow-hidden hover:border-teal-500/50 transition-colors group"
              >
                <div className="aspect-video relative overflow-hidden bg-[#1a1a1a]">
                  <Link
                    href={`/admin/media-news/${article.slug || article.id}`}
                    className="block w-full h-full"
                  >
                    {article.coverImage ? (
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="object-cover w-full h-full opacity-80 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                        <div className="font-mono text-xs tracking-widest text-gray-700 uppercase">
                          No Image
                        </div>
                      </div>
                    )}
                  </Link>
                  <div className="flex absolute top-4 left-4 flex-wrap gap-2 pointer-events-none">
                    {article.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-medium text-teal-400 rounded border backdrop-blur bg-black/50 border-teal-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <Link href={`/admin/media-news/${article.id}/edit`}>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="w-8 h-8 border backdrop-blur bg-black/50 hover:bg-teal-500 hover:text-white border-teal-500/30"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="mr-2 w-3 h-3" />
                      {new Date(article.publishedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </div>
                    {article.source && (
                      <span className="text-teal-500 font-medium uppercase tracking-wider text-[10px]">
                        {article.source}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/admin/media-news/${article.slug || article.id}`}
                    className="block"
                  >
                    <h2 className="text-xl font-bold text-gray-100 transition-colors group-hover:text-teal-400 line-clamp-2">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="text-sm leading-relaxed text-gray-400 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {article.sourceUrl && (
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-xs text-teal-500 hover:text-teal-400"
                    >
                      READ SOURCE <ExternalLink className="ml-1 w-3 h-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
