
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  Users,
  Target,
  UserX
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

const StatsCard = ({ title, value, icon, color, description }: StatsCardProps) => {
  return (
    <Card className={`${color} hover:shadow-md transition-shadow duration-200`}>
      <CardContent className="p-6 flex justify-between items-center">
        <div className="space-y-2">
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className="text-gray-500 opacity-60">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  totalProduction: number;
  targetCompletion: number;
  totalEmployeesToday: number;
  absentEmployees: number;
}

export const DashboardStats = ({
  totalProduction,
  targetCompletion,
  totalEmployeesToday,
  absentEmployees
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatsCard 
        title="إجمالي الإنتاج"
        value={totalProduction}
        description="قطعة اليوم"
        icon={<CalendarDays size={28} />}
        color="bg-blue-50 border-blue-100"
      />
      <StatsCard 
        title="نسبة تحقيق الهدف"
        value={`${targetCompletion}%`}
        description="من الهدف المطلوب"
        icon={<Target size={28} />}
        color="bg-green-50 border-green-100"
      />
      <StatsCard 
        title="إجمالي العمال اليوم"
        value={totalEmployeesToday}
        description="عامل حاضر"
        icon={<Users size={28} />}
        color="bg-purple-50 border-purple-100"
      />
      <StatsCard 
        title="العمال الغائبون"
        value={absentEmployees}
        description="عامل غائب"
        icon={<UserX size={28} />}
        color="bg-red-50 border-red-100"
      />
    </div>
  );
};
