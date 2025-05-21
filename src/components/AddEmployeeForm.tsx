
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AddEmployeeForm = ({ onClose }: { onClose: () => void }) => {
  const { departments, addEmployee } = useAppContext();
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [dailyTarget, setDailyTarget] = useState('100');
  
  // Bonus percentage is fixed at 5% by default
  const bonusPercentage = 5;

  const handleSubmit = () => {
    if (name && department) {
      addEmployee({
        name,
        department,
        dailyTarget: parseInt(dailyTarget),
        bonusPercentage: bonusPercentage, // Fixed bonus percentage
        production: 0,
        monthlyProduction: 0,
        status: ''
      });
      onClose();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">اسم العامل</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full mt-1 text-right"
          dir="rtl"
        />
      </div>

      <div>
        <Label htmlFor="department">القسم</Label>
        <Select onValueChange={setDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="-- اختر القسم --" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
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
          value={dailyTarget} 
          onChange={(e) => setDailyTarget(e.target.value)}
          className="w-full mt-1"
        />
      </div>

      <div>
        <Label htmlFor="bonusInfo">نسبة المكافأة</Label>
        <p className="text-sm text-gray-600 mt-1">يتم احتساب المكافأة تلقائيًا بنسبة {bonusPercentage}% من إجمالي الإنتاج</p>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onClose} variant="outline" className="bg-gray-500 text-white hover:bg-gray-600">
          إلغاء
        </Button>
        <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600">
          إضافة العامل
        </Button>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
