'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  HelpCircle,
  SlidersHorizontal,
  Plus,
  Minus,
  Edit2,
  ChevronDown,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function OutreachTrackerPage() {
  const { refreshTrigger } = useApp();

  const [dateRange, setDateRange] = useState('Last 30 days');
  const [channel, setChannel] = useState('All channels');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Targets state
  const [emailTarget, setEmailTarget] = useState<number | null>(null);
  const [instagramTarget, setInstagramTarget] = useState<number | null>(null);
  const [linkedinTarget, setLinkedinTarget] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/outreach?channel=${encodeURIComponent(channel)}&range=${encodeURIComponent(dateRange)}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [dateRange, channel, refreshTrigger]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-xs text-zinc-800 dark:text-zinc-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Outreach Tracker
        </h1>
      </div>

      {/* Date Range & Channel Bar matching Screenshot 10 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 w-fit">
          {['This week', 'This month', 'Last 30 days', 'Last 3 months', 'This year', 'Custom'].map(
            (item) => (
              <button
                key={item}
                onClick={() => setDateRange(item)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  dateRange === item
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {['All channels', 'Email', 'Instagram', 'LinkedIn'].map((ch) => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={`px-3 py-1.5 rounded-lg font-semibold ${
                  channel === ch
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                    : 'text-zinc-500'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>
        </div>
      </div>

      {/* 3 Channel Cards across matching Screenshot 10 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Email Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Email</h3>
            <span className="text-zinc-400">/ - today</span>
          </div>

          <div>
            <p className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {data?.channels?.email?.today ?? 0}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">
              Automatic 0 + Manual +0 = 0 <HelpCircle className="w-3 h-3 inline text-zinc-300" />
            </p>
          </div>

          {/* Target editor */}
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              {emailTarget ? `Target: ${emailTarget}` : 'No target set'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEmailTarget(Math.max((emailTarget || 10) - 5, 0))}
                className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold"
              >
                -
              </button>
              <input
                type="text"
                placeholder="Amount"
                value={emailTarget ?? ''}
                onChange={(e) => setEmailTarget(Number(e.target.value) || null)}
                className="w-full text-center px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold"
              />
              <button
                onClick={() => setEmailTarget((emailTarget || 0) + 5)}
                className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* By sender accounts */}
          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase">By sender account</p>
            {(data?.channels?.email?.senders || []).map((s: any) => (
              <div key={s.name} className="flex items-center justify-between text-xs py-1">
                <span className="truncate text-zinc-700 dark:text-zinc-300">
                  {s.name} · <span className="text-zinc-400">Active</span>
                </span>
                <span className="text-zinc-500 font-medium">
                  {s.today} today · {s.inRange} in range
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Instagram Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Instagram</h3>
            <span className="text-zinc-400">/ - today</span>
          </div>

          <div>
            <p className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {data?.channels?.instagram?.today ?? 14}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">
              Automatic 14 + Manual +0 = 14 <HelpCircle className="w-3 h-3 inline text-zinc-300" />
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              {instagramTarget ? `Target: ${instagramTarget}` : 'No target set'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setInstagramTarget(Math.max((instagramTarget || 20) - 5, 0))}
                className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold"
              >
                -
              </button>
              <input
                type="text"
                placeholder="Amount"
                value={instagramTarget ?? ''}
                onChange={(e) => setInstagramTarget(Number(e.target.value) || null)}
                className="w-full text-center px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold"
              />
              <button
                onClick={() => setInstagramTarget((instagramTarget || 0) + 5)}
                className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase">By sender account</p>
            {(data?.channels?.instagram?.senders || []).map((s: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1">
                <span className="truncate text-zinc-700 dark:text-zinc-300">
                  {s.name} · <span className="text-zinc-400">Active</span>
                </span>
                <span className="text-zinc-500 font-medium">
                  {s.today} today · {s.inRange} in range
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* LinkedIn Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">LinkedIn</h3>
            <span className="text-zinc-400">/ - today</span>
          </div>

          <div>
            <p className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {data?.channels?.linkedin?.today ?? 0}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">
              Automatic 0 + Manual +0 = 0 <HelpCircle className="w-3 h-3 inline text-zinc-300" />
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              {linkedinTarget ? `Target: ${linkedinTarget}` : 'No target set'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLinkedinTarget(Math.max((linkedinTarget || 10) - 5, 0))}
                className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold"
              >
                -
              </button>
              <input
                type="text"
                placeholder="Amount"
                value={linkedinTarget ?? ''}
                onChange={(e) => setLinkedinTarget(Number(e.target.value) || null)}
                className="w-full text-center px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold"
              />
              <button
                onClick={() => setLinkedinTarget((linkedinTarget || 0) + 5)}
                className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase">By sender account</p>
            {(data?.channels?.linkedin?.senders || []).map((s: any) => (
              <div key={s.name} className="flex items-center justify-between text-xs py-1">
                <span className="truncate text-zinc-700 dark:text-zinc-300">
                  {s.name} · <span className="text-zinc-400">Active</span>
                </span>
                <span className="text-zinc-500 font-medium">
                  {s.today} today · {s.inRange} in range
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outreach Over Time (Chart Section matching Screenshot 10) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChevronDown className="w-4 h-4 text-zinc-400" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Outreach over time
            </h3>
          </div>
          <span className="font-semibold text-zinc-500">
            {data?.chart?.totalSent || 263} sent · {data?.chart?.activeDays || 11} active days
          </span>
        </div>

        {/* Visual Chart & Donut Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Stacked bars simulation / SVG */}
          <div className="md:col-span-2 h-44 flex items-end gap-3 px-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            {[20, 35, 15, 60, 45, 80, 50, 14, 40, 25, 70, 30].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-sm bg-zinc-800 dark:bg-zinc-200 transition-all hover:bg-zinc-600"
                  style={{ height: `${val * 1.5}px` }}
                />
                <span className="text-[9px] text-zinc-400">{idx + 1}</span>
              </div>
            ))}
          </div>

          {/* Donut Legend Breakdown (Matching Screenshot 10) */}
          <div className="space-y-3 pl-4 border-l border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-8 border-zinc-900 dark:border-white border-t-pink-500 border-r-pink-500 flex items-center justify-center font-bold text-xs">
                263
              </div>
              <div className="space-y-1.5 text-xs">
                {(data?.chart?.breakdown || []).map((b: any) => (
                  <div key={b.name} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: b.color }}
                    />
                    <span className="font-semibold">{b.name}</span>
                    <span className="text-zinc-400">
                      {b.count} · {b.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Streaks & Heatmap Grid */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Current Streak</span>
            <p className="text-xl font-bold mt-0.5">{data?.streaks?.currentStreak || 4} days</p>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Best Streak</span>
            <p className="text-xl font-bold mt-0.5">{data?.streaks?.bestStreak || 12} days</p>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Days with Outreach</span>
            <p className="text-xl font-bold mt-0.5">{data?.streaks?.daysWithOutreach || '11 of 30'}</p>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Average per Day</span>
            <p className="text-xl font-bold mt-0.5">{data?.streaks?.averagePerDay || '8.8'}</p>
          </div>
        </div>

        {/* Daily Numbers Table */}
        <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 flex items-center justify-between">
            <span className="font-bold">Daily Numbers</span>
            <button className="flex items-center gap-1 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900">
              <Edit2 className="w-3 h-3" />
              <span>Edit numbers</span>
            </button>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase">
              <tr>
                <th className="p-2.5 pl-4">Date</th>
                <th className="p-2.5">Email</th>
                <th className="p-2.5">Instagram</th>
                <th className="p-2.5">LinkedIn</th>
                <th className="p-2.5 pr-4">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {(data?.dailyData || []).map((row: any) => (
                <tr key={row.date} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="p-2.5 pl-4 font-semibold">{row.date}</td>
                  <td className="p-2.5 text-zinc-500">{row.email}</td>
                  <td className="p-2.5 text-zinc-500">{row.instagram}</td>
                  <td className="p-2.5 text-zinc-500">{row.linkedin}</td>
                  <td className="p-2.5 pr-4 font-bold">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

