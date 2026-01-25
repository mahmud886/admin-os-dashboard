'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

const KPI_COLORS = {
  positive: 'border-green-500 bg-green-500/50 text-green-400 hover:bg-green-500',
  negative: 'border-red-500 bg-red-500/50 text-red-400 hover:bg-red-500',
};

export function GoogleAnalyticsKPI({ gaData, analyticsData, onRefresh }) {
  const overview = analyticsData?.overview ?? {};
  const totalPolls = overview.totalPolls ?? 0;
  const totalVotes = overview.totalVotes ?? 0;
  const totalShares = overview.totalShares ?? 0;
  const avgVotesPerPoll = totalPolls > 0 ? (totalVotes / totalPolls).toFixed(1) : '0';
  const gaConfigured = gaData?.configured === true;
  const activeUsers = gaData?.activeUsers ?? 0;

  const kpis = [
    {
      title: 'DAILY VISITORS',
      value: gaConfigured ? activeUsers.toLocaleString() : '—',
      change: 'Live',
      changeType: 'positive',
      sub: gaConfigured ? 'GA4' : 'Not configured',
    },
    {
      title: 'TOTAL VOTES',
      value: totalVotes.toLocaleString(),
      change: 'All time',
      changeType: 'positive',
      sub: 'Polls',
    },
    {
      title: 'TOTAL SHARES',
      value: totalShares.toLocaleString(),
      change: 'All time',
      changeType: 'positive',
      sub: 'Social',
    },
    {
      title: 'AVG VOTES / POLL',
      value: avgVotesPerPoll,
      change: 'Engagement',
      changeType: 'positive',
      sub: 'Polls',
    },
  ];

  return (
    <>
      <hr className="my-4 border-border" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="bg-[#111111] border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{kpi.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-teal-400">{kpi.value}</div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={kpi.changeType === 'positive' ? 'default' : 'destructive'}
                    className={KPI_COLORS[kpi.changeType] ?? KPI_COLORS.positive}
                  >
                    {kpi.change}
                  </Badge>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              {kpi.sub && <p className="mt-1 text-xs text-gray-500">{kpi.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
