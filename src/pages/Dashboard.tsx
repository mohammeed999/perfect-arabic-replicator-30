
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Bell } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

import { useDashboard } from '@/hooks/useDashboard';
import { DashboardStats } from '@/components/DashboardStats';
import { DepartmentDistribution } from '@/components/DepartmentDistribution';
import { ProductionCharts } from '@/components/ProductionCharts';
import { EmployeesTable } from '@/components/EmployeesTable';
import { OrdersTable } from '@/components/OrdersTable';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { 
    employees, 
    orders, 
    departments,
    getTotalProduction, 
    getPendingOrdersCount,
    getOrderCompletionTarget,
    getCurrentDate,
    refresh,
    isLoading
  } = useDashboard();
  
  const { toast } = useToast();
  const formattedDate = getCurrentDate();

  // Load initial data when the component mounts
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Check if any orders are near their deadline (10 days or less)
  useEffect(() => {
    const today = new Date();
    const nearDeadlineOrders = orders.filter(order => {
      if (!order.dueDate || order.status === 'completed') return false;
      
      const dueDate = new Date(order.dueDate);
      const daysDifference = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return daysDifference <= 10 && daysDifference >= 0;
    });
    
    if (nearDeadlineOrders.length > 0) {
      nearDeadlineOrders.forEach(order => {
        toast({
          title: "تنبيه موعد تسليم",
          description: `طلب ${order.client} يجب تسليمه خلال ${10} أيام أو أقل!`,
          variant: "warning",
          duration: 5000
        });
      });
    }
  }, [orders, toast]);

  return (
    <div className="container mx-auto px-4 py-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">لوحة المراقبة</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
              {getPendingOrdersCount()}
            </span>
          </Button>
        </div>
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

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <p className="text-lg">جاري تحميل البيانات...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
