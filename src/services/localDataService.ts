
import { Employee } from "@/types/employee";
import { Department } from "@/types/department";
import { Order } from "@/types/order";
import { ProductionRecord } from "@/types/production";
import { initialEmployees, initialOrders, initialDepartments, initialProductionHistory } from "@/data/initial-data";

// دالة مساعدة لتحميل البيانات الأولية
const loadInitialData = <T>(key: string, initialData: T[]): T[] => {
  const existingData = localStorage.getItem(key);
  if (!existingData) {
    localStorage.setItem(key, JSON.stringify(initialData));
    console.log(`تم تحميل البيانات الأولية لـ ${key}:`, initialData.length, 'عنصر');
    return initialData;
  }
  return JSON.parse(existingData);
};

// خدمة إدارة الموظفين
export const employeeService = {
  async getAll(): Promise<Employee[]> {
    try {
      return loadInitialData('employees', initialEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      return initialEmployees;
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
      console.log('تم إنشاء موظف جديد:', newEmployee);
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
      console.log('تم تحديث بيانات الموظف:', employee);
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
      console.log('تم حذف الموظف:', id);
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
      return loadInitialData('departments', initialDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      return initialDepartments;
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
      console.log('تم إنشاء قسم جديد:', newDepartment);
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
      return loadInitialData('orders', initialOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return initialOrders;
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
      console.log('تم إنشاء طلب جديد:', newOrder);
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
      console.log('تم تحديث الطلب:', order);
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
      return loadInitialData('productionHistory', initialProductionHistory);
    } catch (error) {
      console.error('Error fetching production history:', error);
      return initialProductionHistory;
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
      console.log('تم إنشاء سجل إنتاج جديد:', newRecord);
      return newRecord;
    } catch (error) {
      console.error('Error creating production record:', error);
      throw error;
    }
  },
};
