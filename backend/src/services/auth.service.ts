import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import type { AuthPayload } from '../types';

/**
 * Find a user by email address.
 */
export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

/**
 * Compare a plain-text password against a bcrypt hash.
 */
export const validatePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Generate a signed JWT containing the user payload.
 */
export const generateToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as unknown as import('ms').StringValue,
  });
};

/**
 * Verify and decode a JWT. Returns the payload or throws on invalid token.
 */
export const verifyToken = (token: string): AuthPayload => {
  return jwt.verify(token, env.jwtSecret) as AuthPayload;
};
