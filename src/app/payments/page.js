'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const tierPrices = {
  'THE ARCHIVIST': { USD: 39 },
  'THE EMBLEM': { USD: 69 },
  'THE PATRON': { USD: 129.99 },
};

const payments = [
  {
    id: 'pay_001',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    address: '123 Market St, San Francisco',
    city: 'San Francisco',
    country: 'US',
    tier: 'THE PATRON',
    total: 129.99,
    currency: 'USD',
    status: 'succeeded',
    created_at: '2026-02-04T12:15:00Z',
    method: 'card',
  },
  {
    id: 'pay_002',
    name: 'Bob Smith',
    email: 'bob@example.com',
    address: '45 High St, London',
    city: 'London',
    country: 'UK',
    tier: '',
    total: 79.5,
    currency: 'GBP',
    status: 'succeeded',
    created_at: '2026-02-05T09:42:00Z',
    method: 'card',
  },
  {
    id: 'pay_003',
    name: 'Sara Kim',
    email: 'sara@example.com',
    address: '200 Orchard Rd, Singapore',
    city: 'Singapore',
    country: 'SG',
    tier: '',
    total: 59.0,
    currency: 'SGD',
    status: 'requires_action',
    created_at: '2026-02-06T19:03:00Z',
    method: 'card',
  },
  {
    id: 'pay_004',
    name: 'Diego Alvarez',
    email: 'diego@example.com',
    address: '900 Paseo de la Reforma',
    city: 'Mexico City',
    country: 'MX',
    tier: 'THE ARCHIVIST',
    total: 105.25,
    currency: 'MXN',
    status: 'succeeded',
    created_at: '2026-02-07T08:10:00Z',
    method: 'card',
  },
  {
    id: 'pay_005',
    name: 'Emily Zhang',
    email: 'emily@example.com',
    address: '55 Nanjing Rd',
    city: 'Shanghai',
    country: 'CN',
    tier: 'THE EMBLEM',
    total: 88.0,
    currency: 'CNY',
    status: 'succeeded',
    created_at: '2026-02-07T10:45:00Z',
    method: 'card',
  },
  {
    id: 'pay_006',
    name: 'Liam O’Connor',
    email: 'liam@example.com',
    address: '12 Abbey St',
    city: 'Dublin',
    country: 'IE',
    tier: 'THE PATRON',
    total: 64.3,
    currency: 'EUR',
    status: 'requires_action',
    created_at: '2026-02-07T11:22:00Z',
    method: 'card',
  },
  {
    id: 'pay_007',
    name: 'Yuki Tanaka',
    email: 'yuki@example.com',
    address: '1-2-3 Shibuya',
    city: 'Tokyo',
    country: 'JP',
    tier: 'THE EMBLEM',
    total: 97.4,
    currency: 'JPY',
    status: 'succeeded',
    created_at: '2026-02-07T13:15:00Z',
    method: 'card',
  },
  {
    id: 'pay_008',
    name: 'Noah Williams',
    email: 'noah@example.com',
    address: '77 Broadway',
    city: 'New York',
    country: 'US',
    tier: 'THE ARCHIVIST',
    total: 150.0,
    currency: 'USD',
    status: 'succeeded',
    created_at: '2026-02-07T14:05:00Z',
    method: 'card',
  },
  {
    id: 'pay_009',
    name: 'Ava Müller',
    email: 'ava@example.com',
    address: '5 Alexanderplatz',
    city: 'Berlin',
    country: 'DE',
    tier: 'THE PATRON',
    total: 72.75,
    currency: 'EUR',
    status: 'requires_action',
    created_at: '2026-02-07T15:20:00Z',
    method: 'card',
  },
  {
    id: 'pay_010',
    name: 'Lucas Rossi',
    email: 'lucas@example.com',
    address: 'Av. Paulista 1000',
    city: 'São Paulo',
    country: 'BR',
    tier: 'THE EMBLEM',
    total: 81.9,
    currency: 'BRL',
    status: 'succeeded',
    created_at: '2026-02-07T16:40:00Z',
    method: 'card',
  },
  {
    id: 'pay_011',
    name: 'Mia Nguyen',
    email: 'mia@example.com',
    address: '22 Nguyen Trai',
    city: 'Ho Chi Minh City',
    country: 'VN',
    tier: 'THE ARCHIVIST',
    total: 110.0,
    currency: 'VND',
    status: 'succeeded',
    created_at: '2026-02-07T17:05:00Z',
    method: 'card',
  },
  {
    id: 'pay_012',
    name: 'Ethan Patel',
    email: 'ethan@example.com',
    address: '3 MG Road',
    city: 'Bengaluru',
    country: 'IN',
    tier: 'THE PATRON',
    total: 66.6,
    currency: 'INR',
    status: 'requires_action',
    created_at: '2026-02-07T18:25:00Z',
    method: 'card',
  },
  {
    id: 'pay_013',
    name: 'Sofia Garcia',
    email: 'sofia@example.com',
    address: '400 Gran Via',
    city: 'Madrid',
    country: 'ES',
    tier: 'THE ARCHIVIST',
    total: 120.75,
    currency: 'EUR',
    status: 'succeeded',
    created_at: '2026-02-07T19:30:00Z',
    method: 'card',
  },
  {
    id: 'pay_014',
    name: 'Oliver Brown',
    email: 'oliver@example.com',
    address: '9 King’s Road',
    city: 'Sydney',
    country: 'AU',
    tier: 'THE EMBLEM',
    total: 95.2,
    currency: 'AUD',
    status: 'succeeded',
    created_at: '2026-02-07T20:10:00Z',
    method: 'card',
  },
  {
    id: 'pay_015',
    name: 'Chloe Dubois',
    email: 'chloe@example.com',
    address: '10 Rue de Rivoli',
    city: 'Paris',
    country: 'FR',
    tier: 'THE PATRON',
    total: 69.0,
    currency: 'EUR',
    status: 'requires_action',
    created_at: '2026-02-07T21:00:00Z',
    method: 'card',
  },
  {
    id: 'pay_016',
    name: 'Mateo Silva',
    email: 'mateo@example.com',
    address: '50 9 de Julio',
    city: 'Buenos Aires',
    country: 'AR',
    tier: 'THE ARCHIVIST',
    total: 101.1,
    currency: 'ARS',
    status: 'succeeded',
    created_at: '2026-02-07T21:45:00Z',
    method: 'card',
  },
  {
    id: 'pay_017',
    name: 'Isabella Conti',
    email: 'isabella@example.com',
    address: 'Via Roma 15',
    city: 'Rome',
    country: 'IT',
    tier: 'THE EMBLEM',
    total: 82.0,
    currency: 'EUR',
    status: 'succeeded',
    created_at: '2026-02-07T22:15:00Z',
    method: 'card',
  },
  {
    id: 'pay_018',
    name: 'James Lee',
    email: 'james@example.com',
    address: '400 Orchard Blvd',
    city: 'Singapore',
    country: 'SG',
    tier: 'THE PATRON',
    total: 58.5,
    currency: 'SGD',
    status: 'requires_action',
    created_at: '2026-02-07T22:45:00Z',
    method: 'card',
  },
  {
    id: 'pay_019',
    name: 'Amelia Harris',
    email: 'amelia@example.com',
    address: '200 Queen St',
    city: 'Toronto',
    country: 'CA',
    tier: 'THE ARCHIVIST',
    total: 132.4,
    currency: 'CAD',
    status: 'succeeded',
    created_at: '2026-02-07T23:05:00Z',
    method: 'card',
  },
  {
    id: 'pay_020',
    name: 'William Evans',
    email: 'william@example.com',
    address: '1 Princes St',
    city: 'Edinburgh',
    country: 'UK',
    tier: 'THE EMBLEM',
    total: 77.77,
    currency: 'GBP',
    status: 'succeeded',
    created_at: '2026-02-07T23:40:00Z',
    method: 'card',
  },
];

export default function PaymentsPage() {
  function getTierPrice(p) {
    const tp = tierPrices[p.tier];
    if (!tp) return null;
    return tp[p.currency] ?? null;
  }
  function getType(p) {
    const tierPrice = getTierPrice(p);
    if (!tierPrice) return 'DONATION';
    return Number(p.total) === Number(tierPrice) ? 'TIER' : 'DONATION';
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
