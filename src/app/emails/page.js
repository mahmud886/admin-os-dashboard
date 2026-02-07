import { EmailsContent } from '@/components/emails/emails-content';
import { MainLayout } from '@/components/layout/main-layout';

export const dynamic = 'force-dynamic';

export default function EmailsPage() {
  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / EMAILS">
      <EmailsContent />
    </MainLayout>
  );
}
