import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddEmployeeForm from '@/components/AddEmployeeForm';
import EmployeeCard from '@/components/EmployeeCard';
import { Separator } from '@/components/ui/separator';
import EditEmployeeForm from '@/components/EditEmployeeForm';
import { Employee } from '@/types/employee';

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
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Calculate employees statistics
  const totalEmployees = employees.length;
  const busyEmployees = employees.filter(e => e.status && e.status !== 'غائب').length;
  const absentEmployees = employees.filter(e => e.status === 'غائب').length;
  const availableEmployees = totalEmployees - busyEmployees - absentEmployees;
  
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setSelectedEmployee(null);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-6" dir="rtl">
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
      
      <Separator className="my-4 bg-gray-300" />
      
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
      
      <Separator className="my-4 bg-gray-300" />
      
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
          <EmployeeCard 
            key={employee.id} 
            employee={employee} 
            onEditClick={handleEditEmployee}
          />
        ))}
      </div>
      
      {/* نافذة تعديل بيانات العامل */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>تعديل بيانات العامل</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <EditEmployeeForm 
              employee={selectedEmployee} 
              onClose={handleEditClose} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;
