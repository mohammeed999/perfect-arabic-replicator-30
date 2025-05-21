import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EmployeeCard = ({ employee }: { employee: any }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{employee.name}</h3>
        <span className="inline-block px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800">
          {employee.status || 'متاح'}
        </span>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">القسم</p>
        <p className="font-medium">{employee.department}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">إجمالي الإنتاج</p>
        <p className="font-medium">{employee.production}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">إنتاج الشهر الحالي</p>
        <p className="font-medium">{employee.monthlyProduction}</p>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">مكافأة ({employee.bonusPercentage}%)</p>
        <p className="font-medium">{0}</p>
      </div>
      <div className="text-center mt-4">
        <Link to={`/employees/${employee.id}`}>
          <Button variant="outline" className="w-full text-blue-600">عرض التفاصيل</Button>
        </Link>
      </div>
    </div>
  );
};

const AddEmployeeForm = ({ onClose }: { onClose: () => void }) => {
  const { departments, addEmployee } = useAppContext();
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [dailyTarget, setDailyTarget] = useState('100');
  const [bonusPercentage, setBonusPercentage] = useState('5');

  const handleSubmit = () => {
    if (name && department) {
      addEmployee({
        name,
        department,
        dailyTarget: parseInt(dailyTarget),
        bonusPercentage: parseInt(bonusPercentage),
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
        <Label htmlFor="bonusPercentage">نسبة المكافأة (%)</Label>
        <Input 
          id="bonusPercentage" 
          type="number" 
          value={bonusPercentage} 
          onChange={(e) => setBonusPercentage(e.target.value)}
          className="w-full mt-1"
        />
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

const AddDepartmentForm = ({ onClose }: { onClose: () => void }) => {
  const { addDepartment } = useAppContext();
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name) {
      addDepartment({
        name,
        employeeCount: 0
      });
      onClose();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">اسم القسم</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full mt-1 text-right"
          dir="rtl"
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onClose} variant="outline" className="bg-gray-500 text-white hover:bg-gray-600">
          إلغاء
        </Button>
        <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600">
          إضافة قسم
        </Button>
      </div>
    </div>
  );
};

const Employees = () => {
  const { employees, departments } = useAppContext();
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('جميع الأقسام');

  // Calculate employees statistics
  const totalEmployees = employees.length;
  const busyEmployees = employees.filter(e => e.status).length;
  const availableEmployees = totalEmployees - busyEmployees;

  return (
    <div className="container mx-auto px-4 py-6" style={{ direction: 'rtl' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة العمال</h1>
        <Link to="/">
          <Button className="bg-blue-500 hover:bg-blue-600">
            لوحة المراقبة
          </Button>
        </Link>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">قائمة العمال</h2>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600 gap-1">
              <Plus size={18} /> إضافة عامل جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة عامل جديد</DialogTitle>
            </DialogHeader>
            <AddEmployeeForm onClose={() => setIsEmployeeDialogOpen(false)} />
          </DialogContent>
        </Dialog>
        
        <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 gap-1">
              <Plus size={18} /> إضافة قسم جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة قسم جديد</DialogTitle>
            </DialogHeader>
            <AddDepartmentForm onClose={() => setIsDepartmentDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Employee Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-md">
          <h3 className="text-gray-500 mb-2">إجمالي العمال</h3>
          <p className="text-3xl font-bold text-blue-700">{totalEmployees}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-md">
          <h3 className="text-gray-500 mb-2">العمال المتاحون</h3>
          <p className="text-3xl font-bold text-green-700">{availableEmployees}</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-md">
          <h3 className="text-gray-500 mb-2">العمال المشغولون</h3>
          <p className="text-3xl font-bold text-amber-600">{busyEmployees}</p>
        </div>
      </div>
      
      {/* Department Distribution */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">توزيع العمال حسب الأقسام</h2>
        
        {departments.map(dept => (
          <div key={dept.id} className="mb-4">
            <div className="flex justify-between mb-1">
              <span>{dept.name}</span>
              <span>{dept.employeeCount} عامل (%50)</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: '50%' }} 
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Employee Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="w-full md:w-1/4 mb-4 md:mb-0">
          <Label htmlFor="department">القسم</Label>
          <Select onValueChange={setDepartmentFilter} defaultValue={departmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder={departmentFilter} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="جميع الأقسام">جميع الأقسام</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/2">
          <Label htmlFor="search">بحث</Label>
          <Input
            id="search"
            placeholder="ابحث عن عامل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-right"
            dir="rtl"
          />
        </div>
      </div>
      
      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.filter(employee => 
          (departmentFilter === 'جميع الأقسام' || employee.department === departmentFilter) &&
          employee.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(employee => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  );
};

export default Employees;
