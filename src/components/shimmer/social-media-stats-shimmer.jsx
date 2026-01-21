'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SocialMediaStatsShimmer() {
  return (
    <>
      <hr className="my-4 border-border" />
      {/* Social Media Shimmer */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="bg-[#111111] border-border">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-7 w-32 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-28 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
