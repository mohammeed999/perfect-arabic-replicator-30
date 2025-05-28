import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee } from '@/types/employee';
import { employeeService } from '@/services/localDataService';

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, "id">) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (employeeId: string) => Promise<void>;
  getEmployeesByDepartment: (departmentId: string) => Employee[];
  getTotalProduction: () => number;
  getAvailableEmployees: () => Employee[];
  assignEmployeeToOrder: (employeeId: string, orderId: string) => Promise<void>;
  calculateEmployeeBonus: (employee: Employee) => number;
  updateEmployeeProduction: (employeeId: string, quantity: number) => void;
  loading: boolean;
  error: string | null;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

interface EmployeeProviderProps {
  children: ReactNode;
}

export function EmployeeProvider({ children }: EmployeeProviderProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        const employeesData = await employeeService.getAll();
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error loading employees:', error);
        setError('حدث خطأ في تحميل بيانات الموظفين');
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const addEmployee = async (employee: Omit<Employee, "id">) => {
    try {
      const newEmployee = await employeeService.create({
        ...employee,
        bonusPercentage: 0,
        monthlySalary: employee.monthlySalary || 0 // التأكد من وجود الراتب الشهري
      });
      if (newEmployee) {
        setEmployees(prev => [...prev, newEmployee]);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      setError('حدث خطأ في إضافة الموظف');
    }
  };

  const updateEmployee = async (employee: Employee) => {
    try {
      const updatedEmployee = await employeeService.update(employee);
      if (updatedEmployee) {
        setEmployees(prev => prev.map(emp => emp.id === employee.id ? updatedEmployee : emp));
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      setError('حدث خطأ في تحديث بيانات الموظف');
    }
  };

  const updateEmployeeProduction = (employeeId: string, quantity: number) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { 
            ...emp, 
            production: emp.production + quantity,
            monthlyProduction: emp.monthlyProduction + quantity
          }
        : emp
    ));
  };

  const deleteEmployee = async (employeeId: string) => {
    try {
      await employeeService.delete(employeeId);
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError('حدث خطأ في حذف الموظف');
    }
  };

  const getEmployeesByDepartment = (departmentId: string): Employee[] => {
    return employees.filter(emp => emp.department === departmentId);
  };

  const getTotalProduction = (): number => {
    return employees.reduce((total, emp) => total + emp.production, 0);
  };

  const getAvailableEmployees = (): Employee[] => {
    return employees.filter(emp => emp.status === 'حاضر' && !emp.currentOrder);
  };

  const assignEmployeeToOrder = async (employeeId: string, orderId: string) => {
    try {
      const employee = employees.find(emp => emp.id === employeeId);
      if (employee) {
        const updatedEmployee = { 
          ...employee, 
          currentOrder: orderId,
          status: `يعمل في طلب ${orderId}` // تحديث حالة العامل
        };
        await updateEmployee(updatedEmployee);
      }
    } catch (error) {
      console.error('Error assigning employee to order:', error);
      setError('حدث خطأ في تعيين الموظف للطلب');
    }
  };

  const calculateEmployeeBonus = (employee: Employee): number => {
    const extraProduction = Math.max(0, employee.production - employee.dailyTarget);
    
    if (extraProduction <= 0) {
      return 0; // لا مكافأة إذا لم يتجاوز الهدف
    }
    
    // حساب المكافأة كنسبة من الراتب الشهري بناءً على الإنتاج الإضافي
    const baseSalary = employee.monthlySalary || 0;
    const bonusPercentage = Math.min(extraProduction / employee.dailyTarget * 0.1, 0.3); // حد أقصى 30%
    
    return Math.round(baseSalary * bonusPercentage);
  };

  const value: EmployeeContextType = {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeesByDepartment,
    getTotalProduction,
    getAvailableEmployees,
    assignEmployeeToOrder,
    calculateEmployeeBonus,
    updateEmployeeProduction,
    loading,
    error,
  };

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
}

export function useEmployeeContext() {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployeeContext must be used within an EmployeeProvider');
  }
  return context;
}
