'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Calendar, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / BLOGS">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-400">SPORE LOG</h1>
          <Link href="/admin/blogs/create">
            <Button className="bg-teal-500 hover:bg-teal-600 text-black font-semibold">NEW ENTRY</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-lg bg-[#1a1a1a] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <Card
                key={blog.id}
                className="bg-[#111111] border-border overflow-hidden hover:border-teal-500/50 transition-colors group"
              >
                <div className="aspect-video relative overflow-hidden bg-[#1a1a1a]">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                      <div className="text-gray-700 font-mono text-xs tracking-widest uppercase">No Image</div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {blog.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-black/50 backdrop-blur text-xs font-medium text-teal-400 border border-teal-500/30 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/admin/blogs/${blog.id}/edit`}>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-black/50 backdrop-blur hover:bg-teal-500 hover:text-white border border-teal-500/30"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-2" />
                    {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <h2 className="text-xl font-bold text-gray-100 group-hover:text-teal-400 transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-gray-400 line-clamp-3 text-sm leading-relaxed">{blog.excerpt}</p>
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="inline-flex items-center text-sm font-medium text-teal-400 hover:text-teal-300 mt-2"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
