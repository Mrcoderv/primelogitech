import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  fetchAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  resetAdminUserPassword,
} from '../../services/api';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Plus, Loader as Loader2, Lock, UserCog, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react';

export default function AdminUsers() {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [resetConfirm, setResetConfirm] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
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
    if (isAdmin()) {
      load();
    }
  }, [load, isAdmin]);

  const resetForm = () => {
    setForm({
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      role: 'editor',
      permissions: {},
    });
    setFormErrors({});
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
      confirm_password: '',
      role: user.role,
      permissions: user.permissions || {},
    });
    setFormErrors({});
    setEditing(user.id);
  };

  const validateForm = () => {
    const errors = {};

    if (editing === 'new') {
      if (!form.username || form.username.trim().length < 3) {
        errors.username = 'Username must be at least 3 characters.';
      } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
        errors.username = 'Username can only contain letters, numbers, and underscores.';
      }

      if (!form.password || form.password.length < 8) {
        errors.password = 'Password must be at least 8 characters.';
      } else {
        const hasUpper = /[A-Z]/.test(form.password);
        const hasLower = /[a-z]/.test(form.password);
        const hasDigit = /\d/.test(form.password);
        if (!hasUpper || !hasLower || !hasDigit) {
          errors.password = 'Password must contain uppercase, lowercase, and a number.';
        }
      }

      if (form.password !== form.confirm_password) {
        errors.confirm_password = 'Passwords do not match.';
      }
    }

    if (!form.email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Enter a valid email address.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const payload = {
        email: form.email,
        role: form.role,
        permissions: form.permissions || {},
      };

      if (editing === 'new') {
        await createAdminUser({
          ...payload,
          username: form.username,
          password: form.password,
          confirm_password: form.confirm_password,
        });
        setSuccess(`User '${form.username}' created successfully.`);
      } else {
        await updateAdminUser(editing, payload);
        setSuccess(`User '${form.username}' updated successfully.`);
      }

      setEditing(null);
      resetForm();
      await load();
    } catch (err) {
      const errorData = err?.response?.data;
      if (errorData) {
        if (typeof errorData === 'object') {
          const newErrors = {};
          Object.keys(errorData).forEach(key => {
            if (Array.isArray(errorData[key])) {
              newErrors[key] = errorData[key][0];
            } else if (errorData[key] !== 'Success' && key !== 'success' && key !== 'message') {
              newErrors[key] = errorData[key];
            }
          });
          if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
          } else {
            setError(errorData.detail || errorData.error || 'Failed to save user.');
          }
        } else {
          setError(errorData.detail || errorData.error || 'Failed to save user.');
        }
      } else {
        setError(err?.message || 'Failed to save user.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    try {
      const response = await deleteAdminUser(deleteConfirm.id);
      setDeleteConfirm(null);
      await load();
      setSuccess(response?.message || `User '${deleteConfirm.username}' deleted successfully.`);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to delete user.');
    }
  };

  const handleResetPassword = async () => {
    if (!resetConfirm.newPassword || resetConfirm.newPassword.length < 8) {
      setFormErrors({ password: 'Password must be at least 8 characters.' });
      return;
    }

    const hasUpper = /[A-Z]/.test(resetConfirm.newPassword);
    const hasLower = /[a-z]/.test(resetConfirm.newPassword);
    const hasDigit = /\d/.test(resetConfirm.newPassword);
    if (!hasUpper || !hasLower || !hasDigit) {
      setFormErrors({ password: 'Password must contain uppercase, lowercase, and a number.' });
      return;
    }

    if (resetConfirm.newPassword !== resetConfirm.confirmPassword) {
      setFormErrors({ confirm_password: 'Passwords do not match.' });
      return;
    }

    setSaving(true);
    setError('');
    try {
      const response = await resetAdminUserPassword(resetConfirm.id, resetConfirm.newPassword);
      setResetConfirm(null);
      setFormErrors({});
      setSuccess(response?.message || `Password reset successfully for '${resetConfirm.username}'.`);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to reset password.');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: 'username',
      label: 'Username',
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            user.role === 'admin'
              ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white'
              : user.role === 'editor'
              ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}>
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-white">{user.username}</p>
            {user.created_by && (
              <p className="text-xs text-gray-500">by {user.created_by}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (user) => (
        <span className="text-gray-400 text-sm">{user.email}</span>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (user) => {
        const roleColors = {
          admin: 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30',
          editor: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30',
          viewer: 'bg-gray-700/50 text-gray-400 border border-gray-600/50',
        };
        const roleLabels = {
          admin: 'Admin',
          editor: 'Editor',
          viewer: 'Viewer',
        };
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              roleColors[user.role] || roleColors.viewer
            }`}
          >
            {roleLabels[user.role] || user.role}
          </span>
        );
      },
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (user) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            user.is_active
              ? 'bg-green-500/20 text-green-400 border border-green-500/20'
              : 'bg-gray-700/50 text-gray-400 border border-gray-600/50'
          }`}
        >
          {user.is_active ? (
            <>
              <CheckCircle size={12} />
              Active
            </>
          ) : (
            <>
              <XCircle size={12} />
              Inactive
            </>
          )}
        </span>
      ),
    },
    {
      key: 'last_login',
      label: 'Last Login',
      render: (user) => (
        <span className="text-xs text-gray-500">
          {user.last_login
            ? new Date(user.last_login).toLocaleDateString()
            : 'Never'}
        </span>
      ),
    },
  ];

  if (!isAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400 text-sm">
          You don't have permission to manage admin users.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-cyan-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <UserCog size={24} className="text-cyan-400" />
            Admin Users
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage admin accounts and permissions
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg px-4 py-3 flex items-start gap-3">
          <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {editing && (
        <form
          onSubmit={handleSave}
          className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 space-y-5"
        >
          <h2 className="text-lg font-semibold text-white border-b border-gray-800 pb-3">
            {editing === 'new' ? 'Create New User' : 'Edit User'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username {editing === 'new' && <span className="text-red-400">*</span>}
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                disabled={editing !== 'new'}
                className={`w-full px-3 py-2.5 bg-gray-800/50 border ${
                  formErrors.username ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-gray-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                placeholder="Enter username"
              />
              {formErrors.username && (
                <p className="text-red-400 text-xs mt-1">{formErrors.username}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full px-3 py-2.5 bg-gray-800/50 border ${
                  formErrors.email ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                placeholder="Enter email address"
              />
              {formErrors.email && (
                <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>
          </div>

          {editing === 'new' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`w-full px-3 py-2.5 bg-gray-800/50 border ${
                      formErrors.password ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    placeholder="Min 8 chars, upper, lower, digit"
                  />
                  {formErrors.password && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={form.confirm_password}
                    onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                    className={`w-full px-3 py-2.5 bg-gray-800/50 border ${
                      formErrors.confirm_password ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    placeholder="Confirm password"
                  />
                  {formErrors.confirm_password && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.confirm_password}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters, containing uppercase, lowercase letters and a number.
              </p>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="admin">Admin - Full Access (can manage other admins)</option>
              <option value="editor">Editor - Content Management</option>
              <option value="viewer">Viewer - Read Only</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-medium rounded-lg transition-all shadow-lg shadow-cyan-500/20"
            >
              {saving ? 'Saving...' : editing === 'new' ? 'Create User' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                resetForm();
              }}
              className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl overflow-hidden">
        <DataTable
          columns={columns}
          data={users}
          onEdit={openEdit}
          onDelete={(user) => {
            if (user.id === currentUser?.id) {
              setError("You cannot delete your own account.");
              return;
            }
            setDeleteConfirm(user);
          }}
          loading={loading}
          pageSize={10}
        />
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete '${deleteConfirm?.username}'? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />

      {resetConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Lock size={20} className="text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Reset Password</h3>
                <p className="text-sm text-gray-400">for {resetConfirm.username}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={resetConfirm.newPassword}
                  onChange={(e) =>
                    setResetConfirm({ ...resetConfirm, newPassword: e.target.value })
                  }
                  className={`w-full px-3 py-2.5 bg-gray-800/50 border ${
                    formErrors.password ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="Min 8 chars, upper, lower, digit"
                />
                {formErrors.password && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={resetConfirm.confirmPassword || ''}
                  onChange={(e) =>
                    setResetConfirm({ ...resetConfirm, confirmPassword: e.target.value })
                  }
                  className={`w-full px-3 py-2.5 bg-gray-800/50 border ${
                    formErrors.confirm_password ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="Confirm new password"
                />
                {formErrors.confirm_password && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.confirm_password}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleResetPassword}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-medium rounded-lg transition-all"
              >
                {saving ? 'Resetting...' : 'Reset Password'}
              </button>
              <button
                onClick={() => {
                  setResetConfirm(null);
                  setFormErrors({});
                }}
                className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
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
