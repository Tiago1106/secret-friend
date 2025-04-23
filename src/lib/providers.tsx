"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { initAuthListener } from "@/stores/useAuthStore";

interface ProviderProps {
  children: ReactNode;
}

export function Providers({ children }: ProviderProps) {
  initAuthListener()
  const [queryClient] = useState(() => new QueryClient());

  return (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>);
}