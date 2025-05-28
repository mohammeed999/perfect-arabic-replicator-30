
import React, { useState } from 'react';
import { useOrderContext } from '@/context/OrderContext';
import { useEmployeeContext } from '@/context/EmployeeContext';
import { useProductionContext } from '@/context/ProductionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AddProductionFormProps {
  employeeId: string;
  onClose: () => void;
}

const AddProductionForm = ({ employeeId, onClose }: AddProductionFormProps) => {
  const { orders, updateOrder } = useOrderContext();
  const { employees } = useEmployeeContext();
  const { addProductionRecord } = useProductionContext();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState('');
  const [orderId, setOrderId] = useState('');
  
  const employee = employees.find(emp => emp.id === employeeId);
  
  // التحقق من أن العامل ليس غائب
  if (employee?.status === 'غائب') {
    return (
      <div className="space-y-4 text-center">
        <div className="p-4 bg-red-50 rounded border border-red-200">
          <p className="text-red-600">لا يمكن إضافة إنتاج للعامل الغائب</p>
        </div>
        <Button onClick={onClose} variant="outline">
          إغلاق
        </Button>
      </div>
    );
  }
  
  // Get eligible orders - prioritize current assigned order
  const getEligibleOrders = () => {
    if (employee?.currentOrder) {
      // إذا كان العامل مكلف بطلب، أعطي الأولوية لهذا الطلب
      const currentOrder = orders.find(order => order.id === employee.currentOrder);
      const otherOrders = orders.filter(order => 
        order.id !== employee.currentOrder && 
        order.status !== 'completed'
      );
      return currentOrder ? [currentOrder, ...otherOrders] : otherOrders;
    }
    return orders.filter(order => order.status !== 'completed');
  };
  
  const eligibleOrders = getEligibleOrders();
  
  // تعيين الطلب الحالي كافتراضي إذا كان العامل مكلف بطلب
  React.useEffect(() => {
    if (employee?.currentOrder && !orderId) {
      setOrderId(employee.currentOrder);
    }
  }, [employee?.currentOrder, orderId]);
  
  const handleSubmit = async () => {
    if (quantity && orderId) {
      const quantityNum = parseInt(quantity);
      
      if (isNaN(quantityNum) || quantityNum <= 0) {
        toast({
          title: "خطأ في الإدخال",
          description: "يرجى إدخال كمية صحيحة",
          variant: "destructive"
        });
        return;
      }
      
      try {
        // إضافة سجل الإنتاج
        await addProductionRecord(employeeId, quantityNum, orderId);
        
        // تحديث نسبة إنجاز الطلب
        const order = orders.find(o => o.id === orderId);
        if (order) {
          // حساب إجمالي الإنتاج لهذا الطلب من جميع العمال
          const currentProduction = order.completionPercentage || 0;
          const newCompletionPercentage = Math.min(
            Math.round(((currentProduction / 100 * order.totalQuantity) + quantityNum) / order.totalQuantity * 100),
            100
          );
          
          const updatedOrder = {
            ...order,
            completionPercentage: newCompletionPercentage,
            status: newCompletionPercentage >= 100 ? 'completed' as const : order.status
          };
          
          await updateOrder(updatedOrder);
        }
        
        toast({
          title: "تم بنجاح",
          description: `تم إضافة ${quantityNum} قطعة للطلب وتحديث نسبة الإنجاز`
        });
        onClose();
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ في إضافة سجل الإنتاج",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="employee">العامل</Label>
        <Input 
          id="employee" 
          value={employee?.name || ''} 
          disabled 
          className="w-full mt-1 text-right"
          dir="rtl"
        />
      </div>

      <div>
        <Label htmlFor="order">الطلب</Label>
        <Select value={orderId} onValueChange={setOrderId}>
          <SelectTrigger>
            <SelectValue placeholder="-- اختر الطلب --" />
          </SelectTrigger>
          <SelectContent>
            {eligibleOrders.map((order, index) => (
              <SelectItem key={order.id} value={order.id}>
                {order.client} - {order.product.name}
                {index === 0 && employee?.currentOrder === order.id && ' (الطلب الحالي)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="quantity">الكمية المنتجة</Label>
        <Input 
          id="quantity" 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full mt-1 text-right"
          dir="rtl"
          min="1"
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onClose} variant="outline" className="bg-gray-500 text-white hover:bg-gray-600">
          إلغاء
        </Button>
        <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600">
          إضافة الإنتاج
        </Button>
      </div>
    </div>
  );
};

export default AddProductionForm;
