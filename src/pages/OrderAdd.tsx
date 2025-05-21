
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';

const OrderAdd = () => {
  const navigate = useNavigate();
  const { addOrder } = useAppContext();
  
  const [client, setClient] = useState('');
  const [products, setProducts] = useState([
    { id: Date.now().toString(), name: '', type: '', quantity: '' }
  ]);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [receivingDate, setReceivingDate] = useState('');
  
  const addProduct = () => {
    setProducts([
      ...products,
      { id: Date.now().toString(), name: '', type: '', quantity: '' }
    ]);
  };
  
  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    }
  };
  
  const updateProduct = (id, field, value) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };
  
  const getTotalQuantity = () => {
    return products.reduce((total, product) => {
      const quantity = parseInt(product.quantity) || 0;
      return total + quantity;
    }, 0);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client || products.some(p => !p.name || !p.quantity) || !entryDate || !deliveryDate || !receivingDate) {
      return;
    }
    
    // Convert products to the correct format
    const formattedProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      type: p.type || 'غير محدد',
      quantity: parseInt(p.quantity) || 0
    }));
    
    const newOrder = {
      client,
      product: formattedProducts[0], // Keep the first product as the main one for backward compatibility
      products: formattedProducts,
      totalQuantity: getTotalQuantity(),
      entryDate,
      deliveryDate,
      receivingDate,
      status: 'pending' as 'completed' | 'pending', // Use type assertion to match the expected type
      completionPercentage: 0,
      assignedWorkers: []
    };
    
    addOrder(newOrder);
    navigate('/orders');
  };
  
  return (
    <div className="container mx-auto px-4 py-6" dir="rtl">
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
          
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">بيانات المنتجات</h4>
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={addProduct}
                className="flex items-center gap-1"
              >
                <Plus size={14} />
                إضافة منتج
              </Button>
            </div>
            
            {products.map((product, index) => (
              <div key={product.id} className="border p-3 rounded-md mb-3">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">منتج {index + 1}</span>
                  {products.length > 1 && (
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeProduct(product.id)}
                      className="text-red-500 hover:text-red-700 p-1 h-auto"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor={`product-name-${product.id}`}>اسم المنتج</Label>
                    <Input 
                      id={`product-name-${product.id}`}
                      value={product.name}
                      onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                      className="mt-1 text-right"
                      dir="rtl"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`product-type-${product.id}`}>نوع المنتج</Label>
                    <Input 
                      id={`product-type-${product.id}`}
                      value={product.type}
                      onChange={(e) => updateProduct(product.id, 'type', e.target.value)}
                      className="mt-1 text-right"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`product-quantity-${product.id}`}>الكمية</Label>
                    <Input 
                      id={`product-quantity-${product.id}`}
                      type="number"
                      value={product.quantity}
                      onChange={(e) => updateProduct(product.id, 'quantity', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-2 text-right">
              <span className="font-medium">إجمالي الكمية: {getTotalQuantity()} قطعة</span>
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
