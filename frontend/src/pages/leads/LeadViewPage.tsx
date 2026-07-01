import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLeadById } from '../../services/lead.service';
import { convertLead } from '../../services/customer.service';
import { LeadStatus } from '../../types/lead';
import {
  ArrowLeft,
  Edit,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  CheckCircle2,
  AlertCircle,
  UserCheck,
} from 'lucide-react';

export default function LeadViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [convertError, setConvertError] = useState<string | null>(null);
  const [showConvertConfirm, setShowConvertConfirm] = useState(false);
  const [conversionReason, setConversionReason] = useState('');

  const { data: lead, isLoading, isError } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => getLeadById(id!),
    enabled: !!id,
  });

  const convertMutation = useMutation({
    mutationFn: () => convertLead(id!, conversionReason || undefined),
    onSuccess: (customer) => {
      // Refresh lead data to show Converted badge
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      // Navigate to the new customer profile
      navigate(`/customers/${customer.id}`);
    },
    onError: (err: Error) => {
      setConvertError(err.message);
      setShowConvertConfirm(false);
    },
  });

  // ---------------------------------------------------------------------------
  // Loading / error states
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700">
        Failed to load lead details.
      </div>
    );
  }

  const isWon = lead.status === LeadStatus.WON;
  const isConverted = !!lead.isConverted;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Top bar */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link to="/leads" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Lead Details</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Converted badge */}
          {isConverted && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
              <CheckCircle2 className="w-4 h-4" />
              Converted
            </span>
          )}

          {/* Convert to Customer button — only for Won, not yet converted */}
          {isWon && !isConverted && (
            <button
              id="btn-convert-to-customer"
              onClick={() => {
                setConvertError(null);
                setShowConvertConfirm(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Convert to Customer
            </button>
          )}

          {/* Edit lead */}
          <Link
            to={`/leads/${lead.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Non-won hint (show only if lead is not Won and not converted) */}
      {/* ------------------------------------------------------------------ */}
      {!isWon && !isConverted && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            This lead must be marked as{' '}
            <span className="font-semibold">Won</span> before conversion.
          </p>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Convert error */}
      {/* ------------------------------------------------------------------ */}
      {convertError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{convertError}</p>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Conversion confirm panel */}
      {/* ------------------------------------------------------------------ */}
      {showConvertConfirm && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-4 space-y-3">
          <p className="text-sm font-semibold text-green-800">
            Convert <span className="italic">{lead.fullName}</span> to a Customer?
          </p>
          <div>
            <label
              htmlFor="conversionReason"
              className="block text-xs font-medium text-green-700 mb-1"
            >
              Conversion reason{' '}
              <span className="font-normal text-green-600">(optional)</span>
            </label>
            <input
              id="conversionReason"
              type="text"
              value={conversionReason}
              onChange={(e) => setConversionReason(e.target.value)}
              placeholder="e.g. Deal closed, contract signed…"
              className="block w-full sm:max-w-sm rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border px-3 py-2 bg-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              id="btn-confirm-convert"
              onClick={() => convertMutation.mutate()}
              disabled={convertMutation.isPending}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {convertMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Converting…
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Confirm Conversion
                </>
              )}
            </button>
            <button
              onClick={() => {
                setShowConvertConfirm(false);
                setConversionReason('');
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Lead detail card */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{lead.fullName}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{lead.company || 'No Company'}</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
            {lead.status.replace('_', ' ').toLowerCase()}
          </span>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {lead.email ? (
                  <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                    {lead.email}
                  </a>
                ) : (
                  'N/A'
                )}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone number
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {lead.phone ? (
                  <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                    {lead.phone}
                  </a>
                ) : (
                  'N/A'
                )}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Building className="w-4 h-4" /> Company
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {lead.company || 'N/A'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Source
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {lead.source || 'N/A'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                {lead.address || 'N/A'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                {lead.notes || 'N/A'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {lead.assignee ? lead.assignee.name : 'Unassigned'}
              </dd>
            </div>
            {isConverted && lead.convertedAt && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Converted On
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(lead.convertedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  {lead.conversionReason && (
                    <span className="text-gray-500"> — {lead.conversionReason}</span>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
