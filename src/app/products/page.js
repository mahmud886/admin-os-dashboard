"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product.");
      }
    } catch {
      alert("Failed to delete product.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / PRODUCT STORE">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-400">
            STORE MANIFEST
          </h1>
          <Link href="/products/create">
            <Button className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-black font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              FORGE NEW ARTIFACT
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-lg bg-[#1a1a1a] animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="bg-[#111111] border-border">
            <CardContent className="py-16 flex flex-col items-center justify-center gap-4 text-center">
              <p className="text-gray-400 text-sm">
                No artifacts yet. Forge your first one.
              </p>
              <Link href="/products/create">
                <Button className="bg-teal-500 hover:bg-teal-600 text-black font-semibold">
                  <Plus className="h-4 w-4 mr-2" /> Create First Artifact
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card
                key={product.id}
                className="bg-[#111111] border-border overflow-hidden group hover:border-teal-500/40 transition-colors"
              >
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0 border border-border">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs font-mono">
                        NO IMG
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {product.name}
                    </p>
                    <p className="text-teal-400 font-mono text-sm mt-0.5">
                      ${parseFloat(product.price).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className="text-[10px] border-border text-gray-400"
                      >
                        {product.category}
                      </Badge>
                      <Badge
                        className={`text-[10px] ${
                          product.availabilityStatus === "active"
                            ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`}
                        variant="outline"
                      >
                        {product.availabilityStatus}
                      </Badge>
                      {product.isPublished ? (
                        <Badge
                          className="text-[10px] bg-green-500/20 text-green-400 border-green-500/30"
                          variant="outline"
                        >
                          <Eye className="w-2.5 h-2.5 mr-1" /> Published
                        </Badge>
                      ) : (
                        <Badge
                          className="text-[10px] bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          variant="outline"
                        >
                          <EyeOff className="w-2.5 h-2.5 mr-1" /> Draft
                        </Badge>
                      )}
                      {product.isLimited && (
                        <Badge
                          className="text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30"
                          variant="outline"
                        >
                          LIMITED
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex border-t border-border">
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs text-gray-400 hover:text-teal-400 hover:bg-teal-400/5 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deleting === product.id}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-colors border-l border-border disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {deleting === product.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
