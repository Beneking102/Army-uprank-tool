import { useQuery } from "@tanstack/react-query";
import type { AdminUser } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, refetch, error } = useQuery<AdminUser>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      const res = await fetch("/api/user", {
        credentials: "include",
      });
      
      if (res.status === 401) {
        return null; // User not authenticated, return null instead of throwing
      }
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text}`);
      }
      
      return await res.json();
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    refetch,
    error,
  };
}
