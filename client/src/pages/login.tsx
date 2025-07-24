import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, User, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  username: z.string().min(1, "Benutzername ist erforderlich"),
  password: z.string().min(1, "Passwort ist erforderlich"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [showInitialize, setShowInitialize] = useState(false);
  const { refetch } = useAuth();
  
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/login", data);
      return response.json();
    },
    onSuccess: () => {
      refetch();
      window.location.reload();
    },
    onError: (error: any) => {
      if (error.message.includes("401")) {
        form.setError("root", { message: "Ungültige Anmeldedaten" });
      } else {
        form.setError("root", { message: "Anmeldefehler. Bitte versuchen Sie es erneut." });
      }
    },
  });

  const initializeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/initialize", {
        username: "admin",
        password: "admin123",
        firstName: "Administrator",
        lastName: "NC-Army",
        email: "admin@nc-army.local"
      });
      return response.json();
    },
    onSuccess: () => {
      setShowInitialize(false);
      form.setValue("username", "admin");
      form.setValue("password", "admin123");
    },
    onError: (error: any) => {
      if (error.message.includes("Admin user already exists")) {
        setShowInitialize(false);
        form.setValue("username", "admin");
        form.setValue("password", "admin123");
      }
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-military-blue rounded-lg mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">NC-Army</h1>
          <p className="text-blue-200">Uprank Tool - Administrator Login</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-white flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Anmeldung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Alert */}
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Benutzername
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    {...form.register("username")}
                    id="username"
                    type="text"
                    placeholder="Benutzername eingeben"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                    disabled={loginMutation.isPending}
                  />
                </div>
                {form.formState.errors.username && (
                  <p className="text-red-400 text-sm">{form.formState.errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Passwort
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    {...form.register("password")}
                    id="password"
                    type="password"
                    placeholder="Passwort eingeben"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                    disabled={loginMutation.isPending}
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="text-red-400 text-sm">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-military-blue hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Anmeldung..." : "Anmelden"}
              </Button>
            </form>

            {/* Initialize Database Button */}
            <div className="pt-4 border-t border-white/20">
              {!showInitialize ? (
                <Button
                  variant="ghost"
                  onClick={() => setShowInitialize(true)}
                  className="w-full text-blue-200 hover:text-white hover:bg-white/10"
                >
                  Erste Einrichtung
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-blue-200 text-center">
                    Datenbank noch nicht eingerichtet? Erstellen Sie den ersten Administrator-Account.
                  </p>
                  <Button
                    onClick={() => initializeMutation.mutate()}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={initializeMutation.isPending}
                  >
                    {initializeMutation.isPending ? "Einrichtung..." : "Datenbank einrichten"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowInitialize(false)}
                    className="w-full text-blue-200 hover:text-white hover:bg-white/10"
                  >
                    Abbrechen
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200/60 text-sm">
            Standard Login: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
}