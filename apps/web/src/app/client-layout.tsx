"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/toast";

export function ClientLayout({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
