'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api';
import CreateRewardForm from '@/components/rewards/CreateRewardForm';
import RewardsList from '@/components/rewards/RewardsList';
import { useAuthStore } from '@/lib/store';

interface Reward {
  id: string;
  name: string;
  description?: string;
  pointsValue: number;
}

interface Child {
  id: string;
  name: string;
  email: string;
}

export default function ChildRewardsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const childId = params.childId as string;

  const [child, setChild] = useState<Child | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user, childId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const profileRes = await apiClient.get('/api/auth/profile');
      const foundChild = profileRes.data.children?.find((c: Child) => c.id === childId);

      if (!foundChild) {
        router.push('/dashboard/parent');
        return;
      }

      setChild(foundChild);

      const rewardsRes = await apiClient.get('/api/rewards');

      setRewards(rewardsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRewardCreated = () => {
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎁 {child?.name}&apos;s Rewards</h1>
          <p className="text-gray-600">{child?.email}</p>
        </div>
        {child && <CreateRewardForm onRewardCreated={handleRewardCreated} />}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      ) : (
        <RewardsList rewards={rewards} isChild={false} onCreateClick={() => {}} />
      )}

      <Link href="/dashboard/parent" className="text-indigo-600 hover:text-indigo-700 font-medium">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
