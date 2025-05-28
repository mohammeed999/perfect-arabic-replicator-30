
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order } from '@/types/order';
import { orderService } from '@/services/localDataService';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id">) => Promise<void>;
  updateOrder: (order: Order) => Promise<void>;
  getOrdersByClient: (client: string) => Order[];
  getPendingOrdersCount: () => number;
  getOrderCompletionTarget: () => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export function OrderProvider({ children }: OrderProviderProps) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await orderService.getAll();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };

    loadOrders();
  }, []);

  const addOrder = async (order: Omit<Order, "id">) => {
    const newOrder = await orderService.create(order);
    if (newOrder) {
      setOrders(prev => [...prev, newOrder]);
    }
  };

  const updateOrder = async (order: Order) => {
    const updatedOrder = await orderService.update(order);
    if (updatedOrder) {
      setOrders(prev => prev.map(ord => ord.id === order.id ? updatedOrder : ord));
    }
  };

  const getOrdersByClient = (client: string): Order[] => {
    return orders.filter(order => order.client === client);
  };

  const getPendingOrdersCount = (): number => {
    return orders.filter(order => order.status === 'pending').length;
  };

  const getOrderCompletionTarget = (): number => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    return totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
  };

  const value: OrderContextType = {
    orders,
    addOrder,
    updateOrder,
    getOrdersByClient,
    getPendingOrdersCount,
    getOrderCompletionTarget,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrderContext() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
}
