import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getCustomerById } from '../../services/customer.service';
import {
  ArrowLeft,
  Edit,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  User,
  FileText,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { TasksSection } from '../tasks/components/TasksSection';

export default function CustomerViewPage() {
  const { id } = useParams<{ id: string }>();

  const { data: customer, isLoading, isError } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomerById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700 text-sm">
        Failed to load customer details. Please go back and try again.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Top bar */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/customers"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Back to customers"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Profile</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Converted from lead:{' '}
              <Link
                to={`/leads/${customer.lead?.id}`}
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                {customer.lead?.fullName}
                <ExternalLink className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>
        <Link
          to={`/customers/${customer.id}/edit`}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Link>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Conversion banner */}
      {/* ------------------------------------------------------------------ */}
      {customer.lead?.convertedAt && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-medium text-green-800">Converted on </span>
            <span className="text-green-700">
              {new Date(customer.lead.convertedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            {customer.lead.conversionReason && (
              <span className="text-green-700">
                {' '}— {customer.lead.conversionReason}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Profile card */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 flex items-center gap-4">
          <div className="flex-shrink-0 h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
            <Building2 className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {customer.company || 'Unnamed Company'}
            </h2>
            <p className="text-sm text-gray-500">{customer.contactPerson || '—'}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            {/* Contact person */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4" /> Contact Person
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.contactPerson || '—'}
              </dd>
            </div>

            {/* Email */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.email ? (
                  <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                    {customer.email}
                  </a>
                ) : (
                  '—'
                )}
              </dd>
            </div>

            {/* Phone */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.phone ? (
                  <a href={`tel:${customer.phone}`} className="text-blue-600 hover:underline">
                    {customer.phone}
                  </a>
                ) : (
                  '—'
                )}
              </dd>
            </div>

            {/* Industry */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Industry
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.industry ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {customer.industry}
                  </span>
                ) : (
                  '—'
                )}
              </dd>
            </div>

            {/* Address */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                {customer.address || '—'}
              </dd>
            </div>

            {/* Notes */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Notes
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                {customer.notes || '—'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Lead info panel */}
      {/* ------------------------------------------------------------------ */}
      {customer.lead && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-4 sm:px-6">
            <h3 className="text-base font-semibold text-gray-900">Source Lead</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Original lead that was converted to this customer
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium text-gray-500">Lead Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.lead.fullName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Lead Source</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.lead.source || '—'}</dd>
              </div>
              {customer.lead.assignee && (
                <div>
                  <dt className="text-xs font-medium text-gray-500">Handled By</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customer.lead.assignee.name}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}

      {/* Tasks */}
      <TasksSection customerId={customer.id} allowCreate={true} />
    </div>
  );
}
