'use client';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'expired';
  childId?: string;
}

interface TaskListProps {
  tasks: Task[];
  isChild?: boolean;
  onTaskClick?: (task: Task) => void;
  onCompleteClick?: (taskId: string) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusIcons = {
  pending: '⏳',
  completed: '✅',
  expired: '❌',
};

export default function TaskList({ tasks, isChild, onTaskClick, onCompleteClick }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-2">No tasks assigned yet</p>
        {!isChild && <p className="text-sm text-gray-500">Create tasks to get started</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const dueDate = new Date(task.dueDate);
        const isOverdue = new Date() > dueDate && task.status === 'pending';

        return (
          <div
            key={task.id}
            className={`p-4 border rounded-lg hover:shadow-md transition ${
              task.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
            } ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1" onClick={() => onTaskClick?.(task)}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{statusIcons[task.status]}</span>
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>

                {task.description && (
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <span className={`${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    📅 {dueDate.toLocaleDateString()} {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isOverdue && <span className="text-red-600 font-medium">Overdue!</span>}
                </div>
              </div>

              {isChild && task.status === 'pending' && !isOverdue && (
                <button
                  onClick={() => onCompleteClick?.(task.id)}
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition whitespace-nowrap"
                >
                  Mark Complete
                </button>
              )}

              {isChild && task.status === 'pending' && isOverdue && (
                <div className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium">
                  Expired
                </div>
              )}

              {isChild && task.status === 'completed' && (
                <div className="px-3 py-2 bg-green-100 text-green-700 rounded text-sm font-medium">
                  Done! ✅
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
