
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

import { useAppContext } from '@/context/AppContext';
import { DashboardStats } from '@/components/DashboardStats';
import { DepartmentDistribution } from '@/components/DepartmentDistribution';
import { ProductionCharts } from '@/components/ProductionCharts';
import { EmployeesTable } from '@/components/EmployeesTable';
import { OrdersTable } from '@/components/OrdersTable';
import { NotificationButton } from '@/components/NotificationButton';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { 
    employees, 
    orders, 
    departments,
    getTotalProduction, 
    getPendingOrdersCount,
    getOrderCompletionTarget,
    getCurrentDate
  } = useAppContext();
  
  const { toast } = useToast();
  const formattedDate = getCurrentDate();

  console.log('Dashboard employees:', employees);
  console.log('Dashboard orders:', orders);
  console.log('Dashboard departments:', departments);

  // Check if any orders are near their deadline (10 days or less)
  useEffect(() => {
    const today = new Date();
    const nearDeadlineOrders = orders.filter(order => {
      if (!order.deliveryDate || order.status === 'completed') return false;
      
      const dueDate = new Date(order.deliveryDate);
      const daysDifference = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return daysDifference <= 10 && daysDifference >= 0;
    });
    
    if (nearDeadlineOrders.length > 0) {
      nearDeadlineOrders.forEach(order => {
        toast({
          title: "تنبيه موعد تسليم",
          description: `طلب ${order.client} يجب تسليمه خلال ${Math.floor((new Date(order.deliveryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} أيام أو أقل!`,
          variant: "destructive",
          duration: 5000
        });
      });
    }
  }, [orders, toast]);

  // Get recent orders (last 5)
  const recentOrders = orders.slice(-5).reverse();
  
  // Get pending orders count
  const pendingOrdersCount = getPendingOrdersCount();
  
  // Get completed orders count
  const completedOrdersCount = orders.filter(order => order.status === 'completed').length;

  // Calculate stats for present employees only
  const presentEmployees = employees.filter(employee => employee.status !== 'غائب');
  const absentEmployees = employees.filter(employee => employee.status === 'غائب').length;
  
  // Calculate total production only from present employees
  const totalProductionToday = presentEmployees.reduce((total, employee) => {
    return total + (employee.production || 0);
  }, 0);

  return (
    <div className="container mx-auto px-4 py-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">لوحة المراقبة - نظام إدارة إنتاج فينوس</h1>
        <div className="flex gap-2">
          <NotificationButton />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 p-4 bg-white rounded-lg shadow-sm">
        <Link to="/orders">
          <Button 
            variant="outline" 
            className="rounded-full px-6 bg-gray-100 hover:bg-gray-200 border-gray-300"
          >
            كل الطلبات ({orders.length})
          </Button>
        </Link>
        <Link to="/orders?filter=completed">
          <Button 
            variant="outline" 
            className="rounded-full px-6 bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
          >
            الطلبات المكتملة ({completedOrdersCount})
          </Button>
        </Link>
        <Link to="/orders?filter=pending">
          <Button 
            variant="outline" 
            className="rounded-full px-6 bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
          >
            الطلبات قيد التنفيذ ({pendingOrdersCount})
          </Button>
        </Link>
        <Link to="/orders/add">
          <Button className="rounded-full px-6 bg-blue-500 hover:bg-blue-600">
            <Plus size={16} className="ml-1" />
            إضافة طلب جديد
          </Button>
        </Link>
        <Link to="/employees">
          <Button 
            variant="outline"
            className="rounded-full px-6 bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
          >
            إدارة العمال ({employees.length})
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <DashboardStats 
        totalProduction={totalProductionToday}
        targetCompletion={getOrderCompletionTarget()}
        totalEmployeesToday={presentEmployees.length}
        absentEmployees={absentEmployees}
      />
      
      <Separator className="my-8 bg-gray-300" />

      {/* Department Distribution */}
      {departments.length > 0 && (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">توزيع الأقسام</h2>
            <DepartmentDistribution departments={departments} />
          </div>
          
          <Separator className="my-8 bg-gray-300" />
        </>
      )}

      {/* Charts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">إحصائيات الإنتاج والطلبات</h2>
        <ProductionCharts employees={presentEmployees} orders={orders} />
      </div>
      
      <Separator className="my-8 bg-gray-300" />

      {/* Employees Performance Table - Only show present employees */}
      <EmployeesTable employees={presentEmployees.slice(0, 10)} formattedDate={formattedDate} />
      
      <Separator className="my-8 bg-gray-300" />
      
      {/* Recent Orders Table */}
      <OrdersTable orders={recentOrders} formattedDate={formattedDate} />
    </div>
  );
};

export default Dashboard;
