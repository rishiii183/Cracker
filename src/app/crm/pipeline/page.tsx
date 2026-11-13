'use client';

import React, { useState, useEffect } from 'react';
import { GitBranch, DollarSign, FileText } from 'lucide-react';

export default function CRMPipelinePage() {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/leads?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data?.leads) setLeads(data.leads);
      });
  }, []);

  const stages = ['New', 'Contacted', 'Following up', 'Replied', 'Resource sent'];

  return (
    <div className="max-w-7xl mx-auto space-y-5 text-xs text-zinc-800 dark:text-zinc-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-purple-500" />
          <span>CRM Pipeline</span>
        </h1>
        <p className="text-zinc-400 mt-0.5">
          Part of the CRM module · Visual deal stages and conversion tracking.
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((st) => {
          const items = leads.filter((l) => l.stage === st);
          return (
            <div
              key={st}
              className="w-72 shrink-0 p-3 rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 space-y-2"
            >
              <div className="flex justify-between items-center px-1 font-bold">
                <span>{st}</span>
                <span className="text-zinc-400">{items.length}</span>
              </div>
              {items.map((l) => (
                <div
                  key={l.id}
                  className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700 shadow-2xs font-semibold"
                >
                  {l.companyName}
                  <span className="block text-[10px] text-zinc-400 font-normal mt-0.5">
                    {l.leadCode} · @{l.channel}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

