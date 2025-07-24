import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Award, Activity } from "lucide-react";
import { MockApiService } from "@/services/mockApiService";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: MockApiService.getDashboardStats,
  });

  const { data: rankDistribution, isLoading: rankLoading } = useQuery({
    queryKey: ["rank-distribution"],
    queryFn: MockApiService.getRankDistribution,
  });

  const { data: personnel, isLoading: personnelLoading } = useQuery({
    queryKey: ["personnel"],
    queryFn: MockApiService.getPersonnel,
  });

  const { data: recentPromotions, isLoading: promotionsLoading } = useQuery({
    queryKey: ["promotions"],
    queryFn: MockApiService.getPromotions,
  });

  if (statsLoading || rankLoading || personnelLoading || promotionsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const chartData = rankDistribution?.map(item => ({
    name: item.rank.name,
    level: item.rank.level,
    count: item.count,
  })) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Übersicht über die NC-Army</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Personal</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPersonnel || 0}</div>
            <p className="text-xs text-muted-foreground">Registrierte Mitglieder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Mitglieder</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeMembers || 0}</div>
            <p className="text-xs text-muted-foreground">Derzeit aktiv</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beförderungen diese Woche</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.promotionsThisWeek || 0}</div>
            <p className="text-xs text-muted-foreground">Neue Beförderungen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durchschnittspunkte</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averagePoints || 0}</div>
            <p className="text-xs text-muted-foreground">Pro Mitglied</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rank Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Rang-Verteilung</CardTitle>
            <CardDescription>Anzahl Mitglieder pro Rang</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle Aktivitäten</CardTitle>
            <CardDescription>Letzte Beförderungen und Ereignisse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPromotions?.slice(0, 5).map((promotion) => {
                const person = personnel?.find(p => p.id === promotion.personnelId);
                return (
                  <div key={promotion.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {person?.firstName} {person?.lastName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Befördert - {promotion.pointsAtPromotion} Punkte
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge variant="secondary">
                        Beförderung
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performer</CardTitle>
          <CardDescription>Mitglieder mit den höchsten Punktzahlen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personnel
              ?.sort((a, b) => b.totalPoints - a.totalPoints)
              .slice(0, 6)
              .map((person, index) => (
                <div key={person.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {person.firstName} {person.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {person.currentRank.name} • {person.totalPoints} Punkte
                    </p>
                  </div>
                  {person.specialPosition && (
                    <Badge variant="outline" className="text-xs">
                      {person.specialPosition.name}
                    </Badge>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}