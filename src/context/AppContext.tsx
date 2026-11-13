'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface UserContextType {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  avatarUrl?: string;
}

interface AppContextType {
  workspace: { id: string; name: string };
  setWorkspace: (ws: { id: string; name: string }) => void;
  currentUser: UserContextType;
  setCurrentUser: (user: UserContextType) => void;
  toggleRole: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebar: () => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
  notificationsCount: number;
  setNotificationsCount: (n: number) => void;
  addLeadModalOpen: boolean;
  setAddLeadModalOpen: (v: boolean) => void;
  selectedLeadForSlideOver: string | null;
  setSelectedLeadForSlideOver: (id: string | null) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [workspace, setWorkspace] = useState({
    id: 'ws_sahil',
    name: "Rishi's workspace",
  });

  const [currentUser, setCurrentUser] = useState<UserContextType>({
    id: 'u_rishi',
    name: 'Rishi Ghosh',
    email: 'coderishi183@gmail.com',
    role: 'Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(1);
  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false);
  const [selectedLeadForSlideOver, setSelectedLeadForSlideOver] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (newTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      try {
        localStorage.setItem('tracker_theme', newTheme);
      } catch {
        // ignore
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const toggleRole = useCallback(() => {
    setCurrentUser((prev) => ({
      ...prev,
      role: prev.role === 'Admin' ? 'Member' : 'Admin',
    }));
  }, []);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K, Alt+T, Ctrl+1)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setNotificationsOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault();
        window.location.href = '/lt/dashboard';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize theme from storage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('tracker_theme') as 'light' | 'dark' | null;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
      }
    } catch {
      // ignore
    }
  }, [setTheme]);

  return (
    <AppContext.Provider
      value={{
        workspace,
        setWorkspace,
        currentUser,
        setCurrentUser,
        toggleRole,
        theme,
        setTheme,
        toggleTheme,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        commandPaletteOpen,
        setCommandPaletteOpen,
        notificationsOpen,
        setNotificationsOpen,
        notificationsCount,
        setNotificationsCount,
        addLeadModalOpen,
        setAddLeadModalOpen,
        selectedLeadForSlideOver,
        setSelectedLeadForSlideOver,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

