
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for our data
export interface Employee {
  id: string;
  name: string;
  department: string;
  dailyTarget: number;
  production: number;
  bonusPercentage: number;
  monthlyProduction: number;
  status: string;
  currentOrder?: string;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  quantity: number;
}

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

export interface Department {
  id: string;
  name: string;
  employeeCount: number;
}

interface AppContextType {
  employees: Employee[];
  orders: Order[];
  departments: Department[];
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Initialize sample data
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'سيد محمد',
      department: 'التجميع',
      dailyTarget: 100,
      production: 4000,
      bonusPercentage: 5,
      monthlyProduction: 4000,
      status: 'يعمل في طلب تلاجه',
      currentOrder: '3'
    },
    {
      id: '2',
      name: 'هاله علي',
      department: 'التغليف',
      dailyTarget: 200,
      production: 500,
      bonusPercentage: 5,
      monthlyProduction: 500,
      status: 'يعمل في طلب الوزيري',
      currentOrder: '2'
    },
    {
      id: '3',
      name: 'أحمد محمود',
      department: 'التجميع',
      dailyTarget: 150,
      production: 300,
      bonusPercentage: 5,
      monthlyProduction: 300,
      status: 'غائب'
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      client: 'شيخون',
      product: { id: '1', name: 'جراب أيفون 13', type: 'هاتف', quantity: 200 },
      products: [
        { id: '1', name: 'جراب أيفون 13', type: 'هاتف', quantity: 200 }
      ],
      totalQuantity: 200,
      entryDate: '٢٠٢٥/٠٥/٠٩',
      deliveryDate: '٢٠٢٥/٠٥/٢٤',
      receivingDate: '٢٠٢٥/٠٥/٢٤',
      status: 'completed',
      completionPercentage: 100,
      assignedWorkers: []
    },
    {
      id: '2',
      client: 'الوزيري',
      product: { id: '2', name: 'جراب سامسونج S22', type: 'هاتف', quantity: 150 },
      products: [
        { id: '2', name: 'جراب سامسونج S22', type: 'هاتف', quantity: 150 }
      ],
      totalQuantity: 150,
      entryDate: '٢٠٢٥/٠٥/٠٩',
      deliveryDate: '٢٠٢٥/٠٥/٢٩',
      receivingDate: '٢٠٢٥/٠٥/٢٩',
      status: 'pending',
      completionPercentage: 75,
      assignedWorkers: ['2']
    },
    {
      id: '3',
      client: 'تلاجه',
      product: { id: '3', name: 'A16', type: 'جهاز', quantity: 80 },
      products: [
        { id: '3', name: 'A16', type: 'جهاز', quantity: 80 }
      ],
      totalQuantity: 80,
      entryDate: '٢٠٢٥/٠٥/٠٩',
      deliveryDate: '٢٠٢٥/٠٥/٠٣',
      receivingDate: '٢٠٢٥/٠٥/٠٣',
      status: 'pending',
      completionPercentage: 60,
      assignedWorkers: ['1']
    }
  ]);

  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'التجميع', employeeCount: 2 },
    { id: '2', name: 'التغليف', employeeCount: 1 }
  ]);

  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee = {
      ...employee,
      id: `${employees.length + 1}`
    };
    setEmployees([...employees, newEmployee]);
    
    // Update department employee count
    const departmentIndex = departments.findIndex(dept => dept.name === employee.department);
    if (departmentIndex !== -1) {
      const updatedDepartments = [...departments];
      updatedDepartments[departmentIndex].employeeCount += 1;
      setDepartments(updatedDepartments);
    }
  };

  const updateEmployee = (updatedEmployee: Employee) => {
    setEmployees(employees.map(employee => 
      employee.id === updatedEmployee.id ? updatedEmployee : employee
    ));
  };

  const addOrder = (order: Omit<Order, "id">) => {
    const newOrder = {
      ...order,
      id: `${orders.length + 1}`
    };
    setOrders([...orders, newOrder]);
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  };

  const addDepartment = (department: Omit<Department, "id">) => {
    const newDepartment = {
      ...department,
      id: `${departments.length + 1}`
    };
    setDepartments([...departments, newDepartment]);
  };

  const getEmployeesByDepartment = (departmentId: string) => {
    return employees.filter(employee => employee.department === departmentId);
  };

  const getOrdersByClient = (client: string) => {
    return orders.filter(order => order.client === client);
  };

  const getTotalProduction = () => {
    return employees.reduce((sum, employee) => sum + employee.production, 0);
  };

  const getPendingOrdersCount = () => {
    return orders.filter(order => order.status === 'pending').length;
  };

  const getOrderCompletionTarget = () => {
    // Example calculation - 87% as shown in screenshots
    return 87;
  };

  const getCurrentDate = () => {
    // Return date in Arabic format as shown in screenshots
    return 'الأربعاء، ٢١ مايو ٢٠٢٥';
  };

  const getAvailableEmployees = () => {
    return employees.filter(employee => !employee.currentOrder && employee.status !== 'غائب');
  };

  const assignEmployeeToOrder = (employeeId: string, orderId: string) => {
    // Update employee status
    const updatedEmployees = employees.map(employee => {
      if (employee.id === employeeId) {
        const order = orders.find(o => o.id === orderId);
        return {
          ...employee,
          status: order ? `يعمل في طلب ${order.client}` : employee.status,
          currentOrder: orderId
        };
      }
      return employee;
    });
    
    // Update order's assigned workers
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const assignedWorkers = order.assignedWorkers || [];
        if (!assignedWorkers.includes(employeeId)) {
          return {
            ...order,
            assignedWorkers: [...assignedWorkers, employeeId]
          };
        }
      }
      return order;
    });
    
    setEmployees(updatedEmployees);
    setOrders(updatedOrders);
  };

  const value = {
    employees,
    orders,
    departments,
    addEmployee,
    updateEmployee,
    addOrder,
    updateOrder,
    addDepartment,
    getEmployeesByDepartment,
    getOrdersByClient,
    getTotalProduction,
    getPendingOrdersCount,
    getOrderCompletionTarget,
    getCurrentDate,
    getAvailableEmployees,
    assignEmployeeToOrder
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
