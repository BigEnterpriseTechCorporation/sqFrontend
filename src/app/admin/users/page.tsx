"use client"

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '@/constants';
import { useRouter } from 'next/navigation';
import { format, parseISO, isValid } from 'date-fns';

// User type definition
interface User {
  id: string;
  userName: string;
  fullName: string;
  role: string;
  registeredAt?: string;
  createdAt?: string;
  solvedExercisesCount?: number;
  totalAttemptsCount?: number;
  isActive?: boolean;
}

export default function UsersAdmin() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  
  // Sorting
  const [sortField, setSortField] = useState<'fullName' | 'userName' | 'role' | 'registeredAt' | 'solvedExercisesCount'>('registeredAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'delete' | 'role' | 'status';
    userId: string;
    value?: string;
    userName?: string;
    currentStatus?: boolean;
  } | null>(null);

  // Fetch users
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError('');
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [router]);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, users]);

  // Sort users
  useEffect(() => {
    const sorted = [...filteredUsers].sort((a, b) => {
      if (sortField === 'registeredAt') {
        const dateA = new Date(a.registeredAt || new Date()).getTime();
        const dateB = new Date(b.registeredAt || new Date()).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortField === 'solvedExercisesCount') {
        const countA = a.solvedExercisesCount || 0;
        const countB = b.solvedExercisesCount || 0;
        return sortDirection === 'asc' ? countA - countB : countB - countA;
      } else {
        const valueA = String(a[sortField] || '').toLowerCase();
        const valueB = String(b[sortField] || '').toLowerCase();
        
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });
    
    setFilteredUsers(sorted);
  }, [sortField, sortDirection]);

  // Handle role change
  const handleRoleChange = (userId: string, userName: string, newRole: string) => {
    setPendingAction({
      type: 'role', 
      userId, 
      value: newRole,
      userName
    });
    setShowConfirmModal(true);
  };
  
  const confirmRoleChange = async () => {
    if (!pendingAction || pendingAction.type !== 'role' || !pendingAction.value) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      await axios.put(`${API_URL}/admin/users/${pendingAction.userId}/role`, { role: pendingAction.value }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setUsers(users.map(user => 
        user.id === pendingAction.userId ? { ...user, role: pendingAction.value as string } : user
      ));
      setFilteredUsers(filteredUsers.map(user => 
        user.id === pendingAction.userId ? { ...user, role: pendingAction.value as string } : user
      ));
      
      setSuccessMessage(`User role updated to ${pendingAction.value}`);
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role. Please try again.');
    } finally {
      setShowConfirmModal(false);
      setPendingAction(null);
    }
  };

  // Handle delete user
  const handleDeleteUser = (userId: string, userName: string) => {
    setPendingAction({
      type: 'delete',
      userId,
      userName
    });
    setShowConfirmModal(true);
  };
  
  const confirmDeleteUser = async () => {
    if (!pendingAction || pendingAction.type !== 'delete') return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      await axios.delete(`${API_URL}/users/${pendingAction.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setUsers(users.filter(user => user.id !== pendingAction.userId));
      setFilteredUsers(filteredUsers.filter(user => user.id !== pendingAction.userId));
      
      setSuccessMessage('User successfully deleted');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setShowConfirmModal(false);
      setPendingAction(null);
    }
  };
  
  // Handle sort
  const handleSort = (field: 'fullName' | 'userName' | 'role' | 'registeredAt' | 'solvedExercisesCount') => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Handle toggle user active status
  const handleToggleStatus = (userId: string, userName: string, isActive?: boolean) => {
    setPendingAction({
      type: 'status',
      userId,
      userName,
      currentStatus: isActive === true,
      value: (!(isActive === true)).toString()
    });
    setShowConfirmModal(true);
  };
  
  const confirmStatusChange = async () => {
    if (!pendingAction || pendingAction.type !== 'status') return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const newStatus = pendingAction.currentStatus !== true;
      
      await axios.put(`${API_URL}/admin/users/${pendingAction.userId}/status`, { isActive: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setUsers(users.map(user => 
        user.id === pendingAction.userId ? { ...user, isActive: newStatus } : user
      ));
      setFilteredUsers(filteredUsers.map(user => 
        user.id === pendingAction.userId ? { ...user, isActive: newStatus } : user
      ));
      
      setSuccessMessage(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status. Please try again.');
    } finally {
      setShowConfirmModal(false);
      setPendingAction(null);
    }
  };

  // Handle confirmation based on action type
  const handleConfirmAction = () => {
    if (!pendingAction) return;
    
    switch (pendingAction.type) {
      case 'delete':
        confirmDeleteUser();
        break;
      case 'role':
        confirmRoleChange();
        break;
      case 'status':
        confirmStatusChange();
        break;
    }
  };

  // Format date safely
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown';
    try {
      // Try parsing as ISO string first
      let date = parseISO(dateStr);
      
      // If not valid, try as regular date
      if (!isValid(date)) {
        date = new Date(dateStr);
      }
      
      if (!isValid(date)) return 'Unknown';
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', dateStr, error);
      return 'Unknown';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 mb-6 rounded relative" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mb-6 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-56"
                      onClick={() => handleSort('fullName')}
                    >
                      <div className="flex items-center">
                        User
                        {sortField === 'fullName' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-28"
                      onClick={() => handleSort('userName')}
                    >
                      <div className="flex items-center">
                        Username
                        {sortField === 'userName' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-32"
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center">
                        Role
                        {sortField === 'role' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-32"
                      onClick={() => handleSort('registeredAt')}
                    >
                      <div className="flex items-center">
                        Registered
                        {sortField === 'registeredAt' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-24"
                      onClick={() => handleSort('solvedExercisesCount')}
                    >
                      <div className="flex items-center justify-center">
                        Solved
                        {sortField === 'solvedExercisesCount' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center w-48">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{user.fullName}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 truncate max-w-[100px]">{user.userName}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                        {user.isActive === false && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(user.registeredAt || user.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900 font-medium">
                          {user.solvedExercisesCount || 0}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.totalAttemptsCount ? `${user.totalAttemptsCount} attempts` : 'No attempts'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleRoleChange(
                              user.id, 
                              user.userName,
                              user.role === 'Admin' ? 'Member' : 'Admin'
                            )}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-md px-2 py-1 transition-colors"
                            title={`Set as ${user.role === 'Admin' ? 'Member' : 'Admin'}`}
                          >
                            {user.role === 'Admin' ? 'Set Member' : 'Set Admin'}
                          </button>
                          
                          <button
                            onClick={() => handleToggleStatus(
                              user.id,
                              user.userName,
                              user.isActive
                            )}
                            className={`${user.isActive === true ? 'text-amber-600 hover:text-amber-900 bg-amber-50 hover:bg-amber-100' : 'text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100'} rounded-md px-2 py-1 transition-colors`}
                            title={user.isActive === true ? 'Deactivate User' : 'Activate User'}
                          >
                            {user.isActive === true ? 'Deactivate' : 'Activate'}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteUser(user.id, user.userName)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-md px-2 py-1 transition-colors"
                            title="Delete User"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
                      <span className="font-medium">{filteredUsers.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => paginate(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === i + 1
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmModal && pendingAction && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {pendingAction?.type === 'delete' 
                        ? 'Delete User' 
                        : pendingAction?.type === 'role'
                          ? 'Change User Role'
                          : 'Change User Status'
                      }
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {pendingAction?.type === 'delete' 
                          ? `Are you sure you want to delete ${pendingAction.userName}? This action cannot be undone.`
                          : pendingAction?.type === 'role'
                            ? `Are you sure you want to change ${pendingAction.userName}'s role to ${pendingAction?.value}?`
                            : `Are you sure you want to ${pendingAction.currentStatus === true ? 'deactivate' : 'activate'} ${pendingAction.userName}?`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirmAction}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setPendingAction(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 