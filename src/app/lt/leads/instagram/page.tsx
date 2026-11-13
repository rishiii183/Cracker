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

export default function InstagramLeadsPage() {
  const { setSelectedLeadForSlideOver, refreshTrigger, triggerRefresh, currentUser } = useApp();

  // Rapid entry form fields
  const [url, setUrl] = useState('');
  const [contactName, setContactName] = useState('');
  const [senderAccount, setSenderAccount] = useState('Sahilsaudagarr');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [outreachSent, setOutreachSent] = useState(false);
  const [outreachReplied, setOutreachReplied] = useState(false);
  const [outreachTemplate, setOutreachTemplate] = useState('No template');
  const [followUpDays, setFollowUpDays] = useState<number | null>(null);
  const [followUpTemplate, setFollowUpTemplate] = useState('Select a follow-up template');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Range & stream data
  const [dateRange, setDateRange] = useState('This week');
  const [leadMode, setLeadMode] = useState<'worked' | 'added'>('worked');
  const [streamLeads, setStreamLeads] = useState<any[]>([]);
  const [rates, setRates] = useState<any>(null);

  const loadData = () => {
    fetch('/api/leads?channel=Instagram&limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data?.leads) setStreamLeads(data.leads);
      });

    fetch(`/api/rates?channel=Instagram&mode=${leadMode}&range=${encodeURIComponent(dateRange)}`)
      .then((res) => res.json())
      .then((data) => setRates(data));
  };

  useEffect(() => {
    loadData();
  }, [dateRange, leadMode, refreshTrigger]);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsSubmitting(true);
    let handle = url.trim();
    if (handle.includes('instagram.com/')) {
      handle = '@' + handle.split('instagram.com/')[1].replace('/', '');
    } else if (!handle.startsWith('@')) {
      handle = '@' + handle;
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: handle,
          contactName: contactName.trim() || handle.replace('@', ''),
          website: url.trim().startsWith('http') ? url.trim() : `https://instagram.com/${handle.replace('@', '')}`,
          channel: 'Instagram',
          senderAccount,
          outreachSent,
          tags,
          nextFollowUpDays: followUpDays,
          addedBy: currentUser.name,
        }),
      });

      if (res.ok) {
        setUrl('');
        setContactName('');
        setTags([]);
        setOutreachSent(false);
        setOutreachReplied(false);
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

  const handleToggleStreamSent = async (lead: any) => {
    const mark = lead.outreachMarks?.find((m: any) => m.type === 'Instagram message');
    const isDone = !!mark?.done;
    await fetch(`/api/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        outreachMark: { type: 'Instagram message', done: !isDone },
      }),
    });
    triggerRefresh();
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-xs">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Instagram Leads
        </h1>
      </div>

      {/* Rapid Entry Form Container */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-4">
        <form onSubmit={handleAddLead} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Instagram URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="https://instagram.com/username or @username"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Username / Contact Name
              </label>
              <input
                type="text"
                placeholder="Filled from the URL if blank"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
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
                <option value="Sahilsaudagarr">Sahilsaudagarr</option>
                <option value="sahilsaudagar">sahilsaudagar</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Outreach Template
              </label>
              <select
                value={outreachTemplate}
                onChange={(e) => setOutreachTemplate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              >
                <option value="No template">No template</option>
                <option value="Direct dm">Direct dm</option>
                <option value="Blown up">Blown up</option>
                <option value="ig long videos">ig long videos</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Follow-up Template
              </label>
              <select
                value={followUpTemplate}
                onChange={(e) => setFollowUpTemplate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              >
                <option value="Select a follow-up template">Select a follow-up template</option>
                <option value="Ig follow ups">Ig follow ups</option>
              </select>
            </div>
          </div>

          {/* Toggles & Next Follow-up Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-medium">Outreach Sent</span>
                <button
                  type="button"
                  onClick={() => setOutreachSent(!outreachSent)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    outreachSent
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {outreachSent ? 'Yes' : 'No'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-medium">Outreach Seen / Replied</span>
                <button
                  type="button"
                  onClick={() => setOutreachReplied(!outreachReplied)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    outreachReplied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {outreachReplied ? 'Yes' : 'No'}
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
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    followUpDays === item.val
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white font-semibold'
                      : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Row */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-400">Press Enter to add</span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-2xs"
            >
              + Add Lead
            </button>
          </div>
        </form>
      </div>

      {/* Date Range Selector & Rates */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 w-fit">
              {['Today', 'This week', 'This month', 'Last 30 days', 'Custom'].map((item) => (
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
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-[11px]">
              <button
                onClick={() => setLeadMode('worked')}
                className={`px-2 py-1 rounded-md font-medium ${
                  leadMode === 'worked'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                    : 'text-zinc-500'
                }`}
              >
                Worked on in range
              </button>
              <button
                onClick={() => setLeadMode('added')}
                className={`px-2 py-1 rounded-md font-medium ${
                  leadMode === 'added'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                    : 'text-zinc-500'
                }`}
              >
                Added in range
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>
          </div>
        </div>

        {/* 9 Instagram Rate Cards (matching Screenshot 5) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {[
            { label: 'INSTAGRAM SENT RATE', rate: '99%', sub: '119/120', progress: 99 },
            { label: 'REPLY RATE', rate: '2%', sub: '2/119', progress: 2 },
            { label: 'POSITIVE REPLY RATE', rate: '0%', sub: '0/2', progress: 0 },
            { label: 'NEGATIVE REPLY RATE', rate: '0%', sub: '0/2', progress: 0 },
            { label: 'LOOM SENT RATE', rate: '0%', sub: '0/119', progress: 0 },
            { label: 'LOOM VIEW RATE', rate: '0%', sub: 'no data yet', progress: 0 },
            { label: 'AVG LOOM WATCH %', rate: '0%', sub: 'no data yet', progress: 0 },
            { label: 'MEETINGS BOOKED RATE', rate: '0%', sub: '0/2', progress: 0 },
            { label: 'CLIENT CLOSE RATE', rate: '0%', sub: 'no data yet', progress: 0 },
          ].map((c) => (
            <div
              key={c.label}
              className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <p className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase truncate">
                  {c.label}
                </p>
                <p className="text-xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
                  {c.rate}
                </p>
                <p className="text-[10px] text-zinc-400 font-medium">{c.sub}</p>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1 mt-3 overflow-hidden">
                <div
                  className="bg-zinc-900 dark:bg-zinc-100 h-1 rounded-full"
                  style={{ width: `${c.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* This Week's Stream Table (Matching Screenshot 5) */}
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
              <th className="p-3.5">OUTREACH (CLICK TO CHANGE)</th>
              <th className="p-3.5">TAGS</th>
              <th className="p-3.5 pr-6">FOLLOW-UP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {streamLeads.map((lead) => {
              const isSent = lead.outreachMarks?.some(
                (m: any) => m.type === 'Instagram message' && m.done
              );
              return (
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
                        <p className="text-[10px] text-zinc-400">
                          {lead.leadCode} · via {lead.senderAccount || 'Sahilsaudagarr'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStreamSent(lead)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                          isSent
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                            : 'border-zinc-200 dark:border-zinc-700 text-zinc-500'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>Sent</span>
                      </button>

                      <span className="px-2.5 py-1 rounded-full text-[11px] border border-zinc-200 dark:border-zinc-700 text-zinc-400">
                        No reply
                      </span>

                      <button
                        onClick={() => setSelectedLeadForSlideOver(lead.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Message</span>
                      </button>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <button
                      onClick={() => setSelectedLeadForSlideOver(lead.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 text-[11px] text-zinc-500 hover:bg-zinc-100"
                    >
                      <Tag className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </td>

                  <td className="p-3.5 pr-6">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedLeadForSlideOver(lead.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-[11px] text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100"
                      >
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        <span>Nov 16, 2026</span>
                      </button>
                      <button
                        onClick={() => window.open(`/lt/leads/${lead.id}`, '_blank')}
                        className="text-zinc-300 hover:text-zinc-600"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

