'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Book,
  BookOpen,
  FileText,
  Home,
  LayoutDashboard,
  Menu,
  Package,
  PlusCircle,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { name: 'DASHBOARD', href: '/dashboard', icon: LayoutDashboard },
  { name: 'CREATE POLL', href: '/create-poll', icon: PlusCircle },
  { name: 'CREATE EPISODE', href: '/create-episode', icon: BookOpen },
  { name: 'EPISODE MANAGEMENT', href: '/episodes', icon: Book },
  { name: 'POLL MANAGEMENT', href: '/polls', icon: BarChart3 },
  { name: 'E-MAIL LIST', href: '/emails', icon: Users },
  { name: 'CONTENT MANAGER', href: '/content', icon: FileText },
  { name: 'PRODUCT STORE', href: '/products', icon: Package },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed z-50 top-4 left-4 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-[#0a0a0a] border-r border-border flex flex-col z-40 transition-transform duration-300',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/assets/images/sporefall.jpeg"
                alt="Spore Fall Logo"
                fill
                className="object-contain rounded"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold">
              <span className="text-white">SPORE</span> <span className="text-yellow-400">FALL</span>
            </h1>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors relative',
                  isActive
                    ? 'bg-teal-900/30 text-teal-400 border-l-4 border-teal-400'
                    : 'text-gray-400 hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive ? 'text-teal-400' : 'text-gray-400')} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <Home className="w-5 h-5 text-gray-400" />
            <span>BACK TO SITE</span>
          </Link>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
}
