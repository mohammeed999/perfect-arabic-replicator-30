
import React from 'react';
import { Link } from 'react-router-dom';
import type { Employee } from '@/types/employee';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmployeesTableProps {
  employees: Employee[];
  formattedDate: string;
}

export const EmployeesTable = ({ employees, formattedDate }: EmployeesTableProps) => {
  // Calculate completion percentage for employees
  const getCompletionPercentage = (employee: Employee) => {
    if (employee.dailyTarget === 0) return 0;
    const production = employee.production || 0;
    return Math.min(Math.round((production / employee.dailyTarget) * 100), 100); // Cap at 100%
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">أداء العمال اليوم - {formattedDate}</h2>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-md shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الإنتاج</TableHead>
              <TableHead className="text-right">الهدف</TableHead>
              <TableHead className="text-right">نسبة الإنجاز</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => {
              const completionPercentage = getCompletionPercentage(employee);
              return (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>
                    <span className={`inline-block py-1 px-3 rounded-full text-sm ${
                      employee.status === 'غائب' ? 'bg-red-100 text-red-800' : 
                      employee.status ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {employee.status || 'متاح'}
                    </span>
                  </TableCell>
                  <TableCell>{employee.production || 0}</TableCell>
                  <TableCell>{employee.dailyTarget}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="ml-2">{completionPercentage}%</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${completionPercentage}%` }} 
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link to={`/employees/${employee.id}`} className="text-blue-500 hover:underline">تفاصيل</Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
