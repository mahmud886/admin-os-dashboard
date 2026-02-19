'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { tierPrices } from '@/data/payments';
import { useEffect, useState } from 'react';
import { SupporterDonationsTableShimmer } from '@/components/shimmer/supporter-donations-table-shimmer';

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

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/supporter-donations?limit=100'); // Fetch 100 for now
      const data = await response.json();

      if (data.donations) {
        setDonations(data.donations);
        setTotal(data.total);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Failed to fetch donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getType = (tierId) => {
    if (tierId === 'support-universe') return 'DONATION';
    return 'TIER';
  };

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / SUPPORTER DONATIONS">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-400">SUPPORTER DONATIONS</h1>
          <Button variant="outline" onClick={fetchDonations}>
            REFRESH DATA
          </Button>
        </div>

        <Card className="bg-[#111111] border-border">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded border border-teal-400/50 bg-teal-900/20 p-4">
                <div className="text-teal-400 font-semibold">THE ARCHIVIST</div>
                <div className="text-gray-300 text-sm">$ {tierPrices['THE ARCHIVIST'].USD}</div>
                <div className="text-gray-400 text-xs">USERS: {stats.archivist}</div>
              </div>
              <div className="rounded border border-teal-400/50 bg-teal-900/20 p-4">
                <div className="text-teal-400 font-semibold">THE EMBLEM</div>
                <div className="text-gray-300 text-sm">$ {tierPrices['THE EMBLEM'].USD}</div>
                <div className="text-gray-400 text-xs">USERS: {stats.emblem}</div>
              </div>
              <div className="rounded border border-teal-400/50 bg-teal-900/20 p-4">
                <div className="text-teal-400 font-semibold">THE PATRON</div>
                <div className="text-gray-300 text-sm">$ {tierPrices['THE PATRON'].USD}</div>
                <div className="text-gray-400 text-xs">USERS: {stats.patron}</div>
              </div>
              <div className="rounded border border-yellow-400/50 bg-yellow-900/20 p-4 flex flex-col gap-2">
                <div className="text-yellow-400 font-semibold">SUPPORT THE UNIVERSE</div>
                <div className="text-gray-300 text-sm">DONATE ANY AMOUNT</div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-400 text-xs">USERS: {stats.donation}</div>
                  <Button size="sm">DONATE</Button>
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-400">TOTAL DONATIONS: {total}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left text-sm font-medium text-gray-400">SL</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">NAME</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">EMAIL</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">ADDRESS</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">AMOUNT</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">TYPE</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">TIER</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">STATUS</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">CREATED</th>
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
                        <td className="p-4 text-teal-400 font-medium">{p.supporter_name || 'Anonymous'}</td>
                        <td className="p-4 text-gray-300">{p.supporter_email}</td>
                        <td className="p-4 text-gray-300 max-w-xs truncate" title={p.mailing_address}>
                          {p.mailing_address || '—'}
                        </td>
                        <td className="p-4 text-teal-400 font-semibold">
                          {p.amount ? `${p.amount} ${p.currency?.toUpperCase() || 'USD'}` : '—'}
                        </td>
                        <td className="p-4 text-gray-300">{getType(p.tier_id)}</td>
                        <td className="p-4 text-gray-300">{p.tier_name}</td>
                        <td className="p-4">
                          <span
                            className={
                              p.status === 'paid' || p.status === 'succeeded'
                                ? 'px-2 py-1 rounded border border-green-500/50 bg-green-500/20 text-green-400 text-xs'
                                : 'px-2 py-1 rounded border border-yellow-500/50 bg-yellow-500/20 text-yellow-400 text-xs'
                            }
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300">
                          {p.created_at ? new Date(p.created_at).toLocaleString() : '—'}
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
