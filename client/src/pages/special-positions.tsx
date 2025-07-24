import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { SpecialPosition } from "@shared/schema";

export default function SpecialPositions() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  const { data: positions, isLoading: positionsLoading } = useQuery<SpecialPosition[]>({
    queryKey: ["/api/special-positions"],
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

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return { text: 'Einfach', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
      case 'medium':
        return { text: 'Mittel', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
      case 'hard':
        return { text: 'Schwer', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
      default:
        return { text: 'Unbekannt', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' };
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Sonderpositionen" subtitle="Übersicht über verfügbare Spezialisierungen" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {positionsLoading ? (
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
              positions?.map((position) => {
                const difficultyBadge = getDifficultyBadge(position.difficulty);
                return (
                  <Card key={position.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {position.name}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge className={difficultyBadge.color}>
                          {difficultyBadge.text}
                        </Badge>
                        <Badge variant="outline" className="text-military-blue border-military-blue">
                          +{position.bonusPointsPerWeek} Punkte/Woche
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300">
                        {position.description || "Keine Beschreibung verfügbar"}
                      </p>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Bonuspunkte System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">+5</div>
                    <div className="text-sm font-medium text-green-700">Einfach</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Leitstellenausbilder, Field Medics
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 mb-2">+10</div>
                    <div className="text-sm font-medium text-yellow-700">Mittel</div>
                    <div className="text-xs text-gray-600 mt-1">
                      U1 Ausbilder, Aktenkunde Ausbilder
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600 mb-2">+15</div>
                    <div className="text-sm font-medium text-red-700">Schwer</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Personalabteilung, Drill Sergeants, GWD Ausbilder
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
