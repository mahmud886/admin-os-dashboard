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

export default function EditMediaNewsPage({ params }) {
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
    source: '',
    sourceUrl: '',
  });

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/media-news/${id}`);
        if (!res.ok) throw new Error('Article not found');
        const data = await res.json();
        setFormData({
          ...data,
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '',
          source: data.source || '',
          sourceUrl: data.sourceUrl || '',
        });
      } catch (error) {
        console.error('Error fetching article:', error);
        router.push('/admin/media-news');
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
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

      const res = await fetch(`/api/media-news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to update media news');
      }

      router.push('/admin/media-news');
      router.refresh();
    } catch (error) {
      console.error('Error updating media news:', error);
      alert('Failed to update media news entry');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/media-news/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      router.push('/admin/media-news');
      router.refresh();
    } catch (error) {
      console.error('Error deleting media news:', error);
      alert('Failed to delete entry');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout breadcrumb="SYSTEM CONSOLE / MEDIA NEWS">
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / MEDIA NEWS / EDIT ENTRY">
      <div className="px-6 space-y-6 w-full max-w-none">
        <div className="flex justify-between items-center">
          <Link href="/admin/media-news">
            <Button variant="ghost" className="pl-0 text-gray-400 hover:text-teal-400">
              <ArrowLeft className="mr-2 w-4 h-4" />
              CANCEL
            </Button>
          </Link>
          <div className="flex gap-2 items-center">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
              className="text-red-500 bg-red-500/10 hover:bg-red-500/20"
            >
              <Trash2 className="mr-2 w-4 h-4" />
              DELETE
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !formData.title || !formData.content}
              className="font-semibold text-black bg-teal-500 hover:bg-teal-600"
            >
              {saving ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Save className="mr-2 w-4 h-4" />}
              SAVE CHANGES
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
                    placeholder="Enter article title"
                    className="bg-[#1a1a1a] border-gray-800 text-white focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400">SOURCE NAME</Label>
                    <Input
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      placeholder="e.g. TechCrunch"
                      className="bg-[#1a1a1a] border-gray-800 text-white focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">SOURCE URL</Label>
                    <Input
                      name="sourceUrl"
                      value={formData.sourceUrl}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="bg-[#1a1a1a] border-gray-800 text-white focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-400">CONTENT</Label>
                  <div className="min-h-[400px] border border-gray-800 rounded-md overflow-hidden">
                    <RichTextEditor content={formData.content} onChange={handleContentChange} />
                  </div>
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
                    placeholder="auto-generated-from-title"
                    className="bg-[#1a1a1a] border-gray-800 text-white focus:border-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-400">EXCERPT</Label>
                  <Textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Brief summary for list view..."
                    className="bg-[#1a1a1a] border-gray-800 text-white focus:border-teal-500 min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-400">COVER IMAGE URL</Label>
                  <Input
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="bg-[#1a1a1a] border-gray-800 text-white focus:border-teal-500"
                  />
                </div>

                {formData.coverImage && (
                  <div className="relative aspect-video rounded-md overflow-hidden bg-[#1a1a1a]">
                    <img src={formData.coverImage} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-gray-400">TAGS</Label>
                  <Input
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="news, media, tech (comma separated)"
                    className="bg-[#1a1a1a] border-gray-800 text-white focus:border-teal-500"
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
