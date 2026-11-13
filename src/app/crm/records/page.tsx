'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Database, ExternalLink } from 'lucide-react';

export default function CRMRecordsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/leads?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data?.leads) setLeads(data.leads);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-5 text-xs text-zinc-800 dark:text-zinc-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-500" />
            <span>CRM Records</span>
          </h1>
          <p className="text-zinc-400 mt-0.5">
            Part of the CRM module · Synchronized with your active lead database.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            <tr>
              <th className="p-3.5 pl-6">Company</th>
              <th className="p-3.5">Code</th>
              <th className="p-3.5">Stage</th>
              <th className="p-3.5">Channel</th>
              <th className="p-3.5 pr-6">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {leads.map((l) => (
              <tr key={l.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                <td className="p-3.5 pl-6 font-semibold">{l.companyName}</td>
                <td className="p-3.5 font-mono text-zinc-400">{l.leadCode}</td>
                <td className="p-3.5">{l.stage}</td>
                <td className="p-3.5">@{l.channel}</td>
                <td className="p-3.5 pr-6 text-zinc-500">{l.contactName || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

