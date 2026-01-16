'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dashboardData from '@/data/dashboard.json';
import { Clock, ExternalLink, Plane } from 'lucide-react';
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export default function DashboardPage() {
  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / DASHBOARD">
      <div className="space-y-6">
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

        {/* Social Media */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardData.socialMedia.map((social, index) => (
            <Card key={index} className="bg-[#111111] border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-teal-400">{social.platform}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-teal-400">SHARES {social.shares}</div>
                  <div className="text-sm text-gray-400">ENGAGEMENT {social.engagement}</div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Daily Signal Traffic */}
          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-teal-400">DAILY SIGNAL TRAFFIC</CardTitle>
                  <p className="mt-1 text-sm text-gray-400">VOLUME OF UNIQUE NEURAL IDENTIFIERS PER DAY</p>
                </div>
                <Button variant="ghost" size="sm">
                  DETAILED INSIGHTS
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardData.trafficData}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Area type="monotone" dataKey="value" stroke="#14b8a6" fillOpacity={1} fill="url(#colorTraffic)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Demographics */}
          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-teal-400">DEMOGRAPHICS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.demographics}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dashboardData.demographics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {dashboardData.demographics.map((demo, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: demo.color }}></div>
                    <span className="text-sm text-gray-400">PERCENTAGE</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="mb-2 text-sm text-gray-400">TOP REGION</div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold text-teal-400">NORTH AMERICA (40%)</div>
                  <div className="flex-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
      </div>
    </MainLayout>
  );
}
