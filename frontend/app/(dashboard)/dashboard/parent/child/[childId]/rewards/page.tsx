'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ChildRewardsPage() {
  const params = useParams();
  const childId = params.childId as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">🎁 Reward Settings</h1>
        <button className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition">
          + Add Reward
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600 mb-4">No rewards created yet</p>
        <button className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition">
          Create First Reward
        </button>
      </div>

      <Link href="/dashboard/parent" className="text-indigo-600 hover:text-indigo-700 font-medium">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
