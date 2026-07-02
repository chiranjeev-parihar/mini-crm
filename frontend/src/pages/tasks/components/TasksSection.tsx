import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getTasks, updateTask } from '../../../services/task.service';
import { TaskStatus } from '../../../types/task';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { PriorityBadge } from '../../../components/ui/PriorityBadge';
import {
  CheckSquare,
  Plus,
  Loader2,
  Eye,
  XCircle,
} from 'lucide-react';

interface TasksSectionProps {
  leadId?: string;
  customerId?: string;
  allowCreate: boolean;
}

export function TasksSection({ leadId, customerId, allowCreate }: TasksSectionProps) {
  const queryClient = useQueryClient();
  
  // Construct a simple local filter logic, since the API doesn't have exact leadId/customerId filters exposed explicitly 
  // via the GET /tasks endpoint in the signature (it uses `query` for full-text search). 
  // For the MVP, we can fetch all tasks (or a reasonable limit) and filter them locally, 
  // or we could add explicit filtering to the backend. The backend `query` parameter actually searches relations.
  // Wait, let's use the query parameter. It searches lead name / customer name.
  // Actually, a better approach for the MVP without altering the backend again is to just fetch tasks 
  // and filter locally if there's no direct ID filter. 
  // But wait! The `getTasks` call returns tasks based on `query`, `status`, etc.
  // Let's just fetch all tasks for this component and filter locally since it's an MVP.
  // Or better, let's just pass `query` as the ID? No, query searches names.
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tasks', { limit: 100 }], // fetch a bunch
    queryFn: () => getTasks({ limit: 100 }),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => updateTask(id, { status: TaskStatus.CANCELLED }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleCancelTask = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this task?')) {
      cancelMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="card flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700 text-sm">
        Failed to load tasks.
      </div>
    );
  }

  // Local filtering based on ID
  const filteredTasks = data?.items.filter(t => {
    if (leadId && t.leadId === leadId) return true;
    if (customerId && t.customerId === customerId) return true;
    return false;
  }) || [];

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-slate-200 mt-6">
      <div className="px-4 py-5 sm:px-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-slate-500" />
          <h3 className="text-lg leading-6 font-medium text-slate-900">Tasks</h3>
        </div>
        {allowCreate && (
          <Link
            to={`/tasks/new?${leadId ? `leadId=${leadId}` : ''}`}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </Link>
        )}
      </div>

      <div className="px-4 py-5 sm:p-0">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No tasks found.
          </div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {filteredTasks.map((task) => (
              <li key={task.id} className="p-4 sm:px-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-blue-600 truncate">
                      {task.title}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      Due: {new Date(task.dueDate).toLocaleDateString()} &bull; Assigned to: {task.assignedUser?.name || 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex gap-2">
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="p-1 text-slate-400 hover:text-blue-600"
                        title="View Task"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleCancelTask(task.id)}
                        disabled={task.status === TaskStatus.COMPLETED || task.status === TaskStatus.CANCELLED || cancelMutation.isPending}
                        className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Cancel Task"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
