
import React, { createContext, useContext, ReactNode } from 'react';
import { AppContextType } from '../types/context-types';
import { Employee } from '../types/employee';
import { Order } from '../types/order';
import { Department } from '../types/department';
import { ProductionRecord } from '../types/production';
import { InventoryItem, InventoryTransaction } from '../types/inventory';
import { useEmployees } from '../hooks/useEmployees';
import { useDepartments } from '../hooks/useDepartments';
import { useOrders } from '../hooks/useOrders';
import { useProduction } from '../hooks/useProduction';
import { useInventory } from '../hooks/useInventory'; 
import { formatDateToArabic } from '../utils/date-formatter';
import { useToast } from '@/components/ui/use-toast';

// Create context with undefined initial value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook for using the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Export all types for use in other files
export type { Employee, Order, Department, ProductionRecord, InventoryItem, InventoryTransaction };

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Use our custom hooks
  const { 
    employees, 
    setEmployees,
    addEmployee, 
    updateEmployee: updateEmployeeBase,
    deleteEmployee: deleteEmployeeBase,
    getAvailableEmployees,
    calculateEmployeeBonus 
  } = useEmployees();
  
  const { 
    departments, 
    addDepartment, 
    updateDepartmentEmployeeCount 
  } = useDepartments();
  
  const { 
    orders, 
    setOrders,
    addOrder: addOrderBase, 
    updateOrder: updateOrderBase, 
    getOrdersByClient, 
    getPendingOrdersCount, 
    getOrderCompletionTarget 
  } = useOrders();
  
  const { 
    productionHistory,
    setProductionHistory,
    previousMonthProduction,
    addProductionRecord: addProductionRecordBase,
    getEmployeeProductionHistory,
    getTotalProduction,
    getPreviousMonthProduction 
  } = useProduction();

  const {
    inventory,
    transactions,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addTransaction: addInventoryTransaction,
    getLowInventoryItems,
    getTotalInventoryValue,
    getRawMaterialsValue,
    getFinishedProductsValue,
    getItemTransactions
  } = useInventory();
  
  const { toast } = useToast();

  // Check for low inventory items and show notifications
  React.useEffect(() => {
    const lowItems = getLowInventoryItems();
    
    if (lowItems.length > 0) {
      lowItems.forEach(item => {
        toast({
          title: "تنبيه مخزون منخفض",
          description: `${item.name} وصل للمستوى الحد الأدنى (${item.quantity} ${item.unit})`,
          variant: "destructive",
          duration: 5000
        });
      });
    }
  }, [inventory, toast]);

  const getEmployeesByDepartment = (departmentName: string) => {
    return employees.filter(employee => employee.department === departmentName);
  };

  const getCurrentDate = () => {
    return formatDateToArabic();
  };

  // Add order function that sets initial status as 'pending'
  const addOrder = (order: Omit<Order, "id">) => {
    const newOrder = {
      ...order,
      status: 'pending' as const,  // جديد دائماً يبدأ معلق
      assignedWorkers: []
    };
    return addOrderBase(newOrder);
  };

  // Update order to handle status transitions
  const updateOrder = (order: Order) => {
    const prevOrder = orders.find(o => o.id === order.id);
    const wasCompleted = prevOrder?.status === 'completed';
    const isNowCompleted = order.status === 'completed';
    
    // تحديث الطلب
    const updatedOrder = updateOrderBase(order);
    
    // إذا تغيرت حالة الطلب من قيد التنفيذ إلى مكتمل
    if (!wasCompleted && isNowCompleted && order.assignedWorkers?.length) {
      // تحديث حالة جميع العمال المرتبطين بالطلب إلى "متاح"
      const updatedEmployees = employees.map(employee => {
        if (order.assignedWorkers?.includes(employee.id) && employee.currentOrder === order.id) {
          return {
            ...employee,
            status: 'available',
            currentOrder: undefined
          };
        }
        return employee;
      });
      
      setEmployees(updatedEmployees);
      
      toast({
        title: "تم تحديث حالة العمال",
        description: `تم تحديث حالة العمال المرتبطين بالطلب إلى "متاح"`,
      });
      
      // إضافة المنتجات المكتملة إلى المخزون
      if (order.product && order.product.name && order.totalQuantity) {
        const existingProduct = inventory.find(
          item => item.category === 'finished' && item.name === order.product.name
        );
        
        if (existingProduct) {
          updateInventoryItem({
            ...existingProduct,
            quantity: existingProduct.quantity + order.totalQuantity
          });
          
          toast({
            title: "تم تحديث المخزون",
            description: `تمت إضافة ${order.totalQuantity} قطعة من ${order.product.name} إلى المخزون`,
          });
        } else {
          addInventoryItem({
            name: order.product.name,
            category: 'finished',
            quantity: order.totalQuantity,
            unit: 'قطعة',
            minimumLevel: Math.round(order.totalQuantity * 0.1),
            cost: order.product.price || 0
          });
          
          toast({
            title: "تم إضافة منتج جديد للمخزون",
            description: `تمت إضافة ${order.totalQuantity} قطعة من ${order.product.name} إلى المخزون`,
          });
        }
      }
    }
    
    return updatedOrder;
  };
  
  const updateEmployee = (employee: Employee) => {
    const updatedEmployee = updateEmployeeBase(employee);
    // Force re-render by updating state
    setEmployees(prev => prev.map(emp => emp.id === employee.id ? updatedEmployee : emp));
    return updatedEmployee;
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
    
    // Update order's assigned workers and change status to 'in-progress'
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const assignedWorkers = order.assignedWorkers || [];
        if (!assignedWorkers.includes(employeeId)) {
          return {
            ...order,
            assignedWorkers: [...assignedWorkers, employeeId],
            status: 'in-progress' as const  // تغيير الحالة من معلق إلى قيد التنفيذ
          };
        }
      }
      return order;
    });
    
    setEmployees(updatedEmployees);
    setOrders(updatedOrders);
  };

  // Implement deleteEmployee function that handles any related data cleanup
  const deleteEmployee = (employeeId: string) => {
    const employeeToDelete = employees.find(e => e.id === employeeId);
    
    if (employeeToDelete && employeeToDelete.currentOrder) {
      const updatedOrders = orders.map(order => {
        if (order.id === employeeToDelete.currentOrder && order.assignedWorkers) {
          return {
            ...order,
            assignedWorkers: order.assignedWorkers.filter(id => id !== employeeId)
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
    }
    
    if (employeeToDelete) {
      updateDepartmentEmployeeCount(employeeToDelete.department, -1);
    }
    
    return deleteEmployeeBase(employeeId);
  };

  // Enhanced version of addProductionRecord that properly updates all data
  const addProductionRecord = (employeeId: string, quantity: number, orderId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    const order = orders.find(o => o.id === orderId);
    
    if (!employee || !order) return;
    
    const orderDetails = `${order.client} - ${order.product.name}`;
    
    // Add the production record
    const newRecord = addProductionRecordBase(employeeId, quantity, orderId, orderDetails);
    
    // Update employee production statistics immediately
    const updatedEmployee = {
      ...employee,
      production: employee.production + quantity,
      monthlyProduction: employee.monthlyProduction + quantity
    };
    
    // Update employees state
    const updatedEmployees = employees.map(emp => 
      emp.id === employeeId ? updatedEmployee : emp
    );
    setEmployees(updatedEmployees);
    
    // Update order completion percentage
    const allRecordsForOrder = [...productionHistory, newRecord].filter(
      record => record.orderId === orderId
    );
    
    const totalProduced = allRecordsForOrder.reduce((sum, record) => sum + record.quantity, 0);
    const completionPercentage = Math.min(
      Math.round((totalProduced / order.totalQuantity) * 100),
      100
    );
    
    // Update order
    if (completionPercentage >= 100) {
      const completedOrder: Order = {
        ...order,
        completionPercentage,
        status: 'completed'
      };
      updateOrder(completedOrder);
    } else {
      const updatedOrders = orders.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            completionPercentage
          };
        }
        return o;
      });
      setOrders(updatedOrders);
    }
    
    // استهلاك المواد الخام من المخزون
    const fabric = inventory.find(item => item.name.includes('جراب'));
    if (fabric && fabric.quantity >= quantity) {
      addInventoryTransaction({
        itemId: fabric.id,
        type: 'remove',
        quantity: quantity,
        notes: `استهلاك إنتاج للطلب: ${order.client}`,
        orderId: order.id
      });
    }
    
    toast({
      title: "تم إضافة الإنتاج بنجاح",
      description: `تم إضافة ${quantity} قطعة لإنتاج ${employee.name}`,
    });
  };

  // Wrap all functionalities into the context value
  const contextValue: AppContextType = {
    employees,
    orders,
    departments,
    productionHistory,
    previousMonthProduction,
    inventory,
    transactions,
    addEmployee: (employee) => {
      const newEmployee = addEmployee(employee);
      updateDepartmentEmployeeCount(employee.department, 1);
      return newEmployee;
    },
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
    getItemTransactions
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
