import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { PersonnelWithDetails, SpecialPosition } from "@shared/schema";

const pointEntrySchema = z.object({
  personnelId: z.string().min(1, "Bitte wählen Sie eine Person aus"),
  weekStart: z.string().min(1, "Bitte wählen Sie eine Woche aus"),
  activityPoints: z.number().min(0).max(35, "Maximal 35 Aktivitätspunkte möglich"),
  specialPositionId: z.string().optional(),
});

type PointEntryForm = z.infer<typeof pointEntrySchema>;

interface PointEntryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PointEntryModal({ open, onClose }: PointEntryModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: personnel } = useQuery<PersonnelWithDetails[]>({
    queryKey: ["/api/personnel"],
    enabled: open,
  });

  const { data: specialPositions } = useQuery<SpecialPosition[]>({
    queryKey: ["/api/special-positions"],
    enabled: open,
  });

  const form = useForm<PointEntryForm>({
    resolver: zodResolver(pointEntrySchema),
    defaultValues: {
      personnelId: "",
      weekStart: "",
      activityPoints: 0,
      specialPositionId: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: PointEntryForm) => {
      const selectedPosition = specialPositions?.find(p => p.id.toString() === data.specialPositionId);
      
      await apiRequest("POST", "/api/point-entries", {
        personnelId: parseInt(data.personnelId),
        weekStart: data.weekStart,
        activityPoints: data.activityPoints,
        specialPositionPoints: selectedPosition?.bonusPointsPerWeek || 0,
      });
    },
    onSuccess: () => {
      toast({
        title: "Erfolg",
        description: "Punkte wurden erfolgreich eingetragen",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/personnel"] });
      queryClient.invalidateQueries({ queryKey: ["/api/point-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      form.reset();
      onClose();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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

      toast({
        title: "Fehler",
        description: error.message || "Fehler beim Eintragen der Punkte",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PointEntryForm) => {
    mutation.mutate(data);
  };

  const getCurrentWeek = () => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1);
    return monday.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Punkte eintragen</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="personnelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Person auswählen</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Person auswählen..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {personnel?.map((person) => (
                        <SelectItem key={person.id} value={person.id.toString()}>
                          {person.firstName} {person.lastName} ({person.armyId})
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
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      defaultValue={getCurrentWeek()}
                    />
                  </FormControl>
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
                      placeholder="0-35 Punkte"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialPositionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sonderposition</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Keine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Keine</SelectItem>
                      {specialPositions?.map((position) => (
                        <SelectItem key={position.id} value={position.id.toString()}>
                          {position.name} (+{position.bonusPointsPerWeek})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
                disabled={mutation.isPending}
              >
                Abbrechen
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-military-blue hover:bg-blue-700"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Speichern..." : "Speichern"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
