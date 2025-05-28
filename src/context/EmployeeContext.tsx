
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee } from '@/types/employee';
import { employeeService } from '@/services/localDataService';

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, "id">) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (employeeId: string) => void;
  getEmployeesByDepartment: (departmentId: string) => Employee[];
  getTotalProduction: () => number;
  getAvailableEmployees: () => Employee[];
  assignEmployeeToOrder: (employeeId: string, orderId: string) => void;
  calculateEmployeeBonus: (employee: Employee) => number;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

interface EmployeeProviderProps {
  children: ReactNode;
}

export function EmployeeProvider({ children }: EmployeeProviderProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeesData = await employeeService.getAll();
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error loading employees:', error);
      }
    };

    loadEmployees();
  }, []);

  const addEmployee = async (employee: Omit<Employee, "id">) => {
    const newEmployee = await employeeService.create(employee);
    if (newEmployee) {
      setEmployees(prev => [...prev, newEmployee]);
    }
  };

  const updateEmployee = async (employee: Employee) => {
    const updatedEmployee = await employeeService.update(employee);
    if (updatedEmployee) {
      setEmployees(prev => prev.map(emp => emp.id === employee.id ? updatedEmployee : emp));
    }
  };

  const deleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
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

  const assignEmployeeToOrder = (employeeId: string, orderId: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, currentOrder: orderId } : emp
    ));
  };

  const calculateEmployeeBonus = (employee: Employee): number => {
    const performanceRatio = employee.production / employee.dailyTarget;
    if (performanceRatio >= 1.2) return 20;
    if (performanceRatio >= 1.1) return 15;
    if (performanceRatio >= 1.0) return 10;
    return 0;
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
