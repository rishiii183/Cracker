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
  Mail,
  ArrowUpRight,
} from 'lucide-react';

export default function EmailLeadsPage() {
  const { setSelectedLeadForSlideOver, refreshTrigger, triggerRefresh, currentUser } = useApp();

  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [senderAccount, setSenderAccount] = useState('sahil@infosized.co');
  const [emailSent, setEmailSent] = useState(false);
  const [emailReplied, setEmailReplied] = useState(false);
  const [followUpDays, setFollowUpDays] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dateRange, setDateRange] = useState('This week');
  const [leadMode, setLeadMode] = useState<'worked' | 'added'>('worked');
  const [streamLeads, setStreamLeads] = useState<any[]>([]);

  const loadData = () => {
    fetch('/api/leads?channel=Email&limit=50')
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
    if (!contactEmail.trim()) return;

    setIsSubmitting(true);
    const leadName = companyName.trim() || contactName.trim() || contactEmail.split('@')[0];

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: leadName,
          contactName: contactName.trim() || null,
          email: contactEmail.trim(),
          channel: 'Email',
          senderAccount,
          outreachSent: emailSent,
          nextFollowUpDays: followUpDays,
          addedBy: currentUser.name,
        }),
      });

      if (res.ok) {
        setContactEmail('');
        setContactName('');
        setCompanyName('');
        setEmailSent(false);
        setEmailReplied(false);
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
          Email Leads
        </h1>
      </div>

      {/* Rapid Entry Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-4">
        <form onSubmit={handleAddLead} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
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
                Company Website / Name (Optional)
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
                Sender Account
              </label>
              <select
                value={senderAccount}
                onChange={(e) => setSenderAccount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              >
                <option value="None">None</option>
                <option value="sahil@infosized.co">sahil@infosized.co</option>
                <option value="saudagar@infosized.co">saudagar@infosized.co</option>
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
                <span className="text-zinc-500 font-medium">Email Sent</span>
                <button
                  type="button"
                  onClick={() => setEmailSent(!emailSent)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    emailSent ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600'
                  }`}
                >
                  {emailSent ? 'Yes' : 'No'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-medium">Email Replied</span>
                <button
                  type="button"
                  onClick={() => setEmailReplied(!emailReplied)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    emailReplied ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600'
                  }`}
                >
                  {emailReplied ? 'Yes' : 'No'}
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
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
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
                    Email Sent
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

