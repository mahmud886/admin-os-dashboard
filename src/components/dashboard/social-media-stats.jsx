'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

const PLATFORM_LABELS = {
  facebook: 'FACEBOOK',
  twitter: 'X',
  x: 'X',
  linkedin: 'LINKEDIN',
  pinterest: 'PINTEREST',
  whatsapp: 'WHATSAPP',
  telegram: 'TELEGRAM',
  reddit: 'REDDIT',
  tiktok: 'TIKTOK',
  discord: 'DISCORD',
  threads: 'THREADS',
  instagram: 'INSTAGRAM',
  youtube: 'YOUTUBE',
};

function formatPlatform(name) {
  const key = (name || '').toLowerCase();
  return PLATFORM_LABELS[key] ?? (name || 'OTHER').toUpperCase();
}

export function SocialMediaStats({ analyticsData }) {
  const platformStats = analyticsData?.platformStats ?? [];
  const totalShares = analyticsData?.overview?.totalShares ?? 0;

  if (platformStats.length === 0) {
    return (
      <>
        <hr className="my-4 border-border" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-[#111111] border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-teal-400">—</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-teal-400">SHARES 0</div>
                  <div className="text-sm text-gray-400">No platform data yet</div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  const displayed = platformStats.slice(0, 4);

  return (
    <>
      <hr className="my-4 border-border" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {displayed.map((item, index) => {
          const pct = totalShares > 0 ? ((item.count / totalShares) * 100).toFixed(1) : '0';
          return (
            <Card key={index} className="bg-[#111111] border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-teal-400">{formatPlatform(item.platform)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-teal-400">SHARES {item.count}</div>
                  <div className="text-sm text-gray-400">ENGAGEMENT {pct}%</div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
