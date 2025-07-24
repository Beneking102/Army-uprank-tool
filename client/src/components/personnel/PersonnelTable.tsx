import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Eye, Edit, Plus } from "lucide-react";
import type { PersonnelWithDetails } from "@shared/schema";

interface PersonnelTableProps {
  showFilters?: boolean;
}

export default function PersonnelTable({ showFilters = false }: PersonnelTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [rankFilter, setRankFilter] = useState("all");

  const { data: personnel, isLoading } = useQuery<PersonnelWithDetails[]>({
    queryKey: ["/api/personnel"],
  });

  const filteredPersonnel = personnel?.filter((person) => {
    const matchesSearch = 
      `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.armyId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRank = rankFilter === "all" || 
      (rankFilter === "mannschaft" && person.currentRank.level >= 2 && person.currentRank.level <= 5) ||
      (rankFilter === "unteroffiziere" && person.currentRank.level >= 6 && person.currentRank.level <= 10) ||
      (rankFilter === "offiziere" && person.currentRank.level >= 11 && person.currentRank.level <= 15);
    
    return matchesSearch && matchesRank;
  }) || [];

  const getRankBadgeColor = (level: number) => {
    if (level >= 2 && level <= 5) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    if (level >= 6 && level <= 10) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (level >= 11 && level <= 15) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
  };

  const getSpecialPositionBadge = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getProgressPercentage = (current: number, required: number) => {
    return Math.min((current / required) * 100, 100);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Personal Übersicht
          </CardTitle>
          {showFilters && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <Select value={rankFilter} onValueChange={setRankFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Alle Ränge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Ränge</SelectItem>
                  <SelectItem value="mannschaft">Mannschaft (2-5)</SelectItem>
                  <SelectItem value="unteroffiziere">Unteroffiziere (6-10)</SelectItem>
                  <SelectItem value="offiziere">Offiziere (11-15)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Aktuelle Punkte
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nächste Beförderung
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Sonderposition
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="ml-4 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-2 w-24 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              filteredPersonnel.map((person) => {
                // Calculate next rank requirements (simplified logic)
                const nextRankPoints = person.currentRank.pointsRequired + person.currentRank.pointsFromPrevious;
                const progressPercentage = getProgressPercentage(person.totalPoints, nextRankPoints);
                
                return (
                  <tr key={person.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-military-blue rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {getInitials(person.firstName, person.lastName)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {person.firstName} {person.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {person.armyId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getRankBadgeColor(person.currentRank.level)}>
                        {person.currentRank.name} ({person.currentRank.level})
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <span className="font-medium">{person.totalPoints}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-1">/ {nextRankPoints}</span>
                      </div>
                      <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                        <div 
                          className="bg-military-blue h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        Nächster Rang
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.max(0, nextRankPoints - person.totalPoints)} Punkte fehlen
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {person.specialPosition ? (
                        <Badge className={getSpecialPositionBadge(person.specialPosition.difficulty)}>
                          {person.specialPosition.name}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={person.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }>
                        <div className={`w-1.5 h-1.5 rounded-full mr-1 ${person.isActive ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                        {person.isActive ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-military-blue hover:text-blue-700">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {!isLoading && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Zeige <span className="font-medium">1</span> bis{" "}
              <span className="font-medium">{Math.min(10, filteredPersonnel.length)}</span> von{" "}
              <span className="font-medium">{filteredPersonnel.length}</span> Ergebnissen
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">Zurück</Button>
              <Button size="sm" className="bg-military-blue text-white">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Weiter</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
