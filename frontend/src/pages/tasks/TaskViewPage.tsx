import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getTaskById, updateTask } from '../../services/task.service';
import { TaskStatus } from '../../types/task';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  ArrowLeft,
  Edit,
  Loader2,
  Calendar,
  User,
  Building2,
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
} from 'lucide-react';

export default function TaskViewPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: () => updateTask(id!, { status: TaskStatus.CANCELLED }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const { data: task, isLoading, isError } = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700 text-sm">
        Failed to load task details. Please go back and try again.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/tasks"
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Task Details</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {task.status !== 'CANCELLED' && task.status !== 'COMPLETED' && (
            <>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel this task?')) {
                    cancelMutation.mutate();
                  }
                }}
                disabled={cancelMutation.isPending}
                className="btn-danger inline-flex items-center disabled:opacity-50"
              >
                Cancel
              </button>
              <Link
                to={`/tasks/${task.id}/edit`}
                className="btn-secondary inline-flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Task
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Main Details */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
            <div className="mt-2 flex flex-wrap gap-3">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Due Date
              </dt>
              <dd className="mt-1 text-sm text-slate-900">
                {new Date(task.dueDate).toLocaleDateString()}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <User className="w-4 h-4" /> Assigned To
              </dt>
              <dd className="mt-1 text-sm text-slate-900">
                {task.assignedUser?.name || 'Unassigned'}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Related Lead
              </dt>
              <dd className="mt-1 text-sm text-slate-900">
                {task.lead ? (
                  <Link to={`/leads/${task.leadId}`} className="text-blue-600 hover:underline">
                    {task.lead.fullName}
                  </Link>
                ) : (
                  'N/A'
                )}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Related Customer
              </dt>
              <dd className="mt-1 text-sm text-slate-900">
                {task.customer ? (
                  <Link to={`/customers/${task.customerId}`} className="text-blue-600 hover:underline">
                    {task.customer.company || task.customer.contactPerson}
                  </Link>
                ) : (
                  'N/A'
                )}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Description
              </dt>
              <dd className="mt-1 text-sm text-slate-900 whitespace-pre-wrap bg-slate-50 p-3 rounded-md">
                {task.description || 'No description provided.'}
              </dd>
            </div>

            {task.remarks && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Remarks
                </dt>
                <dd className="mt-1 text-sm text-slate-900 whitespace-pre-wrap bg-slate-50 p-3 rounded-md">
                  {task.remarks}
                </dd>
              </div>
            )}
              <div className="sm:col-span-2 mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Task Metadata</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <dt className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Created By
                    </dt>
                    <dd className="mt-1 text-sm text-slate-900">{task.creator?.name || 'Unknown'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Created On
                    </dt>
                    <dd className="mt-1 text-sm text-slate-900">{new Date(task.createdAt).toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Last Updated
                    </dt>
                    <dd className="mt-1 text-sm text-slate-900">{new Date(task.updatedAt).toLocaleString()}</dd>
                  </div>
                </div>
              </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
