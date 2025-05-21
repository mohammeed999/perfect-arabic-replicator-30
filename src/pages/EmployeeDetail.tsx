
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const EmployeeDetail = () => {
  const { id } = useParams();
  const { employees } = useAppContext();
  const navigate = useNavigate();
  
  // البحث عن الموظف بناءً على المعرف
  const employee = employees.find(emp => emp.id === id);
  
  // إذا لم يتم العثور على الموظف، يتم العودة إلى صفحة العمال
  useEffect(() => {
    if (!employee) {
      navigate('/employees');
    }
  }, [employee, navigate]);
  
  if (!employee) return null;

  return (
    <div className="container mx-auto px-4 py-6 dir-rtl" style={{ direction: 'rtl' }}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate('/employees')}
            className="flex items-center gap-1"
          >
            <ArrowRight size={18} />
            العودة
          </Button>
          <h1 className="text-2xl font-bold">تفاصيل العامل: {employee.name}</h1>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">المعلومات الأساسية</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">الاسم</p>
                <p className="font-medium">{employee.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">القسم</p>
                <p className="font-medium">{employee.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">الحالة</p>
                <p className="font-medium">
                  <span className="inline-block px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800">
                    {employee.status || "متاح"}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">بيانات الإنتاج</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">إجمالي الإنتاج</p>
                <p className="font-medium">{employee.production} قطعة</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">إنتاج الشهر</p>
                <p className="font-medium">{employee.monthlyProduction} قطعة</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">الهدف اليومي</p>
                <p className="font-medium">{employee.dailyTarget} قطعة</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">نسبة المكافأة</p>
                <p className="font-medium">{employee.bonusPercentage}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
