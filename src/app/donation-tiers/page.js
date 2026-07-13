"use client";

import { MainLayout } from "@/components/layout/main-layout";
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
import { Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DonationTiersPage() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tierToDelete, setTierToDelete] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/donation-tiers");
      const data = await res.json();
      setTiers(data);
    } catch (error) {
      console.error("Failed to fetch donation tiers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (tier) => {
    setTierToDelete(tier);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!tierToDelete) return;
    try {
      const res = await fetch(`/api/donation-tiers/${tierToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      addToast({ title: "Deleted", description: "Tier deleted successfully." });
      await fetchTiers();
    } catch {
      addToast({
        title: "Error",
        description: "Failed to delete tier.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setTierToDelete(null);
    }
  };

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / DONATION TIERS">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-400 sm:text-3xl lg:text-4xl">
            DONATION TIERS
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchTiers}>
              REFRESH
            </Button>
            <Link href="/donation-tiers/create">
              <Button className="font-semibold text-black bg-teal-500 hover:bg-teal-600">
                <Plus className="mr-2 w-4 h-4" />
                NEW TIER
              </Button>
            </Link>
          </div>
        </div>

        <Card className="bg-[#111111] border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-[#0a0a0a]/50">
                    <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                      Sort
                    </th>
                    <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                      Tier
                    </th>
                    <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                      Price
                    </th>
                    <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                      Type
                    </th>
                    <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                      Published
                    </th>
                    <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                      Subscription
                    </th>
                    <th className="p-4 text-xs font-medium tracking-wider text-right text-gray-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center">
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="w-24 h-4 rounded bg-[#1a1a1a] animate-pulse"
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ) : tiers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400">
                        No donation tiers found. Create one to get started.
                      </td>
                    </tr>
                  ) : (
                    tiers.map((tier) => (
                      <tr
                        key={tier.id}
                        className="transition-colors hover:bg-accent/5"
                      >
                        <td className="p-4 text-sm text-gray-400">
                          {tier.sortOrder}
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-medium text-white">
                            {tier.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {tier.tierId}
                          </div>
                        </td>
                        <td className="p-4 text-sm font-medium text-white">
                          {tier.isCustomAmount
                            ? "Custom"
                            : tier.price
                              ? `$${tier.price}`
                              : "—"}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={
                              tier.isCustomAmount
                                ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                                : "border-teal-500/30 bg-teal-500/10 text-teal-400"
                            }
                          >
                            {tier.isCustomAmount ? "CUSTOM" : "FIXED"}
                          </Badge>
                          {tier.isFeatured && (
                            <Badge
                              variant="outline"
                              className="ml-1 border-purple-500/30 bg-purple-500/10 text-purple-400"
                            >
                              FEATURED
                            </Badge>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={
                              tier.isPublished
                                ? "border-green-500/30 bg-green-500/10 text-green-400"
                                : "border-gray-500/30 bg-gray-500/10 text-gray-400"
                            }
                          >
                            {tier.isPublished ? "YES" : "NO"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={
                              tier.isSubscription
                                ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                                : "border-gray-500/30 bg-gray-500/10 text-gray-400"
                            }
                          >
                            {tier.isSubscription ? "YES" : "NO"}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <Link href={`/donation-tiers/${tier.id}/edit`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-0 w-8 h-8"
                              >
                                <Pencil className="w-4 h-4 text-teal-400" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 w-8 h-8"
                              onClick={() => handleDeleteClick(tier)}
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
            <AlertDialogTitle>Delete Tier?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently delete the{" "}
              <span className="font-mono text-teal-400">
                {tierToDelete?.label}
              </span>{" "}
              tier. Existing donations linked to this tier_id will not be
              affected.
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
