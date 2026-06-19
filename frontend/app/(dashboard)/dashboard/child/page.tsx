'use client';

import { useAuthStore } from '@/lib/store';
import Link from 'next/link';

export default function ChildDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}! 🎮</h1>
        <p className="opacity-90">Complete your tasks and earn amazing rewards!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/child/tasks"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
        >
          <h2 className="text-2xl font-bold mb-2">📋 Your Tasks</h2>
          <p className="text-gray-600 mb-4">See what you need to complete</p>
          <div className="text-4xl font-bold text-indigo-600">0</div>
          <p className="text-sm text-gray-500">tasks assigned</p>
        </Link>

        <Link
          href="/dashboard/child/rewards"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
        >
          <h2 className="text-2xl font-bold mb-2">🎁 Rewards</h2>
          <p className="text-gray-600 mb-4">View your earned rewards</p>
          <div className="text-4xl font-bold text-purple-600">0</div>
          <p className="text-sm text-gray-500">rewards earned</p>
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 How it works</h3>
        <ol className="list-decimal list-inside text-blue-800 space-y-2">
          <li>Your parent will assign you tasks with deadlines</li>
          <li>Complete the task before the deadline to earn rewards</li>
          <li>Collect your rewards and redeem them!</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Tasks</h3>
          <p className="text-3xl font-bold text-indigo-600">0</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Rewards</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
        </div>
      </div>
    </div>
  );
}
