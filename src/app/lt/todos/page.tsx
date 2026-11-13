'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Search,
  List as ListIcon,
  LayoutGrid,
  Plus,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Edit2,
  Trash2,
  CheckSquare,
  Square,
  Calendar,
  X,
} from 'lucide-react';

export default function TodosPage() {
  const { currentUser, refreshTrigger, triggerRefresh } = useApp();

  const [search, setSearch] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [view, setView] = useState<'List' | 'Board'>('List');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Collapsible sections
  const [overdueOpen, setOverdueOpen] = useState(false);
  const [dueTodayOpen, setDueTodayOpen] = useState(false);
  const [upcomingOpen, setUpcomingOpen] = useState(false);
  const [noDueDateOpen, setNoDueDateOpen] = useState(true);
  const [completedOpen, setCompletedOpen] = useState(false);

  // Add Task Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const loadTodos = () => {
    setLoading(true);
    const params = new URLSearchParams({
      search,
      ownerId: ownerFilter,
    });
    fetch(`/api/todos?${params.toString()}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTodos();
  }, [search, ownerFilter, refreshTrigger]);

  const handleToggleTodo = async (id: string, current: boolean) => {
    await fetch('/api/todos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: !current }),
    });
    triggerRefresh();
    loadTodos();
  };

  const handleDeleteTodo = async (id: string) => {
    if (confirm('Delete this to-do?')) {
      await fetch(`/api/todos?id=${id}`, { method: 'DELETE' });
      triggerRefresh();
      loadTodos();
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle.trim(),
        description: newDesc.trim() || null,
        dueDate: newDueDate || null,
        assigneeId: currentUser.id,
      }),
    });

    setNewTitle('');
    setNewDesc('');
    setNewDueDate('');
    setAddModalOpen(false);
    triggerRefresh();
    loadTodos();
  };

  const renderTodoList = (items: any[]) => {
    if (!items || items.length === 0) {
      return (
        <div className="p-4 text-center text-xs text-zinc-400">
          Nothing here. Clear slate.
        </div>
      );
    }

    return (
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {items.map((todo) => (
          <div
            key={todo.id}
            className="flex items-start justify-between p-4 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors gap-3"
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => handleToggleTodo(todo.id, todo.completed)}
                className="mt-0.5 text-zinc-400 hover:text-zinc-600"
              >
                {todo.completed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-400" />
                )}
              </button>
              <div>
                <p
                  className={`text-xs font-semibold text-zinc-900 dark:text-zinc-100 ${
                    todo.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : ''
                  }`}
                >
                  {todo.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                  {todo.lead && (
                    <span>
                      {todo.lead.companyName}
                    </span>
                  )}
                  {todo.lead && <span>·</span>}
                  <span>{todo.assignee?.name || 'Unassigned'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-zinc-400">
              <button
                onClick={() => alert(`Comments on: ${todo.title}`)}
                className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  const newT = prompt('Edit title:', todo.title);
                  if (newT) {
                    fetch('/api/todos', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: todo.id, title: newT }),
                    }).then(() => loadTodos());
                  }
                }}
                className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-xs text-zinc-800 dark:text-zinc-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          To-dos
        </h1>
      </div>

      {/* Header Bar matching Screenshot 9 */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search to-dos or companies"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs focus:outline-none"
            />
          </div>

          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-semibold focus:outline-none"
          >
            <option value="all">All owners</option>
            <option value="u_sahil">Sahil</option>
            <option value="u_rishi">Rishi Ghosh</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <button
              onClick={() => setView('List')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold ${
                view === 'List'
                  ? 'bg-white dark:bg-zinc-700 shadow-2xs text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setView('Board')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold ${
                view === 'Board'
                  ? 'bg-white dark:bg-zinc-700 shadow-2xs text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs hover:bg-zinc-800"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add task</span>
          </button>
        </div>
      </div>

      {/* List View with Collapsible Sections */}
      {view === 'List' && (
        <div className="space-y-3">
          {/* Overdue */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
            <button
              onClick={() => setOverdueOpen(!overdueOpen)}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-zinc-50"
            >
              <div className="flex items-center gap-2">
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    overdueOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
                <span className="font-bold">Overdue</span>
              </div>
              <span className="text-zinc-400 font-semibold">{data?.counts?.overdue || 0}</span>
            </button>
            {overdueOpen && renderTodoList(data?.overdue)}
          </div>

          {/* Due Today */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
            <button
              onClick={() => setDueTodayOpen(!dueTodayOpen)}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-zinc-50"
            >
              <div className="flex items-center gap-2">
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    dueTodayOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
                <span className="font-bold">Due today</span>
              </div>
              <span className="text-zinc-400 font-semibold">{data?.counts?.dueToday || 0}</span>
            </button>
            {dueTodayOpen && renderTodoList(data?.dueToday)}
          </div>

          {/* Upcoming */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
            <button
              onClick={() => setUpcomingOpen(!upcomingOpen)}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-zinc-50"
            >
              <div className="flex items-center gap-2">
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    upcomingOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
                <span className="font-bold">Upcoming</span>
              </div>
              <span className="text-zinc-400 font-semibold">{data?.counts?.upcoming || 0}</span>
            </button>
            {upcomingOpen && renderTodoList(data?.upcoming)}
          </div>

          {/* No due date (Expanded by default matching Screenshot 9!) */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
            <button
              onClick={() => setNoDueDateOpen(!noDueDateOpen)}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-zinc-50"
            >
              <div className="flex items-center gap-2">
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    noDueDateOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
                <span className="font-bold">No due date</span>
              </div>
              <span className="text-zinc-400 font-semibold">{data?.counts?.noDueDate || 6}</span>
            </button>
            {noDueDateOpen && renderTodoList(data?.noDueDate)}
          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
            <button
              onClick={() => setCompletedOpen(!completedOpen)}
              className="w-full flex items-center justify-between p-3.5 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-zinc-50"
            >
              <div className="flex items-center gap-2">
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    completedOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
                <span className="font-bold">Completed</span>
              </div>
              <span className="text-zinc-400 font-semibold">{data?.counts?.completed || 0}</span>
            </button>
            {completedOpen && renderTodoList(data?.completed)}
          </div>
        </div>
      )}

      {/* Board View */}
      {view === 'Board' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Overdue', items: data?.overdue || [] },
            { label: 'Due today', items: data?.dueToday || [] },
            { label: 'Upcoming', items: data?.upcoming || [] },
            { label: 'No due date', items: data?.noDueDate || [] },
          ].map((col) => (
            <div
              key={col.label}
              className="p-4 rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 space-y-3"
            >
              <div className="flex items-center justify-between font-bold">
                <span>{col.label}</span>
                <span className="text-xs text-zinc-400">{col.items.length}</span>
              </div>
              <div className="space-y-2">
                {col.items.map((t: any) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-2xs space-y-1.5"
                  >
                    <p className="font-semibold text-xs">{t.title}</p>
                    <p className="text-[10px] text-zinc-400">{t.lead?.companyName || 'Lead'}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
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
              <h3 className="font-bold text-sm">Add New Task</h3>
              <button onClick={() => setAddModalOpen(false)}>
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Buy domain for Gabriel"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Add details, links, or context"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
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
                  Add task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

