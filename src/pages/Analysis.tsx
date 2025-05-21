
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Analysis = () => {
  const { employees, getTotalProduction, getPreviousMonthProduction } = useAppContext();
  
  // Data for monthly production comparison
  const currentMonthProduction = getTotalProduction();
  const previousMonthProduction = getPreviousMonthProduction();
  const changePercentage = previousMonthProduction === 0 
    ? 100 
    : Math.round((currentMonthProduction - previousMonthProduction) / previousMonthProduction * 100);
  
  // Worker production comparison data
  const workerComparisonData = employees.map(employee => ({
    name: employee.name,
    department: employee.department,
    currentMonth: employee.monthlyProduction,
    previousMonth: Math.round(employee.monthlyProduction * 0.7), // Simulated previous month data
    changePercentage: 30 // Simulated change percentage
  }));
  
  // For monthly comparison chart
  const monthlyComparisonData = [
    { name: 'الشهر السابق', production: previousMonthProduction },
    { name: 'الشهر الحالي', production: currentMonthProduction }
  ];
  
  return (
    <div className="container mx-auto px-4 py-6" style={{ direction: 'rtl' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">تحليل البيانات</h1>
        <Link to="/">
          <Button className="bg-blue-500 hover:bg-blue-600">
            لوحة المراقبة
          </Button>
        </Link>
      </div>
      
      {/* Analytics Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-md">
          <div className="text-center">
            <h3 className="text-gray-500 mb-2">تحليل الطلبات</h3>
            <div className="w-full h-2 bg-blue-200 rounded-full">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-md">
          <div className="text-center">
            <h3 className="text-gray-500 mb-2">الأقسام والعمال</h3>
            <div className="w-full h-2 bg-green-200 rounded-full">
              <div className="h-full bg-green-600 rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-md">
          <div className="text-center">
            <h3 className="text-gray-500 mb-2">مقارنة الإنتاج الشهري</h3>
            <div className="w-full h-2 bg-purple-200 rounded-full">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: '70%' }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Monthly Production Comparison */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-6">مقارنة الإنتاج بين الشهر الحالي والسابق</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-6 rounded-md">
            <h3 className="text-gray-500 mb-2">إنتاج الشهر الحالي</h3>
            <p className="text-3xl font-bold text-blue-700">{currentMonthProduction} قطعة</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-md">
            <h3 className="text-gray-500 mb-2">إنتاج الشهر السابق</h3>
            <p className="text-3xl font-bold text-blue-700">{previousMonthProduction} قطعة</p>
          </div>
          <div className={`${changePercentage >= 0 ? 'bg-green-50' : 'bg-red-50'} p-6 rounded-md`}>
            <h3 className="text-gray-500 mb-2">نسبة التغيير</h3>
            <p className={`text-3xl font-bold ${changePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {changePercentage >= 0 ? '+' : ''}{changePercentage}%
            </p>
          </div>
        </div>
        
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyComparisonData}
              margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="production" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>الشهر الحالي</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
            <span>الشهر السابق</span>
          </div>
        </div>
      </div>
      
      {/* Workers Production Comparison */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6">مقارنة إنتاج العمال</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-right">العامل</th>
                <th className="py-3 px-4 text-right">القسم</th>
                <th className="py-3 px-4 text-right">الشهر الحالي</th>
                <th className="py-3 px-4 text-right">الشهر السابق</th>
                <th className="py-3 px-4 text-right">نسبة التغيير</th>
              </tr>
            </thead>
            <tbody>
              {workerComparisonData.map((worker, index) => (
                <tr key={index} className="border-t">
                  <td className="py-3 px-4">{worker.name}</td>
                  <td className="py-3 px-4">{worker.department}</td>
                  <td className="py-3 px-4">{worker.currentMonth} قطعة</td>
                  <td className="py-3 px-4">{worker.previousMonth} قطعة</td>
                  <td className="py-3 px-4 text-green-600">+{worker.changePercentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
