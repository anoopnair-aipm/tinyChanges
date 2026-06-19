'use client';

import { useState } from 'react';
import apiClient from '@/lib/api';

interface RedeemRewardModalProps {
  rewardId: string;
  rewardName: string;
  pointsValue: number;
  isOpen: boolean;
  onClose: () => void;
  onRedeemed: () => void;
}

export default function RedeemRewardModal({
  rewardId,
  rewardName,
  pointsValue,
  isOpen,
  onClose,
  onRedeemed,
}: RedeemRewardModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRedeem = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post(`/api/rewards/${rewardId}/redeem`);
      onRedeemed();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to redeem reward');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Redeem Reward?</h2>
        <p className="text-gray-700 mb-4">
          Are you sure you want to redeem: <strong>{rewardName}</strong>?
        </p>
        <p className="text-sm text-gray-600 mb-4 bg-yellow-50 p-3 rounded-lg">
          💡 You&apos;ll use 1 of your {rewardName} {pointsValue} points to redeem this reward
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleRedeem}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Redeeming...' : '✨ Redeem'}
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
