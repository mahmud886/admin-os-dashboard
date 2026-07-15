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
import { Download, FileText, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function SupporterDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [donationsRes, tiersRes] = await Promise.all([
        fetch("/api/supporter-donations?limit=100"),
        fetch("/api/donation-tiers"),
      ]);
      const donationsData = await donationsRes.json();
      const tiersData = await tiersRes.json();

      if (donationsData.donations) {
        setDonations(donationsData.donations);
        setTotal(donationsData.total);
        if (donationsData.stats) setStats(donationsData.stats);
      }
      if (Array.isArray(tiersData)) setTiers(tiersData);
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
        { method: "DELETE" },
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete donation");
      }
      addToast({
        title: "Success",
        description: "Donation deleted successfully.",
      });
      await fetchAll();
    } catch (err) {
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

  const getType = (tierId) => {
    const tier = tiers.find((t) => t.tierId === tierId || t.tier_id === tierId);
    if (tier) return tier.isCustomAmount ? "DONATION" : "TIER";
    return tierId === "support-universe" ? "DONATION" : "TIER";
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
      "Order Reference",
      "Name",
      "Address",
      "Order Placed",
      "Email",
      "Amount",
      "Tier",
      "Status",
    ];

    const csvContent = [
      headers.join(","),
      ...donations.map((d) => {
        const row = [
          `"${(d.donation_number || "—").replace(/"/g, '""')}"`,
          `"${(d.supporter_name || "Anonymous").replace(/"/g, '""')}"`,
          `"${(d.mailing_address || "").replace(/"/g, '""')}"`,
          `"${d.created_at ? new Date(d.created_at).toLocaleString("en-US") : ""}"`,
          `"${(d.supporter_email || "").replace(/"/g, '""')}"`,
          `"$${d.amount || 0} ${(d.currency || "USD").toUpperCase()}"`,
          `"${(d.tier_name || "").replace(/"/g, '""')}"`,
          `"${(d.status || "").toUpperCase()}"`,
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
      description: "Donations exported to CSV",
      variant: "success",
    });
  };

  const handlePrintInvoice = (d) => {
    const date = d.created_at
      ? new Date(d.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "—";
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Invoice ${d.donation_number || ""}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Arial,sans-serif;color:#111;padding:48px;max-width:640px;margin:0 auto}
  .top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px}
  .brand{font-size:22px;font-weight:900;letter-spacing:0.25em}
  .brand span{color:#555;font-size:11px;display:block;font-weight:400;letter-spacing:0.15em;margin-top:2px}
  .inv-label{text-align:right}
  .inv-label h2{font-size:20px;font-weight:700;letter-spacing:0.1em}
  .inv-label p{font-size:12px;color:#555;margin-top:4px;font-family:monospace}
  hr{border:none;border-top:1px solid #ddd;margin:20px 0}
  .section{margin-bottom:20px}
  .section h3{font-size:10px;letter-spacing:0.2em;color:#888;text-transform:uppercase;margin-bottom:8px}
  .section p{font-size:13px;line-height:1.7;color:#333}
  table{width:100%;border-collapse:collapse;margin:20px 0}
  th{font-size:10px;letter-spacing:0.15em;color:#888;text-transform:uppercase;text-align:left;padding:8px 0;border-bottom:1px solid #ddd}
  td{padding:10px 0;font-size:13px;border-bottom:1px solid #f0f0f0;vertical-align:top}
  .total-row td{font-weight:700;font-size:15px;border-top:2px solid #111;border-bottom:none;padding-top:14px}
  .status{display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:0.1em;background:${d.status === "paid" ? "#dcfce7" : "#fef9c3"};color:${d.status === "paid" ? "#15803d" : "#92400e"}}
  .footer{margin-top:40px;font-size:10px;color:#aaa;text-align:center;letter-spacing:0.1em}
  @media print{body{padding:24px}}
</style></head><body>
<div class="top">
  <div class="brand">SPORE FALL<span>A Sci-Fi Micro-Drama</span></div>
  <div class="inv-label"><h2>INVOICE</h2><p>${d.donation_number || "—"}</p></div>
</div>
<hr>
<div class="section"><h3>Bill To</h3>
  <p><strong>${d.supporter_name || "Anonymous"}</strong></p>
  ${d.supporter_email ? `<p>${d.supporter_email}</p>` : ""}
  ${d.mailing_address ? `<p>${d.mailing_address}</p>` : ""}
</div>
<div class="section"><h3>Invoice Date</h3><p>${date}</p></div>
<hr>
<table>
  <thead><tr><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
  <tbody>
    <tr><td>${d.tier_name || "Contribution"}</td><td style="text-align:right">$${d.amount} ${(d.currency || "USD").toUpperCase()}</td></tr>
    <tr class="total-row"><td>Total</td><td style="text-align:right">$${d.amount} ${(d.currency || "USD").toUpperCase()}</td></tr>
  </tbody>
</table>
<p>Status: <span class="status">${(d.status || "").toUpperCase()}</span></p>
<div class="footer">Thank you for supporting Spore Fall &mdash; sporefall.com</div>
<script>window.onload=function(){window.print();}</script>
</body></html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
  };

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / SUPPORTER DONATIONS">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 justify-between items-start sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-teal-400 sm:text-3xl lg:text-4xl">
            SUPPORTER DONATIONS
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchAll}>
              REFRESH DATA
            </Button>
            <Button onClick={handleExportCSV}>
              <Download className="mr-2 w-4 h-4" />
              EXPORT CSV
            </Button>
          </div>
        </div>

        {/* Dynamic stats cards */}
        <Card className="bg-[#111111] border-border">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tiers.length === 0
                ? [1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-20 rounded border border-border bg-[#1a1a1a] animate-pulse"
                    />
                  ))
                : tiers.map((tier) => (
                    <div
                      key={tier.id || tier.tierId}
                      className={`p-4 rounded border ${
                        tier.isCustomAmount
                          ? "border-yellow-400/50 bg-yellow-900/20"
                          : "border-teal-400/50 bg-teal-900/20"
                      }`}
                    >
                      <div
                        className={`font-semibold ${tier.isCustomAmount ? "text-yellow-400" : "text-teal-400"}`}
                      >
                        {tier.label}
                      </div>
                      <div className="text-sm text-gray-300">
                        {tier.isCustomAmount
                          ? "DONATE ANY AMOUNT"
                          : tier.price
                            ? `$ ${tier.price}`
                            : "—"}
                      </div>
                      <div className="text-xs text-gray-400">
                        SUPPORTERS: {stats[tier.tierId || tier.tier_id] || 0}
                      </div>
                    </div>
                  ))}
            </div>
            <div className="mt-4 text-sm text-gray-400">
              TOTAL DONATIONS: {total}
            </div>
          </CardContent>
        </Card>

        {/* Donations table */}
        <Card className="bg-[#111111] border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-[#0a0a0a]/50">
                    <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                      Ref
                    </th>
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
                      <td colSpan="8" className="p-8 text-center text-gray-400">
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
                          <span className="font-mono text-xs text-gray-500">
                            {p.donation_number || "—"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-medium text-white">
                            {p.supporter_name || "Anonymous"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {p.supporter_email}
                          </div>
                          {p.mailing_address && (
                            <div
                              className="mt-0.5 max-w-[200px] truncate text-xs text-gray-600"
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
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 w-8 h-8"
                              title="Download Invoice"
                              onClick={() => handlePrintInvoice(p)}
                            >
                              <FileText className="w-4 h-4 text-teal-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 w-8 h-8"
                              onClick={() => handleDeleteClick(p)}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
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
              This will permanently delete the donation from{" "}
              <span className="font-mono text-teal-400">
                {donationToDelete?.supporter_name || "Anonymous"}
              </span>
              {donationToDelete?.donation_number && (
                <span className="ml-1 text-gray-500">
                  ({donationToDelete.donation_number})
                </span>
              )}
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
