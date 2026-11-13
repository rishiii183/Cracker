'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Calendar,
  Clock,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';

export default function FollowUpsPage() {
  const { setSelectedLeadForSlideOver, refreshTrigger, triggerRefresh, currentUser } = useApp();

  const [search, setSearch] = useState('');
  const [channel, setChannel] = useState('All channels');
  const [stage, setStage] = useState('All stages');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [overdueOpen, setOverdueOpen] = useState(true);
  const [dueTodayOpen, setDueTodayOpen] = useState(true);
  const [upcomingOpen, setUpcomingOpen] = useState(true);

  // Snooze dropdown state
  const [activeSnoozeId, setActiveSnoozeId] = useState<string | null>(null);

  const loadFollowUps = () => {
    setLoading(true);
    const params = new URLSearchParams({
      search,
      channel,
      stage,
    });
    fetch(`/api/followups?${params.toString()}`)
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFollowUps();
  }, [search, channel, stage, refreshTrigger]);

  const handleMarkSent = async (fupId: string) => {
    await fetch('/api/followups', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'markSent',
        followUpId: fupId,
        sentBy: currentUser.name,
      }),
    });
    triggerRefresh();
    loadFollowUps();
  };

  const handleSnooze = async (fupId: string, days: number) => {
    await fetch('/api/followups', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'snooze',
        followUpId: fupId,
        snoozeDays: days,
      }),
    });
    setActiveSnoozeId(null);
    triggerRefresh();
    loadFollowUps();
  };

  const handleStopFollowUps = async (leadId: string) => {
    await fetch('/api/followups', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'stop',
        leadId,
      }),
    });
    setActiveSnoozeId(null);
    triggerRefresh();
    loadFollowUps();
  };

  const handleClearDate = async (fupId: string) => {
    await fetch('/api/followups', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'setDate',
        followUpId: fupId,
        newDate: null,
      }),
    });
    triggerRefresh();
    loadFollowUps();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-xs text-zinc-800 dark:text-zinc-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Follow-ups
        </h1>
      </div>

      {/* Filter Row matching Screenshot 8 */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs focus:outline-none"
            />
          </div>

          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-semibold focus:outline-none"
          >
            <option value="All channels">All channels</option>
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Email">Email</option>
          </select>

          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-semibold focus:outline-none"
          >
            <option value="All stages">All stages</option>
            <option value="Contacted">Contacted</option>
            <option value="Following up">Following up</option>
            <option value="Replied">Replied</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="selectAll" className="rounded border-zinc-300" />
          <label htmlFor="selectAll" className="font-semibold text-zinc-600 dark:text-zinc-400">
            Select all ({data?.totalCount || 879})
          </label>
        </div>
      </div>

      {/* Overdue Section */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
        <button
          onClick={() => setOverdueOpen(!overdueOpen)}
          className="w-full flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 transition-transform ${
                overdueOpen ? 'rotate-0' : '-rotate-90'
              }`}
            />
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Overdue</span>
          </div>
          <span className="text-xs font-bold text-red-500">
            {data?.overdueCount || 88}
          </span>
        </button>

        {overdueOpen && (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {(data?.overdue || []).map((fup: any) => (
              <div
                key={fup.id}
                className="flex flex-wrap items-center justify-between p-3.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 gap-3"
              >
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded border-zinc-300" />
                  <div>
                    <span
                      onClick={() => setSelectedLeadForSlideOver(fup.leadId)}
                      className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer"
                    >
                      {fup.lead?.companyName}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-zinc-400">
                        #{fup.stepNumber}
                      </span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                        • {fup.lead?.stage || 'Contacted'}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        • {fup.channel || fup.lead?.channel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 relative">
                  {/* Date button with clear */}
                  <button
                    onClick={() => handleClearDate(fup.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 font-medium"
                  >
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>
                      {fup.dueDate
                        ? new Date(fup.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'No date'}
                    </span>
                    <X className="w-3 h-3 text-zinc-400 hover:text-red-500" />
                  </button>

                  {/* Snooze Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveSnoozeId(activeSnoozeId === fup.id ? null : fup.id)
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 font-medium"
                    >
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Snooze</span>
                      <ChevronDown className="w-3 h-3 text-zinc-400" />
                    </button>

                    {activeSnoozeId === fup.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-1 z-30 space-y-0.5">
                        <button
                          onClick={() => handleSnooze(fup.id, 1)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          Tomorrow (+1 day)
                        </button>
                        <button
                          onClick={() => handleSnooze(fup.id, 3)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          In 3 days
                        </button>
                        <button
                          onClick={() => handleSnooze(fup.id, 7)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          In 1 week
                        </button>
                        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-0.5">
                          <button
                            onClick={() => handleStopFollowUps(fup.leadId)}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 font-semibold"
                          >
                            Stop follow ups for this lead
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mark sent */}
                  <button
                    onClick={() => handleMarkSent(fup.id)}
                    className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 font-semibold text-zinc-800 dark:text-zinc-200 shadow-2xs"
                  >
                    Mark sent
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Due Today Section */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
        <button
          onClick={() => setDueTodayOpen(!dueTodayOpen)}
          className="w-full flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 transition-transform ${
                dueTodayOpen ? 'rotate-0' : '-rotate-90'
              }`}
            />
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Due today</span>
          </div>
          <span className="text-xs font-bold text-zinc-500">{data?.dueTodayCount || 0}</span>
        </button>

        {dueTodayOpen && (
          <div className="p-8 text-center text-xs text-zinc-400">
            <p className="font-semibold text-zinc-600 dark:text-zinc-300">Nothing due today.</p>
            <p className="mt-0.5">Enjoy the clear slate.</p>
          </div>
        )}
      </div>
    </div>
  );
}

