"use client";

import { EpisodesTableShimmer } from "@/components/shimmer/episodes-table-shimmer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/useAuth";
import { Download, Mail, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export function EmailsContent() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [secretDropsRes, modalSubsRes] = await Promise.all([
          fetch("/api/secret-drops", { cache: "no-store" }),
          fetch("/api/modal-submissions", { cache: "no-store" }),
        ]);
        if (!secretDropsRes.ok) {
          throw new Error(`Failed to load data (${secretDropsRes.status})`);
        }
        const json = await secretDropsRes.json();
        const secretDrops = json.secret_drops || [];
        const mappedSecretDrops = secretDrops.map((d) => ({
          id: d.id,
          source: "secret_drop",
          name: d.name || "",
          email: d.email || "",
          status: "PENDING",
          segment: "SECRET_DROP",
          firstSignal: d.created_at ? new Date(d.created_at).toISOString() : "",
          message: d.message || "",
          auth: false,
        }));

        let mappedModalSubs = [];
        if (modalSubsRes.ok) {
          const modalJson = await modalSubsRes.json();
          mappedModalSubs = (modalJson.submissions || []).map((s) => ({
            id: s.id,
            source: "modal",
            // Fallback to "field" — some older modals were built with a
            // mistyped input name and stored the visitor's name under that key.
            name: s.data?.name || s.data?.field || "",
            email: s.data?.email || "",
            status: "PENDING",
            segment: s.modalName || "MODAL CAMPAIGN",
            firstSignal: s.createdAt || "",
            message: s.data?.message || "",
            auth: false,
          }));
        }

        const merged = [...mappedSecretDrops, ...mappedModalSubs].sort(
          (a, b) => new Date(b.firstSignal) - new Date(a.firstSignal),
        );

        if (!cancelled) {
          setSubscribers(merged);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Network error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(id, source) {
    try {
      setDeletingId(id);
      const endpoint =
        source === "modal"
          ? `/api/modal-submissions/${id}`
          : `/api/secret-drops/${id}`;
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        const msg = `Delete failed (${res.status})`;
        setError(msg);
        addToast({
          title: "Delete Failed",
          description: msg,
          variant: "error",
        });
        return;
      }
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      addToast({
        title: "Deleted",
        description: "Secret drop removed",
        variant: "success",
      });
    } catch (e) {
      const msg = e.message || "Network error";
      setError(msg);
      addToast({ title: "Delete Error", description: msg, variant: "error" });
    } finally {
      setDeletingId(null);
      setConfirmOpen(false);
      setPendingDelete(null);
    }
  }

  function requestDelete(subscriber) {
    setPendingDelete(subscriber);
    setConfirmOpen(true);
  }

  function handleExportCSV() {
    if (!subscribers.length) {
      addToast({
        title: "No data",
        description: "No subscribers to export",
        variant: "warning",
      });
      return;
    }

    const headers = ["Name", "Email", "Segment", "First Signal", "Message"];
    const csvContent = [
      headers.join(","),
      ...subscribers.map((s) => {
        const row = [
          `"${s.name.replace(/"/g, '""')}"`,
          `"${s.email.replace(/"/g, '""')}"`,
          `"${s.segment.replace(/"/g, '""')}"`,
          `"${s.firstSignal.replace(/"/g, '""')}"`,
          `"${s.message.replace(/"/g, '""')}"`,
        ];
        return row.join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `subscribers_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({
      title: "Exported",
      description: "Subscribers list exported to CSV",
      variant: "success",
    });
  }

  const totalSubscribers = subscribers.length.toLocaleString();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const activeThisWeekCount = subscribers.filter((s) => {
    if (!s.firstSignal) return false;
    const d = new Date(s.firstSignal);
    return d >= weekAgo;
  }).length;
  const activeThisWeek = `+${activeThisWeekCount}`;
  const unsubscribeRate = "—";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-teal-400 uppercase sm:text-3xl lg:text-4xl">
        Email list
      </h1>
      {error && (
        <div className="p-3 text-red-300 rounded-md border border-red-500/50 bg-red-900/30">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">
              TOTAL SUBSCRIBERS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-teal-400">
              {totalSubscribers}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">
              ACTIVE THIS WEEK
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-teal-400">
              {activeThisWeek}
            </div>
          </CardContent>
        </Card>
        {/* <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">UNSUBSCRIBE RATE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-destructive">{unsubscribeRate}</div>
          </CardContent>
        </Card> */}
      </div>

      <div className="flex gap-2 justify-end items-center">
        {/* <Button variant="outline">
          <Filter className="mr-2 w-4 h-4" />
          FILTER
        </Button> */}
        <Button onClick={handleExportCSV}>
          <Download className="mr-2 w-4 h-4" />
          EXPORT CSV
        </Button>
      </div>

      <Card className="bg-[#111111] border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-sm font-medium text-left text-gray-400">
                    SL
                  </th>
                  <th className="p-4 text-sm font-medium text-left text-gray-400">
                    NAME
                  </th>
                  <th className="p-4 text-sm font-medium text-left text-gray-400">
                    EMAIL
                  </th>
                  <th className="p-4 text-sm font-medium text-left text-gray-400">
                    MESSAGE
                  </th>
                  <th className="p-4 text-sm font-medium text-left text-gray-400">
                    SEGMENT
                  </th>
                  <th className="p-4 text-sm font-medium text-left text-gray-400">
                    FIRST SIGNAL
                  </th>
                  <th className="p-4 text-sm font-medium text-left text-gray-400">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <EpisodesTableShimmer />
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td className="p-4 text-center text-gray-400" colSpan={7}>
                      No subscribers found
                    </td>
                  </tr>
                ) : (
                  subscribers.map((subscriber, index) => (
                    <tr
                      key={index}
                      className="border-b border-border hover:bg-accent/5"
                    >
                      <td className="p-4 text-gray-400">{index + 1}</td>
                      <td className="p-4">
                        <span className="font-medium text-teal-400">
                          {subscriber.name}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 items-center">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-teal-400">
                            {subscriber.email}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400">
                        {subscriber.message}
                      </td>
                      <td className="p-4 text-gray-400">
                        {subscriber.segment}
                      </td>
                      <td className="p-4 text-gray-400">
                        {subscriber.firstSignal
                          ? subscriber.firstSignal
                              .replace("T", " ")
                              .slice(0, 16)
                          : ""}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => requestDelete(subscriber)}
                          disabled={!isAuthenticated}
                        >
                          <Trash2 className="mr-2 w-4 h-4" />
                          DELETE
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              {pendingDelete
                ? `Are you sure you want to delete ${pendingDelete.email}? This action cannot be undone.`
                : "Are you sure you want to delete this entry? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                handleDelete(pendingDelete?.id, pendingDelete?.source)
              }
              disabled={!pendingDelete || deletingId === pendingDelete?.id}
            >
              {deletingId === pendingDelete?.id ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
