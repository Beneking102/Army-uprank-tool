import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Users, TrendingUp } from "lucide-react";
import { MockApiService } from "@/services/mockApiService";
import { getDifficultyClass, getDifficultyLabel } from "@/lib/utils";

export default function SpecialPositions() {
  const { data: specialPositions, isLoading } = useQuery({
    queryKey: ["special-positions"],
    queryFn: MockApiService.getSpecialPositions,
  });

  const { data: personnel } = useQuery({
    queryKey: ["personnel"],
    queryFn: MockApiService.getPersonnel,
  });

  const getPersonnelWithPosition = (positionId: number) => {
    return personnel?.filter(p => p.specialPositionIds.includes(positionId)) || [];
  };

  const getTotalWeeklyBonus = () => {
    let total = 0;
    specialPositions?.forEach(pos => {
      const count = getPersonnelWithPosition(pos.id).length;
      total += count * pos.bonusPointsPerWeek;
    });
    return total;
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const easyPositions = specialPositions?.filter(p => p.difficulty === 'easy') || [];
  const mediumPositions = specialPositions?.filter(p => p.difficulty === 'medium') || [];
  const hardPositions = specialPositions?.filter(p => p.difficulty === 'hard') || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sonderpositionen</h1>
          <p className="text-gray-600 dark:text-gray-400">Spezielle Rollen mit Bonus-Punkten</p>
        </div>
        <Button className="military-button">
          <Plus className="h-4 w-4 mr-2" />
          Neue Position
        </Button>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Positionen</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{specialPositions?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Verfügbare Rollen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Besetzte Positionen</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {specialPositions?.reduce((sum, pos) => sum + getPersonnelWithPosition(pos.id).length, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Zugewiesene Mitglieder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wöchentlicher Bonus</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalWeeklyBonus()}</div>
            <p className="text-xs text-muted-foreground">Punkte pro Woche</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durchschn. Bonus</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {specialPositions?.length ? Math.round(
                specialPositions.reduce((sum, pos) => sum + pos.bonusPointsPerWeek, 0) / specialPositions.length
              ) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Punkte pro Position</p>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-green-500" />
              Einfach
            </CardTitle>
            <CardDescription>Grundlegende Zusatzaufgaben</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{easyPositions.length}</div>
            <p className="text-sm text-muted-foreground">Verfügbare Positionen</p>
            <div className="mt-2 text-xs text-muted-foreground">
              ⌀ {easyPositions.length ? Math.round(easyPositions.reduce((sum, p) => sum + p.bonusPointsPerWeek, 0) / easyPositions.length) : 0} Punkte/Woche
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Mittel
            </CardTitle>
            <CardDescription>Erweiterte Verantwortlichkeiten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediumPositions.length}</div>
            <p className="text-sm text-muted-foreground">Verfügbare Positionen</p>
            <div className="mt-2 text-xs text-muted-foreground">
              ⌀ {mediumPositions.length ? Math.round(mediumPositions.reduce((sum, p) => sum + p.bonusPointsPerWeek, 0) / mediumPositions.length) : 0} Punkte/Woche
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-red-500" />
              Schwer
            </CardTitle>
            <CardDescription>Spezialisierte Expertenrollen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hardPositions.length}</div>
            <p className="text-sm text-muted-foreground">Verfügbare Positionen</p>
            <div className="mt-2 text-xs text-muted-foreground">
              ⌀ {hardPositions.length ? Math.round(hardPositions.reduce((sum, p) => sum + p.bonusPointsPerWeek, 0) / hardPositions.length) : 0} Punkte/Woche
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Special Positions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialPositions?.map((position) => {
          const assignedPersonnel = getPersonnelWithPosition(position.id);
          const totalWeeklyPoints = assignedPersonnel.length * position.bonusPointsPerWeek;
          
          return (
            <Card key={position.id} className="military-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-500" />
                      {position.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {position.description}
                    </CardDescription>
                  </div>
                  <Badge className={`difficulty-badge ${getDifficultyClass(position.difficulty)}`}>
                    {getDifficultyLabel(position.difficulty)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Bonus Points */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bonus-Punkte</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    +{position.bonusPointsPerWeek}/Woche
                  </Badge>
                </div>

                {/* Assigned Personnel */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Zugewiesen</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{assignedPersonnel.length}</span>
                  </div>
                </div>

                {/* Total Weekly Points */}
                {assignedPersonnel.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Gesamt/Woche</span>
                    <span className="font-bold text-green-600">{totalWeeklyPoints} Punkte</span>
                  </div>
                )}

                {/* Assigned Personnel List */}
                {assignedPersonnel.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-medium mb-2 text-muted-foreground">Zugewiesene Mitglieder:</p>
                    <div className="space-y-1">
                      {assignedPersonnel.map((person) => (
                        <div key={person.id} className="flex items-center justify-between text-xs">
                          <span>{person.firstName} {person.lastName}</span>
                          <Badge variant="outline" className="text-xs">
                            {person.currentRank.name}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Zuweisen
                  </Button>
                  <Button size="sm" variant="ghost">
                    Bearbeiten
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Position Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Positions-Übersicht</CardTitle>
          <CardDescription>
            Detaillierte Informationen zu allen Sonderpositionen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {specialPositions?.map((position) => {
              const assignedCount = getPersonnelWithPosition(position.id).length;
              return (
                <div key={position.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Star className="h-8 w-8 text-amber-500" />
                    <div>
                      <p className="font-medium">{position.name}</p>
                      <p className="text-sm text-muted-foreground">{position.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={`difficulty-badge ${getDifficultyClass(position.difficulty)}`}>
                      {getDifficultyLabel(position.difficulty)}
                    </Badge>
                    <div className="text-right">
                      <p className="font-medium">+{position.bonusPointsPerWeek} Punkte/Woche</p>
                      <p className="text-sm text-muted-foreground">
                        {assignedCount} {assignedCount === 1 ? 'Person' : 'Personen'} zugewiesen
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}