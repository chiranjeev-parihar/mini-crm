import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';
import type { ApiResponse } from '../types';

/**
 * Authentication middleware.
 * Validates the JWT Bearer token from the Authorization header.
 * Attaches decoded user payload to `req.user` on success.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      } satisfies ApiResponse);
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.',
      } satisfies ApiResponse);
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Access denied. Token is invalid or expired.',
    } satisfies ApiResponse);
  }
};
