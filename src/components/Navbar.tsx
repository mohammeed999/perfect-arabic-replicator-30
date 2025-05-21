
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';

const Navbar = () => {
  const { getCurrentDate } = useAppContext();
  const location = useLocation();
  
  return (
    <div className="w-full py-4 bg-white shadow-sm">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between" dir="rtl">
        <div className="text-right mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-blue-600">مصنع فيبوس للجرابات</h1>
          <p className="text-gray-600">{getCurrentDate()}</p>
        </div>
        
        <nav className="flex gap-4 text-gray-700">
          <Link to="/" className={`py-2 px-4 rounded-md hover:bg-blue-100 transition-colors ${location.pathname === '/' ? 'bg-blue-100 font-medium' : ''}`}>
            الرئيسية
          </Link>
          <Link to="/employees" className={`py-2 px-4 rounded-md hover:bg-blue-100 transition-colors ${location.pathname === '/employees' ? 'bg-blue-100 font-medium' : ''}`}>
            العمال
          </Link>
          <Link to="/orders" className={`py-2 px-4 rounded-md hover:bg-blue-100 transition-colors ${location.pathname === '/orders' ? 'bg-blue-100 font-medium' : ''}`}>
            الطلبات
          </Link>
          <Link to="/analysis" className={`py-2 px-4 rounded-md hover:bg-blue-100 transition-colors ${location.pathname === '/analysis' ? 'bg-blue-100 font-medium' : ''}`}>
            تحليل البيانات
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
