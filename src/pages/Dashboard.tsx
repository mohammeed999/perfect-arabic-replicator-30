
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

import { useDashboard } from '@/hooks/useDashboard';
import { DashboardStats } from '@/components/DashboardStats';
import { DepartmentDistribution } from '@/components/DepartmentDistribution';
import { ProductionCharts } from '@/components/ProductionCharts';
import { EmployeesTable } from '@/components/EmployeesTable';
import { OrdersTable } from '@/components/OrdersTable';

const Dashboard = () => {
  const { 
    employees, 
    orders, 
    departments,
    getTotalProduction, 
    getPendingOrdersCount,
    getOrderCompletionTarget,
    getCurrentDate 
  } = useDashboard();
  
  const formattedDate = getCurrentDate();

  return (
    <div className="container mx-auto px-4 py-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">لوحة المراقبة</h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <Link to="/orders">
          <Button 
            variant="outline" 
            className="rounded-full px-6 bg-gray-100 hover:bg-gray-200"
          >
            كل الطلبات
          </Button>
        </Link>
        <Link to="/orders?filter=pending">
          <Button 
            variant="outline" 
            className="rounded-full px-6 bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
          >
            الطلبات المعلقة
          </Button>
        </Link>
        <Link to="/orders?filter=completed">
          <Button 
            variant="outline" 
            className="rounded-full px-6 bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
          >
            الطلبات المكتملة
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <DashboardStats 
        totalProduction={getTotalProduction()}
        totalEmployees={employees.length}
        pendingOrders={getPendingOrdersCount()}
        targetCompletion={getOrderCompletionTarget()}
      />
      
      <Separator className="my-6 bg-gray-300" />

      {/* Department Distribution */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">توزيع الأقسام</h2>
        <DepartmentDistribution departments={departments} />
      </div>
      
      <Separator className="my-6 bg-gray-300" />

      {/* Charts Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">إحصائيات الإنتاج</h2>
        <ProductionCharts employees={employees} orders={orders} />
      </div>
      
      <Separator className="my-6 bg-gray-300" />

      {/* Employees Performance Table */}
      <EmployeesTable employees={employees} formattedDate={formattedDate} />
      
      <Separator className="my-6 bg-gray-300" />
      
      {/* Recent Orders Table */}
      <OrdersTable orders={orders.slice(0, 5)} formattedDate={formattedDate} />
    </div>
  );
};

export default Dashboard;
