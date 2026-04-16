"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { EcommerceCustomersTableShimmer } from "@/components/shimmer/ecommerce-customers-table-shimmer";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      let url = "/api/ecommerce/customers";
      if (search) {
        url += `?search=${search}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Failed to fetch customers");

      setCustomers(data.customers || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout breadcrumb="ECOMMERCE / CUSTOMERS">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-400">
            CUSTOMER DATABASE
          </h1>
          <Button variant="outline" onClick={fetchCustomers}>
            REFRESH DATA
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-[#111111] border-border">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search customers by name or email..."
                className="pl-8 bg-[#0a0a0a] border-border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="p-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <EcommerceCustomersTableShimmer />
                  ) : customers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-400">
                        No customers found.
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="hover:bg-accent/5 transition-colors"
                      >
                        <td className="p-4 font-medium text-white">
                          {customer.name || "Unknown"}
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-400">
                            {customer.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            {customer.phone}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-400">
                          {customer.address?.city && customer.address?.country
                            ? `${customer.address.city}, ${customer.address.country}`
                            : "Unknown"}
                        </td>
                        <td className="p-4 text-sm text-gray-400">
                          {formatDate(customer.created_at)}
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
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
      </div>
    </MainLayout>
  );
}
