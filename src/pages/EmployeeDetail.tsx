
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EmployeeDetail = () => {
  const { id } = useParams();
  const { employees, orders, departments, updateEmployee } = useAppContext();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<any>(null);
  
  // البحث عن الموظف بناءً على المعرف
  const employee = employees.find(emp => emp.id === id);
  
  // Get current order if assigned
  const currentOrder = orders.find(order => order.id === employee?.currentOrder);
  
  // Calculate bonus amount
  const bonusAmount = employee ? Math.round(employee.production * (employee.bonusPercentage / 100)) : 0;
  
  // إذا لم يتم العثور على الموظف، يتم العودة إلى صفحة العمال
  useEffect(() => {
    if (!employee) {
      navigate('/employees');
    } else if (!editedEmployee) {
      setEditedEmployee({ ...employee });
    }
  }, [employee, navigate, editedEmployee]);
  
  if (!employee) return null;

  const handleSaveChanges = () => {
    if (editedEmployee) {
      updateEmployee(editedEmployee);
      setIsEditing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6" dir="rtl">
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
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1"
          >
            <Edit size={16} />
            تعديل
          </Button>
        ) : (
          <Button 
            onClick={handleSaveChanges}
            className="bg-green-500 hover:bg-green-600"
          >
            حفظ التغييرات
          </Button>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">المعلومات الأساسية</h3>
            <div className="space-y-3">
              <div>
                {isEditing ? (
                  <>
                    <Label htmlFor="name">الاسم</Label>
                    <Input 
                      id="name" 
                      value={editedEmployee.name}
                      onChange={(e) => setEditedEmployee({...editedEmployee, name: e.target.value})}
                      className="mt-1"
                      dir="rtl"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">الاسم</p>
                    <p className="font-medium">{employee.name}</p>
                  </>
                )}
              </div>
              <div>
                {isEditing ? (
                  <>
                    <Label htmlFor="department">القسم</Label>
                    <Select 
                      value={editedEmployee.department} 
                      onValueChange={(value) => setEditedEmployee({...editedEmployee, department: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر القسم" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.name}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">القسم</p>
                    <p className="font-medium">{employee.department}</p>
                  </>
                )}
              </div>
              <div>
                {isEditing ? (
                  <>
                    <Label htmlFor="status">الحالة</Label>
                    <Select 
                      value={editedEmployee.status} 
                      onValueChange={(value) => setEditedEmployee({...editedEmployee, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">متاح</SelectItem>
                        <SelectItem value="غائب">غائب</SelectItem>
                        {currentOrder && (
                          <SelectItem value={`يعمل في طلب ${currentOrder.client}`}>
                            يعمل في طلب {currentOrder.client}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">الحالة</p>
                    <p className="font-medium">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                        employee.status === 'غائب' ? 'bg-red-100 text-red-800' : 
                        employee.status ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {employee.status || "متاح"}
                      </span>
                    </p>
                  </>
                )}
              </div>
              
              {currentOrder && (
                <div>
                  <p className="text-sm text-gray-600">الطلب الحالي</p>
                  <p className="font-medium">
                    <a 
                      href={`/orders/${currentOrder.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {currentOrder.client} - {currentOrder.product.name}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">بيانات الإنتاج</h3>
            <div className="space-y-3">
              <div>
                {isEditing ? (
                  <>
                    <Label htmlFor="production">إجمالي الإنتاج</Label>
                    <Input 
                      id="production" 
                      type="number"
                      value={editedEmployee.production}
                      onChange={(e) => setEditedEmployee({...editedEmployee, production: parseInt(e.target.value)})}
                      className="mt-1"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">إجمالي الإنتاج</p>
                    <p className="font-medium">{employee.production} قطعة</p>
                  </>
                )}
              </div>
              <div>
                {isEditing ? (
                  <>
                    <Label htmlFor="monthlyProduction">إنتاج الشهر</Label>
                    <Input 
                      id="monthlyProduction" 
                      type="number"
                      value={editedEmployee.monthlyProduction}
                      onChange={(e) => setEditedEmployee({...editedEmployee, monthlyProduction: parseInt(e.target.value)})}
                      className="mt-1"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">إنتاج الشهر</p>
                    <p className="font-medium">{employee.monthlyProduction} قطعة</p>
                  </>
                )}
              </div>
              <div>
                {isEditing ? (
                  <>
                    <Label htmlFor="dailyTarget">الهدف اليومي</Label>
                    <Input 
                      id="dailyTarget" 
                      type="number"
                      value={editedEmployee.dailyTarget}
                      onChange={(e) => setEditedEmployee({...editedEmployee, dailyTarget: parseInt(e.target.value)})}
                      className="mt-1"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">الهدف اليومي</p>
                    <p className="font-medium">{employee.dailyTarget} قطعة</p>
                  </>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">نسبة المكافأة</p>
                <p className="font-medium">{employee.bonusPercentage}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">المكافأة</p>
                <p className="font-medium">{bonusAmount} جنيه</p>
              </div>
              {employee.dailyTarget > 0 && (
                <div>
                  <p className="text-sm text-gray-600">نسبة تحقيق الهدف</p>
                  <div className="flex items-center mt-1">
                    <span className="ml-2">
                      {Math.min(Math.round((employee.production / employee.dailyTarget) * 100), 100)}%
                    </span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${Math.min(Math.round((employee.production / employee.dailyTarget) * 100), 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Order History Section (Could be added in future) */}
    </div>
  );
};

export default EmployeeDetail;
