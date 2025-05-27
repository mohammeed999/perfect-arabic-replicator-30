
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
import { Button } from "@/components/ui/button";

interface EmployeesTableProps {
  employees: Employee[];
  formattedDate: string;
}

export const EmployeesTable = ({ employees, formattedDate }: EmployeesTableProps) => {
  console.log('EmployeesTable received employees:', employees);

  // Calculate completion percentage for employees
  const getCompletionPercentage = (employee: Employee) => {
    if (!employee.dailyTarget || employee.dailyTarget === 0) return 0;
    const production = employee.production || 0;
    return Math.min(Math.round((production / employee.dailyTarget) * 100), 100); // Cap at 100%
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">أداء العمال اليوم - {formattedDate}</h2>
          <p className="text-sm text-gray-500">عرض أول {employees.length} عمال</p>
        </div>
        <Link to="/employees">
          <Button className="text-blue-500" variant="link">
            عرض جميع العمال
          </Button>
        </Link>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-md shadow-sm">
        {employees.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">لا يوجد عمال مسجلين حتى الآن</p>
            <Link to="/employees">
              <Button className="bg-blue-500 hover:bg-blue-600">
                إضافة عامل جديد
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">القسم</TableHead>
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
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <span className={`inline-block py-1 px-3 rounded-full text-sm ${
                        employee.status === 'غائب' ? 'bg-red-100 text-red-800' : 
                        employee.currentOrder ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {employee.status === 'غائب' ? 'غائب' :
                         employee.currentOrder ? 'مشغول' : 'متاح'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{employee.production || 0}</span>
                    </TableCell>
                    <TableCell>{employee.dailyTarget || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="ml-2">{completionPercentage}%</span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-full rounded-full ${
                              completionPercentage >= 100 ? 'bg-green-500' :
                              completionPercentage >= 75 ? 'bg-blue-500' :
                              completionPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${completionPercentage}%` }} 
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/employees/${employee.id}`} className="text-blue-500 hover:underline">
                        تفاصيل
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
