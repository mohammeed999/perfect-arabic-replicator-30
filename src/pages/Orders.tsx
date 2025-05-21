
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

const Orders = () => {
  const { orders, addOrder } = useAppContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('كل الطلبات');

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
    value: clientData[client].count,
    quantity: clientData[client].quantity
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'كل الطلبات') return true;
    if (activeTab === 'الطلبات المكتملة') return order.status === 'completed';
    return order.status === 'pending';
  });

  return (
    <div className="container mx-auto px-4 py-6" style={{ direction: 'rtl' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
        <Link to="/dashboard">
          <Button className="bg-blue-500 hover:bg-blue-600">
            لوحة المراقبة
          </Button>
        </Link>
      </div>
      
      {/* Client Distribution Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-6">توزيع الطلبات حسب العملاء</h2>
        
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
                  labelLine={true}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="md:w-1/2 flex flex-col md:items-end">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center mb-4">
                <div className="flex items-center ml-4">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{entry.name} ({entry.quantity} قطعة)</span>
                </div>
                <div className="text-gray-600 ml-2">
                  {Math.round(entry.value / orders.length * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Orders List */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex">
          <Button
            variant={activeTab === 'كل الطلبات' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('كل الطلبات')}
            className="rounded-l-md rounded-r-none"
          >
            كل الطلبات
          </Button>
          <Button
            variant={activeTab === 'الطلبات المعلقة' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('الطلبات المعلقة')}
            className="rounded-none border-x-0"
          >
            الطلبات المعلقة
          </Button>
          <Button
            variant={activeTab === 'الطلبات المكتملة' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('الطلبات المكتملة')}
            className="rounded-r-md rounded-l-none"
          >
            الطلبات المكتملة
          </Button>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600 gap-1">
              <Plus size={18} />إضافة طلب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px] text-right" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة طلب جديد</DialogTitle>
            </DialogHeader>
            <AddOrderForm onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
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
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

const OrderCard = ({ order }: { order: any }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{order.client}</h3>
        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
          order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {order.status === 'completed' ? 'مكتمل' : 'قيد التنفيذ'}
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
          <p className="text-sm">{order.completionPercentage}%</p>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-green-500 rounded-full" 
            style={{ width: `${order.completionPercentage}%` }} 
          />
        </div>
      </div>
      
      <div className="text-center">
        <Button variant="outline" className="w-full text-blue-600">
          عرض التفاصيل
        </Button>
      </div>
    </div>
  );
};

const AddOrderForm = ({ onClose }: { onClose: () => void }) => {
  // Form state
  const [client, setClient] = useState('');
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [receivingDate, setReceivingDate] = useState('');
  const [products, setProducts] = useState<{id: string, name: string, type: string, quantity: string}[]>([
    { id: '1', name: '', type: '', quantity: '' }
  ]);

  const { addOrder } = useAppContext();

  const handleAddProduct = () => {
    setProducts([...products, { id: `${products.length + 1}`, name: '', type: '', quantity: '' }]);
  };

  const handleRemoveProduct = (index: number) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
    }
  };

  const handleProductChange = (index: number, field: string, value: string) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setProducts(newProducts);
  };

  const handleSubmit = () => {
    if (client && products[0].name && products[0].quantity && entryDate && deliveryDate && receivingDate) {
      addOrder({
        client,
        product: {
          id: '1',
          name: products[0].name,
          type: products[0].type || 'غير محدد',
          quantity: parseInt(products[0].quantity)
        },
        totalQuantity: parseInt(products[0].quantity),
        entryDate,
        deliveryDate,
        receivingDate,
        status: 'pending',
        completionPercentage: 0
      });
      onClose();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="client">العميل</Label>
        <Input 
          id="client" 
          value={client} 
          onChange={(e) => setClient(e.target.value)} 
          className="w-full mt-1 text-right"
          dir="rtl"
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">المنتجات</h3>
          <Button 
            type="button" 
            onClick={handleAddProduct} 
            variant="outline" 
            size="sm" 
            className="text-blue-600"
          >
            + إضافة منتج
          </Button>
        </div>
        
        {products.map((product, index) => (
          <div key={product.id} className="p-4 border rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h4>منتج #{index + 1}</h4>
              {products.length > 1 && (
                <Button 
                  type="button" 
                  onClick={() => handleRemoveProduct(index)} 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 h-8 px-2"
                >
                  حذف
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor={`name-${index}`}>اسم المنتج</Label>
                <Input 
                  id={`name-${index}`} 
                  value={product.name} 
                  onChange={(e) => handleProductChange(index, 'name', e.target.value)} 
                  className="mt-1 text-right"
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor={`type-${index}`}>نوع المنتج</Label>
                <Input 
                  id={`type-${index}`} 
                  value={product.type} 
                  onChange={(e) => handleProductChange(index, 'type', e.target.value)} 
                  className="mt-1 text-right"
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor={`quantity-${index}`}>الكمية</Label>
                <Input 
                  id={`quantity-${index}`} 
                  type="number" 
                  value={product.quantity} 
                  onChange={(e) => handleProductChange(index, 'quantity', e.target.value)} 
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="entryDate">تاريخ الإدخال</Label>
          <Input 
            id="entryDate" 
            type="date" 
            value={entryDate} 
            onChange={(e) => setEntryDate(e.target.value)} 
            className="w-full mt-1"
          />
        </div>
        <div>
          <Label htmlFor="deliveryDate">موعد التسليم</Label>
          <Input 
            id="deliveryDate" 
            type="date" 
            value={deliveryDate} 
            onChange={(e) => setDeliveryDate(e.target.value)} 
            className="w-full mt-1"
          />
        </div>
        <div>
          <Label htmlFor="receivingDate">موعد الاستلام</Label>
          <Input 
            id="receivingDate" 
            type="date" 
            value={receivingDate} 
            onChange={(e) => setReceivingDate(e.target.value)} 
            className="w-full mt-1"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onClose} variant="outline" className="bg-gray-500 text-white hover:bg-gray-600">
          إلغاء
        </Button>
        <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600">
          إضافة الطلب
        </Button>
      </div>
    </div>
  );
};

export default Orders;
