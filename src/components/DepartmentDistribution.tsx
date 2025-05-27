
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { Department } from '@/types/department';

interface DepartmentDistributionProps {
  departments: Department[];
}

export const DepartmentDistribution = ({ departments }: DepartmentDistributionProps) => {
  console.log('DepartmentDistribution received departments:', departments);

  // Calculate total employees across all departments
  const totalEmployees = departments.reduce((total, dept) => total + (dept.employeeCount || 0), 0);
  
  if (departments.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">توزيع العمال حسب الأقسام</h2>
        <div className="bg-gray-50 rounded-md p-8 text-center">
          <p className="text-gray-500 mb-4">لا توجد أقسام محددة حتى الآن</p>
          <Link to="/employees">
            <Button className="bg-blue-500 hover:bg-blue-600">
              إدارة الأقسام والعمال
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">توزيع العمال حسب الأقسام</h2>
        <p className="text-sm text-gray-500">إجمالي العمال: {totalEmployees}</p>
      </div>
      
      {departments.map(dept => {
        const percentage = totalEmployees > 0 
          ? Math.round(((dept.employeeCount || 0) / totalEmployees) * 100) 
          : 0;
          
        return (
          <div key={dept.id} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{dept.name}</span>
              <span className="text-sm text-gray-600">
                {dept.employeeCount || 0} عامل ({percentage}%)
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                style={{ width: `${percentage}%` }} 
              />
            </div>
          </div>
        );
      })}
      
      {totalEmployees === 0 && (
        <div className="text-center mt-4">
          <p className="text-gray-500 mb-2">لا يوجد عمال في الأقسام حتى الآن</p>
          <Link to="/employees">
            <Button variant="outline" className="text-blue-600">
              إضافة عمال جدد
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
