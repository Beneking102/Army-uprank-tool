import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-full p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-amber-500" />
          </div>
          <CardTitle className="text-2xl">Seite nicht gefunden</CardTitle>
          <CardDescription>
            Die angeforderte Seite konnte nicht gefunden werden.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/">
            <Button className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Zurück zum Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}