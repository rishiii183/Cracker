'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  MessageSquare,
  Mail,
  UserPlus,
  Clock,
  Send,
  HelpCircle,
  X,
} from 'lucide-react';

export default function ActivityPage() {
  const { setSelectedLeadForSlideOver, refreshTrigger, triggerRefresh, currentUser } = useApp();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [author, setAuthor] = useState('Done by anyone');
  const [dateRange, setDateRange] = useState('Last 30 days');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Add activity modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [actType, setActType] = useState('Instagram message sent');
  const [whatHappened, setWhatHappened] = useState('');
  const [details, setDetails] = useState('');

  const loadActivities = () => {
    setLoading(true);
    const params = new URLSearchParams({
      category,
      author,
      search,
      dateRange,
    });
    fetch(`/api/activity?${params.toString()}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadActivities();
  }, [category, author, search, dateRange, refreshTrigger]);

  const handleDeleteActivity = async (id: string) => {
    if (confirm('Delete this activity entry? Ledger and Tracker counts will update.')) {
      await fetch(`/api/activity?id=${id}`, { method: 'DELETE' });
      triggerRefresh();
      loadActivities();
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatHappened.trim()) return;

    await fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: actType,
        whatHappened: whatHappened.trim(),
        details: details.trim() || null,
        authorName: currentUser.name,
      }),
    });

    setWhatHappened('');
    setDetails('');
    setAddModalOpen(false);
    triggerRefresh();
    loadActivities();
  };

  const categories = [
    { id: 'All', label: 'All', count: data?.counts?.all || 1000 },
    { id: 'Outreach', label: 'Outreach', count: data?.counts?.outreach || 254 },
    { id: 'Replies', label: 'Replies', count: data?.counts?.replies || 5 },
    { id: 'Stage & status', label: 'Stage & status', count: data?.counts?.stageStatus || 366 },
    { id: 'Notes & calls', label: 'Notes & calls', count: data?.counts?.notesCalls || 43 },
    { id: 'Other', label: 'Other', count: data?.counts?.other || 332 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-5 text-xs text-zinc-800 dark:text-zinc-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Activity
        </h1>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs hover:bg-zinc-800 shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add activity</span>
        </button>
      </div>

      {/* Filter Row matching Screenshot 11 */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-semibold focus:outline-none"
          >
            <option value="Last 30 days">Last 30 days</option>
            <option value="Today">Today</option>
            <option value="This week">This week</option>
          </select>

          <select
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-semibold focus:outline-none"
          >
            <option value="Done by anyone">Done by anyone</option>
            <option value="Varad Nagre">Varad Nagre</option>
            <option value="Sahil">Sahil</option>
            <option value="Rishi Ghosh">Rishi Ghosh</option>
          </select>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search lead, entry or person"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                category === cat.id
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-2xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              {cat.label} {cat.count}
            </button>
          ))}
        </div>

        <p className="text-[11px] text-zinc-400 pt-1">
          Outreach and reply entries here are what the Ledger and Outreach Tracker count. Fix or delete wrong ones and the numbers update.
        </p>
      </div>

      {/* Activity Log Grouped by Day */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            Today - {data?.entries?.length || 28}
          </h3>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {(data?.entries || []).map((entry: any) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center shrink-0">
                  {entry.type.includes('created') ? (
                    <Plus className="w-3.5 h-3.5" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </div>
                <div>
                  <span
                    onClick={() => {
                      if (entry.leadId) setSelectedLeadForSlideOver(entry.leadId);
                    }}
                    className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer"
                  >
                    {entry.text}
                  </span>
                  <p className="text-[10px] text-zinc-400">
                    {new Date(entry.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    · {entry.authorName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-zinc-400">
                <button
                  onClick={() => {
                    const newT = prompt('Edit activity:', entry.text);
                    if (newT) {
                      fetch('/api/activity', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: entry.id, text: newT }),
                      }).then(() => loadActivities());
                    }
                  }}
                  className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteActivity(entry.id)}
                  className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Activity Modal */}
      {addModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          onClick={() => setAddModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-sm">Add Activity Event</h3>
              <button onClick={() => setAddModalOpen(false)}>
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                  Type
                </label>
                <select
                  value={actType}
                  onChange={(e) => setActType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none"
                >
                  <option value="Instagram message sent">Instagram message sent</option>
                  <option value="Email sent">Email sent</option>
                  <option value="LinkedIn message sent">LinkedIn message sent</option>
                  <option value="Follow up sent">Follow up sent</option>
                  <option value="Loom sent">Loom sent</option>
                  <option value="Email replied">Email replied</option>
                  <option value="Meeting booked">Meeting booked</option>
                  <option value="Client closed">Client closed</option>
                  <option value="Note">Note</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                  What happened? *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sent personalized video proposal"
                  value={whatHappened}
                  onChange={(e) => setWhatHappened(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

