import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, Download, Mail } from 'lucide-react';
import emailsData from '@/data/emails.json';

export default function EmailsPage() {
  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'border-green-500 bg-green-500/50 text-green-400 hover:bg-green-500 transition-all duration-300 ease-in-out';
      case 'PENDING':
        return 'border-blue-500 bg-blue-500/50 text-blue-400 hover:bg-blue-500 transition-all duration-300 ease-in-out';
      case 'BLACKLISTED':
        return 'border-red-500 bg-red-500/50 text-red-400 hover:bg-red-500 transition-all duration-300 ease-in-out';
      default:
        return 'border-gray-500 bg-gray-500/50 text-gray-400 hover:bg-gray-500 transition-all duration-300 ease-in-out';
    }
  };

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / EMAILS">
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-400">SUBSCRIBER MATRIX</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400">TOTAL SUBSCRIBERS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-teal-400">{emailsData.summary.totalSubscribers}</div>
            </CardContent>
          </Card>
          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400">ACTIVE THIS WEEK</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-teal-400">{emailsData.summary.activeThisWeek}</div>
            </CardContent>
          </Card>
          <Card className="bg-[#111111] border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400">UNSUBSCRIBE RATE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-destructive">{emailsData.summary.unsubscribeRate}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            FILTER
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            EXPORT CSV
          </Button>
        </div>

        {/* Subscriber Table */}
        <Card className="bg-[#111111] border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-gray-400">DIGITAL FREQUENCY (EMAIL)</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">STATUS</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">SEGMENT</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">FIRST SIGNAL</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">AUTH</th>
                  </tr>
                </thead>
                <tbody>
                  {emailsData.subscribers.map((subscriber, index) => (
                    <tr key={index} className="border-b border-border hover:bg-accent/5">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-teal-400">{subscriber.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(subscriber.status)}>{subscriber.status}</Badge>
                      </td>
                      <td className="p-4 text-gray-400">{subscriber.segment}</td>
                      <td className="p-4 text-gray-400">{subscriber.firstSignal}</td>
                      <td className="p-4">
                        <div className="w-4 h-4 rounded-full border border-muted-foreground"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
