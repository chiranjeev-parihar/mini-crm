import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials } from '../types';
import { loginApi } from '../services/auth.service';
import { getStoredToken, setStoredToken, removeStoredToken } from '../services/api';

/** Shape of the auth context value */
export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Decode a JWT payload without verifying the signature.
 * Used only to check token expiry on the client side.
 */
function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Check whether a token has expired based on its `exp` claim.
 */
function isTokenExpired(token: string): boolean {
  const payload = decodeTokenPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  // Compare exp (seconds) with current time (milliseconds / 1000)
  return payload.exp * 1000 < Date.now();
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, rehydrate auth state from localStorage
  useEffect(() => {
    const storedToken = getStoredToken();

    if (storedToken && !isTokenExpired(storedToken)) {
      const payload = decodeTokenPayload(storedToken);
      if (payload) {
        setToken(storedToken);
        setUser({
          id: payload.id as string,
          email: payload.email as string,
          role: payload.role as User['role'],
          name: (payload.name as string) || payload.email as string,
        });
      }
    } else if (storedToken) {
      // Token exists but is expired — clean up
      removeStoredToken();
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await loginApi(credentials);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Login failed');
    }

    const { token: newToken, user: newUser } = response.data;

    // Persist token
    setStoredToken(newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    removeStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
