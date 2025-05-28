
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InventoryItem, InventoryTransaction } from '@/types/inventory';
import { inventoryService } from '@/services/inventoryService';

interface InventoryContextType {
  inventory: InventoryItem[];
  transactions: InventoryTransaction[];
  addInventoryItem: (item: Omit<InventoryItem, "id" | "lastUpdated">) => Promise<InventoryItem | null>;
  updateInventoryItem: (item: InventoryItem) => Promise<InventoryItem | null>;
  deleteInventoryItem: (itemId: string) => Promise<void>;
  addTransaction: (transaction: Omit<InventoryTransaction, "id" | "date">) => Promise<InventoryTransaction | null>;
  getLowInventoryItems: () => InventoryItem[];
  getTotalInventoryValue: () => number;
  getRawMaterialsValue: () => number;
  getFinishedProductsValue: () => number;
  getItemTransactions: (itemId: string) => InventoryTransaction[];
  loading: boolean;
  error: string | null;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

interface InventoryProviderProps {
  children: ReactNode;
}

export function InventoryProvider({ children }: InventoryProviderProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تحميل البيانات من Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [inventoryData, transactionData] = await Promise.all([
          inventoryService.getAll(),
          inventoryService.getTransactions()
        ]);
        
        setInventory(inventoryData);
        setTransactions(transactionData);
      } catch (err) {
        console.error('Error loading inventory data:', err);
        setError('حدث خطأ في تحميل بيانات المخزون');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // إضافة عنصر جديد للمخزون
  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    try {
      const newItem = await inventoryService.create(item);
      if (newItem) {
        setInventory(prev => [...prev, newItem]);
        
        // إضافة معاملة للسجل
        if (item.quantity > 0) {
          await addTransaction({
            itemId: newItem.id,
            type: 'add',
            quantity: item.quantity,
            notes: 'إضافة عنصر جديد'
          });
        }
      }
      return newItem;
    } catch (err) {
      console.error('Error adding inventory item:', err);
      setError('حدث خطأ في إضافة العنصر');
      return null;
    }
  };

  // تحديث عنصر في المخزون
  const updateInventoryItem = async (item: InventoryItem) => {
    try {
      const oldItem = inventory.find(i => i.id === item.id);
      const updatedItem = await inventoryService.update(item);
      
      if (updatedItem) {
        setInventory(prev => prev.map(i => 
          i.id === item.id ? updatedItem : i
        ));
        
        // إضافة معاملة تعديل إذا تغيرت الكمية
        if (oldItem && oldItem.quantity !== item.quantity) {
          const quantityDiff = item.quantity - oldItem.quantity;
          await addTransaction({
            itemId: item.id,
            type: quantityDiff > 0 ? 'add' : 'remove',
            quantity: Math.abs(quantityDiff),
            notes: 'تعديل رصيد المخزون'
          });
        }
      }
      return updatedItem;
    } catch (err) {
      console.error('Error updating inventory item:', err);
      setError('حدث خطأ في تحديث العنصر');
      return null;
    }
  };

  // حذف عنصر من المخزون
  const deleteInventoryItem = async (itemId: string) => {
    try {
      await inventoryService.delete(itemId);
      setInventory(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error deleting inventory item:', err);
      setError('حدث خطأ في حذف العنصر');
    }
  };

  // إضافة معاملة جديدة
  const addTransaction = async (
    transaction: Omit<InventoryTransaction, 'id' | 'date'>
  ) => {
    try {
      const newTransaction = await inventoryService.createTransaction(transaction);
      if (newTransaction) {
        setTransactions(prev => [newTransaction, ...prev]);
        
        // تحديث رصيد العنصر في المخزون المحلي
        const item = inventory.find(i => i.id === transaction.itemId);
        if (item) {
          const updatedItem = { ...item };
          
          if (transaction.type === 'add') {
            updatedItem.quantity += transaction.quantity;
          } else if (transaction.type === 'remove') {
            updatedItem.quantity = Math.max(0, updatedItem.quantity - transaction.quantity);
          }
          
          setInventory(prev => prev.map(i => 
            i.id === item.id ? updatedItem : i
          ));
        }
      }
      return newTransaction;
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('حدث خطأ في إضافة المعاملة');
      return null;
    }
  };

  // الحصول على العناصر ذات المستوى المنخفض
  const getLowInventoryItems = () => {
    return inventory.filter(item => item.quantity <= item.minQuantity);
  };

  // الحصول على إجمالي قيمة المخزون
  const getTotalInventoryValue = () => {
    return inventory.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  // الحصول على قيمة مخزون المواد الخام
  const getRawMaterialsValue = () => {
    return inventory
      .filter(item => item.category === 'مواد خام')
      .reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  // الحصول على قيمة مخزون المنتجات النهائية
  const getFinishedProductsValue = () => {
    return inventory
      .filter(item => item.category === 'منتجات جاهزة')
      .reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  // الحصول على معاملات عنصر معين
  const getItemTransactions = (itemId: string) => {
    return transactions.filter(transaction => transaction.itemId === itemId);
  };

  const value: InventoryContextType = {
    inventory,
    transactions,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addTransaction,
    getLowInventoryItems,
    getTotalInventoryValue,
    getRawMaterialsValue,
    getFinishedProductsValue,
    getItemTransactions,
    loading,
    error
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventoryContext() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventoryContext must be used within an InventoryProvider');
  }
  return context;
}
