import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";

// Pages
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Personnel from "@/pages/Personnel";
import Points from "@/pages/Points";
import Ranks from "@/pages/Ranks";
import SpecialPositions from "@/pages/SpecialPositions";
import NotFound from "@/pages/NotFound";

// Layout
import Sidebar from "@/components/layout/Sidebar";
import DemoHeader from "@/components/layout/DemoHeader";

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function Router() {
  const [isDemoMode, setIsDemoMode] = useState(false);

  if (!isDemoMode) {
    return <Landing onEnterDemo={() => setIsDemoMode(true)} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DemoHeader />
        <main className="flex-1 overflow-y-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/personal" component={Personnel} />
            <Route path="/punkte" component={Points} />
            <Route path="/raenge" component={Ranks} />
            <Route path="/sonderpositionen" component={SpecialPositions} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;