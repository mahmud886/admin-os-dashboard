'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function AdminPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / ADMIN">
      <div className="space-y-6">
        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">ADMINISTRATIVE PANEL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-400">Authenticated User</h3>
              <p className="text-gray-200">{user?.email}</p>
            </div>

            <div className="pt-4 border-t border-border">
              <Button onClick={handleSignOut} variant="destructive" className="w-full sm:w-auto">
                SIGN OUT
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-border">
          <CardHeader>
            <CardTitle className="text-teal-400">SYSTEM ADMINISTRATION</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Administrative functions and system controls will be available here.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
