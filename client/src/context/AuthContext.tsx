import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AuthResponseData,
  LoginPayload,
  RegisterPayload,
  User,
  getCurrentUser,
  loginCitizen,
  logoutUser,
  registerCitizen,
} from "../api";
import {
  clearStoredAuth,
  getStoredAccessToken,
  getStoredUser,
  setStoredAccessToken,
  setStoredUser,
} from "../utils/storage";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginPayload) => Promise<AuthResponseData>;
  register: (data: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authenticated session from SecureStore on startup
  const initializeAuth = useCallback(async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        getStoredAccessToken(),
        getStoredUser<User>(),
      ]);

      if (storedToken) {
        setAccessToken(storedToken);
        if (storedUser) {
          setUser(storedUser);
        }

        // Validate session with backend
        try {
          const profileResponse = await getCurrentUser();
          if (profileResponse.data) {
            setUser(profileResponse.data);
            await setStoredUser(profileResponse.data);
          }
        } catch {
          // If token is invalid or expired, storage will be cleared by interceptor
        }
      }
    } catch {
      // Continue without session if storage access errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (credentials: LoginPayload): Promise<AuthResponseData> => {
    setIsLoading(true);
    try {
      const response = await loginCitizen(credentials);
      if (!response.data) {
        throw new Error(response.message || "Failed to sign in");
      }

      const { accessToken: token, user: authUser } = response.data;

      // Securely store token and user in SecureStore (no localStorage)
      await Promise.all([
        setStoredAccessToken(token),
        setStoredUser(authUser),
      ]);

      setAccessToken(token);
      setUser(authUser);

      return response.data;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterPayload): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await registerCitizen(data);
      if (!response.data) {
        throw new Error(response.message || "Failed to create account");
      }
      return response.data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await logoutUser().catch(() => {});
    } finally {
      await clearStoredAuth();
      setAccessToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  const refreshSession = async (): Promise<User | null> => {
    try {
      const response = await getCurrentUser();
      if (response.data) {
        setUser(response.data);
        await setStoredUser(response.data);
        return response.data;
      }
      return null;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!accessToken,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
