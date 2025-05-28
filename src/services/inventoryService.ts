
import { InventoryItem, InventoryTransaction } from '@/types/inventory';

// خدمة مؤقتة للمخزون باستخدام localStorage حتى يتم تحديث أنواع Supabase
export const inventoryService = {
  // الحصول على جميع عناصر المخزون
  async getAll(): Promise<InventoryItem[]> {
    try {
      const data = localStorage.getItem('inventory_items');
      if (!data) {
        // إنشاء بيانات أولية
        const initialData: InventoryItem[] = [
          {
            id: '1',
            name: 'جراب كاميرا أسود',
            category: 'منتجات جاهزة',
            quantity: 150,
            unit: 'قطعة',
            minQuantity: 20,
            unitPrice: 45.00,
            lastUpdated: new Date().toISOString()
          },
          {
            id: '2',
            name: 'جراب كاميرا أزرق',
            category: 'منتجات جاهزة',
            quantity: 120,
            unit: 'قطعة',
            minQuantity: 20,
            unitPrice: 45.00,
            lastUpdated: new Date().toISOString()
          },
          {
            id: '3',
            name: 'مواد خام سيلكون',
            category: 'مواد خام',
            quantity: 500,
            unit: 'كيلوجرام',
            minQuantity: 100,
            unitPrice: 15.00,
            lastUpdated: new Date().toISOString()
          }
        ];
        localStorage.setItem('inventory_items', JSON.stringify(initialData));
        return initialData;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
  },

  // إضافة عنصر جديد
  async create(item: Omit<InventoryItem, 'id' | 'lastUpdated'>): Promise<InventoryItem | null> {
    try {
      const items = await this.getAll();
      const newItem: InventoryItem = {
        ...item,
        id: Date.now().toString(),
        lastUpdated: new Date().toISOString()
      };
      
      const updatedItems = [...items, newItem];
      localStorage.setItem('inventory_items', JSON.stringify(updatedItems));
      return newItem;
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
  },

  // تحديث عنصر
  async update(item: InventoryItem): Promise<InventoryItem | null> {
    try {
      const items = await this.getAll();
      const updatedItem = { ...item, lastUpdated: new Date().toISOString() };
      const updatedItems = items.map(i => i.id === item.id ? updatedItem : i);
      
      localStorage.setItem('inventory_items', JSON.stringify(updatedItems));
      return updatedItem;
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  },

  // حذف عنصر
  async delete(id: string): Promise<void> {
    try {
      const items = await this.getAll();
      const updatedItems = items.filter(item => item.id !== id);
      localStorage.setItem('inventory_items', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  },

  // الحصول على المعاملات
  async getTransactions(): Promise<InventoryTransaction[]> {
    try {
      const data = localStorage.getItem('inventory_transactions');
      if (!data) {
        const initialData: InventoryTransaction[] = [];
        localStorage.setItem('inventory_transactions', JSON.stringify(initialData));
        return initialData;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error fetching inventory transactions:', error);
      throw error;
    }
  },

  // إضافة معاملة
  async createTransaction(transaction: Omit<InventoryTransaction, 'id' | 'date'>): Promise<InventoryTransaction | null> {
    try {
      const transactions = await this.getTransactions();
      const newTransaction: InventoryTransaction = {
        ...transaction,
        id: Date.now().toString(),
        date: new Date().toISOString()
      };
      
      const updatedTransactions = [...transactions, newTransaction];
      localStorage.setItem('inventory_transactions', JSON.stringify(updatedTransactions));
      return newTransaction;
    } catch (error) {
      console.error('Error creating inventory transaction:', error);
      throw error;
    }
  }
};
