'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PLATFORM_ICONS = {
  facebook: '📘',
  twitter: '🐦',
  x: '❌',
  x_share: '❌',
  linkedin: '💼',
  pinterest: '📌',
  whatsapp: '💚',
  telegram: '✈️',
  reddit: '🤖',
  tiktok: '🎵',
  discord: '💬',
  threads: '🧵',
  instagram: '📷',
  ig_story: '📷',
  youtube: '▶️',
};

function getPlatformIcon(platform) {
  const key = (platform || '').toLowerCase();
  return PLATFORM_ICONS[key] || '🔗';
}

function formatPlatformName(platform) {
  const key = (platform || '').toLowerCase();
  const names = {
    facebook: 'Facebook',
    twitter: 'Twitter',
    x: 'X',
    x_share: 'X Share',
    linkedin: 'LinkedIn',
    pinterest: 'Pinterest',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    reddit: 'Reddit',
    tiktok: 'TikTok',
    discord: 'Discord',
    threads: 'Threads',
    instagram: 'Instagram',
    ig_story: 'Instagram Story',
    youtube: 'YouTube',
  };
  return names[key] || (platform || 'Unknown').charAt(0).toUpperCase() + (platform || 'Unknown').slice(1).toLowerCase();
}

export function PlatformDistribution({ analyticsData }) {
  const platformStats = analyticsData?.platformStats ?? [];
  const totalShares = analyticsData?.overview?.totalShares ?? 0;

  if (platformStats.length === 0) {
    return (
      <Card className="bg-[#111111] border-border">
        <CardHeader>
          <CardTitle className="text-teal-400">🌐 PLATFORM DISTRIBUTION</CardTitle>
          <p className="mt-1 text-sm text-gray-400">SHARES BY PLATFORM</p>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-gray-500">No platform data yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#111111] border-border">
      <CardHeader>
        <CardTitle className="text-teal-400">🌐 PLATFORM DISTRIBUTION</CardTitle>
        <p className="mt-1 text-sm text-gray-400">SHARES BY PLATFORM</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {platformStats.map((platform, index) => {
            const percentage = totalShares > 0 ? ((platform.count / totalShares) * 100).toFixed(1) : '0';
            return (
              <div key={index} className="flex items-center gap-3">
                <span className="text-2xl">{getPlatformIcon(platform.platform)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white capitalize">{formatPlatformName(platform.platform)}</span>
                    <span className="font-bold text-teal-400">
                      {platform.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
