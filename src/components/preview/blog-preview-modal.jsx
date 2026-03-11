'use client';

import '@/app/admin/blogs/[id]/preview/preview.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Eye, User } from 'lucide-react';

export function BlogPreviewModal({ blog }) {
  if (!blog) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-teal-400 border-teal-500/30 hover:bg-teal-500/10">
          <Eye className="mr-2 w-4 h-4" />
          PREVIEW MODAL
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto p-0 max-h-[90vh] max-w-4xl bg-[#0a0a0a] border-white/10">
        <div className="relative min-h-full blog-preview-container">
          <div className="overflow-hidden relative pb-20 min-h-full">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none -z-10">
              <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
              <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
            </div>

            <div className="px-6 py-12 mx-auto max-w-4xl">
              <article>
                {/* Header */}
                <header className="relative pb-12 mb-12 border-b border-white/10">
                  <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-primary shadow-[0_0_10px_rgba(212,255,0,0.5)]" />

                  <div className="flex flex-wrap gap-4 items-center mb-6 font-mono text-xs tracking-wider uppercase text-white/40">
                    <span className="flex gap-2 items-center">
                      <Calendar size={14} />
                      {new Date(blog.publishedAt || new Date()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="flex gap-2 items-center text-primary">
                      <User size={14} />
                      {blog.author || 'SPORE FALL'}
                    </span>
                  </div>

                  <h1 className="mb-8 text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl glitch-text">
                    {blog.title || 'Untitled Blog Post'}
                  </h1>

                  {/* Tags */}
                  {blog.tags && (
                    <div className="flex flex-wrap gap-2">
                      {(typeof blog.tags === 'string' ? blog.tags.split(',') : blog.tags).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 font-mono text-xs tracking-widest uppercase rounded border transition-colors bg-white/5 border-white/10 text-white/60 hover:border-primary/30 hover:text-primary"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </header>

                {/* Featured Image */}
                {blog.coverImage && (
                  <div className="overflow-hidden relative mb-12 rounded-2xl border border-white/10 group">
                    <div className="aspect-[21/9] relative">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent from-black/80" />
                    </div>

                    {/* Decorative corners */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-primary/50" />
                    <div className="absolute right-4 bottom-4 w-12 h-12 border-r border-b border-primary/50" />
                  </div>
                )}

                {/* Content */}
                <div className="max-w-none prose prose-invert prose-lg">
                  <div
                    className="space-y-6 leading-relaxed font-body text-white/80 blog-content"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>

                {/* Footer */}
                <div className="pt-12 mt-20 border-t border-white/10">
                  <div className="p-8 text-center rounded-xl border bg-white/5 border-white/10">
                    <h3 className="mb-4 text-xl font-bold text-primary">Join the Discussion</h3>
                    <p className="mb-6 text-white/60 font-body">
                      Share your thoughts on the Spore protocol and connect with other survivors.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
