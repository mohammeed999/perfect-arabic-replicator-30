
import { Product } from './product';
import type { Json } from '@/integrations/supabase/types';

export interface Order {
  id: string;
  client: string;
  product: Product;
  products?: Product[]; // For multiple products
  totalQuantity: number;
  entryDate: string;
  deliveryDate: string;
  receivingDate: string;
  status: 'completed' | 'pending' | 'in-progress'; // إضافة حالة قيد التنفيذ
  completionPercentage: number;
  assignedWorkers?: string[]; // IDs of assigned workers
}

// Database schema type for Order
export interface OrderDB {
  id: string;
  client: string;
  product: Json;
  total_quantity: number;
  entry_date: string;
  delivery_date: string;
  receiving_date: string;
  status: string;
  completion_percentage: number | null;
  assigned_workers: string[] | null;
  created_at: string | null;
}

// Mapping functions between DB and app models
export function dbToOrderModel(dbOrder: OrderDB): Order {
  return {
    id: dbOrder.id,
    client: dbOrder.client,
    product: dbOrder.product as unknown as Product,
    totalQuantity: dbOrder.total_quantity,
    entryDate: dbOrder.entry_date,
    deliveryDate: dbOrder.delivery_date,
    receivingDate: dbOrder.receiving_date,
    status: dbOrder.status as 'completed' | 'pending' | 'in-progress',
    completionPercentage: dbOrder.completion_percentage || 0,
    assignedWorkers: dbOrder.assigned_workers || []
  };
}

export function orderToDbModel(order: Order | Omit<Order, "id">): Partial<OrderDB> {
  return {
    client: order.client,
    product: order.product as unknown as Json,
    total_quantity: order.totalQuantity,
    entry_date: order.entryDate,
    delivery_date: order.deliveryDate,
    receiving_date: order.receivingDate,
    status: order.status,
    completion_percentage: order.completionPercentage,
    assigned_workers: order.assignedWorkers,
    ...(('id' in order) ? { id: order.id } : {})
  };
}
