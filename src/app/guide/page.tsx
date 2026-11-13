'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, BookOpen } from 'lucide-react';

export default function GuidePage() {
  const router = useRouter();

  const sections = [
    {
      id: 'dashboard',
      title: 'Dashboard (/lt/dashboard)',
      content:
        'Provides daily follow-up triage, overdue alerts, KPI cards (Leads Added Today, This Week, Total Active Leads, Overdue Follow-ups), and 13 customizable rate cards with live percentage calculations.',
    },
    {
      id: 'leads',
      title: 'Leads & All Leads (/lt/leads)',
      content:
        'The master outreach database. Supports Table, Columns (Kanban), Cards, and Calendar views with 12 combined filters. Strict save-only creation guarantees no blank untitled leads.',
    },
    {
      id: 'followups',
      title: 'Follow-ups Queue (/lt/followups)',
      content:
        'Work your outreach ladder through Overdue, Due Today, and Upcoming lists. Features 1-click Mark Sent, Snooze (+1 day, +3 days, +1 week), and Stop Follow-ups.',
    },
    {
      id: 'todos',
      title: 'To-dos (/lt/todos)',
      content:
        'Team task management supporting List and Kanban Board views, mentions, lead associations, and collapsible due-date groupings.',
    },
    {
      id: 'outreach',
      title: 'Outreach Tracker (/lt/outreach)',
      content:
        'Tracks daily outreach volume, active day streaks, channel breakdowns (Email, Instagram, LinkedIn), targets, sender account metrics, and stacked bar charts.',
    },
    {
      id: 'activity',
      title: 'Activity Log (/lt/activity)',
      content:
        'The canonical event ledger. Outreach and reply events logged here directly drive the calculations across Ledger and Outreach Tracker.',
    },
    {
      id: 'ledger',
      title: 'Ledger (/lt/ledger)',
      content:
        'Granular Day/Week/Month/Year accounting of all outreach events with comparisons vs previous periods and CSV exports.',
    },
    {
      id: 'archive',
      title: 'Archive (/lt/archive)',
      content:
        'Search and restore archived leads back to active pipeline stages.',
    },
    {
      id: 'settings',
      title: 'Settings (/settings)',
      content:
        'Account profile, notification preferences, outreach templates, follow-up sequences, AI MCP connector, Google Sheet sync, and Danger Zone reset controls.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs text-zinc-800 dark:text-zinc-200">
      <button
        onClick={() => router.push('/lt/dashboard')}
        className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 font-semibold"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          <span>Lead Tracker Guide & Documentation</span>
        </h1>
        <p className="text-zinc-400 mt-1">
          Complete guide explaining how each module, rate card, and workflow functions.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((sec) => (
          <div
            key={sec.id}
            id={sec.id}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-2"
          >
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {sec.title}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {sec.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

