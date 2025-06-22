import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye, 
  EyeOff, 
  Shield, 
  UserCheck, 
  UserX, 
  Save,
  X,
  Filter,
  Users,
  Settings
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;

  email: string;
  name: string;
  role:'admin'|'cashier'|'inventory';
  status: 'Active' | 'Inactive';
  createdAt: string;
  lastLogin?: string;
}

const roleDefinitions = {
  'Admin': {
    color: 'bg-red-100 text-red-800',
    permissions: ['All System Access', 'User Management', 'System Settings', 'Reports'],
    dashboard: '/admin-dashboard',
    description: 'Full system access and user management'
  },
  'Cashier': {
    color: 'bg-green-100 text-green-800',
    permissions: ['Point of Sale', 'Transaction Processing', 'Customer Service'],
    dashboard: '/cashier-dashboard',
    description: 'Front desk and sales operations'
  },
  'Inventory': {
    color: 'bg-yellow-100 text-yellow-800',
    permissions: ['Stock Management', 'Purchase Orders', 'Supplier Management'],
    dashboard: '/inventory-dashboard',
    description: 'Inventory and stock management'
  },
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'All' | User['role']>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | User['status']>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [newUser, setNewUser] = useState<{
    email: string;
    name: string;
    role: User['role'];
    password: string;
    confirmPassword: string;
    status: User['status'];
  }>({
    email: '',
    name: '',
    role: 'cashier',
    password: '',
    confirmPassword: '',
    status: 'Active'
  });

  const navigate = useNavigate();

  // API base URL - make sure this matches your backend
  const API_BASE_URL = 'http://192.168.170.110:5000/api';

  const openDashboard = (role: User['role']) => {
    const dashboardPath = roleDefinitions[role]?.dashboard;
    if (dashboardPath) {
      navigate(dashboardPath);
    } else {
      toast.error('Dashboard not defined for this role');
    }
  };

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };



  // Fetch users from backend
  
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/getUsers`, {
        headers: getAuthHeaders()
      });
      setUsers(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      toast.error(errorMessage);
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

   const handleView = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle adding a new user
  const handleAddUser = async () => {
  // Validation
  if (!newUser.email || !newUser.name || !newUser.password) {
    toast.error('Please fill in all required fields');
    return;
  }

  if (newUser.password !== newUser.confirmPassword) {
    toast.error('Passwords do not match');
    return;
  }

  if (newUser.password.length < 6) {
    toast.error('Password must be at least 6 characters long');
    return;
  }

  // Validate role
  const validRoles = ['admin', 'cashier', 'inventory'];
  if (!validRoles.includes(newUser.role.toLowerCase())) {
    toast.error('Invalid role specified');
    return;
  }

  try {
    setIsLoading(true);
    const userData = {
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      password: newUser.password,
      status: newUser.status
    };
    const response = await axios.post(
      `${API_BASE_URL}/users`,
      JSON.stringify(userData), // Explicit stringification
      {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders() // Ensure this includes Authorization if needed
        },
        transformRequest: [(data) => data] // Prevent Axios from double-processing
      }
    );

    toast.success(response.data.message || 'User added successfully!');
    setShowAddModal(false);
    setNewUser({
      email: '',
      name: '',
      role: 'cashier',
      password: '',
      confirmPassword: '',
      status: 'Active'
    });
    fetchUsers(); // Refresh the user list
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message 
                         || error.response?.data?.error 
                         || 'Failed to add user';
      toast.error(errorMessage);
      
      // Log detailed error for debugging
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
    } else {
      toast.error('An unexpected error occurred');
      console.error('Non-Axios error:', error);
    }
  } finally {
    setIsLoading(false);
  }
};
  // Handle editing a user
  const handleEditUser = async () => {
    if (!selectedUser?.email || !selectedUser.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await axios.put(
        `${API_BASE_URL}/users/${selectedUser._id}`,
        {
        
          email: selectedUser.email,
          fullName: selectedUser.name,
          role: selectedUser.role,
          status: selectedUser.status
        },
        {
          headers: getAuthHeaders()
        }
      );

      toast.success('User updated successfully!');
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh the user list
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update user';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: getAuthHeaders()
      });

      toast.success('User deleted successfully!');
      fetchUsers(); // Refresh the user list
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle user status
  const toggleUserStatus = async (userId: string, currentStatus: User['status']) => {
    try {
      setIsLoading(true);
      await axios.patch(
        `${API_BASE_URL}/users/${userId}/status`,
        { status: currentStatus === 'Active' ? 'Inactive' : 'Active' },
        {
          headers: getAuthHeaders()
        }
      );

      toast.success(`User status updated to ${currentStatus === 'Active' ? 'Inactive' : 'Active'}`);
      fetchUsers(); // Refresh the user list
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update user status';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
             
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg flex items-center font-semibold transition-colors"
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
            onChange={(e) => setFilterRole(e.target.value as 'All' | User['role'])}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Roles</option>
            {Object.keys(roleDefinitions).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'All' | User['status'])}
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

      {/* Loading Indicator */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </div>
      )}

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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {isLoading ? 'Loading users...' : 'No users found'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleDefinitions[user.role]?.color}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleUserStatus(user._id, user.status)}
                        disabled={isLoading}
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                          user.status === 'Active' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } disabled:opacity-50`}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastLogin || '')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openDashboard(user.role)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Open Dashboard"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser({...user});
                            setShowEditModal(true);
                          }}
                          disabled={isLoading}
                          className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 transition-colors"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                placeholder="Email Address*"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
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
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password*"
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={newUser.status}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value as 'Active' | 'Inactive' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg flex items-center transition-colors"
              >
                <Save className="w-4 h-4 mr-1" />
                {isLoading ? 'Saving...' : 'Save'}
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
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
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
                onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value as User['role']})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(roleDefinitions).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>

              <select
                value={selectedUser.status}
                onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value as 'Active' | 'Inactive'})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg flex items-center transition-colors"
              >
                <Save className="w-4 h-4 mr-1" />
                {isLoading ? 'Updating...' : 'Update User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;