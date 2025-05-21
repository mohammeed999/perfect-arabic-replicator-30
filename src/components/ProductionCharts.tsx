
import React from 'react';
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
  // Calculate data for pie chart with better labels
  const pieData = orders.map(order => ({
    name: order.client,
    value: order.product.quantity,
    label: `${order.client}`
  }));

  // Data for the client distribution
  const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  
  // Calculate data for employee production bar chart
  const barData = employees.map(employee => ({
    name: employee.name,
    production: employee.production,
    target: employee.dailyTarget
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-4 rounded-md shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">توزيع الطلبات حسب العملاء</h2>
          <Link to="/orders/add">
            <Button className="bg-blue-500 hover:bg-blue-600 gap-1">
              <Plus size={18} /> إضافة طلب
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 overflow-y-auto" style={{ maxHeight: '200px' }}>
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center mb-2">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: pieColors[index % pieColors.length] }}></span>
                <span className="text-sm">{entry.name} ({entry.value} قطعة)</span>
              </div>
            ))}
          </div>
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
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} قطعة`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold mb-4">إنتاج العمال</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              layout="vertical"
              barSize={30}
              barGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name"
                width={100}
                style={{ textAnchor: 'end', fontSize: '12px' }}
              />
              <Tooltip formatter={(value) => `${value} قطعة`} />
              <Bar dataKey="production" fill="#6366F1" radius={[0, 4, 4, 0]} name="الإنتاج" />
              <Bar dataKey="target" fill="#cbd5e1" radius={[0, 4, 4, 0]} name="الهدف" />
            </BarChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <span className="inline-block mx-2">
              <span className="w-3 h-3 inline-block bg-indigo-500 rounded-full mr-1"></span>
              الإنتاج
            </span>
            <span className="inline-block mx-2">
              <span className="w-3 h-3 inline-block bg-gray-300 rounded-full mr-1"></span>
              الهدف
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
