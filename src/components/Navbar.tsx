
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LogOut,
  Menu,
  X,
  User,
  Home,
  Users,
  FileText,
  BarChart
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const location = useLocation();
  const { logout, user, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                نظام إدارة الإنتاج
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:mr-6 md:flex md:space-x-8 md:space-x-reverse">
              <Link
                to="/"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                  isActive('/')
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                <Home size={16} className="ml-1" />
                لوحة المراقبة
              </Link>
              <Link
                to="/employees"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                  isActive('/employees')
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                <Users size={16} className="ml-1" />
                العمال
              </Link>
              <Link
                to="/orders"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                  isActive('/orders')
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                <FileText size={16} className="ml-1" />
                الطلبات
              </Link>
              <Link
                to="/analysis"
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                  isActive('/analysis')
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                <BarChart size={16} className="ml-1" />
                التحليل
              </Link>
            </div>
          </div>

          {/* User Profile / Mobile Menu Toggle */}
          <div className="flex items-center">
            {/* User Profile - Desktop */}
            <div className="hidden md:flex md:items-center">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleProfile}
                  className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 rounded-full px-3 py-2"
                >
                  <span className="text-sm font-medium">
                    {user?.name || 'المستخدم'}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                    <User size={18} />
                  </div>
                </Button>
                
                {isProfileOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'مدير النظام' : 'مستخدم'}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      disabled={isLoading}
                    >
                      <LogOut size={16} className="ml-2" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                className="p-1"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                isActive('/')
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={18} className="ml-2" />
              لوحة المراقبة
            </Link>
            <Link
              to="/employees"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                isActive('/employees')
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <Users size={18} className="ml-2" />
              العمال
            </Link>
            <Link
              to="/orders"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                isActive('/orders')
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText size={18} className="ml-2" />
              الطلبات
            </Link>
            <Link
              to="/analysis"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                isActive('/analysis')
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart size={18} className="ml-2" />
              التحليل
            </Link>
          </div>
          
          {/* User info in mobile menu */}
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="px-4 flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                  <User size={20} />
                </div>
              </div>
              <div className="mr-3">
                <div className="text-base font-medium text-gray-800">{user?.name}</div>
                <div className="text-sm font-medium text-gray-500">{user?.role === 'admin' ? 'مدير النظام' : 'مستخدم'}</div>
              </div>
            </div>
            <div className="mt-3 px-2">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md"
                disabled={isLoading}
              >
                <LogOut size={16} className="ml-2" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
