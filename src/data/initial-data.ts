
import { Employee } from '../types/employee';
import { Order } from '../types/order';
import { Department } from '../types/department';
import { ProductionRecord } from '../types/production';

export const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'سيد محمد',
    department: 'التجميع',
    dailyTarget: 100,
    production: 4000,
    bonusPercentage: 5,
    monthlyProduction: 4000,
    status: 'يعمل في طلب تلاجه',
    currentOrder: '3'
  },
  {
    id: '2',
    name: 'هاله علي',
    department: 'التغليف',
    dailyTarget: 200,
    production: 500,
    bonusPercentage: 5,
    monthlyProduction: 500,
    status: 'يعمل في طلب الوزيري',
    currentOrder: '2'
  },
  {
    id: '3',
    name: 'أحمد محمود',
    department: 'التجميع',
    dailyTarget: 150,
    production: 300,
    bonusPercentage: 5,
    monthlyProduction: 300,
    status: 'غائب'
  }
];

export const initialOrders: Order[] = [
  {
    id: '1',
    client: 'شيخون',
    product: { id: '1', name: 'جراب أيفون 13', type: 'هاتف', quantity: 200 },
    products: [
      { id: '1', name: 'جراب أيفون 13', type: 'هاتف', quantity: 200 }
    ],
    totalQuantity: 200,
    entryDate: '٢٠٢٥/٠٥/٠٩',
    deliveryDate: '٢٠٢٥/٠٥/٢٤',
    receivingDate: '٢٠٢٥/٠٥/٢٤',
    status: 'completed',
    completionPercentage: 100,
    assignedWorkers: []
  },
  {
    id: '2',
    client: 'الوزيري',
    product: { id: '2', name: 'جراب سامسونج S22', type: 'هاتف', quantity: 150 },
    products: [
      { id: '2', name: 'جراب سامسونج S22', type: 'هاتف', quantity: 150 }
    ],
    totalQuantity: 150,
    entryDate: '٢٠٢٥/٠٥/٠٩',
    deliveryDate: '٢٠٢٥/٠٥/٢٩',
    receivingDate: '٢٠٢٥/٠٥/٢٩',
    status: 'pending',
    completionPercentage: 75,
    assignedWorkers: ['2']
  },
  {
    id: '3',
    client: 'تلاجه',
    product: { id: '3', name: 'A16', type: 'جهاز', quantity: 80 },
    products: [
      { id: '3', name: 'A16', type: 'جهاز', quantity: 80 }
    ],
    totalQuantity: 80,
    entryDate: '٢٠٢٥/٠٥/٠٩',
    deliveryDate: '٢٠٢٥/٠٥/٠٣',
    receivingDate: '٢٠٢٥/٠٥/٠٣',
    status: 'pending',
    completionPercentage: 60,
    assignedWorkers: ['1']
  }
];

export const initialDepartments: Department[] = [
  { id: '1', name: 'التجميع', employeeCount: 2 },
  { id: '2', name: 'التغليف', employeeCount: 1 }
];

export const initialProductionHistory: ProductionRecord[] = [
  {
    id: '1',
    employeeId: '1',
    date: '٢٠٢٥/٠٥/٣٠',
    quantity: 120,
    orderId: '3',
    orderDetails: 'تلاجه - A16'
  },
  {
    id: '2',
    employeeId: '1',
    date: '٢٠٢٥/٠٥/٢٤',
    quantity: 150,
    orderId: '3',
    orderDetails: 'تلاجه - A16'
  },
  {
    id: '3',
    employeeId: '1',
    date: '٢٠٢٥/٠٥/٠٩',
    quantity: 200,
    orderId: '3',
    orderDetails: 'تلاجه - A16'
  },
  {
    id: '4',
    employeeId: '1',
    date: '٢٠٢٥/٠٥/٠٢',
    quantity: 180,
    orderId: '1',
    orderDetails: 'شيخون - جراب أيفون 13'
  },
  {
    id: '5',
    employeeId: '2',
    date: '٢٠٢٥/٠٥/١٥',
    quantity: 100,
    orderId: '2',
    orderDetails: 'الوزيري - جراب سامسونج S22'
  }
];

export const initialPreviousMonthProduction = 3000;
