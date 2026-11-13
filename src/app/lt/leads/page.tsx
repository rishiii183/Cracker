'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Table as TableIcon,
  Columns as ColumnsIcon,
  LayoutGrid,
  Calendar as CalendarIcon,
  Plus,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Mail,
  Trash2,
  CheckSquare,
  Sparkles,
  ArrowUpDown,
  Tag,
  Check,
} from 'lucide-react';

export default function LeadsPage() {
  const router = useRouter();
  const { setAddLeadModalOpen, setSelectedLeadForSlideOver, refreshTrigger } = useApp();

  const [view, setView] = useState<'Table' | 'Columns' | 'Cards' | 'Calendar'>('Table');
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Filter states matching Screenshot 3
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [channelFilter, setChannelFilter] = useState('All');
  const [senderFilter, setSenderFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [addedByFilter, setAddedByFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');
  const [hasRepliedFilter, setHasRepliedFilter] = useState('All');
  const [emailCheckFilter, setEmailCheckFilter] = useState('All');
  const [loomSentFilter, setLoomSentFilter] = useState('All');
  const [whenField, setWhenField] = useState('Last activity');
  const [whenRange, setWhenRange] = useState('Any time');
  const [sortBy, setSortBy] = useState('Last activity');
  const [sortDirection, setSortDirection] = useState<'Newest first' | 'Oldest first'>('Newest first');

  const [perPage, setPerPage] = useState('50');
  const [groupBy, setGroupBy] = useState('No grouping');
  const [page, setPage] = useState(1);

  const [leads, setLeads] = useState<any[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);

  // Selection state
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [bulkActionStage, setBulkActionStage] = useState('');
  const [bulkActionStatus, setBulkActionStatus] = useState('');

  const loadLeads = () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: perPage,
      search,
      stage: stageFilter,
      country: countryFilter,
      channel: channelFilter,
      sender: senderFilter,
      status: statusFilter,
      addedBy: addedByFilter,
      tag: tagFilter,
      hasReplied: hasRepliedFilter,
      emailCheck: emailCheckFilter,
      loomSent: loomSentFilter,
      sortBy: sortBy === 'Last activity' ? 'lastActivity' : sortBy === 'Company name' ? 'companyName' : 'dateAdded',
      sortDirection: sortDirection === 'Newest first' ? 'desc' : 'asc',
      archived: 'false',
    });

    fetch(`/api/leads?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.leads) {
          setLeads(data.leads);
          setTotalLeads(data.total);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLeads();
  }, [
    page,
    perPage,
    search,
    stageFilter,
    countryFilter,
    channelFilter,
    senderFilter,
    statusFilter,
    addedByFilter,
    tagFilter,
    hasRepliedFilter,
    emailCheckFilter,
    loomSentFilter,
    sortBy,
    sortDirection,
    refreshTrigger,
  ]);

  const clearAllFilters = () => {
    setSearch('');
    setStageFilter('All');
    setCountryFilter('All');
    setChannelFilter('All');
    setSenderFilter('All');
    setStatusFilter('All');
    setAddedByFilter('All');
    setTagFilter('All');
    setHasRepliedFilter('All');
    setEmailCheckFilter('All');
    setLoomSentFilter('All');
    setWhenField('Last activity');
    setWhenRange('Any time');
    setSortBy('Last activity');
    setSortDirection('Newest first');
  };

  const toggleSelectAll = () => {
    if (selectedLeadIds.length === leads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leads.map((l) => l.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkChangeStage = async (newStage: string) => {
    if (!selectedLeadIds.length) return;
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'changeStage',
        leadIds: selectedLeadIds,
        data: { stage: newStage },
      }),
    });
    setSelectedLeadIds([]);
    loadLeads();
  };

  const handleBulkArchive = async () => {
    if (!selectedLeadIds.length) return;
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'archive',
        leadIds: selectedLeadIds,
      }),
    });
    setSelectedLeadIds([]);
    loadLeads();
  };

  const stages = [
    'New',
    'Researching',
    'Email Drafted',
    'Contacted',
    'Following up',
    'Replied',
    'Resource sent',
    'Not Interested',
    'Not in a priority',
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Leads
          </h1>
          {/* View Toggles */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-xs">
            {[
              { id: 'Table', label: 'Table', icon: TableIcon },
              { id: 'Columns', label: 'Columns', icon: ColumnsIcon },
              { id: 'Cards', label: 'Cards', icon: LayoutGrid },
              { id: 'Calendar', label: 'Calendar', icon: CalendarIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    view === tab.id
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setAddLeadModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add lead</span>
          </button>

          <select
            value={perPage}
            onChange={(e) => setPerPage(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none"
          >
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
            <option value="150">150 per page</option>
            <option value="200">200 per page</option>
          </select>

          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none"
          >
            <option value="No grouping">No grouping</option>
            <option value="Stage">Group by Stage</option>
            <option value="Channel">Group by Channel</option>
            <option value="Country">Group by Country</option>
          </select>
        </div>
      </div>

      {/* Expandable Filters Drawer */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
        >
          <div className="flex items-center gap-1.5">
            {filtersOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span>Filters</span>
          </div>
          <span className="text-[11px] font-normal text-zinc-400">
            {totalLeads} leads found
          </span>
        </button>

        {filtersOpen && (
          <div className="p-4 pt-1 border-t border-zinc-100 dark:border-zinc-800 space-y-3 text-xs">
            {/* Filter Row 1 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Company, contact, code"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Stage
                </label>
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800 focus:outline-none"
                >
                  <option value="All">All</option>
                  {stages.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Country
                </label>
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800 focus:outline-none"
                >
                  <option value="All">All</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Channel
                </label>
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800 focus:outline-none"
                >
                  <option value="All">All</option>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Sender Account
                </label>
                <select
                  value={senderFilter}
                  onChange={(e) => setSenderFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800 focus:outline-none"
                >
                  <option value="All">All</option>
                  <option value="Sahilsaudagarr">Sahilsaudagarr</option>
                  <option value="Sahil saudagar">Sahil saudagar</option>
                  <option value="sahil@infosized.co">sahil@infosized.co</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800 focus:outline-none"
                >
                  <option value="All">All</option>
                  <option value="new">new (no reply)</option>
                  <option value="in_progress">in_progress</option>
                  <option value="on_hold">on_hold</option>
                  <option value="won">won</option>
                  <option value="lost">lost</option>
                </select>
              </div>
            </div>

            {/* Filter Row 2 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Added By
                </label>
                <select
                  value={addedByFilter}
                  onChange={(e) => setAddedByFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800 focus:outline-none"
                >
                  <option value="All">All</option>
                  <option value="Varad Nagre">Varad Nagre</option>
                  <option value="Sahil">Sahil</option>
                  <option value="Rishi Ghosh">Rishi Ghosh</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Tag
                </label>
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800 focus:outline-none"
                >
                  <option value="All">All</option>
                  <option value="High buyer intent">High buyer intent</option>
                  <option value="Email risky">Email risky</option>
                  <option value="Case Study">Case Study</option>
                  <option value="IG bubble">IG bubble</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Has Replied
                </label>
                <select
                  value={hasRepliedFilter}
                  onChange={(e) => setHasRepliedFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800 focus:outline-none"
                >
                  <option value="All">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Email Check
                </label>
                <select
                  value={emailCheckFilter}
                  onChange={(e) => setEmailCheckFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800 focus:outline-none"
                >
                  <option value="All">All</option>
                  <option value="At least one verified">At least one verified</option>
                  <option value="All emails verified">All emails verified</option>
                  <option value="None verified yet">None verified yet</option>
                  <option value="No email">No email</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Loom Sent
                </label>
                <select
                  value={loomSentFilter}
                  onChange={(e) => setLoomSentFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800 focus:outline-none"
                >
                  <option value="All">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearAllFilters}
                  className="w-full py-1.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Action Bar (When Rows Selected) */}
      {selectedLeadIds.length > 0 && (
        <div className="p-3 rounded-2xl bg-zinc-900 text-white flex items-center justify-between text-xs shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3">
            <span className="font-bold">{selectedLeadIds.length} leads selected</span>
            <div className="h-4 w-px bg-zinc-700" />
            <select
              onChange={(e) => {
                if (e.target.value) handleBulkChangeStage(e.target.value);
              }}
              defaultValue=""
              className="bg-zinc-800 text-white px-2.5 py-1 rounded-lg border border-zinc-700 focus:outline-none"
            >
              <option value="" disabled>Change stage...</option>
              {stages.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={handleBulkArchive}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium"
            >
              Archive selected
            </button>
          </div>
          <button
            onClick={() => setSelectedLeadIds([])}
            className="text-zinc-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Main Table View */}
      {view === 'Table' && (
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 pl-4 w-8">
                    <input
                      type="checkbox"
                      checked={leads.length > 0 && selectedLeadIds.length === leads.length}
                      onChange={toggleSelectAll}
                      className="rounded border-zinc-300"
                    />
                  </th>
                  <th className="p-3.5">Company</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Emails</th>
                  <th className="p-3.5">Country</th>
                  <th className="p-3.5">Stage</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Channel</th>
                  <th className="p-3.5">Added</th>
                  <th className="p-3.5">Added By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-zinc-400">
                      Loading leads...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-zinc-400">
                      No leads found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const isSelected = selectedLeadIds.includes(lead.id);
                    return (
                      <tr
                        key={lead.id}
                        className={`hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors ${
                          isSelected ? 'bg-zinc-50 dark:bg-zinc-800/60' : ''
                        }`}
                      >
                        <td className="p-3.5 pl-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(lead.id)}
                            className="rounded border-zinc-300"
                          />
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span
                              onClick={() => setSelectedLeadForSlideOver(lead.id)}
                              className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline cursor-pointer"
                            >
                              {lead.companyName}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {lead.leadCode}
                            </span>
                            <button
                              onClick={() => window.open(`/lt/leads/${lead.id}`, '_blank')}
                              className="text-zinc-300 hover:text-zinc-600"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="p-3.5 text-zinc-600 dark:text-zinc-400">
                          {lead.contactName || lead.companyName}
                        </td>
                        <td className="p-3.5 text-zinc-500">
                          {lead.emails && lead.emails.length > 0 ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-semibold border border-emerald-200 dark:border-emerald-800">
                              {lead.emails.length} verified
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="p-3.5 text-zinc-500">{lead.country || '-'}</td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                            • {lead.stage}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 text-zinc-400 text-[11px]">
                            • {lead.status === 'new' ? 'no reply' : lead.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-zinc-600 dark:text-zinc-400">
                          @{lead.channel}
                        </td>
                        <td className="p-3.5 text-zinc-500">
                          {new Date(lead.dateAdded).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="p-3.5 text-zinc-500 truncate max-w-[120px]">
                          {lead.addedBy}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <span>
              Showing {(page - 1) * parseInt(perPage) + 1} to{' '}
              {Math.min(page * parseInt(perPage), totalLeads)} of {totalLeads} leads
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Previous
              </button>
              <span className="px-2 font-semibold text-zinc-800 dark:text-zinc-200">
                Page {page}
              </span>
              <button
                disabled={page * parseInt(perPage) >= totalLeads}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Columns (Kanban) View */}
      {view === 'Columns' && (
        <div className="flex gap-4 overflow-x-auto pb-6">
          {stages.map((st) => {
            const stageLeads = leads.filter((l) => l.stage === st);
            return (
              <div
                key={st}
                className="w-72 shrink-0 bg-zinc-100/60 dark:bg-zinc-900/60 rounded-2xl p-3 border border-zinc-200/60 dark:border-zinc-800 flex flex-col max-h-[75vh]"
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">
                    {st}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shadow-2xs">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {stageLeads.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => setSelectedLeadForSlideOver(l.id)}
                      className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 shadow-2xs hover:shadow-md cursor-pointer transition-all text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {l.companyName}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {l.leadCode}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>@{l.channel}</span>
                        <span>{l.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setAddLeadModalOpen(true)}
                  className="mt-3 w-full py-1.5 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 text-xs font-semibold text-center"
                >
                  + Add lead
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Cards View */}
      {view === 'Cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.map((l) => (
            <div
              key={l.id}
              onClick={() => setSelectedLeadForSlideOver(l.id)}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-md transition-all cursor-pointer text-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {l.companyName}
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono">{l.leadCode}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                  • {l.stage}
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <span>@{l.channel}</span>
                <span>•</span>
                <span>{l.country || 'Global'}</span>
              </div>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Added by {l.addedBy}</span>
                <span>{new Date(l.dateAdded).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calendar View */}
      {view === 'Calendar' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs text-center space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm">November 2026</h3>
            <span className="text-xs text-zinc-400">By last activity</span>
          </div>
          <div className="grid grid-cols-7 gap-2 text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="font-bold text-zinc-400 py-1">
                {d}
              </div>
            ))}
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="h-20 p-1.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 text-left overflow-y-auto"
              >
                <span className="text-[10px] font-semibold text-zinc-500">{i + 1}</span>
                {i === 12 && (
                  <div className="mt-1 p-1 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-[10px] font-semibold truncate">
                    14 leads added
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

