import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Calendar, TrendingUp, Users, Award, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PersonnelWithDetails, PointEntry, InsertPointEntry } from "@shared/schema";

const pointEntrySchema = z.object({
  personnelId: z.number().min(1, "Person ist erforderlich"),
  weekStart: z.string().min(1, "Woche ist erforderlich"),
  activityPoints: z.number().min(0).max(35, "Maximal 35 Aktivitätspunkte pro Woche"),
  notes: z.string().optional(),
});

type PointEntryForm = z.infer<typeof pointEntrySchema>;

function getSundayOfWeek(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Sunday is 0
  const sunday = new Date(d.setDate(diff));
  return sunday.toISOString().split('T')[0];
}

function getCurrentWeek(): string {
  return getSundayOfWeek(new Date());
}

function formatWeekRange(weekOf: string): string {
  const sunday = new Date(weekOf);
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  
  return `${sunday.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} - ${saturday.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
}

function canPromote(person: PersonnelWithDetails): boolean {
  if (!person.currentRank || !person.totalPoints) return false;
  
  // Find next rank
  const nextRankLevel = person.currentRank.level + 1;
  if (nextRankLevel > 15) return false; // Max rank is 15
  
  // For now, assume they need current rank points + points from previous
  // This would be calculated based on the next rank's requirements
  const currentRankPoints = person.currentRank.pointsRequired;
  const estimatedNextRankPoints = currentRankPoints + person.currentRank.pointsFromPrevious + 50; // Simplified
  
  return person.totalPoints >= estimatedNextRankPoints;
}

export default function Points() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const { toast } = useToast();

  const form = useForm<PointEntryForm>({
    resolver: zodResolver(pointEntrySchema),
    defaultValues: {
      personnelId: 1,
      weekStart: getCurrentWeek(),
      activityPoints: 0,
      notes: "",
    },
  });

  // Fetch personnel
  const { data: personnel = [] } = useQuery<PersonnelWithDetails[]>({
    queryKey: ["/api/personnel"],
  });

  // Fetch point entries for selected week
  const { data: pointEntries = [], isLoading: isLoadingEntries } = useQuery<PointEntry[]>({
    queryKey: ["/api/point-entries", selectedWeek],
  });

  // Add point entry mutation
  const addPointEntryMutation = useMutation({
    mutationFn: async (data: PointEntryForm) => {
      const response = await apiRequest("POST", "/api/point-entries", {
        personnelId: data.personnelId,
        weekStart: data.weekStart,
        activityPoints: data.activityPoints,
        notes: data.notes,
        enteredBy: "admin", // TODO: Get from auth context
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/point-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/personnel"] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Erfolgreich",
        description: "Punkteeintrag wurde hinzugefügt",
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

  const onSubmit = (data: PointEntryForm) => {
    addPointEntryMutation.mutate(data);
  };

  // Calculate statistics
  const totalActivePersonnel = pointEntries.length;
  const totalPointsAwarded = pointEntries.reduce((sum, entry) => sum + entry.totalWeekPoints, 0);
  const avgPointsPerPerson = totalActivePersonnel > 0 ? Math.round(totalPointsAwarded / totalActivePersonnel) : 0;
  const promotionEligible = personnel.filter(canPromote).length;

  // Generate week options (last 8 weeks + next 4 weeks)
  const weekOptions: Array<{value: string; label: string; isCurrent: boolean}> = [];
  for (let i = -8; i <= 4; i++) {
    const date = new Date();
    date.setDate(date.getDate() + (i * 7));
    const weekOf = getSundayOfWeek(date);
    weekOptions.push({
      value: weekOf,
      label: formatWeekRange(weekOf),
      isCurrent: weekOf === getCurrentWeek(),
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Punkte eintragen</h1>
          <p className="text-gray-600 mt-1">Wöchentliche Aktivitätspunkte verwalten</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-military-blue hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Punkte eintragen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Wöchentliche Punkte eintragen</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="personnelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Person</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value, 10))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Person auswählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {personnel.map((person) => (
                            <SelectItem key={person.id} value={person.id.toString()}>
                              {person.firstName} {person.lastName} - {person.currentRank?.name}
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
                  name="weekStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Woche</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Woche auswählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {weekOptions.map((week) => (
                            <SelectItem key={week.value} value={week.value}>
                              {week.label} {week.isCurrent && "(Aktuelle Woche)"}
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
                  name="activityPoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aktivitätspunkte (0-35)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="35" 
                          placeholder="Anzahl Aktivitätspunkte" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notizen (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Besondere Aktivitäten oder Notizen" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={addPointEntryMutation.isPending}
                  >
                    {addPointEntryMutation.isPending ? "Wird eingetragen..." : "Eintragen"}
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
            <CardTitle className="text-sm font-medium">Aktive diese Woche</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-military-blue">{totalActivePersonnel}</div>
            <p className="text-xs text-muted-foreground">von {personnel.length} Personen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vergebene Punkte</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPointsAwarded}</div>
            <p className="text-xs text-muted-foreground">diese Woche</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ø Punkte/Person</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{avgPointsPerPerson}</div>
            <p className="text-xs text-muted-foreground">Durchschnitt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beförderungsfähig</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{promotionEligible}</div>
            <p className="text-xs text-muted-foreground">Personen</p>
          </CardContent>
        </Card>
      </div>

      {/* Week Selection and Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Woche auswählen</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {weekOptions.map((week) => (
                  <SelectItem key={week.value} value={week.value}>
                    {week.label} {week.isCurrent && "(Aktuell)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Bewertungsregeln
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-gray-600">
              • 5 Punkte pro aktivem Tag
            </div>
            <div className="text-sm text-gray-600">
              • Maximum: 35 Punkte/Woche
            </div>
            <div className="text-sm text-gray-600">
              • Bonuspunkte durch Sonderpositionen
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Beförderungen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-gray-600">
              • Automatische Berechnung der Berechtigung
            </div>
            <div className="text-sm text-gray-600">
              • Basierend auf Gesamtpunkten
            </div>
            <div className="text-sm text-gray-600">
              • Wöchentliche Auswertung jeden Sonntag
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Point Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Punkte für Woche vom {formatWeekRange(selectedWeek)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingEntries ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-military-blue mx-auto"></div>
              <p className="text-gray-600 mt-2">Lade Punkteeinträge...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Person</TableHead>
                  <TableHead>Rang</TableHead>
                  <TableHead>Aktive Tage</TableHead>
                  <TableHead>Grundpunkte</TableHead>
                  <TableHead>Bonuspunkte</TableHead>
                  <TableHead>Gesamtpunkte</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pointEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-gray-500">
                        Noch keine Punkte für diese Woche eingetragen
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pointEntries.map((entry) => {
                    const person = personnel.find(p => p.id === entry.personnelId);
                    const specialPositionPoints = entry.specialPositionPoints || 0;
                    const activityPoints = entry.activityPoints;
                    
                    return (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">
                          {person ? `${person.firstName} ${person.lastName}` : "Unbekannt"}
                        </TableCell>
                        <TableCell>
                          {person?.currentRank?.name || "Kein Rang"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {Math.floor(activityPoints / 5)}/7 Tage
                          </Badge>
                        </TableCell>
                        <TableCell>{activityPoints}</TableCell>
                        <TableCell>
                          {specialPositionPoints > 0 ? (
                            <Badge className="bg-green-100 text-green-800">
                              +{specialPositionPoints}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 text-military-blue mr-1" />
                            <span className="font-semibold">{entry.totalWeekPoints}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {person && canPromote(person) ? (
                            <Badge className="bg-purple-100 text-purple-800">
                              Beförderungsfähig
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-600">
                              Aktiv
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
