import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Rank } from "@shared/schema";

interface RankDistribution {
  rank: Rank;
  count: number;
}

export default function RankDistribution() {
  const { data: distribution, isLoading } = useQuery<RankDistribution[]>({
    queryKey: ["/api/dashboard/rank-distribution"],
  });

  const getRankColor = (level: number) => {
    if (level >= 2 && level <= 5) return 'bg-gray-500';
    if (level >= 6 && level <= 10) return 'bg-orange-500';
    if (level >= 11 && level <= 13) return 'bg-yellow-500';
    if (level >= 14 && level <= 15) return 'bg-green-500';
    return 'bg-military-blue';
  };

  const getMaxCount = () => {
    if (!distribution) return 1;
    return Math.max(...distribution.map(d => d.count));
  };

  const maxCount = getMaxCount();

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Rangverteilung
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-6" />
                  <Skeleton className="w-16 h-2 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {distribution?.slice(0, 8).map((item) => {
              const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
              
              return (
                <div key={item.rank.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${getRankColor(item.rank.level)} rounded-full`}></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.rank.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {item.count}
                    </span>
                    <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className={`${getRankColor(item.rank.level)} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
