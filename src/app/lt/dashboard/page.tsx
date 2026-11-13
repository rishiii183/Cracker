'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  AlertTriangle,
  Clock,
  ExternalLink,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Plus,
  Check,
  X,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { setSelectedLeadForSlideOver, refreshTrigger } = useApp();

  const [dateRange, setDateRange] = useState('This month');
  const [leadMode, setLeadMode] = useState<'worked' | 'added'>('worked');
  const [channelTab, setChannelTab] = useState('All channels');
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [ratesData, setRatesData] = useState<any>(null);
  const [followUpsData, setFollowUpsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Collapsible lists
  const [overdueExpanded, setOverdueExpanded] = useState(true);
  const [dueTodayExpanded, setDueTodayExpanded] = useState(false);
  const [upcomingExpanded, setUpcomingExpanded] = useState(false);

  // Hidden rates config (default: show 5 core rates, 8 hidden)
  const [visibleRateIds, setVisibleRateIds] = useState<string[]>([
    'outreach_sent',
    'email_sent',
    'instagram_sent',
    'meetings_booked',
    'client_close',
  ]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(
        `/api/rates?channel=${encodeURIComponent(channelTab)}&mode=${leadMode}&range=${encodeURIComponent(dateRange)}`
      ).then((res) => res.json()),
      fetch('/api/followups').then((res) => res.json()),
    ])
      .then(([rates, followups]) => {
        setRatesData(rates);
        setFollowUpsData(followups);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [dateRange, leadMode, channelTab, refreshTrigger]);

  const toggleRateVisibility = (id: string) => {
    setVisibleRateIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const hiddenCount = (ratesData?.rates?.length || 13) - visibleRateIds.length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Title & Google Sheet Link */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>
        <a
          href="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Google Sheet</span>
        </a>
      </div>

      {/* Alert Banners */}
      <div className="space-y-2.5">
        {/* Overdue Banner (Light Red) */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-red-50/70 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 text-xs">
          <div className="flex items-center gap-2.5 text-red-900 dark:text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>
              <strong className="font-semibold">
                {followUpsData?.overdueCount || 88} follow-ups are overdue.
              </strong>{' '}
              <span className="text-zinc-700 dark:text-zinc-400">
                @coachedbymillie, @alexagruber.ig, @loriharder and 85 more are waiting on you.
              </span>
            </span>
          </div>
          <button
            onClick={() => router.push('/lt/followups')}
            className="px-3 py-1.5 rounded-full border border-red-300 dark:border-red-800 bg-white dark:bg-zinc-900 text-red-700 dark:text-red-300 font-semibold hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors shadow-2xs shrink-0"
          >
            Review now
          </button>
        </div>

        {/* Due Today Banner (Amber) */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-300">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong className="font-semibold">
                {followUpsData?.dueTodayCount || 45} follow-ups due today.
              </strong>{' '}
              <span className="text-zinc-700 dark:text-zinc-400">
                Clear them before the day ends.
              </span>
            </span>
          </div>
          <button
            onClick={() => router.push('/lt/followups')}
            className="px-3 py-1.5 rounded-full border border-amber-300 dark:border-amber-800 bg-white dark:bg-zinc-900 text-amber-800 dark:text-amber-300 font-semibold hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors shadow-2xs shrink-0"
          >
            Open follow-ups
          </button>
        </div>
      </div>

      {/* 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <p className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
            Leads Added Today
          </p>
          <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-2">
            {ratesData?.kpis?.leadsAddedToday ?? 14}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <p className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
            Leads Added This Week
          </p>
          <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-2">
            {ratesData?.kpis?.leadsAddedThisWeek ?? 121}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <p className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
            Total Active Leads
          </p>
          <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-2">
            {ratesData?.kpis?.totalActiveLeads ?? 391}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <p className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
            Overdue Follow-ups
          </p>
          <p className="text-3xl font-extrabold text-red-500 dark:text-red-400 mt-2">
            {followUpsData?.overdueCount ?? 88}
          </p>
        </div>
      </div>

      {/* Date Range Selector Pills + Range Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 w-fit text-xs">
          {['Today', 'This week', 'This month', 'Last 30 days', 'Custom'].map((item) => (
            <button
              key={item}
              onClick={() => setDateRange(item)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                dateRange === item
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          {ratesData?.dateRangeSummary || '173 leads added Nov 01, 2026 to Nov 13, 2026'}
        </div>
      </div>

      {/* Outreach Rates Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Outreach rates
              </h2>
              <button
                onClick={() => router.push('/guide#rates')}
                title="How these rates are calculated"
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Which leads to count: Worked on in range vs Added in range */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-[11px]">
              <button
                onClick={() => setLeadMode('worked')}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${
                  leadMode === 'worked'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                Worked on in range
              </button>
              <button
                onClick={() => setLeadMode('added')}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${
                  leadMode === 'added'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                Added in range
              </button>
            </div>
          </div>

          {/* Channel Tabs & Customize Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs">
              {['All channels', 'Email', 'Instagram', 'LinkedIn'].map((ch) => (
                <button
                  key={ch}
                  onClick={() => setChannelTab(ch)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    channelTab === ch
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCustomizeOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Customize</span>
              {hiddenCount > 0 && (
                <span className="text-[10px] text-zinc-400 font-normal ml-0.5">
                  {hiddenCount} hidden
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Rate Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {(ratesData?.rates || [])
            .filter((r: any) => visibleRateIds.includes(r.id))
            .map((card: any) => (
              <div
                key={card.id}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase truncate">
                    {card.name}
                  </p>
                  <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">
                    {card.format}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">
                    {card.fraction}
                  </p>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 mt-4 overflow-hidden">
                  <div
                    className="bg-zinc-900 dark:bg-zinc-100 h-1.5 rounded-full"
                    style={{ width: `${Math.min(card.rate || 0, 100)}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Follow-up Triage Lists */}
      <div className="space-y-3 pt-2">
        {/* Overdue Section */}
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
          <button
            onClick={() => setOverdueExpanded(!overdueExpanded)}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform ${
                  overdueExpanded ? 'rotate-0' : '-rotate-90'
                }`}
              />
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Overdue</span>
            </div>
            <span className="text-xs font-bold text-red-500">
              {followUpsData?.overdueCount ?? 88}
            </span>
          </button>

          {overdueExpanded && (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border-t border-zinc-100 dark:border-zinc-800">
              {(followUpsData?.overdue || []).slice(0, 10).map((fup: any) => (
                <div
                  key={fup.id}
                  onClick={() => setSelectedLeadForSlideOver(fup.leadId)}
                  className="flex items-center justify-between p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-[10px] font-bold flex items-center justify-center">
                      {(fup.lead?.companyName || 'L').replace('@', '').slice(0, 2).toLowerCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {fup.lead?.companyName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-zinc-400">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                      • {fup.lead?.stage || 'Contacted'}
                    </span>
                    <span className="text-[11px]">{fup.channel || fup.lead?.channel}</span>
                    <span className="text-[11px]">
                      {fup.dueDate ? new Date(fup.dueDate).toLocaleDateString() : 'Overdue'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Due Today Section */}
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
          <button
            onClick={() => setDueTodayExpanded(!dueTodayExpanded)}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform ${
                  dueTodayExpanded ? 'rotate-0' : '-rotate-90'
                }`}
              />
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Due today</span>
            </div>
            <span className="text-xs font-bold text-zinc-500">
              {followUpsData?.dueTodayCount ?? 0}
            </span>
          </button>

          {dueTodayExpanded && (
            <div className="p-8 text-center text-xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800">
              <p className="font-semibold text-zinc-600 dark:text-zinc-300">Nothing here.</p>
              <p className="mt-0.5">
                No follow ups require your attention, and You are all clear for today.
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Section */}
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
          <button
            onClick={() => setUpcomingExpanded(!upcomingExpanded)}
            className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform ${
                  upcomingExpanded ? 'rotate-0' : '-rotate-90'
                }`}
              />
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Upcoming (7 days)
              </span>
            </div>
            <span className="text-xs font-bold text-zinc-500">
              {followUpsData?.upcomingCount ?? 0}
            </span>
          </button>

          {upcomingExpanded && (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border-t border-zinc-100 dark:border-zinc-800">
              {(followUpsData?.upcoming || []).map((fup: any) => (
                <div
                  key={fup.id}
                  onClick={() => setSelectedLeadForSlideOver(fup.leadId)}
                  className="flex items-center justify-between p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors text-xs"
                >
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {fup.lead?.companyName}
                  </span>
                  <span className="text-zinc-400">
                    {fup.dueDate ? new Date(fup.dueDate).toLocaleDateString() : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Customize Rate Cards Dialog */}
      {customizeOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          onClick={() => setCustomizeOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Customize Rates
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Toggle the rates you want visible on Dashboard and channel pages.
                </p>
              </div>
              <button
                onClick={() => setCustomizeOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 text-xs">
              {(ratesData?.rates || []).map((r: any) => {
                const isVis = visibleRateIds.includes(r.id);
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">{r.name}</span>
                    <button
                      onClick={() => toggleRateVisibility(r.id)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                        isVis ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white dark:bg-zinc-900 transition-transform ${
                          isVis ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setCustomizeOpen(false)}
                className="px-4 py-1.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

