import { prisma } from '../config/prisma';
import type { Prisma } from '@prisma/client';

export const getLeads = async (
  query: string,
  status: string,
  page: number,
  limit: number
) => {
  const where: Prisma.LeadWhereInput = {};

  if (query) {
    where.OR = [
      { fullName: { contains: query } },
      { email: { contains: query } },
      { phone: { contains: query } },
    ];
  }

  if (status) {
    where.status = status as any;
  }

  const skip = (page - 1) * limit;

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.lead.count({ where }),
  ]);

  return { leads, total };
};

export const getLeadById = async (id: string) => {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      assignee: {
        select: { id: true, name: true, email: true },
      },
      followUps: {
        orderBy: { followUpDate: 'desc' }
      },
    },
  });
};

export const createLead = async (data: any) => {
  return prisma.lead.create({
    data,
  });
};

export const updateLead = async (id: string, data: any) => {
  return prisma.lead.update({
    where: { id },
    data,
  });
};

export const deleteLead = async (id: string) => {
  return prisma.lead.delete({
    where: { id },
  });
};
