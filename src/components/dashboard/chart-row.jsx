'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const PLATFORM_COLORS = ['#14b8a6', '#ec4899', '#fbbf24', '#3b82f6', '#ffffff', '#a855f7', '#ef4444', '#22c55e'];

function formatDay(dateStr) {
  const d = new Date(dateStr);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[d.getDay()];
}

export function ChartRow({ analyticsData, timeframe }) {
  const dailyShares = analyticsData?.dailyShares ?? [];
  const platformStats = analyticsData?.platformStats ?? [];
  const totalShares = analyticsData?.overview?.totalShares ?? 0;

  const trafficData = dailyShares.map(({ date, count }) => ({
    day: formatDay(date),
    value: count,
    fullDate: date,
  }));

  const demographics = platformStats.map((item, i) => ({
    label: (item.platform || 'Unknown').toUpperCase(),
    value: totalShares > 0 ? Math.round((item.count / totalShares) * 100) : 0,
    color: PLATFORM_COLORS[i % PLATFORM_COLORS.length],
    count: item.count,
  }));

  const hasTraffic = trafficData.some((d) => d.value > 0);
  const hasDemographics = demographics.length > 0 && demographics.some((d) => d.value > 0);

  const defaultTrafficData = Array.from({ length: Math.min(7, parseInt(timeframe) || 7) }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (parseInt(timeframe) || 7) + 1 + i);
    return { day: formatDay(d.toISOString().split('T')[0]), value: 0 };
  });

  const chartData = trafficData.length > 0 ? trafficData : defaultTrafficData;
  const maxVal = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <>
      <hr className="my-4 border-border" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-teal-400">DAILY SIGNAL TRAFFIC</CardTitle>
                <p className="mt-1 text-sm text-gray-400">SHARES PER DAY (LAST {timeframe} DAYS)</p>
              </div>
              <Button variant="ghost" size="sm">
                DETAILED INSIGHTS
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" domain={[0, maxVal]} />
                <Area type="monotone" dataKey="value" stroke="#14b8a6" fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
            {!hasTraffic && <p className="mt-2 text-center text-sm text-gray-500">No shares in this period</p>}
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">PLATFORM DISTRIBUTION</CardTitle>
            <p className="mt-1 text-sm text-gray-400">SHARES BY PLATFORM</p>
          </CardHeader>
          <CardContent>
            {hasDemographics ? (
              <>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={demographics}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {demographics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {demographics.map((demo, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-4 w-4 shrink-0 rounded" style={{ backgroundColor: demo.color }} />
                      <span className="text-sm text-gray-400">
                        {demo.label} {demo.value}%
                      </span>
                    </div>
                  ))}
                </div>
                {demographics.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 text-sm text-gray-400">TOP PLATFORM</div>
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold text-teal-400">
                        {demographics[0].label} ({demographics[0].value}%)
                      </div>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${demographics[0].value}%`,
                            backgroundColor: demographics[0].color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-center text-gray-500">No platform data yet</p>
                <p className="mt-1 text-sm text-gray-600">Share polls to see distribution</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
