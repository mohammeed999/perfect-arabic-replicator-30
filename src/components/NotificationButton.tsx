
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export const NotificationButton = () => {
  const { orders } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  // Get orders that are near deadline (10 days or less) and not completed
  const today = new Date();
  const nearDeadlineOrders = orders.filter(order => {
    if (!order.deliveryDate || order.status === 'completed') return false;
    
    const dueDate = new Date(order.deliveryDate);
    const daysDifference = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDifference <= 10 && daysDifference >= 0;
  });

  const getUrgencyColor = (days: number) => {
    if (days <= 3) return 'bg-red-100 text-red-800';
    if (days <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getUrgencyText = (days: number) => {
    if (days === 0) return 'اليوم!';
    if (days === 1) return 'غداً';
    return `خلال ${days} أيام`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="h-5 w-5" />
          {nearDeadlineOrders.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {nearDeadlineOrders.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-800">التنبيهات</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {nearDeadlineOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>لا توجد تنبيهات جديدة</p>
              </div>
            ) : (
              <div className="p-2">
                {nearDeadlineOrders.map((order) => {
                  const dueDate = new Date(order.deliveryDate);
                  const daysDifference = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={order.id} className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{order.client}</p>
                          <p className="text-sm text-gray-600">{order.product.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            الكمية: {order.totalQuantity} | التقدم: {order.completionPercentage || 0}%
                          </p>
                        </div>
                        <Badge className={`ml-2 ${getUrgencyColor(daysDifference)}`}>
                          {getUrgencyText(daysDifference)}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
