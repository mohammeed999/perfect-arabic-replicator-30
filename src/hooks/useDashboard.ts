import { useState, useEffect, useCallback } from 'react';
import { employeeService, orderService, departmentService, productionService, statsService } from '@/services/supabaseService';
import type { Employee } from '@/types/employee';
import type { Order } from '@/types/order';
import type { Department } from '@/types/department';
import type { ProductionRecord } from '@/types/production';

export const useDashboard = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [productionHistory, setProductionHistory] = useState<ProductionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousMonthProduction, setPreviousMonthProduction] = useState(0);

  // استرجاع البيانات الأولية
  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // جلب البيانات بالتوازي
      const [employeesData, ordersData, departmentsData, productionData] = await Promise.all([
        employeeService.getAll(),
        orderService.getAll(),
        departmentService.getAll(),
        productionService.getAll()
      ]);

      setEmployees(employeesData);
      setOrders(ordersData);
      setDepartments(departmentsData);
      setProductionHistory(productionData);
      
      // جلب إحصائيات الشهر السابق
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      const prevMonth = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      
      const monthlyStats = await statsService.getMonthlyStats(prevMonth, year);
      if (monthlyStats) {
        setPreviousMonthProduction(monthlyStats.total_production || 0);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // وظيفة إضافة موظف جديد
  const addEmployee = async (employee: Omit<Employee, "id">) => {
    const newEmployee = await employeeService.create(employee);
    if (newEmployee) {
      setEmployees(prev => [...prev, newEmployee]);
    }
  };

  // وظيفة تحديث بيانات موظف
  const updateEmployee = async (employee: Employee) => {
    const updatedEmployee = await employeeService.update(employee);
    if (updatedEmployee) {
      setEmployees(prev => prev.map(emp => emp.id === employee.id ? updatedEmployee : emp));
    }
  };

  // وظيفة إضافة طلب جديد
  const addOrder = async (order: Omit<Order, "id">) => {
    const newOrder = await orderService.create(order);
    if (newOrder) {
      setOrders(prev => [...prev, newOrder]);
    }
  };

  // وظيفة تحديث بيانات طلب
  const updateOrder = async (order: Order) => {
    const updatedOrder = await orderService.update(order);
    if (updatedOrder) {
      setOrders(prev => prev.map(ord => ord.id === order.id ? updatedOrder : ord));
    }
  };

  // وظيفة إضافة قسم جديد
  const addDepartment = async (department: Omit<Department, "id">) => {
    const newDepartment = await departmentService.create(department);
    if (newDepartment) {
      setDepartments(prev => [...prev, newDepartment]);
    }
  };

  // وظيفة إضافة سجل إنتاج
  const addProductionRecord = async (employeeId: string, quantity: number, orderId: string) => {
    // الحصول على معلومات الطلب لحفظه في السجل
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const orderDetails = `${order.client} - ${order.product.name}`;
    const date = new Date().toISOString().split('T')[0];

    const record: Omit<ProductionRecord, "id"> = {
      employeeId,
      date,
      quantity,
      orderId,
      orderDetails
    };

    const newRecord = await productionService.create(record);
    if (newRecord) {
      setProductionHistory(prev => [...prev, newRecord]);

      // تحديث إنتاج الموظف
      const employee = employees.find(e => e.id === employeeId);
      if (employee) {
        const updatedEmployee = {
          ...employee,
          production: (employee.production || 0) + quantity,
          monthlyProduction: (employee.monthlyProduction || 0) + quantity
        };
        updateEmployee(updatedEmployee);
      }

      // تحديث نسبة إكمال الطلب
      const updatedOrder = {
        ...order,
        completionPercentage: Math.min(
          100,
          Math.round(
            ((order.completionPercentage / 100) * order.totalQuantity + quantity) / order.totalQuantity * 100
          )
        ),
        status: ((order.completionPercentage / 100) * order.totalQuantity + quantity) >= order.totalQuantity
          ? 'completed' as const
          : 'pending' as const
      };
      updateOrder(updatedOrder);
    }
  };

  // وظائف مساعدة
  const getEmployeesByDepartment = (departmentId: string) => {
    return employees.filter(employee => employee.department === departmentId);
  };

  const getOrdersByClient = (client: string) => {
    return orders.filter(order => order.client === client);
  };

  const getTotalProduction = () => {
    return employees.reduce((total, employee) => total + (employee.production || 0), 0);
  };

  const getPendingOrdersCount = () => {
    return orders.filter(order => order.status === 'pending').length;
  };

  const getOrderCompletionTarget = () => {
    const totalOrders = orders.length;
    if (totalOrders === 0) return 0;

    const completedOrders = orders.filter(order => order.status === 'completed').length;
    return Math.round((completedOrders / totalOrders) * 100);
  };

  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions;
    return new Date().toLocaleDateString('ar-EG', options);
  };

  const getAvailableEmployees = () => {
    return employees.filter(employee => !employee.currentOrder);
  };

  const assignEmployeeToOrder = async (employeeId: string, orderId: string) => {
    // تحديث الموظف
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      const updatedEmployee = { ...employee, currentOrder: orderId };
      await updateEmployee(updatedEmployee);
    }

    // تحديث الطلب
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const assignedWorkers = order.assignedWorkers || [];
      if (!assignedWorkers.includes(employeeId)) {
        const updatedOrder = {
          ...order,
          assignedWorkers: [...assignedWorkers, employeeId]
        };
        await updateOrder(updatedOrder);
      }
    }
  };

  const getEmployeeProductionHistory = (employeeId: string) => {
    return productionHistory.filter(record => record.employeeId === employeeId);
  };

  const getPreviousMonthProduction = () => {
    return previousMonthProduction;
  };

  return {
    employees,
    orders,
    departments,
    productionHistory,
    isLoading,
    previousMonthProduction,
    addEmployee,
    updateEmployee,
    addOrder,
    updateOrder,
    addDepartment,
    getEmployeesByDepartment,
    getOrdersByClient,
    getTotalProduction,
    getPendingOrdersCount,
    getOrderCompletionTarget,
    getCurrentDate,
    getAvailableEmployees,
    assignEmployeeToOrder,
    addProductionRecord,
    getEmployeeProductionHistory,
    getPreviousMonthProduction,
    refresh: fetchInitialData
  };
};
