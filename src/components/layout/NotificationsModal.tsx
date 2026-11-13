'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Bell, CheckSquare, MessageSquare, Clock, X, Check } from 'lucide-react';

export default function NotificationsModal() {
  const router = useRouter();
  const { notificationsOpen, setNotificationsOpen, notificationsCount, setNotificationsCount } =
    useApp();

  if (!notificationsOpen) return null;

  const notifications = [
    {
      id: 'notif_1',
      type: 'assignment',
      title: 'New to-do assigned to you',
      description: 'Sahil assigned "her 2 email is not verified cause limits exhausted"',
      time: '10m ago',
      unread: true,
      link: '/lt/todos',
    },
    {
      id: 'notif_2',
      type: 'mention',
      title: 'Mentioned in to-do comment',
      description: '@Rishi please check the bounce rate on Michael Janda\'s domain',
      time: '1h ago',
      unread: false,
      link: '/lt/todos',
    },
    {
      id: 'notif_3',
      type: 'followup',
      title: 'Overdue follow-ups pending',
      description: '88 follow-ups require your attention in the Instagram queue.',
      time: '3h ago',
      unread: false,
      link: '/lt/followups',
    },
  ];

  const handleMarkAllRead = () => {
    setNotificationsCount(0);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-start justify-end p-6 z-50"
      onClick={() => setNotificationsOpen(false)}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-4 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Notifications
            </h3>
            {notificationsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                {notificationsCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {notificationsCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={() => setNotificationsOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-96 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                setNotificationsOpen(false);
                router.push(n.link);
              }}
              className={`p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors ${
                n.unread ? 'bg-zinc-50/60 dark:bg-zinc-800/20' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0 text-zinc-600 dark:text-zinc-300">
                  {n.type === 'assignment' ? (
                    <CheckSquare className="w-3.5 h-3.5" />
                  ) : n.type === 'mention' ? (
                    <MessageSquare className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {n.title}
                    </p>
                    <span className="text-[10px] text-zinc-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                    {n.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

