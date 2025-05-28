
import React, { useState } from 'react';
import { useOrderContext } from '@/context/OrderContext';
import { useEmployeeContext } from '@/context/EmployeeContext';
import { useProductionContext } from '@/context/ProductionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface AddProductionFormProps {
  employeeId: string;
  onClose: () => void;
}

const AddProductionForm = ({ employeeId, onClose }: AddProductionFormProps) => {
  const { orders } = useOrderContext();
  const { employees } = useEmployeeContext();
  const { addProductionRecord } = useProductionContext();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState('');
  const [orderId, setOrderId] = useState('');
  
  const employee = employees.find(emp => emp.id === employeeId);
  
  // Get eligible orders (either current order or all orders)
  const eligibleOrders = employee?.currentOrder 
    ? orders.filter(order => order.id === employee.currentOrder || (order.assignedWorkers || []).includes(employeeId))
    : orders.filter(order => order.status !== 'completed');
  
  const handleSubmit = () => {
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
      
      addProductionRecord(employeeId, quantityNum, orderId);
      onClose();
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
        <Select onValueChange={setOrderId}>
          <SelectTrigger>
            <SelectValue placeholder="-- اختر الطلب --" />
          </SelectTrigger>
          <SelectContent>
            {eligibleOrders.map((order) => (
              <SelectItem key={order.id} value={order.id}>
                {order.client} - {order.product.name}
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
