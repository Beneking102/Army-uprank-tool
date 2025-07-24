import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Award, BarChart3 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-military-blue rounded-lg flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            NC-Army Uprank Tool
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Das professionelle Verwaltungssystem für Army-Fraktionen in GTA RP.
            Verwalten Sie Ränge, Punkte und Beförderungen effizient und transparent.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-military-blue mx-auto mb-4" />
              <CardTitle className="text-lg">Personalverwaltung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Vollständige Verwaltung aller Army-Mitglieder mit detaillierten Profilen
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-military-green mx-auto mb-4" />
              <CardTitle className="text-lg">Punktesystem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Wöchentliche Aktivitätspunkte mit automatischer Berechnung
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Beförderungen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Automatische Beförderungsempfehlungen basierend auf Punktestand
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-lg">Sonderpositionen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Verwaltung von Drill Sergeants, Field Medics und weiteren Rollen
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-xl">Anmeldung erforderlich</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Melden Sie sich mit Ihrem autorisierten Account an, um das NC-Army Uprank Tool zu verwenden.
              </p>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="w-full bg-military-blue hover:bg-blue-700 text-white"
              >
                Anmelden
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
