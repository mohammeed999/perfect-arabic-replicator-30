
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';

const OrderAdd = () => {
  const navigate = useNavigate();
  const { addOrder } = useAppContext();
  
  const [client, setClient] = useState('');
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [receivingDate, setReceivingDate] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client || !productName || !quantity || !entryDate || !deliveryDate || !receivingDate) {
      return;
    }
    
    const newOrder = {
      client,
      product: {
        id: Date.now().toString(),
        name: productName,
        type: productType || 'غير محدد',
        quantity: parseInt(quantity)
      },
      totalQuantity: parseInt(quantity),
      entryDate,
      deliveryDate,
      receivingDate,
      status: 'pending',
      completionPercentage: 0
    };
    
    addOrder(newOrder);
    navigate('/orders');
  };
  
  return (
    <div className="container mx-auto px-4 py-6 dir-rtl" style={{ direction: 'rtl' }}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate('/orders')}
            className="flex items-center gap-1"
          >
            <ArrowRight size={18} />
            العودة
          </Button>
          <h1 className="text-2xl font-bold">إضافة طلب جديد</h1>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="client">العميل</Label>
            <Input 
              id="client" 
              value={client} 
              onChange={(e) => setClient(e.target.value)} 
              className="w-full mt-1 text-right"
              dir="rtl"
              required
            />
          </div>
          
          <div className="p-4 border rounded-md">
            <h4 className="font-medium mb-3">بيانات المنتج</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="productName">اسم المنتج</Label>
                <Input 
                  id="productName" 
                  value={productName} 
                  onChange={(e) => setProductName(e.target.value)} 
                  className="mt-1 text-right"
                  dir="rtl"
                  required
                />
              </div>
              <div>
                <Label htmlFor="productType">نوع المنتج</Label>
                <Input 
                  id="productType" 
                  value={productType} 
                  onChange={(e) => setProductType(e.target.value)} 
                  className="mt-1 text-right"
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="quantity">الكمية</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)} 
                  className="mt-1"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="entryDate">تاريخ الإدخال</Label>
              <Input 
                id="entryDate" 
                type="date" 
                value={entryDate} 
                onChange={(e) => setEntryDate(e.target.value)} 
                className="w-full mt-1"
                required
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
                required
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
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" onClick={() => navigate('/orders')} variant="outline" className="bg-gray-500 text-white hover:bg-gray-600">
              إلغاء
            </Button>
            <Button type="submit" className="bg-green-500 hover:bg-green-600">
              إضافة الطلب
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderAdd;
