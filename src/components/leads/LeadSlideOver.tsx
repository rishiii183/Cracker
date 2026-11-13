'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  X,
  ExternalLink,
  Mail,
  Copy,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  MessageSquare,
  FileText,
  CheckSquare,
  Plus,
  Send,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export default function LeadSlideOver() {
  const router = useRouter();
  const { selectedLeadForSlideOver, setSelectedLeadForSlideOver, triggerRefresh } = useApp();

  const [lead, setLead] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [todoInput, setTodoInput] = useState('');
  const [emailPopover, setEmailPopover] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedLeadForSlideOver) {
      setLead(null);
      return;
    }

    setLoading(true);
    fetch(`/api/leads/${selectedLeadForSlideOver}`)
      .then((res) => res.json())
      .then((data) => {
        setLead(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedLeadForSlideOver]);

  if (!selectedLeadForSlideOver) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleToggleMark = async (markType: string, currentDone: boolean) => {
    if (!lead) return;
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outreachMark: { type: markType, done: !currentDone },
        }),
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

  const handleAddTodo = async () => {
    if (!todoInput.trim() || !lead) return;
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: todoInput.trim(),
          leadId: lead.id,
          workspaceId: lead.workspaceId,
        }),
      });
      if (res.ok) {
        setTodoInput('');
        const refresh = await fetch(`/api/leads/${lead.id}`).then((r) => r.json());
        setLead(refresh);
        triggerRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-150"
      onClick={() => setSelectedLeadForSlideOver(null)}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl h-screen flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-semibold text-xs text-zinc-500 dark:text-zinc-400">
              {lead?.leadCode || 'LEAD'}
            </span>
            {lead && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300">
                • {lead.stage}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {lead && (
              <button
                onClick={() => {
                  setSelectedLeadForSlideOver(null);
                  router.push(`/lt/leads/${lead.id}`);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open full page</span>
              </button>
            )}
            <button
              onClick={() => setSelectedLeadForSlideOver(null)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {loading || !lead ? (
          <div className="flex-1 flex items-center justify-center p-8 text-zinc-400 text-xs">
            Loading lead details...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-zinc-800 dark:text-zinc-200">
            {/* Title & Core Meta */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    {lead.companyName}
                  </h1>
                  <p className="text-zinc-400 mt-0.5 text-xs">
                    {lead.contactName ? `${lead.contactName} · ` : ''}
                    {lead.country || 'Global'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {lead.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                    {lead.priority} Priority
                  </span>
                </div>
              </div>
            </div>

            {/* Definition List */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 text-xs">
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-semibold">
                  Channel
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {lead.channel}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-semibold">
                  Sent From
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {lead.senderAccount || 'Default'} · Active
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-semibold">
                  Date Added
                </span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {new Date(lead.dateAdded).toLocaleDateString()} by {lead.addedBy}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-semibold">
                  Last Contacted
                </span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {lead.lastContacted
                    ? new Date(lead.lastContacted).toLocaleDateString()
                    : 'Not yet'}
                </span>
              </div>
            </div>

            {/* How to Reach */}
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">How to Reach</h3>
              <div className="space-y-1.5">
                {lead.emails && lead.emails.length > 0 ? (
                  lead.emails.map((e: any) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="font-medium">{e.email}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          {e.verificationStatus}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(e.email, 'Email copied')}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-400 italic">No email address recorded.</p>
                )}
              </div>
            </div>

            {/* Outreach So Far (12 Checkbox Chips) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                  Outreach So Far{' '}
                  <span className="text-xs font-normal text-zinc-400">
                    ({(lead.outreachMarks || []).filter((m: any) => m.done).length}/12)
                  </span>
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {all12Marks.map((type) => {
                  const mark = (lead.outreachMarks || []).find((m: any) => m.type === type);
                  const isDone = !!mark?.done;
                  return (
                    <button
                      key={type}
                      onClick={() => handleToggleMark(type, isDone)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-colors ${
                        isDone
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                          : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400 dark:text-emerald-600" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                      )}
                      <span className="truncate text-[11px] font-medium">{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">Research & Notes</h3>
              <div className="space-y-2">
                {lead.notes && lead.notes.length > 0 ? (
                  lead.notes.map((n: any) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-xs"
                    >
                      <span className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">
                        {n.type} Note
                      </span>
                      <p>{n.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-400 italic">No notes added yet.</p>
                )}
              </div>
            </div>

            {/* Quick To-dos */}
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                To-dos ({lead.todos?.length || 0})
              </h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add a to-do for this lead..."
                  value={todoInput}
                  onChange={(e) => setTodoInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddTodo();
                  }}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs focus:outline-none"
                />
                <button
                  onClick={handleAddTodo}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs"
                >
                  Add
                </button>
              </div>
              <div className="space-y-1">
                {(lead.todos || []).map((t: any) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-xs"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="truncate">{t.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {lead && (
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
            <span className="text-xs text-zinc-400">Press ESC to close</span>
            <div className="flex gap-2">
              <button
                onClick={() => window.open(`/lt/leads/${lead.id}`, '_blank')}
                className="px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                New tab
              </button>
              <button
                onClick={() => {
                  setSelectedLeadForSlideOver(null);
                  router.push(`/lt/leads/${lead.id}`);
                }}
                className="px-4 py-1.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100"
              >
                Edit full lead
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

