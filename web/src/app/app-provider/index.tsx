import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { type ReactNode } from "react";

const queryClient = new QueryClient();

interface Props {
  children: ReactNode;
}

export const AppProvider = ({ children }: Props) => (
  <JotaiProvider>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </JotaiProvider>
);
