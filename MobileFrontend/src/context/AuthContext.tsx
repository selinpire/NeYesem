import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { clearSession, getStoredSession, saveSession } from "../storage/authStorage";
import { setApiToken, setUnauthorizedHandler } from "../services/api";
import { navigateToLogin } from "../navigation/navigationRef";
import { AuthResponse, UserSummary } from "../types";

type AuthContextValue = {
  user: UserSummary | null;
  token: string | null;
  isHydrated: boolean;
  login: (payload: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: UserSummary) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      const stored = await getStoredSession();
      if (!mounted) {
        return;
      }

      if (stored) {
        setUser(stored.user);
        setToken(stored.token);
        setApiToken(stored.token);
      }
      setIsHydrated(true);
    }

    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      setUser(null);
      setToken(null);
      setApiToken(null);
      await clearSession();
      navigateToLogin();
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isHydrated,
      async login(payload) {
        const accessToken = payload.token || (payload as { accessToken?: string }).accessToken || "";
        setUser(payload.user);
        setToken(accessToken);
        setApiToken(accessToken);
        await saveSession(accessToken, payload.user);
      },
      async logout() {
        setUser(null);
        setToken(null);
        setApiToken(null);
        await clearSession();
      },
      async updateUser(nextUser) {
        setUser(nextUser);
        if (token) {
          await saveSession(token, nextUser);
        }
      },
    }),
    [isHydrated, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
