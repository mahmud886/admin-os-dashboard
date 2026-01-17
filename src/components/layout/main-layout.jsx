'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';

export function MainLayout({ children, title, breadcrumb }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <div className="lg:ml-64 pt-16">
        <Header title={title} breadcrumb={breadcrumb} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
