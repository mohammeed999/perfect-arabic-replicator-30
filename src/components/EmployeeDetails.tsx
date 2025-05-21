
import React from 'react';
import { useAppContext, Employee, Order } from '@/context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EmployeeDetailsProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee, isOpen, onClose }) => {
  const { orders } = useAppContext();
  
  // Get orders assigned to this employee
  const employeeOrders = orders.filter(order => order.assignedTo === employee.id);
  
  const currentOrderId = employee.currentOrder;
  const currentOrder = orders.find(order => order.id === currentOrderId);

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
        
        {currentOrder && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">الحالة الحالية</h3>
            <div className="bg-amber-50 p-4 rounded">
              <h4 className="text-sm text-gray-600">حالة العامل</h4>
              <p className="font-medium">
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800 my-1">
                  {employee.status}
                </span>
              </p>
              
              <div className="mt-2">
                <h4 className="text-sm text-gray-600">
                  {currentOrder.client} - {currentOrder.product.name}
                </h4>
                <p className="font-medium">
                  {currentOrder.totalQuantity} من أصل {currentOrder.totalQuantity} قطعة
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-semibold mb-2">سجل الإنتاج الشهري</h3>
          <p className="text-gray-600 text-sm mb-3">أبريل ٢٠٢٥ ({employee.monthlyProduction} قطعة)</p>
          
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
                <tr>
                  <td className="py-2 px-3">٢٠٢٥/٠٥/٣٠</td>
                  <td className="py-2 px-3">شيخون - جراب أيفون 13</td>
                  <td className="py-2 px-3">120</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">٢٠٢٥/٠٥/٢٤</td>
                  <td className="py-2 px-3">شيخون - جراب أيفون 13</td>
                  <td className="py-2 px-3">150</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">٢٠٢٥/٠٥/٠٩</td>
                  <td className="py-2 px-3">شيخون - جراب أيفون 13</td>
                  <td className="py-2 px-3">200</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">٢٠٢٥/٠٥/٠٢</td>
                  <td className="py-2 px-3">الوزيري - جراب سامسونج S22</td>
                  <td className="py-2 px-3">180</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="text-center mt-4">
            <Button variant="outline" className="w-full text-blue-600" onClick={onClose}>
              عرض التفاصيل
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetails;
