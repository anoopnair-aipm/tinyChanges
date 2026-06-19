'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api';
import TaskList from '@/components/tasks/TaskList';
import CompleteTaskModal from '@/components/tasks/CompleteTaskModal';
import { useAuthStore } from '@/lib/store';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'expired';
}

export default function ChildTasksPage() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'expired'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  useEffect(() => {
    if (!user?.isChild) return;
    fetchTasks();
  }, [user, filter]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/api/tasks', {
        params: filter !== 'all' ? { status: filter } : undefined,
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCompleteClick = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setShowCompleteModal(true);
    }
  };

  const handleTaskCompleted = () => {
    setShowCompleteModal(false);
    setSelectedTask(null);
    fetchTasks();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">📋 Your Tasks</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'completed', 'expired'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === f
                ? 'bg-purple-600 text-white'
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          isChild={true}
          onTaskClick={handleTaskClick}
          onCompleteClick={handleCompleteClick}
        />
      )}

      {/* Complete Task Modal */}
      {selectedTask && (
        <CompleteTaskModal
          taskId={selectedTask.id}
          taskTitle={selectedTask.title}
          isOpen={showCompleteModal}
          onClose={() => {
            setShowCompleteModal(false);
            setSelectedTask(null);
          }}
          onCompleted={handleTaskCompleted}
        />
      )}

      <Link href="/dashboard/child" className="text-indigo-600 hover:text-indigo-700 font-medium">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
