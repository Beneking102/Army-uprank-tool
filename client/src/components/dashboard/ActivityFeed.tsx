import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Plus, Star, GraduationCap } from "lucide-react";
import type { Promotion } from "@shared/schema";

export default function ActivityFeed() {
  const { data: promotions, isLoading } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions"],
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'promotion':
        return <ArrowUp className="text-white text-sm" />;
      case 'points':
        return <Plus className="text-white text-sm" />;
      case 'special':
        return <Star className="text-white text-sm" />;
      case 'training':
        return <GraduationCap className="text-white text-sm" />;
      default:
        return <Plus className="text-white text-sm" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'promotion':
        return 'bg-military-blue';
      case 'points':
        return 'bg-military-green';
      case 'special':
        return 'bg-yellow-500';
      case 'training':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'promotion':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'points':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'special':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'training':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Mock activities for now - in real app, combine from multiple sources
  const mockActivities = [
    {
      id: 1,
      type: 'promotion',
      user: 'Max Mustermann',
      action: 'wurde zu Sergeant befördert',
      timestamp: 'vor 2 Stunden',
      badge: '+150 Punkte'
    },
    {
      id: 2,
      type: 'points',
      user: 'Anna Schmidt',
      action: 'hat 35 Punkte für Wochenaktivität erhalten',
      timestamp: 'vor 4 Stunden',
      badge: 'Aktivität'
    },
    {
      id: 3,
      type: 'special',
      user: 'Tom Weber',
      action: 'wurde zum Drill Sergeant ernannt',
      timestamp: 'vor 1 Tag',
      badge: 'Sonderposition'
    },
    {
      id: 4,
      type: 'training',
      user: 'Lisa Müller',
      action: 'hat eine Ausbildung abgeschlossen',
      timestamp: 'vor 2 Tagen',
      badge: 'Ausbildung'
    }
  ];

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Letzte Aktivitäten
          </CardTitle>
          <Button variant="ghost" className="text-military-blue hover:text-blue-700 text-sm font-medium">
            Alle anzeigen
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`w-10 h-10 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.timestamp}</p>
                </div>
                <Badge className={getBadgeColor(activity.type)}>
                  {activity.badge}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
