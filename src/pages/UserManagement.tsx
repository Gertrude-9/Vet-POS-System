import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye, 
  EyeOff, 
  Shield, 
  UserCheck, 
  UserX, 
  Settings,
  Save,
  X,
  Filter,
  MoreHorizontal
} from 'lucide-react';

// Sample user data - in real app this would come from API
const initialUsers = [
  { 
    id: 1, 
    username: 'admin001', 
    email: 'admin@vetcare.com', 
    fullName: 'John Administrator', 
    role: 'Admin', 
    status: 'Active', 
    createdAt: '2024-01-15',
    lastLogin: '2024-06-17'
  },
  { 
    id: 2, 
    username: 'cashier001', 
    email: 'sarah@vetcare.com', 
    fullName: 'Sarah Johnson', 
    role: 'Cashier', 
    status: 'Active', 
    createdAt: '2024-02-01',
    lastLogin: '2024-06-16'
  },
  { 
    id: 3, 
    username: 'manager001', 
    email: 'mike@vetcare.com', 
    fullName: 'Mike Wilson', 
    role: 'Manager', 
    status: 'Active', 
    createdAt: '2024-01-20',
    lastLogin: '2024-06-15'
  },
  { 
    id: 4, 
    username: 'inventory001', 
    email: 'lisa@vetcare.com', 
    fullName: 'Lisa Chen', 
    role: 'Inventory Staff', 
    status: 'Inactive', 
    createdAt: '2024-03-10',
    lastLogin: '2024-06-10'
  }
];

// Role definitions with permissions and dashboard routes
const roleDefinitions = {
  'Admin': {
    color: 'bg-red-100 text-red-800',
    permissions: ['All System Access', 'User Management', 'System Settings', 'Reports'],
    dashboard: '/admin-dashboard',
    description: 'Full system access and user management'
  },
  'Manager': {
    color: 'bg-blue-100 text-blue-800',
    permissions: ['Sales Reports', 'Inventory Overview', 'Staff Performance', 'Customer Management'],
    dashboard: '/manager-dashboard',
    description: 'Management oversight and reporting'
  },
  'Cashier': {
    color: 'bg-green-100 text-green-800',
    permissions: ['Point of Sale', 'Transaction Processing', 'Customer Service'],
    dashboard: '/cashier-dashboard',
    description: 'Front desk and sales operations'
  },
  'Inventory Staff': {
    color: 'bg-yellow-100 text-yellow-800',
    permissions: ['Stock Management', 'Purchase Orders', 'Supplier Management'],
    dashboard: '/inventory-dashboard',
    description: 'Inventory and stock management'
  },
  'Veterinarian': {
    color: 'bg-purple-100 text-purple-800',
    permissions: ['Medical Records', 'Prescription Management', 'Patient Care'],
    dashboard: '/vet-dashboard',
    description: 'Medical and prescription services'
  }
};

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    fullName: '',
    role: 'Cashier',
    password: '',
    confirmPassword: '',
    status: 'Active'
  });

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    if (!newUser.username || !newUser.email || !newUser.fullName || !newUser.password) {
      alert('Please fill in all required fields');
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (users.some(user => user.username === newUser.username)) {
      alert('Username already exists');
      return;
    }

    if (users.some(user => user.email === newUser.email)) {
      alert('Email already exists');
      return;
    }

    const user = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...newUser,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };

    setUsers([...users, user]);
    setNewUser({
      username: '',
      email: '',
      fullName: '',
      role: 'Cashier',
      password: '',
      confirmPassword: '',
      status: 'Active'
    });
    setShowAddModal(false);
    alert('User added successfully!');
  };

  const handleEditUser = () => {
    if (!selectedUser.username || !selectedUser.email || !selectedUser.fullName) {
      alert('Please fill in all required fields');
      return;
    }

    setUsers(users.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    ));
    setShowEditModal(false);
    setSelectedUser(null);
    alert('User updated successfully!');
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully!');
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUser({ ...newUser, password, confirmPassword: password });
  };

  const openDashboard = (role) => {
    const dashboard = roleDefinitions[role]?.dashboard;
    if (dashboard) {
      alert(`Redirecting to ${dashboard} (${role} Dashboard)`);
      // In a real app: window.location.href = dashboard;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
           
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New User
          </button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Roles</option>
            {Object.keys(roleDefinitions).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-600">Total Users:</span>
            <span className="font-bold text-blue-600">{filteredUsers.length}</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400">@{user.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleDefinitions[user.role]?.color}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'Active' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {user.status === 'Active' ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                      {user.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openDashboard(user.role)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Open Dashboard"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser({...user});
                          setShowEditModal(true);
                        }}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Definitions */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Shield className="w-6 h-6 mr-2" />
          Role Definitions & Permissions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(roleDefinitions).map(([role, config]) => (
            <div key={role} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
                  {role}
                </span>
                <button
                  onClick={() => openDashboard(role)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Preview Dashboard"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">{config.description}</p>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500">PERMISSIONS:</p>
                {config.permissions.map(permission => (
                  <p key={permission} className="text-xs text-gray-600">• {permission}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add New User</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name*"
                value={newUser.fullName}
                onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              
              <input
                type="text"
                placeholder="Username*"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              
              <input
                type="email"
                placeholder="Email Address*"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(roleDefinitions).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password*"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-20"
                />
                <div className="absolute right-2 top-2 flex space-x-1">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={generatePassword}
                    className="p-1 text-blue-500 hover:text-blue-700 text-xs"
                    title="Generate Password"
                  >
                    Gen
                  </button>
                </div>
              </div>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password*"
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={newUser.status}
                onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center"
              >
                <Save className="w-4 h-4 mr-1" />
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name*"
                value={selectedUser.fullName}
                onChange={(e) => setSelectedUser({...selectedUser, fullName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              
              <input
                type="text"
                placeholder="Username*"
                value={selectedUser.username}
                onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              
              <input
                type="email"
                placeholder="Email Address*"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(roleDefinitions).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>

              <select
                value={selectedUser.status}
                onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center"
              >
                <Save className="w-4 h-4 mr-1" />
                Update User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;