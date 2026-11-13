'use client';

import React, { Suspense } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import CommandPalette from '@/components/layout/CommandPalette';
import NotificationsModal from '@/components/layout/NotificationsModal';
import AddLeadModal from '@/components/leads/AddLeadModal';
import LeadSlideOver from '@/components/leads/LeadSlideOver';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-zinc-950" />}>
      <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 flex font-sans text-zinc-900 dark:text-zinc-100 antialiased selection:bg-zinc-200 dark:selection:bg-zinc-800">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 p-6 overflow-y-auto">
            <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading...</div>}>
              {children}
            </Suspense>
          </main>
        </div>

        {/* Global Modals & Overlays */}
        <CommandPalette />
        <NotificationsModal />
        <AddLeadModal />
        <LeadSlideOver />
      </div>
    </Suspense>
  );
}
