'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  CheckSquare,
  Gauge,
  History,
  ReceiptText,
  Archive,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Settings,
  LogOut,
  Copy,
  Keyboard,
  Mail,
  Table,
  Check,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon, LinkedInIcon } from '@/components/ui/BrandIcons';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    workspace,
    setWorkspace,
    currentUser,
    toggleRole,
    sidebarCollapsed,
    toggleSidebar,
    theme,
  } = useApp();

  const [leadsExpanded, setLeadsExpanded] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const isRouteActive = (route: string) => {
    if (route === '/lt/leads') {
      return pathname === '/lt/leads';
    }
    return pathname.startsWith(route);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  return (
    <aside
      className={`relative flex flex-col border-r transition-all duration-200 z-30 select-none ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-screen sticky top-0`}
    >
      {/* Workspace Selector */}
      <div className="p-3 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
        {!sidebarCollapsed ? (
          <div className="relative w-full">
            <button
              onClick={() => setWorkspaceMenuOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  C
                </div>
                <div className="truncate text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black tracking-wider uppercase text-amber-600 dark:text-amber-400">
                      Cracker
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                      HQ
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate block">
                    {workspace.name}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
            </button>

            {workspaceMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg p-1.5 z-50 text-xs">
                <div className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-900 dark:text-zinc-100">
                  <span className="truncate">{workspace.name}</span>
                  <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white shrink-0" />
                </div>
                <button
                  onClick={() => {
                    router.push('/admin');
                    setWorkspaceMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-amber-600 dark:text-amber-400 font-semibold mt-1 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Controls
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex justify-center py-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
              C
            </div>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 ml-1"
        >
          {sidebarCollapsed ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Module Button */}
      {!sidebarCollapsed && (
        <div className="px-3 pt-3">
          <button
            onClick={() => router.push('/lt/dashboard')}
            className="w-full py-1.5 px-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1.5 shadow-xs hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
            Lead Tracker
          </button>
        </div>
      )}

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {/* LEAD TRACKER SECTION */}
        <div>
          {!sidebarCollapsed && (
            <p className="px-2 text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-1">
              Lead Tracker
            </p>
          )}

          <nav className="space-y-0.5">
            <button
              onClick={() => router.push('/lt/dashboard')}
              title="Dashboard"
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/lt/dashboard'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <LayoutDashboard className="w-4 h-4 text-zinc-500" />
              {!sidebarCollapsed && <span>Dashboard</span>}
            </button>

            {/* Expandable Leads Section */}
            <div>
              <div
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  pathname.startsWith('/lt/leads')
                    ? 'text-zinc-900 dark:text-white font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                onClick={() => {
                  if (sidebarCollapsed) {
                    router.push('/lt/leads');
                  } else {
                    setLeadsExpanded((prev) => !prev);
                  }
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-zinc-500" />
                  {!sidebarCollapsed && <span>Leads</span>}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                      leadsExpanded ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                )}
              </div>

              {!sidebarCollapsed && leadsExpanded && (
                <div className="pl-6 pr-1 py-0.5 space-y-0.5 border-l border-zinc-100 dark:border-zinc-800 ml-4">
                  <button
                    onClick={() => router.push('/lt/leads')}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors ${
                      pathname === '/lt/leads'
                        ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Table className="w-3.5 h-3.5 text-emerald-500" />
                    <span>All Leads</span>
                  </button>
                  <button
                    onClick={() => router.push('/lt/leads/instagram')}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors ${
                      pathname === '/lt/leads/instagram'
                        ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                    <span>Instagram</span>
                  </button>
                  <button
                    onClick={() => router.push('/lt/leads/linkedin')}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors ${
                      pathname === '/lt/leads/linkedin'
                        ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <LinkedInIcon className="w-3.5 h-3.5 text-sky-500" />
                    <span>LinkedIn</span>
                  </button>
                  <button
                    onClick={() => router.push('/lt/leads/email')}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors ${
                      pathname === '/lt/leads/email'
                        ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-red-500" />
                    <span>Email</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => router.push('/lt/followups')}
              title="Follow-ups"
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/lt/followups'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <CalendarClock className="w-4 h-4 text-zinc-500" />
              {!sidebarCollapsed && <span>Follow-ups</span>}
            </button>

            <button
              onClick={() => router.push('/lt/todos')}
              title="To-dos"
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/lt/todos'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <CheckSquare className="w-4 h-4 text-zinc-500" />
              {!sidebarCollapsed && <span>To-dos</span>}
            </button>

            <button
              onClick={() => router.push('/lt/outreach')}
              title="Outreach Tracker"
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/lt/outreach'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <Gauge className="w-4 h-4 text-zinc-500" />
              {!sidebarCollapsed && <span>Outreach Tracker</span>}
            </button>
          </nav>
        </div>

        {/* OPERATIONS AND LOGS SECTION */}
        <div>
          {!sidebarCollapsed && (
            <p className="px-2 text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-1">
              Operations & Logs
            </p>
          )}

          <nav className="space-y-0.5">
            <button
              onClick={() => router.push('/lt/activity')}
              title="Activity"
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/lt/activity'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <History className="w-4 h-4 text-zinc-500" />
              {!sidebarCollapsed && <span>Activity</span>}
            </button>

            <button
              onClick={() => router.push('/lt/ledger')}
              title="Ledger"
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/lt/ledger'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <ReceiptText className="w-4 h-4 text-zinc-500" />
              {!sidebarCollapsed && <span>Ledger</span>}
            </button>

            <button
              onClick={() => router.push('/lt/archive')}
              title="Archive"
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === '/lt/archive'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <Archive className="w-4 h-4 text-zinc-500" />
              {!sidebarCollapsed && <span>Archive</span>}
            </button>
          </nav>
        </div>

        {/* ADMIN SECTION */}
        <div>
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between px-2 mb-1">
              <p className="text-[10px] font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
                Admin Controls
              </p>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                Master
              </span>
            </div>
          )}

          <nav className="space-y-0.5">
            <button
              onClick={() => router.push('/admin')}
              title="Admin Control Center"
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pathname === '/admin'
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30 shadow-xs'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 hover:text-amber-600 dark:hover:text-amber-400'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
              {!sidebarCollapsed && <span>Admin Center</span>}
            </button>
          </nav>
        </div>
      </div>

      {/* Profile & Footer Menu at Bottom */}
      <div className="p-3 border-t border-zinc-100 dark:border-zinc-900 relative">
        <div
          onClick={() => setProfileOpen((prev) => !prev)}
          className={`flex items-center gap-2.5 p-1.5 rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors ${
            sidebarCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-2.5 truncate">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-zinc-700 text-white text-xs flex items-center justify-center font-bold shrink-0">
                {currentUser.name.charAt(0)}
              </div>
            )}
            {!sidebarCollapsed && (
              <div className="truncate text-left leading-tight">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                  {currentUser.email}
                </p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          )}
        </div>

        {/* Profile Popover Menu */}
        {profileOpen && (
          <div className="absolute bottom-14 left-3 right-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-1.5 z-50 text-xs">
            <div className="px-2.5 py-1.5 border-b border-zinc-100 dark:border-zinc-800 mb-1 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">Current Role</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                {currentUser.role}
              </span>
            </div>

            {currentUser.role === 'Admin' && (
              <button
                onClick={() => {
                  router.push('/admin');
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold mb-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Admin Control Center</span>
              </button>
            )}

            <button
              onClick={() => {
                router.push('/settings#account');
                setProfileOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            >
              <Settings className="w-3.5 h-3.5 text-zinc-500" />
              <span>Account settings</span>
            </button>

            <button
              onClick={() => {
                router.push('/lt/todos');
                setProfileOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            >
              <CheckSquare className="w-3.5 h-3.5 text-zinc-500" />
              <span>My to dos</span>
            </button>

            <button
              onClick={() => copyToClipboard(currentUser.id, 'User ID copied')}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            >
              <span className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
                Copy my user ID
              </span>
              {copyFeedback === 'User ID copied' && (
                <span className="text-[10px] text-emerald-600 font-semibold">Copied!</span>
              )}
            </button>

            <button
              onClick={() => copyToClipboard('key_live_tracker_8839219', 'API Key copied')}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            >
              <span className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
                Copy API key
              </span>
              {copyFeedback === 'API Key copied' && (
                <span className="text-[10px] text-emerald-600 font-semibold">Copied!</span>
              )}
            </button>

            <button
              onClick={() => {
                alert('Shortcuts:\nCmd/Ctrl + K: Global Command Palette\nAlt + T: Notifications\nCmd/Ctrl + 1: Lead Tracker Dashboard');
                setProfileOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            >
              <Keyboard className="w-3.5 h-3.5 text-zinc-500" />
              <span>Keyboard shortcuts</span>
            </button>

            <button
              onClick={() => {
                toggleRole();
                setProfileOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-medium"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Switch role to {currentUser.role === 'Admin' ? 'Member' : 'Admin'}</span>
            </button>

            <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1">
              <button
                onClick={() => {
                  alert('Logged out');
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}

        {!sidebarCollapsed && (
          <div className="mt-2 text-center text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
            App Version 1.0.0
          </div>
        )}
      </div>
    </aside>
  );
}
