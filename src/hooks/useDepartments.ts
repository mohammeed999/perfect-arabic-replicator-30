
import { useState } from 'react';
import { Department } from '../types/department';
import { initialDepartments } from '../data/initial-data';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);

  const addDepartment = (department: Omit<Department, "id">) => {
    const newDepartment = {
      ...department,
      id: `${departments.length + 1}`
    };
    setDepartments([...departments, newDepartment]);
    return newDepartment;
  };

  const updateDepartmentEmployeeCount = (departmentName: string, increment: number) => {
    const departmentIndex = departments.findIndex(dept => dept.name === departmentName);
    if (departmentIndex !== -1) {
      const updatedDepartments = [...departments];
      updatedDepartments[departmentIndex].employeeCount += increment;
      setDepartments(updatedDepartments);
    }
  };

  return {
    departments,
    addDepartment,
    updateDepartmentEmployeeCount
  };
};
