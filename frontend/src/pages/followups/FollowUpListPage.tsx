import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getFollowUps } from '../../services/followup.service';
import { FollowUpStatus, FollowUpType } from '../../types/followup';
import { Loader2, Calendar, Clock, Phone, Mail, MapPin, MonitorPlay, MessageCircle, AlertCircle, Users } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function FollowUpListPage() {
  const [filter, setFilter] = useState<'ALL' | 'TODAY' | 'UPCOMING' | 'MISSED'>('ALL');

  const { data: followUps, isLoading, isError } = useQuery({
    queryKey: ['followups'],
    queryFn: getFollowUps,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700">
        Failed to load follow-ups.
      </div>
    );
  }

  const getTypeIcon = (type: FollowUpType) => {
    switch (type) {
      case FollowUpType.PHONE_CALL: return <Phone className="w-4 h-4" />;
      case FollowUpType.EMAIL: return <Mail className="w-4 h-4" />;
      case FollowUpType.SITE_VISIT: return <MapPin className="w-4 h-4" />;
      case FollowUpType.DEMO: return <MonitorPlay className="w-4 h-4" />;
      case FollowUpType.WHATSAPP: return <MessageCircle className="w-4 h-4" />;
      case FollowUpType.MEETING: return <Users className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: FollowUpStatus, followUpDate: string) => {
    let effectiveStatus = status.toString();
    if (status !== FollowUpStatus.COMPLETED && status !== FollowUpStatus.CANCELLED) {
      if (isPast(new Date(followUpDate)) && !isToday(new Date(followUpDate))) {
        effectiveStatus = 'MISSED';
      } else {
        effectiveStatus = 'PENDING';
      }
    }
    return <StatusBadge status={effectiveStatus} />;
  };

  const filteredFollowUps = followUps?.filter(f => {
    if (filter === 'ALL') return true;
    if (filter === 'TODAY') return isToday(new Date(f.followUpDate));
    if (filter === 'UPCOMING') return !isPast(new Date(f.followUpDate)) && !isToday(new Date(f.followUpDate));
    if (filter === 'MISSED') return isPast(new Date(f.followUpDate)) && !isToday(new Date(f.followUpDate)) && f.status !== FollowUpStatus.COMPLETED && f.status !== FollowUpStatus.CANCELLED;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Follow-ups</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your schedule and interactions with leads.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 border-b border-gray-200">
        {(['ALL', 'TODAY', 'UPCOMING', 'MISSED'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              filter === f
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="bg-white shadow rounded-md overflow-hidden border border-gray-200">
        {filteredFollowUps?.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Follow-ups Scheduled</h3>
            <p className="mt-1 text-sm text-gray-500">
              No follow-ups found for the selected filter.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredFollowUps?.map((f) => {
              const isMissed = isPast(new Date(f.followUpDate)) && !isToday(new Date(f.followUpDate)) && f.status !== FollowUpStatus.COMPLETED && f.status !== FollowUpStatus.CANCELLED;
              return (
                <li key={f.id} className="hover:bg-gray-50 transition-colors">
                  <Link to={`/followups/${f.id}`} className="block px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isMissed ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                          {getTypeIcon(f.type)}
                        </div>
                        <div>
                          <p className={`text-sm font-medium truncate ${isMissed ? 'text-red-600' : 'text-blue-600'}`}>
                            {typeof f.lead === 'string' ? f.lead : (f.lead?.fullName || 'Unknown Lead')}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500 space-x-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {format(new Date(f.followUpDate), 'MMM d, yyyy')}
                            </span>
                            {f.followUpTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {f.followUpTime}
                              </span>
                            )}
                            <span className="capitalize">{f.priority.toLowerCase()} Priority</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(f.status, f.followUpDate)}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
