'use client';
import { useState } from 'react';

interface Role {
  id: string;
  name: string;
  count: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  currentRole: string;
}

interface ManageRolesWidgetProps {
  theme: 'dark' | 'light';
  handleAction?: (action: string) => void;
  roles?: Role[];
  healthItems?: string[];
  statusClasses?: Record<string, string>;
}

export default function ManageRoles({
  theme,
  handleAction,
  roles: rolesProp,
}: ManageRolesWidgetProps) {
  const [roles, setRoles] = useState<Role[]>(rolesProp ?? [
    { id: '1', name: 'Admins', count: 3 },
    { id: '2', name: 'Auditors', count: 15 },
    { id: '3', name: 'Staff', count: 229 },
    { id: '4', name: 'Viewers', count: 12 },
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', currentRole: '1' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', currentRole: '2' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', currentRole: '3' },
    { id: '4', name: 'Alice Williams', email: 'alice@example.com', currentRole: '3' },
    { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', currentRole: '4' },
  ]);

  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Theme-aware styling
  const themeClasses = {
    container: theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200',
    card: theme === 'dark' 
      ? 'bg-gray-700 hover:bg-gray-600' 
      : 'bg-gray-100 hover:bg-gray-200',
    textPrimary: theme === 'dark' 
      ? 'text-white' 
      : 'text-gray-800',
    textSecondary: theme === 'dark' 
      ? 'text-gray-400' 
      : 'text-gray-600',
    input: theme === 'dark' 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500',
    buttonSecondary: theme === 'dark' 
      ? 'bg-gray-600 hover:bg-gray-500' 
      : 'bg-gray-200 hover:bg-gray-300',
    divider: theme === 'dark'
      ? 'border-gray-700'
      : 'border-gray-200'
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setNewRoleName(role.name);
    setSelectedUsers(users.filter(user => user.currentRole === role.id).map(user => user.id));
    setIsCreating(false);
    setSearchTerm('');
  };

  const handleCreateRole = () => {
    setEditingRole({ id: '', name: '', count: 0 });
    setNewRoleName('New Role');
    setSelectedUsers([]);
    setIsCreating(true);
    setSearchTerm('');
  };

  const handleSaveRole = () => {
    if (!newRoleName.trim()) {
      alert('Please enter a role name');
      return;
    }

    if (isCreating) {
      // Create new role
      const newRole = {
        id: `${Date.now()}`, // Using timestamp for unique ID
        name: newRoleName,
        count: selectedUsers.length
      };
      setRoles([...roles, newRole]);
      
      // Update users with new role
      const updatedUsers = users.map(user => 
        selectedUsers.includes(user.id) ? { ...user, currentRole: newRole.id } : user
      );
      setUsers(updatedUsers);
    } else if (editingRole) {
      // Update existing role
      const updatedRoles = roles.map(role => 
        role.id === editingRole.id ? { ...role, name: newRoleName, count: selectedUsers.length } : role
      );
      setRoles(updatedRoles);
      
      // Update users
      const updatedUsers = users.map(user => 
        selectedUsers.includes(user.id) 
          ? { ...user, currentRole: editingRole.id }
          : user.currentRole === editingRole.id
              ? { ...user, currentRole: '4' } // Default to Viewer if removed
              : user
      );
      setUsers(updatedUsers);
    }

    setEditingRole(null);
    setIsCreating(false);
  };

  const handleDeleteRole = (roleId: string) => {
    if (roleId === '1' || roleId === '4') {
      alert('Cannot delete Admins or Viewers roles');
      return;
    }

    if (confirm('Are you sure you want to delete this role? Users will be moved to Viewers.')) {
      setRoles(roles.filter(role => role.id !== roleId));
      
      // Move users to Viewers role
      const updatedUsers = users.map(user => 
        user.currentRole === roleId ? { ...user, currentRole: '4' } : user
      );
      setUsers(updatedUsers);
      
      // Update counts
      const updatedRoles = roles.map(role => {
        if (role.id === '4') {
          return { ...role, count: updatedUsers.filter(u => u.currentRole === '4').length };
        }
        return role.id === roleId ? role : role;
      }).filter(role => role.id !== roleId);
      
      setRoles(updatedRoles);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  return (
    <div className={`rounded-xl shadow-md p-6 border transition-all hover:-translate-y-1 hover:shadow-lg ${themeClasses.container}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-xl font-semibold flex items-center ${themeClasses.textPrimary}`}>
          <span className="mr-3">👥</span>
          Manage User Roles
        </h3>
        {!editingRole && (
          <button 
            onClick={handleCreateRole}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>+</span>
            <span>Create Role</span>
          </button>
        )}
      </div>

      {editingRole ? (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className={`text-lg font-medium ${themeClasses.textPrimary}`}>
              {isCreating ? 'Create New Role' : 'Edit Role'}
            </h4>
            
            <div className="space-y-2">
              <label className={`block ${themeClasses.textPrimary}`}>Role Name</label>
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter role name"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className={`text-lg font-medium ${themeClasses.textPrimary}`}>Assign Users</h4>
              <div className="relative w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Search users..."
                />
                <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>

            <div className={`border rounded-lg overflow-hidden ${themeClasses.divider}`}>
              <div className="max-h-96 overflow-y-auto">
                {filteredUsers.map(user => {
                  const userRole = roles.find(r => r.id === user.currentRole);
                  return (
                    <div 
                      key={user.id} 
                      className={`p-4 flex items-center justify-between border-b ${themeClasses.divider} ${themeClasses.card} transition-colors`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${themeClasses.textPrimary}`}>{user.name}</p>
                        <div className="flex items-center gap-2">
                          <p className={`text-sm truncate ${themeClasses.textSecondary}`}>{user.email}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}>
                            {userRole?.name || 'None'}
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No users found matching your search
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => {
                setEditingRole(null);
                setIsCreating(false);
              }}
              className={`px-4 py-2 rounded-lg ${themeClasses.buttonSecondary} ${themeClasses.textPrimary} transition-colors`}
            >
              Cancel
            </button>
            {!isCreating && (
              <button
                onClick={() => editingRole && handleDeleteRole(editingRole.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete Role
              </button>
            )}
            <button
              onClick={handleSaveRole}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              {isCreating ? 'Create Role' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className={`grid gap-4 ${roles.length > 2 ? 'md:grid-cols-2' : ''}`}>
            {roles.map((role) => (
              <div
                key={role.id}
                className={`p-5 rounded-lg flex justify-between items-center ${themeClasses.card} transition-colors cursor-pointer`}
                onClick={() => handleEditRole(role)}
              >
                <div>
                  <h4 className={`text-lg font-medium ${themeClasses.textPrimary}`}>{role.name}</h4>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>
                    {role.count} {role.count === 1 ? 'user' : 'users'} assigned
                  </p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditRole(role);
                  }}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <span className="sr-only">Edit</span>
                  ✏️
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-5 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAction?.('reset-password')}
                className="py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>🔄</span>
                <span>Reset Password</span>
              </button>
              <button
                onClick={() => handleAction?.('deactivate-user')}
                className="py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>🚫</span>
                <span>Deactivate User</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}