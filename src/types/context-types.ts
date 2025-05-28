
import { Employee } from './employee';
import { Order } from './order';
import { Department } from './department';
import { ProductionRecord } from './production';
import { InventoryItem, InventoryTransaction } from './inventory';

export interface AppContextType {
  employees: Employee[];
  orders: Order[];
  departments: Department[];
  productionHistory: ProductionRecord[];
  previousMonthProduction: number;
  inventory: InventoryItem[];
  transactions: InventoryTransaction[];
  addEmployee: (employee: Omit<Employee, "id">) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (employeeId: string) => Promise<void>;
  addOrder: (order: Omit<Order, "id">) => Promise<void>;
  updateOrder: (order: Order) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  addDepartment: (department: Omit<Department, "id">) => Promise<void>;
  getEmployeesByDepartment: (departmentId: string) => Employee[];
  getOrdersByClient: (client: string) => Order[];
  getTotalProduction: () => number;
  getPendingOrdersCount: () => number;
  getOrderCompletionTarget: () => number;
  getCurrentDate: () => string;
  getAvailableEmployees: () => Employee[];
  assignEmployeeToOrder: (employeeId: string, orderId: string) => Promise<void>;
  addProductionRecord: (employeeId: string, quantity: number, orderId: string) => Promise<void>;
  getEmployeeProductionHistory: (employeeId: string) => ProductionRecord[];
  getPreviousMonthProduction: () => number;
  calculateEmployeeBonus: (employee: Employee) => number;
  // Inventory functions
  addInventoryItem: (item: Omit<InventoryItem, "id" | "lastUpdated">) => Promise<InventoryItem | null>;
  updateInventoryItem: (item: InventoryItem) => Promise<InventoryItem | null>;
  deleteInventoryItem: (itemId: string) => Promise<void>;
  addInventoryTransaction: (transaction: Omit<InventoryTransaction, "id" | "date">) => Promise<InventoryTransaction | null>;
  getLowInventoryItems: () => InventoryItem[];
  getTotalInventoryValue: () => number;
  getRawMaterialsValue: () => number;
  getFinishedProductsValue: () => number;
  getItemTransactions: (itemId: string) => InventoryTransaction[];
}
