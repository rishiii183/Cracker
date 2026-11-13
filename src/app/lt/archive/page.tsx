'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, RotateCcw, HelpCircle } from 'lucide-react';

export default function ArchivePage() {
  const { refreshTrigger, triggerRefresh } = useApp();

  const [search, setSearch] = useState('');
  const [archivedLeads, setArchivedLeads] = useState<any[]>([]);
  const [totalArchived, setTotalArchived] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadArchived = () => {
    setLoading(true);
    const params = new URLSearchParams({
      archived: 'true',
      search,
      page: String(page),
      limit: '50',
    });

    fetch(`/api/leads?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.leads) {
          setArchivedLeads(data.leads);
          setTotalArchived(data.total);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadArchived();
  }, [search, page, refreshTrigger]);

  const handleRestore = async (id: string) => {
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'restore',
        leadIds: [id],
      }),
    });
    triggerRefresh();
    loadArchived();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 text-xs text-zinc-800 dark:text-zinc-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Archive
        </h1>
        <a
          href="/guide#archive"
          className="flex items-center gap-1 text-zinc-400 hover:text-zinc-600 font-semibold text-xs"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>How Archive works</span>
        </a>
      </div>

      {/* Search Input matching Screenshot 13 */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search company or lead code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none"
          />
        </div>
      </div>

      {/* Table matching Screenshot 13 */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            <tr>
              <th className="p-3.5 pl-6 w-8">
                <input type="checkbox" className="rounded border-zinc-300" />
              </th>
              <th className="p-3.5">COMPANY</th>
              <th className="p-3.5">LEAD CODE</th>
              <th className="p-3.5">STAGE</th>
              <th className="p-3.5">COUNTRY</th>
              <th className="p-3.5">DATE ADDED</th>
              <th className="p-3.5">ARCHIVED</th>
              <th className="p-3.5 pr-6 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {loading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-zinc-400">
                  Loading archive...
                </td>
              </tr>
            ) : archivedLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-zinc-400">
                  No archived leads found.
                </td>
              </tr>
            ) : (
              archivedLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="p-3.5 pl-6">
                    <input type="checkbox" className="rounded border-zinc-300" />
                  </td>
                  <td className="p-3.5 font-semibold text-zinc-900 dark:text-zinc-100">
                    {lead.companyName}
                  </td>
                  <td className="p-3.5 font-mono text-zinc-400">{lead.leadCode}</td>
                  <td className="p-3.5 text-zinc-600 dark:text-zinc-300">{lead.stage}</td>
                  <td className="p-3.5 text-zinc-500">{lead.country || '-'}</td>
                  <td className="p-3.5 text-zinc-500">
                    {new Date(lead.dateAdded).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="p-3.5 text-zinc-500">
                    {lead.archivedAt
                      ? new Date(lead.archivedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recently'}
                  </td>
                  <td className="p-3.5 pr-6 text-right">
                    <button
                      onClick={() => handleRestore(lead.id)}
                      className="px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold text-xs text-zinc-700 dark:text-zinc-300"
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span>{totalArchived} total</span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-zinc-50"
            >
              Previous
            </button>
            <span className="px-2 font-semibold text-zinc-800 dark:text-zinc-200">
              Page {page}
            </span>
            <button
              disabled={page * 50 >= totalArchived}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-zinc-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

