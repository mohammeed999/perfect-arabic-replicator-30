
import React, { useState } from 'react';
import { useEmployeeContext } from '@/context/EmployeeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Employee } from '@/types/employee';

interface SetSalaryFormProps {
  employee: Employee;
  onClose: () => void;
}

const SetSalaryForm = ({ employee, onClose }: SetSalaryFormProps) => {
  const { updateEmployee } = useEmployeeContext();
  const { toast } = useToast();
  const [salary, setSalary] = useState(employee.monthlySalary?.toString() || '');
  
  const handleSubmit = async () => {
    if (salary && !isNaN(Number(salary))) {
      const salaryNum = Number(salary);
      
      if (salaryNum < 0) {
        toast({
          title: "خطأ في الإدخال",
          description: "يرجى إدخال راتب صحيح",
          variant: "destructive"
        });
        return;
      }
      
      const updatedEmployee = {
        ...employee,
        monthlySalary: salaryNum
      };
      
      await updateEmployee(updatedEmployee);
      
      toast({
        title: "تم التحديث",
        description: "تم تحديث الراتب الشهري بنجاح"
      });
      
      onClose();
    } else {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى إدخال راتب صحيح",
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
          value={employee.name} 
          disabled 
          className="w-full mt-1 text-right"
          dir="rtl"
        />
      </div>

      <div>
        <Label htmlFor="salary">الراتب الشهري (جنيه)</Label>
        <Input 
          id="salary" 
          type="number" 
          value={salary} 
          onChange={(e) => setSalary(e.target.value)}
          className="w-full mt-1 text-right"
          dir="rtl"
          placeholder="أدخل الراتب الشهري"
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onClose} variant="outline" className="bg-gray-500 text-white hover:bg-gray-600">
          إلغاء
        </Button>
        <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600">
          تحديث الراتب
        </Button>
      </div>
    </div>
  );
};

export default SetSalaryForm;
