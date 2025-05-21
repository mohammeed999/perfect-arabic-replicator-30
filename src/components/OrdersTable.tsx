
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
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">طلبات اليوم - {formattedDate}</h2>
        </div>
        <Link to="/orders">
          <Button className="text-blue-500" variant="link">
            عرض الكل
          </Button>
        </Link>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-md shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">تاريخ تسليم الطلب</TableHead>
              <TableHead className="text-right">الكمية</TableHead>
              <TableHead className="text-right">نسبة الإنجاز</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.client}</TableCell>
                <TableCell>{order.deliveryDate}</TableCell>
                <TableCell>{order.totalQuantity}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="ml-2">{order.completionPercentage}%</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${order.completionPercentage}%` }} 
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
                  <Link to={`/orders/${order.id}`} className="text-blue-500 hover:underline">تفاصيل</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
