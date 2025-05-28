
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AssignWorkerFormProps {
  orderId: string;
  onClose: () => void;
}

const AssignWorkerForm = ({ orderId, onClose }: AssignWorkerFormProps) => {
  const { getAvailableEmployees, assignEmployeeToOrder, orders } = useAppContext();
  const { toast } = useToast();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  
  const availableEmployees = getAvailableEmployees();
  const order = orders.find(o => o.id === orderId);
  
  const handleSubmit = async () => {
    if (selectedEmployeeId && order) {
      try {
        await assignEmployeeToOrder(selectedEmployeeId, orderId);
        
        toast({
          title: "تم التكليف",
          description: `تم تكليف العامل بالطلب ${order.client} بنجاح`
        });
        
        onClose();
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ في تكليف العامل",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى اختيار عامل",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="order">الطلب</Label>
        <div className="p-3 bg-gray-50 rounded border text-right">
          {order ? `${order.client} - ${order.product.name}` : 'طلب غير موجود'}
        </div>
      </div>

      <div>
        <Label htmlFor="employee">العامل المتاح</Label>
        <Select onValueChange={setSelectedEmployeeId}>
          <SelectTrigger>
            <SelectValue placeholder="-- اختر العامل --" />
          </SelectTrigger>
          <SelectContent>
            {availableEmployees.length === 0 ? (
              <SelectItem value="none" disabled>لا يوجد عمال متاحون</SelectItem>
            ) : (
              availableEmployees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name} - {employee.department}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onClose} variant="outline" className="bg-gray-500 text-white hover:bg-gray-600">
          إلغاء
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="bg-blue-500 hover:bg-blue-600"
          disabled={!selectedEmployeeId || availableEmployees.length === 0}
        >
          تكليف العامل
        </Button>
      </div>
    </div>
  );
};

export default AssignWorkerForm;
