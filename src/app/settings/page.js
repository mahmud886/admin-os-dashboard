"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";

const CURRENCIES = [
  "SGD",
  "USD",
  "EUR",
  "RMB",
  "KRW",
  "JPY",
  "IDR",
  "PHP",
  "INR",
];

const CURRENCY_LABELS = {
  SGD: "SGD — Singapore Dollar (S$)",
  USD: "USD — US Dollar ($)",
  EUR: "EUR — Euro (€)",
  RMB: "RMB — Chinese Yuan (¥)",
  KRW: "KRW — Korean Won (₩)",
  JPY: "JPY — Japanese Yen (¥)",
  IDR: "IDR — Indonesian Rupiah (Rp)",
  PHP: "PHP — Philippine Peso (₱)",
  INR: "INR — Indian Rupee (₹)",
};

export default function SettingsPage() {
  const [currency, setCurrency] = useState("SGD");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setCurrency(d.store_currency || "SGD"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_currency: currency }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / SETTINGS">
      <div className="max-w-xl space-y-6">
        <h1 className="text-2xl font-bold text-teal-400">STORE SETTINGS</h1>

        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400 text-sm">
              STORE CURRENCY
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center gap-2 text-white/40">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="text-teal-400">CURRENCY</Label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-[#0a0a0a] border border-border text-sm text-white"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {CURRENCY_LABELS[c]}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-white/30 font-mono">
                  Applies to all custom products. Changes take effect within 60
                  seconds on the frontend.
                </p>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-teal-500 hover:bg-teal-600 text-black font-semibold"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {saving ? "SAVING..." : saved ? "SAVED ✓" : "SAVE SETTINGS"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
