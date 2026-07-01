import { Request, Response } from 'express';
import * as customerService from '../services/customer.service';
import { ConversionError } from '../services/customer.service';
import type { ApiResponse } from '../types';

// ---------------------------------------------------------------------------
// GET /customers
// ---------------------------------------------------------------------------

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const query = (req.query.query as string) || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { customers, total } = await customerService.getCustomers(query, page, limit);

    res.status(200).json({
      success: true,
      message: 'Customers fetched successfully',
      data: {
        items: customers,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    } satisfies ApiResponse);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    } satisfies ApiResponse);
  }
};

// ---------------------------------------------------------------------------
// GET /customers/:id
// ---------------------------------------------------------------------------

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const customer = await customerService.getCustomerById(id);

    if (!customer) {
      res.status(404).json({
        success: false,
        message: 'Customer not found',
      } satisfies ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Customer fetched successfully',
      data: customer,
    } satisfies ApiResponse);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    } satisfies ApiResponse);
  }
};

// ---------------------------------------------------------------------------
// PUT /customers/:id
// ---------------------------------------------------------------------------

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { company, contactPerson, phone, email, address, industry, notes } = req.body;

    const updated = await customerService.updateCustomer(id, {
      company,
      contactPerson,
      phone,
      email,
      address,
      industry,
      notes,
    });

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: updated,
    } satisfies ApiResponse);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    } satisfies ApiResponse);
  }
};

// ---------------------------------------------------------------------------
// DELETE /customers/:id  (backend only — no UI button)
// ---------------------------------------------------------------------------

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await customerService.deleteCustomer(id);

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
      data: null,
    } satisfies ApiResponse);
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    } satisfies ApiResponse);
  }
};

// ---------------------------------------------------------------------------
// POST /leads/:id/convert
// ---------------------------------------------------------------------------

export const convertLead = async (req: Request, res: Response) => {
  try {
    const leadId = req.params.id as string;
    const { conversionReason } = req.body;

    const customer = await customerService.convertLeadToCustomer(leadId, conversionReason);

    res.status(201).json({
      success: true,
      message: 'Lead successfully converted to customer',
      data: customer,
    } satisfies ApiResponse);
  } catch (error) {
    if (error instanceof ConversionError) {
      const statusMap: Record<string, number> = {
        NOT_FOUND: 404,
        NOT_WON: 400,
        ALREADY_CONVERTED: 409,
      };

      res.status(statusMap[error.code] ?? 400).json({
        success: false,
        message: error.message,
      } satisfies ApiResponse);
      return;
    }

    console.error('Error converting lead:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    } satisfies ApiResponse);
  }
};
