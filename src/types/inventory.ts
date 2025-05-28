
export interface InventoryItem {
  id: string;
  name: string;
  category: 'مواد خام' | 'منتجات جاهزة'; // تغيير الأنواع لتتطابق مع الاستخدام
  quantity: number;
  unit: string; // وحدة القياس (قطعة، كيلو، متر، الخ)
  minQuantity: number; // المستوى الأدنى للتنبيه
  unitPrice: number; // السعر لكل وحدة
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
  { value: 'مواد خام', label: 'مواد خام' },
  { value: 'منتجات جاهزة', label: 'منتجات جاهزة' },
];

// وحدات القياس الشائعة
export const MEASUREMENT_UNITS = [
  { value: 'piece', label: 'قطعة' },
  { value: 'kg', label: 'كيلوجرام' },
  { value: 'meter', label: 'متر' },
  { value: 'liter', label: 'لتر' },
  { value: 'roll', label: 'رول' },
];
