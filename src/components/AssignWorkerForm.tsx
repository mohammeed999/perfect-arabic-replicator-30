
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
  const { getAvailableEmployees, assignEmployeeToOrder, orders, updateOrder, departments } = useAppContext();
  const { toast } = useToast();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  
  // فلترة العمال المتاحين فقط (حاضر وليس لديه طلب حالي)
  const availableEmployees = getAvailableEmployees().filter(emp => 
    emp.status === 'متاح' || (emp.status !== 'غائب' && !emp.currentOrder)
  );
  
  // فلترة العمال حسب القسم المختار
  const filteredEmployees = selectedDepartment 
    ? availableEmployees.filter(emp => emp.department === selectedDepartment)
    : availableEmployees;
  
  const order = orders.find(o => o.id === orderId);
  
  const handleSubmit = async () => {
    if (selectedEmployeeId && order) {
      try {
        // تكليف العامل بالطلب
        await assignEmployeeToOrder(selectedEmployeeId, orderId);
        
        // تحديث حالة الطلب إلى "قيد التنفيذ"
        const updatedOrder = {
          ...order,
          status: 'in-progress' as const,
          assignedWorkers: [...(order.assignedWorkers || []), selectedEmployeeId]
        };
        await updateOrder(updatedOrder);
        
        toast({
          title: "تم التكليف",
          description: `تم تكليف العامل بالطلب ${order.client} وتم تحديث حالة الطلب إلى قيد التنفيذ`
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
        <Label htmlFor="department">القسم (اختياري)</Label>
        <Select onValueChange={setSelectedDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="-- جميع الأقسام --" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">جميع الأقسام</SelectItem>
            {departments.map((department) => (
              <SelectItem key={department.id} value={department.name}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="employee">العامل المتاح</Label>
        <Select onValueChange={setSelectedEmployeeId}>
          <SelectTrigger>
            <SelectValue placeholder="-- اختر العامل --" />
          </SelectTrigger>
          <SelectContent>
            {filteredEmployees.length === 0 ? (
              <SelectItem value="none" disabled>
                {selectedDepartment ? `لا يوجد عمال متاحون في قسم ${selectedDepartment}` : 'لا يوجد عمال متاحون'}
              </SelectItem>
            ) : (
              filteredEmployees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name} - {employee.department} (متاح)
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
          disabled={!selectedEmployeeId || filteredEmployees.length === 0}
        >
          تكليف العامل
        </Button>
      </div>
    </div>
  );
};

export default AssignWorkerForm;
