import { Link } from 'react-router-dom';
import { FollowUp, FollowUpStatus } from '../../../types/followup';
import { format, isPast, isToday } from 'date-fns';
import { Calendar, Clock, Plus, Phone, Mail, MapPin, MonitorPlay, MessageCircle, AlertCircle, Users } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';

interface FollowUpHistoryProps {
  leadId: string;
  followUps: FollowUp[];
}

export function FollowUpHistory({ leadId, followUps }: FollowUpHistoryProps) {
  const sortedFollowUps = [...followUps].sort((a, b) => new Date(b.followUpDate).getTime() - new Date(a.followUpDate).getTime());

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PHONE_CALL': return <Phone className="w-4 h-4" />;
      case 'EMAIL': return <Mail className="w-4 h-4" />;
      case 'SITE_VISIT': return <MapPin className="w-4 h-4" />;
      case 'DEMO': return <MonitorPlay className="w-4 h-4" />;
      case 'WHATSAPP': return <MessageCircle className="w-4 h-4" />;
      case 'MEETING': return <Users className="w-4 h-4" />;
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
    return <StatusBadge status={effectiveStatus} type="followup" />;
  };

  return (
    <div className="bg-white shadow rounded-lg border border-gray-200 mt-6">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center bg-gray-50">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Follow-up History</h3>
        <Link
          to={`/followups/new?leadId=${leadId}`}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Schedule Follow-up
        </Link>
      </div>
      
      {sortedFollowUps.length === 0 ? (
        <div className="p-6 text-center text-sm text-gray-500">
          No follow-ups scheduled yet.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {sortedFollowUps.map((f) => (
            <li key={f.id} className="p-4 hover:bg-gray-50 transition-colors">
              <Link to={`/followups/${f.id}`} className="block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      {getTypeIcon(f.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {f.type.replace('_', ' ').toLowerCase()}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
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
                  <div>
                    {getStatusBadge(f.status, f.followUpDate)}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
