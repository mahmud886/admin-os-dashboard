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
      <div className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-50">
        <button className="bg-teal-900/30 text-teal-400 border-l-4 border-teal-400 px-3 py-2 lg:px-4 rounded-md text-xs lg:text-sm font-medium hover:bg-teal-900/50 transition-colors flex items-center gap-2">
          <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
          <span className="hidden sm:inline">SWITCH TO USER VIEW</span>
          <span className="sm:hidden">SWITCH</span>
        </button>
      </div>
    </div>
  );
}
