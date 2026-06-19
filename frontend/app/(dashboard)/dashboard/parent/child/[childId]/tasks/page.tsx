'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ChildTasksPage() {
  const params = useParams();
  const childId = params.childId as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">📋 Child Tasks</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
          + Add Task
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600 mb-4">No tasks yet</p>
        <button className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
          Create First Task
        </button>
      </div>

      <Link href="/dashboard/parent" className="text-indigo-600 hover:text-indigo-700 font-medium">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
