'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PollDetailsShimmer() {
  return (
    <div className="space-y-6">
      {/* Header Shimmer */}
      <div className="flex items-center gap-4 mb-2">
        <div className="h-8 w-32 bg-gray-700 rounded animate-pulse"></div>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="h-10 w-64 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-6 w-20 bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Description Card Shimmer */}
      <Card className="bg-[#111111] border-border">
        <CardHeader>
          <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Poll Options Shimmer */}
        <Card className="lg:col-span-2 bg-[#111111] border-border">
          <CardHeader>
            <div className="h-6 w-48 bg-gray-700 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="relative p-4 rounded-md border border-border bg-[#0a0a0a] overflow-hidden">
                <div className="absolute inset-0 bg-teal-900/20" style={{ width: `${index * 25}%` }}></div>
                <div className="relative flex items-center justify-between z-10">
                  <div className="flex-1">
                    <div className="h-6 w-40 bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-64 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="h-5 w-24 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-8 w-16 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Poll Info Shimmer */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <div className="h-6 w-40 bg-gray-700 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7].map((index) => (
              <div key={index}>
                <div className="h-4 w-24 bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-5 w-32 bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
