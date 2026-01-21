'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ChartRowShimmer() {
  return (
    <>
      <hr className="my-4 border-border" />
      {/* Charts Row Shimmer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Daily Signal Traffic Shimmer */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="h-6 w-40 bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-64 bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-32 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-gray-700 rounded animate-pulse"></div>
          </CardContent>
        </Card>

        {/* Demographics Shimmer */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="h-[300px] w-[300px] bg-gray-700 rounded-full animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="h-4 w-24 bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-36 bg-gray-700 rounded animate-pulse"></div>
                <div className="flex-1 h-2 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
