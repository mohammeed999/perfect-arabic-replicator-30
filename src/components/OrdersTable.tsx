
import React from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '@/types/order';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Calendar, Package, Eye, TrendingUp } from 'lucide-react';

interface OrdersTableProps {
  orders: Order[];
  formattedDate: string;
}

export const OrdersTable = ({ orders, formattedDate }: OrdersTableProps) => {
  console.log('OrdersTable received orders:', orders);

  // Get status display info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { 
          text: 'مكتمل', 
          class: 'bg-green-100 text-green-800 border-green-200',
          icon: '✅'
        };
      case 'in-progress':
        return { 
          text: 'قيد التنفيذ', 
          class: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: '🔄'
        };
      case 'pending':
        return { 
          text: 'معلق', 
          class: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: '⏳'
        };
      default:
        return { 
          text: status, 
          class: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '❓'
        };
    }
  };

  // Check if order is near deadline
  const isNearDeadline = (deliveryDate: string) => {
    const today = new Date();
    const dueDate = new Date(deliveryDate);
    const daysDifference = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysDifference <= 5 && daysDifference >= 0;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            أحدث الطلبات - {formattedDate}
          </h2>
          <p className="text-sm text-gray-500 mt-1">عرض آخر {orders.length} طلبات</p>
        </div>
        <Link to="/orders">
          <Button variant="outline" className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50">
            <Eye className="h-4 w-4" />
            عرض الكل
          </Button>
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <div className="p-12 text-center bg-gray-50 rounded-lg">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4 text-lg">لا توجد طلبات حتى الآن</p>
            <Link to="/orders/add">
              <Button className="bg-blue-500 hover:bg-blue-600">
                إضافة أول طلب
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-right font-semibold text-gray-700">العميل</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">المنتج</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">تاريخ التسليم</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">الكمية</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">نسبة الإنجاز</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">الحالة</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const displayCompletion = order.status === 'completed' ? 100 : (order.completionPercentage || 0);
                const statusInfo = getStatusInfo(order.status);
                const nearDeadline = isNearDeadline(order.deliveryDate);
                
                return (
                  <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {order.client}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        {order.product?.name || 'غير محدد'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-2 ${nearDeadline ? 'text-red-600' : 'text-gray-700'}`}>
                        <Calendar className="h-4 w-4" />
                        <span className={nearDeadline ? 'font-bold' : ''}>{order.deliveryDate}</span>
                        {nearDeadline && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">عاجل</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-blue-600">{order.totalQuantity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium min-w-[40px]">{displayCompletion}%</span>
                        <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              displayCompletion === 100 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                              'bg-gradient-to-r from-blue-500 to-blue-600'
                            }`}
                            style={{ width: `${displayCompletion}%` }} 
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.class}`}>
                        <span>{statusInfo.icon}</span>
                        {statusInfo.text}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link to={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                          <Eye className="h-4 w-4 ml-1" />
                          تفاصيل
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
