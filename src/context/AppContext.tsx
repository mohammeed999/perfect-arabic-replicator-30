
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Employee } from '@/types/employee';
import { Order } from '@/types/order';
import { Department } from '@/types/department';
import { ProductionRecord } from '@/types/production';
import { InventoryItem, InventoryTransaction } from '@/types/inventory';
import { AppContextType } from '@/types/context-types';
import { EmployeeProvider, useEmployeeContext } from './EmployeeContext';
import { OrderProvider, useOrderContext } from './OrderContext';
import { DepartmentProvider, useDepartmentContext } from './DepartmentContext';
import { ProductionProvider, useProductionContext } from './ProductionContext';
import { InventoryProvider, useInventoryContext } from './InventoryContext';

// Re-export Employee type for backwards compatibility
export type { Employee } from '@/types/employee';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

function AppContextContent({ children }: { children: ReactNode }) {
  const employeeContext = useEmployeeContext();
  const orderContext = useOrderContext();
  const departmentContext = useDepartmentContext();
  const productionContext = useProductionContext();
  const inventoryContext = useInventoryContext();

  const value: AppContextType = {
    // Employee context
    employees: employeeContext.employees,
    addEmployee: employeeContext.addEmployee,
    updateEmployee: employeeContext.updateEmployee,
    deleteEmployee: employeeContext.deleteEmployee,
    getEmployeesByDepartment: employeeContext.getEmployeesByDepartment,
    getTotalProduction: employeeContext.getTotalProduction,
    getAvailableEmployees: employeeContext.getAvailableEmployees,
    assignEmployeeToOrder: employeeContext.assignEmployeeToOrder,
    calculateEmployeeBonus: employeeContext.calculateEmployeeBonus,

    // Order context
    orders: orderContext.orders,
    addOrder: orderContext.addOrder,
    updateOrder: orderContext.updateOrder,
    getOrdersByClient: orderContext.getOrdersByClient,
    getPendingOrdersCount: orderContext.getPendingOrdersCount,
    getOrderCompletionTarget: orderContext.getOrderCompletionTarget,

    // Department context
    departments: departmentContext.departments,
    addDepartment: departmentContext.addDepartment,

    // Production context
    productionHistory: productionContext.productionHistory,
    previousMonthProduction: productionContext.previousMonthProduction,
    addProductionRecord: productionContext.addProductionRecord,
    getEmployeeProductionHistory: productionContext.getEmployeeProductionHistory,
    getPreviousMonthProduction: productionContext.getPreviousMonthProduction,
    getCurrentDate: productionContext.getCurrentDate,

    // Inventory context
    inventory: inventoryContext.inventory,
    transactions: inventoryContext.transactions,
    addInventoryItem: inventoryContext.addInventoryItem,
    updateInventoryItem: inventoryContext.updateInventoryItem,
    deleteInventoryItem: inventoryContext.deleteInventoryItem,
    addInventoryTransaction: inventoryContext.addTransaction,
    getLowInventoryItems: inventoryContext.getLowInventoryItems,
    getTotalInventoryValue: inventoryContext.getTotalInventoryValue,
    getRawMaterialsValue: inventoryContext.getRawMaterialsValue,
    getFinishedProductsValue: inventoryContext.getFinishedProductsValue,
    getItemTransactions: inventoryContext.getItemTransactions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function ProductionProviderWrapper({ children }: { children: ReactNode }) {
  const { employees, updateEmployee } = useEmployeeContext();
  const { orders } = useOrderContext();

  // دالة تحديث إنتاج العامل
  const updateEmployeeProduction = (employeeId: string, quantity: number) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      const updatedEmployee = {
        ...employee,
        production: employee.production + quantity,
        monthlyProduction: employee.monthlyProduction + quantity
      };
      updateEmployee(updatedEmployee);
      console.log('تم تحديث بيانات العامل:', updatedEmployee);
    }
  };

  return (
    <ProductionProvider 
      employees={employees} 
      orders={orders} 
      updateEmployeeProduction={updateEmployeeProduction}
    >
      {children}
    </ProductionProvider>
  );
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <EmployeeProvider>
      <OrderProvider>
        <DepartmentProvider>
          <ProductionProviderWrapper>
            <InventoryProvider>
              <AppContextContent>{children}</AppContextContent>
            </InventoryProvider>
          </ProductionProviderWrapper>
        </DepartmentProvider>
      </OrderProvider>
    </EmployeeProvider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
