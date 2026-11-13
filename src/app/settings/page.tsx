'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  ChevronLeft,
  User,
  Bot,
  Smartphone,
  FileText,
  Mail,
  Calendar,
  Zap,
  Bookmark,
  FileSpreadsheet,
  CreditCard,
  MessageCircle,
  AlertOctagon,
  Copy,
  Check,
  Shield,
  Layers,
  Settings as SettingsIcon,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, theme, setTheme, workspace, triggerRefresh } = useApp();

  const [activeSection, setActiveSection] = useState('account');
  const [name, setName] = useState(currentUser.name);
  const [defaultLeadView, setDefaultLeadView] = useState('Table');
  const [defaultLandingModule, setDefaultLandingModule] = useState('Lead Tracker');
  const [googleSheetUrl, setGoogleSheetUrl] = useState(
    'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit'
  );
  const [googleDriveFolder, setGoogleDriveFolder] = useState('');

  // Notification toggles
  const [notifs, setNotifs] = useState<Record<string, boolean>>({
    followUpComplete: true,
    followUpMissed: false,
    followUpResponse: false,
    dailySummary: false,
    weeklySummary: false,
    weeklyGoalAchieved: false,
    weeklyGoalMissed: false,
    dailyOutreachStreak: false,
  });

  // Danger zone confirmation
  const [dangerConfirmText, setDangerConfirmText] = useState('');
  const [dangerMessage, setDangerMessage] = useState<string | null>(null);

  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopyFeedback(id);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleSaveAccount = async () => {
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        settings: {
          defaultLeadView,
          defaultLandingModule,
          theme,
          googleSheetUrl,
          googleDriveFolder,
          notificationPreferences: notifs,
        },
      }),
    });
    alert('Settings saved successfully!');
    triggerRefresh();
  };

  const handleClearSampleData = async () => {
    if (dangerConfirmText !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'clearSampleData',
        confirmationText: 'DELETE',
      }),
    });
    if (res.ok) {
      setDangerMessage('Sample data cleared. Your workspace is reset.');
      setDangerConfirmText('');
      triggerRefresh();
    }
  };

  const navItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'ai_connector', label: 'AI connector', icon: Bot },
    { id: 'desktop_app', label: 'Desktop and Mobile App', icon: Smartphone },
    { id: 'invoice_templates', label: 'Invoice templates', icon: FileText },
    { id: 'outreach_templates', label: 'Outreach templates', icon: Mail },
    { id: 'followup_templates', label: 'Follow up templates', icon: Calendar },
    { id: 'rapid_entry', label: 'Rapid Entry Settings', icon: Zap },
    { id: 'bookmarklet', label: 'One click lead clipper', icon: Bookmark },
    { id: 'google_sheet', label: 'Google Sheet', icon: FileSpreadsheet },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'contact', label: 'Contact us', icon: MessageCircle },
    { id: 'danger_zone', label: 'Danger zone', icon: AlertOctagon },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-xs text-zinc-800 dark:text-zinc-200">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/lt/dashboard')}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Tracker</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Settings Sidebar */}
        <div className="w-full md:w-60 shrink-0 space-y-1">
          <p className="px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Settings
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Panel */}
        <div className="flex-1 min-w-0">
          {/* Account Section */}
          {activeSection === 'account' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Account Profile
                </h2>
                <p className="text-zinc-400 mt-0.5">Manage your user profile and workspace preferences.</p>
              </div>

              {currentUser.role === 'Admin' && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-amber-900 dark:text-amber-200 block text-xs">
                        Master Admin Controls
                      </span>
                      <span className="text-[11px] text-amber-700 dark:text-amber-400">
                        Manage workspaces, team permissions, pipeline stages, and system data.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/admin')}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-2xs"
                  >
                    Open Admin Center
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                      Theme
                    </label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-medium"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                      Default Landing Module
                    </label>
                    <select
                      value={defaultLandingModule}
                      onChange={(e) => setDefaultLandingModule(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-medium"
                    >
                      <option value="Lead Tracker">Lead Tracker</option>
                      <option value="CRM">CRM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                      Default Lead View
                    </label>
                    <select
                      value={defaultLeadView}
                      onChange={(e) => setDefaultLeadView(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-medium"
                    >
                      <option value="Table">Table</option>
                      <option value="Columns">Columns</option>
                      <option value="Cards">Cards</option>
                    </select>
                  </div>
                </div>

                {/* Follow up notification preferences */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                  <h3 className="font-bold text-xs">Follow up notification preferences</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(notifs).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
                        <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                        <input
                          type="checkbox"
                          checked={v}
                          onChange={(e) => setNotifs({ ...notifs, [k]: e.target.checked })}
                          className="rounded border-zinc-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSaveAccount}
                    className="px-5 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Connector Section */}
          {activeSection === 'ai_connector' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  AI Connector
                </h2>
                <p className="text-zinc-400 mt-0.5">
                  Connect Claude, ChatGPT, Cursor, Codex, or any AI assistant to your tracker.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-zinc-500">
                  <span>MCP Config Snippet</span>
                  <button
                    onClick={() =>
                      copyCode('{\n  "leadTracker": {\n    "endpoint": "http://localhost:3000/api"\n  }\n}', 'mcp')
                    }
                    className="text-xs font-semibold hover:text-zinc-900"
                  >
                    {copyFeedback === 'mcp' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="text-[11px] text-zinc-700 dark:text-zinc-300">
{`{
  "leadTracker": {
    "endpoint": "http://localhost:3000/api",
    "workspaceId": "${workspace.id}"
  }
}`}
                </pre>
              </div>
            </div>
          )}

          {/* Desktop & Mobile App */}
          {activeSection === 'desktop_app' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Install App
              </h2>
              <ol className="list-decimal pl-4 space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>Open Chrome menu on desktop or mobile</li>
                <li>Choose &apos;Install Lead Tracker&apos;</li>
                <li>Add to home screen for 1-click access</li>
              </ol>
            </div>
          )}

          {/* Outreach Templates */}
          {activeSection === 'outreach_templates' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Outreach Templates
              </h2>
              <div className="space-y-3">
                {[
                  { name: 'Direct dm', channel: 'Instagram', body: 'Hey {first_name}, loved your recent reel...' },
                  { name: 'Blown up', channel: 'Instagram', body: 'Hey {first_name}, saw your post blew up recently...' },
                  { name: 'ig long videos', channel: 'Instagram', body: 'Hey {first_name}, your long-form breakdowns are killer...' },
                ].map((t) => (
                  <div key={t.name} className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{t.name}</span>
                    <span className="text-zinc-400 text-[10px] ml-2">({t.channel})</span>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400">{t.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {activeSection === 'danger_zone' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 shadow-2xs space-y-4">
              <div>
                <h2 className="text-base font-bold text-red-600 dark:text-red-400">
                  Danger Zone
                </h2>
                <p className="text-zinc-400 mt-0.5">
                  Permanent actions requiring typed confirmation.
                </p>
              </div>

              {dangerMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold">
                  {dangerMessage}
                </div>
              )}

              <div className="p-4 rounded-xl border border-red-200 dark:border-red-950 bg-red-50/50 dark:bg-red-950/20 space-y-3">
                <div>
                  <h3 className="font-bold text-red-700 dark:text-red-400">
                    Clear Sample Data & Reset Everything
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-[11px] mt-0.5">
                    This will delete all leads, activity entries, to-dos, and follow-ups. Type <strong>DELETE</strong> below to confirm.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type DELETE"
                    value={dangerConfirmText}
                    onChange={(e) => setDangerConfirmText(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900 bg-white dark:bg-zinc-900 text-xs font-semibold focus:outline-none"
                  />
                  <button
                    onClick={handleClearSampleData}
                    disabled={dangerConfirmText !== 'DELETE'}
                    className="px-4 py-1.5 rounded-full bg-red-600 text-white font-semibold text-xs disabled:opacity-40 hover:bg-red-700"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other Sections Fallback */}
          {['rapid_entry', 'bookmarklet', 'google_sheet', 'billing', 'contact', 'invoice_templates', 'followup_templates'].includes(
            activeSection
          ) && (
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-4">
              <h2 className="text-base font-bold capitalize text-zinc-900 dark:text-zinc-100">
                {activeSection.replace('_', ' ')}
              </h2>
              <p className="text-zinc-400">Configured and active for {workspace.name}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

