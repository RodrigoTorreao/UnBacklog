import { createContext, useEffect, useState, type ReactNode } from "react";
import { getUserInfo, login, logout, register} from "../api/authApi";


interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleLogout: () => void;
  handleRegister: (email: string, password: string, name: string) => Promise<void>;
}


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  handleLogin: async () => {},
  handleLogout: () => {},
  handleRegister: async () => {}
});

export const AuthProvider = ({ children } : AuthProviderProps ) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await getUserInfo();
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    const res = await getUserInfo();
    setUser(res.data);
  };

    const handleRegister = async (email: string, password: string, name:string) => {
    await register(email, password, name);
    const res = await getUserInfo();
    setUser(res.data);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleLogin, handleLogout, handleRegister}}>
      {children}
    </AuthContext.Provider>
  );
};
