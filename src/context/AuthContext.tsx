
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// حساب المسؤول الافتراضي
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
  name: 'المدير',
  role: 'admin'
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string; name: string; role: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string; name: string; role: string } | null>(null);

  // التحقق من حالة تسجيل الدخول عند بدء التطبيق
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setIsAuthenticated(true);
        setUser(authData);
      } catch (error) {
        // في حالة حدوث خطأ، قم بمسح التخزين المحلي
        localStorage.removeItem('auth');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // التحقق من صحة بيانات تسجيل الدخول
    if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
      const userData = {
        username: DEFAULT_ADMIN.username,
        name: DEFAULT_ADMIN.name,
        role: DEFAULT_ADMIN.role
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // حفظ بيانات المستخدم في التخزين المحلي
      localStorage.setItem('auth', JSON.stringify(userData));
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
