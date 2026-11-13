'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  ChevronLeft,
  ExternalLink,
  Trash2,
  Share2,
  Check,
  CheckCircle2,
  Circle,
  Copy,
  Plus,
  Mail,
  UserPlus,
  SlidersHorizontal,
  Download,
  Calendar,
  Clock,
  Send,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Tag as TagIcon,
  X,
} from 'lucide-react';

function LeadDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { triggerRefresh, currentUser } = useApp();

  const [lead, setLead] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'Cards' | 'Tabs'>('Cards');
  const [activeTab, setActiveTab] = useState('Company');
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [hideEmpty, setHideEmpty] = useState(true);
  const [oneColumn, setOneColumn] = useState(false);

  // Editable fields
  const [leadName, setLeadName] = useState('');
  const [stage, setStage] = useState('Contacted');
  const [status, setStatus] = useState('new');
  const [priority, setPriority] = useState('Medium');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [revenue, setRevenue] = useState('');
  const [foundedYear, setFoundedYear] = useState('');

  // People & Email states
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRole, setNewPersonRole] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Research & notes
  const [researchText, setResearchText] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // To-do state
  const [todoTitle, setTodoTitle] = useState('');

  // Tags state
  const [tagInput, setTagInput] = useState('');

  // Personalized message
  const [messageType, setMessageType] = useState('Instagram DM');
  const [angle, setAngle] = useState('Compliment recent video hook');
  const [subjectLine, setSubjectLine] = useState('');
  const [messageBody, setMessageBody] = useState(
    'Hey {first_name}, loved your recent reel! Quick question: are you taking on new clients this month?'
  );

  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const loadLead = () => {
    setLoading(true);
    fetch(`/api/leads/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setLead(data);
        setLeadName(data.companyName || '');
        setStage(data.stage || 'Contacted');
        setStatus(data.status || 'new');
        setPriority(data.priority || 'Medium');
        setWebsite(data.website || '');
        setCountry(data.country || '');
        setLocation(data.location || '');
        setIndustry(data.industry || '');
        setEmployeeCount(data.employeeCount || '');
        setRevenue(data.revenue || '');
        setFoundedYear(data.foundedYear || '');

        const rNote = (data.notes || []).find((n: any) => n.type === 'Research');
        if (rNote) setResearchText(rNote.text);
        const aNote = (data.notes || []).find((n: any) => n.type === 'Additional');
        if (aNote) setAdditionalNotes(aNote.text);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLead();
  }, [id]);

  const updateLeadField = async (fields: any) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        const updated = await res.json();
        setLead(updated);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMark = async (type: string, done: boolean) => {
    await updateLeadField({
      outreachMark: { type, done: !done },
      authorName: currentUser.name,
    });
  };

  const handleSaveNotes = async (type: 'Research' | 'Additional', text: string) => {
    await updateLeadField({
      note: { type, text, author: currentUser.name },
    });
  };

  const handleAddTodo = async () => {
    if (!todoTitle.trim()) return;
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: todoTitle.trim(),
        leadId: id,
        workspaceId: lead?.workspaceId,
        createdBy: currentUser.id,
      }),
    });
    setTodoTitle('');
    loadLead();
    triggerRefresh();
  };

  const handleAddTag = async (tagToAdd: string) => {
    if (!tagToAdd.trim()) return;
    await updateLeadField({ addTag: tagToAdd.trim() });
    setTagInput('');
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    await updateLeadField({ removeTag: tagToRemove });
  };

  const handleArchive = async () => {
    if (confirm('Archive this lead?')) {
      await updateLeadField({ archived: true });
      router.push('/lt/leads');
    }
  };

  const handleExportCSV = () => {
    if (!lead) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      `Code,Company,Stage,Status,Priority,Channel,AddedDate\n` +
      `"${lead.leadCode}","${lead.companyName}","${lead.stage}","${lead.status}","${lead.priority}","${lead.channel}","${lead.dateAdded}"`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${lead.leadCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const stagesList = [
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

  const all12Marks = [
    'Connection request',
    'LinkedIn message',
    'LinkedIn reply',
    'Instagram message',
    'Instagram reply',
    'Email sent',
    'Email viewed',
    'Email reply',
    'Loom sent',
    'Loom watched',
    'Meeting booked',
    'Client closed',
  ];

  if (loading || !lead) {
    return <div className="p-8 text-center text-xs text-zinc-400">Loading lead details...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-xs text-zinc-800 dark:text-zinc-200">
      {/* Top Navigation & Breadcrumb link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/lt/leads')}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Leads</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              alert('Pushed to CRM module (Records / Pipeline)');
            }}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50"
          >
            Push to CRM
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleArchive}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header Info & Comboboxes */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              onBlur={() => updateLeadField({ companyName: leadName })}
              className="text-xl font-bold bg-transparent border-b border-dashed border-zinc-300 dark:border-zinc-700 focus:border-solid focus:border-zinc-900 dark:focus:border-white focus:outline-none"
            />
            <span className="font-mono text-xs text-zinc-400 font-semibold">
              {lead.leadCode}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={stage}
              onChange={(e) => {
                setStage(e.target.value);
                updateLeadField({ stage: e.target.value });
              }}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-semibold"
            >
              {stagesList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                updateLeadField({ status: e.target.value });
              }}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-semibold"
            >
              <option value="new">new (no reply)</option>
              <option value="in_progress">in_progress</option>
              <option value="on_hold">on_hold</option>
              <option value="won">won</option>
              <option value="lost">lost</option>
            </select>

            <select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                updateLeadField({ priority: e.target.value });
              }}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-semibold"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>
        </div>

        {/* View toggles & meta info */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
          <div className="flex items-center gap-4">
            <span>Created: {new Date(lead.dateAdded).toLocaleString()}</span>
            <span>Last activity: {new Date(lead.lastActivity).toLocaleString()}</span>
            <button
              onClick={() => updateLeadField({ checked: !lead.checked })}
              className={`flex items-center gap-1 font-semibold ${
                lead.checked ? 'text-emerald-600' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{lead.checked ? 'Checked' : 'Mark checked'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'Cards' ? 'Tabs' : 'Cards')}
              className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-semibold text-zinc-700 dark:text-zinc-300"
            >
              {viewMode === 'Cards' ? 'Switch to Tabs view' : 'Switch to Cards view'}
            </button>
          </div>
        </div>
      </div>

      {/* Sections Layout */}
      <div className={`grid ${oneColumn ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-5`}>
        {/* Section 1: Company */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">1. Company Info</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-400 font-bold block mb-1">Website</label>
              <input
                type="text"
                placeholder="https://..."
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                onBlur={() => updateLeadField({ website })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 font-bold block mb-1">Country</label>
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                onBlur={() => updateLeadField({ country })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
            </div>
          </div>
        </div>

        {/* Section 2: People */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">2. People</h3>
          <div className="space-y-2">
            {(lead.people || []).map((p: any) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50"
              >
                <div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{p.name}</span>
                  <span className="text-zinc-400 block text-[11px]">{p.titleRole || 'Member'}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-bold">
                  Verified
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: To-dos */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            4. To-dos ({lead.todos?.length || 0})
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a to-do..."
              value={todoTitle}
              onChange={(e) => setTodoTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTodo();
              }}
              className="flex-1 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
            <button
              onClick={handleAddTodo}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold"
            >
              Add
            </button>
          </div>
          <div className="space-y-1">
            {(lead.todos || []).map((t: any) => (
              <div key={t.id} className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-xs">
                {t.title}
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Research & Notes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            5. Research & Notes
          </h3>
          <textarea
            rows={3}
            placeholder="Research observations..."
            value={researchText}
            onChange={(e) => setResearchText(e.target.value)}
            onBlur={() => handleSaveNotes('Research', researchText)}
            className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none"
          />
        </div>

        {/* Section 8: Outreach (12 Marks) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-3 md:col-span-2">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            8. Outreach Milestones (12 Steps)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {all12Marks.map((type) => {
              const mark = (lead.outreachMarks || []).find((m: any) => m.type === type);
              const isDone = !!mark?.done;
              return (
                <button
                  key={type}
                  onClick={() => handleToggleMark(type, isDone)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-colors ${
                    isDone
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-semibold'
                      : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  )}
                  <span className="truncate text-[11px]">{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 10: Tags */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">10. Tags</h3>
          <div className="flex flex-wrap gap-1.5">
            {(lead.tags || []).map((t: any) => (
              <span
                key={t.tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
              >
                {t.tag}
                <button onClick={() => handleRemoveTag(t.tag)} className="hover:text-red-500">
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTag(tagInput);
              }}
              className="flex-1 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
            <button
              onClick={() => handleAddTag(tagInput)}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold"
            >
              Add
            </button>
          </div>
        </div>

        {/* Section 12: Personalized Message */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              12. Reach out · Personalized message
            </h3>
            <div className="flex items-center gap-1.5">
              {['Instagram DM', 'LinkedIn DM', 'Email Draft', 'Text Message'].map((t) => (
                <button
                  key={t}
                  onClick={() => setMessageType(t)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                    messageType === t
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={4}
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-mono"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-400">
              {messageBody.length} chars · {messageBody.split(' ').length} words
            </span>
            <button
              onClick={() => copyToClipboard(messageBody, 'Message copied')}
              className="px-4 py-1.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs"
            >
              {copyFeedback || 'Copy Message'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeadDetailPage(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading lead details...</div>}>
      <LeadDetailContent {...props} />
    </Suspense>
  );
}
