
import React, { useState } from 'react';
import { useAppContext, Employee } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface EditEmployeeFormProps {
  employee: Employee;
  onClose: () => void;
}

const EditEmployeeForm: React.FC<EditEmployeeFormProps> = ({ employee, onClose }) => {
  const { departments, updateEmployee } = useAppContext();
  const { toast } = useToast();
  
  const [name, setName] = useState(employee.name);
  const [department, setDepartment] = useState(employee.department);
  const [dailyTarget, setDailyTarget] = useState(employee.dailyTarget);
  const [bonusPercentage, setBonusPercentage] = useState(employee.bonusPercentage);
  const [status, setStatus] = useState(employee.status || '');
  
  const handleSubmit = () => {
    const updatedEmployee: Employee = {
      ...employee,
      name,
      department,
      dailyTarget,
      bonusPercentage,
      status: status || undefined
    };
    
    updateEmployee(updatedEmployee);
    
    toast({
      title: "تم التحديث بنجاح",
      description: `تم تحديث بيانات ${name} بنجاح`
    });
    
    onClose();
  };
  
  return (
    <div className="space-y-4 py-2">
      <div>
        <Label htmlFor="name">اسم العامل</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 text-right"
          dir="rtl"
        />
      </div>
      
      <div>
        <Label htmlFor="department">القسم</Label>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="text-right">
            <SelectValue placeholder="اختر القسم" />
          </SelectTrigger>
          <SelectContent>
            {departments.map(dept => (
              <SelectItem key={dept.id} value={dept.name}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="dailyTarget">الهدف اليومي</Label>
        <Input
          id="dailyTarget"
          type="number"
          min="0"
          value={dailyTarget}
          onChange={(e) => setDailyTarget(parseInt(e.target.value) || 0)}
          className="mt-1 text-right"
          dir="rtl"
        />
      </div>
      
      <div>
        <Label htmlFor="bonusPercentage">نسبة المكافأة (%)</Label>
        <Input
          id="bonusPercentage"
          type="number"
          min="0"
          max="100"
          value={bonusPercentage}
          onChange={(e) => setBonusPercentage(parseInt(e.target.value) || 0)}
          className="mt-1 text-right"
          dir="rtl"
        />
      </div>
      
      <div>
        <Label htmlFor="status">حالة العامل</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="text-right">
            <SelectValue placeholder="اختر الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">متاح</SelectItem>
            <SelectItem value="غائب">غائب</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          إلغاء
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleSubmit}>
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
};

export default EditEmployeeForm;
