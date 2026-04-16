"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/editor/rich-text-editor";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const formatDateTimeLocal = (date = new Date()) => {
  const normalized = new Date(date);
  const pad = (value) => String(value).padStart(2, "0");

  return `${normalized.getFullYear()}-${pad(normalized.getMonth() + 1)}-${pad(
    normalized.getDate(),
  )}T${pad(normalized.getHours())}:${pad(normalized.getMinutes())}`;
};

export default function CreateMediaNewsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    coverImage: "",
    tags: "",
    content: "",
    source: "",
    sourceUrl: "",
    publishedAt: formatDateTimeLocal(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        publishedAt: formData.publishedAt
          ? new Date(formData.publishedAt).toISOString()
          : null,
        author: user?.email?.split("@")[0] || "Admin", // Fallback author
      };

      const res = await fetch("/api/media-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to create media news");
      }

      router.push("/admin/media-news");
      router.refresh();
    } catch (error) {
      console.error("Error creating media news:", error);
      alert("Failed to create media news entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / MEDIA NEWS / NEW ENTRY">
      <div className="w-full max-w-none px-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/admin/media-news">
            <Button
              variant="ghost"
              className="pl-0 text-gray-400 hover:text-teal-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              CANCEL
            </Button>
          </Link>
          <Button
            onClick={handleSubmit}
            disabled={loading || !formData.title || !formData.content}
            className="bg-teal-500 hover:bg-teal-600 text-black font-semibold"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            PUBLISH ENTRY
          </Button>
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
                    <Label className="text-gray-400">PUBLISHED AT</Label>
                    <Input
                      name="publishedAt"
                      type="datetime-local"
                      value={formData.publishedAt}
                      onChange={handleChange}
                      className="bg-[#1a1a1a] border-gray-800 text-white focus:border-teal-500"
                    />
                    <p className="text-xs text-gray-500">
                      Set the display date for this media entry.
                    </p>
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
                    <RichTextEditor
                      content={formData.content}
                      onChange={handleContentChange}
                    />
                  </div>
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
                    <img
                      src={formData.coverImage}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
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
