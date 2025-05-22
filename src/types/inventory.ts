
export interface InventoryItem {
  id: string;
  name: string;
  category: 'raw' | 'finished'; // raw = مواد خام, finished = منتج نهائي
  quantity: number;
  unit: string; // وحدة القياس (قطعة، كيلو، متر، الخ)
  minimumLevel: number; // المستوى الأدنى للتنبيه
  cost: number; // التكلفة لكل وحدة
  lastUpdated: string; // تاريخ آخر تحديث
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  type: 'add' | 'remove' | 'adjust'; // إضافة، إزالة، تعديل
  quantity: number;
  date: string;
  notes: string;
  userId?: string; // المستخدم الذي قام بالعملية
  orderId?: string; // الطلب المرتبط (إن وجد)
}

export const INVENTORY_CATEGORIES = [
  { value: 'raw', label: 'مواد خام' },
  { value: 'finished', label: 'منتج نهائي' },
];

// وحدات القياس الشائعة
export const MEASUREMENT_UNITS = [
  { value: 'piece', label: 'قطعة' },
  { value: 'kg', label: 'كيلوجرام' },
  { value: 'meter', label: 'متر' },
  { value: 'liter', label: 'لتر' },
  { value: 'roll', label: 'رول' },
];
