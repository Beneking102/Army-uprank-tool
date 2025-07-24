import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, Award, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalPersonnel: number;
  activeMembers: number;
  promotionsThisWeek: number;
  averagePoints: number;
}

export default function StatsGrid() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const statCards = [
    {
      title: "Gesamtes Personal",
      value: stats?.totalPersonnel || 0,
      icon: Users,
      color: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-military-blue",
      change: "+12%",
      changeText: "vs. letzte Woche"
    },
    {
      title: "Aktive Mitglieder",
      value: stats?.activeMembers || 0,
      icon: UserCheck,
      color: "bg-green-100 dark:bg-green-900",
      iconColor: "text-military-green",
      change: "+5%",
      changeText: "vs. letzte Woche"
    },
    {
      title: "Beförderungen",
      value: stats?.promotionsThisWeek || 0,
      icon: Award,
      color: "bg-yellow-100 dark:bg-yellow-900",
      iconColor: "text-yellow-600",
      change: null,
      changeText: "Diese Woche"
    },
    {
      title: "Durchschnittspunkte",
      value: stats?.averagePoints || 0,
      icon: TrendingUp,
      color: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600",
      change: "+2.1",
      changeText: "vs. letzte Woche"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card key={index} className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{stat.title}</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mt-2" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${stat.iconColor} text-xl`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.change && (
                  <span className="text-military-green text-sm font-medium">{stat.change}</span>
                )}
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">{stat.changeText}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
