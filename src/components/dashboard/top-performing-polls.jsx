'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export function TopPerformingPolls({ analyticsData }) {
  const topPolls = analyticsData?.topPolls ?? [];

  if (topPolls.length === 0) {
    return (
      <Card className="bg-[#111111] border-border">
        <CardHeader>
          <CardTitle className="text-teal-400">🏆 TOP PERFORMING POLLS</CardTitle>
          <p className="mt-1 text-sm text-gray-400">POLLS RANKED BY TOTAL VOTES</p>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-gray-500">No polls yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#111111] border-border">
      <CardHeader>
        <CardTitle className="text-teal-400">🏆 TOP PERFORMING POLLS</CardTitle>
        <p className="mt-1 text-sm text-gray-400">POLLS RANKED BY TOTAL VOTES</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-white/20">
                <th className="px-4 py-3 text-left font-semibold text-white/70">Rank</th>
                <th className="px-4 py-3 text-left font-semibold text-white/70">Question</th>
                <th className="px-4 py-3 text-center font-semibold text-white/70">Votes</th>
                <th className="px-4 py-3 text-left font-semibold text-white/70">Created</th>
                <th className="px-4 py-3 text-center font-semibold text-white/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topPolls.map((poll, index) => (
                <tr key={poll.id} className="border-b border-white/10 transition-colors hover:bg-white/5">
                  <td className="px-4 py-4">
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="line-clamp-2 font-medium text-white">{poll.question}</p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-block rounded-full border border-teal-500 bg-teal-500/20 px-3 py-1 font-bold text-teal-400">
                      {poll.total_votes}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-white/50">{new Date(poll.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-4 text-center">
                    <Link
                      href={`/polls/${poll.id}`}
                      className="inline-block rounded-sm bg-teal-400 px-4 py-2 font-medium text-black transition-all hover:bg-teal-400/80 uppercase"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
