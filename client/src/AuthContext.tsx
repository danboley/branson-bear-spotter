import React, { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  userId: string | null;
  isAdmin: boolean;
  login: (data: { token: string; userId: string; isAdmin: boolean }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const storedIsAdmin = localStorage.getItem("isAdmin");
      return storedIsAdmin ? JSON.parse(storedIsAdmin) : false;
    } catch (error) {
      console.error("Failed to parse isAdmin from localStorage:", error);
      return false;
    }
  });

  const login = (data: { token: string; userId: string; isAdmin: boolean }) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("isAdmin", JSON.stringify(data.isAdmin));
    setToken(data.token);
    setUserId(data.userId);
    setIsAdmin(data.isAdmin);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    setToken(null);
    setUserId(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ token, userId, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
