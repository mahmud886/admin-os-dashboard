'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Building2, FileText } from 'lucide-react';
import contentData from '@/data/content.json';

export default function ContentPage() {
  const [selectedPage, setSelectedPage] = useState('landing');
  const selectedPageData = contentData.pages.find((p) => p.id === selectedPage);
  const landingData = contentData.landingPage;

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / CONTENT">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Page Index */}
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">PAGE INDEX</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {contentData.pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setSelectedPage(page.id)}
                className={`w-full text-left p-4 rounded-md transition-colors ${
                  selectedPage === page.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${selectedPage === page.id ? 'text-teal-400' : 'text-gray-400'}`}>
                    {page.name}
                  </span>
                  <Badge
                    variant={page.status === 'LIVE' ? 'default' : 'secondary'}
                    className={
                      page.status === 'LIVE'
                        ? 'border-green-500 bg-green-500/50 text-green-400 hover:bg-green-500 transition-all duration-300 ease-in-out'
                        : 'transition-all duration-300 ease-in-out'
                    }
                  >
                    {page.status}
                  </Badge>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Landing Page Editor */}
        <Card className="lg:col-span-2 bg-[#111111] border-border">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <CardTitle className="text-lg sm:text-xl text-teal-400">LANDING PAGE EDITOR</CardTitle>
              </div>
              <Button className="w-full sm:w-auto">
                <FileText className="h-4 w-4 mr-2" />
                DEPLOY CHANGES
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-2">{landingData.revision}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-teal-400">T HERO HEADLINE</label>
              <Input defaultValue={landingData.heroHeadline} className="bg-[#0a0a0a] border-border" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-teal-400">T HERO SUBTEXT</label>
              <Textarea
                defaultValue={landingData.heroSubtext}
                className="min-h-[100px] bg-[#0a0a0a] border-border resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-teal-400">FEATURED ASSET</label>
              <div className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center bg-[#0a0a0a]">
                <div className="w-16 h-16 border-2 border-muted-foreground rounded mb-4"></div>
                <Button variant="outline">CHANGE ASSET</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-teal-400">CTA LINK</label>
              <Input defaultValue={landingData.ctaLink} className="bg-[#0a0a0a] border-border" />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
