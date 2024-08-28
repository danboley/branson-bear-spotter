import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactNode,
} from "react";

interface AuthContextType {
  token: string | null;
  userId: string | null;
  login: (data: { token: string; userId: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  //   const login = (data: { token: string; userId: string }) => {
  //     setToken(data.token);
  //     setUserId(data.userId);
  //   };
  const login = (data: { token: string; userId: string }) => {
    console.log("Login function called with data:", data);
    setToken(data.token);
    setUserId(data.userId);
    console.log("State updated: token:", data.token);
    console.log("State updated: userId:", data.userId);
  };

  useEffect(() => {
    console.log("AuthContext: Token and userId state changes", {
      token,
      userId,
    });
  }, [token, userId]);

  const logout = () => {
    setToken(null);
    setUserId(null);
    console.log("Logged out now.");
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
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
