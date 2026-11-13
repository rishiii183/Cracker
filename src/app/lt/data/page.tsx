'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ShieldAlert, Upload, Download, FileSpreadsheet, Check } from 'lucide-react';

export default function ImportExportPage() {
  const router = useRouter();
  const { currentUser, triggerRefresh } = useApp();

  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Crucial role-based restriction (Section 15 & 19)
  if (currentUser.role !== 'Admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center shadow-xl space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Access denied
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          You do not have access to this page. Ask an admin to grant it in Settings.
        </p>
        <button
          onClick={() => router.push('/lt/dashboard')}
          className="px-5 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs hover:bg-zinc-800 shadow-xs"
        >
          Back to Tracker
        </button>
      </div>
    );
  }

  const handleImportCSV = async () => {
    if (!importText.trim()) return;
    setImportStatus('Importing...');
    try {
      const lines = importText.trim().split('\n');
      for (const line of lines) {
        const parts = line.split(',');
        if (parts.length > 0 && parts[0].trim()) {
          await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              companyName: parts[0].trim(),
              contactName: parts[1]?.trim() || null,
              email: parts[2]?.trim() || null,
              channel: 'Email',
            }),
          });
        }
      }
      setImportStatus('Successfully imported leads!');
      setImportText('');
      triggerRefresh();
    } catch {
      setImportStatus('Failed to import');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs text-zinc-800 dark:text-zinc-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Import / Export
        </h1>
        <p className="text-zinc-400 mt-1">
          Admin portal for bulk CSV importing, Google Sheet synchronisation, and data exports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CSV Import */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-zinc-500" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Bulk CSV Import
            </h3>
          </div>
          <p className="text-zinc-400 text-[11px]">
            Paste comma-separated rows: <code>company_name, contact_name, email</code>
          </p>
          <textarea
            rows={5}
            placeholder="Acme Corp, Jane Doe, jane@acme.com&#10;Globex, John Smith, john@globex.com"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono text-xs focus:outline-none"
          />
          {importStatus && <p className="font-semibold text-emerald-600">{importStatus}</p>}
          <button
            onClick={handleImportCSV}
            className="w-full py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs hover:bg-zinc-800"
          >
            Import Leads
          </button>
        </div>

        {/* Export Data */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-zinc-500" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Export Database
            </h3>
          </div>
          <p className="text-zinc-400 text-[11px]">
            Download all active leads, follow-up queues, and activity logs in CSV format.
          </p>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                window.open('/api/leads?limit=1000', '_blank');
              }}
              className="w-full py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 font-semibold text-xs hover:bg-zinc-50 text-left px-4 flex items-center justify-between"
            >
              <span>Export All Leads (JSON)</span>
              <Download className="w-3.5 h-3.5 text-zinc-400" />
            </button>
            <button
              onClick={() => {
                window.open('/api/activity', '_blank');
              }}
              className="w-full py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 font-semibold text-xs hover:bg-zinc-50 text-left px-4 flex items-center justify-between"
            >
              <span>Export Activity Log (JSON)</span>
              <Download className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

