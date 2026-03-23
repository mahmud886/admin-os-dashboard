'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { EcommerceCustomersTableShimmer } from '@/components/shimmer/ecommerce-customers-table-shimmer';
import { EcommerceOrdersTableShimmer } from '@/components/shimmer/ecommerce-orders-table-shimmer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast';
import { Download, Eye, Package, Search, ShoppingCart, Trash2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  // Convert string to number if needed, handle NaN gracefully
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  const safeAmount = isNaN(numericAmount) ? 0 : numericAmount;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(safeAmount);
};

const calculateTotal = (order) => {
  if (!order) return 0;
  // If amount_total already includes tax and shipping in the future, we might need a flag.
  // But for now, we add metadata tax and shipping to the base amount.
  const baseAmount =
    typeof order.amount_total === 'string' ? parseFloat(order.amount_total) : Number(order.amount_total) || 0;
  const tax =
    typeof order.metadata?.tax === 'string' ? parseFloat(order.metadata.tax) : Number(order.metadata?.tax) || 0;
  const shipping =
    typeof order.metadata?.shipping === 'string'
      ? parseFloat(order.metadata.shipping)
      : Number(order.metadata?.shipping) || 0;
  return baseAmount + tax + shipping;
};

export default function OrdersPage() {
  const router = useRouter();
  const { addToast } = useToast();

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Customers State
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customerSearch, setCustomerSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  useEffect(() => {
    fetchCustomers();
  }, [customerSearch]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = '/api/ecommerce/orders';
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }

      const response = await fetch(url, { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch orders');

      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      addToast({
        title: 'Error',
        description: 'Failed to fetch orders.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setCustomersLoading(true);
      let url = '/api/ecommerce/customers';
      if (customerSearch) {
        url += `?search=${customerSearch}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch customers');

      setCustomers(data.customers || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      // Optional: toast error only if meaningful
    } finally {
      setCustomersLoading(false);
    }
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      const response = await fetch(`/api/ecommerce/orders/${orderToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete order');
      }

      addToast({
        title: 'Success',
        description: 'Order deleted successfully.',
      });

      await fetchOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
      addToast({
        title: 'Error',
        description: err.message || 'Failed to delete order.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleExportOrdersCSV = () => {
    if (!orders.length) {
      addToast({ title: 'No data', description: 'No orders to export', variant: 'warning' });
      return;
    }

    const headers = [
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Status',
      'Payment Status',
      'Total',
      'Currency',
      'Date',
    ];

    const csvContent = [
      headers.join(','),
      ...orders.map((order) => {
        const row = [
          `"${(order.order_number || '').replace(/"/g, '""')}"`,
          `"${(order.ecommerce_customers?.name || 'Guest').replace(/"/g, '""')}"`,
          `"${(order.ecommerce_customers?.email || '').replace(/"/g, '""')}"`,
          `"${(order.status || '').replace(/"/g, '""')}"`,
          `"${(order.payment_status || '').replace(/"/g, '""')}"`,
          `"${calculateTotal(order)}"`,
          `"${(order.currency || 'USD').toUpperCase()}"`,
          `"${order.created_at ? new Date(order.created_at).toISOString() : ''}"`,
        ];
        return row.join(',');
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ title: 'Exported', description: 'Orders list exported to CSV', variant: 'success' });
  };

  const handleExportCustomersCSV = () => {
    if (!customers.length) {
      addToast({ title: 'No data', description: 'No customers to export', variant: 'warning' });
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'City', 'Country', 'Joined Date'];

    const csvContent = [
      headers.join(','),
      ...customers.map((customer) => {
        const row = [
          `"${(customer.name || 'Unknown').replace(/"/g, '""')}"`,
          `"${(customer.email || '').replace(/"/g, '""')}"`,
          `"${(customer.phone || '').replace(/"/g, '""')}"`,
          `"${(customer.address?.city || '').replace(/"/g, '""')}"`,
          `"${(customer.address?.country || '').replace(/"/g, '""')}"`,
          `"${customer.created_at ? new Date(customer.created_at).toISOString() : ''}"`,
        ];
        return row.join(',');
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ title: 'Exported', description: 'Customers list exported to CSV', variant: 'success' });
  };

  return (
    <MainLayout breadcrumb="ECOMMERCE / OPERATIONS">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 justify-between items-start sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-teal-400 sm:text-3xl lg:text-4xl">ECOMMERCE OPERATIONS</h1>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mb-6 bg-[#111111]">
            <TabsTrigger value="orders">ORDERS</TabsTrigger>
            <TabsTrigger value="customers">CUSTOMERS</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={fetchOrders}>
                REFRESH DATA
              </Button>
              <Button onClick={handleExportOrdersCSV}>
                <Download className="mr-2 w-4 h-4" />
                EXPORT CSV
              </Button>
            </div>

            {/* Filters */}
            <Card className="bg-[#111111] border-border">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
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
                        <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                          Order ID
                        </th>
                        <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                          Customer
                        </th>
                        <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                          Status
                        </th>
                        <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                          Payment
                        </th>
                        <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                          Total
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
                        <EcommerceOrdersTableShimmer />
                      ) : orders.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="p-8 text-center text-gray-400">
                            No orders found matching the criteria.
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="transition-colors hover:bg-accent/5">
                            <td className="p-4 font-mono text-sm text-teal-400">{order.order_number}</td>
                            <td className="p-4">
                              <div className="text-sm font-medium text-white">
                                {order.ecommerce_customers?.name || 'Guest'}
                              </div>
                              <div className="text-xs text-gray-500">{order.ecommerce_customers?.email}</div>
                              <div className="text-xs text-gray-500">{order.ecommerce_customers?.phone}</div>
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
                            <td className="p-4 text-sm font-medium text-white">
                              {formatCurrency(calculateTotal(order), order.currency)}
                            </td>
                            <td className="p-4 text-sm text-gray-400">{formatDate(order.created_at)}</td>
                            <td className="p-4 text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-0 w-8 h-8"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Eye className="w-4 h-4 text-teal-400" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-0 w-8 h-8"
                                  onClick={() => handleDeleteClick(order)}
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
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={fetchCustomers}>
                REFRESH DATA
              </Button>
              <Button onClick={handleExportCustomersCSV}>
                <Download className="mr-2 w-4 h-4" />
                EXPORT CSV
              </Button>
            </div>

            {/* Customer Filters */}
            <Card className="bg-[#111111] border-border">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search customers by name or email..."
                    className="pl-8 bg-[#0a0a0a] border-border"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customers Table */}
            <Card className="bg-[#111111] border-border">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-[#0a0a0a]/50">
                        <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                          Name
                        </th>
                        <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                          Contact
                        </th>
                        <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                          Location
                        </th>
                        <th className="p-4 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                          Joined
                        </th>
                        <th className="p-4 text-xs font-medium tracking-wider text-right text-gray-400 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {customersLoading ? (
                        <EcommerceCustomersTableShimmer />
                      ) : customers.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-gray-400">
                            No customers found.
                          </td>
                        </tr>
                      ) : (
                        customers.map((customer) => (
                          <tr key={customer.id} className="transition-colors hover:bg-accent/5">
                            <td className="p-4 font-medium text-white">{customer.name || 'Unknown'}</td>
                            <td className="p-4">
                              <div className="text-sm text-gray-400">{customer.email}</div>
                              <div className="text-xs text-gray-500">{customer.phone}</div>
                            </td>
                            <td className="p-4 text-sm text-gray-400">
                              {customer.address?.city && customer.address?.country
                                ? `${customer.address.city}, ${customer.address.country}`
                                : 'Unknown'}
                            </td>
                            <td className="p-4 text-sm text-gray-400">{formatDate(customer.created_at)}</td>
                            <td className="p-4 text-right">
                              <Button variant="ghost" size="sm" className="p-0 w-8 h-8">
                                <Eye className="w-4 h-4 text-teal-400" />
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
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-[#111111] border-border text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete the order{' '}
                <span className="font-mono text-teal-400">{orderToDelete?.order_number}</span> and all associated items.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-white bg-transparent border-border hover:bg-white/10 hover:text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction className="text-white bg-red-600 border-none hover:bg-red-700" onClick={confirmDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="bg-[#111111] border-border text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex gap-2 items-center text-xl font-bold text-teal-400">
                <ShoppingCart className="w-5 h-5" />
                ORDER MANIFEST: {selectedOrder?.order_number}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Created on {formatDate(selectedOrder?.created_at)} • {selectedOrder?.ecommerce_order_items?.length || 0}{' '}
                Items
              </DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="mt-4 space-y-6">
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
                    <div className="text-xs text-gray-500">
                      <span className="mr-2 uppercase">Subtotal:</span>
                      <span className="text-white">
                        {formatCurrency(
                          selectedOrder.subtotal || selectedOrder.metadata?.subtotal || 0,
                          selectedOrder.currency
                        )}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="mr-2 uppercase">Shipping:</span>
                      <span className="text-white">
                        {formatCurrency(
                          selectedOrder.shipping || selectedOrder.metadata?.shipping || 0,
                          selectedOrder.currency
                        )}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="mr-2 uppercase">Tax:</span>
                      <span className="text-white">
                        {formatCurrency(selectedOrder.tax || selectedOrder.metadata?.tax || 0, selectedOrder.currency)}
                      </span>
                    </div>
                    <div className="pt-2 mt-1 border-t border-border">
                      <span className="mr-2 text-xs text-gray-500 uppercase">Total Amount</span>
                      <span className="text-lg font-bold text-teal-400">
                        {formatCurrency(calculateTotal(selectedOrder), selectedOrder.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="p-4 bg-[#0a0a0a] rounded-lg border border-border">
                    <h3 className="flex gap-2 items-center mb-3 text-sm font-medium text-teal-400">
                      <User className="w-4 h-4" /> CUSTOMER
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium text-white">{selectedOrder.ecommerce_customers?.name || 'Guest'}</p>
                      <p className="text-gray-400">{selectedOrder.ecommerce_customers?.email}</p>
                      <p className="text-gray-400">{selectedOrder.ecommerce_customers?.phone}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-[#0a0a0a] rounded-lg border border-border">
                    <h3 className="flex gap-2 items-center mb-3 text-sm font-medium text-teal-400">
                      <Package className="w-4 h-4" /> SHIPPING
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
                  <h3 className="mb-3 text-sm font-medium text-teal-400">ORDER ITEMS</h3>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-[#0a0a0a]">
                        <tr className="text-xs text-left text-gray-500 uppercase">
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
                              <div className="flex gap-3 items-center">
                                {item.image_url ? (
                                  <div className="overflow-hidden flex-shrink-0 w-10 h-10 bg-gray-800 rounded-md">
                                    <img
                                      src={item.image_url}
                                      alt={item.product_name}
                                      className="object-cover w-full h-full"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                        e.target.parentElement.innerHTML =
                                          '<svg class="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>';
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="flex flex-shrink-0 justify-center items-center w-10 h-10 bg-gray-800 rounded-md">
                                    <Package className="w-5 h-5 text-gray-500" />
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
                            <td className="p-3 font-medium text-right text-white">
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
