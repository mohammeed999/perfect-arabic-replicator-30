
import { Product } from './product';

export interface Order {
  id: string;
  client: string;
  product: Product;
  products?: Product[]; // For multiple products
  totalQuantity: number;
  entryDate: string;
  deliveryDate: string;
  receivingDate: string;
  status: 'completed' | 'pending';
  completionPercentage: number;
  assignedWorkers?: string[]; // IDs of assigned workers
}
