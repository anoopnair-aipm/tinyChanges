'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api';
import CreateTaskForm from '@/components/tasks/CreateTaskForm';
import TaskList from '@/components/tasks/TaskList';
import { useAuthStore } from '@/lib/store';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'expired';
}

interface Child {
  id: string;
  name: string;
  email: string;
}

export default function ChildTasksPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const childId = params.childId as string;

  const [child, setChild] = useState<Child | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'expired'>('all');

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user, childId, filter]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch profile to get children
      const profileRes = await apiClient.get('/api/auth/profile');
      const foundChild = profileRes.data.children?.find((c: Child) => c.id === childId);

      if (!foundChild) {
        router.push('/dashboard/parent');
        return;
      }

      setChild(foundChild);

      // Fetch tasks
      const tasksRes = await apiClient.get('/api/tasks', {
        params: {
          childId,
          ...(filter !== 'all' && { status: filter }),
        },
      });

      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreated = () => {
    fetchData();
  };

  const filteredTasks = tasks;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📋 {child?.name}'s Tasks</h1>
          <p className="text-gray-600">{child?.email}</p>
        </div>
        {child && <CreateTaskForm childId={childId} childName={child.name} onTaskCreated={handleTaskCreated} />}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'completed', 'expired'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      ) : (
        <TaskList tasks={filteredTasks} isChild={false} />
      )}

      <Link href="/dashboard/parent" className="text-indigo-600 hover:text-indigo-700 font-medium">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
