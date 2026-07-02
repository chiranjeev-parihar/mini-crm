import { Request, Response } from 'express';
import * as leadService from '../services/lead.service';
import type { ApiResponse } from '../types';

export const getLeads = async (req: Request, res: Response) => {
  try {
    const query = (req.query.query as string) || '';
    const status = (req.query.status as string) || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { leads, total } = await leadService.getLeads(query, status, page, limit);

    res.status(200).json({
      success: true,
      message: 'Leads fetched successfully',
      data: {
        items: leads,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    } satisfies ApiResponse);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    } satisfies ApiResponse);
  }
};

export const getLeadById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const lead = await leadService.getLeadById(id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found',
      } satisfies ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Lead fetched successfully',
      data: lead,
    } satisfies ApiResponse);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    } satisfies ApiResponse);
  }
};

export const createLead = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, company, source, status, assignedTo, address, notes } = req.body;

    if (!fullName) {
      res.status(400).json({
        success: false,
        message: 'Full Name is required',
      } satisfies ApiResponse);
      return;
    }

    const newLead = await leadService.createLead({
      fullName,
      email,
      phone,
      company,
      source,
      status,
      assignedTo: assignedTo || null,
      address,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: newLead,
    } satisfies ApiResponse);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    } satisfies ApiResponse);
  }
};

export const updateLead = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { fullName, email, phone, company, source, status, assignedTo, address, notes } = req.body;

    if (!fullName) {
      res.status(400).json({
        success: false,
        message: 'Full Name is required',
      } satisfies ApiResponse);
      return;
    }

    const updatedLead = await leadService.updateLead(id, {
      fullName,
      email,
      phone,
      company,
      source,
      status,
      assignedTo: assignedTo || null,
      address,
      notes,
    });

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead,
    } satisfies ApiResponse);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    } satisfies ApiResponse);
  }
};

