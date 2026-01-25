'use client';

import { Card, CardContent } from '@/components/ui/card';

export function GoogleAnalyticsStatus({ gaData }) {
  if (!gaData) return null;

  if (gaData.configured) {
    return (
      <Card className="mb-6 rounded-xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-2xl">
              ✓
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-bold text-white">Google Analytics Connected</h3>
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                <div>
                  <p className="text-white/50">Measurement ID</p>
                  <p className="font-mono font-bold text-teal-400">{gaData.measurementId}</p>
                </div>
                <div>
                  <p className="text-white/50">Active Users (Live)</p>
                  <p className="text-xl font-bold text-teal-400">{gaData.activeUsers || 0}</p>
                </div>
                <div>
                  <p className="text-white/50">Status</p>
                  <p className="font-bold text-green-400">🟢 Tracking Active</p>
                </div>
              </div>
              {gaData.note && (
                <p className="mt-3 rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
                  ℹ️ {gaData.note}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500 text-2xl">
            ⚠️
          </div>
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-bold text-white">Google Analytics Not Configured</h3>
            <p className="mb-3 text-white/70">
              Add your Google Analytics Measurement ID to track active users, page views, and real-time data.
            </p>
            <div className="rounded-lg border border-amber-500/30 bg-black/50 p-4">
              <p className="mb-2 font-mono text-sm text-teal-400">NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX</p>
              <p className="text-xs text-white/50">Add this to your .env.local file and restart the dev server</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
