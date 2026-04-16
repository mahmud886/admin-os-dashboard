"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { SupporterDonationsTableShimmer } from "@/components/shimmer/supporter-donations-table-shimmer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { tierPrices } from "@/data/payments";
import { Download } from "lucide-react";
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

  const getType = (tierId) => {
    if (tierId === "support-universe") return "DONATION";
    return "TIER";
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
                      ADDRESS
                    </th>
                    <th className="p-4 text-sm font-medium text-left text-gray-400">
                      AMOUNT
                    </th>
                    <th className="p-4 text-sm font-medium text-left text-gray-400">
                      TYPE
                    </th>
                    <th className="p-4 text-sm font-medium text-left text-gray-400">
                      TIER
                    </th>
                    <th className="p-4 text-sm font-medium text-left text-gray-400">
                      STATUS
                    </th>
                    <th className="p-4 text-sm font-medium text-left text-gray-400">
                      CREATED
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <SupporterDonationsTableShimmer />
                  ) : donations.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-gray-400">
                        No donations found
                      </td>
                    </tr>
                  ) : (
                    donations.map((p, i) => (
                      <tr key={p.id} className="hover:bg-accent/5">
                        <td className="p-4 text-gray-400">{i + 1}</td>
                        <td className="p-4 font-medium text-teal-400">
                          {p.supporter_name || "Anonymous"}
                        </td>
                        <td className="p-4 text-gray-300">
                          {p.supporter_email}
                        </td>
                        <td
                          className="p-4 max-w-xs text-gray-300 truncate"
                          title={p.mailing_address}
                        >
                          {p.mailing_address || "—"}
                        </td>
                        <td className="p-4 font-semibold text-teal-400">
                          {p.amount
                            ? `${p.amount} ${p.currency?.toUpperCase() || "USD"}`
                            : "—"}
                        </td>
                        <td className="p-4 text-gray-300">
                          {getType(p.tier_id)}
                        </td>
                        <td className="p-4 text-gray-300">{p.tier_name}</td>
                        <td className="p-4">
                          <span
                            className={
                              p.status === "paid" || p.status === "succeeded"
                                ? "px-2 py-1 rounded border border-green-500/50 bg-green-500/20 text-green-400 text-xs"
                                : "px-2 py-1 rounded border border-yellow-500/50 bg-yellow-500/20 text-yellow-400 text-xs"
                            }
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300">
                          {p.created_at
                            ? new Date(p.created_at).toLocaleString()
                            : "—"}
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
    </MainLayout>
  );
}
