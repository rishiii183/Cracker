'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ExternalLink,
  Plus,
  HelpCircle,
  SlidersHorizontal,
  Calendar,
  Tag,
  Check,
  MessageSquare,
  ArrowUpRight,
} from 'lucide-react';

export default function LinkedInLeadsPage() {
  const { setSelectedLeadForSlideOver, refreshTrigger, triggerRefresh, currentUser } = useApp();

  const [url, setUrl] = useState('');
  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [senderAccount, setSenderAccount] = useState('None');
  const [connectionSent, setConnectionSent] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [replied, setReplied] = useState(false);
  const [followUpDays, setFollowUpDays] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dateRange, setDateRange] = useState('This week');
  const [leadMode, setLeadMode] = useState<'worked' | 'added'>('worked');
  const [streamLeads, setStreamLeads] = useState<any[]>([]);

  const loadData = () => {
    fetch('/api/leads?channel=LinkedIn&limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data?.leads) setStreamLeads(data.leads);
      });
  };

  useEffect(() => {
    loadData();
  }, [dateRange, leadMode, refreshTrigger]);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsSubmitting(true);
    const leadName = companyName.trim() || contactName.trim() || url.replace('https://www.linkedin.com/in/', '');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: leadName,
          contactName: contactName.trim() || null,
          website: url.trim(),
          channel: 'LinkedIn',
          senderAccount,
          outreachSent: messageSent || connectionSent,
          nextFollowUpDays: followUpDays,
          addedBy: currentUser.name,
        }),
      });

      if (res.ok) {
        setUrl('');
        setContactName('');
        setCompanyName('');
        setConnectionSent(false);
        setMessageSent(false);
        setReplied(false);
        setFollowUpDays(null);
        triggerRefresh();
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-xs">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          LinkedIn Leads
        </h1>
      </div>

      {/* Rapid Entry Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-4">
        <form onSubmit={handleAddLead} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                LinkedIn Profile URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="https://www.linkedin.com/in/name"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Contact Name (Optional)
              </label>
              <input
                type="text"
                placeholder="Optional"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Company Name (Optional)
              </label>
              <input
                type="text"
                placeholder="Optional"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Sent From Account
              </label>
              <select
                value={senderAccount}
                onChange={(e) => setSenderAccount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              >
                <option value="None">None</option>
                <option value="Sahil saudagar">Sahil saudagar</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <a
                href="/settings#outreach_templates"
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Add outreach templates in Settings
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-medium">Connection Request Sent</span>
                <button
                  type="button"
                  onClick={() => setConnectionSent(!connectionSent)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    connectionSent ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600'
                  }`}
                >
                  {connectionSent ? 'Yes' : 'No'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-medium">Message Sent</span>
                <button
                  type="button"
                  onClick={() => setMessageSent(!messageSent)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    messageSent ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600'
                  }`}
                >
                  {messageSent ? 'Yes' : 'No'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-medium">Replied</span>
                <button
                  type="button"
                  onClick={() => setReplied(!replied)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    replied ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600'
                  }`}
                >
                  {replied ? 'Yes' : 'No'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-medium">Next Follow-up</span>
              {[
                { label: 'None', val: null },
                { label: '+2 Days', val: 2 },
                { label: '+3 Days', val: 3 },
                { label: '+7 Days', val: 7 },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setFollowUpDays(item.val)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    followUpDays === item.val
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 font-semibold'
                      : 'bg-white dark:bg-zinc-800 border-zinc-200 text-zinc-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-400">Press Enter to add</span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800"
            >
              + Add Lead
            </button>
          </div>
        </form>
      </div>

      {/* Stream Table */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            This Week&apos;s Stream ({streamLeads.length})
          </h3>
        </div>

        <table className="w-full text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            <tr>
              <th className="p-3.5 pl-6">LINK LEAD</th>
              <th className="p-3.5">OUTREACH</th>
              <th className="p-3.5 pr-6">FOLLOW-UP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {streamLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                <td className="p-3.5 pl-6">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                    <div>
                      <span
                        onClick={() => setSelectedLeadForSlideOver(lead.id)}
                        className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer"
                      >
                        {lead.companyName}
                      </span>
                      <p className="text-[10px] text-zinc-400">{lead.leadCode}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3.5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] border border-zinc-200 dark:border-zinc-700 text-zinc-500">
                    LinkedIn Message
                  </span>
                </td>
                <td className="p-3.5 pr-6">
                  <span className="text-zinc-400">Nov 16, 2026</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

