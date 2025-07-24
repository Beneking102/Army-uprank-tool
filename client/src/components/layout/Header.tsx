import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export default function Header({ title, subtitle, action }: HeaderProps) {
  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const week = Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
    return `KW ${week}, ${now.getFullYear()}`;
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center space-x-4">
            {action}
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{getCurrentWeek()}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
