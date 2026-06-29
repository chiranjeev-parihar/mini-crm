import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Placeholder protected route wrapper.
 * TODO: Implement actual authentication check.
 * Currently allows all access for development.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // const isAuthenticated = true; // Replace with real auth check
  // if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
