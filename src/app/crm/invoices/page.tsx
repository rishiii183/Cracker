'use client';

import React from 'react';
import { FileText, Download } from 'lucide-react';

export default function CRMInvoicesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs text-zinc-800 dark:text-zinc-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-500" />
          <span>CRM Invoices</span>
        </h1>
        <p className="text-zinc-400 mt-0.5">
          Part of the CRM module · Track, generate, and issue client invoices.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center shadow-2xs space-y-2">
        <FileText className="w-8 h-8 text-zinc-300 mx-auto" />
        <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-300">No invoices yet</h3>
        <p className="text-zinc-400">
          Invoices generated when leads reach &apos;Client closed&apos; stage will appear here.
        </p>
      </div>
    </div>
  );
}

