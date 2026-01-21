'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, TrendingUp, Vote } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function PollStatsCard() {
  const [stats, setStats] = useState({
    total: 0,
    live: 0,
    draft: 0,
    ended: 0,
    totalVotes: 0,
    loading: true,
  });

  // Fetch polls statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/polls');
        const data = await response.json();

        if (response.ok && data.polls) {
          const polls = data.polls;
          const totalVotes = polls.reduce((total, poll) => {
            if (poll.poll_options && poll.poll_options.length > 0) {
              return total + poll.poll_options.reduce((sum, option) => sum + (option.vote_count || 0), 0);
            }
            return total;
          }, 0);

          setStats({
            total: polls.length,
            live: polls.filter((p) => p.status === 'LIVE').length,
            draft: polls.filter((p) => p.status === 'DRAFT').length,
            ended: polls.filter((p) => p.status === 'ENDED').length,
            totalVotes: totalVotes,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Error fetching polls stats:', error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      {/* Total Polls */}
      <Card className="bg-[#111111] border-border hover:border-teal-400/50 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-400">TOTAL POLLS</CardTitle>
            <TrendingUp className="w-5 h-5 text-teal-400" />
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
            <Link href="/polls">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-teal-400">
                VIEW ALL
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          {!stats.loading && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Live:</span>
                <span className="font-medium text-green-400">{stats.live}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Draft:</span>
                <span className="font-medium text-gray-400">{stats.draft}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Ended:</span>
                <span className="font-medium text-orange-400">{stats.ended}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Total Poll Votes */}
      <Card className="bg-[#111111] border-border hover:border-teal-400/50 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-400">TOTAL POLL VOTES</CardTitle>
            <Vote className="w-5 h-5 text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-green-400">
              {stats.loading ? (
                <div className="w-8 h-8 border-2 border-green-400 rounded-full border-t-transparent animate-spin"></div>
              ) : (
                stats.totalVotes.toLocaleString()
              )}
            </div>
            <Badge className="text-green-400 border-green-500 bg-green-500/50 hover:bg-green-500">ALL TIME</Badge>
          </div>
          {!stats.loading && <p className="mt-2 text-xs text-gray-500">Total votes across all polls</p>}
        </CardContent>
      </Card>
    </>
  );
}
