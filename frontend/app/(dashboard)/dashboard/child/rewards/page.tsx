'use client';

import Link from 'next/link';

export default function ChildRewardsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">🎁 Your Rewards</h1>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600 mb-4">No rewards earned yet</p>
        <p className="text-sm text-gray-500">Complete your tasks to earn rewards!</p>
      </div>

      <Link href="/dashboard/child" className="text-indigo-600 hover:text-indigo-700 font-medium">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
