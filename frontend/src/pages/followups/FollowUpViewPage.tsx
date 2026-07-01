import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFollowUpById, updateFollowUp, createFollowUp } from '../../services/followup.service';
import { FollowUpStatus, FollowUpType, FollowUpPriority } from '../../types/followup';
import { ArrowLeft, Edit, Loader2, Calendar, Clock, AlertCircle, Phone, Mail, MapPin, MonitorPlay, MessageCircle, Users, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

interface CompleteFormData {
  outcomeNotes: string;
  scheduleNext: boolean;
  nextDate: string;
  nextTime: string;
  nextType: FollowUpType;
  nextPriority: FollowUpPriority;
}

export default function FollowUpViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: followUp, isLoading, isError } = useQuery({
    queryKey: ['followup', id],
    queryFn: () => getFollowUpById(id!),
    enabled: !!id,
  });

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CompleteFormData>({
    defaultValues: {
      outcomeNotes: '',
      scheduleNext: false,
      nextDate: '',
      nextTime: '',
      nextType: FollowUpType.PHONE_CALL,
      nextPriority: FollowUpPriority.MEDIUM,
    }
  });

  const scheduleNext = watch('scheduleNext');

  const completeMutation = useMutation({
    mutationFn: async (data: CompleteFormData) => {
      // 1. Update current to completed
      await updateFollowUp(id!, {
        status: FollowUpStatus.COMPLETED,
        outcomeNotes: data.outcomeNotes,
      });

      // 2. Schedule next if checked
      if (data.scheduleNext && followUp) {
        await createFollowUp({
          leadId: followUp.leadId,
          followUpDate: data.nextDate,
          followUpTime: data.nextTime,
          type: data.nextType,
          priority: data.nextPriority,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followup', id] });
      queryClient.invalidateQueries({ queryKey: ['followups'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      if (followUp?.leadId) {
        queryClient.invalidateQueries({ queryKey: ['lead', followUp.leadId] });
      }
      setIsModalOpen(false);
    },
  });

  const onSubmitComplete = (data: CompleteFormData) => {
    completeMutation.mutate(data);
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  if (isError || !followUp) return <div className="bg-red-50 p-4 rounded-md text-red-700">Failed to load follow-up details.</div>;

  const isPending = followUp.status === FollowUpStatus.PENDING || followUp.status === FollowUpStatus.MISSED;

  const getTypeIcon = (type: FollowUpType) => {
    switch (type) {
      case FollowUpType.PHONE_CALL: return <Phone className="w-5 h-5" />;
      case FollowUpType.EMAIL: return <Mail className="w-5 h-5" />;
      case FollowUpType.SITE_VISIT: return <MapPin className="w-5 h-5" />;
      case FollowUpType.DEMO: return <MonitorPlay className="w-5 h-5" />;
      case FollowUpType.WHATSAPP: return <MessageCircle className="w-5 h-5" />;
      case FollowUpType.MEETING: return <Users className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Follow-up Details</h1>
        </div>
        <div className="flex gap-3">
          {isPending && (
            <>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-700 focus:outline-none"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Follow-up
              </button>
              <Link
                to={`/followups/${id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              {getTypeIcon(followUp.type)}
            </div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {followUp.type.replace('_', ' ')} with <Link to={`/leads/${followUp.leadId}`} className="text-blue-600 hover:underline">{followUp.lead?.fullName}</Link>
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Created by {followUp.creator?.name} on {format(new Date(followUp.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            followUp.status === FollowUpStatus.COMPLETED ? 'bg-green-100 text-green-800' :
            followUp.status === FollowUpStatus.CANCELLED ? 'bg-gray-100 text-gray-800' :
            followUp.status === FollowUpStatus.MISSED ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {followUp.status}
          </span>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {format(new Date(followUp.followUpDate), 'MMMM d, yyyy')}
              </dd>
            </div>
            {followUp.followUpTime && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Time
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {followUp.followUpTime}
                </dd>
              </div>
            )}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Priority
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                {followUp.priority.toLowerCase()}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                {followUp.notes || 'N/A'}
              </dd>
            </div>
            {followUp.outcomeNotes && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-green-50">
                <dt className="text-sm font-medium text-green-800">Outcome Notes</dt>
                <dd className="mt-1 text-sm text-green-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                  {followUp.outcomeNotes}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Completion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsModalOpen(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit(onSubmitComplete)}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Complete Follow-up</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Outcome Notes *</label>
                      <textarea
                        {...register('outcomeNotes', { required: 'Outcome notes are required' })}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="What was the result of this follow-up?"
                      ></textarea>
                      {errors.outcomeNotes && <p className="mt-1 text-sm text-red-600">{errors.outcomeNotes.message}</p>}
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('scheduleNext')}
                        id="scheduleNext"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="scheduleNext" className="ml-2 block text-sm text-gray-900">
                        Schedule next follow-up
                      </label>
                    </div>

                    {scheduleNext && (
                      <div className="pl-6 space-y-4 border-l-2 border-blue-200 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Date *</label>
                            <input
                              type="date"
                              {...register('nextDate', { required: scheduleNext ? 'Date is required' : false })}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.nextDate && <p className="mt-1 text-sm text-red-600">{errors.nextDate.message}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Time</label>
                            <input
                              type="time"
                              {...register('nextTime')}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                              {...register('nextType')}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                            >
                              {Object.values(FollowUpType).map(type => (
                                <option key={type} value={type}>{type.replace('_', ' ')}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Priority</label>
                            <select
                              {...register('nextPriority')}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                            >
                              {Object.values(FollowUpPriority).map(p => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={completeMutation.isPending}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {completeMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Complete
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
