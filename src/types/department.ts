
export interface Department {
  id: string;
  name: string;
  employeeCount: number;
}

// Database schema type for Department
export interface DepartmentDB {
  id: string;
  name: string;
  employee_count: number | null;
  created_at: string | null;
}

// Mapping functions between DB and app models
export function dbToDepartmentModel(dbDepartment: DepartmentDB): Department {
  return {
    id: dbDepartment.id,
    name: dbDepartment.name,
    employeeCount: dbDepartment.employee_count || 0
  };
}

export function departmentToDbModel(department: Department | Omit<Department, "id">): Partial<DepartmentDB> {
  return {
    name: department.name,
    employee_count: department.employeeCount,
    ...(('id' in department) ? { id: department.id } : {})
  };
}
