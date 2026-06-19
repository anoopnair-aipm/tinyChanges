'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api';
import Link from 'next/link';

interface Child {
  id: string;
  name: string;
  email: string;
}

export default function ParentDashboard() {
  const { user } = useAuthStore();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [childEmail, setChildEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await apiClient.get('/api/auth/children');
      setChildren(response.data);
    } catch (error) {
      console.error('Failed to fetch children:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!childName.trim() || !childEmail.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await apiClient.post('/api/auth/add-child', {
        name: childName,
        email: childEmail,
      });

      const newChild: Child = response.data;
      setChildren([...children, newChild]);
      setChildName('');
      setChildEmail('');
      setShowAddChild(false);
      setSuccess(`✅ Added ${childName} to your account!`);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to add child');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}! 👋</h1>
        <p className="opacity-90">Manage your children's tasks and rewards</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Your Children ({children.length})
          </h2>
          <button
            onClick={() => setShowAddChild(!showAddChild)}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            {showAddChild ? '✕ Close' : '+ Add Child'}
          </button>
        </div>

        {showAddChild && (
          <form onSubmit={handleAddChild} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Child's Name
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="e.g., Tommy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={childEmail}
                  onChange={(e) => setChildEmail(e.target.value)}
                  placeholder="child@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
              >
                Save Child
              </button>
              <button
                type="button"
                onClick={() => setShowAddChild(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No children added yet</p>
            <button
              onClick={() => setShowAddChild(true)}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
            >
              Add Your First Child
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children.map((child) => (
              <div
                key={child.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-900">{child.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{child.email}</p>
                <div className="space-y-2">
                  <Link
                    href={`/dashboard/parent/child/${child.id}/tasks`}
                    className="block px-4 py-2 bg-indigo-100 text-indigo-700 font-medium rounded-lg hover:bg-indigo-200 transition text-center"
                  >
                    📋 Manage Tasks
                  </Link>
                  <Link
                    href={`/dashboard/parent/child/${child.id}/rewards`}
                    className="block px-4 py-2 bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200 transition text-center"
                  >
                    🎁 Manage Rewards
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Stats</h3>
          <p className="text-3xl font-bold text-indigo-600">{children.length}</p>
          <p className="text-sm text-gray-600">Children registered</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tasks</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
          <p className="text-sm text-gray-600">Total assigned</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-600">This week</p>
        </div>
      </div>
    </div>
  );
}
