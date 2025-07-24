import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  TrendingUp, 
  Award, 
  Star,
  Shield
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Personal", href: "/personal", icon: Users },
  { name: "Punkte", href: "/punkte", icon: TrendingUp },
  { name: "Ränge", href: "/raenge", icon: Award },
  { name: "Sonderpositionen", href: "/sonderpositionen", icon: Star },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="flex items-center px-6 py-6 border-b border-slate-700">
        <Shield className="h-8 w-8 text-green-400 mr-3" />
        <div>
          <h1 className="text-lg font-bold">NC-Army</h1>
          <p className="text-sm text-slate-400">Uprank Tool</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 text-center">
          <p>Demo-Version</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  );
}