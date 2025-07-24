import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import PointEntryModal from "@/components/personnel/PointEntryModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function Points() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showPointModal, setShowPointModal] = useState(false);

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

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Punkte eintragen" 
          subtitle="Wöchentliche Aktivitätspunkte verwalten"
          action={
            <Button 
              onClick={() => setShowPointModal(true)}
              className="bg-military-blue hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Punkte eintragen
            </Button>
          }
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Aktivitätspunkte</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Pro aktiven Tag werden 5 Punkte vergeben (maximal 35 Punkte pro Woche).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bonuspunkte</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Sonderpositionen erhalten zusätzliche Punkte je nach Schwierigkeitsgrad.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Beförderungen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Automatische Benachrichtigungen bei Erreichen der Mindestpunktzahl.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <PointEntryModal 
        open={showPointModal} 
        onClose={() => setShowPointModal(false)} 
      />
    </div>
  );
}
