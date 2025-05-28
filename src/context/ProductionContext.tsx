
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
  loading: boolean;
  error: string | null;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduction = async () => {
      try {
        setLoading(true);
        setError(null);
        const productionData = await productionService.getAll();
        setProductionHistory(productionData);
        
        // حساب إنتاج الشهر السابق
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const lastMonthProduction = productionData
          .filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.getMonth() === lastMonth.getMonth() && 
                   recordDate.getFullYear() === lastMonth.getFullYear();
          })
          .reduce((total, record) => total + record.quantity, 0);
        
        setPreviousMonthProduction(lastMonthProduction);
      } catch (error) {
        console.error('Error loading production:', error);
        setError('حدث خطأ في تحميل بيانات الإنتاج');
      } finally {
        setLoading(false);
      }
    };

    loadProduction();
  }, []);

  const getCurrentDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  const addProductionRecord = async (employeeId: string, quantity: number, orderId: string) => {
    try {
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
          // إصلاح: تحديث إنتاج العامل بشكل صحيح
          updateEmployeeProduction(employeeId, quantity);
          
          // تحديث الإنتاج الشهري أيضاً
          const currentDate = new Date();
          const recordDate = new Date(newRecord.date);
          if (recordDate.getMonth() === currentDate.getMonth() && 
              recordDate.getFullYear() === currentDate.getFullYear()) {
            // تحديث الإنتاج الشهري للعامل
            updateEmployeeProduction(employeeId, 0); // سيتم استدعاء دالة التحديث في السياق
          }
        }
      }
    } catch (error) {
      console.error('Error adding production record:', error);
      setError('حدث خطأ في إضافة سجل الإنتاج');
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
    loading,
    error,
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
