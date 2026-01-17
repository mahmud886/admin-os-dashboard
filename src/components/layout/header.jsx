'use client';

import { LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

export function Header({ title, breadcrumb }) {
  const { user, signOut, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoggingOut(false);
    }
  };

  // Don't render user menu if still loading
  if (loading) {
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <User className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-200">Admin User</p>
                <p className="text-xs leading-none text-gray-400 truncate">{user?.email || 'Not logged in'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-red-400 focus:text-red-300"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? 'Signing out...' : 'Sign Out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
