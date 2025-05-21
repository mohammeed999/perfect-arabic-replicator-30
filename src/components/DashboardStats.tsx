
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  Users,
  ClipboardCheck,
  Target
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatsCard = ({ title, value, icon, color }: StatsCardProps) => {
  return (
    <Card className={`${color}`}>
      <CardContent className="p-6 flex justify-between items-center">
        <div className="space-y-2">
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-gray-400">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  totalProduction: number;
  totalEmployees: number;
  pendingOrders: number;
  targetCompletion: number;
}

export const DashboardStats = ({
  totalProduction,
  totalEmployees,
  pendingOrders,
  targetCompletion
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <StatsCard 
        title="إجمالي الإنتاج"
        value={totalProduction}
        icon={<CalendarDays size={24} />}
        color="bg-blue-50"
      />
      <StatsCard 
        title="إجمالي العمال"
        value={totalEmployees}
        icon={<Users size={24} />}
        color="bg-blue-50"
      />
      <StatsCard 
        title="الطلبات المعلقة"
        value={pendingOrders}
        icon={<ClipboardCheck size={24} />}
        color="bg-yellow-50"
      />
      <StatsCard 
        title="نسبة تحقيق الهدف"
        value={`${targetCompletion}%`}
        icon={<Target size={24} />}
        color="bg-blue-50"
      />
    </div>
  );
};
