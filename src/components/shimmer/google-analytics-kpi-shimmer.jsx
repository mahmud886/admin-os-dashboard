'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function GoogleAnalyticsKPIShimmer() {
  return (
    <>
      <hr className="my-4 border-border" />
      {/* KPIs Shimmer */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="bg-[#111111] border-border">
            <CardHeader className="pb-2">
              <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="h-9 w-20 bg-gray-700 rounded animate-pulse"></div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-12 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-4 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
