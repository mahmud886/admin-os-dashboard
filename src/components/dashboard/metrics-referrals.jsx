'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Share2, TrendingUp } from 'lucide-react';

const ICONS = [Clock, Share2, TrendingUp];

export function MetricsReferrals({ analyticsData }) {
  const overview = analyticsData?.overview ?? {};
  const totalPolls = overview.totalPolls ?? 0;
  const totalVotes = overview.totalVotes ?? 0;
  const totalShares = overview.totalShares ?? 0;

  const avgVotesPerPoll = totalPolls > 0 ? (totalVotes / totalPolls).toFixed(1) : '0';
  const avgSharesPerPoll = totalPolls > 0 ? (totalShares / totalPolls).toFixed(1) : '0';
  const engagementRate = totalPolls > 0 ? Math.round(((totalVotes + totalShares) / totalPolls) * 100) : 0;

  const metrics = [
    {
      title: 'AVG VOTES / POLL',
      value: avgVotesPerPoll,
      description: 'HUMAN ENGAGEMENT',
    },
    {
      title: 'AVG SHARES / POLL',
      value: avgSharesPerPoll,
      description: 'SOCIAL REACH',
    },
    {
      title: 'ENGAGEMENT RATE',
      value: `${Number(engagementRate).toLocaleString()}%`,
      description: 'VOTES + SHARES PER POLL',
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metrics.map((metric, index) => {
          const Icon = ICONS[index];
          return (
            <Card key={index} className="bg-[#111111] border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-teal-400">{metric.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-3xl font-bold text-teal-400">{metric.value}</div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  {Icon && <Icon className="h-4 w-4 shrink-0" />}
                  {metric.description}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
