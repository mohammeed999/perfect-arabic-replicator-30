
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
  getAbsentEmployees: () => Employee[];
  assignEmployeeToOrder: (employeeId: string, orderId: string) => Promise<void>;
  calculateEmployeeBonus: (employee: Employee) => number;
  updateEmployeeProduction: (employeeId: string, quantity: number) => void;
  resetAllData: () => Promise<void>;
  refreshData: () => Promise<void>;
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

  useEffect(() => {
    loadEmployees();
  }, []);

  const addEmployee = async (employee: Omit<Employee, "id">) => {
    try {
      const newEmployee = await employeeService.create({
        ...employee,
        bonusPercentage: 0,
        monthlySalary: employee.monthlySalary || 0,
        status: employee.status || 'حاضر' // تعيين الحالة الافتراضية
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
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        const newProduction = emp.production + quantity;
        const newMonthlyProduction = emp.monthlyProduction + quantity;
        
        // حساب المكافأة تلقائياً عند تجاوز الهدف
        const extraProduction = Math.max(0, newProduction - emp.dailyTarget);
        let bonusPercentage = 0;
        
        if (extraProduction > 0 && emp.monthlySalary > 0) {
          // حساب المكافأة كنسبة من الراتب (1% لكل قطعة إضافية، حد أقصى 20%)
          bonusPercentage = Math.min((extraProduction / emp.dailyTarget) * 10, 20);
        }
        
        return { 
          ...emp, 
          production: newProduction,
          monthlyProduction: newMonthlyProduction,
          bonusPercentage
        };
      }
      return emp;
    }));
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

  const getAbsentEmployees = (): Employee[] => {
    return employees.filter(emp => emp.status === 'غائب');
  };

  const assignEmployeeToOrder = async (employeeId: string, orderId: string) => {
    try {
      const employee = employees.find(emp => emp.id === employeeId);
      if (employee) {
        const updatedEmployee = { 
          ...employee, 
          currentOrder: orderId,
          status: `يعمل في طلب ${orderId}`
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
    
    if (extraProduction <= 0 || !employee.monthlySalary) {
      return 0;
    }
    
    // حساب المكافأة بناءً على النسبة المحسوبة تلقائياً
    const bonusAmount = (employee.monthlySalary * employee.bonusPercentage) / 100;
    return Math.round(bonusAmount);
  };

  const resetAllData = async () => {
    try {
      // حذف جميع البيانات
      for (const employee of employees) {
        await employeeService.delete(employee.id);
      }
      setEmployees([]);
      localStorage.removeItem('employees');
    } catch (error) {
      console.error('Error resetting data:', error);
      setError('حدث خطأ في حذف البيانات');
    }
  };

  const refreshData = async () => {
    await loadEmployees();
  };

  const value: EmployeeContextType = {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeesByDepartment,
    getTotalProduction,
    getAvailableEmployees,
    getAbsentEmployees,
    assignEmployeeToOrder,
    calculateEmployeeBonus,
    updateEmployeeProduction,
    resetAllData,
    refreshData,
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
