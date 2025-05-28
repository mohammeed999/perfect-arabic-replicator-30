
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProductionRecord } from '@/types/production';
import { productionService } from '@/services/localDataService';

interface ProductionContextType {
  productionHistory: ProductionRecord[];
  previousMonthProduction: number;
  addProductionRecord: (employeeId: string, quantity: number, orderId: string) => Promise<void>;
  getEmployeeProductionHistory: (employeeId: string) => ProductionRecord[];
  getPreviousMonthProduction: () => number;
  getCurrentDate: () => string;
}

const ProductionContext = createContext<ProductionContextType | undefined>(undefined);

interface ProductionProviderProps {
  children: ReactNode;
  employees: any[];
  orders: any[];
  updateEmployeeProduction: (employeeId: string, quantity: number) => void;
}

export function ProductionProvider({ children, employees, orders, updateEmployeeProduction }: ProductionProviderProps) {
  const [productionHistory, setProductionHistory] = useState<ProductionRecord[]>([]);
  const [previousMonthProduction, setPreviousMonthProduction] = useState<number>(0);

  useEffect(() => {
    const loadProduction = async () => {
      try {
        const productionData = await productionService.getAll();
        setProductionHistory(productionData);
      } catch (error) {
        console.error('Error loading production:', error);
      }
    };

    loadProduction();
  }, []);

  const getCurrentDate = (): string => {
    return new Date().toISOString().split('T')[0];
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
        updateEmployeeProduction(employeeId, quantity);
      }
    }
  };

  const getEmployeeProductionHistory = (employeeId: string): ProductionRecord[] => {
    return productionHistory.filter(record => record.employeeId === employeeId);
  };

  const getPreviousMonthProduction = (): number => {
    return previousMonthProduction;
  };

  const value: ProductionContextType = {
    productionHistory,
    previousMonthProduction,
    addProductionRecord,
    getEmployeeProductionHistory,
    getPreviousMonthProduction,
    getCurrentDate,
  };

  return <ProductionContext.Provider value={value}>{children}</ProductionContext.Provider>;
}

export function useProductionContext() {
  const context = useContext(ProductionContext);
  if (context === undefined) {
    throw new Error('useProductionContext must be used within a ProductionProvider');
  }
  return context;
}
