'use client';

import { ChartRow } from '@/components/dashboard/chart-row';
import { GoogleAnalyticsKPI } from '@/components/dashboard/google-analytics-kpi';
import { MetricsReferrals } from '@/components/dashboard/metrics-referrals';
import { SocialMediaStats } from '@/components/dashboard/social-media-stats';

export function DashboardAnalytics() {
  return (
    <>
      <GoogleAnalyticsKPI />
      <SocialMediaStats />
      <ChartRow />
      <MetricsReferrals />
    </>
  );
}
