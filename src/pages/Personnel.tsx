import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Award, Star } from "lucide-react";
import { MockApiService } from "@/services/mockApiService";
import { getRankCategoryClass, getDifficultyClass, getDifficultyLabel, formatDate } from "@/lib/utils";

export default function Personnel() {
  const queryClient = useQueryClient();
  
  const { data: personnel, isLoading } = useQuery({
    queryKey: ["personnel"],
    queryFn: MockApiService.getPersonnel,
  });

  const { data: ranks } = useQuery({
    queryKey: ["ranks"],
    queryFn: MockApiService.getRanks,
  });

  const { data: specialPositions } = useQuery({
    queryKey: ["special-positions"],
    queryFn: MockApiService.getSpecialPositions,
  });

  const promoteMutation = useMutation({
    mutationFn: ({ personnelId, toRankId, notes }: { personnelId: number; toRankId: number; notes?: string }) =>
      MockApiService.promotePersonnel(personnelId, toRankId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personnel"] });
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["rank-distribution"] });
    },
  });

  const handlePromote = (personnelId: number, currentRankId: number) => {
    const nextRank = ranks?.find(r => r.level === (ranks.find(r => r.id === currentRankId)?.level || 0) + 1);
    if (nextRank) {
      promoteMutation.mutate({
        personnelId,
        toRankId: nextRank.id,
        notes: "Demo-Beförderung"
      });
    }
  };

  const canPromote = (person: any) => {
    const currentRank = ranks?.find(r => r.id === person.currentRankId);
    const nextRank = ranks?.find(r => r.level === (currentRank?.level || 0) + 1);
    return nextRank && person.totalPoints >= nextRank.pointsRequired;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Personal</h1>
          <p className="text-gray-600 dark:text-gray-400">Verwaltung der Army-Mitglieder</p>
        </div>
        <Button className="military-button">
          <Plus className="h-4 w-4 mr-2" />
          Neues Mitglied
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Gesamt</p>
              <p className="text-2xl font-bold">{personnel?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Award className="h-8 w-8 text-amber-600 mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Mannschaft</p>
              <p className="text-2xl font-bold">
                {personnel?.filter(p => p.currentRank.level >= 2 && p.currentRank.level <= 5).length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Award className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Unteroffiziere</p>
              <p className="text-2xl font-bold">
                {personnel?.filter(p => p.currentRank.level >= 6 && p.currentRank.level <= 10).length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Award className="h-8 w-8 text-purple-600 mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Offiziere</p>
              <p className="text-2xl font-bold">
                {personnel?.filter(p => p.currentRank.level >= 11 && p.currentRank.level <= 15).length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personnel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personnel?.map((person) => (
          <Card key={person.id} className="military-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {person.firstName} {person.lastName}
                  </CardTitle>
                  <CardDescription>
                    {person.armyId} • Beigetreten: {formatDate(person.joinDate)}
                  </CardDescription>
                </div>
                {person.specialPosition && (
                  <Star className="h-5 w-5 text-amber-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Rank */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Rang</span>
                  <Badge className={`rank-badge ${getRankCategoryClass(person.currentRank.level)}`}>
                    {person.currentRank.name}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Level {person.currentRank.level} • {person.totalPoints} Punkte
                </div>
              </div>

              {/* Special Position */}
              {person.specialPosition && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Sonderposition</span>
                    <Badge className={`difficulty-badge ${getDifficultyClass(person.specialPosition.difficulty)}`}>
                      {getDifficultyLabel(person.specialPosition.difficulty)}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium">{person.specialPosition.name}</div>
                  <div className="text-xs text-muted-foreground">
                    +{person.specialPosition.bonusPointsPerWeek} Punkte/Woche
                  </div>
                </div>
              )}

              {/* Progress to next rank */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Nächster Rang</span>
                  <span>{person.totalPoints} / {
                    ranks?.find(r => r.level === person.currentRank.level + 1)?.pointsRequired || '---'
                  }</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{
                      width: `${Math.min(100, 
                        ((person.totalPoints - person.currentRank.pointsRequired) / 
                        ((ranks?.find(r => r.level === person.currentRank.level + 1)?.pointsRequired || person.currentRank.pointsRequired) - person.currentRank.pointsRequired)) * 100
                      )}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  disabled={!canPromote(person) || promoteMutation.isPending}
                  onClick={() => handlePromote(person.id, person.currentRankId)}
                >
                  {promoteMutation.isPending ? 'Wird befördert...' : 'Befördern'}
                </Button>
                <Button size="sm" variant="ghost">
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}