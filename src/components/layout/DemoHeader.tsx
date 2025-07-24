import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, RefreshCw } from "lucide-react";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

export default function DemoHeader() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="px-4 py-3">
        <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-blue-900 dark:text-blue-100">
                Sie befinden sich in der <strong>Demo-Version</strong> des NC-Army Uprank Tools
              </span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Live Demo
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="ml-4 border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reset Demo
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}