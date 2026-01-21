'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PollStatsCardShimmer() {
  return (
    <>
      {/* Total Polls Shimmer */}
      <Card className="bg-[#111111] border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-5 w-5 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="h-9 w-16 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-8 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-8 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 w-8 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Poll Votes Shimmer */}
      <Card className="bg-[#111111] border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-36 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-5 w-5 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="h-9 w-20 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-6 w-16 bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="mt-2 h-3 w-44 bg-gray-700 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    </>
  );
}
