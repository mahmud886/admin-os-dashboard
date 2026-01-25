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
import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [gaData, setGaData] = useState(null);
  const [timeframe, setTimeframe] = useState('7');
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setAnalyticsLoading(true);
      try {
        setError(null);
        const [dashboardRes, gaRes] = await Promise.all([
          fetch(`/api/analytics/dashboard?timeframe=${timeframe}`),
          fetch('/api/analytics/google'),
        ]);

        const dashboardJson = await dashboardRes.json();
        const gaJson = await gaRes.json();

        if (dashboardRes.ok) setAnalyticsData(dashboardJson);
        else setError(dashboardJson.error || 'Failed to load analytics');

        if (gaRes.ok) setGaData(gaJson);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message || 'Failed to load dashboard');
      } finally {
        if (isRefresh) setAnalyticsLoading(false);
        else setInitialLoading(false);
      }
    },
    [timeframe]
  );

  useEffect(() => {
    if (initialLoading) {
      fetchAnalytics(false);
    } else {
      setAnalyticsLoading(true);
      fetchAnalytics(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only refetch when timeframe changes
  }, [timeframe]);

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / DASHBOARD">
      <div className="space-y-6">
        {/* Episodes and Polls Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {initialLoading ? (
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

        {/* Timeframe selector for analytics */}
        {!initialLoading && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-400">ANALYTICS PERIOD:</span>
            {['7', '14', '30', '90'].map((days) => (
              <button
                key={days}
                onClick={() => setTimeframe(days)}
                className={`rounded border px-3 py-1.5 text-sm font-medium transition-colors ${
                  timeframe === days
                    ? 'border-teal-500 bg-teal-500/20 text-teal-400'
                    : 'border-border bg-[#111111] text-gray-400 hover:border-teal-500/50 hover:text-teal-400'
                }`}
              >
                Last {days} days
              </button>
            ))}
            <button
              onClick={() => {
                setAnalyticsLoading(true);
                fetchAnalytics(true);
              }}
              disabled={analyticsLoading}
              className="ml-2 flex items-center gap-1.5 rounded border border-border bg-[#111111] px-3 py-1.5 text-sm font-medium text-gray-400 transition-colors hover:border-teal-500/50 hover:text-teal-400 disabled:opacity-50"
              aria-label="Refresh analytics"
            >
              <RefreshCw className={`h-4 w-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
              REFRESH
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {initialLoading ? (
          <>
            <GoogleAnalyticsKPIShimmer />
            <SocialMediaStatsShimmer />
            <ChartRowShimmer />
            <MetricsReferralsShimmer />
          </>
        ) : analyticsLoading ? (
          <>
            <GoogleAnalyticsKPIShimmer />
            <SocialMediaStatsShimmer />
            <ChartRowShimmer />
            <MetricsReferralsShimmer />
          </>
        ) : (
          <DashboardAnalytics
            analyticsData={analyticsData}
            gaData={gaData}
            timeframe={timeframe}
            onRefresh={() => fetchAnalytics(true)}
          />
        )}
      </div>
    </MainLayout>
  );
}
