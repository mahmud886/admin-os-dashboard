'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TrafficSources({ analyticsData }) {
  const utmSources = analyticsData?.utmSources ?? [];
  const totalShares = analyticsData?.overview?.totalShares ?? 0;

  // Calculate total UTM clicks for percentage
  const totalUtmClicks = utmSources.reduce((sum, utm) => sum + utm.clicks, 0);

  if (utmSources.length === 0) {
    return (
      <Card className="bg-[#111111] border-border">
        <CardHeader>
          <CardTitle className="text-teal-400">🎯 TRAFFIC SOURCES (UTM)</CardTitle>
          <p className="mt-1 text-sm text-gray-400">SHARES BY UTM SOURCE</p>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-gray-500">No UTM data yet</p>
          <p className="text-center text-xs text-gray-600">Track shares with UTM parameters to see traffic sources</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#111111] border-border">
      <CardHeader>
        <CardTitle className="text-teal-400">🎯 TRAFFIC SOURCES (UTM)</CardTitle>
        <p className="mt-1 text-sm text-gray-400">SHARES BY UTM SOURCE</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {utmSources.map((utm, index) => {
            const percentage = totalUtmClicks > 0 ? ((utm.clicks / totalUtmClicks) * 100).toFixed(1) : '0';
            return (
              <div key={index} className="rounded-lg border border-white/10 p-4 transition-colors hover:bg-white/5">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white uppercase">{utm.source}</span>
                    <p className="text-sm text-gray-400">{utm.campaigns} campaign(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-teal-400">{utm.clicks}</p>
                    <p className="text-xs text-gray-400">{percentage}%</p>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
