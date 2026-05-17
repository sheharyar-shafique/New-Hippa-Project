import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api, AuthedUser, getToken, setToken } from './api';

type AuthCtx = {
  user: AuthedUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthedUser>;
  verify2fa: (tempToken: string, code: string) => Promise<AuthedUser>;
  signup: (input: SignupInput) => Promise<AuthedUser>;
  logout: () => void;
  refresh: () => Promise<void>;
};

type SignupInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  preferredLang?: 'en' | 'es';
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthedUser | null>(null);
  const [loading, setLoading] = useState<boolean>(!!getToken());

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user } = await api.get<{ user: AuthedUser }>('/auth/me');
      setUser(user);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<any>('/auth/login', { email, password });
    if (res.requires2fa) {
      // Throw a special error that the Login page can catch
      const err: any = new Error('2FA required');
      err.requires2fa = true;
      err.tempToken = res.tempToken;
      throw err;
    }
    setToken(res.token);
    setUser(res.user);
    return res.user as AuthedUser;
  }, []);

  const verify2fa = useCallback(async (tempToken: string, code: string) => {
    const { user, token } = await api.post<{ user: AuthedUser; token: string }>(
      '/auth/2fa/verify',
      { tempToken, code }
    );
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const signup = useCallback(async (input: SignupInput) => {
    const { user, token } = await api.post<{ user: AuthedUser; token: string }>(
      '/auth/signup',
      input
    );
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({ user, loading, login, verify2fa, signup, logout, refresh }),
    [user, loading, login, verify2fa, signup, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-500 text-sm">
        Loading…
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
