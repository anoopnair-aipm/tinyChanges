'use client';

import { useState } from 'react';
import apiClient from '@/lib/api';

interface CompleteTaskModalProps {
  taskId: string;
  taskTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onCompleted: () => void;
}

export default function CompleteTaskModal({
  taskId,
  taskTitle,
  isOpen,
  onClose,
  onCompleted,
}: CompleteTaskModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post(`/api/tasks/${taskId}/complete`, { notes });
      onCompleted();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to complete task');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Complete Task?</h2>
        <p className="text-gray-700 mb-4">
          Are you sure you've completed: <strong>{taskTitle}</strong>?
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about completing this task"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleComplete}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : '✅ Mark Complete'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
