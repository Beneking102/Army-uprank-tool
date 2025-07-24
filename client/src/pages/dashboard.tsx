import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import StatsGrid from "@/components/dashboard/StatsGrid";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import RankDistribution from "@/components/dashboard/RankDistribution";
import QuickActions from "@/components/dashboard/QuickActions";
import PersonnelTable from "@/components/personnel/PersonnelTable";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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
        <Header title="Dashboard" subtitle="Übersicht über die Army-Verwaltung" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <StatsGrid />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <ActivityFeed />
            </div>
            
            <div className="space-y-6">
              <QuickActions />
              <RankDistribution />
            </div>
          </div>

          <div className="mt-8">
            <PersonnelTable />
          </div>
        </main>
      </div>
    </div>
  );
}
