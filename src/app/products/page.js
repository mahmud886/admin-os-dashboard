"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [reordering, setReordering] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);
  const dragNode = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(
        Array.isArray(data) ? data.map((p, i) => ({ ...p, sortOrder: i })) : [],
      );
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }

  // ── Drag-and-drop handlers ──────────────────────────────────────────────

  function handleDragStart(e, index) {
    dragNode.current = e.currentTarget;
    setDragIndex(index);
    // Small delay so the drag image renders before the card fades
    setTimeout(() => setDragIndex(index), 0);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (index !== dropIndex) setDropIndex(index);
  }

  function handleDrop(e, index) {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      applyReorder(dragIndex, index);
    }
    setDragIndex(null);
    setDropIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setDropIndex(null);
  }

  // ── Shared reorder logic (used by drag-drop and arrow buttons) ──────────

  async function applyReorder(fromIndex, toIndex) {
    const updated = [...products];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    const withOrders = updated.map((p, i) => ({ ...p, sortOrder: i }));
    setProducts(withOrders);

    // Only save products whose sort_order actually changed
    const changed = withOrders.filter(
      (p) => products.find((o) => o.id === p.id)?.sortOrder !== p.sortOrder,
    );

    setReordering("saving");
    try {
      await Promise.all(
        changed.map((p) =>
          fetch(`/api/products/${p.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...p }),
          }),
        ),
      );
    } catch {
      fetchProducts();
    } finally {
      setReordering(null);
    }
  }

  async function moveProduct(index, direction) {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= products.length) return;
    await applyReorder(index, target);
  }

  // ── Delete ──────────────────────────────────────────────────────────────

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
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-400">
              STORE MANIFEST
            </h1>
            <p className="text-[11px] text-gray-500 mt-1">
              Drag cards to reorder, or use the ↑ ↓ arrows
            </p>
          </div>
          <div className="flex items-center gap-3">
            {reordering === "saving" && (
              <span className="text-[11px] text-teal-400 font-mono animate-pulse">
                Saving order...
              </span>
            )}
            <Link href="/products/create">
              <Button className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-black font-semibold">
                <Plus className="h-4 w-4 mr-2" />
                FORGE NEW ARTIFACT
              </Button>
            </Link>
          </div>
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
            {products.map((product, index) => (
              <Card
                key={product.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-[#111111] border-border overflow-hidden transition-all duration-150
                  ${dragIndex === index ? "opacity-40 scale-[0.98]" : ""}
                  ${dropIndex === index && dragIndex !== index ? "border-teal-400 shadow-[0_0_0_2px_rgba(45,212,191,0.4)]" : "hover:border-teal-500/40"}
                `}
              >
                {/* Drag handle strip */}
                <div className="flex items-center justify-between px-3 pt-2 pb-1 border-b border-border/40 cursor-grab active:cursor-grabbing">
                  <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                    #{index + 1}
                  </span>
                  <GripVertical className="w-4 h-4 text-gray-600 hover:text-teal-400 transition-colors" />
                </div>

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
                  <button
                    onClick={() => moveProduct(index, "up")}
                    disabled={index === 0 || !!reordering}
                    title="Move up"
                    className="flex items-center justify-center py-2.5 px-3 text-gray-400 hover:text-teal-400 hover:bg-teal-400/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed border-r border-border"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveProduct(index, "down")}
                    disabled={index === products.length - 1 || !!reordering}
                    title="Move down"
                    className="flex items-center justify-center py-2.5 px-3 text-gray-400 hover:text-teal-400 hover:bg-teal-400/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed border-r border-border"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
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
