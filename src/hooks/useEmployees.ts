
import { useState } from 'react';
import { Employee } from '../types/employee';
import { initialEmployees } from '../data/initial-data';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee = {
      ...employee,
      id: `${employees.length + 1}`
    };
    setEmployees([...employees, newEmployee]);
    return newEmployee;
  };

  const updateEmployee = (updatedEmployee: Employee) => {
    setEmployees(employees.map(employee => 
      employee.id === updatedEmployee.id ? updatedEmployee : employee
    ));
    return updatedEmployee;
  };

  const deleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter(employee => employee.id !== employeeId));
    return employeeId;
  };

  const getAvailableEmployees = () => {
    return employees.filter(employee => !employee.currentOrder && employee.status !== 'غائب');
  };

  // حساب المكافأة بناءً على تجاوز الهدف اليومي
  const calculateEmployeeBonus = (employee: Employee) => {
    const extraProduction = Math.max(0, employee.production - employee.dailyTarget);
    
    if (extraProduction <= 0) {
      return 0; // لا مكافأة إذا لم يتجاوز الهدف
    }
    
    // حساب المكافأة بناءً على الإنتاج الإضافي
    // نفترض أن كل قطعة إضافية لها مكافأة ثابتة (يمكن تعديلها لاحقًا)
    const bonusPerExtraItem = 5; // جنيه لكل قطعة إضافية
    return extraProduction * bonusPerExtraItem;
  };

  return {
    employees,
    setEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getAvailableEmployees,
    calculateEmployeeBonus
  };
};
