
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem, InventoryTransaction } from '@/types/inventory';

export const inventoryService = {
  // الحصول على جميع عناصر المخزون
  async getAll(): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category as 'مواد خام' | 'منتجات جاهزة',
      quantity: item.quantity,
      unit: item.unit,
      minQuantity: item.min_quantity,
      unitPrice: parseFloat(item.unit_price?.toString() || '0'),
      lastUpdated: item.last_updated
    }));
  },

  // إضافة عنصر جديد
  async create(item: Omit<InventoryItem, 'id' | 'lastUpdated'>): Promise<InventoryItem | null> {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        min_quantity: item.minQuantity,
        unit_price: item.unitPrice
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      category: data.category as 'مواد خام' | 'منتجات جاهزة',
      quantity: data.quantity,
      unit: data.unit,
      minQuantity: data.min_quantity,
      unitPrice: parseFloat(data.unit_price?.toString() || '0'),
      lastUpdated: data.last_updated
    };
  },

  // تحديث عنصر
  async update(item: InventoryItem): Promise<InventoryItem | null> {
    const { data, error } = await supabase
      .from('inventory_items')
      .update({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        min_quantity: item.minQuantity,
        unit_price: item.unitPrice,
        last_updated: new Date().toISOString()
      })
      .eq('id', item.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      category: data.category as 'مواد خام' | 'منتجات جاهزة',
      quantity: data.quantity,
      unit: data.unit,
      minQuantity: data.min_quantity,
      unitPrice: parseFloat(data.unit_price?.toString() || '0'),
      lastUpdated: data.last_updated
    };
  },

  // حذف عنصر
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  },

  // الحصول على المعاملات
  async getTransactions(): Promise<InventoryTransaction[]> {
    const { data, error } = await supabase
      .from('inventory_transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching inventory transactions:', error);
      throw error;
    }
    
    return data.map(transaction => ({
      id: transaction.id,
      itemId: transaction.item_id,
      type: transaction.type as 'add' | 'remove' | 'adjust',
      quantity: transaction.quantity,
      date: transaction.date,
      notes: transaction.notes || '',
      userId: transaction.user_id,
      orderId: transaction.order_id
    }));
  },

  // إضافة معاملة
  async createTransaction(transaction: Omit<InventoryTransaction, 'id' | 'date'>): Promise<InventoryTransaction | null> {
    const { data, error } = await supabase
      .from('inventory_transactions')
      .insert({
        item_id: transaction.itemId,
        type: transaction.type,
        quantity: transaction.quantity,
        notes: transaction.notes,
        user_id: transaction.userId,
        order_id: transaction.orderId
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating inventory transaction:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      itemId: data.item_id,
      type: data.type as 'add' | 'remove' | 'adjust',
      quantity: data.quantity,
      date: data.date,
      notes: data.notes || '',
      userId: data.user_id,
      orderId: data.order_id
    };
  }
};
