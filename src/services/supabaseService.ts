
import { supabase } from "@/integrations/supabase/client";
import { Employee, EmployeeDB, dbToEmployeeModel, employeeToDbModel } from "@/types/employee";
import { Department, DepartmentDB, dbToDepartmentModel, departmentToDbModel } from "@/types/department";
import { Order, OrderDB, dbToOrderModel, orderToDbModel } from "@/types/order";
import { ProductionRecord, ProductionRecordDB, dbToProductionRecordModel, productionRecordToDbModel } from "@/types/production";
import { toast } from "@/components/ui/use-toast";

// خدمة إدارة الموظفين
export const employeeService = {
  async getAll(): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*');
      
      if (error) throw error;
      return (data as EmployeeDB[]).map(dbToEmployeeModel);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء استرجاع بيانات الموظفين",
        variant: "destructive"
      });
      return [];
    }
  },
  
  async create(employee: Omit<Employee, 'id'>): Promise<Employee | null> {
    try {
      const employeeDB = employeeToDbModel(employee);
      
      // Make sure required fields are not undefined
      if (!employeeDB.name || !employeeDB.department) {
        throw new Error("Required fields missing");
      }
      
      const { data, error } = await supabase
        .from('employees')
        .insert([employeeDB]) // Pass as array
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الموظف بنجاح"
      });
      
      return dbToEmployeeModel(data as EmployeeDB);
    } catch (error) {
      console.error('Error creating employee:', error);
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
      const employeeDB = employeeToDbModel(employee);
      
      const { data, error } = await supabase
        .from('employees')
        .update(employeeDB)
        .eq('id', employee.id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم تحديث بيانات الموظف بنجاح"
      });
      
      return dbToEmployeeModel(data as EmployeeDB);
    } catch (error) {
      console.error('Error updating employee:', error);
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
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*');
      
      if (error) throw error;
      return (data as DepartmentDB[]).map(dbToDepartmentModel);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء استرجاع بيانات الأقسام",
        variant: "destructive"
      });
      return [];
    }
  },
  
  async create(department: Omit<Department, 'id'>): Promise<Department | null> {
    try {
      const departmentDB = departmentToDbModel(department);
      
      // Make sure required fields are not undefined
      if (!departmentDB.name) {
        throw new Error("Department name is required");
      }
      
      const { data, error } = await supabase
        .from('departments')
        .insert([departmentDB]) // Pass as array with required fields
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة القسم بنجاح"
      });
      
      return dbToDepartmentModel(data as DepartmentDB);
    } catch (error) {
      console.error('Error creating department:', error);
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
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*');
      
      if (error) throw error;
      return (data as OrderDB[]).map(dbToOrderModel);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء استرجاع بيانات الطلبات",
        variant: "destructive"
      });
      return [];
    }
  },
  
  async create(order: Omit<Order, 'id'>): Promise<Order | null> {
    try {
      const orderDB = orderToDbModel(order);
      
      // Make sure required fields are not undefined
      if (!orderDB.client || !orderDB.delivery_date || !orderDB.entry_date || 
          !orderDB.product || !orderDB.receiving_date || !orderDB.status || 
          orderDB.total_quantity === undefined) {
        throw new Error("Required order fields missing");
      }
      
      const { data, error } = await supabase
        .from('orders')
        .insert([orderDB]) // Pass as array
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الطلب بنجاح"
      });
      
      return dbToOrderModel(data as OrderDB);
    } catch (error) {
      console.error('Error creating order:', error);
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
      const orderDB = orderToDbModel(order);
      
      const { data, error } = await supabase
        .from('orders')
        .update(orderDB)
        .eq('id', order.id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم تحديث بيانات الطلب بنجاح"
      });
      
      return dbToOrderModel(data as OrderDB);
    } catch (error) {
      console.error('Error updating order:', error);
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
    try {
      const { data, error } = await supabase
        .from('production_records')
        .select('*');
      
      if (error) throw error;
      return (data as ProductionRecordDB[]).map(dbToProductionRecordModel);
    } catch (error) {
      console.error('Error fetching production records:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء استرجاع سجلات الإنتاج",
        variant: "destructive"
      });
      return [];
    }
  },
  
  async create(record: Omit<ProductionRecord, 'id'>): Promise<ProductionRecord | null> {
    try {
      const recordDB = productionRecordToDbModel(record);
      
      // Make sure required fields are not undefined
      if (!recordDB.date || recordDB.quantity === undefined) {
        throw new Error("Required production record fields missing");
      }
      
      const { data, error } = await supabase
        .from('production_records')
        .insert([recordDB]) // Pass as array
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة سجل الإنتاج بنجاح"
      });
      
      return dbToProductionRecordModel(data as ProductionRecordDB);
    } catch (error) {
      console.error('Error creating production record:', error);
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
    try {
      const { data, error } = await supabase
        .from('monthly_stats')
        .select('*')
        .eq('month', month)
        .eq('year', year)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء استرجاع إحصائيات الشهر",
        variant: "destructive"
      });
      return null;
    }
  },
  
  async updateMonthlyStats(month: string, year: number, data: { total_production?: number, target_completion_percentage?: number }) {
    try {
      // تحقق مما إذا كان السجل موجودًا
      const { data: existingData } = await supabase
        .from('monthly_stats')
        .select('*')
        .eq('month', month)
        .eq('year', year)
        .maybeSingle();
      
      if (existingData) {
        // تحديث السجل الموجود
        const { error } = await supabase
          .from('monthly_stats')
          .update(data)
          .eq('month', month)
          .eq('year', year);
          
        if (error) throw error;
      } else {
        // إنشاء سجل جديد
        const { error } = await supabase
          .from('monthly_stats')
          .insert([{ 
            month, 
            year, 
            total_production: data.total_production || 0, 
            target_completion_percentage: data.target_completion_percentage || 0 
          }]);
          
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating monthly stats:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث إحصائيات الشهر",
        variant: "destructive"
      });
      return false;
    }
  }
};
