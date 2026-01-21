'use client';

import { DashboardAnalytics } from '@/components/dashboard/dashboard-analytics';
import { EpisodeStatsCard } from '@/components/dashboard/episode-stats-card';
import { PollStatsCard } from '@/components/dashboard/poll-stats-card';
import { MainLayout } from '@/components/layout/main-layout';
import { ChartRowShimmer } from '@/components/shimmer/chart-row-shimmer';
import { EpisodeStatsCardShimmer } from '@/components/shimmer/episode-stats-card-shimmer';
import { GoogleAnalyticsKPIShimmer } from '@/components/shimmer/google-analytics-kpi-shimmer';
import { MetricsReferralsShimmer } from '@/components/shimmer/metrics-referrals-shimmer';
import { PollStatsCardShimmer } from '@/components/shimmer/poll-stats-card-shimmer';
import { SocialMediaStatsShimmer } from '@/components/shimmer/social-media-stats-shimmer';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / DASHBOARD">
      <div className="space-y-6">
        {/* Episodes and Polls Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              <EpisodeStatsCardShimmer />
              <PollStatsCardShimmer />
            </>
          ) : (
            <>
              <EpisodeStatsCard />
              <PollStatsCard />
            </>
          )}
        </div>
        {isLoading ? (
          <>
            <GoogleAnalyticsKPIShimmer />
            <SocialMediaStatsShimmer />
            <ChartRowShimmer />
            <MetricsReferralsShimmer />
          </>
        ) : (
          <DashboardAnalytics />
        )}
      </div>
    </MainLayout>
  );
}
