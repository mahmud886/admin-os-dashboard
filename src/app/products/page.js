'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import productsData from '@/data/products.json';

export default function ProductsPage() {
  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / PRODUCTS">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-400">STORE MANIFEST</h1>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">FORGE NEW ARTIFACT</span>
            <span className="sm:hidden">NEW ARTIFACT</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Artifact Details */}
          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-teal-400">ARTIFACT DETAILS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-teal-400">
                  ARTIFACT NAME
                </Label>
                <Input id="name" placeholder="e.g. Neural Link Tee" className="bg-[#0a0a0a] border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-teal-400">
                  BASE PRICE (USD)
                </Label>
                <Input id="price" type="number" placeholder="0.00" className="bg-[#0a0a0a] border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-teal-400">
                  DESCRIPTION MANIFEST
                </Label>
                <Textarea
                  id="description"
                  placeholder="Detail the artifact properties..."
                  className="min-h-[150px] bg-[#0a0a0a] border-border resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-teal-400">
                  CATEGORY
                </Label>
                <Select defaultValue={productsData.categories[0]}>
                  <SelectTrigger className="bg-[#0a0a0a] border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {productsData.categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="syncId" className="text-teal-400">
                  PRINTFUL SYNC ID
                </Label>
                <Input id="syncId" placeholder="PF-XXXXXXX" className="bg-[#0a0a0a] border-border" />
              </div>
            </CardContent>
          </Card>

          {/* Right Panel - Blueprint & Stock */}
          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-teal-400">BLUEPRINT & STOCK PARAMETERS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-teal-400">UPLOAD BLUEPRINT</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center bg-[#0a0a0a]">
                  <div className="w-16 h-16 border-2 border-muted-foreground rounded mb-4 flex items-center justify-center">
                    <div className="w-8 h-8 border border-muted-foreground"></div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">UPLOAD BLUEPRINT</p>
                  <p className="text-xs text-gray-400">SVE, PNB, UPB [MAX 5MB]</p>
                </div>
                <Button variant="outline" className="w-full bg-[#0a0a0a] border-border">
                  SELECT FROM LIBRARY
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-400">INVENTORY TRACKING</Label>
                  <div className="mt-2">
                    <Badge className="border-teal-400 bg-teal-400/50 text-teal-400 hover:bg-teal-400 transition-all duration-300 ease-in-out">
                      {productsData.stockStatus.inventoryTracking}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-400">CURRENT STOCK</Label>
                  <div className="mt-2 text-lg font-medium text-teal-400">{productsData.stockStatus.currentStock}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
