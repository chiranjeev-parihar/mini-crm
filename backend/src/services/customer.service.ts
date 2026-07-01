import { prisma } from '../config/prisma';
import type { Prisma } from '@prisma/client';

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export const getCustomers = async (
  query: string,
  page: number,
  limit: number
) => {
  const where: Prisma.CustomerWhereInput = {};

  if (query) {
    where.OR = [
      { company: { contains: query } },
      { contactPerson: { contains: query } },
      { email: { contains: query } },
      { phone: { contains: query } },
    ];
  }

  const skip = (page - 1) * limit;

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        lead: {
          select: {
            id: true,
            fullName: true,
            status: true,
            convertedAt: true,
            conversionReason: true,
          },
        },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  return { customers, total };
};

export const getCustomerById = async (id: string) => {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      lead: {
        select: {
          id: true,
          fullName: true,
          status: true,
          source: true,
          assignedTo: true,
          convertedAt: true,
          conversionReason: true,
          assignee: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });
};

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export const updateCustomer = async (id: string, data: Prisma.CustomerUpdateInput) => {
  return prisma.customer.update({
    where: { id },
    data,
  });
};

// ---------------------------------------------------------------------------
// Delete (backend-only; not exposed in UI)
// ---------------------------------------------------------------------------

export const deleteCustomer = async (id: string) => {
  return prisma.customer.delete({ where: { id } });
};

// ---------------------------------------------------------------------------
// Lead → Customer conversion (core business logic)
// ---------------------------------------------------------------------------

export const convertLeadToCustomer = async (
  leadId: string,
  conversionReason?: string
) => {
  // 1. Fetch lead
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });

  if (!lead) {
    throw new ConversionError('NOT_FOUND', 'Lead not found');
  }

  // 2. Enforce status = WON
  if (lead.status !== 'WON') {
    throw new ConversionError(
      'NOT_WON',
      'This lead must be marked as Won before conversion.'
    );
  }

  // 3. Prevent duplicate conversion
  if (lead.isConverted) {
    throw new ConversionError(
      'ALREADY_CONVERTED',
      'This lead has already been converted to a customer.'
    );
  }

  // 4. Run as atomic transaction
  const [customer] = await prisma.$transaction([
    // Create the customer record using lead data as defaults
    prisma.customer.create({
      data: {
        leadId: lead.id,
        company: lead.company ?? null,
        contactPerson: lead.fullName,
        phone: lead.phone ?? null,
        email: lead.email ?? null,
        address: lead.address ?? null,
        notes: lead.notes ?? null,
      },
    }),
    // Mark the lead as converted
    prisma.lead.update({
      where: { id: leadId },
      data: {
        isConverted: true,
        convertedAt: new Date(),
        conversionReason: conversionReason ?? null,
      },
    }),
  ]);

  return customer;
};

// ---------------------------------------------------------------------------
// Typed error class for conversion business rules
// ---------------------------------------------------------------------------

export type ConversionErrorCode =
  | 'NOT_FOUND'
  | 'NOT_WON'
  | 'ALREADY_CONVERTED';

export class ConversionError extends Error {
  constructor(
    public readonly code: ConversionErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'ConversionError';
  }
}
