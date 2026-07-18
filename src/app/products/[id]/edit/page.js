"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CATEGORIES = ["Physical", "Digital", "Bundle", "Apparel", "Accessories"];

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState(null);

  const [primaryPreview, setPrimaryPreview] = useState(null);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const primaryRef = useRef(null);
  const additionalRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((product) => {
        setFormData({
          name: product.name || "",
          price: product.price || "",
          category: product.category || "Physical",
          description: product.description || "",
          format: product.format || "",
          includes: product.includes || "",
          sku: product.sku || "",
          shippingNote: product.shippingNote || "",
          stockQuantity: product.stockQuantity ?? "",
          isLimited: product.isLimited || false,
          availabilityStatus: product.availabilityStatus || "active",
          isPublished: product.isPublished || false,
          sortOrder: product.sortOrder || 0,
          imageUrl: product.imageUrl || "",
          images: product.images || [],
        });
        if (product.imageUrl) setPrimaryPreview(product.imageUrl);
        if (product.images?.length) setAdditionalPreviews(product.images);
      })
      .catch(() => router.push("/products"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function uploadImage(file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/products/upload-image", {
      method: "POST",
      body: fd,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Upload failed");
    }
    const { url } = await res.json();
    return url;
  }

  async function handlePrimaryUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPrimaryPreview(URL.createObjectURL(file));
    setUploadingPrimary(true);
    try {
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      alert(err.message);
      setPrimaryPreview(formData.imageUrl || null);
    } finally {
      setUploadingPrimary(false);
    }
  }

  async function handleAdditionalUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = 8 - additionalPreviews.length;
    const toUpload = files.slice(0, remaining);
    setUploadingAdditional(true);
    try {
      const urls = await Promise.all(toUpload.map(uploadImage));
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      setAdditionalPreviews((prev) => [
        ...prev,
        ...toUpload.map((f) => URL.createObjectURL(f)),
      ]);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingAdditional(false);
    }
  }

  function removeAdditional(index) {
    setAdditionalPreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert("Name and price are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity:
          formData.stockQuantity !== ""
            ? parseInt(formData.stockQuantity)
            : null,
        sortOrder: parseInt(formData.sortOrder) || 0,
      };
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update product");
      }
      router.push("/products");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Permanently delete this artifact? This cannot be undone."))
      return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/products");
      } else {
        alert("Failed to delete product.");
      }
    } catch {
      alert("Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading || !formData) {
    return (
      <MainLayout breadcrumb="SYSTEM CONSOLE / PRODUCT STORE / EDIT">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / PRODUCT STORE / EDIT">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/products">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-teal-400">EDIT ARTIFACT</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={deleting}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {deleting ? "DELETING..." : "DELETE"}
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-teal-500 hover:bg-teal-600 text-black font-semibold"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — Core Info */}
          <div className="space-y-6">
            <Card className="bg-[#111111] border-border">
              <CardHeader>
                <CardTitle className="text-teal-400 text-sm">
                  ARTIFACT DETAILS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-teal-400">NAME *</Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Spore Fall Zine Vol. 1"
                    className="bg-[#0a0a0a] border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-teal-400">SKU</Label>
                  <Input
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="e.g. SF-TOTE-001"
                    className="bg-[#0a0a0a] border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-teal-400">PRICE (USD) *</Label>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="bg-[#0a0a0a] border-border"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-teal-400">CATEGORY</Label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md bg-[#0a0a0a] border border-border text-sm text-white"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-teal-400">DESCRIPTION</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Full product description..."
                    className="min-h-[100px] bg-[#0a0a0a] border-border resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-teal-400">FORMAT</Label>
                  <Input
                    name="format"
                    value={formData.format}
                    onChange={handleChange}
                    placeholder='e.g. "A5, 28 pages" or "Digital PDF"'
                    className="bg-[#0a0a0a] border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-teal-400">WHAT&apos;S INCLUDED</Label>
                  <Textarea
                    name="includes"
                    value={formData.includes}
                    onChange={handleChange}
                    placeholder={"Signed print\nSticker sheet\nLore zine"}
                    className="min-h-[80px] bg-[#0a0a0a] border-border resize-none text-sm"
                  />
                  <p className="text-[10px] text-gray-500">
                    One item per line — each line becomes a bullet on the
                    frontend.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-teal-400">SHIPPING</Label>
                  <select
                    name="shippingNote"
                    value={formData.shippingNote}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md bg-[#0a0a0a] border border-border text-sm text-white"
                  >
                    <option value="">— Select —</option>
                    <option value="Only Singapore">Only Singapore</option>
                    <option value="International">International</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-border">
              <CardHeader>
                <CardTitle className="text-teal-400 text-sm">
                  STOCK & STATUS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-teal-400">STOCK QTY</Label>
                    <Input
                      name="stockQuantity"
                      type="number"
                      min="0"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      placeholder="Leave blank = unlimited"
                      className="bg-[#0a0a0a] border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-teal-400">SORT ORDER</Label>
                    <Input
                      name="sortOrder"
                      type="number"
                      min="0"
                      value={formData.sortOrder}
                      onChange={handleChange}
                      className="bg-[#0a0a0a] border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-teal-400">AVAILABILITY</Label>
                  <select
                    name="availabilityStatus"
                    value={formData.availabilityStatus}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md bg-[#0a0a0a] border border-border text-sm text-white"
                  >
                    <option value="active">Active</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-teal-400">LIMITED EDITION</Label>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Show LIMITED badge on the product
                    </p>
                  </div>
                  <Switch
                    checked={formData.isLimited}
                    onCheckedChange={(v) =>
                      setFormData((p) => ({ ...p, isLimited: v }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border">
                  <div>
                    <Label className="text-red-400">SOLD OUT</Label>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Show SOLD OUT badge and disable add to cart
                    </p>
                  </div>
                  <Switch
                    checked={formData.availabilityStatus === "out_of_stock"}
                    onCheckedChange={(v) =>
                      setFormData((p) => ({
                        ...p,
                        availabilityStatus: v ? "out_of_stock" : "active",
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border">
                  <div>
                    <Label className="text-teal-400">PUBLISHED</Label>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Visible on the public site
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPublished}
                    onCheckedChange={(v) =>
                      setFormData((p) => ({ ...p, isPublished: v }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right — Images */}
          <div className="space-y-6">
            <Card className="bg-[#111111] border-border">
              <CardHeader>
                <CardTitle className="text-teal-400 text-sm">
                  PRIMARY IMAGE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {primaryPreview ? (
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border">
                    <Image
                      src={primaryPreview}
                      alt="Primary"
                      fill
                      className="object-cover"
                    />
                    {uploadingPrimary && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
                      </div>
                    )}
                    {!uploadingPrimary && (
                      <button
                        type="button"
                        onClick={() => {
                          setPrimaryPreview(null);
                          setFormData((p) => ({ ...p, imageUrl: "" }));
                          if (primaryRef.current) primaryRef.current.value = "";
                        }}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center text-white hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => primaryRef.current?.click()}
                    className="w-full aspect-square rounded-lg border-2 border-dashed border-border bg-[#0a0a0a] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-teal-500/50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-600" />
                    <p className="text-xs text-gray-500">
                      Click to upload primary image
                    </p>
                    <p className="text-[10px] text-gray-600">
                      JPEG, PNG, WebP · Max 5MB
                    </p>
                  </div>
                )}
                <input
                  ref={primaryRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePrimaryUpload}
                  className="hidden"
                />
                {!primaryPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-[#0a0a0a] border-border text-gray-400"
                    onClick={() => primaryRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" /> SELECT IMAGE
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-border">
              <CardHeader>
                <CardTitle className="text-teal-400 text-sm">
                  ADDITIONAL IMAGES (up to 8)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {additionalPreviews.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden border border-border"
                    >
                      <Image
                        src={src}
                        alt={`Additional ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditional(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {additionalPreviews.length < 8 && (
                    <div
                      onClick={() => additionalRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-border bg-[#0a0a0a] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-teal-500/50 transition-colors"
                    >
                      {uploadingAdditional ? (
                        <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-gray-600" />
                          <p className="text-[10px] text-gray-500">Add image</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <input
                  ref={additionalRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </MainLayout>
  );
}
