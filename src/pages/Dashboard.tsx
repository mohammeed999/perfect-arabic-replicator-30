
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const { 
    employees, 
    orders, 
    getTotalProduction, 
    getPendingOrdersCount,
    getOrderCompletionTarget 
  } = useAppContext();

  // Calculate data for pie chart
  const pieData = orders.map(order => ({
    name: order.client,
    value: order.product.quantity
  }));

  // Data for the client distribution
  const pieColors = ['#3B82F6', '#10B981', '#F59E0B'];

  // Calculate data for employee production bar chart
  const barData = employees.map(employee => ({
    name: employee.name,
    production: employee.production
  }));

  return (
    <div className="container mx-auto px-4 py-6 dir-rtl" style={{ direction: 'rtl' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">لوحة المراقبة</h1>
        <Link to="/dashboard">
          <Button className="bg-blue-500 hover:bg-blue-600">
            لوحة المراقبة
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <Button variant="outline" className="rounded-full px-6">
          كل الطلبات
        </Button>
        <Button variant="outline" className="rounded-full px-6 bg-amber-100 text-amber-800 border-amber-200">
          الطلبات المعلقة
        </Button>
        <Button variant="outline" className="rounded-full px-6 bg-green-100 text-green-800 border-green-200">
          الطلبات المكتملة
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-md">
          <h3 className="text-gray-500 mb-2">إجمالي الإنتاج</h3>
          <p className="text-3xl font-bold text-blue-700">{getTotalProduction()}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-md">
          <h3 className="text-gray-500 mb-2">إجمالي العمال</h3>
          <p className="text-3xl font-bold text-blue-700">{employees.length}</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-md">
          <h3 className="text-gray-500 mb-2">الطلبات المعلقة</h3>
          <p className="text-3xl font-bold text-amber-600">{getPendingOrdersCount()}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-md">
          <h3 className="text-gray-500 mb-2">نسبة تحقيق الهدف</h3>
          <p className="text-3xl font-bold text-blue-700">{getOrderCompletionTarget()}%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold mb-4">توزيع الطلبات حسب العملاء</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              {orders.map((order, index) => (
                <div key={order.id} className="flex items-center mb-2">
                  <span className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: pieColors[index % pieColors.length] }}></span>
                  <span className="text-sm">{order.client}</span>
                </div>
              ))}
              <div className="mt-4">
                {orders.map(order => (
                  <div key={order.id} className="mb-2">
                    <p className="text-sm text-gray-600">{order.product.quantity} قطعة</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-2 flex justify-center h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => entry.name}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
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
                />
                <Tooltip />
                <Bar dataKey="production" fill="#6366F1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <span className="inline-block mx-2">
                <span className="w-3 h-3 inline-block bg-indigo-500 rounded-full mr-1"></span>
                الإنتاج
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Employees Performance Table */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">أداء العمال اليوم</h2>
          <Link to="/orders/add">
            <Button className="bg-blue-500 hover:bg-blue-600 gap-1">
              <Plus size={18} /> إضافة طلب
            </Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto bg-white rounded-md shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-right">الاسم</th>
                <th className="py-3 px-4 text-right">الحالة</th>
                <th className="py-3 px-4 text-right">الإنتاج</th>
                <th className="py-3 px-4 text-right">الهدف</th>
                <th className="py-3 px-4 text-right">نسبة الإنجاز</th>
                <th className="py-3 px-4 text-right">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-t">
                  <td className="py-3 px-4">{employee.name}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block py-1 px-3 rounded-full text-sm ${
                      employee.status.includes('تلاجه') ? 'bg-amber-100 text-amber-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{employee.dailyTarget === 0 ? 0 : employee.dailyTarget}</td>
                  <td className="py-3 px-4">{employee.dailyTarget}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="mr-2">0%</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-gray-400 rounded-full" 
                          style={{ width: '0%' }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Link to={`/employees/${employee.id}`} className="text-blue-500 hover:underline">تفاصيل</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Orders Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">آخر الطلبات</h2>
          <Button className="text-blue-500" variant="link">
            عرض الكل
          </Button>
        </div>
        
        <div className="overflow-x-auto bg-white rounded-md shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-right">العميل</th>
                <th className="py-3 px-4 text-right">المنتج</th>
                <th className="py-3 px-4 text-right">الكمية</th>
                <th className="py-3 px-4 text-right">نسبة الإنجاز</th>
                <th className="py-3 px-4 text-right">الحالة</th>
                <th className="py-3 px-4 text-right">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="py-3 px-4">{order.client}</td>
                  <td className="py-3 px-4">{order.product.name}</td>
                  <td className="py-3 px-4">{order.totalQuantity}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="mr-2">100%</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: '100%' }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block py-1 px-3 rounded-full text-sm ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status === 'completed' ? 'مكتمل' : 'قيد التنفيذ'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link to={`/orders/${order.id}`} className="text-blue-500 hover:underline">تفاصيل</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
