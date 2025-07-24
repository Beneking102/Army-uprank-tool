import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Rank } from "@shared/schema";

export default function Ranks() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  const { data: ranks, isLoading: ranksLoading } = useQuery<Rank[]>({
    queryKey: ["/api/ranks"],
    enabled: isAuthenticated,
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Sie sind abgemeldet. Erneute Anmeldung...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  const getRankCategory = (level: number) => {
    if (level >= 2 && level <= 5) return { name: "Mannschaft", color: "bg-gray-100 text-gray-800" };
    if (level >= 6 && level <= 10) return { name: "Unteroffiziere", color: "bg-blue-100 text-blue-800" };
    if (level >= 11 && level <= 15) return { name: "Offiziere", color: "bg-green-100 text-green-800" };
    return { name: "Unbekannt", color: "bg-red-100 text-red-800" };
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ränge & Beförderungen</h1>
          <p className="text-gray-600 mt-1">Übersicht über das Rangsystem</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ranksLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : (
              ranks?.map((rank) => {
                const category = getRankCategory(rank.level);
                return (
                  <Card key={rank.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {rank.name}
                        </CardTitle>
                        <Badge variant="outline" className={category.color}>
                          Rang {rank.level}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {category.name}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Gesamt Punkte:</span>
                          <span className="font-medium">{rank.pointsRequired}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Für Beförderung:</span>
                          <span className="font-medium">{rank.pointsFromPrevious}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
      </div>
    </div>
  );
}
