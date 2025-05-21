
export interface Employee {
  id: string;
  name: string;
  department: string;
  dailyTarget: number;
  production: number;
  bonusPercentage: number;
  monthlyProduction: number;
  status: string;
  currentOrder?: string;
}
