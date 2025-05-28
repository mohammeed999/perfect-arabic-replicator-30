import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Orders = () => {
  const { orders, deleteOrder } = useAppContext();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('كل الطلبات');

  // Get filter from URL
  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter === 'pending') {
      setActiveTab('الطلبات المعلقة');
    } else if (filter === 'in-progress') {
      setActiveTab('الطلبات قيد التنفيذ');
    } else if (filter === 'completed') {
      setActiveTab('الطلبات المكتملة');
    } else {
      setActiveTab('كل الطلبات');
    }
  }, [searchParams]);

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === 'الطلبات المعلقة') {
      setSearchParams({ filter: 'pending' });
    } else if (tab === 'الطلبات قيد التنفيذ') {
      setSearchParams({ filter: 'in-progress' });
    } else if (tab === 'الطلبات المكتملة') {
      setSearchParams({ filter: 'completed' });
    } else {
      setSearchParams({});
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const order = orders.find(ord => ord.id === orderId);
    if (order && window.confirm(`هل أنت متأكد من حذف طلب ${order.client}؟`)) {
      try {
        await deleteOrder(orderId);
        toast({
          title: "تم الحذف",
          description: `تم حذف طلب ${order.client} بنجاح`
        });
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ في حذف الطلب",
          variant: "destructive"
        });
      }
    }
  };

  const handleRefreshData = async () => {
    try {
      window.location.reload();
      toast({
        title: "تم التحديث",
        description: "تم تحديث البيانات بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث البيانات",
        variant: "destructive"
      });
    }
  };

  const handleResetAllData = async () => {
    if (window.confirm('هل أنت متأكد من حذف جميع الطلبات؟ هذا الإجراء لا يمكن التراجع عنه!')) {
      try {
        localStorage.removeItem('orders');
        window.location.reload();
        toast({
          title: "تم الحذف",
          description: "تم حذف جميع الطلبات بنجاح"
        });
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ في حذف البيانات",
          variant: "destructive"
        });
      }
    }
  };

  // Prepare data for pie chart
  const clientData = orders.reduce((acc, order) => {
    const clientName = order.client;
    if (!acc[clientName]) {
      acc[clientName] = { count: 0, quantity: 0 };
    }
    acc[clientName].count += 1;
    acc[clientName].quantity += order.totalQuantity;
    return acc;
  }, {} as Record<string, {count: number, quantity: number}>);

  const pieData = Object.keys(clientData).map(client => ({
    name: client,
    value: clientData[client].quantity,
    orderCount: clientData[client].count,
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'كل الطلبات') return true;
    if (activeTab === 'الطلبات المكتملة') return order.status === 'completed';
    if (activeTab === 'الطلبات قيد التنفيذ') return order.status === 'in-progress';
    if (activeTab === 'الطلبات المعلقة') return order.status === 'pending';
    return true;
  }).filter(order => 
    order.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
        <div className="flex gap-2">
          <Button onClick={handleRefreshData} variant="outline" className="flex items-center gap-2">
            <RefreshCw size={18} />
            تحديث البيانات
          </Button>
          <Button onClick={handleResetAllData} variant="destructive" className="flex items-center gap-2">
            <Trash2 size={18} />
            حذف جميع الطلبات
          </Button>
          <Link to="/">
            <Button className="bg-blue-500 hover:bg-blue-600">
              لوحة المراقبة
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Client Distribution Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">توزيع الكميات حسب العملاء</h2>
          <Link to="/orders/add">
            <Button className="bg-blue-500 hover:bg-blue-600 gap-1">
              <Plus size={18} />إضافة طلب جديد
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 h-64 mb-6 md:mb-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => {
                  const entry = props.payload;
                  return [`${value} قطعة (${entry.orderCount} طلبات)`, entry.name];
                }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="md:w-1/2 flex flex-col md:items-end overflow-y-auto" style={{ maxHeight: '250px' }}>
            {pieData.map((entry, index) => {
              const totalQuantity = pieData.reduce((sum, item) => sum + item.value, 0);
              const percentage = totalQuantity > 0 ? (entry.value / totalQuantity * 100).toFixed(1) : 0;
              
              return (
                <div key={index} className="flex items-center mb-4 w-full">
                  <div className="flex items-center flex-grow">
                    <div 
                      className="w-3 h-3 rounded-full ml-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{entry.name} ({entry.value} قطعة - {entry.orderCount} طلبات)</span>
                  </div>
                  <div className="text-gray-600 mr-2 w-12 text-left">
                    {percentage}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Orders List */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex">
          <Button
            variant={activeTab === 'كل الطلبات' ? 'default' : 'outline'} 
            onClick={() => handleTabChange('كل الطلبات')}
            className="rounded-l-md rounded-r-none"
          >
            كل الطلبات
          </Button>
          <Button
            variant={activeTab === 'الطلبات المعلقة' ? 'default' : 'outline'} 
            onClick={() => handleTabChange('الطلبات المعلقة')}
            className="rounded-none border-x-0"
          >
            الطلبات المعلقة
          </Button>
          <Button
            variant={activeTab === 'الطلبات قيد التنفيذ' ? 'default' : 'outline'} 
            onClick={() => handleTabChange('الطلبات قيد التنفيذ')}
            className="rounded-none border-x-0"
          >
            الطلبات قيد التنفيذ
          </Button>
          <Button
            variant={activeTab === 'الطلبات المكتملة' ? 'default' : 'outline'} 
            onClick={() => handleTabChange('الطلبات المكتملة')}
            className="rounded-r-md rounded-l-none"
          >
            الطلبات المكتملة
          </Button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="ابحث عن طلب..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-right"
          dir="rtl"
        />
      </div>
      
      {/* Orders Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <OrderCard 
            key={order.id} 
            order={order} 
            onDelete={handleDeleteOrder}
          />
        ))}
      </div>
    </div>
  );
};

const OrderCard = ({ order, onDelete }: { order: any; onDelete: (orderId: string) => void }) => {
  const displayCompletion = order.status === 'completed' ? 100 : order.completionPercentage;
  
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: 'مكتمل', class: 'bg-green-100 text-green-800' };
      case 'in-progress':
        return { text: 'قيد التنفيذ', class: 'bg-blue-100 text-blue-800' };
      case 'pending':
        return { text: 'معلق', class: 'bg-amber-100 text-amber-800' };
      default:
        return { text: 'غير محدد', class: 'bg-gray-100 text-gray-800' };
    }
  };
  
  const statusInfo = getStatusInfo(order.status);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm" dir="rtl">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{order.client}</h3>
        <span className={`inline-block px-3 py-1 rounded-full text-sm ${statusInfo.class}`}>
          {statusInfo.text}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">المنتج</p>
        <p className="font-medium">{order.product.name}</p>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">الكمية الإجمالية</p>
        <p className="font-medium">{order.totalQuantity}</p>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">تاريخ الإدخال</p>
        <p className="font-medium">{order.entryDate}</p>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">موعد التسليم</p>
        <p className="font-medium">{order.deliveryDate}</p>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">موعد الاستلام</p>
        <p className="font-medium">{order.receivingDate}</p>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm text-gray-600">نسبة الإنجاز</p>
          <p className="text-sm">{displayCompletion}%</p>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-green-500 rounded-full" 
            style={{ width: `${displayCompletion}%` }} 
          />
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Link to={`/orders/${order.id}`} className="flex-1">
          <Button variant="outline" className="w-full text-blue-600">
            عرض التفاصيل
          </Button>
        </Link>
        <Button 
          onClick={() => onDelete(order.id)}
          variant="outline" 
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Orders;
