/** User role enum matching backend */
export type UserRole = 'ADMIN' | 'SALES_MANAGER' | 'SALES_EXECUTIVE';

/** User object returned from the API (never includes password) */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/** Standard API response wrapper */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

/** Login request body */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Login API response data */
export interface LoginResponse {
  token: string;
  user: User;
}

/** Auth state shape for the context */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
