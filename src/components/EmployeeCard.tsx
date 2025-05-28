
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import AddProductionForm from './AddProductionForm';
import SetSalaryForm from './SetSalaryForm';
import { Employee } from '@/types/employee';

interface EmployeeCardProps {
  employee: Employee;
  onEditClick: (employee: Employee) => void;
  onDeleteClick?: (employeeId: string) => void;
}

const EmployeeCard = ({ employee, onEditClick, onDeleteClick }: EmployeeCardProps) => {
  const { calculateEmployeeBonus } = useAppContext();
  const [isProductionDialogOpen, setIsProductionDialogOpen] = useState(false);
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false);
  
  const handleDelete = () => {
    if (onDeleteClick && window.confirm(`هل أنت متأكد من حذف العامل ${employee.name}؟`)) {
      onDeleteClick(employee.id);
    }
  };

  const bonus = calculateEmployeeBonus(employee);
  const performancePercentage = employee.dailyTarget > 0 ? 
    Math.round((employee.production / employee.dailyTarget) * 100) : 0;

  // تحديد حالة العامل بشكل صحيح
  const getEmployeeStatus = () => {
    if (employee.status === 'غائب') return 'غائب';
    if (employee.currentOrder) return `يعمل في طلب ${employee.currentOrder}`;
    return 'حاضر';
  };

  const status = getEmployeeStatus();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border" dir="rtl">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{employee.name}</h3>
        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
          status === 'حاضر' ? 'bg-green-100 text-green-800' :
          status === 'غائب' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {status}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div>
          <p className="text-sm text-gray-600">القسم</p>
          <p className="font-medium">{employee.department}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">الهدف اليومي</p>
          <p className="font-medium">{employee.dailyTarget}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">الإنتاج الحالي</p>
          <p className="font-medium">{employee.production}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">الراتب الشهري</p>
          <p className="font-medium">{employee.monthlySalary || 0} جنيه</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">المكافأة المحتملة</p>
          <p className="font-medium text-green-600">{bonus} جنيه</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">نسبة الأداء</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-full rounded-full ${
                  performancePercentage >= 100 ? 'bg-green-500' : 
                  performancePercentage >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(performancePercentage, 100)}%` }} 
              />
            </div>
            <span className="text-sm font-medium">{performancePercentage}%</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={() => onEditClick(employee)} 
          variant="outline" 
          size="sm"
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          تعديل
        </Button>
        
        <Dialog open={isProductionDialogOpen} onOpenChange={setIsProductionDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              إضافة إنتاج
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة إنتاج جديد</DialogTitle>
            </DialogHeader>
            <AddProductionForm 
              employeeId={employee.id} 
              onClose={() => setIsProductionDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isSalaryDialogOpen} onOpenChange={setIsSalaryDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              تحديد الراتب
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
            <DialogHeader>
              <DialogTitle>تحديد الراتب الشهري</DialogTitle>
            </DialogHeader>
            <SetSalaryForm 
              employee={employee} 
              onClose={() => setIsSalaryDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
        
        {onDeleteClick && (
          <Button 
            onClick={handleDelete} 
            variant="outline" 
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            حذف
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;
