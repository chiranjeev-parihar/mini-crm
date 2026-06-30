import { Request, Response } from 'express';
import { findUserByEmail, validatePassword, generateToken } from '../services/auth.service';
import type { LoginRequest, LoginResponse, ApiResponse } from '../types';

/**
 * POST /api/auth/login
 * Authenticates user with email and password, returns JWT token.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequest;

    // Validate request body
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      } satisfies ApiResponse);
      return;
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      } satisfies ApiResponse);
      return;
    }

    // Validate password
    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      } satisfies ApiResponse);
      return;
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Return token and user data (never expose password)
    const response: ApiResponse<LoginResponse> = {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    } satisfies ApiResponse);
  }
};
