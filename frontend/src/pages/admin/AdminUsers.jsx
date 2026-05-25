import { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  resetAdminUserPassword,
} from '../../services/api';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Plus, Loader2, Lock } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [resetConfirm, setResetConfirm] = useState(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'editor',
    permissions: {},
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminUsers();
      setUsers(data);
    } catch {
      setError('Failed to load admin users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm({
      username: '',
      email: '',
      password: '',
      role: 'editor',
      permissions: {},
    });
  };

  const openNew = () => {
    resetForm();
    setEditing('new');
  };

  const openEdit = (user) => {
    setForm({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      permissions: user.permissions || {},
    });
    setEditing(user.id);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        email: form.email,
        role: form.role,
        permissions: form.permissions,
      };

      if (editing === 'new') {
        if (!form.username || !form.password) {
          setError('Username and password required for new users.');
          setSaving(false);
          return;
        }
        await createAdminUser({
          ...payload,
          username: form.username,
          password: form.password,
        });
      } else {
        await updateAdminUser(editing, payload);
      }

      setEditing(null);
      await load();
    } catch {
      setError('Failed to save user.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAdminUser(deleteConfirm.id);
      setDeleteConfirm(null);
      await load();
    } catch {
      setError('Failed to delete user.');
    }
  };

  const handleResetPassword = async () => {
    if (!resetConfirm.newPassword) {
      setError('Password cannot be empty.');
      return;
    }

    try {
      await resetAdminUserPassword(resetConfirm.id, resetConfirm.newPassword);
      setResetConfirm(null);
      await load();
      setError('');
      alert('Password reset successfully.');
    } catch {
      setError('Failed to reset password.');
    }
  };

  const columns = [
    {
      key: 'username',
      label: 'Username',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (user) => {
        const roleColors = {
          admin: 'bg-red-500/20 text-red-400',
          editor: 'bg-cyan-500/20 text-cyan-400',
          viewer: 'bg-gray-500/20 text-gray-400',
        };
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              roleColors[user.role] || roleColors.viewer
            }`}
          >
            {user.role}
          </span>
        );
      },
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (user) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            user.is_active
              ? 'bg-green-500/20 text-green-400'
              : 'bg-gray-500/20 text-gray-400'
          }`}
        >
          {user.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-cyan-400" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Users</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      {editing && (
        <form
          onSubmit={handleSave}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                disabled={editing !== 'new'}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 disabled:opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100"
                required
              />
            </div>
          </div>

          {editing === 'new' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password (min 8 characters)
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100"
            >
              <option value="admin">Admin - Full Access</option>
              <option value="editor">Editor - Content Management</option>
              <option value="viewer">Viewer - Read Only</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save User'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={users}
        onEdit={openEdit}
        onDelete={(user) => setDeleteConfirm(user)}
        loading={loading}
        pageSize={10}
      />

      {/* Custom actions */}
      <div className="mt-4 space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
          >
            <div>
              <p className="font-medium">{user.username}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
            <button
              onClick={() =>
                setResetConfirm({
                  id: user.id,
                  username: user.username,
                  newPassword: '',
                })
              }
              className="flex items-center gap-1 px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded text-sm hover:bg-yellow-600/30 transition-colors"
            >
              <Lock size={14} /> Reset Password
            </button>
          </div>
        ))}
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteConfirm?.username}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />

      {/* Reset password dialog */}
      {resetConfirm && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-sm w-full border border-gray-700 p-6 space-y-4">
            <h3 className="text-lg font-semibold">Reset Password for {resetConfirm.username}</h3>
            <input
              type="password"
              placeholder="New Password (min 8 characters)"
              value={resetConfirm.newPassword}
              onChange={(e) =>
                setResetConfirm({ ...resetConfirm, newPassword: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
            />
            <div className="flex gap-2">
              <button
                onClick={handleResetPassword}
                className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setResetConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
