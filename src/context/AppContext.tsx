
import React, { createContext, useContext, ReactNode } from 'react';
import { AppContextType } from '../types/context-types';
import { Employee } from '../types/employee';
import { Order } from '../types/order';
import { Department } from '../types/department';
import { ProductionRecord } from '../types/production';
import { useEmployees } from '../hooks/useEmployees';
import { useDepartments } from '../hooks/useDepartments';
import { useOrders } from '../hooks/useOrders';
import { useProduction } from '../hooks/useProduction';
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
export type { Employee, Order, Department, ProductionRecord };

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
    getAvailableEmployees 
  } = useEmployees();
  
  const { 
    departments, 
    addDepartment, 
    updateDepartmentEmployeeCount 
  } = useDepartments();
  
  const { 
    orders, 
    setOrders,
    addOrder, 
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
  
  const { toast } = useToast();

  const getEmployeesByDepartment = (departmentName: string) => {
    return employees.filter(employee => employee.department === departmentName);
  };

  const getCurrentDate = () => {
    return formatDateToArabic();
  };

  // تحديث دالة تحديث الطلب لتغيير حالة العمال المرتبطين بالطلب عندما يكتمل
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
            status: '',  // متاح
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
    }
    
    return updatedOrder;
  };
  
  // تحديث وظيفة تحديث بيانات العامل
  const updateEmployee = (employee: Employee) => {
    // تحديث بيانات العامل
    const updatedEmployee = updateEmployeeBase(employee);
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

  // Enhanced version of addProductionRecord that updates employees and orders
  const addProductionRecord = (employeeId: string, quantity: number, orderId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    const order = orders.find(o => o.id === orderId);
    
    if (!employee || !order) return;
    
    // Create the order details string
    const orderDetails = `${order.client} - ${order.product.name}`;
    
    // Add the production record
    const newRecord = addProductionRecordBase(employeeId, quantity, orderId, orderDetails);
    
    // Update employee production statistics
    const updatedEmployees = employees.map(emp => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          production: emp.production + quantity,
          monthlyProduction: emp.monthlyProduction + quantity
        };
      }
      return emp;
    });
    
    setEmployees(updatedEmployees);
    
    // Update order completion percentage
    const employeeRecords = [...productionHistory, newRecord].filter(
      record => record.orderId === orderId
    );
    
    const totalProduced = employeeRecords.reduce((sum, record) => sum + record.quantity, 0);
    const completionPercentage = Math.min(
      Math.round((totalProduced / order.totalQuantity) * 100),
      100
    );
    
    // Update order status if completed
    if (completionPercentage >= 100) {
      const updatedOrder: Order = {
        ...order,
        completionPercentage,
        status: 'completed'
      };
      
      updateOrder(updatedOrder);
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
  };

  // Wrap all functionalities into the context value
  const contextValue: AppContextType = {
    employees,
    orders,
    departments,
    productionHistory,
    previousMonthProduction,
    addEmployee: (employee) => {
      const newEmployee = addEmployee(employee);
      // Update department employee count when adding an employee
      updateDepartmentEmployeeCount(employee.department, 1);
      return newEmployee;
    },
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
    assignEmployeeToOrder,
    addProductionRecord,
    getEmployeeProductionHistory,
    getPreviousMonthProduction
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
