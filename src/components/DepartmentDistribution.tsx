
import React from 'react';
import type { Department } from '@/types/department';

interface DepartmentDistributionProps {
  departments: Department[];
}

export const DepartmentDistribution = ({ departments }: DepartmentDistributionProps) => {
  // Calculate total employees across all departments
  const totalEmployees = departments.reduce((total, dept) => total + dept.employeeCount, 0);
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">توزيع العمال حسب الأقسام</h2>
      
      {departments.map(dept => {
        const percentage = totalEmployees > 0 
          ? Math.round((dept.employeeCount / totalEmployees) * 100) 
          : 0;
          
        return (
          <div key={dept.id} className="mb-4">
            <div className="flex justify-between mb-1">
              <span>{dept.name}</span>
              <span>{dept.employeeCount} عامل ({percentage}%)</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${percentage}%` }} 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
