import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
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
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Willkommen im NC-Army Verwaltungssystem</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Letztes Update</div>
            <div className="text-lg font-semibold text-military-blue">
              {new Date().toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <StatsGrid />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-2">
          <ActivityFeed />
        </div>
        
        <div className="xl:col-span-1">
          <QuickActions />
        </div>
        
        <div className="xl:col-span-1">
          <RankDistribution />
        </div>
      </div>

      {/* Personnel Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-military-blue to-blue-600">
          <h2 className="text-xl font-semibold text-white">Personalübersicht</h2>
          <p className="text-blue-100 text-sm">Aktuelle Mitglieder und ihre Ränge</p>
        </div>
        <PersonnelTable />
      </div>
    </div>
  );
}
