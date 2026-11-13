'use client';

import React from 'react';
import { DollarSign } from 'lucide-react';

export default function CRMRevenuePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs text-zinc-800 dark:text-zinc-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-500" />
          <span>CRM Revenue</span>
        </h1>
        <p className="text-zinc-400 mt-0.5">
          Part of the CRM module · Closed client deal values and MRR forecasting.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <p className="text-[10px] font-bold text-zinc-400 uppercase">Closed Deal Value</p>
          <p className="text-3xl font-black mt-2 text-zinc-900 dark:text-zinc-100">$0.00</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <p className="text-[10px] font-bold text-zinc-400 uppercase">Pipeline Value</p>
          <p className="text-3xl font-black mt-2 text-zinc-900 dark:text-zinc-100">$34,500.00</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <p className="text-[10px] font-bold text-zinc-400 uppercase">Avg Deal Size</p>
          <p className="text-3xl font-black mt-2 text-zinc-900 dark:text-zinc-100">$2,500.00</p>
        </div>
      </div>
    </div>
  );
}

