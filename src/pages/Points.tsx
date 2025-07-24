import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Plus, Calendar, User } from "lucide-react";
import { MockApiService } from "@/services/mockApiService";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function Points() {
  const queryClient = useQueryClient();
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return startOfWeek.toISOString().split('T')[0];
  });

  const { data: pointEntries, isLoading } = useQuery({
    queryKey: ["point-entries"],
    queryFn: MockApiService.getPointEntries,
  });

  const { data: personnel } = useQuery({
    queryKey: ["personnel"],
    queryFn: MockApiService.getPersonnel,
  });

  const addPointsMutation = useMutation({
    mutationFn: (data: { personnelId: number; weekStart: string; activityPoints: number; notes?: string }) =>
      MockApiService.createPointEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["point-entries"] });
      queryClient.invalidateQueries({ queryKey: ["personnel"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const handleAddPoints = (personnelId: number) => {
    const points = Math.floor(Math.random() * 20) + 15; // 15-35 points
    addPointsMutation.mutate({
      personnelId,
      weekStart: selectedWeek,
      activityPoints: points,
      notes: `Demo-Punkteeintrag: ${points} Aktivitätspunkte`
    });
  };

  const getPersonName = (personnelId: number) => {
    const person = personnel?.find(p => p.id === personnelId);
    return person ? `${person.firstName} ${person.lastName}` : 'Unbekannt';
  };

  const weeklyEntries = pointEntries?.filter(entry => entry.weekStart === selectedWeek) || [];
  const totalPointsThisWeek = weeklyEntries.reduce((sum, entry) => sum + entry.totalWeekPoints, 0);
  const averagePointsThisWeek = weeklyEntries.length > 0 ? Math.round(totalPointsThisWeek / weeklyEntries.length) : 0;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Punkte-System</h1>
          <p className="text-gray-600 dark:text-gray-400">Wöchentliche Aktivitätspunkte verwalten</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <input
              type="date"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <Button className="military-button">
            <Plus className="h-4 w-4 mr-2" />
            Punkte eintragen
          </Button>
        </div>
      </div>

      {/* Weekly Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Einträge diese Woche</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyEntries.length}</div>
            <p className="text-xs text-muted-foreground">Punkteeinträge</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamtpunkte</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPointsThisWeek}</div>
            <p className="text-xs text-muted-foreground">Punkte diese Woche</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durchschnitt</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averagePointsThisWeek}</div>
            <p className="text-xs text-muted-foreground">Punkte pro Person</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Schnelle Punktevergabe</CardTitle>
          <CardDescription>
            Klicken Sie auf ein Mitglied, um schnell Punkte zu vergeben
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personnel?.map((person) => {
              const hasEntryThisWeek = weeklyEntries.some(entry => entry.personnelId === person.id);
              return (
                <div
                  key={person.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    hasEntryThisWeek 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800' 
                      : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  }`}
                  onClick={() => !hasEntryThisWeek && handleAddPoints(person.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium">{person.firstName} {person.lastName}</p>
                        <p className="text-sm text-muted-foreground">{person.currentRank.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {hasEntryThisWeek ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓ Eingetragen
                        </Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          disabled={addPointsMutation.isPending}
                          className="military-button"
                        >
                          {addPointsMutation.isPending ? 'Wird gespeichert...' : 'Punkte vergeben'}
                        </Button>
                      )}
                    </div>
                  </div>
                  {person.specialPosition && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {person.specialPosition.name} (+{person.specialPosition.bonusPointsPerWeek} Bonus)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Point Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Aktuelle Punkteeinträge</CardTitle>
          <CardDescription>
            Letzte Aktivitätspunkte für KW {formatDate(selectedWeek)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Keine Punkteeinträge für diese Woche</p>
                <p className="text-sm">Vergeben Sie Punkte über die Schnellaktionen oben</p>
              </div>
            ) : (
              weeklyEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <User className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{getPersonName(entry.personnelId)}</p>
                      <p className="text-sm text-muted-foreground">
                        Eingetragen: {formatDateTime(entry.createdAt)}
                      </p>
                      {entry.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">
                        {entry.activityPoints} Aktivität
                      </Badge>
                      {entry.specialPositionPoints > 0 && (
                        <Badge variant="secondary">
                          +{entry.specialPositionPoints} Bonus
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      {entry.totalWeekPoints} Punkte
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}