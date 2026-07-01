import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCustomerById, updateCustomer } from '../../services/customer.service';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const customerSchema = z.object({
  company: z.string().optional(),
  contactPerson: z.string().min(1, 'Contact person is required'),
  phone: z.string().optional(),
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  address: z.string().optional(),
  industry: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CustomerEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch existing data
  const { data: customer, isLoading, isError } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomerById(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      company: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      industry: '',
      notes: '',
    },
  });

  // Populate form once data arrives
  useEffect(() => {
    if (customer) {
      reset({
        company: customer.company ?? '',
        contactPerson: customer.contactPerson ?? '',
        phone: customer.phone ?? '',
        email: customer.email ?? '',
        address: customer.address ?? '',
        industry: customer.industry ?? '',
        notes: customer.notes ?? '',
      });
    }
  }, [customer, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: CustomerFormValues) => updateCustomer(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      navigate(`/customers/${id}`);
    },
  });

  const onSubmit = (data: CustomerFormValues) => {
    updateMutation.mutate(data);
  };

  // ---------------------------------------------------------------------------
  // Loading / error states
  // ---------------------------------------------------------------------------

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
        Failed to load customer. Please go back and try again.
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Form
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/customers/${id}`}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Back to customer"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Customer</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {customer.company || customer.contactPerson}
          </p>
        </div>
      </div>

      {/* Mutation error */}
      {updateMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
          {(updateMutation.error as Error)?.message || 'Failed to update customer.'}
        </div>
      )}

      {/* Form card */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow sm:rounded-lg border border-gray-200"
        noValidate
      >
        <div className="px-4 py-5 sm:p-6 space-y-5">
          {/* Company */}
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              id="company"
              type="text"
              placeholder="e.g. Acme Pvt. Ltd."
              {...register('company')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
            />
          </div>

          {/* Contact person */}
          <div>
            <label
              htmlFor="contactPerson"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Person <span className="text-red-500">*</span>
            </label>
            <input
              id="contactPerson"
              type="text"
              placeholder="e.g. Rahul Sharma"
              {...register('contactPerson')}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm border px-3 py-2 ${
                errors.contactPerson
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.contactPerson && (
              <p className="mt-1 text-xs text-red-600">{errors.contactPerson.message}</p>
            )}
          </div>

          {/* Phone / Email */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                {...register('phone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="contact@company.com"
                {...register('email')}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm border px-3 py-2 ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Industry */}
          <div>
            <label
              htmlFor="industry"
              className="block text-sm font-medium text-gray-700"
            >
              Industry
            </label>
            <input
              id="industry"
              type="text"
              placeholder="e.g. Solar, Real Estate, Healthcare…"
              {...register('industry')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <textarea
              id="address"
              rows={3}
              placeholder="Full address…"
              {...register('address')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2 resize-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              placeholder="Any additional notes…"
              {...register('notes')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2 resize-none"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200 rounded-b-lg flex items-center justify-end gap-3">
          <Link
            to={`/customers/${id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || updateMutation.isPending || !isDirty}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
