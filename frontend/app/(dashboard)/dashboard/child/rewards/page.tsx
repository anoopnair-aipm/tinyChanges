'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api';
import RewardsList from '@/components/rewards/RewardsList';
import RedeemRewardModal from '@/components/rewards/RedeemRewardModal';
import { useAuthStore } from '@/lib/store';

interface Reward {
  id: string;
  name: string;
  description?: string;
  pointsValue: number;
}

export default function ChildRewardsPage() {
  const { user } = useAuthStore();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [balances, setBalances] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user?.isChild) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const rewardsRes = await apiClient.get('/api/rewards');
      setRewards(rewardsRes.data);

      const balanceRes = await apiClient.get(`/api/rewards/balance/${user!.id}`);
      const balanceMap: Record<string, number> = {};
      balanceRes.data.balances.forEach((b: { rewardId: string; balance: number }) => {
        balanceMap[b.rewardId] = b.balance;
      });
      setBalances(balanceMap);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRewardRedeemed = () => {
    setShowRedeemModal(false);
    setSelectedReward(null);
    fetchData();
  };

  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">🎁 Available Rewards</h1>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      ) : (
        <RewardsList
          rewards={rewards}
          isChild={true}
          onRedeemClick={handleRedeemClick}
          balances={balances}
        />
      )}

      {selectedReward && (
        <RedeemRewardModal
          rewardId={selectedReward.id}
          rewardName={selectedReward.name}
          pointsValue={selectedReward.pointsValue}
          isOpen={showRedeemModal}
          onClose={() => {
            setShowRedeemModal(false);
            setSelectedReward(null);
          }}
          onRedeemed={handleRewardRedeemed}
        />
      )}

      <Link href="/dashboard/child" className="text-indigo-600 hover:text-indigo-700 font-medium">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
