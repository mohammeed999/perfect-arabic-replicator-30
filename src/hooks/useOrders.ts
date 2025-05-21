
import { useState } from 'react';
import { Order } from '../types/order';
import { initialOrders } from '../data/initial-data';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const addOrder = (order: Omit<Order, "id">) => {
    const newOrder = {
      ...order,
      id: `${orders.length + 1}`
    };
    setOrders([...orders, newOrder]);
    return newOrder;
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  };

  const getOrdersByClient = (client: string) => {
    return orders.filter(order => order.client === client);
  };

  const getPendingOrdersCount = () => {
    return orders.filter(order => order.status === 'pending').length;
  };

  const getOrderCompletionTarget = () => {
    // Example calculation - 87% as shown in screenshots
    return 87;
  };

  return {
    orders,
    setOrders,
    addOrder,
    updateOrder,
    getOrdersByClient,
    getPendingOrdersCount,
    getOrderCompletionTarget
  };
};
