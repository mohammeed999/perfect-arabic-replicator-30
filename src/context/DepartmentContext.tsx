
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Department } from '@/types/department';
import { departmentService } from '@/services/localDataService';

interface DepartmentContextType {
  departments: Department[];
  addDepartment: (department: Omit<Department, "id">) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

interface DepartmentProviderProps {
  children: ReactNode;
}

export function DepartmentProvider({ children }: DepartmentProviderProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoading(true);
        setError(null);
        const departmentsData = await departmentService.getAll();
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error loading departments:', error);
        setError('حدث خطأ في تحميل بيانات الأقسام');
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  const addDepartment = async (department: Omit<Department, "id">) => {
    try {
      const newDepartment = await departmentService.create(department);
      if (newDepartment) {
        setDepartments(prev => [...prev, newDepartment]);
      }
    } catch (error) {
      console.error('Error adding department:', error);
      setError('حدث خطأ في إضافة القسم');
    }
  };

  const value: DepartmentContextType = {
    departments,
    addDepartment,
    loading,
    error,
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
