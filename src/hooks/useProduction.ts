
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

  // Get production data for the current month
  const getCurrentMonthProduction = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filter production records for the current month
    const currentMonthRecords = productionHistory.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    });
    
    return currentMonthRecords.reduce((total, record) => total + record.quantity, 0);
  };

  // Get production data grouped by day for the current month
  const getDailyProductionData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Group by day and calculate total for each day
    const dailyData: Record<string, number> = {};
    
    productionHistory.forEach(record => {
      const recordDate = new Date(record.date);
      if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
        const day = recordDate.getDate();
        dailyData[day] = (dailyData[day] || 0) + record.quantity;
      }
    });
    
    // Convert to array format for charts
    return Object.entries(dailyData).map(([day, quantity]) => ({
      day: parseInt(day),
      quantity
    }));
  };

  return {
    productionHistory,
    setProductionHistory,
    previousMonthProduction,
    addProductionRecord,
    getEmployeeProductionHistory,
    getTotalProduction,
    getPreviousMonthProduction,
    getCurrentMonthProduction,
    getDailyProductionData
  };
};
