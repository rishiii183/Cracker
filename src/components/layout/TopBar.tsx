'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    theme,
    toggleTheme,
    setCommandPaletteOpen,
    notificationsCount,
    setNotificationsOpen,
    currentUser,
  } = useApp();

  // Compute breadcrumb title from route
  const getPageTitle = () => {
    if (pathname.includes('/admin')) return 'Admin Control Center';
    if (pathname.includes('/lt/dashboard')) return 'Dashboard';
    if (pathname.includes('/lt/leads/instagram')) return 'Instagram Leads';
    if (pathname.includes('/lt/leads/linkedin')) return 'LinkedIn Leads';
    if (pathname.includes('/lt/leads/email')) return 'Email Leads';
    if (pathname.includes('/lt/leads')) return 'Leads';
    if (pathname.includes('/lt/followups')) return 'Follow-ups';
    if (pathname.includes('/lt/todos')) return 'To-dos';
    if (pathname.includes('/lt/outreach')) return 'Outreach Tracker';
    if (pathname.includes('/lt/activity')) return 'Activity';
    if (pathname.includes('/lt/ledger')) return 'Ledger';
    if (pathname.includes('/lt/archive')) return 'Archive';
    if (pathname.includes('/lt/data')) return 'Import / Export';
    if (pathname.includes('/settings')) return 'Settings';
    if (pathname.includes('/guide')) return 'User Guide';
    return 'Lead Tracker';
  };

  return (
    <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Breadcrumbs & Status Badges */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <span className="font-semibold text-amber-600 dark:text-amber-400">Cracker</span>
        <span>›</span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{getPageTitle()}</span>

        <button
          onClick={() => router.push('/guide')}
          title="How this page works"
          className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 ml-0.5"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 ml-1">
          Max
        </span>

        {currentUser.role === 'Admin' && (
          <button
            onClick={() => router.push('/admin')}
            title="Open Admin Control Center"
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3 text-amber-500" />
            Admin Center
          </button>
        )}
      </div>

      {/* Right: Search, Notifications, Theme */}
      <div className="flex items-center gap-3">
        {/* Global Search Input Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-xs w-64 justify-between transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Search leads, pages and actions</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono font-semibold text-zinc-500 dark:text-zinc-400">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => setNotificationsOpen(true)}
          title="Notifications (Alt + T)"
          className="relative p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {notificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-zinc-950">
              {notificationsCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
          className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
}

