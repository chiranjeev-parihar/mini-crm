import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getCustomers } from '../../services/customer.service';
import {
  Search,
  Eye,
  Edit,
  Building2,
  Users,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function CustomerListPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['customers', query, page],
    queryFn: () => getCustomers(query, page, limit),
  });

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            All customers converted from won leads
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Search */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="customer-search"
          type="text"
          placeholder="Search by company, contact, email…"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Table */}
      {/* ------------------------------------------------------------------ */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700 text-sm">
          Failed to load customers. Please refresh and try again.
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          {data?.items.length === 0 ? (
            /* Empty state */
            <div className="text-center py-16 px-6">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-50">
                <Building2 className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900">No customers yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Convert a won lead to create your first customer.
              </p>
              <div className="mt-4">
                <Link
                  to="/leads"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Go to Leads
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Responsive table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Company
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Contact Person
                      </th>
                      <th
                        scope="col"
                        className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Phone
                      </th>
                      <th
                        scope="col"
                        className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Industry
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.items.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {customer.company || '—'}
                              </p>
                              <p className="text-xs text-gray-500 sm:hidden">
                                {customer.phone || customer.email || '—'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {customer.contactPerson || '—'}
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {customer.phone ? (
                            <a
                              href={`tel:${customer.phone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {customer.phone}
                            </a>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {customer.email ? (
                            <a
                              href={`mailto:${customer.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {customer.email}
                            </a>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                          {customer.industry ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {customer.industry}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              to={`/customers/${customer.id}`}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="View customer"
                            >
                              <Eye className="w-5 h-5" />
                              <span className="sr-only">View</span>
                            </Link>
                            <Link
                              to={`/customers/${customer.id}/edit`}
                              className="text-blue-400 hover:text-blue-600 transition-colors"
                              title="Edit customer"
                            >
                              <Edit className="w-5 h-5" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">{(page - 1) * limit + 1}</span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {Math.min(page * limit, data.total)}
                      </span>{' '}
                      of <span className="font-medium">{data.total}</span> customers
                    </p>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                      disabled={page === data.totalPages}
                      className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
