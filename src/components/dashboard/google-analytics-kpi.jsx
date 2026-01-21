'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dashboardData from '@/data/dashboard.json';
import { ExternalLink } from 'lucide-react';

export function GoogleAnalyticsKPI() {
  return (
    <>
      <hr className="my-4 border-border" />
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardData.kpis.map((kpi, index) => (
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
                    className={
                      kpi.changeType === 'positive'
                        ? 'border-green-500 bg-green-500/50 text-green-400 hover:bg-green-500'
                        : 'border-red-500 bg-red-500/50 text-red-400 hover:bg-red-500'
                    }
                  >
                    {kpi.change}
                  </Badge>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
