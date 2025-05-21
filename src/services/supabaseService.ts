
import { supabase } from "@/integrations/supabase/client";
import type { Employee } from "@/types/employee";
import type { Department } from "@/types/department";
import type { Order } from "@/types/order";
import type { ProductionRecord } from "@/types/production";
import { toast } from "@/components/ui/use-toast";

// خدمة إدارة الموظفين
export const employeeService = {
  async getAll(): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*');
      
      if (error) throw error;
      return data as Employee[];
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
      const { data, error } = await supabase
        .from('employees')
        .insert([employee])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الموظف بنجاح"
      });
      
      return data as Employee;
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
      const { data, error } = await supabase
        .from('employees')
        .update(employee)
        .eq('id', employee.id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم تحديث بيانات الموظف بنجاح"
      });
      
      return data as Employee;
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
      return data as Department[];
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
      const { data, error } = await supabase
        .from('departments')
        .insert([department])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة القسم بنجاح"
      });
      
      return data as Department;
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
      return data as Order[];
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
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الطلب بنجاح"
      });
      
      return data as Order;
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
      const { data, error } = await supabase
        .from('orders')
        .update(order)
        .eq('id', order.id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم تحديث بيانات الطلب بنجاح"
      });
      
      return data as Order;
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
      return data as ProductionRecord[];
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
      const { data, error } = await supabase
        .from('production_records')
        .insert([record])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة سجل الإنتاج بنجاح"
      });
      
      return data as ProductionRecord;
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
