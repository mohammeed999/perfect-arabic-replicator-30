
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowRight, User, Calendar, Package, TrendingUp } from 'lucide-react';
import AssignWorkerForm from '@/components/AssignWorkerForm';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, employees } = useAppContext();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  const order = orders.find(order => order.id === id);
  
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-6" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">الطلب غير موجود</h1>
          <Link to="/orders">
            <Button>العودة إلى الطلبات</Button>
          </Link>
        </div>
      </div>
    );
  }

  // الحصول على العمال المكلفين بهذا الطلب
  const assignedEmployees = employees.filter(emp => 
    emp.currentOrder === order.id || 
    (order.assignedWorkers && order.assignedWorkers.includes(emp.id))
  );

  const displayCompletion = order.status === 'completed' ? 100 : (order.completionPercentage || 0);
  
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: 'مكتمل', class: 'bg-green-100 text-green-800', icon: '✅' };
      case 'in-progress':
        return { text: 'قيد التنفيذ', class: 'bg-blue-100 text-blue-800', icon: '🔄' };
      case 'pending':
        return { text: 'معلق', class: 'bg-amber-100 text-amber-800', icon: '⏳' };
      default:
        return { text: 'غير محدد', class: 'bg-gray-100 text-gray-800', icon: '❓' };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="container mx-auto px-4 py-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link to="/orders">
            <Button variant="outline" className="flex items-center gap-1">
              <ArrowRight size={18} />
              العودة
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">تفاصيل الطلب</h1>
        </div>
        
        {order.status !== 'completed' && (
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2">
                <User size={18} />
                تكليف عامل
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
              <DialogHeader>
                <DialogTitle>تكليف عامل للطلب</DialogTitle>
              </DialogHeader>
              <AssignWorkerForm 
                orderId={order.id} 
                onClose={() => setIsAssignDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* معلومات الطلب الأساسية */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            معلومات الطلب
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">العميل</label>
              <p className="text-lg font-semibold">{order.client}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">الحالة</label>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.class}`}>
                <span>{statusInfo.icon}</span>
                {statusInfo.text}
              </span>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">المنتج</label>
              <p className="text-lg">{order.product?.name || 'غير محدد'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">النوع</label>
              <p className="text-lg">{order.product?.type || 'غير محدد'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">الكمية الإجمالية</label>
              <p className="text-lg font-semibold text-blue-600">{order.totalQuantity}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">نسبة الإنجاز</label>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">{displayCompletion}%</span>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      displayCompletion === 100 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                      'bg-gradient-to-r from-blue-500 to-blue-600'
                    }`}
                    style={{ width: `${displayCompletion}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* التواريخ المهمة */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            التواريخ المهمة
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">تاريخ الإدخال</label>
              <p className="text-lg">{order.entryDate}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">موعد التسليم</label>
              <p className="text-lg font-semibold text-orange-600">{order.deliveryDate}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">موعد الاستلام</label>
              <p className="text-lg">{order.receivingDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* العمال المكلفين */}
      {assignedEmployees.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-purple-600" />
            العمال المكلفين
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedEmployees.map((employee) => (
              <div key={employee.id} className="p-4 border rounded-lg">
                <h3 className="font-semibold">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.department}</p>
                <p className="text-sm">الحالة: {employee.status}</p>
                <p className="text-sm">الإنتاج: {employee.production}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
