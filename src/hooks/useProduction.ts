
import { useState } from 'react';
import { ProductionRecord } from '../types/production';
import { initialProductionHistory, initialPreviousMonthProduction } from '../data/initial-data';
import { formatToArabicDateString } from '../utils/date-formatter';

export const useProduction = () => {
  const [productionHistory, setProductionHistory] = useState<ProductionRecord[]>(initialProductionHistory);
  const [previousMonthProduction, _setPreviousMonthProduction] = useState<number>(initialPreviousMonthProduction);

  const addProductionRecord = (
    employeeId: string, 
    quantity: number, 
    orderId: string, 
    orderDetails: string
  ) => {
    // Format current date in Arabic format
    const today = new Date();
    const formattedDate = formatToArabicDateString(today);
    
    // Create new production record
    const newRecord: ProductionRecord = {
      id: `${productionHistory.length + 1}`,
      employeeId,
      date: formattedDate,
      quantity,
      orderId,
      orderDetails
    };
    
    // Update production history
    setProductionHistory([...productionHistory, newRecord]);
    
    return newRecord;
  };

  const getEmployeeProductionHistory = (employeeId: string) => {
    return productionHistory.filter(record => record.employeeId === employeeId);
  };

  const getTotalProduction = () => {
    return productionHistory.reduce((total, record) => total + record.quantity, 0);
  };

  const getPreviousMonthProduction = () => {
    return previousMonthProduction;
  };

  return {
    productionHistory,
    setProductionHistory,
    previousMonthProduction,
    addProductionRecord,
    getEmployeeProductionHistory,
    getTotalProduction,
    getPreviousMonthProduction
  };
};
