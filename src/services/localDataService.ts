
import { Employee } from "@/types/employee";
import { Department } from "@/types/department";
import { Order } from "@/types/order";
import { ProductionRecord } from "@/types/production";
import { toast } from "@/components/ui/use-toast";

// بيانات محلية لمصنع فينوس
const localEmployees: Employee[] = [
  {
    id: '1',
    name: 'أحمد محمد علي',
    department: 'قسم القطع والتشكيل',
    dailyTarget: 150,
    production: 145,
    bonusPercentage: 12,
    monthlyProduction: 3200,
    status: 'حاضر',
    currentOrder: 'ORD-001'
  },
  {
    id: '2',
    name: 'فاطمة أحمد حسن',
    department: 'قسم التجميع والتركيب',
    dailyTarget: 120,
    production: 125,
    bonusPercentage: 8,
    monthlyProduction: 2800,
    status: 'حاضر',
    currentOrder: 'ORD-002'
  },
  {
    id: '3',
    name: 'محمد عبدالله سالم',
    department: 'قسم القطع والتشكيل',
    dailyTarget: 140,
    production: 135,
    bonusPercentage: 10,
    monthlyProduction: 3100,
    status: 'حاضر',
    currentOrder: 'ORD-001'
  },
  {
    id: '4',
    name: 'عائشة محمود طه',
    department: 'قسم التعبئة والتغليف',
    dailyTarget: 180,
    production: 175,
    bonusPercentage: 15,
    monthlyProduction: 4200,
    status: 'حاضر',
    currentOrder: 'ORD-003'
  },
  {
    id: '5',
    name: 'عمر سعد أحمد',
    department: 'قسم مراقبة الجودة',
    dailyTarget: 100,
    production: 95,
    bonusPercentage: 5,
    monthlyProduction: 2100,
    status: 'حاضر'
  }
];

const localDepartments: Department[] = [
  { id: '1', name: 'قسم القطع والتشكيل', employeeCount: 8 },
  { id: '2', name: 'قسم التجميع والتركيب', employeeCount: 12 },
  { id: '3', name: 'قسم التعبئة والتغليف', employeeCount: 6 },
  { id: '4', name: 'قسم مراقبة الجودة', employeeCount: 4 }
];

const localOrders: Order[] = [
  {
    id: 'ORD-001',
    client: 'شركة موبايل تك',
    product: {
      id: '1',
      name: 'جراب iPhone 15 Pro - أزرق',
      type: 'جراب سيليكون',
      quantity: 500
    },
    totalQuantity: 500,
    entryDate: '2024-01-15',
    deliveryDate: '2024-02-10',
    receivingDate: '2024-01-15',
    status: 'in-progress',
    completionPercentage: 75,
    assignedWorkers: ['أحمد محمد علي', 'محمد عبدالله سالم']
  },
  {
    id: 'ORD-002',
    client: 'متجر الإلكترونيات الذكية',
    product: {
      id: '2',
      name: 'جراب Samsung Galaxy S24 - أسود',
      type: 'جراب جلد طبيعي',
      quantity: 300
    },
    totalQuantity: 300,
    entryDate: '2024-01-20',
    deliveryDate: '2024-02-15',
    receivingDate: '2024-01-20',
    status: 'in-progress',
    completionPercentage: 60,
    assignedWorkers: ['فاطمة أحمد حسن']
  },
  {
    id: 'ORD-003',
    client: 'شركة الخليج للهواتف',
    product: {
      id: '3',
      name: 'جراب Huawei P60 - شفاف',
      type: 'جراب بلاستيك صلب',
      quantity: 800
    },
    totalQuantity: 800,
    entryDate: '2024-01-10',
    deliveryDate: '2024-02-05',
    receivingDate: '2024-01-10',
    status: 'completed',
    completionPercentage: 100,
    assignedWorkers: ['عائشة محمود طه']
  }
];

const localProductionRecords: ProductionRecord[] = [
  {
    id: '1',
    employeeId: '1',
    date: '2024-01-31',
    quantity: 145,
    orderId: 'ORD-001',
    orderDetails: 'قطع وتشكيل جرابات iPhone 15 Pro'
  },
  {
    id: '2',
    employeeId: '2',
    date: '2024-01-31',
    quantity: 125,
    orderId: 'ORD-002',
    orderDetails: 'تجميع جرابات Samsung Galaxy S24'
  }
];

// خدمة إدارة الموظفين
export const employeeService = {
  async getAll(): Promise<Employee[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // محاكاة التأخير
    return localEmployees;
  },
  
  async create(employee: Omit<Employee, 'id'>): Promise<Employee | null> {
    try {
      const newEmployee: Employee = {
        ...employee,
        id: `emp-${Date.now()}`
      };
      localEmployees.push(newEmployee);
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الموظف بنجاح"
      });
      
      return newEmployee;
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الموظف",
        variant: "destructive"
      });
      return null;
    }
  },
  
  async update(employee: Employee): Promise<Employee | null> {
    try {
      const index = localEmployees.findIndex(emp => emp.id === employee.id);
      if (index !== -1) {
        localEmployees[index] = employee;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث بيانات الموظف بنجاح"
        });
        
        return employee;
      }
      return null;
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث بيانات الموظف",
        variant: "destructive"
      });
      return null;
    }
  }
};

// خدمة إدارة الأقسام
export const departmentService = {
  async getAll(): Promise<Department[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return localDepartments;
  },
  
  async create(department: Omit<Department, 'id'>): Promise<Department | null> {
    try {
      const newDepartment: Department = {
        ...department,
        id: `dept-${Date.now()}`
      };
      localDepartments.push(newDepartment);
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة القسم بنجاح"
      });
      
      return newDepartment;
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة القسم",
        variant: "destructive"
      });
      return null;
    }
  }
};

// خدمة إدارة الطلبات
export const orderService = {
  async getAll(): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return localOrders;
  },
  
  async create(order: Omit<Order, 'id'>): Promise<Order | null> {
    try {
      const newOrder: Order = {
        ...order,
        id: `ORD-${Date.now()}`
      };
      localOrders.push(newOrder);
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الطلب بنجاح"
      });
      
      return newOrder;
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الطلب",
        variant: "destructive"
      });
      return null;
    }
  },
  
  async update(order: Order): Promise<Order | null> {
    try {
      const index = localOrders.findIndex(ord => ord.id === order.id);
      if (index !== -1) {
        localOrders[index] = order;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث بيانات الطلب بنجاح"
        });
        
        return order;
      }
      return null;
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث بيانات الطلب",
        variant: "destructive"
      });
      return null;
    }
  }
};

// خدمة إدارة سجلات الإنتاج
export const productionService = {
  async getAll(): Promise<ProductionRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 350));
    return localProductionRecords;
  },
  
  async create(record: Omit<ProductionRecord, 'id'>): Promise<ProductionRecord | null> {
    try {
      const newRecord: ProductionRecord = {
        ...record,
        id: `prod-${Date.now()}`
      };
      localProductionRecords.push(newRecord);
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة سجل الإنتاج بنجاح"
      });
      
      return newRecord;
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة سجل الإنتاج",
        variant: "destructive"
      });
      return null;
    }
  }
};

// خدمة الإحصائيات
export const statsService = {
  async getMonthlyStats(month: string, year: number) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      month,
      year,
      total_production: 28500,
      target_completion_percentage: 92
    };
  },
  
  async updateMonthlyStats(month: string, year: number, data: { total_production?: number, target_completion_percentage?: number }) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
  }
};
