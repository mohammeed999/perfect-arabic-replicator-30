
import { Employee } from '@/types/employee';
import { Order } from '@/types/order';
import { Department } from '@/types/department';
import { ProductionRecord } from '@/types/production';
import { InventoryItem, InventoryTransaction } from '@/types/inventory';

// Employee Service
export const employeeService = {
  async getAll(): Promise<Employee[]> {
    const data = localStorage.getItem('employees');
    return data ? JSON.parse(data) : [];
  },

  async create(employee: Omit<Employee, "id">): Promise<Employee> {
    const employees = await this.getAll();
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
    };
    employees.push(newEmployee);
    localStorage.setItem('employees', JSON.stringify(employees));
    return newEmployee;
  },

  async update(employee: Employee): Promise<Employee> {
    const employees = await this.getAll();
    const index = employees.findIndex(emp => emp.id === employee.id);
    if (index !== -1) {
      employees[index] = employee;
      localStorage.setItem('employees', JSON.stringify(employees));
    }
    return employee;
  },

  async delete(employeeId: string): Promise<void> {
    const employees = await this.getAll();
    const filteredEmployees = employees.filter(emp => emp.id !== employeeId);
    localStorage.setItem('employees', JSON.stringify(filteredEmployees));
  }
};

// Order Service
export const orderService = {
  async getAll(): Promise<Order[]> {
    const data = localStorage.getItem('orders');
    return data ? JSON.parse(data) : [];
  },

  async create(order: Omit<Order, "id">): Promise<Order> {
    const orders = await this.getAll();
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
    };
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    return newOrder;
  },

  async update(order: Order): Promise<Order> {
    const orders = await this.getAll();
    const index = orders.findIndex(ord => ord.id === order.id);
    if (index !== -1) {
      orders[index] = order;
      localStorage.setItem('orders', JSON.stringify(orders));
    }
    return order;
  },

  async delete(orderId: string): Promise<void> {
    const orders = await this.getAll();
    const filteredOrders = orders.filter(ord => ord.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(filteredOrders));
  }
};

// Department Service
export const departmentService = {
  async getAll(): Promise<Department[]> {
    const data = localStorage.getItem('departments');
    return data ? JSON.parse(data) : [];
  },

  async create(department: Omit<Department, "id">): Promise<Department> {
    const departments = await this.getAll();
    const newDepartment: Department = {
      ...department,
      id: Date.now().toString(),
    };
    departments.push(newDepartment);
    localStorage.setItem('departments', JSON.stringify(departments));
    return newDepartment;
  }
};

// Production Service
export const productionService = {
  async getAll(): Promise<ProductionRecord[]> {
    const data = localStorage.getItem('productionRecords');
    return data ? JSON.parse(data) : [];
  },

  async create(record: Omit<ProductionRecord, "id">): Promise<ProductionRecord> {
    const records = await this.getAll();
    const newRecord: ProductionRecord = {
      ...record,
      id: Date.now().toString(),
    };
    records.push(newRecord);
    localStorage.setItem('productionRecords', JSON.stringify(records));
    return newRecord;
  }
};

// Inventory Service
export const inventoryService = {
  async getAll(): Promise<InventoryItem[]> {
    const data = localStorage.getItem('inventory');
    return data ? JSON.parse(data) : [];
  },

  async create(item: Omit<InventoryItem, "id" | "lastUpdated">): Promise<InventoryItem> {
    const inventory = await this.getAll();
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    };
    inventory.push(newItem);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    return newItem;
  },

  async update(item: InventoryItem): Promise<InventoryItem> {
    const inventory = await this.getAll();
    const index = inventory.findIndex(inv => inv.id === item.id);
    if (index !== -1) {
      inventory[index] = { ...item, lastUpdated: new Date().toISOString() };
      localStorage.setItem('inventory', JSON.stringify(inventory));
    }
    return item;
  },

  async delete(itemId: string): Promise<void> {
    const inventory = await this.getAll();
    const filteredInventory = inventory.filter(item => item.id !== itemId);
    localStorage.setItem('inventory', JSON.stringify(filteredInventory));
  }
};

// Transaction Service
export const transactionService = {
  async getAll(): Promise<InventoryTransaction[]> {
    const data = localStorage.getItem('transactions');
    return data ? JSON.parse(data) : [];
  },

  async create(transaction: Omit<InventoryTransaction, "id" | "date">): Promise<InventoryTransaction> {
    const transactions = await this.getAll();
    const newTransaction: InventoryTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    return newTransaction;
  }
};
