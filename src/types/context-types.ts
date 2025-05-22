
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
  addEmployee: (employee: Omit<Employee, "id">) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (employeeId: string) => void;
  addOrder: (order: Omit<Order, "id">) => void;
  updateOrder: (order: Order) => void;
  addDepartment: (department: Omit<Department, "id">) => void;
  getEmployeesByDepartment: (departmentId: string) => Employee[];
  getOrdersByClient: (client: string) => Order[];
  getTotalProduction: () => number;
  getPendingOrdersCount: () => number;
  getOrderCompletionTarget: () => number;
  getCurrentDate: () => string;
  getAvailableEmployees: () => Employee[];
  assignEmployeeToOrder: (employeeId: string, orderId: string) => void;
  addProductionRecord: (employeeId: string, quantity: number, orderId: string) => void;
  getEmployeeProductionHistory: (employeeId: string) => ProductionRecord[];
  getPreviousMonthProduction: () => number;
  calculateEmployeeBonus: (employee: Employee) => number;
  // Inventory functions
  addInventoryItem: (item: Omit<InventoryItem, "id" | "lastUpdated">) => InventoryItem;
  updateInventoryItem: (item: InventoryItem) => InventoryItem;
  deleteInventoryItem: (itemId: string) => string;
  addInventoryTransaction: (transaction: Omit<InventoryTransaction, "id" | "date">) => InventoryTransaction;
  getLowInventoryItems: () => InventoryItem[];
  getTotalInventoryValue: () => number;
  getRawMaterialsValue: () => number;
  getFinishedProductsValue: () => number;
  getItemTransactions: (itemId: string) => InventoryTransaction[];
}
