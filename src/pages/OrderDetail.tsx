
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Edit, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OrderDetail = () => {
  const { id } = useParams();
  const { orders, employees, updateOrder, getAvailableEmployees, assignEmployeeToOrder } = useAppContext();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isAssigningWorker, setIsAssigningWorker] = useState(false);
  const [editedOrder, setEditedOrder] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  
  // البحث عن الطلب بناءً على المعرف
  const order = orders.find(o => o.id === id);
  
  // Get all assigned employees to this order
  const assignedEmployees = employees.filter(emp => order?.assignedWorkers?.includes(emp.id));
  
  // Get all available employees that can be assigned
  const availableEmployees = getAvailableEmployees();
  
  // إذا لم يتم العثور على الطلب، يتم العودة إلى صفحة الطلبات
  useEffect(() => {
    if (!order) {
      navigate('/orders');
    } else if (!editedOrder) {
      setEditedOrder({
        ...order,
        products: order.products || [order.product],
      });
    }
  }, [order, navigate, editedOrder]);
  
  if (!order) return null;

  const handleSaveChanges = () => {
    if (editedOrder) {
      // Calculate total quantity from all products
      const totalQuantity = editedOrder.products.reduce((sum, product) => sum + product.quantity, 0);
      
      // Update the order
      updateOrder({
        ...editedOrder,
        totalQuantity,
        product: editedOrder.products[0] || order.product // Keep the first product as the main one for backward compatibility
      });
      
      setIsEditing(false);
    }
  };

  const handleAddProduct = () => {
    setEditedOrder({
      ...editedOrder,
      products: [
        ...editedOrder.products, 
        { 
          id: Date.now().toString(),
          name: '',
          type: '',
          quantity: 0
        }
      ]
    });
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = [...editedOrder.products];
    newProducts.splice(index, 1);
    setEditedOrder({
      ...editedOrder,
      products: newProducts
    });
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    const newProducts = [...editedOrder.products];
    newProducts[index] = {
      ...newProducts[index],
      [field]: field === 'quantity' ? parseInt(value) : value
    };
    setEditedOrder({
      ...editedOrder,
      products: newProducts
    });
  };

  const handleAssignWorker = () => {
    if (selectedEmployee && order.id) {
      assignEmployeeToOrder(selectedEmployee, order.id);
      setIsAssigningWorker(false);
      setSelectedEmployee('');
    }
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
          <h1 className="text-2xl font-bold">تفاصيل الطلب: {order.client}</h1>
        </div>
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1"
          >
            <Edit size={16} />
            تعديل
          </Button>
        ) : (
          <Button 
            onClick={handleSaveChanges}
            className="bg-green-500 hover:bg-green-600"
          >
            حفظ التغييرات
          </Button>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">معلومات الطلب</h3>
            <div className="space-y-3">
              <div>
                {isEditing ? (
                  <>
                    <Label htmlFor="client">العميل</Label>
                    <Input 
                      id="client" 
                      value={editedOrder.client}
                      onChange={(e) => setEditedOrder({...editedOrder, client: e.target.value})}
                      className="mt-1"
                      dir="rtl"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">العميل</p>
                    <p className="font-medium">{order.client}</p>
                  </>
                )}
              </div>
              
              {/* Products Section */}
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">المنتجات</p>
                  {isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddProduct}
                      className="flex items-center gap-1"
                    >
                      <Plus size={14} />
                      إضافة منتج
                    </Button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-4 mt-2">
                    {editedOrder.products.map((product, index) => (
                      <div key={product.id} className="border p-3 rounded-md">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">منتج {index + 1}</span>
                          {editedOrder.products.length > 1 && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveProduct(index)}
                              className="text-red-500 hover:text-red-700 p-1 h-auto"
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label htmlFor={`name-${index}`}>اسم المنتج</Label>
                            <Input 
                              id={`name-${index}`}
                              value={product.name}
                              onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                              className="mt-1"
                              dir="rtl"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`type-${index}`}>نوع المنتج</Label>
                            <Input 
                              id={`type-${index}`}
                              value={product.type}
                              onChange={(e) => handleProductChange(index, 'type', e.target.value)}
                              className="mt-1"
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
                              dir="ltr"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(order.products || [order.product]).map((product, index) => (
                      <div key={index} className="font-medium border p-2 rounded-md">
                        <div className="flex justify-between mb-1">
                          <span>{product.name}</span>
                          <span>{product.quantity} قطعة</span>
                        </div>
                        {product.type && (
                          <div className="text-sm text-gray-600">
                            النوع: {product.type}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm text-gray-600">الكمية الإجمالية</p>
                <p className="font-medium">{order.totalQuantity} قطعة</p>
              </div>
              
              <div>
                {isEditing ? (
                  <>
                    <Label htmlFor="status">الحالة</Label>
                    <Select 
                      value={editedOrder.status} 
                      onValueChange={(value) => setEditedOrder({...editedOrder, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">قيد التنفيذ</SelectItem>
                        <SelectItem value="completed">مكتمل</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                ) : (
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
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">مواعيد الطلب</h3>
            <div className="space-y-3">
              <div>
                {isEditing ? (
                  <>
                    <Label htmlFor="entryDate">تاريخ الإدخال</Label>
                    <Input 
                      id="entryDate" 
                      type="date"
                      value={editedOrder.entryDate} 
                      onChange={(e) => setEditedOrder({...editedOrder, entryDate: e.target.value})}
                      className="mt-1"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">تاريخ الإدخال</p>
                    <p className="font-medium">{order.entryDate}</p>
                  </>
                )}
              </div>
              <div>
                {isEditing ? (
                  <>
                    <Label htmlFor="deliveryDate">موعد التسليم</Label>
                    <Input 
                      id="deliveryDate" 
                      type="date"
                      value={editedOrder.deliveryDate} 
                      onChange={(e) => setEditedOrder({...editedOrder, deliveryDate: e.target.value})}
                      className="mt-1"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">موعد التسليم</p>
                    <p className="font-medium">{order.deliveryDate}</p>
                  </>
                )}
              </div>
              <div>
                {isEditing ? (
                  <>
                    <Label htmlFor="receivingDate">موعد الاستلام</Label>
                    <Input 
                      id="receivingDate" 
                      type="date"
                      value={editedOrder.receivingDate} 
                      onChange={(e) => setEditedOrder({...editedOrder, receivingDate: e.target.value})}
                      className="mt-1"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">موعد الاستلام</p>
                    <p className="font-medium">{order.receivingDate}</p>
                  </>
                )}
              </div>
              <div>
                {isEditing ? (
                  <>
                    <Label htmlFor="completionPercentage">نسبة الإنجاز</Label>
                    <Input 
                      id="completionPercentage" 
                      type="number"
                      min="0"
                      max="100"
                      value={editedOrder.completionPercentage} 
                      onChange={(e) => setEditedOrder({...editedOrder, completionPercentage: parseInt(e.target.value)})}
                      className="mt-1"
                    />
                  </>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Workers Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">العمال المكلفين بالطلب</h3>
          <Button 
            onClick={() => setIsAssigningWorker(true)}
            className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1"
            disabled={availableEmployees.length === 0}
          >
            <Plus size={16} />
            تكليف عامل
          </Button>
        </div>

        {assignedEmployees.length > 0 ? (
          <div className="space-y-3">
            {assignedEmployees.map(employee => (
              <div key={employee.id} className="border p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-gray-600">القسم: {employee.department}</p>
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800">
                    {employee.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">لا يوجد عمال مكلفين بهذا الطلب حاليًا</p>
        )}
      </div>

      {/* Dialog for assigning workers */}
      <Dialog open={isAssigningWorker} onOpenChange={setIsAssigningWorker}>
        <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>تكليف عامل للطلب</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="employee">اختر العامل</Label>
              <Select onValueChange={setSelectedEmployee} value={selectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="-- اختر عامل --" />
                </SelectTrigger>
                <SelectContent>
                  {availableEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button onClick={() => setIsAssigningWorker(false)} variant="outline" className="bg-gray-500 text-white hover:bg-gray-600">
                إلغاء
              </Button>
              <Button onClick={handleAssignWorker} className="bg-green-500 hover:bg-green-600">
                تكليف العامل
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetail;
