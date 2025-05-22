
import React from 'react';
import { useAppContext, Employee } from '@/context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { X, Plus } from 'lucide-react';
import AddProductionForm from './AddProductionForm';
import { Separator } from '@/components/ui/separator';

interface EmployeeDetailsProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee, isOpen, onClose }) => {
  const { orders, getEmployeeProductionHistory } = useAppContext();
  const [isAddingProduction, setIsAddingProduction] = React.useState(false);
  
  // Get orders assigned to this employee
  const employeeOrders = orders.filter(order => 
    order.assignedWorkers?.includes(employee.id)
  );
  
  const currentOrderId = employee.currentOrder;
  const currentOrder = orders.find(order => order.id === currentOrderId);
  
  // Get employee production history
  const productionHistory = getEmployeeProductionHistory(employee.id);

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
      
      return { 
        total: regularBonus + extraBonus,
        regular: regularBonus,
        extra: extraBonus,
        hasExtra: true
      };
    }
    
    return { 
      total: baseBonus,
      regular: baseBonus,
      extra: 0,
      hasExtra: false
    };
  };

  const bonus = calculateBonus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] text-right" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <div>{employee.name}</div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="text-sm text-gray-600">القسم</h3>
            <p className="font-semibold">{employee.department}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="text-sm text-gray-600">إجمالي الإنتاج</h3>
            <p className="font-semibold">{employee.production}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="text-sm text-gray-600">نسبة المكافأة</h3>
            <p className="font-semibold">{employee.bonusPercentage}%</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-yellow-50 p-4 rounded">
            <h3 className="text-sm text-gray-600">الهدف اليومي</h3>
            <p className="font-semibold">{employee.dailyTarget} قطعة</p>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="text-sm text-gray-600">الأداء الشهري</h3>
            <p className="font-semibold">{employee.monthlyProduction} قطعة</p>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded mb-4">
          <h3 className="text-sm text-gray-600">المكافأة المستحقة</h3>
          <p className="font-semibold text-green-700">{bonus.total} جنيه</p>
          {bonus.hasExtra && (
            <div className="text-xs text-green-600 mt-1">
              <p>المكافأة الأساسية: {bonus.regular} جنيه</p>
              <p>مكافأة إضافية: {bonus.extra} جنيه (للإنتاج الزائد)</p>
            </div>
          )}
        </div>
        
        <Separator className="my-2 bg-gray-300" />
        
        {currentOrder && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">الحالة الحالية</h3>
            <div className="bg-amber-50 p-4 rounded">
              <h4 className="text-sm text-gray-600">حالة العامل</h4>
              <p className="font-medium">
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800 my-1">
                  {employee.status || 'متاح'}
                </span>
              </p>
              
              <div className="mt-2">
                <h4 className="text-sm text-gray-600">
                  {currentOrder.client} - {currentOrder.product.name}
                </h4>
                <p className="font-medium">
                  {currentOrder.completionPercentage}% من أصل {currentOrder.totalQuantity} قطعة
                </p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${currentOrder.completionPercentage}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">سجل الإنتاج الشهري</h3>
            <Button 
              className="bg-green-500 hover:bg-green-600 gap-1" 
              size="sm"
              onClick={() => setIsAddingProduction(true)}
            >
              <Plus size={16} /> إضافة إنتاج
            </Button>
          </div>
          <p className="text-gray-600 text-sm mb-3">({employee.monthlyProduction} قطعة)</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-3 text-right">التاريخ</th>
                  <th className="py-2 px-3 text-right">الطلب</th>
                  <th className="py-2 px-3 text-right">الكمية</th>
                </tr>
              </thead>
              <tbody>
                {productionHistory.length > 0 ? (
                  productionHistory.map(record => (
                    <tr key={record.id} className="border-b border-gray-100">
                      <td className="py-2 px-3">{record.date}</td>
                      <td className="py-2 px-3">{record.orderDetails}</td>
                      <td className="py-2 px-3 font-medium">{record.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-500">
                      لا توجد سجلات إنتاج
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="text-center mt-4">
            <Link to={`/employees/${employee.id}`}>
              <Button variant="outline" className="w-full text-blue-600" onClick={onClose}>
                عرض التفاصيل الكاملة
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
      
      {isAddingProduction && (
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
      )}
    </Dialog>
  );
};

export default EmployeeDetails;
