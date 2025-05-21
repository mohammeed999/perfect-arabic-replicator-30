
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const { orders } = useAppContext();
  const navigate = useNavigate();
  
  // البحث عن الطلب بناءً على المعرف
  const order = orders.find(o => o.id === id);
  
  // إذا لم يتم العثور على الطلب، يتم العودة إلى صفحة الطلبات
  useEffect(() => {
    if (!order) {
      navigate('/orders');
    }
  }, [order, navigate]);
  
  if (!order) return null;

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
          <h1 className="text-2xl font-bold">تفاصيل الطلب: {order.client}</h1>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">معلومات الطلب</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">العميل</p>
                <p className="font-medium">{order.client}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">المنتج</p>
                <p className="font-medium">{order.product.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">الكمية</p>
                <p className="font-medium">{order.totalQuantity} قطعة</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">الحالة</p>
                <p className="font-medium">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status === 'completed' ? 'مكتمل' : 'قيد التنفيذ'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">مواعيد الطلب</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">تاريخ الإدخال</p>
                <p className="font-medium">{order.entryDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">موعد التسليم</p>
                <p className="font-medium">{order.deliveryDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">موعد الاستلام</p>
                <p className="font-medium">{order.receivingDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">نسبة الإنجاز</p>
                <div className="flex items-center">
                  <span className="mr-2">{order.completionPercentage}%</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${order.completionPercentage}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
