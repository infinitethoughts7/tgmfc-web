import { LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-green-600",
  bgColor = "bg-green-50",
  trend,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={`${bgColor} p-4 rounded-lg`}>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
