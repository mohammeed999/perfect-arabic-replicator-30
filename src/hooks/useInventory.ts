import { useState } from 'react';
import { InventoryItem, InventoryTransaction } from '../types/inventory';
import { formatToArabicDateString } from '../utils/date-formatter';

// بيانات أولية للمخزون - جرابات بألوان مختلفة
const initialInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'جراب كاميرا أسود',
    category: 'منتجات جاهزة',
    quantity: 150,
    unit: 'قطعة',
    minQuantity: 20,
    unitPrice: 45,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '2',
    name: 'جراب كاميرا أزرق',
    category: 'منتجات جاهزة',
    quantity: 120,
    unit: 'قطعة',
    minQuantity: 20,
    unitPrice: 45,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '3',
    name: 'جراب كاميرا أحمر',
    category: 'منتجات جاهزة',
    quantity: 80,
    unit: 'قطعة',
    minQuantity: 20,
    unitPrice: 45,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '4',
    name: 'جراب سيلكون عادي شفاف',
    category: 'منتجات جاهزة',
    quantity: 300,
    unit: 'قطعة',
    minQuantity: 50,
    unitPrice: 25,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '5',
    name: 'جراب سيلكون عادي أسود',
    category: 'منتجات جاهزة',
    quantity: 250,
    unit: 'قطعة',
    minQuantity: 50,
    unitPrice: 25,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '6',
    name: 'جراب سيلكون عادي أبيض',
    category: 'منتجات جاهزة',
    quantity: 200,
    unit: 'قطعة',
    minQuantity: 50,
    unitPrice: 25,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '7',
    name: 'جراب سيلكون عادي وردي',
    category: 'منتجات جاهزة',
    quantity: 100,
    unit: 'قطعة',
    minQuantity: 30,
    unitPrice: 25,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '8',
    name: 'مواد خام سيلكون',
    category: 'مواد خام',
    quantity: 500,
    unit: 'كيلوجرام',
    minQuantity: 100,
    unitPrice: 15,
    lastUpdated: formatToArabicDateString(new Date()),
  },
  {
    id: '9',
    name: 'مواد خام جلد صناعي',
    category: 'مواد خام',
    quantity: 300,
    unit: 'متر',
    minQuantity: 50,
    unitPrice: 30,
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
