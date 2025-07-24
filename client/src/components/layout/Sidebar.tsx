import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { 
  Shield, 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Award, 
  Briefcase, 
  FileText, 
  Download,
  LogOut
} from "lucide-react";

const navigationItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/personal", icon: Users, label: "Personal verwalten" },
  { href: "/punkte", icon: TrendingUp, label: "Punkte eintragen" },
  { href: "/raenge", icon: Award, label: "Ränge & Beförderungen" },
  { href: "/sonderpositionen", icon: Briefcase, label: "Sonderpositionen" },
];

const reportItems = [
  { href: "/berichte", icon: FileText, label: "Aktivitätsberichte" },
  { href: "/export", icon: Download, label: "Daten exportieren" },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'NC';
  };

  return (
    <div className="w-64 bg-military-blue text-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-lg font-bold">NC-Army</h1>
            <p className="text-blue-200 text-sm">Uprank Tool</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 mt-4">
        <div className="px-4 py-2">
          <p className="text-blue-200 text-xs uppercase tracking-wider font-semibold">Hauptmenü</p>
        </div>
        <ul className="space-y-1 px-2">
          {navigationItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <a className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                  }`}>
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="px-4 py-2 mt-6">
          <p className="text-blue-200 text-xs uppercase tracking-wider font-semibold">Berichte</p>
        </div>
        <ul className="space-y-1 px-2">
          {reportItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <a className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                  }`}>
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-blue-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">
              {getInitials(user?.firstName, user?.lastName)}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.email || 'Benutzer'}
            </p>
            <p className="text-xs text-blue-200">Administrator</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/api/logout'}
            className="text-blue-200 hover:text-white hover:bg-blue-700 p-1"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
