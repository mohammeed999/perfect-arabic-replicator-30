
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
import { Users, TrendingUp, Target, Eye } from 'lucide-react';

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
  
  // Get status display info
  const getStatusInfo = (employee: Employee) => {
    if (employee.status === 'غائب') {
      return { text: 'غائب', class: 'bg-red-100 text-red-800 border-red-200' };
    } else if (employee.currentOrder) {
      return { text: 'مشغول', class: 'bg-amber-100 text-amber-800 border-amber-200' };
    }
    return { text: 'متاح', class: 'bg-green-100 text-green-800 border-green-200' };
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <Users className="h-5 w-5 text-blue-600" />
            أداء العمال اليوم - {formattedDate}
          </h2>
          <p className="text-sm text-gray-500 mt-1">عرض أول {employees.length} عمال حاضرين</p>
        </div>
        <Link to="/employees">
          <Button variant="outline" className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50">
            <Eye className="h-4 w-4" />
            عرض الكل
          </Button>
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        {employees.length === 0 ? (
          <div className="p-12 text-center bg-gray-50 rounded-lg">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4 text-lg">لا يوجد عمال حاضرين اليوم</p>
            <Link to="/employees">
              <Button className="bg-blue-500 hover:bg-blue-600">
                إضافة عامل جديد
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-right font-semibold text-gray-700">الاسم</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">القسم</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">الحالة</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">الإنتاج</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">الهدف</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">نسبة الإنجاز</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => {
                const completionPercentage = getCompletionPercentage(employee);
                const statusInfo = getStatusInfo(employee);
                
                return (
                  <TableRow key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-900">{employee.name}</TableCell>
                    <TableCell className="text-gray-700">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                        {employee.department}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.class}`}>
                        {statusInfo.text}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <span className="font-bold text-blue-600">{employee.production || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{employee.dailyTarget || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium min-w-[40px]">{completionPercentage}%</span>
                        <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              completionPercentage >= 100 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                              completionPercentage >= 75 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                              completionPercentage >= 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                              'bg-gradient-to-r from-red-500 to-red-600'
                            }`}
                            style={{ width: `${completionPercentage}%` }} 
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/employees/${employee.id}`}>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                          <Eye className="h-4 w-4 ml-1" />
                          تفاصيل
                        </Button>
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
