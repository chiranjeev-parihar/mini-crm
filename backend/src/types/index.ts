/** Standard API response wrapper */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

/** Paginated API response */
export interface PaginatedResponse<T = unknown> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** JWT token payload — embedded in every signed token */
export interface AuthPayload {
  id: string;
  email: string;
  role: 'ADMIN' | 'SALES_MANAGER' | 'SALES_EXECUTIVE';
}

/** Login request body */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Login response data */
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Extend Express Request to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
