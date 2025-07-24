import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUp, UserPlus } from "lucide-react";
import PointEntryModal from "@/components/personnel/PointEntryModal";

export default function QuickActions() {
  const [showPointModal, setShowPointModal] = useState(false);

  return (
    <>
      <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Schnellaktionen
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Button 
            onClick={() => setShowPointModal(true)}
            className="w-full bg-military-blue text-white hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Punkte eintragen</span>
          </Button>
          
          <Button 
            variant="secondary"
            className="w-full bg-military-green text-white hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowUp className="w-4 h-4" />
            <span>Beförderung durchführen</span>
          </Button>
          
          <Button 
            variant="outline"
            className="w-full border-gray-600 text-gray-600 hover:bg-gray-700 hover:text-white transition-colors flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Personal hinzufügen</span>
          </Button>
        </CardContent>
      </Card>

      <PointEntryModal 
        open={showPointModal} 
        onClose={() => setShowPointModal(false)} 
      />
    </>
  );
}
