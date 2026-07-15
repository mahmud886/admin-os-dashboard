"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const emptyBullet = () => ({ bold: "", text: "" });

export default function EditDonationTierPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/donation-tiers/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setFormData({
          tierId: data.tierId || "",
          label: data.label || "",
          heading: data.heading || "",
          description: data.description || "",
          price: data.price != null ? String(data.price) : "",
          isCustomAmount: data.isCustomAmount || false,
          minAmount: data.minAmount != null ? String(data.minAmount) : "",
          buttonText: data.buttonText || "BACK THE CAMPAIGN.",
          footerText: data.footerText || "",
          bulletPoints:
            data.bulletPoints?.length > 0 ? data.bulletPoints : [emptyBullet()],
          note: data.note || "",
          isFeatured: data.isFeatured || false,
          badgeText: data.badgeText || "",
          badgeSubtext: data.badgeSubtext || "",
          isPublished: data.isPublished ?? true,
          sortOrder: data.sortOrder ?? 0,
          isSubscription: data.isSubscription || false,
          hasDigitalDownload: data.hasDigitalDownload || false,
          digitalFilePath: data.digitalFilePath || "",
        });
      })
      .catch(() => alert("Failed to load tier"))
      .finally(() => setFetchLoading(false));
  }, [id]);

  const set = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const setBullet = (idx, field, value) =>
    setFormData((prev) => {
      const updated = [...prev.bulletPoints];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, bulletPoints: updated };
    });

  const addBullet = () =>
    setFormData((prev) => ({
      ...prev,
      bulletPoints: [...prev.bulletPoints, emptyBullet()],
    }));

  const removeBullet = (idx) =>
    setFormData((prev) => ({
      ...prev,
      bulletPoints: prev.bulletPoints.filter((_, i) => i !== idx),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: formData.isCustomAmount
          ? null
          : formData.price
            ? parseFloat(formData.price)
            : null,
        minAmount: formData.minAmount ? parseFloat(formData.minAmount) : null,
        sortOrder: parseInt(formData.sortOrder) || 0,
        bulletPoints: formData.bulletPoints.filter((b) => b.bold || b.text),
        digitalFilePath: formData.hasDigitalDownload
          ? formData.digitalFilePath
          : null,
      };

      const res = await fetch(`/api/donation-tiers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update tier");
      }
      router.push("/donation-tiers");
      router.refresh();
    } catch (error) {
      console.error("Error updating tier:", error);
      alert(error.message || "Failed to update donation tier");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <MainLayout breadcrumb="SYSTEM CONSOLE / DONATION TIERS / EDIT">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
        </div>
      </MainLayout>
    );
  }

  if (!formData) return null;

  return (
    <MainLayout
      breadcrumb={`SYSTEM CONSOLE / DONATION TIERS / EDIT: ${formData.label}`}
    >
      <div className="px-6 space-y-6 w-full max-w-none">
        <div className="flex justify-between items-center">
          <Link href="/donation-tiers">
            <Button
              variant="ghost"
              className="pl-0 text-gray-400 hover:text-teal-400"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              CANCEL
            </Button>
          </Link>
          <Button
            onClick={handleSubmit}
            disabled={
              loading ||
              !formData.tierId ||
              !formData.label ||
              !formData.heading
            }
            className="font-semibold text-black bg-teal-500 hover:bg-teal-600"
          >
            {loading ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              <Save className="mr-2 w-4 h-4" />
            )}
            SAVE CHANGES
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="bg-[#111111] border-border">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-sm font-medium tracking-wider text-teal-400 uppercase">
                  Identifiers
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400">TIER ID (SLUG)</Label>
                    <Input
                      value={formData.tierId}
                      onChange={(e) => set("tierId", e.target.value)}
                      className="bg-[#1a1a1a] border-border text-gray-400 focus:border-teal-500/50"
                    />
                    <p className="text-xs text-gray-600">
                      Changing this may break existing donations data.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">LABEL (CARD TITLE)</Label>
                    <Input
                      value={formData.label}
                      onChange={(e) => set("label", e.target.value)}
                      className="bg-[#1a1a1a] border-border text-white focus:border-teal-500/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400">
                    HEADING (SECTION TITLE)
                  </Label>
                  <Input
                    value={formData.heading}
                    onChange={(e) => set("heading", e.target.value)}
                    className="bg-[#1a1a1a] border-border text-white focus:border-teal-500/50"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-border">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-sm font-medium tracking-wider text-teal-400 uppercase">
                  Content
                </h2>
                <div className="space-y-2">
                  <Label className="text-gray-400">DESCRIPTION</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => set("description", e.target.value)}
                    className="bg-[#1a1a1a] border-border text-gray-300 min-h-[100px] focus:border-teal-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400">NOTE (OPTIONAL)</Label>
                  <Input
                    value={formData.note}
                    onChange={(e) => set("note", e.target.value)}
                    className="bg-[#1a1a1a] border-border text-gray-300 focus:border-teal-500/50"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-medium tracking-wider text-teal-400 uppercase">
                    Bullet Points
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addBullet}
                    className="text-teal-400 border-teal-500/30 hover:bg-teal-900/20"
                  >
                    <Plus className="mr-1 w-3 h-3" />
                    ADD BULLET
                  </Button>
                </div>
                {formData.bulletPoints.map((bullet, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input
                        value={bullet.bold || ""}
                        onChange={(e) => setBullet(idx, "bold", e.target.value)}
                        placeholder="Bold text (optional)"
                        className="bg-[#1a1a1a] border-border text-white focus:border-teal-500/50"
                      />
                      <Input
                        value={bullet.text || ""}
                        onChange={(e) => setBullet(idx, "text", e.target.value)}
                        placeholder="Regular text (optional)"
                        className="bg-[#1a1a1a] border-border text-gray-300 focus:border-teal-500/50"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 mt-1 w-8 h-8 shrink-0"
                      onClick={() => removeBullet(idx)}
                      disabled={formData.bulletPoints.length === 1}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#111111] border-border">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-sm font-medium tracking-wider text-teal-400 uppercase">
                  Pricing
                </h2>
                <div className="flex items-center gap-3 py-2">
                  <Switch
                    id="custom-amount"
                    checked={formData.isCustomAmount}
                    onCheckedChange={(v) => set("isCustomAmount", v)}
                  />
                  <Label
                    htmlFor="custom-amount"
                    className="text-gray-300 cursor-pointer"
                  >
                    Custom Amount (user enters)
                  </Label>
                </div>
                {formData.isCustomAmount ? (
                  <div className="space-y-2">
                    <Label className="text-gray-400">MINIMUM AMOUNT ($)</Label>
                    <Input
                      type="number"
                      value={formData.minAmount}
                      onChange={(e) => set("minAmount", e.target.value)}
                      min="1"
                      className="bg-[#1a1a1a] border-border text-white focus:border-teal-500/50"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-gray-400">FIXED PRICE ($)</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => set("price", e.target.value)}
                      min="1"
                      className="bg-[#1a1a1a] border-border text-white focus:border-teal-500/50"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-border">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-sm font-medium tracking-wider text-teal-400 uppercase">
                  CTA Labels
                </h2>
                <div className="space-y-2">
                  <Label className="text-gray-400">BUTTON TEXT</Label>
                  <Input
                    value={formData.buttonText}
                    onChange={(e) => set("buttonText", e.target.value)}
                    className="bg-[#1a1a1a] border-border text-white focus:border-teal-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400">FOOTER PILL TEXT</Label>
                  <Input
                    value={formData.footerText}
                    onChange={(e) => set("footerText", e.target.value)}
                    className="bg-[#1a1a1a] border-border text-white focus:border-teal-500/50"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-border">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-sm font-medium tracking-wider text-teal-400 uppercase">
                  Badge / Featured
                </h2>
                <div className="flex items-center gap-3 py-2">
                  <Switch
                    id="featured"
                    checked={formData.isFeatured}
                    onCheckedChange={(v) => set("isFeatured", v)}
                  />
                  <Label
                    htmlFor="featured"
                    className="text-gray-300 cursor-pointer"
                  >
                    Show Featured Badge
                  </Label>
                </div>
                {formData.isFeatured && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-gray-400">BADGE TEXT</Label>
                      <Input
                        value={formData.badgeText}
                        onChange={(e) => set("badgeText", e.target.value)}
                        className="bg-[#1a1a1a] border-border text-white focus:border-teal-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400">BADGE SUBTEXT</Label>
                      <Input
                        value={formData.badgeSubtext}
                        onChange={(e) => set("badgeSubtext", e.target.value)}
                        className="bg-[#1a1a1a] border-border text-white focus:border-teal-500/50"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-border">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-sm font-medium tracking-wider text-teal-400 uppercase">
                  Digital Download
                </h2>
                <div className="flex items-center gap-3 py-2">
                  <Switch
                    id="digital"
                    checked={formData.hasDigitalDownload}
                    onCheckedChange={(v) => set("hasDigitalDownload", v)}
                  />
                  <Label
                    htmlFor="digital"
                    className="text-gray-300 cursor-pointer"
                  >
                    Includes Digital File
                  </Label>
                </div>
                {formData.hasDigitalDownload && (
                  <div className="space-y-2">
                    <Label className="text-gray-400">
                      SUPABASE STORAGE PATH
                    </Label>
                    <Input
                      value={formData.digitalFilePath}
                      onChange={(e) => set("digitalFilePath", e.target.value)}
                      placeholder="e.g. music-booklet/sporefall-booklet-v1.pdf"
                      className="bg-[#1a1a1a] border-border text-white focus:border-teal-500/50"
                    />
                    <p className="text-xs text-gray-600">
                      Path within the{" "}
                      <span className="font-mono text-gray-400">
                        digital-products
                      </span>{" "}
                      Supabase Storage bucket.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#111111] border-border">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-sm font-medium tracking-wider text-teal-400 uppercase">
                  Settings
                </h2>
                <div className="space-y-2">
                  <Label className="text-gray-400">SORT ORDER</Label>
                  <Input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => set("sortOrder", e.target.value)}
                    className="bg-[#1a1a1a] border-border text-white focus:border-teal-500/50"
                  />
                </div>
                <div className="flex items-center gap-3 py-1 border-t border-border">
                  <Switch
                    id="published"
                    checked={formData.isPublished}
                    onCheckedChange={(v) => set("isPublished", v)}
                  />
                  <Label
                    htmlFor="published"
                    className="text-gray-300 cursor-pointer"
                  >
                    Published (visible on site)
                  </Label>
                </div>
                <div className="flex items-center gap-3 py-1 border-t border-border">
                  <Switch
                    id="subscription"
                    checked={formData.isSubscription}
                    onCheckedChange={(v) => set("isSubscription", v)}
                  />
                  <Label
                    htmlFor="subscription"
                    className="text-gray-300 cursor-pointer"
                  >
                    Monthly Subscription
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
