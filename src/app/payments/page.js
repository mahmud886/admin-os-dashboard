'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getPaymentType, payments, tierPrices } from '@/data/payments';

export default function PaymentsPage() {
  function getTierPrice(p) {
    const tp = tierPrices[p.tier];
    if (!tp) return null;
    return tp[p.currency] ?? null;
  }
  function getType(p) {
    return getPaymentType(p);
  }
  function getDisplayPrice(p) {
    const tierPrice = getTierPrice(p);
    if (tierPrice && getType(p) === 'TIER') {
      return `$ ${tierPrice}`;
    }
    return `${p.total.toFixed(2)} ${p.currency}`;
  }
  const tierCounts = payments.reduce((acc, p) => {
    const type = getType(p);
    if (type === 'TIER') {
      const key = p.tier || 'UNKNOWN';
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {});
  const totalUsers = new Set(payments.map((p) => p.email)).size;
  const donationPayments = payments.filter((p) => getType(p) === 'DONATION');
  const donationUsers = new Set(donationPayments.map((p) => p.email)).size;

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / PAYMENTS">
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-400">PAYMENTS</h1>
        <Card className="bg-[#111111] border-border">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded border border-teal-400/50 bg-teal-900/20 p-4">
                <div className="text-teal-400 font-semibold">THE ARCHIVIST</div>
                <div className="text-gray-300 text-sm">$ {tierPrices['THE ARCHIVIST'].USD}</div>
                <div className="text-gray-400 text-xs">USERS: {tierCounts['THE ARCHIVIST'] || 0}</div>
              </div>
              <div className="rounded border border-teal-400/50 bg-teal-900/20 p-4">
                <div className="text-teal-400 font-semibold">THE EMBLEM</div>
                <div className="text-gray-300 text-sm">$ {tierPrices['THE EMBLEM'].USD}</div>
                <div className="text-gray-400 text-xs">USERS: {tierCounts['THE EMBLEM'] || 0}</div>
              </div>
              <div className="rounded border border-teal-400/50 bg-teal-900/20 p-4">
                <div className="text-teal-400 font-semibold">THE PATRON</div>
                <div className="text-gray-300 text-sm">$ {tierPrices['THE PATRON'].USD}</div>
                <div className="text-gray-400 text-xs">USERS: {tierCounts['THE PATRON'] || 0}</div>
              </div>
              <div className="rounded border border-yellow-400/50 bg-yellow-900/20 p-4 flex flex-col gap-2">
                <div className="text-yellow-400 font-semibold">SUPPORT THE UNIVERSE</div>
                <div className="text-gray-300 text-sm">DONATE ANY AMOUNT</div>
                <div>
                  <Button size="sm">DONATE</Button>
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-400">TOTAL USERS: {totalUsers}</div>
            <div className="text-sm text-yellow-400">DONATION USERS: {donationUsers}</div>
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
                    <th className="p-4 text-left text-sm font-medium text-gray-400">CITY</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">COUNTRY</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">PRICE</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">TYPE</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">CURRENCY</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">TIER</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">STATUS</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">METHOD</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">CREATED</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, i) => (
                    <tr key={p.id} className="border-b border-border hover:bg-accent/5">
                      <td className="p-4 text-gray-400">{i + 1}</td>
                      <td className="p-4 text-teal-400 font-medium">{p.name}</td>
                      <td className="p-4 text-gray-300">{p.email}</td>
                      <td className="p-4 text-gray-300">{p.address}</td>
                      <td className="p-4 text-gray-300">{p.city}</td>
                      <td className="p-4 text-gray-300">{p.country}</td>
                      <td className="p-4 text-teal-400 font-semibold">{getDisplayPrice(p)}</td>
                      <td className="p-4 text-gray-300">{getType(p)}</td>
                      <td className="p-4 text-gray-300">{p.currency}</td>
                      <td className="p-4 text-gray-300">{p.tier || '—'}</td>
                      <td className="p-4">
                        <span
                          className={
                            p.status === 'succeeded'
                              ? 'px-2 py-1 rounded border border-green-500/50 bg-green-500/20 text-green-400 text-xs'
                              : 'px-2 py-1 rounded border border-yellow-500/50 bg-yellow-500/20 text-yellow-400 text-xs'
                          }
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{p.method}</td>
                      <td className="p-4 text-gray-300">{p.created_at.replace('T', ' ').slice(0, 16)}</td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td className="p-4 text-center text-gray-400" colSpan={12}>
                        No payments found
                      </td>
                    </tr>
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
