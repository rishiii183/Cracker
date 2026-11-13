'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Search,
  Plus,
  Moon,
  Sun,
  Bell,
  PanelLeft,
  LayoutDashboard,
  Users,
  CalendarClock,
  CheckSquare,
  Gauge,
  History,
  ReceiptText,
  Archive,
  Database,
  DollarSign,
  FileText,
  GitBranch,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';

export default function CommandPalette() {
  const router = useRouter();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    toggleTheme,
    theme,
    setAddLeadModalOpen,
    setNotificationsOpen,
    toggleSidebar,
    setSelectedLeadForSlideOver,
  } = useApp();

  const [query, setQuery] = useState('');
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      // Load recent leads for quick search
      fetch('/api/leads?limit=10')
        .then((res) => res.json())
        .then((data) => {
          if (data?.leads) setLeads(data.leads);
        })
        .catch(() => {});
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const quickActions = [
    {
      id: 'add_lead',
      label: 'Add a lead',
      icon: Plus,
      action: () => {
        setCommandPaletteOpen(false);
        setAddLeadModalOpen(true);
      },
    },
    {
      id: 'add_todo',
      label: 'Add a to do',
      icon: CheckSquare,
      action: () => {
        setCommandPaletteOpen(false);
        router.push('/lt/todos?new=true');
      },
    },
    {
      id: 'toggle_dark',
      label: `Toggle dark mode (current: ${theme})`,
      icon: theme === 'light' ? Moon : Sun,
      action: () => {
        toggleTheme();
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'open_notifications',
      label: 'Open notifications',
      icon: Bell,
      action: () => {
        setCommandPaletteOpen(false);
        setNotificationsOpen(true);
      },
    },
    {
      id: 'collapse_sidebar',
      label: 'Collapse/Expand sidebar',
      icon: PanelLeft,
      action: () => {
        toggleSidebar();
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'go_dashboard',
      label: 'Go to Dashboard',
      icon: LayoutDashboard,
      action: () => {
        setCommandPaletteOpen(false);
        router.push('/lt/dashboard');
      },
    },
  ];

  const suggestedPages = [
    { label: 'Dashboard', path: '/lt/dashboard', icon: LayoutDashboard },
    { label: 'Leads', path: '/lt/leads', icon: Users },
    { label: 'Follow ups', path: '/lt/followups', icon: CalendarClock },
    { label: 'To dos', path: '/lt/todos', icon: CheckSquare },
    { label: 'Outreach Tracker', path: '/lt/outreach', icon: Gauge },
    { label: 'Activity', path: '/lt/activity', icon: History },
    { label: 'Ledger', path: '/lt/ledger', icon: ReceiptText },
    { label: 'Archive', path: '/lt/archive', icon: Archive },
    { label: 'Import / Export', path: '/lt/data', icon: Database },
    { label: 'Records', path: '/crm/records', icon: Database },
    { label: 'Pipeline', path: '/crm/pipeline', icon: GitBranch },
    { label: 'Revenue', path: '/crm/revenue', icon: DollarSign },
    { label: 'Invoices', path: '/crm/invoices', icon: FileText },
    { label: 'Admin Control Center', path: '/admin', icon: ShieldCheck },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const filteredQuickActions = quickActions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPages = suggestedPages.filter((p) =>
    p.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredLeads = leads.filter((l) =>
    (l.companyName || '').toLowerCase().includes(query.toLowerCase()) ||
    (l.leadCode || '').toLowerCase().includes(query.toLowerCase()) ||
    (l.stage || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 z-50 p-4"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[70vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            autoFocus
            type="text"
            placeholder="Search leads, actions, pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[11px] text-zinc-500 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs">
          {/* Quick Actions */}
          {filteredQuickActions.length > 0 && (
            <div>
              <p className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                Quick actions
              </p>
              <div className="space-y-0.5">
                {filteredQuickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors text-left"
                    >
                      <Icon className="w-4 h-4 text-zinc-500 shrink-0" />
                      <span className="font-medium">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Leads Nearby / Search Results */}
          {filteredLeads.length > 0 && (
            <div>
              <p className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                Leads nearby
              </p>
              <div className="space-y-0.5">
                {filteredLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => {
                      setCommandPaletteOpen(false);
                      setSelectedLeadForSlideOver(lead.id);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {lead.companyName}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {lead.leadCode}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 font-medium">
                        {lead.stage}
                      </span>
                      <span className="text-[10px] text-zinc-400">{lead.channel}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Pages */}
          {filteredPages.length > 0 && (
            <div>
              <p className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                Suggested pages
              </p>
              <div className="grid grid-cols-2 gap-1">
                {filteredPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.path}
                      onClick={() => {
                        setCommandPaletteOpen(false);
                        router.push(page.path);
                      }}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors text-left"
                    >
                      <Icon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{page.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

