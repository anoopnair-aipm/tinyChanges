'use client';

import Link from 'next/link';

export default function ChildTasksPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">📋 Your Tasks</h1>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600 mb-4">No tasks assigned yet</p>
        <p className="text-sm text-gray-500">Check back soon for tasks from your parent!</p>
      </div>

      <Link href="/dashboard/child" className="text-indigo-600 hover:text-indigo-700 font-medium">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
