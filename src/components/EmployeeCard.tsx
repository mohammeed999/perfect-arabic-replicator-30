
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext, Employee } from '@/context/AppContext';
import EmployeeDetails from './EmployeeDetails';
import AddProductionForm from './AddProductionForm';

interface EmployeeCardProps {
  employee: Employee;
  onEditClick: (employee: Employee) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onEditClick }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddingProduction, setIsAddingProduction] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { updateEmployee } = useAppContext();
  const { toast } = useToast();

  // حساب المكافأة بناءً على تجاوز الهدف اليومي
  const calculateBonus = () => {
    const baseBonus = Math.round(employee.production * (employee.bonusPercentage / 100));
    
    // إذا تجاوز العامل هدفه اليومي، نحسب مكافأة إضافية للإنتاج الزائد
    if (employee.production > employee.dailyTarget) {
      const regularProduction = employee.dailyTarget;
      const extraProduction = employee.production - employee.dailyTarget;
      
      // المكافأة العادية + مكافأة إضافية (بنسبة 150% من النسبة العادية) للإنتاج الزائد
      const extraBonus = Math.round(extraProduction * (employee.bonusPercentage * 1.5 / 100));
      const regularBonus = Math.round(regularProduction * (employee.bonusPercentage / 100));
      
      return regularBonus + extraBonus;
    }
    
    return baseBonus;
  };

  const bonusAmount = calculateBonus();
  
  const handleDelete = () => {
    // حذف العامل (سيتم تنفيذه لاحقًا)
    setShowDeleteConfirm(false);
    toast({
      title: "تم حذف العامل",
      description: `تم حذف ${employee.name} بنجاح.`,
    });
  };

  const handleAddProduction = () => {
    setIsAddingProduction(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm" dir="rtl">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{employee.name}</h3>
        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
          employee.status === 'غائب' ? 'bg-red-100 text-red-800' : 
          employee.status ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
        }`}>
          {employee.status || 'متاح'}
        </span>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">القسم</p>
        <p className="font-medium">{employee.department}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">إجمالي الإنتاج</p>
        <p className="font-medium">{employee.production}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">الهدف اليومي</p>
        <p className="font-medium">{employee.dailyTarget}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">إنتاج الشهر الحالي</p>
        <p className="font-medium">{employee.monthlyProduction}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">المكافأة ({employee.bonusPercentage}%)</p>
        <p className={`font-medium ${employee.production > employee.dailyTarget ? 'text-green-600' : ''}`}>
          {bonusAmount} جنيه
          {employee.production > employee.dailyTarget && 
            <span className="text-xs mr-2 text-green-600">(بمكافأة إضافية)</span>}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <Button 
          variant="outline" 
          className="flex-1 text-blue-600" 
          onClick={() => setIsDetailsOpen(true)}
        >
          عرض التفاصيل
        </Button>
        <Button 
          variant="outline" 
          className="bg-green-50 text-green-600 hover:bg-green-100"
          onClick={handleAddProduction}
        >
          <Plus size={16} className="ml-1" /> إنتاج
        </Button>
      </div>
      <div className="flex gap-2 mt-2">
        <Button 
          variant="outline" 
          className="flex-1 text-amber-600 hover:bg-amber-50"
          onClick={() => onEditClick(employee)}
        >
          <Edit size={16} className="ml-1" /> تعديل
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 text-red-600 hover:bg-red-50"
          onClick={() => setShowDeleteConfirm(true)}
        >
          <Trash2 size={16} className="ml-1" /> حذف
        </Button>
      </div>
      
      {/* نافذة تفاصيل العامل */}
      <EmployeeDetails 
        employee={employee} 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
      />
      
      {/* نافذة إضافة إنتاج */}
      <Dialog open={isAddingProduction} onOpenChange={setIsAddingProduction}>
        <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة إنتاج جديد</DialogTitle>
          </DialogHeader>
          <AddProductionForm 
            employeeId={employee.id} 
            onClose={() => setIsAddingProduction(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* نافذة تأكيد الحذف */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>هل أنت متأكد من حذف العامل {employee.name}؟</p>
            <p className="text-sm text-gray-500 mt-2">لا يمكن التراجع عن هذا الإجراء.</p>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setShowDeleteConfirm(false)} variant="outline">
              إلغاء
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeCard;
