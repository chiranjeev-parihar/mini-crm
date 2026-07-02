import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTaskById,
  createTask,
  updateTask,
} from '../../services/task.service';
import { getUsers } from '../../services/user.service';
import { getLeads } from '../../services/lead.service';
import { getCustomers } from '../../services/customer.service';
import { TaskPriority, TaskStatus, CreateTaskInput } from '../../types/task';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignedUserId: z.string().min(1, 'Assigned User is required'),
  leadId: z.string().optional(),
  customerId: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.PENDING),
  remarks: z.string().optional(),
});

type TaskFormData = {
  title: string;
  description?: string;
  assignedUserId: string;
  leadId?: string;
  customerId?: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  remarks?: string;
};

export default function TaskFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const searchParams = new URLSearchParams(window.location.search);
  const initialLeadId = searchParams.get('leadId') || '';

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema) as any,
    defaultValues: {
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.PENDING,
      leadId: initialLeadId,
    },
  });

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const { data: leadsData, isLoading: loadingLeads } = useQuery({
    queryKey: ['leads', { limit: 1000 }],
    queryFn: () => getLeads('', '', 1, 1000),
  });

  const { data: customersData, isLoading: loadingCustomers } = useQuery({
    queryKey: ['customers', { limit: 1000 }],
    queryFn: () => getCustomers('', 1, 1000),
  });

  const { data: existingTask, isLoading: loadingTask } = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskById(id!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (existingTask) {
      reset({
        title: existingTask.title,
        description: existingTask.description || '',
        assignedUserId: existingTask.assignedUserId,
        leadId: existingTask.leadId || '',
        customerId: existingTask.customerId || '',
        dueDate: existingTask.dueDate ? new Date(existingTask.dueDate).toISOString().split('T')[0] : '',
        priority: existingTask.priority,
        status: existingTask.status,
        remarks: existingTask.remarks || '',
      });
    }
  }, [existingTask, reset]);

  const mutation = useMutation({
    mutationFn: (data: CreateTaskInput) =>
      isEditMode ? updateTask(id!, data) : createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['lead'] });
      queryClient.invalidateQueries({ queryKey: ['customer'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/tasks');
    },
  });

  const onSubmit = (data: TaskFormData) => {
    mutation.mutate(data);
  };

  const leadIdValue = watch('leadId');
  const customerIdValue = watch('customerId');

  const isLoading = loadingUsers || loadingLeads || loadingCustomers || (isEditMode && loadingTask);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isFinalState = isEditMode && existingTask && (existingTask.status === TaskStatus.COMPLETED || existingTask.status === TaskStatus.CANCELLED);

  const getAllowedStatuses = () => {
    if (!isEditMode || !existingTask) return Object.values(TaskStatus);
    if (existingTask.status === TaskStatus.PENDING) return [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED];
    if (existingTask.status === TaskStatus.IN_PROGRESS) return [TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED];
    return [existingTask.status];
  };

  const allowedStatuses = getAllowedStatuses();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/tasks" className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditMode ? 'Edit Task' : 'Create Task'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isEditMode ? 'Update existing task details.' : 'Assign a new task to a team member.'}
          </p>
        </div>
      </div>

      <div className="card">
        {mutation.isError && (
          <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">
              {mutation.error instanceof Error ? mutation.error.message : 'An error occurred'}
            </p>
          </div>
        )}

        {isFinalState && (
          <div className="mb-6 p-4 rounded-md bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-800">
              This task is {existingTask?.status.toLowerCase()} and cannot be edited.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <fieldset disabled={!!isFinalState}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">Title *</label>
              <input
                type="text"
                className={`input ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="e.g. Prepare quotation for Solar Panels"
                {...register('title')}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea
                rows={3}
                className="input"
                placeholder="Task details..."
                {...register('description')}
              />
            </div>

            <div>
              <label className="label">Assign To *</label>
              <select
                className={`input ${errors.assignedUserId ? 'border-red-500' : ''}`}
                {...register('assignedUserId')}
              >
                <option value="">Select a user...</option>
                {usersData?.map((user: any) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
              {errors.assignedUserId && <p className="mt-1 text-sm text-red-500">{errors.assignedUserId.message}</p>}
            </div>

            <div>
              <label className="label">Due Date *</label>
              <input
                type="date"
                className={`input ${errors.dueDate ? 'border-red-500' : ''}`}
                {...register('dueDate')}
              />
              {errors.dueDate && <p className="mt-1 text-sm text-red-500">{errors.dueDate.message}</p>}
            </div>

            <div>
              <label className="label">Priority</label>
              <select className="input" {...register('priority')}>
                {Object.values(TaskPriority).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0) + priority.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            {isEditMode && (
              <div>
                <label className="label">Status</label>
                <select className="input" {...register('status')}>
                  {allowedStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="label">Related Lead (Optional)</label>
              <select 
                className="input disabled:bg-slate-100 disabled:text-slate-400" 
                {...register('leadId')}
                disabled={!!customerIdValue}
              >
                <option value="">None</option>
                {leadsData?.items?.map((lead: any) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.fullName} {lead.company ? `- ${lead.company}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Related Customer (Optional)</label>
              <select 
                className="input disabled:bg-slate-100 disabled:text-slate-400" 
                {...register('customerId')}
                disabled={!!leadIdValue}
              >
                <option value="">None</option>
                {customersData?.items?.map((customer: any) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.company || customer.contactPerson}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="label">Remarks</label>
              <input
                type="text"
                className="input"
                placeholder="Any additional remarks..."
                {...register('remarks')}
              />
            </div>
          </div>
          </fieldset>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !!isFinalState}
              className="btn-primary inline-flex items-center"
            >
              {mutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isEditMode ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
