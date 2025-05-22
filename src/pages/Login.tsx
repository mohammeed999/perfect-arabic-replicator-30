
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated, isLoading } = useAuth();

  // التحقق إذا كان المستخدم مسجل دخوله بالفعل
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // التحقق من إدخال البيانات المطلوبة
    if (!username.trim()) {
      setFormError('يرجى إدخال اسم المستخدم');
      return;
    }
    
    if (!password.trim()) {
      setFormError('يرجى إدخال كلمة المرور');
      return;
    }

    try {
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في نظام الإدارة",
          variant: "default",
        });
        navigate('/');
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "اسم المستخدم أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
        setFormError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ أثناء محاولة تسجيل الدخول",
        variant: "destructive",
      });
      setFormError('حدث خطأ أثناء محاولة تسجيل الدخول');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50" dir="rtl">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">نظام إدارة الإنتاج</h1>
          <p className="text-gray-600">تسجيل الدخول للوصول إلى لوحة التحكم</p>
        </div>
        
        <Card className="w-full shadow-lg border-t-4 border-t-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-center">تسجيل الدخول</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium">اسم المستخدم</label>
                <Input
                  id="username"
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-right"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">كلمة المرور</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-right"
                  disabled={isLoading}
                />
              </div>
              
              {formError && (
                <div className="text-sm font-medium text-destructive text-right">
                  {formError}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري تسجيل الدخول...
                  </span>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-500 pt-0">
            <p className="w-full">اسم المستخدم الافتراضي: admin | كلمة المرور: admin123</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
