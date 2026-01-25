'use client';

import { ChartRow } from '@/components/dashboard/chart-row';
import { GoogleAnalyticsKPI } from '@/components/dashboard/google-analytics-kpi';
import { GoogleAnalyticsStatus } from '@/components/dashboard/google-analytics-status';
import { MetricsReferrals } from '@/components/dashboard/metrics-referrals';
import { PlatformDistribution } from '@/components/dashboard/platform-distribution';
import { SocialMediaStats } from '@/components/dashboard/social-media-stats';
import { TopPerformingPolls } from '@/components/dashboard/top-performing-polls';
import { TopReferrers } from '@/components/dashboard/top-referrers';
import { TrafficSources } from '@/components/dashboard/traffic-sources';

export function DashboardAnalytics({ analyticsData, gaData, timeframe, onRefresh }) {
  return (
    <>
      <GoogleAnalyticsKPI gaData={gaData} analyticsData={analyticsData} onRefresh={onRefresh} />
      <GoogleAnalyticsStatus gaData={gaData} />
      <SocialMediaStats analyticsData={analyticsData} />
      <ChartRow analyticsData={analyticsData} timeframe={timeframe} />

      {/* Platform Distribution, Traffic Sources, and Top Referrers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PlatformDistribution analyticsData={analyticsData} />
        <TrafficSources analyticsData={analyticsData} />
        <TopReferrers analyticsData={analyticsData} />
      </div>

      {/* Top Performing Polls */}
      <TopPerformingPolls analyticsData={analyticsData} />

      <MetricsReferrals analyticsData={analyticsData} />
    </>
  );
}
