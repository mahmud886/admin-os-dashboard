"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { SupporterDonationsTableShimmer } from "@/components/shimmer/supporter-donations-table-shimmer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { tierPrices } from "@/data/payments";
import { Download, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function SupporterDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    archivist: 0,
    emblem: 0,
    patron: 0,
    donation: 0,
  });
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/supporter-donations?limit=100"); // Fetch 100 for now
      const data = await response.json();

      if (data.donations) {
        setDonations(data.donations);
        setTotal(data.total);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error("Failed to fetch donations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (donation) => {
    setDonationToDelete(donation);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!donationToDelete) return;

    try {
      const response = await fetch(
        `/api/supporter-donations/${donationToDelete.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete donation");
      }

      addToast({
        title: "Success",
        description: "Donation deleted successfully.",
      });
      await fetchDonations();
    } catch (err) {
      console.error("Error deleting donation:", err);
      addToast({
        title: "Error",
        description: err.message || "Failed to delete donation.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDonationToDelete(null);
    }
  };

  const getType = (tierId) => {
    if (tierId === "support-universe") return "DONATION";
    return "TIER";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
      case "succeeded":
      case "completed":
        return "border-green-500 bg-green-500/10 text-green-400";
      case "pending":
      case "processing":
        return "border-yellow-500 bg-yellow-500/10 text-yellow-400";
      case "cancelled":
      case "refunded":
        return "border-red-500 bg-red-500/10 text-red-400";
      default:
        return "border-gray-500 bg-gray-500/10 text-gray-400";
    }
  };

  const getModeClass = (livemode) => {
    if (livemode === true)
      return "border-green-500 bg-green-500/10 text-green-400";
    if (livemode === false)
      return "border-yellow-500 bg-yellow-500/10 text-yellow-400";
    return "border-gray-500 bg-gray-500/10 text-gray-400";
  };

  const getModeLabel = (livemode) => {
    if (livemode === true) return "LIVE";
    if (livemode === false) return "TEST";
    return "—";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExportCSV = () => {
    if (!donations.length) {
      addToast({
        title: "No data",
        description: "No donations to export",
        variant: "warning",
      });
      return;
    }

    const headers = [
      "Supporter Name",
      "Email",
      "Mailing Address",
      "Amount",
      "Currency",
      "Type",
      "Tier Name",
      "Status",
      "Mode",
      "Created At",
    ];

    const csvContent = [
      headers.join(","),
      ...donations.map((d) => {
        const row = [
          `"${(d.supporter_name || "Anonymous").replace(/"/g, '""')}"`,
          `"${(d.supporter_email || "").replace(/"/g, '""')}"`,
          `"${(d.mailing_address || "").replace(/"/g, '""')}"`,
          `"${d.amount || 0}"`,
          `"${(d.currency || "USD").toUpperCase()}"`,
          `"${getType(d.tier_id)}"`,
          `"${(d.tier_name || "").replace(/"/g, '""')}"`,
          `"${d.status || ""}"`,
          `"${getModeLabel(d.metadata?.livemode)}"`,
          `"${d.created_at ? new Date(d.created_at).toISOString() : ""}"`,
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
      `donations_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({
      title: "Exported",
      description: "Donations list exported to CSV",
      variant: "success",
    });
  };

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / SUPPORTER DONATIONS">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 justify-between items-start sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-teal-400 sm:text-3xl lg:text-4xl">
            SUPPORTER DONATIONS
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchDonations}>
              REFRESH DATA
            </Button>
            <Button onClick={handleExportCSV}>
              <Download className="mr-2 w-4 h-4" />
              EXPORT CSV
            </Button>
          </div>
        </div>

        <Card className="bg-[#111111] border-border">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 rounded border border-teal-400/50 bg-teal-900/20">
                <div className="font-semibold text-teal-400">THE ARCHIVIST</div>
                <div className="text-sm text-gray-300">
                  $ {tierPrices["THE ARCHIVIST"].USD}
                </div>
                <div className="text-xs text-gray-400">
                  USERS: {stats.archivist}
                </div>
              </div>
              <div className="p-4 rounded border border-teal-400/50 bg-teal-900/20">
                <div className="font-semibold text-teal-400">THE EMBLEM</div>
                <div className="text-sm text-gray-300">
                  $ {tierPrices["THE EMBLEM"].USD}
                </div>
                <div className="text-xs text-gray-400">
                  USERS: {stats.emblem}
                </div>
              </div>
              <div className="p-4 rounded border border-teal-400/50 bg-teal-900/20">
                <div className="font-semibold text-teal-400">THE PATRON</div>
                <div className="text-sm text-gray-300">
                  $ {tierPrices["THE PATRON"].USD}
                </div>
                <div className="text-xs text-gray-400">
                  USERS: {stats.patron}
                </div>
              </div>
              <div className="flex flex-col gap-2 p-4 rounded border border-yellow-400/50 bg-yellow-900/20">
                <div className="font-semibold text-yellow-400">
                  SUPPORT THE UNIVERSE
                </div>
                <div className="text-sm text-gray-300">DONATE ANY AMOUNT</div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-400">
                    USERS: {stats.donation}
                  </div>
                  <Button size="sm">DONATE</Button>
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              TOTAL DONATIONS: {total}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-[#0a0a0a]/50">
                    <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                      Supporter
                    </th>
                    <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                      Tier
                    </th>
                    <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                      Amount
                    </th>
                    <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                      Status
                    </th>
                    <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                      Mode
                    </th>
                    <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                      Date
                    </th>
                    <th className="p-4 text-xs font-medium tracking-wider text-right text-gray-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <SupporterDonationsTableShimmer />
                  ) : donations.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-400">
                        No donations found
                      </td>
                    </tr>
                  ) : (
                    donations.map((p) => (
                      <tr
                        key={p.id}
                        className="transition-colors hover:bg-accent/5"
                      >
                        <td className="p-4">
                          <div className="text-sm font-medium text-white">
                            {p.supporter_name || "Anonymous"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {p.supporter_email}
                          </div>
                          {p.mailing_address && (
                            <div
                              className="mt-0.5 max-w-[220px] truncate text-xs text-gray-600"
                              title={p.mailing_address}
                            >
                              {p.mailing_address}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-white">
                            {p.tier_name || "—"}
                          </div>
                          <Badge
                            variant="outline"
                            className="mt-1 text-[10px] border-teal-500/30 bg-teal-500/5 text-teal-400"
                          >
                            {getType(p.tier_id)}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm font-medium text-white">
                          {p.amount
                            ? `${p.amount} ${(p.currency || "USD").toUpperCase()}`
                            : "—"}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={getStatusColor(p.status)}
                          >
                            {p.status?.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={getModeClass(p.metadata?.livemode)}
                          >
                            {getModeLabel(p.metadata?.livemode)}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-gray-400">
                          {formatDate(p.created_at)}
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 w-8 h-8"
                            onClick={() => handleDeleteClick(p)}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
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
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#111111] border-border text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the
              donation from{" "}
              <span className="font-mono text-teal-400">
                {donationToDelete?.supporter_name || "Anonymous"}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-white bg-transparent border-border hover:bg-white/10 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="text-white bg-red-600 border-none hover:bg-red-700"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
