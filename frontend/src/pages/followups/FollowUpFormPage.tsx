import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { createFollowUp, updateFollowUp, getFollowUpById } from '../../services/followup.service';
import { FollowUpType, FollowUpPriority, FollowUpStatus } from '../../types/followup';
import { Loader2, ArrowLeft } from 'lucide-react';

interface FollowUpFormData {
  leadId: string;
  followUpDate: string;
  followUpTime: string;
  reminderTime: string;
  type: FollowUpType;
  priority: FollowUpPriority;
  notes: string;
}

export default function FollowUpFormPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get('leadId');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const { data: followUp, isLoading: isLoadingFollowUp } = useQuery({
    queryKey: ['followup', id],
    queryFn: () => getFollowUpById(id!),
    enabled: isEditing,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FollowUpFormData>({
    defaultValues: {
      leadId: leadId || '',
      followUpDate: new Date().toISOString().split('T')[0],
      followUpTime: '',
      reminderTime: '',
      type: FollowUpType.PHONE_CALL,
      priority: FollowUpPriority.MEDIUM,
      notes: '',
    }
  });

  useEffect(() => {
    if (followUp) {
      reset({
        leadId: followUp.leadId,
        followUpDate: new Date(followUp.followUpDate).toISOString().split('T')[0],
        followUpTime: followUp.followUpTime || '',
        reminderTime: followUp.reminderTime || '',
        type: followUp.type,
        priority: followUp.priority,
        notes: followUp.notes || '',
      });
    }
  }, [followUp, reset]);

  const mutation = useMutation({
    mutationFn: (data: FollowUpFormData) => {
      if (isEditing) {
        return updateFollowUp(id!, data);
      }
      return createFollowUp(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['followups'] });
      queryClient.invalidateQueries({ queryKey: ['lead', data.leadId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      // navigate back to lead if we came from lead, otherwise to followups
      if (leadId) {
        navigate(`/leads/${leadId}`);
      } else {
        navigate(isEditing ? `/followups/${id}` : '/followups');
      }
    },
  });

  const onSubmit = (data: FollowUpFormData) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    if (!isEditing && !leadId) {
      // Must come from a lead to schedule a followup
      navigate('/leads');
    }
  }, [isEditing, leadId, navigate]);

  if (isEditing && isLoadingFollowUp) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isEditing && followUp?.status === FollowUpStatus.COMPLETED) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700">
        Completed follow-ups cannot be edited.
        <button onClick={() => navigate(-1)} className="ml-4 underline">Go back</button>
      </div>
    );
  }

  if (!isEditing && !leadId) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Follow-up' : 'Schedule Follow-up'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Hidden Lead ID field */}
        {!isEditing && leadId && (
          <input type="hidden" {...register('leadId')} />
        )}

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date *</label>
            <input
              type="date"
              {...register('followUpDate', { required: 'Date is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
            />
            {errors.followUpDate && <p className="mt-1 text-sm text-red-600">{errors.followUpDate.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              {...register('followUpTime')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reminder Time</label>
            <input
              type="time"
              {...register('reminderTime')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              {...register('type')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2 bg-white"
            >
              {Object.values(FollowUpType).map(type => (
                <option key={type} value={type}>{type.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              {...register('priority')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2 bg-white"
            >
              {Object.values(FollowUpPriority).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            {...register('notes')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
            placeholder="Any specific agenda or context for this follow-up..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Schedule Follow-up'}
          </button>
        </div>
      </form>
    </div>
  );
}
