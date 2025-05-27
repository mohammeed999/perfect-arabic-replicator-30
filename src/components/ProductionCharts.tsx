
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Employee } from '@/types/employee';
import type { Order } from '@/types/order';

interface ProductionChartsProps {
  employees: Employee[];
  orders: Order[];
}

export const ProductionCharts = ({ employees, orders }: ProductionChartsProps) => {
  console.log('ProductionCharts received employees:', employees);
  console.log('ProductionCharts received orders:', orders);

  // Calculate data for pie chart - client distribution
  const pieData = useMemo(() => {
    if (!orders || orders.length === 0) {
      console.log('No orders for pie chart');
      return [];
    }
    
    // Group orders by client and calculate total quantities
    const clientData = orders.reduce((acc, order) => {
      if (!order.client) return acc;
      
      if (!acc[order.client]) {
        acc[order.client] = {
          name: order.client,
          value: 0,
          count: 0
        };
      }
      
      acc[order.client].value += order.totalQuantity || 0;
      acc[order.client].count += 1;
      
      return acc;
    }, {} as Record<string, { name: string; value: number; count: number }>);

    const result = Object.values(clientData).filter(item => item.value > 0);
    console.log('Pie chart data:', result);
    return result;
  }, [orders]);

  // Colors for pie chart
  const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
  
  // Calculate data for employee production bar chart
  const barData = useMemo(() => {
    if (!employees || employees.length === 0) {
      console.log('No employees for bar chart');
      return [];
    }
    
    const result = employees
      .filter(employee => employee.name && employee.name.trim() !== '')
      .map(employee => ({
        name: employee.name.length > 10 ? employee.name.substring(0, 10) + '...' : employee.name,
        production: employee.production || 0,
        target: employee.dailyTarget || 0,
        fullName: employee.name
      }))
      .slice(0, 8); // Limit to 8 employees for better visualization

    console.log('Bar chart data:', result);
    return result;
  }, [employees]);

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-medium">{data.name}</p>
          <p>الكمية: {data.value} قطعة</p>
          <p>عدد الطلبات: {data.count}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const BarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-medium">{data.fullName}</p>
          <p>الإنتاج: {payload[0].value} قطعة</p>
          <p>الهدف: {payload[1]?.value || 0} قطعة</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Client Distribution Pie Chart */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">توزيع الطلبات حسب العملاء</h2>
          <Link to="/orders/add">
            <Button className="bg-blue-500 hover:bg-blue-600 gap-1">
              <Plus size={18} /> إضافة طلب
            </Button>
          </Link>
        </div>
        
        {pieData.length === 0 ? (
          <div className="flex justify-center items-center h-64 bg-gray-50 rounded-md">
            <div className="text-center">
              <p className="text-gray-500 mb-2">لا توجد طلبات متاحة للعرض</p>
              <Link to="/orders/add">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  إضافة أول طلب
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Legend */}
            <div className="col-span-1 overflow-y-auto max-h-60">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center mb-2">
                  <span 
                    className="w-3 h-3 rounded-full ml-2" 
                    style={{ backgroundColor: pieColors[index % pieColors.length] }}
                  ></span>
                  <span className="text-sm">
                    {entry.name} ({entry.value} قطعة)
                  </span>
                </div>
              ))}
            </div>
            
            {/* Pie Chart */}
            <div className="col-span-2 flex justify-center h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ percent }) => percent > 5 ? `${(percent).toFixed(0)}%` : ''}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
      
      {/* Employee Production Bar Chart */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">إنتاج العمال</h2>
          <Link to="/employees">
            <Button variant="outline" className="text-blue-600">
              عرض الكل
            </Button>
          </Link>
        </div>
        
        {barData.length === 0 ? (
          <div className="flex justify-center items-center h-64 bg-gray-50 rounded-md">
            <div className="text-center">
              <p className="text-gray-500 mb-2">لا يوجد عمال متاحين للعرض</p>
              <Link to="/employees">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  إضافة عامل جديد
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={barData}
                margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="production" fill="#6366F1" name="الإنتاج" radius={[2, 2, 0, 0]} />
                <Bar dataKey="target" fill="#cbd5e1" name="الهدف" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="text-center mt-2">
              <span className="inline-block mx-2">
                <span className="w-3 h-3 inline-block bg-indigo-500 rounded-full ml-1"></span>
                الإنتاج الفعلي
              </span>
              <span className="inline-block mx-2">
                <span className="w-3 h-3 inline-block bg-gray-300 rounded-full ml-1"></span>
                الهدف اليومي
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
