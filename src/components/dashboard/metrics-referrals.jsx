'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dashboardData from '@/data/dashboard.json';
import { Clock, Plane } from 'lucide-react';

export function MetricsReferrals() {
  return (
    <>
      {/* Metrics and Referrals */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Metrics */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-2 sm:grid-cols-3">
          {dashboardData.metrics.map((metric, index) => (
            <Card key={index} className="bg-[#111111] border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-teal-400">{metric.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-3xl font-bold text-teal-400">{metric.value}</div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  {index === 0 && <Clock className="w-4 h-4" />}
                  {(index === 1 || index === 2) && <Plane className="w-4 h-4" />}
                  {metric.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Referral Nodes */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">TOP REFERRAL NODES</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.referrals.map((ref, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-teal-400">{ref.source}</div>
                    <div className="text-sm text-gray-400">{ref.visits} Visits</div>
                  </div>
                  <Badge
                    variant={ref.changeType === 'positive' ? 'default' : 'destructive'}
                    className={
                      ref.changeType === 'positive'
                        ? 'border-green-500 bg-green-500/50 text-green-400 hover:bg-green-500'
                        : 'border-red-500 bg-red-500/50 text-red-400 hover:bg-red-500'
                    }
                  >
                    {ref.change}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
