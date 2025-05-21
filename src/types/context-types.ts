
import { Employee } from './employee';
import { Order } from './order';
import { Department } from './department';
import { ProductionRecord } from './production';

export interface AppContextType {
  employees: Employee[];
  orders: Order[];
  departments: Department[];
  productionHistory: ProductionRecord[];
  previousMonthProduction: number;
  addEmployee: (employee: Omit<Employee, "id">) => void;
  updateEmployee: (employee: Employee) => void;
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
}
