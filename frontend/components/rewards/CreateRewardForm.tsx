'use client';

import { useState } from 'react';
import apiClient from '@/lib/api';

interface CreateRewardFormProps {
  onRewardCreated: () => void;
}

export default function CreateRewardForm({
  onRewardCreated,
}: CreateRewardFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointsValue: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post('/api/rewards', {
        ...formData,
        pointsValue: parseInt(String(formData.pointsValue)),
      });

      setFormData({
        name: '',
        description: '',
        pointsValue: 5,
      });
      setIsOpen(false);
      onRewardCreated();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create reward');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
      >
        + Add Reward
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Create Reward</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reward Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Extra screen time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What does this reward get them?"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points Value *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.pointsValue}
                  onChange={(e) => setFormData({ ...formData, pointsValue: parseInt(e.target.value) })}
                  placeholder="Points needed to redeem"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Reward'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
