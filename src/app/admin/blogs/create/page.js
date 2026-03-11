'use client';

import RichTextEditor from '@/components/editor/rich-text-editor';
import { MainLayout } from '@/components/layout/main-layout';
import { BlogPreviewModal } from '@/components/preview/blog-preview-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateBlogPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    coverImage: '',
    tags: '',
    content: '',
    isPasswordProtected: false,
    accessPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({ ...prev, isPasswordProtected: checked }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        author: user?.email?.split('@')[0] || 'Admin', // Fallback author
      };

      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to create blog');
      }

      router.push('/admin/blogs');
      router.refresh();
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / BLOGS / NEW ENTRY">
      <div className="px-6 space-y-6 w-full max-w-none">
        <div className="flex justify-between items-center">
          <Link href="/admin/blogs">
            <Button variant="ghost" className="pl-0 text-gray-400 hover:text-teal-400">
              <ArrowLeft className="mr-2 w-4 h-4" />
              CANCEL
            </Button>
          </Link>
          <div className="flex gap-2">
            <BlogPreviewModal blog={formData} />
            <Button
              onClick={handleSubmit}
              disabled={loading || !formData.title || !formData.content}
              className="font-semibold text-black bg-teal-500 hover:bg-teal-600"
            >
              {loading ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Save className="mr-2 w-4 h-4" />}
              PUBLISH ENTRY
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="bg-[#111111] border-border">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-400">TITLE</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter blog title..."
                    className="bg-[#1a1a1a] border-border text-lg font-medium text-white focus:border-teal-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-400">CONTENT</Label>
                  <RichTextEditor content={formData.content} onChange={handleContentChange} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-border">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-400">EXCERPT</Label>
                  <Textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Short description for list view..."
                    className="bg-[#1a1a1a] border-border text-gray-300 min-h-[100px] focus:border-teal-500/50"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#111111] border-border">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-400">SLUG (OPTIONAL)</Label>
                  <Input
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="auto-generated-if-empty"
                    className="bg-[#1a1a1a] border-border text-gray-300 focus:border-teal-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-400">COVER IMAGE URL</Label>
                  <Input
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="bg-[#1a1a1a] border-border text-gray-300 focus:border-teal-500/50"
                  />
                </div>

                {formData.coverImage && (
                  <div className="overflow-hidden rounded-lg border border-border aspect-video">
                    <img src={formData.coverImage} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-gray-400">TAGS</Label>
                  <Input
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Comma, separated, tags"
                    className="bg-[#1a1a1a] border-border text-gray-300 focus:border-teal-500/50"
                  />
                </div>

                <div className="flex items-center pt-4 space-x-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="password-protection"
                      checked={formData.isPasswordProtected}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="password-protection" className="text-gray-300 cursor-pointer">
                      Password Protected
                    </Label>
                  </div>
                </div>

                {formData.isPasswordProtected && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-teal-400">ACCESS PASSWORD</Label>
                    <Input
                      name="accessPassword"
                      type="password"
                      value={formData.accessPassword}
                      onChange={handleChange}
                      placeholder="Set access password"
                      className="bg-[#1a1a1a] border-teal-500/50 text-white focus:border-teal-500"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
