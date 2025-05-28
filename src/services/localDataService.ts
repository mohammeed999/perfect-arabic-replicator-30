import { Employee } from "@/types/employee";
import { Department } from "@/types/department";
import { Order } from "@/types/order";
import { ProductionRecord } from "@/types/production";

// خدمة إدارة الموظفين
export const employeeService = {
  async getAll(): Promise<Employee[]> {
    try {
      const data = localStorage.getItem('employees');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  },

  async create(employee: Omit<Employee, 'id'>): Promise<Employee> {
    try {
      const employees = await this.getAll();
      const newEmployee: Employee = {
        ...employee,
        id: Date.now().toString(),
      };
      localStorage.setItem('employees', JSON.stringify([...employees, newEmployee]));
      return newEmployee;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  async update(employee: Employee): Promise<Employee> {
    try {
      const employees = await this.getAll();
      const updatedEmployees = employees.map(emp => emp.id === employee.id ? employee : emp);
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      return employee;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const employees = await this.getAll();
      const filteredEmployees = employees.filter(emp => emp.id !== id);
      localStorage.setItem('employees', JSON.stringify(filteredEmployees));
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }
};

// خدمة إدارة الأقسام
export const departmentService = {
  async getAll(): Promise<Department[]> {
    try {
      const data = localStorage.getItem('departments');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  },

  async create(department: Omit<Department, 'id'>): Promise<Department> {
    try {
      const departments = await this.getAll();
      const newDepartment: Department = {
        ...department,
        id: Date.now().toString(),
      };
      localStorage.setItem('departments', JSON.stringify([...departments, newDepartment]));
      return newDepartment;
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  },
};

// خدمة إدارة الطلبات
export const orderService = {
  async getAll(): Promise<Order[]> {
    try {
      const data = localStorage.getItem('orders');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  async create(order: Omit<Order, 'id'>): Promise<Order> {
    try {
      const orders = await this.getAll();
      const newOrder: Order = {
        ...order,
        id: Date.now().toString(),
      };
      localStorage.setItem('orders', JSON.stringify([...orders, newOrder]));
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async update(order: Order): Promise<Order> {
    try {
      const orders = await this.getAll();
      const updatedOrders = orders.map(ord => ord.id === order.id ? order : ord);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return order;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },
};

// خدمة إدارة سجلات الإنتاج
export const productionService = {
  async getAll(): Promise<ProductionRecord[]> {
    try {
      const data = localStorage.getItem('productionHistory');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error fetching production history:', error);
      return [];
    }
  },

  async create(record: Omit<ProductionRecord, 'id'>): Promise<ProductionRecord> {
    try {
      const productionHistory = await this.getAll();
      const newRecord: ProductionRecord = {
        ...record,
        id: Date.now().toString(),
      };
      localStorage.setItem('productionHistory', JSON.stringify([...productionHistory, newRecord]));
      return newRecord;
    } catch (error) {
      console.error('Error creating production record:', error);
      throw error;
    }
  },
};
