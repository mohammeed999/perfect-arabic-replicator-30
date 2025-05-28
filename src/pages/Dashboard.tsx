
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, ShoppingBag, Target, Award, AlertTriangle } from 'lucide-react';
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
        const daysLeft = Math.floor((new Date(order.deliveryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        toast({
          title: "⚠️ تنبيه موعد تسليم",
          description: `طلب ${order.client} يجب تسليمه خلال ${daysLeft} ${daysLeft === 1 ? 'يوم' : 'أيام'}!`,
          variant: "destructive",
          duration: 8000
        });
      });
    }
  }, [orders, toast]);

  // Get recent orders (last 8)
  const recentOrders = orders.slice(-8).reverse();
  
  // Get orders counts by status
  const pendingOrdersCount = orders.filter(order => order.status === 'pending').length;
  const inProgressOrdersCount = orders.filter(order => order.status === 'in-progress').length;
  const completedOrdersCount = orders.filter(order => order.status === 'completed').length;

  // Calculate stats for present employees only
  const presentEmployees = employees.filter(employee => employee.status !== 'غائب');
  const absentEmployees = employees.filter(employee => employee.status === 'غائب').length;
  
  // Calculate total production only from present employees
  const totalProductionToday = presentEmployees.reduce((total, employee) => {
    return total + (employee.production || 0);
  }, 0);

  // Calculate productivity metrics
  const totalTargetToday = presentEmployees.reduce((total, employee) => {
    return total + (employee.dailyTarget || 0);
  }, 0);
  
  const productivityPercentage = totalTargetToday > 0 ? Math.round((totalProductionToday / totalTargetToday) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                مصنع فينوس - جرابات الهاتف المحمول
              </h1>
              <p className="text-gray-600 text-lg">نظام إدارة متطور ومتكامل</p>
            </div>
          </div>
          <div className="flex gap-3">
            <NotificationButton />
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-600">التاريخ</p>
              <p className="font-semibold text-blue-600">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm opacity-90">إجمالي الإنتاج اليوم</h3>
                <p className="text-3xl font-bold">{totalProductionToday}</p>
                <p className="text-sm opacity-90">قطعة</p>
              </div>
              <TrendingUp className="h-10 w-10 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm opacity-90">العمال الحاضرون</h3>
                <p className="text-3xl font-bold">{presentEmployees.length}</p>
                <p className="text-sm opacity-90">من {employees.length} عامل</p>
              </div>
              <Users className="h-10 w-10 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm opacity-90">الطلبات النشطة</h3>
                <p className="text-3xl font-bold">{inProgressOrdersCount + pendingOrdersCount}</p>
                <p className="text-sm opacity-90">طلب</p>
              </div>
              <ShoppingBag className="h-10 w-10 opacity-80" />
            </div>
          </div>
          
          <div className={`bg-gradient-to-r ${productivityPercentage >= 100 ? 'from-emerald-500 to-emerald-600' : productivityPercentage >= 75 ? 'from-yellow-500 to-yellow-600' : 'from-red-500 to-red-600'} text-white p-6 rounded-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm opacity-90">معدل الإنتاجية</h3>
                <p className="text-3xl font-bold">{productivityPercentage}%</p>
                <p className="text-sm opacity-90">من الهدف</p>
              </div>
              <Target className="h-10 w-10 opacity-80" />
            </div>
          </div>
        </div>

        {/* Navigation Buttons - Enhanced Design */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            إدارة سريعة
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <Link to="/orders">
              <Button 
                variant="outline" 
                className="w-full h-20 flex flex-col gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 transition-all duration-200"
              >
                <ShoppingBag className="h-6 w-6" />
                <span className="text-sm font-medium">كل الطلبات</span>
                <span className="text-xs bg-blue-100 px-2 py-1 rounded-full">{orders.length}</span>
              </Button>
            </Link>
            
            <Link to="/orders?filter=completed">
              <Button 
                variant="outline" 
                className="w-full h-20 flex flex-col gap-2 bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800 transition-all duration-200"
              >
                <Target className="h-6 w-6" />
                <span className="text-sm font-medium">مكتملة</span>
                <span className="text-xs bg-green-100 px-2 py-1 rounded-full">{completedOrdersCount}</span>
              </Button>
            </Link>
            
            <Link to="/orders?filter=in-progress">
              <Button 
                variant="outline" 
                className="w-full h-20 flex flex-col gap-2 bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 hover:text-amber-800 transition-all duration-200"
              >
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm font-medium">قيد التنفيذ</span>
                <span className="text-xs bg-amber-100 px-2 py-1 rounded-full">{inProgressOrdersCount}</span>
              </Button>
            </Link>
            
            <Link to="/orders?filter=pending">
              <Button 
                variant="outline" 
                className="w-full h-20 flex flex-col gap-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-700 hover:text-red-800 transition-all duration-200"
              >
                <AlertTriangle className="h-6 w-6" />
                <span className="text-sm font-medium">معلقة</span>
                <span className="text-xs bg-red-100 px-2 py-1 rounded-full">{pendingOrdersCount}</span>
              </Button>
            </Link>
            
            <Link to="/orders/add">
              <Button className="w-full h-20 flex flex-col gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all duration-200">
                <Plus className="h-6 w-6" />
                <span className="text-sm font-medium">طلب جديد</span>
              </Button>
            </Link>
            
            <Link to="/employees">
              <Button 
                variant="outline"
                className="w-full h-20 flex flex-col gap-2 bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700 hover:text-purple-800 transition-all duration-200"
              >
                <Users className="h-6 w-6" />
                <span className="text-sm font-medium">إدارة العمال</span>
                <span className="text-xs bg-purple-100 px-2 py-1 rounded-full">{employees.length}</span>
              </Button>
            </Link>
          </div>
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
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  توزيع الأقسام
                </h2>
                <DepartmentDistribution departments={departments} />
              </div>
            </div>
            
            <Separator className="my-8 bg-gray-300" />
          </>
        )}

        {/* Charts Section */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              إحصائيات الإنتاج والطلبات
            </h2>
            <ProductionCharts employees={presentEmployees} orders={orders} />
          </div>
        </div>
        
        <Separator className="my-8 bg-gray-300" />

        {/* Tables Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Employees Performance Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <EmployeesTable employees={presentEmployees.slice(0, 10)} formattedDate={formattedDate} />
          </div>
          
          {/* Recent Orders Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <OrdersTable orders={recentOrders} formattedDate={formattedDate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
