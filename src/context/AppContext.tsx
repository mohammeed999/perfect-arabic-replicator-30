
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee } from '@/types/employee';
import { Order } from '@/types/order';
import { Department } from '@/types/department';
import { ProductionRecord } from '@/types/production';
import { InventoryItem, InventoryTransaction } from '@/types/inventory';
import { AppContextType } from '@/types/context-types';
import { employeeService, departmentService, orderService, productionService } from '@/services/localDataService';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [productionHistory, setProductionHistory] = useState<ProductionRecord[]>([]);
  const [previousMonthProduction, setPreviousMonthProduction] = useState<number>(0);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    const loadData = async () => {
      try {
        const [employeesData, ordersData, departmentsData, productionData] = await Promise.all([
          employeeService.getAll(),
          orderService.getAll(),
          departmentService.getAll(),
          productionService.getAll()
        ]);

        setEmployees(employeesData);
        setOrders(ordersData);
        setDepartments(departmentsData);
        setProductionHistory(productionData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const addEmployee = async (employee: Omit<Employee, "id">) => {
    const newEmployee = await employeeService.create(employee);
    if (newEmployee) {
      setEmployees(prev => [...prev, newEmployee]);
    }
  };

  const updateEmployee = async (employee: Employee) => {
    const updatedEmployee = await employeeService.update(employee);
    if (updatedEmployee) {
      setEmployees(prev => prev.map(emp => emp.id === employee.id ? updatedEmployee : emp));
    }
  };

  const deleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  };

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

  const addDepartment = async (department: Omit<Department, "id">) => {
    const newDepartment = await departmentService.create(department);
    if (newDepartment) {
      setDepartments(prev => [...prev, newDepartment]);
    }
  };

  const getEmployeesByDepartment = (departmentId: string): Employee[] => {
    return employees.filter(emp => emp.department === departmentId);
  };

  const getOrdersByClient = (client: string): Order[] => {
    return orders.filter(order => order.client === client);
  };

  const getTotalProduction = (): number => {
    return employees.reduce((total, emp) => total + emp.production, 0);
  };

  const getPendingOrdersCount = (): number => {
    return orders.filter(order => order.status === 'pending').length;
  };

  const getOrderCompletionTarget = (): number => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    return totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
  };

  const getCurrentDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  const getAvailableEmployees = (): Employee[] => {
    return employees.filter(emp => emp.status === 'حاضر' && !emp.currentOrder);
  };

  const assignEmployeeToOrder = (employeeId: string, orderId: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, currentOrder: orderId } : emp
    ));
  };

  const addProductionRecord = async (employeeId: string, quantity: number, orderId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    const order = orders.find(ord => ord.id === orderId);
    
    if (employee && order) {
      const record: Omit<ProductionRecord, 'id'> = {
        employeeId,
        date: getCurrentDate(),
        quantity,
        orderId,
        orderDetails: `إنتاج ${order.product.name}`
      };

      const newRecord = await productionService.create(record);
      if (newRecord) {
        setProductionHistory(prev => [...prev, newRecord]);
        
        // تحديث إنتاج الموظف
        setEmployees(prev => prev.map(emp => 
          emp.id === employeeId 
            ? { ...emp, production: emp.production + quantity }
            : emp
        ));
      }
    }
  };

  const getEmployeeProductionHistory = (employeeId: string): ProductionRecord[] => {
    return productionHistory.filter(record => record.employeeId === employeeId);
  };

  const getPreviousMonthProduction = (): number => {
    return previousMonthProduction;
  };

  const calculateEmployeeBonus = (employee: Employee): number => {
    const performanceRatio = employee.production / employee.dailyTarget;
    if (performanceRatio >= 1.2) return 20;
    if (performanceRatio >= 1.1) return 15;
    if (performanceRatio >= 1.0) return 10;
    return 0;
  };

  // وظائف المخزون
  const addInventoryItem = (item: Omit<InventoryItem, "id" | "lastUpdated">): InventoryItem => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      lastUpdated: new Date().toISOString()
    };
    setInventory(prev => [...prev, newItem]);
    return newItem;
  };

  const updateInventoryItem = (item: InventoryItem): InventoryItem => {
    const updatedItem = { ...item, lastUpdated: new Date().toISOString() };
    setInventory(prev => prev.map(invItem => invItem.id === item.id ? updatedItem : invItem));
    return updatedItem;
  };

  const deleteInventoryItem = (itemId: string): string => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
    return itemId;
  };

  const addInventoryTransaction = (transaction: Omit<InventoryTransaction, "id" | "date">): InventoryTransaction => {
    const newTransaction: InventoryTransaction = {
      ...transaction,
      id: `trans-${Date.now()}`,
      date: new Date().toISOString()
    };
    setTransactions(prev => [...prev, newTransaction]);
    return newTransaction;
  };

  const getLowInventoryItems = (): InventoryItem[] => {
    return inventory.filter(item => item.quantity <= item.minQuantity);
  };

  const getTotalInventoryValue = (): number => {
    return inventory.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const getRawMaterialsValue = (): number => {
    return inventory
      .filter(item => item.category === 'مواد خام')
      .reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const getFinishedProductsValue = (): number => {
    return inventory
      .filter(item => item.category === 'منتجات جاهزة')
      .reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const getItemTransactions = (itemId: string): InventoryTransaction[] => {
    return transactions.filter(transaction => transaction.itemId === itemId);
  };

  const value: AppContextType = {
    employees,
    orders,
    departments,
    productionHistory,
    previousMonthProduction,
    inventory,
    transactions,
    addEmployee,
    updateEmployee,
    deleteEmployee,
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
    assignEmployeeToOrder,
    addProductionRecord,
    getEmployeeProductionHistory,
    getPreviousMonthProduction,
    calculateEmployeeBonus,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addInventoryTransaction,
    getLowInventoryItems,
    getTotalInventoryValue,
    getRawMaterialsValue,
    getFinishedProductsValue,
    getItemTransactions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
