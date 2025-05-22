
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
  };

  const deleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter(employee => employee.id !== employeeId));
    return employeeId;
  };

  const getAvailableEmployees = () => {
    return employees.filter(employee => !employee.currentOrder && employee.status !== 'غائب');
  };

  return {
    employees,
    setEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getAvailableEmployees
  };
};
