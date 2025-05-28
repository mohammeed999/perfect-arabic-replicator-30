
import React, { useState } from 'react';
import { useDepartmentContext } from '@/context/DepartmentContext';
import { useEmployeeContext } from '@/context/EmployeeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AddEmployeeFormProps {
  onClose: () => void;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onClose }) => {
  const { departments } = useDepartmentContext();
  const { addEmployee } = useEmployeeContext();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [dailyTarget, setDailyTarget] = useState(0);
  const [monthlySalary, setMonthlySalary] = useState(0);
  
  const handleSubmit = async () => {
    if (!name || !department) {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await addEmployee({
        name,
        department,
        dailyTarget,
        production: 0,
        bonusPercentage: 0,
        monthlyProduction: 0,
        monthlySalary,
        status: 'حاضر' // تعيين الحالة الافتراضية كحاضر
      });
      
      toast({
        title: "تم بنجاح",
        description: `تم إضافة العامل ${name} بنجاح`
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في إضافة العامل",
        variant: "destructive"
      });
    }
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
        <Label htmlFor="monthlySalary">الراتب الشهري</Label>
        <Input
          id="monthlySalary"
          type="number"
          min="0"
          value={monthlySalary}
          onChange={(e) => setMonthlySalary(parseInt(e.target.value) || 0)}
          className="mt-1 text-right"
          dir="rtl"
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          إلغاء
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleSubmit}>
          إضافة العامل
        </Button>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
