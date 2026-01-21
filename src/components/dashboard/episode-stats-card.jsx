'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function EpisodeStatsCard() {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    draft: 0,
    upcoming: 0,
    loading: true,
  });

  // Fetch episodes statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/episodes');
        const data = await response.json();

        if (response.ok && data.episodes) {
          const episodes = data.episodes;
          setStats({
            total: episodes.length,
            available: episodes.filter((e) => e.visibility === 'AVAILABLE').length,
            draft: episodes.filter((e) => e.visibility === 'DRAFT').length,
            upcoming: episodes.filter((e) => e.visibility === 'UPCOMING').length,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Error fetching episodes stats:', error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      {/* Total Episodes */}
      <Card className="bg-[#111111] border-border hover:border-teal-400/50 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-400">TOTAL EPISODES</CardTitle>
            <Book className="w-5 h-5 text-teal-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-teal-400">
              {stats.loading ? (
                <div className="w-8 h-8 border-2 border-teal-400 rounded-full border-t-transparent animate-spin"></div>
              ) : (
                stats.total
              )}
            </div>
            <Link href="/episodes">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-teal-400">
                VIEW ALL
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          {!stats.loading && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Available:</span>
                <span className="font-medium text-green-400">{stats.available}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Draft:</span>
                <span className="font-medium text-gray-400">{stats.draft}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Upcoming:</span>
                <span className="font-medium text-orange-400">{stats.upcoming}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Episodes */}
      <Card className="bg-[#111111] border-border hover:border-teal-400/50 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-400">AVAILABLE EPISODES</CardTitle>
            <BookOpen className="w-5 h-5 text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-green-400">
              {stats.loading ? (
                <div className="w-8 h-8 border-2 border-green-400 rounded-full border-t-transparent animate-spin"></div>
              ) : (
                stats.available
              )}
            </div>
            <Badge className="text-green-400 border-green-500 bg-green-500/50 hover:bg-green-500">LIVE</Badge>
          </div>
          {!stats.loading && <p className="mt-2 text-xs text-gray-500">Currently accessible episodes</p>}
        </CardContent>
      </Card>
    </>
  );
}
