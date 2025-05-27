
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

interface OrdersTableProps {
  orders: Order[];
  formattedDate: string;
}

export const OrdersTable = ({ orders, formattedDate }: OrdersTableProps) => {
  console.log('OrdersTable received orders:', orders);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">أحدث الطلبات - {formattedDate}</h2>
          <p className="text-sm text-gray-500">عرض آخر {orders.length} طلبات</p>
        </div>
        <Link to="/orders">
          <Button className="text-blue-500" variant="link">
            عرض جميع الطلبات
          </Button>
        </Link>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-md shadow-sm">
        {orders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">لا توجد طلبات حتى الآن</p>
            <Link to="/orders/add">
              <Button className="bg-blue-500 hover:bg-blue-600">
                إضافة أول طلب
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">المنتج</TableHead>
                <TableHead className="text-right">تاريخ التسليم</TableHead>
                <TableHead className="text-right">الكمية</TableHead>
                <TableHead className="text-right">نسبة الإنجاز</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const displayCompletion = order.status === 'completed' ? 100 : (order.completionPercentage || 0);
                
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.client}</TableCell>
                    <TableCell>{order.product?.name || 'غير محدد'}</TableCell>
                    <TableCell>{order.deliveryDate}</TableCell>
                    <TableCell>{order.totalQuantity}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="ml-2">{displayCompletion}%</span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-full rounded-full ${
                              displayCompletion === 100 ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${displayCompletion}%` }} 
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-block py-1 px-3 rounded-full text-sm ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status === 'completed' ? 'مكتمل' : 'قيد التنفيذ'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link to={`/orders/${order.id}`} className="text-blue-500 hover:underline">
                        تفاصيل
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
