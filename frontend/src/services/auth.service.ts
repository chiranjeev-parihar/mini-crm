import { post } from './api';
import type { ApiResponse, LoginCredentials, LoginResponse } from '../types';

/**
 * Authenticate user with email and password.
 * Returns JWT token and user data on success.
 */
export async function loginApi(
  credentials: LoginCredentials
): Promise<ApiResponse<LoginResponse>> {
  return post<ApiResponse<LoginResponse>>('/auth/login', credentials);
}
