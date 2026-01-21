'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dashboardData from '@/data/dashboard.json';
import { ExternalLink } from 'lucide-react';

export function SocialMediaStats() {
  return (
    <>
      <hr className="my-4 border-border" />
      {/* Social Media */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardData.socialMedia.map((social, index) => (
          <Card key={index} className="bg-[#111111] border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-teal-400">{social.platform}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-teal-400">SHARES {social.shares}</div>
                <div className="text-sm text-gray-400">ENGAGEMENT {social.engagement}</div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
