
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';

const Navbar = () => {
  const { getCurrentDate } = useAppContext();
  
  return (
    <div className="w-full py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="text-right mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-blue-600">مصنع فيبوس للجرابات</h1>
          <p className="text-gray-600">{getCurrentDate()}</p>
        </div>
        
        <nav className="flex gap-4 text-gray-700">
          <Link to="/" className="py-2 px-4 rounded-md hover:bg-blue-100 transition-colors">
            الرئيسية
          </Link>
          <Link to="/employees" className="py-2 px-4 rounded-md hover:bg-blue-100 transition-colors">
            العمال
          </Link>
          <Link to="/orders" className="py-2 px-4 rounded-md hover:bg-blue-100 transition-colors">
            الطلبات
          </Link>
          <Link to="/analysis" className="py-2 px-4 rounded-md hover:bg-blue-100 transition-colors">
            تحليل البيانات
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
