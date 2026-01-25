'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TopReferrers({ analyticsData }) {
  const referrers = analyticsData?.referrers ?? [];
  const totalShares = analyticsData?.overview?.totalShares ?? 0;

  // Calculate total referrer shares for percentage
  const totalReferrerShares = referrers.reduce((sum, ref) => sum + ref.count, 0);

  if (referrers.length === 0) {
    return (
      <Card className="bg-[#111111] border-border">
        <CardHeader>
          <CardTitle className="text-teal-400">🔗 TOP REFERRERS</CardTitle>
          <p className="mt-1 text-sm text-gray-400">SHARES BY REFERRER</p>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-gray-500">No referrer data yet</p>
          <p className="text-center text-xs text-gray-600">Track shares to see referrer sources</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#111111] border-border">
      <CardHeader>
        <CardTitle className="text-teal-400">🔗 TOP REFERRERS</CardTitle>
        <p className="mt-1 text-sm text-gray-400">SHARES BY REFERRER</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {referrers.map((ref, index) => {
            const percentage = totalReferrerShares > 0 ? ((ref.count / totalReferrerShares) * 100).toFixed(1) : '0';
            return (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-white/10 p-3 transition-colors hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-green-400 text-sm font-bold text-black">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-white">{ref.referrer}</p>
                    <p className="text-xs text-gray-400">{percentage}% of traffic</p>
                  </div>
                </div>
                <span className="rounded-full border border-teal-500 bg-teal-500/20 px-3 py-1 text-sm font-bold text-teal-400">
                  {ref.count}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
