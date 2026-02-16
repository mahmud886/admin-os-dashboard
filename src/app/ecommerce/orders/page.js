'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { EcommerceOrdersTableShimmer } from '@/components/shimmer/ecommerce-orders-table-shimmer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Package, Search, ShoppingCart, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const getStatusColor = (status) => {
  switch (status) {
    case 'paid':
    case 'shipped':
    case 'completed':
      return 'border-green-500 bg-green-500/10 text-green-400';
    case 'pending':
    case 'processing':
      return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
    case 'cancelled':
    case 'refunded':
      return 'border-red-500 bg-red-500/10 text-red-400';
    default:
      return 'border-gray-500 bg-gray-500/10 text-gray-400';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCurrency = (amount, currency = 'usd') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = '/api/ecommerce/orders';
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch orders');

      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout breadcrumb="ECOMMERCE / ORDERS">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-400">ORDER MANIFEST</h1>
          <Button variant="outline" onClick={fetchOrders}>
            REFRESH DATA
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-[#111111] border-border">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Search orders..." className="pl-8 bg-[#0a0a0a] border-border" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px] bg-[#0a0a0a] border-border">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-[#111111] border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-[#0a0a0a]/50">
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="p-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <EcommerceOrdersTableShimmer />
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-400">
                        No orders found matching the criteria.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-accent/5 transition-colors">
                        <td className="p-4 font-mono text-sm text-teal-400">{order.order_number}</td>
                        <td className="p-4">
                          <div className="text-sm font-medium text-white">
                            {order.ecommerce_customers?.name || 'Guest'}
                          </div>
                          <div className="text-xs text-gray-500">{order.ecommerce_customers?.email}</div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={getStatusColor(order.status)}>
                            {order.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={getStatusColor(order.payment_status)}>
                            {order.payment_status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-white font-medium">
                          {formatCurrency(order.amount_total, order.currency)}
                        </td>
                        <td className="p-4 text-sm text-gray-400">{formatDate(order.created_at)}</td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4 text-teal-400" />
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

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="bg-[#111111] border-border text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-teal-400 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                ORDER MANIFEST: {selectedOrder?.order_number}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Created on {formatDate(selectedOrder?.created_at)} • {selectedOrder?.ecommerce_order_items?.length || 0}{' '}
                Items
              </DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6 mt-4">
                {/* Status Badges */}
                <div className="flex flex-wrap gap-4 p-4 bg-[#0a0a0a] rounded-lg border border-border">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 uppercase">Order Status</span>
                    <Badge variant="outline" className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 uppercase">Payment</span>
                    <Badge variant="outline" className={getStatusColor(selectedOrder.payment_status)}>
                      {selectedOrder.payment_status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1 ml-auto text-right">
                    <span className="text-xs text-gray-500 uppercase">Total Amount</span>
                    <span className="text-lg font-bold text-teal-400">
                      {formatCurrency(selectedOrder.amount_total, selectedOrder.currency)}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0a0a0a] rounded-lg border border-border">
                    <h3 className="text-sm font-medium text-teal-400 mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" /> CUSTOMER
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium text-white">{selectedOrder.ecommerce_customers?.name || 'Guest'}</p>
                      <p className="text-gray-400">{selectedOrder.ecommerce_customers?.email}</p>
                      <p className="text-gray-400">{selectedOrder.ecommerce_customers?.phone}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-[#0a0a0a] rounded-lg border border-border">
                    <h3 className="text-sm font-medium text-teal-400 mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" /> SHIPPING
                    </h3>
                    <div className="space-y-1 text-sm text-gray-400">
                      {selectedOrder.shipping_address ? (
                        <>
                          <p>{selectedOrder.shipping_address.line1}</p>
                          {selectedOrder.shipping_address.line2 && <p>{selectedOrder.shipping_address.line2}</p>}
                          <p>
                            {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.postal_code}
                          </p>
                          <p>{selectedOrder.shipping_address.country}</p>
                        </>
                      ) : (
                        <p className="italic">No shipping address provided</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-sm font-medium text-teal-400 mb-3">ORDER ITEMS</h3>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-[#0a0a0a]">
                        <tr className="text-left text-xs text-gray-500 uppercase">
                          <th className="p-3 font-medium">Product</th>
                          <th className="p-3 font-medium text-right">Price</th>
                          <th className="p-3 font-medium text-right">Qty</th>
                          <th className="p-3 font-medium text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-[#111111]">
                        {selectedOrder.ecommerce_order_items?.map((item) => (
                          <tr key={item.id}>
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                {item.image_url ? (
                                  <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                                    <img
                                      src={item.image_url}
                                      alt={item.product_name}
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                        e.target.parentElement.innerHTML =
                                          '<svg class="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>';
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="h-10 w-10 rounded-md bg-gray-800 flex items-center justify-center flex-shrink-0">
                                    <Package className="h-5 w-5 text-gray-500" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium text-white">{item.product_name}</div>
                                  {item.variant_id && (
                                    <div className="text-xs text-gray-500">Variant: {item.variant_id}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-right text-gray-400">
                              {formatCurrency(item.unit_amount, selectedOrder.currency)}
                            </td>
                            <td className="p-3 text-right text-white">{item.quantity}</td>
                            <td className="p-3 text-right font-medium text-white">
                              {formatCurrency(item.total_amount, selectedOrder.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
