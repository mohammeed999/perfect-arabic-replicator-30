
import { useState } from 'react';
import { InventoryItem, InventoryTransaction } from '../types/inventory';
import { formatToArabicDateString } from '../utils/date-formatter';

// بيانات أولية للمخزون
const initialInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'قماش قطني',
    category: 'raw',
    quantity: 1000,
    unit: 'متر',
    minimumLevel: 200,
    cost: 15,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '2',
    name: 'خيوط بوليستر',
    category: 'raw',
    quantity: 500,
    unit: 'رول',
    minimumLevel: 100,
    cost: 30,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '3',
    name: 'قميص رجالي',
    category: 'finished',
    quantity: 150,
    unit: 'قطعة',
    minimumLevel: 20,
    cost: 120,
    lastUpdated: formatToArabicDateString(new Date()),
  }
];

// بيانات أولية لسجلات المخزون
const initialTransactions: InventoryTransaction[] = [
  {
    id: '1',
    itemId: '1',
    type: 'add',
    quantity: 1000,
    date: formatToArabicDateString(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), // قبل أسبوع
    notes: 'شحنة أولية'
  },
  {
    id: '2',
    itemId: '2',
    type: 'add',
    quantity: 500,
    date: formatToArabicDateString(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), // قبل أسبوع
    notes: 'شحنة أولية'
  }
];

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>(initialTransactions);

  // إضافة عنصر جديد للمخزون
  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `${inventory.length + 1}`,
      lastUpdated: formatToArabicDateString(new Date())
    };
    
    setInventory([...inventory, newItem]);

    // إضافة معاملة للسجل
    if (item.quantity > 0) {
      addTransaction({
        itemId: newItem.id,
        type: 'add',
        quantity: item.quantity,
        notes: 'إضافة عنصر جديد'
      });
    }
    
    return newItem;
  };

  // تحديث عنصر في المخزون
  const updateInventoryItem = (item: InventoryItem) => {
    const oldItem = inventory.find(i => i.id === item.id);
    
    const updatedInventory = inventory.map(i => 
      i.id === item.id 
        ? { ...item, lastUpdated: formatToArabicDateString(new Date()) }
        : i
    );
    
    setInventory(updatedInventory);
    
    // إضافة معاملة تعديل إذا تغيرت الكمية
    if (oldItem && oldItem.quantity !== item.quantity) {
      const quantityDiff = item.quantity - oldItem.quantity;
      addTransaction({
        itemId: item.id,
        type: quantityDiff > 0 ? 'add' : 'remove',
        quantity: Math.abs(quantityDiff),
        notes: 'تعديل رصيد المخزون'
      });
    }
    
    return item;
  };

  // حذف عنصر من المخزون
  const deleteInventoryItem = (itemId: string) => {
    setInventory(inventory.filter(item => item.id !== itemId));
    return itemId;
  };

  // إضافة معاملة جديدة (إضافة أو سحب أو تعديل)
  const addTransaction = (
    transaction: Omit<InventoryTransaction, 'id' | 'date'>
  ) => {
    // إنشاء المعاملة الجديدة
    const newTransaction: InventoryTransaction = {
      ...transaction,
      id: `${transactions.length + 1}`,
      date: formatToArabicDateString(new Date())
    };
    
    // تحديث سجل المعاملات
    setTransactions([...transactions, newTransaction]);
    
    // تحديث رصيد العنصر في المخزون
    const item = inventory.find(i => i.id === transaction.itemId);
    
    if (item) {
      const updatedItem = { ...item };
      
      if (transaction.type === 'add') {
        updatedItem.quantity += transaction.quantity;
      } else if (transaction.type === 'remove') {
        updatedItem.quantity = Math.max(0, updatedItem.quantity - transaction.quantity);
      }
      
      updatedItem.lastUpdated = formatToArabicDateString(new Date());
      
      setInventory(inventory.map(i => 
        i.id === item.id ? updatedItem : i
      ));
    }
    
    return newTransaction;
  };

  // الحصول على العناصر ذات المستوى المنخفض
  const getLowInventoryItems = () => {
    return inventory.filter(item => item.quantity <= item.minimumLevel);
  };

  // الحصول على إجمالي قيمة المخزون
  const getTotalInventoryValue = () => {
    return inventory.reduce((total, item) => total + (item.quantity * item.cost), 0);
  };

  // الحصول على قيمة مخزون المواد الخام
  const getRawMaterialsValue = () => {
    return inventory
      .filter(item => item.category === 'raw')
      .reduce((total, item) => total + (item.quantity * item.cost), 0);
  };

  // الحصول على قيمة مخزون المنتجات النهائية
  const getFinishedProductsValue = () => {
    return inventory
      .filter(item => item.category === 'finished')
      .reduce((total, item) => total + (item.quantity * item.cost), 0);
  };

  // الحصول على معاملات عنصر معين
  const getItemTransactions = (itemId: string) => {
    return transactions.filter(transaction => transaction.itemId === itemId);
  };

  return {
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
    getItemTransactions
  };
};
