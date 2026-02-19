'use client';

import RichTextEditor from '@/components/editor/rich-text-editor';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

export default function EditBlogPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    coverImage: '',
    tags: '',
    content: '',
  });

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) throw new Error('Blog not found');
        const data = await res.json();
        setFormData({
          ...data,
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '',
        });
      } catch (error) {
        console.error('Error fetching blog:', error);
        router.push('/admin/blogs');
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to update blog');
      }

      router.push('/admin/blogs');
      router.refresh();
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete blog');
      router.push('/admin/blogs');
      router.refresh();
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog post');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout breadcrumb="SYSTEM CONSOLE / BLOGS / EDIT">
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / BLOGS / EDIT">
      <div className="w-full max-w-none px-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/admin/blogs">
            <Button variant="ghost" className="pl-0 text-gray-400 hover:text-teal-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              CANCEL
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
              className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              DELETE
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !formData.title || !formData.content}
              className="bg-teal-500 hover:bg-teal-600 text-black font-semibold"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              SAVE CHANGES
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
                  <Label className="text-gray-400">SLUG</Label>
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
                  <div className="rounded-lg overflow-hidden border border-border aspect-video">
                    <img src={formData.coverImage} alt="Preview" className="w-full h-full object-cover" />
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
