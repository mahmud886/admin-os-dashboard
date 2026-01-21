'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MetricsReferralsShimmer() {
  return (
    <>
      {/* Metrics and Referrals Shimmer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Metrics Shimmer */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-2 sm:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="bg-[#111111] border-border">
              <CardHeader className="pb-2">
                <div className="h-4 w-28 bg-gray-700 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="mb-2 h-9 w-20 bg-gray-700 rounded animate-pulse"></div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Referral Nodes Shimmer */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <div className="h-6 w-40 bg-gray-700 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="h-5 w-32 bg-gray-700 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-12 bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
