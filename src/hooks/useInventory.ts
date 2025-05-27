
import { useState } from 'react';
import { InventoryItem, InventoryTransaction } from '../types/inventory';
import { formatToArabicDateString } from '../utils/date-formatter';

// بيانات أولية للمخزون - جرابات بألوان مختلفة
const initialInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'جراب كاميرا أسود',
    category: 'finished',
    quantity: 150,
    unit: 'قطعة',
    minimumLevel: 20,
    cost: 45,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '2',
    name: 'جراب كاميرا أزرق',
    category: 'finished',
    quantity: 120,
    unit: 'قطعة',
    minimumLevel: 20,
    cost: 45,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '3',
    name: 'جراب كاميرا أحمر',
    category: 'finished',
    quantity: 80,
    unit: 'قطعة',
    minimumLevel: 20,
    cost: 45,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '4',
    name: 'جراب سيلكون عادي شفاف',
    category: 'finished',
    quantity: 300,
    unit: 'قطعة',
    minimumLevel: 50,
    cost: 25,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '5',
    name: 'جراب سيلكون عادي أسود',
    category: 'finished',
    quantity: 250,
    unit: 'قطعة',
    minimumLevel: 50,
    cost: 25,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '6',
    name: 'جراب سيلكون عادي أبيض',
    category: 'finished',
    quantity: 200,
    unit: 'قطعة',
    minimumLevel: 50,
    cost: 25,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '7',
    name: 'جراب سيلكون عادي وردي',
    category: 'finished',
    quantity: 100,
    unit: 'قطعة',
    minimumLevel: 30,
    cost: 25,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '8',
    name: 'مواد خام سيلكون',
    category: 'raw',
    quantity: 500,
    unit: 'كيلوجرام',
    minimumLevel: 100,
    cost: 15,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '9',
    name: 'مواد خام جلد صناعي',
    category: 'raw',
    quantity: 300,
    unit: 'متر',
    minimumLevel: 50,
    cost: 30,
    lastUpdated: formatToArabicDateString(new Date()),
  }
];

// بيانات أولية لسجلات المخزون
const initialTransactions: InventoryTransaction[] = [
  {
    id: '1',
    itemId: '1',
    type: 'add',
    quantity: 150,
    date: formatToArabicDateString(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    notes: 'شحنة أولية - جرابات كاميرا سوداء'
  },
  {
    id: '2',
    itemId: '4',
    type: 'add',
    quantity: 300,
    date: formatToArabicDateString(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    notes: 'شحنة أولية - جرابات سيلكون شفافة'
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
