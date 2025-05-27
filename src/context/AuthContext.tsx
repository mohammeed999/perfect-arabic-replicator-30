
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// حساب المسؤول الافتراضي
// في بيئة الإنتاج يجب عدم تخزين بيانات المستخدمين في الكود
// وبدلاً من ذلك يجب استخدام قاعدة بيانات آمنة
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123', // في بيئة الإنتاج يجب تخزين تجزئة كلمة المرور (hash) وليس النص الصريح
  name: 'المدير',
  role: 'admin'
};

interface User {
  username: string; 
  name: string; 
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // التحقق من حالة تسجيل الدخول عند بدء التطبيق
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          setIsAuthenticated(true);
          setUser(authData);
        }
      } catch (error) {
        // في حالة حدوث خطأ، قم بمسح التخزين المحلي
        localStorage.removeItem('auth');
        console.error('خطأ في التحقق من المصادقة:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // في بيئة حقيقية، ستستخدم هذه الدالة لإرسال طلب إلى الخادم للتحقق من المصادقة
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    console.log('محاولة تسجيل الدخول مع:', { username, password });
    console.log('البيانات المطلوبة:', DEFAULT_ADMIN);
    
    // إضافة تأخير محاكاة لعملية التحقق من الخادم
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // التحقق من صحة بيانات تسجيل الدخول مع إزالة المسافات الإضافية
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      
      console.log('البيانات بعد التنظيف:', { trimmedUsername, trimmedPassword });
      
      if (trimmedUsername === DEFAULT_ADMIN.username && trimmedPassword === DEFAULT_ADMIN.password) {
        const userData = {
          username: DEFAULT_ADMIN.username,
          name: DEFAULT_ADMIN.name,
          role: DEFAULT_ADMIN.role
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        
        // حفظ بيانات المستخدم في التخزين المحلي
        localStorage.setItem('auth', JSON.stringify(userData));
        
        console.log('تم تسجيل الدخول بنجاح');
        return true;
      }
      
      console.log('فشل في تسجيل الدخول - بيانات خاطئة');
      return false;
    } catch (error) {
      console.error('خطأ في عملية تسجيل الدخول:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    
    // إضافة تأخير بسيط لتجربة مستخدم أفضل
    setTimeout(() => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('auth');
      setIsLoading(false);
    }, 300);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading
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
