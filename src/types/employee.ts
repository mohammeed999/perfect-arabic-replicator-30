
export interface Employee {
  id: string;
  name: string;
  department: string;
  dailyTarget: number;
  production: number;
  bonusPercentage: number;
  monthlyProduction: number;
  monthlySalary: number; // إضافة الراتب الشهري
  status: string;
  currentOrder?: string;
}

// Database schema type for Employee
export interface EmployeeDB {
  id: string;
  name: string;
  department: string;
  daily_target: number;
  production: number;
  monthly_production: number;
  monthly_salary: number; // إضافة الراتب الشهري
  status: string | null;
  current_order: string | null;
  created_at: string | null;
}

// Mapping functions between DB and app models
export function dbToEmployeeModel(dbEmployee: EmployeeDB): Employee {
  return {
    id: dbEmployee.id,
    name: dbEmployee.name,
    department: dbEmployee.department,
    dailyTarget: dbEmployee.daily_target || 0,
    production: dbEmployee.production || 0,
    bonusPercentage: 0, // Default value since this doesn't exist in DB
    monthlyProduction: dbEmployee.monthly_production || 0,
    monthlySalary: dbEmployee.monthly_salary || 0,
    status: dbEmployee.status || '',
    currentOrder: dbEmployee.current_order || undefined
  };
}

export function employeeToDbModel(employee: Employee | Omit<Employee, "id">): Partial<EmployeeDB> {
  return {
    name: employee.name,
    department: employee.department,
    daily_target: employee.dailyTarget,
    production: employee.production,
    monthly_production: employee.monthlyProduction,
    monthly_salary: employee.monthlySalary || 0,
    status: employee.status,
    current_order: employee.currentOrder,
    ...(('id' in employee) ? { id: employee.id } : {})
  };
}
