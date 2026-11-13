'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  Building2,
  Users,
  Layers,
  Sliders,
  Database,
  Plus,
  Trash2,
  RefreshCw,
  Download,
  Check,
  AlertTriangle,
  UserPlus,
  Sparkles,
  Search,
  ArrowRight,
  Key,
  Copy,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface AdminStats {
  totalLeads: number;
  totalActivities: number;
  leadsByStage: { stage: string; count: number }[];
  leadsByChannel: { channel: string; count: number }[];
}

export default function AdminPage() {
  const router = useRouter();
  const { workspace, setWorkspace, currentUser, toggleRole, triggerRefresh } = useApp();

  const [activeTab, setActiveTab] = useState<'workspace' | 'users' | 'leads' | 'pipeline' | 'system'>('workspace');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Data states
  const [adminData, setAdminData] = useState<any>(null);
  const [workspaceNameInput, setWorkspaceNameInput] = useState('');
  const [newWsName, setNewWsName] = useState('');

  // User form states
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Admin' | 'Member'>('Member');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Lead controls
  const [leadSearch, setLeadSearch] = useState('');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [bulkStage, setBulkStage] = useState('');

  // Pipeline stage form
  const [newStageName, setNewStageName] = useState('');
  const [newStageColor, setNewStageColor] = useState('#6366f1');

  // Danger confirmation
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin?workspaceId=${workspace.id}`);
      if (res.ok) {
        const data = await res.json();
        setAdminData(data);
        setWorkspaceNameInput(data.activeWorkspace?.name || workspace.name);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [workspace.id]);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // 1. Rename Workspace
  const handleUpdateWorkspaceName = async () => {
    if (!workspaceNameInput.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateWorkspaceName',
          workspaceId: workspace.id,
          name: workspaceNameInput.trim(),
        }),
      });
      if (res.ok) {
        setWorkspace({ ...workspace, name: workspaceNameInput.trim() });
        showToast('Workspace renamed successfully!');
        fetchAdminData();
        triggerRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // 2. Create Workspace
  const handleCreateWorkspace = async () => {
    if (!newWsName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createWorkspace',
          name: newWsName.trim(),
          ownerId: currentUser.id,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setNewWsName('');
        showToast(`Workspace "${data.workspace.name}" created!`);
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // 3. Update User Role
  const handleUpdateUserRole = async (userId: string, newRole: 'Admin' | 'Member') => {
    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateUserRole',
          workspaceId: workspace.id,
          userId,
          role: newRole,
        }),
      });
      if (res.ok) {
        showToast(`Role updated to ${newRole}`);
        fetchAdminData();
        triggerRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 4. Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createUser',
          workspaceId: workspace.id,
          name: newUserName.trim(),
          email: newUserEmail.trim(),
          role: newUserRole,
        }),
      });
      if (res.ok) {
        setNewUserName('');
        setNewUserEmail('');
        setShowAddUserModal(false);
        showToast('User added to team!');
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 5. Remove User
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove ${userName} from this workspace?`)) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteUser',
          workspaceId: workspace.id,
          userId,
        }),
      });
      if (res.ok) {
        showToast(`${userName} removed from workspace.`);
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 6. Bulk Update Leads Stage
  const handleBulkStageChange = async () => {
    if (!bulkStage || selectedLeadIds.length === 0) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulkUpdateLeads',
          workspaceId: workspace.id,
          leadIds: selectedLeadIds,
          updates: { stage: bulkStage },
        }),
      });
      if (res.ok) {
        showToast(`Moved ${selectedLeadIds.length} leads to "${bulkStage}"`);
        setSelectedLeadIds([]);
        fetchAdminData();
        triggerRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 7. Bulk Delete Leads
  const handleBulkDeleteLeads = async () => {
    if (selectedLeadIds.length === 0) return;
    if (!confirm(`Permanently delete ${selectedLeadIds.length} selected leads?`)) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulkDeleteLeads',
          workspaceId: workspace.id,
          leadIds: selectedLeadIds,
        }),
      });
      if (res.ok) {
        showToast(`Deleted ${selectedLeadIds.length} leads`);
        setSelectedLeadIds([]);
        fetchAdminData();
        triggerRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 8. Add Stage
  const handleAddStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createStage',
          workspaceId: workspace.id,
          name: newStageName.trim(),
          color: newStageColor,
        }),
      });
      if (res.ok) {
        setNewStageName('');
        showToast('Pipeline stage created!');
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 9. Toggle Channel
  const handleToggleChannel = async (channelName: string, currentEnabled: boolean) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggleChannel',
          workspaceId: workspace.id,
          channelName,
          enabled: !currentEnabled,
        }),
      });
      if (res.ok) {
        showToast(`Channel ${channelName} toggled.`);
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 10. Clear All Sample Data
  const handleWipeData = async () => {
    if (deleteConfirmText !== 'DELETE') {
      alert('Please type DELETE in capitals to confirm.');
      return;
    }
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'clearSampleData',
          confirmationText: 'DELETE',
          workspaceId: workspace.id,
        }),
      });
      if (res.ok) {
        setDeleteConfirmText('');
        showToast('Workspace data cleared.');
        fetchAdminData();
        triggerRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 11. Export Workspace JSON Backup
  const handleExportBackup = () => {
    if (!adminData) return;
    const blob = new Blob([JSON.stringify(adminData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cracker-backup-${workspace.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Workspace backup exported!');
  };

  const filteredLeads = (adminData?.recentLeads || []).filter((l: any) =>
    l.companyName.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.leadCode.toLowerCase().includes(leadSearch.toLowerCase()) ||
    (l.contactName && l.contactName.toLowerCase().includes(leadSearch.toLowerCase()))
  );

  return (
    <div className="min-h-full pb-16 bg-zinc-50/50 dark:bg-zinc-950">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {feedback}
        </div>
      )}

      {/* Top Banner Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Cracker Admin Control Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Master Admin Mode
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Complete administrative authority over workspaces, team permissions, pipeline stages, and system controls.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportBackup}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export Backup
            </button>

            <button
              onClick={() => router.push('/lt/dashboard')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-sm"
            >
              <span>Back to App</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mt-6 max-w-7xl mx-auto border-b border-zinc-200 dark:border-zinc-800 -mb-6">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'workspace'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Workspace & Branding
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'users'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Team & Permissions
            {adminData?.users && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono">
                {adminData.users.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'leads'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Leads Master Controls
            {adminData?.stats && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono">
                {adminData.stats.totalLeads}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'pipeline'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Pipeline & Channels
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'system'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Database className="w-4 h-4" />
            Database & Danger Zone
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-8 pt-8">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-xs text-zinc-400 gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
            Loading admin controls...
          </div>
        ) : (
          <>
            {/* TAB 1: WORKSPACE & BRANDING */}
            {activeTab === 'workspace' && (
              <div className="space-y-6">
                {/* Active Workspace Settings */}
                <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Active Workspace Configuration
                      </h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Configure the branding name and identity for this workspace.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                      ID: {workspace.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Workspace Name
                      </label>
                      <input
                        type="text"
                        value={workspaceNameInput}
                        onChange={(e) => setWorkspaceNameInput(e.target.value)}
                        placeholder="e.g. Rishi's workspace"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={handleUpdateWorkspaceName}
                        disabled={saving}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Save Workspace Name
                      </button>
                    </div>
                  </div>
                </div>

                {/* All Workspaces List */}
                <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        All Workspaces in System
                      </h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Switch between workspaces or spin up a new team workspace.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {(adminData?.workspaces || []).map((ws: any) => {
                      const isActive = ws.id === workspace.id;
                      return (
                        <div
                          key={ws.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isActive
                              ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500/20'
                              : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 hover:border-zinc-300 dark:hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-400 text-white font-bold text-xs flex items-center justify-center">
                                {ws.name.charAt(0)}
                              </div>
                              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                {ws.name}
                              </span>
                            </div>
                            {isActive && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                                Active
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-[11px] text-zinc-500 dark:text-zinc-400 my-3">
                            <span>Leads: {ws._count?.leads || 0}</span>
                            <span>Members: {ws._count?.members || 0}</span>
                          </div>

                          {!isActive && (
                            <button
                              onClick={() => {
                                setWorkspace({ id: ws.id, name: ws.name });
                                showToast(`Switched to "${ws.name}"`);
                              }}
                              className="w-full py-1.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                              Switch to this workspace
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Create Workspace Row */}
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                    <input
                      type="text"
                      value={newWsName}
                      onChange={(e) => setNewWsName(e.target.value)}
                      placeholder="New workspace name (e.g. Cracker Client Ops)"
                      className="max-w-sm px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={handleCreateWorkspace}
                      className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create Workspace
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TEAM & PERMISSIONS */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Team Members & Role Access Control
                      </h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Promote team members to Admin, assign workspace permissions, or onboard new teammates.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAddUserModal(true)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Add Team Member
                    </button>
                  </div>

                  {/* Users Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-semibold">
                          <th className="py-2.5 px-3">Member</th>
                          <th className="py-2.5 px-3">Email</th>
                          <th className="py-2.5 px-3">Role</th>
                          <th className="py-2.5 px-3">Assigned Todos</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {(adminData?.users || []).map((u: any) => {
                          const isCurrentUser = u.id === currentUser.id;
                          return (
                            <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2.5">
                                  {u.avatarUrl ? (
                                    <img
                                      src={u.avatarUrl}
                                      alt={u.name}
                                      className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
                                    />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-zinc-700 text-white font-bold flex items-center justify-center text-xs">
                                      {u.name.charAt(0)}
                                    </div>
                                  )}
                                  <div>
                                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                                      {u.name}
                                    </span>
                                    {isCurrentUser && (
                                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                                        (You)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400 font-mono">
                                {u.email}
                              </td>

                              <td className="py-3 px-3">
                                <select
                                  value={u.role}
                                  onChange={(e) =>
                                    handleUpdateUserRole(u.id, e.target.value as 'Admin' | 'Member')
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none transition-colors ${
                                    u.role === 'Admin'
                                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                                      : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                                  }`}
                                >
                                  <option value="Admin">Admin</option>
                                  <option value="Member">Member</option>
                                </select>
                              </td>

                              <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400">
                                {u._count?.todosAssigned || 0} tasks
                              </td>

                              <td className="py-3 px-3 text-right">
                                {!isCurrentUser && (
                                  <button
                                    onClick={() => handleDeleteUser(u.id, u.name)}
                                    title="Remove user"
                                    className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-400 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add User Modal */}
                {showAddUserModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                        Add New Team Member
                      </h3>
                      <p className="text-xs text-zinc-500 mb-4">
                        Add a user to Rishi's workspace with instant role permissions.
                      </p>

                      <form onSubmit={handleCreateUser} className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            required
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            placeholder="e.g. Alex Johnson"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            required
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            placeholder="alex@example.com"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                            Role Permission
                          </label>
                          <select
                            value={newUserRole}
                            onChange={(e) => setNewUserRole(e.target.value as 'Admin' | 'Member')}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                          >
                            <option value="Member">Member (Outreach & Leads)</option>
                            <option value="Admin">Admin (Full Control)</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3">
                          <button
                            type="button"
                            onClick={() => setShowAddUserModal(false)}
                            className="px-3.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold"
                          >
                            Save Member
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: LEADS MASTER CONTROLS */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Master Lead Operations
                      </h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Bulk reassign, advance stages, or manage leads across all channels.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
                        <input
                          type="text"
                          value={leadSearch}
                          onChange={(e) => setLeadSearch(e.target.value)}
                          placeholder="Search leads..."
                          className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bulk Operations Toolbar */}
                  {selectedLeadIds.length > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4 text-xs">
                      <span className="font-semibold text-amber-700 dark:text-amber-300">
                        {selectedLeadIds.length} leads selected
                      </span>

                      <div className="flex items-center gap-2">
                        <select
                          value={bulkStage}
                          onChange={(e) => setBulkStage(e.target.value)}
                          className="px-2.5 py-1 text-xs rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none"
                        >
                          <option value="">Move to Stage...</option>
                          <option value="New">New</option>
                          <option value="Researching">Researching</option>
                          <option value="Email Drafted">Email Drafted</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Following up">Following up</option>
                          <option value="Replied">Replied</option>
                          <option value="Resource sent">Resource sent</option>
                          <option value="Not Interested">Not Interested</option>
                        </select>

                        <button
                          onClick={handleBulkStageChange}
                          disabled={!bulkStage}
                          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold transition-colors"
                        >
                          Apply Stage
                        </button>

                        <button
                          onClick={handleBulkDeleteLeads}
                          className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Selected
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Leads Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-semibold">
                          <th className="py-2.5 px-3 w-8">
                            <input
                              type="checkbox"
                              checked={
                                filteredLeads.length > 0 &&
                                selectedLeadIds.length === filteredLeads.length
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLeadIds(filteredLeads.map((l: any) => l.id));
                                } else {
                                  setSelectedLeadIds([]);
                                }
                              }}
                              className="rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
                            />
                          </th>
                          <th className="py-2.5 px-3">Lead Code</th>
                          <th className="py-2.5 px-3">Company</th>
                          <th className="py-2.5 px-3">Channel</th>
                          <th className="py-2.5 px-3">Stage</th>
                          <th className="py-2.5 px-3">Priority</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {filteredLeads.map((lead: any) => {
                          const isSelected = selectedLeadIds.includes(lead.id);
                          return (
                            <tr
                              key={lead.id}
                              className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors ${
                                isSelected ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                              }`}
                            >
                              <td className="py-2.5 px-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedLeadIds([...selectedLeadIds, lead.id]);
                                    } else {
                                      setSelectedLeadIds(
                                        selectedLeadIds.filter((id) => id !== lead.id)
                                      );
                                    }
                                  }}
                                  className="rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
                                />
                              </td>
                              <td className="py-2.5 px-3 font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                                {lead.leadCode}
                              </td>
                              <td className="py-2.5 px-3 font-medium text-zinc-900 dark:text-zinc-100">
                                {lead.companyName}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                  {lead.channel}
                                </span>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                  {lead.stage}
                                </span>
                              </td>
                              <td className="py-2.5 px-3">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    lead.priority === 'High'
                                      ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                                      : lead.priority === 'Medium'
                                      ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                  }`}
                                >
                                  {lead.priority}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PIPELINE & CHANNELS */}
            {activeTab === 'pipeline' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pipeline Stages */}
                <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                  <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    Pipeline Stages
                  </h2>
                  <p className="text-xs text-zinc-500 mb-4">
                    Active stages used in the Lead Tracker funnel.
                  </p>

                  <div className="space-y-2 mb-6">
                    {(adminData?.stages || []).map((stage: any) => (
                      <div
                        key={stage.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: stage.color || '#6366f1' }}
                          />
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {stage.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">Order: {stage.order}</span>
                      </div>
                    ))}
                  </div>

                  {/* Add Stage Form */}
                  <form onSubmit={handleAddStage} className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={newStageName}
                      onChange={(e) => setNewStageName(e.target.value)}
                      placeholder="New stage name"
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                    <input
                      type="color"
                      value={newStageColor}
                      onChange={(e) => setNewStageColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-200 dark:border-zinc-700 bg-transparent"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold"
                    >
                      Add
                    </button>
                  </form>
                </div>

                {/* Outreach Channels */}
                <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                  <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    Channel Integrations
                  </h2>
                  <p className="text-xs text-zinc-500 mb-4">
                    Enable or disable outreach channels across the app.
                  </p>

                  <div className="space-y-3">
                    {['Instagram', 'LinkedIn', 'Email'].map((channelName) => {
                      const cfg = (adminData?.channels || []).find((c: any) => c.name === channelName);
                      const isEnabled = cfg ? cfg.enabled : true;
                      return (
                        <div
                          key={channelName}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50"
                        >
                          <div>
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                              {channelName}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              {isEnabled ? 'Active in navigation and filter views' : 'Disabled'}
                            </span>
                          </div>

                          <button
                            onClick={() => handleToggleChannel(channelName, isEnabled)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                              isEnabled
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                            }`}
                          >
                            {isEnabled ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: DATABASE & DANGER ZONE */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                {/* System Health Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                      Total Leads in Database
                    </span>
                    <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                      {adminData?.stats?.totalLeads || 0}
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                      Total Activity Logs
                    </span>
                    <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                      {adminData?.stats?.totalActivities || 0}
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                      Database Provider
                    </span>
                    <span className="text-2xl font-extrabold text-emerald-500">
                      SQLite (Local)
                    </span>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="p-6 rounded-2xl border border-red-200 dark:border-red-950 bg-red-50/20 dark:bg-red-950/10 shadow-xs">
                  <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Danger Zone & Data Wipe
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">
                    Deleting workspace sample data removes all mock leads, follow-ups, and notes. This action is irreversible.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type DELETE to confirm"
                      className="px-3.5 py-2 text-xs rounded-xl border border-red-200 dark:border-red-900 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500 max-w-xs"
                    />

                    <button
                      onClick={handleWipeData}
                      disabled={deleteConfirmText !== 'DELETE'}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      Clear All Workspace Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

