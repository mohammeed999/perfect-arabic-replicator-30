
export interface ProductionRecord {
  id: string;
  employeeId: string;
  date: string;
  quantity: number;
  orderId: string;
  orderDetails: string; // Client and product info
}

// Database schema type for ProductionRecord
export interface ProductionRecordDB {
  id: string;
  employee_id: string | null;
  date: string;
  quantity: number;
  order_id: string | null;
  order_details: string | null;
  created_at: string | null;
}

// Mapping functions between DB and app models
export function dbToProductionRecordModel(dbRecord: ProductionRecordDB): ProductionRecord {
  return {
    id: dbRecord.id,
    employeeId: dbRecord.employee_id || '',
    date: dbRecord.date,
    quantity: dbRecord.quantity,
    orderId: dbRecord.order_id || '',
    orderDetails: dbRecord.order_details || ''
  };
}

export function productionRecordToDbModel(record: ProductionRecord | Omit<ProductionRecord, "id">): Partial<ProductionRecordDB> {
  return {
    employee_id: record.employeeId,
    date: record.date,
    quantity: record.quantity,
    order_id: record.orderId,
    order_details: record.orderDetails,
    ...(('id' in record) ? { id: record.id } : {})
  };
}
