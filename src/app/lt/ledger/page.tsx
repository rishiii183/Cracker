'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';

export default function LedgerPage() {
  const { setSelectedLeadForSlideOver, refreshTrigger, triggerRefresh } = useApp();

  const [granularity, setGranularity] = useState('Day');
  const [channel, setChannel] = useState('All channels');
  const [date, setDate] = useState('2026-11-13');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadLedger = () => {
    setLoading(true);
    const params = new URLSearchParams({
      granularity,
      channel,
      date,
    });
    fetch(`/api/ledger?${params.toString()}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLedger();
  }, [granularity, channel, date, refreshTrigger]);

  const handleExportCSV = () => {
    if (!data?.entries) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      `Date,Lead,Event,Details,User\n` +
      data.entries
        .map(
          (e: any) =>
            `"${e.createdAt}","${e.lead?.companyName || ''}","${e.type}","${e.details || ''}","${e.authorName}"`
        )
        .join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `ledger_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteEntry = async (id: string) => {
    if (confirm('Delete this ledger entry?')) {
      await fetch(`/api/activity?id=${id}`, { method: 'DELETE' });
      triggerRefresh();
      loadLedger();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 text-xs text-zinc-800 dark:text-zinc-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Ledger
        </h1>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold hover:bg-zinc-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Granularity & Date Navigator matching Screenshot 12 */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-800">
            {['Day', 'Week', 'Month', 'Year'].map((g) => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                className={`px-3 py-1 rounded-lg font-semibold ${
                  granularity === g
                    ? 'bg-white dark:bg-zinc-700 shadow-2xs text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const prev = new Date(new Date(date).getTime() - 24 * 60 * 60 * 1000);
                setDate(prev.toISOString().split('T')[0]);
              }}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 font-semibold bg-zinc-50 dark:bg-zinc-800">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>{date}</span>
            </div>
            <button
              onClick={() => {
                const next = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000);
                setDate(next.toISOString().split('T')[0]);
              }}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDate('2026-11-13')}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 font-semibold hover:bg-zinc-100"
            >
              Today
            </button>
          </div>
        </div>

        <span className="font-semibold text-zinc-500">Fri, Nov 13, 2026</span>
      </div>

      {/* Channel Filters & Customize */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {['All channels', 'Email', 'Instagram', 'LinkedIn'].map((ch) => (
            <button
              key={ch}
              onClick={() => setChannel(ch)}
              className={`px-3 py-1.5 rounded-lg font-semibold ${
                channel === ch
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Customize 4 hidden</span>
        </button>
      </div>

      {/* 8 KPI Cards (Matching Screenshot 12) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {[
          { label: 'LEADS ADDED', ...data?.kpis?.leadsAdded, isRed: true },
          { label: 'OUTREACH SENT', ...data?.kpis?.outreachSent, isRed: true },
          { label: 'EMAILS SENT', ...data?.kpis?.emailsSent },
          { label: 'INSTAGRAM DMS SENT', ...data?.kpis?.instagramDMs, isRed: true },
          { label: 'LINKEDIN MESSAGES SENT', ...data?.kpis?.linkedinMessages },
          { label: 'REPLIES', ...data?.kpis?.replies },
          { label: 'MEETINGS BOOKED', ...data?.kpis?.meetingsBooked },
          { label: 'CLIENTS CLOSED', ...data?.kpis?.clientsClosed },
        ].map((card, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs"
          >
            <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase truncate">
              {card.label}
            </p>
            <p
              className={`text-2xl font-black mt-1 ${
                card.isRed ? 'text-red-500 dark:text-red-400' : 'text-zinc-900 dark:text-zinc-100'
              }`}
            >
              {card.value ?? 0}
            </p>
            <p className="text-[10px] text-zinc-400 mt-1">{card.deltaText || '0 (0%) vs prev'}</p>
          </div>
        ))}
      </div>

      {/* Ledger Table (Derived directly from Activity!) */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            <tr>
              <th className="p-3.5 pl-6">DATE</th>
              <th className="p-3.5">LEAD</th>
              <th className="p-3.5">EVENT</th>
              <th className="p-3.5">DETAILS</th>
              <th className="p-3.5">USER</th>
              <th className="p-3.5 pr-6 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {(data?.entries || []).map((entry: any) => (
              <tr key={entry.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                <td className="p-3.5 pl-6 text-zinc-500">
                  {new Date(entry.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                  ,{' '}
                  {new Date(entry.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="p-3.5 font-semibold text-zinc-900 dark:text-zinc-100">
                  {entry.lead?.companyName || '@lead'}
                </td>
                <td className="p-3.5 text-zinc-600 dark:text-zinc-300">{entry.type}</td>
                <td className="p-3.5 text-zinc-400">{entry.details || '-'}</td>
                <td className="p-3.5 text-zinc-600 dark:text-zinc-400">{entry.authorName}</td>
                <td className="p-3.5 pr-6">
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

