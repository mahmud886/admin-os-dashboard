'use client';

import { Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header({ title, breadcrumb }) {
  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-[#0a0a0a] border-b border-border flex items-center justify-between px-4 lg:px-6 z-40">
      <div className="text-xs lg:text-sm text-gray-400 truncate">{breadcrumb && <span>{breadcrumb}</span>}</div>
      <div className="flex items-center gap-2 lg:gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-green-400 hover:text-green-300 text-xs lg:text-sm hidden sm:flex"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
          LIVE SYNC ACTIVE
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <User className="h-4 w-4 lg:h-5 lg:w-5" />
        </Button>
      </div>
    </header>
  );
}
