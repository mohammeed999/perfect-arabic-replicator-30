
import React from 'react';
import type { Department } from '@/types/department';

interface DepartmentDistributionProps {
  departments: Department[];
}

export const DepartmentDistribution = ({ departments }: DepartmentDistributionProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">توزيع العمال حسب الأقسام</h2>
      
      {departments.map(dept => (
        <div key={dept.id} className="mb-4">
          <div className="flex justify-between mb-1">
            <span>{dept.name}</span>
            <span>{dept.employeeCount} عامل ({dept.employeeCount > 0 ? Math.round((dept.employeeCount / departments.reduce((total, d) => total + d.employeeCount, 0)) * 100) : 0}%)</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${dept.employeeCount > 0 ? Math.round((dept.employeeCount / departments.reduce((total, d) => total + d.employeeCount, 0)) * 100) : 0}%` }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
};
