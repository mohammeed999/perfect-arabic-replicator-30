
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight } from 'lucide-react';

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
  
  const [orderFilter, setOrderFilter] = useState('all'); // 'all', 'pending', 'completed'
  const formattedDate = getCurrentDate();

  // Filter orders based on the selected filter
  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'pending') return order.status === 'pending';
    return order.status === 'completed';
  });

  return (
    <div className="container mx-auto px-4 py-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">لوحة المراقبة</h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <Button 
          variant={orderFilter === 'all' ? undefined : 'outline'} 
          className={`rounded-full px-6 ${orderFilter === 'all' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          onClick={() => setOrderFilter('all')}
        >
          كل الطلبات
        </Button>
        <Button 
          variant={orderFilter === 'pending' ? undefined : 'outline'} 
          className={`rounded-full px-6 ${orderFilter === 'pending' ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200'}`}
          onClick={() => setOrderFilter('pending')}
        >
          الطلبات المعلقة
        </Button>
        <Button 
          variant={orderFilter === 'completed' ? undefined : 'outline'} 
          className={`rounded-full px-6 ${orderFilter === 'completed' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'}`}
          onClick={() => setOrderFilter('completed')}
        >
          الطلبات المكتملة
        </Button>
      </div>

      {/* Stats Cards */}
      <DashboardStats 
        totalProduction={getTotalProduction()}
        totalEmployees={employees.length}
        pendingOrders={getPendingOrdersCount()}
        targetCompletion={getOrderCompletionTarget()}
      />

      {/* Department Distribution */}
      <DepartmentDistribution departments={departments} />

      {/* Charts Section */}
      <ProductionCharts employees={employees} orders={orders} />

      {/* Employees Performance Table */}
      <EmployeesTable employees={employees} formattedDate={formattedDate} />
      
      {/* Recent Orders Table */}
      <OrdersTable orders={filteredOrders} formattedDate={formattedDate} />
    </div>
  );
};

export default Dashboard;
