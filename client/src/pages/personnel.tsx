import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Search, Users, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Personnel, PersonnelWithDetails, Rank, SpecialPosition, InsertPersonnel } from "@shared/schema";

const personnelFormSchema = z.object({
  armyId: z.string().min(1, "Army-ID ist erforderlich"),
  firstName: z.string().min(1, "Vorname ist erforderlich"),
  lastName: z.string().min(1, "Nachname ist erforderlich"),
  currentRankId: z.string().min(1, "Rang ist erforderlich"),
  specialPositionId: z.string().default("none"),
  joinDate: z.string().min(1, "Beitrittsdatum ist erforderlich"),
});

type PersonnelFormData = z.infer<typeof personnelFormSchema>;

function getRankCategory(level: number): string {
  if (level >= 2 && level <= 5) return "Mannschaft";
  if (level >= 6 && level <= 10) return "Unteroffiziersstab";
  if (level >= 11 && level <= 15) return "Offiziersstab";
  return "Unbekannt";
}

function getRankCategoryColor(level: number): string {
  if (level >= 2 && level <= 5) return "bg-green-100 text-green-800";
  if (level >= 6 && level <= 10) return "bg-blue-100 text-blue-800";
  if (level >= 11 && level <= 15) return "bg-purple-100 text-purple-800";
  return "bg-gray-100 text-gray-800";
}

export default function Personnel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<PersonnelFormData>({
    resolver: zodResolver(personnelFormSchema),
    defaultValues: {
      armyId: "",
      firstName: "",
      lastName: "",
      currentRankId: "",
      specialPositionId: "none",
      joinDate: new Date().toISOString().split('T')[0],
    },
  });

  // Fetch personnel data
  const { data: personnel = [], isLoading: isLoadingPersonnel } = useQuery<PersonnelWithDetails[]>({
    queryKey: ["/api/personnel"],
  });

  // Fetch ranks for form
  const { data: ranks = [] } = useQuery<Rank[]>({
    queryKey: ["/api/ranks"],
  });

  // Fetch special positions for form
  const { data: specialPositions = [] } = useQuery<SpecialPosition[]>({
    queryKey: ["/api/special-positions"],
  });

  // Add personnel mutation
  const addPersonnelMutation = useMutation({
    mutationFn: async (data: PersonnelFormData) => {
      const response = await apiRequest("POST", "/api/personnel", {
        armyId: data.armyId,
        firstName: data.firstName,
        lastName: data.lastName,
        currentRankId: parseInt(data.currentRankId),
        specialPositionId: data.specialPositionId && data.specialPositionId !== "none" ? parseInt(data.specialPositionId) : undefined,
        joinDate: data.joinDate,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personnel"] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Erfolgreich",
        description: "Neues Personalmitglied wurde hinzugefügt",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter personnel based on search term
  const filteredPersonnel = personnel.filter(
    (person) =>
      `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.currentRank?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.specialPosition?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: PersonnelFormData) => {
    addPersonnelMutation.mutate(data);
  };

  // Statistics
  const totalPersonnel = personnel.length;
  const mannschaftCount = personnel.filter(p => p.currentRank && p.currentRank.level >= 2 && p.currentRank.level <= 5).length;
  const unteroffizierCount = personnel.filter(p => p.currentRank && p.currentRank.level >= 6 && p.currentRank.level <= 10).length;
  const offizierCount = personnel.filter(p => p.currentRank && p.currentRank.level >= 11 && p.currentRank.level <= 15).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Personal verwalten</h1>
          <p className="text-gray-600 mt-1">Verwaltung aller Army-Mitglieder</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-military-blue hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Personal hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Neues Personalmitglied hinzufügen</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="armyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Army-ID</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. #A247" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vorname</FormLabel>
                        <FormControl>
                          <Input placeholder="Vorname" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nachname</FormLabel>
                        <FormControl>
                          <Input placeholder="Nachname" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="currentRankId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aktueller Rang</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Rang auswählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ranks.map((rank) => (
                            <SelectItem key={rank.id} value={rank.id.toString()}>
                              {rank.name} (Level {rank.level})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialPositionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sonderposition (optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value?.toString() || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sonderposition auswählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Keine Sonderposition</SelectItem>
                          {specialPositions.map((position) => (
                            <SelectItem key={position.id} value={position.id.toString()}>
                              {position.name} (+{position.bonusPointsPerWeek} Punkte/Woche)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="joinDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beitrittsdatum</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />



                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={addPersonnelMutation.isPending}
                  >
                    {addPersonnelMutation.isPending ? "Wird hinzugefügt..." : "Hinzufügen"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Abbrechen
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamtpersonal</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-military-blue">{totalPersonnel}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mannschaft</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mannschaftCount}</div>
            <p className="text-xs text-muted-foreground">Ränge 2-5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unteroffiziere</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unteroffizierCount}</div>
            <p className="text-xs text-muted-foreground">Ränge 6-10</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offiziere</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{offizierCount}</div>
            <p className="text-xs text-muted-foreground">Ränge 11-15</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Personalübersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Nach Name, Rang oder Position suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          {isLoadingPersonnel ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-military-blue mx-auto"></div>
              <p className="text-gray-600 mt-2">Lade Personal...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Rang</TableHead>
                  <TableHead>Kategorie</TableHead>
                  <TableHead>Sonderposition</TableHead>
                  <TableHead>Gesamtpunkte</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPersonnel.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-gray-500">
                        {searchTerm ? "Keine Suchergebnisse gefunden" : "Noch kein Personal hinzugefügt"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPersonnel.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-medium">{person.firstName} {person.lastName}</TableCell>
                      <TableCell>
                        {person.currentRank ? (
                          <div>
                            <div className="font-medium">{person.currentRank.name}</div>
                            <div className="text-sm text-gray-500">Level {person.currentRank.level}</div>
                          </div>
                        ) : (
                          "Kein Rang"
                        )}
                      </TableCell>
                      <TableCell>
                        {person.currentRank && (
                          <Badge className={getRankCategoryColor(person.currentRank.level)}>
                            {getRankCategory(person.currentRank.level)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {person.specialPosition ? (
                          <div>
                            <div className="font-medium">{person.specialPosition.name}</div>
                            <div className="text-sm text-gray-500">
                              +{person.specialPosition.bonusPointsPerWeek} Punkte/Woche
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Keine</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-military-blue mr-1" />
                          {person.totalPoints || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Aktiv
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
