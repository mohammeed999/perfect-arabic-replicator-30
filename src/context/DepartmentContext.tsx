
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Department } from '@/types/department';
import { departmentService } from '@/services/localDataService';

interface DepartmentContextType {
  departments: Department[];
  addDepartment: (department: Omit<Department, "id">) => Promise<void>;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

interface DepartmentProviderProps {
  children: ReactNode;
}

export function DepartmentProvider({ children }: DepartmentProviderProps) {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const departmentsData = await departmentService.getAll();
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error loading departments:', error);
      }
    };

    loadDepartments();
  }, []);

  const addDepartment = async (department: Omit<Department, "id">) => {
    const newDepartment = await departmentService.create(department);
    if (newDepartment) {
      setDepartments(prev => [...prev, newDepartment]);
    }
  };

  const value: DepartmentContextType = {
    departments,
    addDepartment,
  };

  return <DepartmentContext.Provider value={value}>{children}</DepartmentContext.Provider>;
}

export function useDepartmentContext() {
  const context = useContext(DepartmentContext);
  if (context === undefined) {
    throw new Error('useDepartmentContext must be used within a DepartmentProvider');
  }
  return context;
}
