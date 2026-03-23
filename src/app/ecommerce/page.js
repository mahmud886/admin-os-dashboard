'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function EcommerceDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/ecommerce/stats');
        const data = await response.json();
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.recent_orders) {
          setRecentOrders(data.recent_orders);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  console.log('Recent Orders:', recentOrders);

  return (
    <MainLayout breadcrumb="ECOMMERCE / OVERVIEW">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-teal-400 sm:text-3xl lg:text-4xl">STORE OVERVIEW</h1>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-[#111111] border-border">
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-400">TOTAL REVENUE</CardTitle>
              <DollarSign className="w-4 h-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : formatCurrency(stats?.total_revenue || 0)}
              </div>
              <p className="mt-1 text-xs text-gray-500">Lifetime revenue</p>
            </CardContent>
          </Card>
          <Card className="bg-[#111111] border-border">
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-400">TOTAL ORDERS</CardTitle>
              <ShoppingCart className="w-4 h-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{loading ? '...' : stats?.total_orders || 0}</div>
              <p className="mt-1 text-xs text-gray-500">All time orders</p>
            </CardContent>
          </Card>
          <Card className="bg-[#111111] border-border">
            <CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-400">CUSTOMERS</CardTitle>
              <Users className="w-4 h-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{loading ? '...' : stats?.total_customers || 0}</div>
              <p className="mt-1 text-xs text-gray-500">Registered customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-teal-400">
                <span>RECENT ORDERS</span>
                <Link href="/ecommerce/orders">
                  <Button variant="ghost" size="sm" className="text-xs">
                    VIEW ALL <ArrowUpRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="py-4 text-center text-gray-500">Loading recent activity...</div>
                ) : recentOrders.length === 0 ? (
                  <div className="py-4 text-center text-gray-500">No recent orders found.</div>
                ) : (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-[#0a0a0a]/50"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="flex justify-center items-center w-9 h-9 rounded-full bg-teal-400/10">
                          <Package className="w-5 h-5 text-teal-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{order.order_number}</p>
                          <p className="text-xs text-gray-500">{order.ecommerce_customers?.email || 'Guest'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{formatCurrency(order.amount_total)}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="col-span-3 bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-teal-400">QUICK ACTIONS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/products">
                <Button
                  variant="outline"
                  className="justify-start w-full h-12 border-border hover:bg-teal-400/10 hover:text-teal-400"
                >
                  <Package className="mr-2 w-4 h-4" />
                  MANAGE PRODUCTS
                </Button>
              </Link>
              <Link href="/ecommerce/orders">
                <Button
                  variant="outline"
                  className="justify-start w-full h-12 border-border hover:bg-teal-400/10 hover:text-teal-400"
                >
                  <ShoppingCart className="mr-2 w-4 h-4" />
                  VIEW ALL ORDERS
                </Button>
              </Link>
              <Link href="/ecommerce/customers">
                <Button
                  variant="outline"
                  className="justify-start w-full h-12 border-border hover:bg-teal-400/10 hover:text-teal-400"
                >
                  <Users className="mr-2 w-4 h-4" />
                  CUSTOMER DATABASE
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
