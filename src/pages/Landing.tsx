import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, TrendingUp, Award, ArrowRight, Star } from "lucide-react";

interface LandingProps {
  onEnterDemo: () => void;
}

export default function Landing({ onEnterDemo }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 text-center text-white">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-green-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
            NC-Army Uprank Tool
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Das ultimative Verwaltungssystem für Army-Fraktionen in GTA RP Servern. 
            Verwalte Ränge, Punkte und Beförderungen professionell.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600">
              <Star className="h-3 w-3 mr-1" />
              Demo-Version
            </Badge>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600">
              Netlify Ready
            </Badge>
            <Badge variant="secondary" className="bg-purple-600/20 text-purple-400 border-purple-600">
              React SPA
            </Badge>
          </div>
          <Button 
            onClick={onEnterDemo}
            size="lg" 
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-3 text-lg"
          >
            Demo starten
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Funktionen
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700 text-white">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <CardTitle>Personal-Verwaltung</CardTitle>
                <CardDescription className="text-slate-300">
                  Vollständige Übersicht über alle Army-Mitglieder mit detaillierten Profilen
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 text-white">
              <CardHeader className="text-center">
                <Award className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <CardTitle>Rang-System</CardTitle>
                <CardDescription className="text-slate-300">
                  14 Ränge von Schütze bis Oberst mit definierten Beförderungskriterien
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 text-white">
              <CardHeader className="text-center">
                <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <CardTitle>Punkte-System</CardTitle>
                <CardDescription className="text-slate-300">
                  Wöchentliche Aktivitätspunkte mit Sonderpositions-Boni
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 text-white">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                <CardTitle>Sonderpositionen</CardTitle>
                <CardDescription className="text-slate-300">
                  Spezielle Rollen wie Drillsergeant, Sanitäter und Ausbilder
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white mb-4">
                  Demo-Version Funktionen
                </CardTitle>
                <CardDescription className="text-slate-300 text-lg">
                  Diese Demo zeigt alle Hauptfunktionen des NC-Army Uprank Tools mit beispielhaften Daten.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 text-slate-300">
                  <div>
                    <h3 className="font-semibold text-white mb-3">✓ Verfügbare Features:</h3>
                    <ul className="space-y-2">
                      <li>• Dashboard mit Statistiken</li>
                      <li>• Personal-Übersicht und -Verwaltung</li>
                      <li>• Punkte-Eingabe System</li>
                      <li>• Rang-Verwaltung</li>
                      <li>• Sonderpositionen-Management</li>
                      <li>• Responsive Design</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-3">ℹ️ Demo-Hinweise:</h3>
                    <ul className="space-y-2">
                      <li>• Alle Daten sind beispielhaft</li>
                      <li>• Änderungen werden im Browser gespeichert</li>
                      <li>• Kein Login erforderlich</li>
                      <li>• Vollständig funktionsfähig</li>
                      <li>• Optimiert für Netlify</li>
                      <li>• Mobile-friendly Interface</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-center text-slate-400">
        <div className="container mx-auto px-4">
          <p>&copy; 2025 NC-Army Uprank Tool - Demo-Version für Präsentationszwecke</p>
        </div>
      </footer>
    </div>
  );
}