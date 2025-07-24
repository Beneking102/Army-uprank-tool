import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Plus, Users, TrendingUp } from "lucide-react";
import { MockApiService } from "@/services/mockApiService";
import { getRankCategoryClass, getRankCategory } from "@/lib/utils";

export default function Ranks() {
  const { data: ranks, isLoading: ranksLoading } = useQuery({
    queryKey: ["ranks"],
    queryFn: MockApiService.getRanks,
  });

  const { data: personnel } = useQuery({
    queryKey: ["personnel"],
    queryFn: MockApiService.getPersonnel,
  });

  const { data: rankDistribution } = useQuery({
    queryKey: ["rank-distribution"],
    queryFn: MockApiService.getRankDistribution,
  });

  const getPersonnelInRank = (rankId: number) => {
    return personnel?.filter(p => p.currentRankId === rankId) || [];
  };

  const getRankStats = (level: number) => {
    const personnelInRank = personnel?.filter(p => p.currentRank.level === level) || [];
    const avgPoints = personnelInRank.length > 0 
      ? Math.round(personnelInRank.reduce((sum, p) => sum + p.totalPoints, 0) / personnelInRank.length)
      : 0;
    
    return {
      count: personnelInRank.length,
      avgPoints
    };
  };

  if (ranksLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Group ranks by category
  const mannschaft = ranks?.filter(r => r.level >= 2 && r.level <= 5) || [];
  const unteroffiziere = ranks?.filter(r => r.level >= 6 && r.level <= 10) || [];
  const offiziere = ranks?.filter(r => r.level >= 11 && r.level <= 15) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rang-System</h1>
          <p className="text-gray-600 dark:text-gray-400">Hierarchie und Beförderungssystem der NC-Army</p>
        </div>
        <Button className="military-button">
          <Plus className="h-4 w-4 mr-2" />
          Neuer Rang
        </Button>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-600" />
              Mannschaft
            </CardTitle>
            <CardDescription>Ränge 2-5 • Grundstufe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {personnel?.filter(p => p.currentRank.level >= 2 && p.currentRank.level <= 5).length || 0}
            </div>
            <p className="text-sm text-muted-foreground">Aktive Mitglieder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Unteroffiziere
            </CardTitle>
            <CardDescription>Ränge 6-10 • Mittlere Führung</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {personnel?.filter(p => p.currentRank.level >= 6 && p.currentRank.level <= 10).length || 0}
            </div>
            <p className="text-sm text-muted-foreground">Aktive Mitglieder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Offiziere
            </CardTitle>
            <CardDescription>Ränge 11-15 • Obere Führung</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {personnel?.filter(p => p.currentRank.level >= 11 && p.currentRank.level <= 15).length || 0}
            </div>
            <p className="text-sm text-muted-foreground">Aktive Mitglieder</p>
          </CardContent>
        </Card>
      </div>

      {/* Mannschaft */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Award className="h-6 w-6 text-amber-600" />
          Mannschaft
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mannschaft.map((rank) => {
            const stats = getRankStats(rank.level);
            return (
              <Card key={rank.id} className="military-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rank.name}</CardTitle>
                    <Badge className={`rank-badge ${getRankCategoryClass(rank.level)}`}>
                      Level {rank.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Mitglieder
                    </span>
                    <span className="font-medium">{stats.count}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Benötigt
                    </span>
                    <span className="font-medium">{rank.pointsRequired} Punkte</span>
                  </div>
                  {stats.count > 0 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>⌀ Punkte</span>
                      <span>{stats.avgPoints}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Unteroffiziere */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Award className="h-6 w-6 text-blue-600" />
          Unteroffiziere
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {unteroffiziere.map((rank) => {
            const stats = getRankStats(rank.level);
            return (
              <Card key={rank.id} className="military-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rank.name}</CardTitle>
                    <Badge className={`rank-badge ${getRankCategoryClass(rank.level)}`}>
                      Level {rank.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Mitglieder
                    </span>
                    <span className="font-medium">{stats.count}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Benötigt
                    </span>
                    <span className="font-medium">{rank.pointsRequired} Punkte</span>
                  </div>
                  {stats.count > 0 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>⌀ Punkte</span>
                      <span>{stats.avgPoints}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Offiziere */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Award className="h-6 w-6 text-purple-600" />
          Offiziere
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {offiziere.map((rank) => {
            const stats = getRankStats(rank.level);
            return (
              <Card key={rank.id} className="military-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rank.name}</CardTitle>
                    <Badge className={`rank-badge ${getRankCategoryClass(rank.level)}`}>
                      Level {rank.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Mitglieder
                    </span>
                    <span className="font-medium">{stats.count}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Benötigt
                    </span>
                    <span className="font-medium">{rank.pointsRequired} Punkte</span>
                  </div>
                  {stats.count > 0 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>⌀ Punkte</span>
                      <span>{stats.avgPoints}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Promotion Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Beförderungsvoraussetzungen</CardTitle>
          <CardDescription>
            Übersicht der Punkteanforderungen für Beförderungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ranks?.map((rank, index) => {
              const nextRank = ranks[index + 1];
              if (!nextRank) return null;
              
              return (
                <div key={rank.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge className={`rank-badge ${getRankCategoryClass(rank.level)}`}>
                      {rank.name}
                    </Badge>
                    <span className="text-muted-foreground">→</span>
                    <Badge className={`rank-badge ${getRankCategoryClass(nextRank.level)}`}>
                      {nextRank.name}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{nextRank.pointsFromPrevious} Punkte benötigt</p>
                    <p className="text-sm text-muted-foreground">
                      Gesamt: {nextRank.pointsRequired} Punkte
                    </p>
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